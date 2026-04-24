package handler

import (
	"backend/service"
	"backend/utils"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type CampaignHandler struct {
	service service.CampaignService
}

func NewCampaignHandler(service service.CampaignService) *CampaignHandler {
	return &CampaignHandler{service: service}
}

func (h *CampaignHandler) CreateCampaignTemplate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	var req CreateCampaignTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	input := service.CreateCampaignTemplateInput{
		Name:        req.Name,
		Description: req.Description,
	}
	if err := h.service.CreateCampaignTemplate(ctx, input); err != nil {
		http.Error(w, "campaign creation failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "campaign created successfully",
	})
}

func (h *CampaignHandler) AddCreaturesToCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	campaignID := r.PathValue("id")
	ctx := r.Context()
	var req AddCampaignCreaturesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	input := service.AddCreaturesToCampaignInput{
		CampaignID:  campaignID,
		CreatureIDs: req.CreatureIDs,
	}
	if err := h.service.AddCreaturesToCampaign(ctx, input); err != nil {
		http.Error(w, "campaign creature assignment failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "campaign creature assignment successful",
	})
}

func (h *CampaignHandler) AddStagesToCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}
	var req AddCampaignStagesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	stages := make([]service.CampaignStageInput, len(req.Stages))
	for i, s := range req.Stages {
		stages[i] = service.CampaignStageInput{
			StageIndex:      s.StageIndex,
			EnemyCreatureID: s.EnemyCreatureID,
		}
	}
	input := service.AddStagesInput{
		CampaignID: campaignID,
		Stages:     stages,
	}
	if err := h.service.AddStagesToCampaign(ctx, input); err != nil {
		http.Error(w, "campaign stage assignment failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{
		"message": "campaign stages added successfully",
	})
}

func (h *CampaignHandler) GetAllCampaigns(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	campaigns, err := h.service.GetAllCampaigns(ctx)
	if err != nil {
		http.Error(w, "campaign fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, campaigns)
}

func (h *CampaignHandler) GetCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	campaign, err := h.service.GetCampaign(ctx, campaignID)
	if err != nil {
		http.Error(w, "campaign fetch failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, campaign)
}

func (h *CampaignHandler) UpdateStageCreature(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}

	stageIndexStr := r.PathValue("stageIndex")
	stageIndex, err := strconv.Atoi(stageIndexStr)
	if err != nil {
		http.Error(w, "invalid stage index", http.StatusBadRequest)
		return
	}

	defer r.Body.Close()

	var req updateStageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.EnemyCreatureID == "" {
		http.Error(w, "enemyCreatureId is required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	err = h.service.UpdateStageCreature(ctx, campaignID, service.EditStageCreatureInput{
		StageIndex:      stageIndex,
		EnemyCreatureID: req.EnemyCreatureID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "stage updated successfully",
	})
}

func (h *CampaignHandler) DeleteStage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	campaignID := r.PathValue("id")
	stageIndexStr := r.PathValue("stageIndex")

	if campaignID == "" || stageIndexStr == "" {
		http.Error(w, "missing params", http.StatusBadRequest)
		return
	}

	stageIndex, err := strconv.Atoi(stageIndexStr)
	if err != nil {
		http.Error(w, "invalid stage index", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	if err := h.service.DeleteStage(ctx, campaignID, stageIndex); err != nil {
		http.Error(w, "stage deletion failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "stage deleted successfully",
	})
}

func (h *CampaignHandler) DeleteCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	if err := h.service.DeleteCampaign(ctx, campaignID); err != nil {
		http.Error(w, "campaign deletion failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "campaign deleted successfully",
	})
}

func (h *CampaignHandler) StartCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	userID, ok := utils.GetUserID(ctx)
	if !ok {
		http.Error(w, "missing user id", http.StatusUnauthorized)
		return
	}
	var req StartCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.EnemyCreatureID == "" {
		http.Error(w, "missing creature id", http.StatusBadRequest)
		return
	}

	fight, err := h.service.StartCampaign(ctx, userID, req.EnemyCreatureID, campaignID)
	if err != nil {
		log.Printf("StartCampaign failed: %v", err)
		http.Error(w, "campaign creation failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]interface{}{
		"message":    "campaign started successfully",
		"session_id": fight.CampaignSessionID,
		"fight":      fight,
	})
}

func (h *CampaignHandler) StartNextFight(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sessionID := r.PathValue("sessionId")
	if sessionID == "" {
		http.Error(w, "missing session id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	userID, ok := utils.GetUserID(ctx)
	if !ok {
		http.Error(w, "missing user id", http.StatusUnauthorized)
		return
	}

	fight, err := h.service.StartNextFight(ctx, userID, sessionID)
	if err != nil {
		log.Printf("StartNextFight failed: %v", err)
		http.Error(w, "failed to start next fight", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]interface{}{
		"fight": fight,
	})
}

func (h *CampaignHandler) ResolveRound(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fightID := r.PathValue("fightId")
	if fightID == "" {
		http.Error(w, "missing fight id", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	userID, ok := utils.GetUserID(ctx)
	if !ok {
		http.Error(w, "missing user id", http.StatusUnauthorized)
		return
	}

	var req ResolveRoundRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.ActionID == "" {
		http.Error(w, "missing action id", http.StatusBadRequest)
		return
	}
	if req.ActionID != service.NoAction && len(req.ActionID) != 36 {
		http.Error(w, "invalid action id", http.StatusBadRequest)
		return
	}

	result, err := h.service.ResolveRound(ctx, userID, fightID, req.ActionID)
	if err != nil {
		log.Printf("ResolveRound failed: %v", err)
		http.Error(w, "round resolution failed", http.StatusInternalServerError)
		return
	}

	utils.WriteJSON(w, http.StatusOK, result)
}

func (h *CampaignHandler) GetActiveUserSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	userID, ok := utils.GetUserID(ctx)
	if !ok {
		http.Error(w, "missing user id", http.StatusUnauthorized)
		return
	}
	result, err := h.service.GetActiveUserSession(ctx, userID)
	if err != nil {
		log.Printf("GetActiveUserSession failed: %v", err)
		http.Error(w, "Session checking failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, result)
}

func (h *CampaignHandler) GetCreatures(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := r.Context()
	campaignID := r.PathValue("id")
	if campaignID == "" {
		http.Error(w, "missing campaign id", http.StatusBadRequest)
		return
	}
	result, err := h.service.GetCreatures(ctx, campaignID)
	if err != nil {
		log.Printf("GetCreatures failed: %v", err)
		http.Error(w, "GetCreatures failed", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, result)
}
