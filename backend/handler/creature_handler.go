package handler

import (
	"backend/imageservice"
	"backend/service"
	"backend/utils"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

type CreatureHandler struct {
	service      service.CreatureService
	imageService imageservice.ImageService
}

func NewCreatureHandler(service service.CreatureService, imageService imageservice.ImageService) *CreatureHandler {
	return &CreatureHandler{service: service, imageService: imageService}
}

func (h *CreatureHandler) CreateCreatureWithStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := r.Context()

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "invalid multipart form", http.StatusBadRequest)
		return
	}

	// Validate text fields first
	name := strings.TrimSpace(r.FormValue("name"))
	description := strings.TrimSpace(r.FormValue("description"))

	if name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}

	// Validate numeric fields BEFORE uploading image
	maxHP, err := parseRequiredInt(r.FormValue("max_hp"), "max_hp")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	attack, err := parseRequiredInt(r.FormValue("attack"), "attack")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	defence, err := parseRequiredInt(r.FormValue("defence"), "defence")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	actionPoint, err := parseRequiredInt(r.FormValue("action_point"), "action_point")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	speed, err := parseRequiredInt(r.FormValue("speed"), "speed")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Only now process image upload
	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "image is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	imageBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "failed to read image", http.StatusInternalServerError)
		return
	}

	requestedPublicID := fmt.Sprintf("creatures/%s", uuid.NewString())

	uploaded, err := h.imageService.UploadImageBytes(ctx, imageBytes, requestedPublicID)
	if err != nil {
		http.Error(w, "image upload failed", http.StatusInternalServerError)
		return
	}

	creature := service.CreateCreatureInput{
		Name:          name,
		Description:   description,
		ImageUrl:      uploaded.SecureURL,
		ImagePublicID: uploaded.PublicID,
		IsPlayable:    r.FormValue("is_playable") == "true",
		MaxHP:         maxHP,
		Attack:        attack,
		Defence:       defence,
		ActionPoint:   actionPoint,
		Speed:         speed,
	}

	if err := h.service.CreateCreatureWithStats(ctx, creature); err != nil {
		_ = h.imageService.DeleteImage(ctx, uploaded.PublicID)
		fmt.Println(err)
		http.Error(w, "creature creation failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]any{
		"message": "Creature created successfully",
		"creature": map[string]any{
			"name":          creature.Name,
			"imageUrl":      uploaded.SecureURL,
			"imagePublicID": uploaded.PublicID,
		},
	})
}

func (h *CreatureHandler) AssignActionsToCreature(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	creatureID := r.PathValue("id")
	if creatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}
	var req CreatureActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := h.service.AssignActionsToCreature(ctx, creatureID, req.ActionIDs); err != nil {
		http.Error(w, "Action assigning failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "Action assigning successfull",
	})
}

func (h *CreatureHandler) GetAllCreatures(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	creatures, err := h.service.GetAllCreatures(ctx)
	if err != nil {
		http.Error(w, "creatures fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"data": creatures,
	})
}

func (h *CreatureHandler) GetCreaturesDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	creatureID := r.PathValue("id")
	if creatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	creature, err := h.service.GetCreatureDetails(ctx, creatureID)
	if err != nil {
		http.Error(w, "creature fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, creature)
}

func (h *CreatureHandler) UpdateCreatureStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	creatureID := r.PathValue("id")
	if creatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	var req UpdateStatsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	creatureStats := service.UpdateCreatureStatInput{
		MaxHP:       req.MaxHP,
		Attack:      req.Attack,
		Defence:     req.Defence,
		ActionPoint: req.ActionPoint,
	}
	if err := h.service.UpdateCreatureStats(ctx, creatureID, creatureStats); err != nil {
		http.Error(w, "Creature stat update failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Creature stat updated successfully",
	})
}

func (h *CreatureHandler) DeleteCreature(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	creatureID := r.PathValue("id")
	if creatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	if err := h.service.DeleteCreature(ctx, creatureID); err != nil {
		http.Error(w, "creature deletion failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "creature deleted successfully",
	})
}

func (h *CreatureHandler) GetActions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	creatureID := r.PathValue("id")
	if creatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	creature, err := h.service.GetActions(ctx, creatureID)
	if err != nil {
		http.Error(w, "action fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, creature)
}

func parseRequiredInt(val string, field string) (int, error) {
	n, err := strconv.Atoi(strings.TrimSpace(val))
	if err != nil {
		return 0, fmt.Errorf("%s must be a valid integer", field)
	}
	return n, nil
}
