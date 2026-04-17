package handler

import (
	"backend/service"
	"backend/utils"
	"net/http"
)

type StatsHandler struct {
	service service.StatsService
}

func NewStatshandler(service service.StatsService) *StatsHandler {
	return &StatsHandler{service: service}
}

func (h *StatsHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	stats, err := h.service.GetStats(ctx)
	if err != nil {
		http.Error(w, "Stats fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, stats)
}
