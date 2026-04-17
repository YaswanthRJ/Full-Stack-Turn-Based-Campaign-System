package handler

import (
	"backend/service"
	"backend/utils"
	"encoding/json"
	"net/http"
)

type ActionHandler struct {
	service service.ActionService
}

func NewActionHandler(service service.ActionService) *ActionHandler {
	return &ActionHandler{service: service}
}

func (h *ActionHandler) CreateAction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	var req ActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	action := service.CreateActionInput{
		Name:         req.Name,
		Description:  req.Description,
		Multiplier:   float64(req.Multiplier),
		Type:         req.Type,
		Tag:          req.Tag,
		Accuracy:     req.Accuracy,
		ActionWeight: req.ActionWeight,
	}
	if _, err := h.service.CreateAction(ctx, action); err != nil {
		http.Error(w, "Action creation failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "Action created successfully",
	})
}

func (h *ActionHandler) UpdateAction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	actionID := r.PathValue("id")
	if actionID == "" {
		http.Error(w, "missing action id", http.StatusBadRequest)
		return
	}
	var req ActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	input := service.UpdateActionInput{
		Name:         req.Name,
		Description:  req.Description,
		Type:         req.Type,
		Multiplier:   req.Multiplier,
		Tag:          req.Tag,
		Accuracy:     req.Accuracy,
		ActionWeight: req.ActionWeight,
	}
	updated, err := h.service.UpdateAction(ctx, actionID, input)
	if err != nil {
		http.Error(w, "action update failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, updated)
}

func (h *ActionHandler) GetAllActions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := r.Context()

	actions, err := h.service.GetAllActions(ctx)
	if err != nil {
		http.Error(w, "actions fetch failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, actions)
}

func (h *ActionHandler) GetActionDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	actionID := r.PathValue("id")
	if actionID == "" {
		http.Error(w, "missing action id", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	action, err := h.service.GetActionDetails(ctx, actionID)
	if err != nil {
		http.Error(w, "actions fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, action)
}

func (h *ActionHandler) DeleteAction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	actionID := r.PathValue("id")
	if actionID == "" {
		http.Error(w, "missing action id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	if err := h.service.DeleteAction(ctx, actionID); err != nil {
		http.Error(w, "action deletion failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "action deleted successfully",
	})
}
