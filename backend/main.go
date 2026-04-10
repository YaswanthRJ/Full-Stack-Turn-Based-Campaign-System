package main

import (
	"backend/database"
	"backend/handler"
	"backend/repository"
	"backend/service"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres" // Add this
	_ "github.com/golang-migrate/migrate/v4/source/file"       // Add this
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Add this for the database/sql driver
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	//get database url, port number from env
	dsn := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")

	if dsn == "" || port == "" {
		log.Fatal("DATABASE_URL and PORT must be set")
	}

	//connect to db
	db, err := database.Connection(dsn)
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}
	defer db.Close()
	log.Printf("Database connection established")
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	//migration
	if os.Getenv("AUTO_MIGRATE") == "true" {
		if err := runMigrations(dsn); err != nil {
			log.Fatal("migration run failed", err)
		}
	}

	//repository, service, handler
	userRepo := repository.NewUserRepo(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserhandler(userService)

	//routes
	mux := http.NewServeMux()
	mux.HandleFunc("/user", userHandler.CreateUser)

	//start
	addr := fmt.Sprintf(":%s", port)
	log.Printf("server listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}

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
