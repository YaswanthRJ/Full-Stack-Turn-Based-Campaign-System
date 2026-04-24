package handler

import (
	"backend/service"
	"backend/utils"
	"encoding/json"
	"net/http"
)

type CreatureHandler struct {
	service service.CreatureService
}

func NewCreatureHandler(service service.CreatureService) *CreatureHandler {
	return &CreatureHandler{service: service}
}

func (h *CreatureHandler) CreateCreatureWithStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	var req CreatureRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	creature := service.CreateCreatureInput{
		Name:        req.Name,
		Description: req.Description,
		IsPlayable:  req.IsPlayable,
		MaxHP:       req.MaxHP,
		Attack:      req.Attack,
		Defence:     req.Defence,
		ActionPoint: req.ActionPoint,
	}
	if err := h.service.CreateCreatureWithStats(ctx, creature); err != nil {
		http.Error(w, "Creature creation failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "Creature created successfully",
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
