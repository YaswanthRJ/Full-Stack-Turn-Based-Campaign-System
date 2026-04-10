package handler

import (
	"backend/service"
	"backend/utils"
	"net/http"
)

type UserHandler struct {
	service service.UserService
}

func NewUserhandler(service service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	user, err := h.service.CreateUser(r.Context())
	if err != nil {
		http.Error(w, "Userid generation failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "user created successfully",
		"user_id": user.ID,
	})
}
