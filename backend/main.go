package main

import (
	"backend/database"
	"backend/handler"
	"backend/imageservice"
	"backend/repository"
	"backend/service"
	"backend/utils"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")

	if dsn == "" || port == "" {
		log.Fatal("DATABASE_URL and PORT must be set")
	}

	db, err := database.Connection(dsn)
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}
	defer db.Close()

	log.Printf("Database connection established")

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	if os.Getenv("AUTO_MIGRATE") == "true" {
		if err := runMigrations(dsn); err != nil {
			log.Fatal("migration run failed", err)
		}
	}

	// repositories, services, handlers
	userRepo := repository.NewUserRepo()
	actionRepo := repository.NewActionRepo()
	creatureRepo := repository.NewCreatureRepo()
	campaignRepo := repository.NewCampaignRepo()

	userService := service.NewUserService(userRepo, db)
	actionService := service.NewActionService(db, actionRepo)
	creatureService := service.NewCreatureService(db, creatureRepo)
	engineService := service.NewEngineService()
	campaignService := service.NewCampaignService(db, campaignRepo, creatureService, actionService, engineService, userService)
	statsService := service.NewStatsService(userRepo, actionRepo, creatureRepo, campaignRepo, db)
	imageService, err := imageservice.NewCloudinaryService()
	if err != nil {
		log.Fatalf("failed to initialize cloudinary: %v", err)
	}

	userHandler := handler.NewUserhandler(userService)
	actionHandler := handler.NewActionHandler(actionService)
	creatureHandler := handler.NewCreatureHandler(creatureService, imageService)
	campaignHandler := handler.NewCampaignHandler(campaignService)
	statsHandler := handler.NewStatshandler(statsService)

	// router
	mux := http.NewServeMux()

	registerGameRoutes(mux, userHandler, campaignHandler, creatureHandler)
	registerAdminRoutes(mux, actionHandler, creatureHandler, campaignHandler, statsHandler)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("server listening on %s", addr)

	if err := http.ListenAndServe(addr, corsMiddleware(mux)); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func registerGameRoutes(mux *http.ServeMux, userHandler *handler.UserHandler, campaignHandler *handler.CampaignHandler, creaturehandler *handler.CreatureHandler) {
	gameMux := http.NewServeMux()

	registerSharedCampaignRoutes(gameMux, campaignHandler, creaturehandler)

	gameMux.HandleFunc("GET /user", userHandler.CreateUser)
	gameMux.HandleFunc("POST /user/register", userHandler.Register)
	gameMux.HandleFunc("POST /user/signin", userHandler.Login)
	gameMux.HandleFunc("GET /user/auth", userHandler.CheckAuth)
	gameMux.HandleFunc("GET /user/stats", userHandler.GetStats)

	gameMux.HandleFunc("GET /campaign/session", campaignHandler.GetActiveUserSession)
	gameMux.HandleFunc("GET /campaign/{id}/creatures", campaignHandler.GetCreatures)
	gameMux.HandleFunc("POST /campaign/{id}/start", campaignHandler.StartCampaign)
	gameMux.HandleFunc("POST /campaign/fight/{fightId}/round", campaignHandler.ResolveRound)
	gameMux.HandleFunc("POST /campaign/session/{sessionId}/next", campaignHandler.StartNextFight)
	gameMux.HandleFunc("GET /campaign/session/{sessionId}/success", campaignHandler.GetCampaignOutro)

	mux.Handle("/game/", http.StripPrefix("/game", utils.GameMiddlewareMux(gameMux)))
}

func registerAdminRoutes(
	mux *http.ServeMux,
	actionHandler *handler.ActionHandler,
	creatureHandler *handler.CreatureHandler,
	campaignHandler *handler.CampaignHandler,
	statsHandler *handler.StatsHandler,
) {
	registerSharedCampaignRoutes(mux, campaignHandler, creatureHandler)

	// stats route
	mux.HandleFunc("GET /stats", statsHandler.GetStats)

	// action routes
	mux.HandleFunc("POST /actions", actionHandler.CreateAction)
	mux.HandleFunc("GET /actions", actionHandler.GetAllActions)
	mux.HandleFunc("GET /actions/{id}", actionHandler.GetActionDetails)
	mux.HandleFunc("PUT /actions/{id}", actionHandler.UpdateAction)
	mux.HandleFunc("DELETE /actions/{id}", actionHandler.DeleteAction)

	// creature routes
	mux.HandleFunc("POST /creatures", creatureHandler.CreateCreatureWithStats)
	mux.HandleFunc("GET /creatures", creatureHandler.GetAllCreatures)
	mux.HandleFunc("POST /creatures/{id}/actions", creatureHandler.AssignActionsToCreature)
	mux.HandleFunc("PUT /creatures/{id}/stats", creatureHandler.UpdateCreatureStats)
	mux.HandleFunc("DELETE /creatures/{id}", creatureHandler.DeleteCreature)

	// campaign routes
	mux.HandleFunc("POST /campaigns", campaignHandler.CreateCampaignTemplate)
	mux.HandleFunc("DELETE /campaigns/{id}", campaignHandler.DeleteCampaign)

	mux.HandleFunc("POST /campaigns/{id}/creatures", campaignHandler.AddCreaturesToCampaign)
	mux.HandleFunc("POST /campaigns/{id}/stages", campaignHandler.AddStagesToCampaign)
	mux.HandleFunc("PUT /campaigns/{id}/stages/{stageIndex}", campaignHandler.UpdateStageCreature)
	mux.HandleFunc("DELETE /campaigns/{id}/stages/{stageIndex}", campaignHandler.DeleteStage)

}

func registerSharedCampaignRoutes(mux *http.ServeMux, campaignHandler *handler.CampaignHandler, creatureHandler *handler.CreatureHandler) {
	mux.HandleFunc("GET /campaigns", campaignHandler.GetAllCampaigns)
	mux.HandleFunc("GET /campaigns/{id}", campaignHandler.GetCampaign)
	mux.HandleFunc("GET /creatures/{id}/action", creatureHandler.GetActions)
	mux.HandleFunc("GET /creatures/{id}", creatureHandler.GetCreaturesDetails)
}

func runMigrations(dsn string) error {
	m, err := migrate.New("file://migrations", dsn)
	if err != nil {
		return fmt.Errorf("migrate.New: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("m.Up: %w", err)
	}

	log.Println("migrations applied")
	return nil
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-ID")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
