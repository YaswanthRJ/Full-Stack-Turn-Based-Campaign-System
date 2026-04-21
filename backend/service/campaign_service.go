package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type CampaignService interface {
	CreateCampaignTemplate(ctx context.Context, input CreateCampaignTemplateInput) error
	AddCreaturesToCampaign(ctx context.Context, input AddCreaturesToCampaignInput) error
	AddStagesToCampaign(ctx context.Context, input AddStagesInput) error
	GetAllCampaigns(ctx context.Context) ([]domain.CampaignTemplate, error)
	GetCampaign(ctx context.Context, campaignID string) ([]domain.Campaign, error)
	UpdateStageCreature(ctx context.Context, campaignID string, input EditStageCreatureInput) error
	DeleteStage(ctx context.Context, campaignID string, stageIndex int) error
	DeleteCampaign(ctx context.Context, campaignID string) error
	StartCampaign(ctx context.Context, userID string, creatureId string, campaignId string) (*domain.Fight, error)
}

type campaignService struct {
	db              *sql.DB
	repo            repository.CampaignRepository
	creatureService CreatureService
	actionService   ActionService
	engineService   EngineService
}

func NewCampaignService(db *sql.DB, repo repository.CampaignRepository) CampaignService {
	return &campaignService{db: db, repo: repo}
}

func (s *campaignService) CreateCampaignTemplate(
	ctx context.Context,
	input CreateCampaignTemplateInput,
) error {

	if input.Name == "" {
		return errors.New("invalid campaign name")
	}
	if input.Description == "" {
		return errors.New("invalid campaign description")
	}

	template := domain.NewCampaignTemplate(input.Name, input.Description)

	if err := s.repo.Create(ctx, s.db, template); err != nil {
		return fmt.Errorf("create campaign template: %w", err)
	}

	return nil
}

func (s *campaignService) AddCreaturesToCampaign(
	ctx context.Context,
	input AddCreaturesToCampaignInput,
) error {

	if input.CampaignID == "" {
		return errors.New("invalid campaign id")
	}
	if len(input.CreatureIDs) == 0 {
		return errors.New("no creatures specified")
	}

	if err := s.repo.AddCreaturesToCampaign(
		ctx,
		s.db,
		input.CampaignID,
		input.CreatureIDs,
	); err != nil {
		return fmt.Errorf("add creatures to campaign: %w", err)
	}

	return nil
}

func (s *campaignService) AddStagesToCampaign(
	ctx context.Context,
	input AddStagesInput,
) error {

	if input.CampaignID == "" {
		return errors.New("invalid campaign id")
	}
	if len(input.Stages) == 0 {
		return errors.New("no stages specified")
	}

	stages := make([]domain.CampaignStage, len(input.Stages))
	for i, st := range input.Stages {
		stages[i] = domain.CampaignStage{
			StageIndex:      st.StageIndex,
			EnemyCreatureID: st.EnemyCreatureID,
		}
	}

	if err := s.repo.AddStagesToCampaign(
		ctx,
		s.db,
		input.CampaignID,
		stages,
	); err != nil {
		return fmt.Errorf("add stages to campaign: %w", err)
	}

	return nil
}

func (s *campaignService) GetAllCampaigns(ctx context.Context) ([]domain.CampaignTemplate, error) {
	campaigns, err := s.repo.GetAllCampaigns(ctx, s.db)
	if err != nil {
		return nil, fmt.Errorf("GetAllCreatures: %w", err)
	}
	return campaigns, nil
}

func (s *campaignService) GetCampaign(ctx context.Context, campaignID string) ([]domain.Campaign, error) {
	campaign, err := s.repo.GetCampaign(ctx, s.db, campaignID)
	if err != nil {
		return nil, fmt.Errorf("GetAllCreatures: %w", err)
	}
	return campaign, nil
}

func (s *campaignService) UpdateStageCreature(ctx context.Context, campaignID string, input EditStageCreatureInput) error {
	if input.StageIndex <= 0 {
		return fmt.Errorf("invalid stage index")
	}
	if input.EnemyCreatureID == "" {
		return fmt.Errorf("enemy creature id required")
	}

	updatedStage := domain.CampaignStage{
		StageIndex:      input.StageIndex,
		EnemyCreatureID: input.EnemyCreatureID,
	}

	if err := s.repo.UpdateStage(ctx, s.db, campaignID, updatedStage); err != nil {
		return fmt.Errorf("update stage creature: %w", err)
	}

	return nil
}

func (s *campaignService) DeleteStage(ctx context.Context, campaignID string, stageIndex int) error {
	if stageIndex <= 0 {
		return fmt.Errorf("invalid stage index")
	}
	if err := s.repo.DeleteStage(ctx, s.db, campaignID, stageIndex); err != nil {
		return fmt.Errorf("delete stage: %w", err)
	}
	return nil
}

func (s *campaignService) DeleteCampaign(ctx context.Context, campaignID string) error {
	if campaignID == "" {
		return fmt.Errorf("invalid campaign id")
	}

	if err := s.repo.DeleteCampaign(ctx, s.db, campaignID); err != nil {
		return fmt.Errorf("delete campaign: %w", err)
	}

	return nil
}

func (s *campaignService) StartCampaign(ctx context.Context, userID string, creatureId string, campaignId string) (*domain.Fight, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// Validate campaign
	if err = s.repo.ValidateId(ctx, tx, campaignId); err != nil {
		return nil, fmt.Errorf("invalid campaign id: %w", err)
	}

	// Validate creature in campaign
	if err = s.repo.ValidateCreature(ctx, tx, campaignId, creatureId); err != nil {
		return nil, fmt.Errorf("invalid creature id: %w", err)
	}

	// Get player stats
	playerStats, err := s.creatureService.GetStats(ctx, creatureId)
	if err != nil {
		return nil, fmt.Errorf("get player stats: %w", err)
	}

	// Create session
	sessionInput := domain.CreateCampaignSessionInput{
		UserID:             userID,
		CampaignTemplateID: campaignId,
		PlayerCreatureID:   creatureId,
		MaxHP:              playerStats.MaxHP,
		MaxActionPoint:     playerStats.ActionPoint,
	}
	session := domain.NewCampaignSession(sessionInput)

	if err = s.repo.NewCampaignSession(ctx, tx, &session); err != nil {
		return nil, fmt.Errorf("create session: %w", err)
	}

	// Create first fight
	fight, err := s.createFight(ctx, tx, &session)
	if err != nil {
		return nil, err
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit transaction: %w", err)
	}

	return fight, nil

}

func (s *campaignService) ResolveRound(ctx context.Context, userID string, fightID string, actionID string) (*domain.Fight, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// VALIDATE

	// 1. Fetch and validate fight
	currentFight, err := s.repo.GetFight(ctx, tx, fightID)
	if err != nil {
		return nil, fmt.Errorf("get fight: %w", err)
	}

	if currentFight.Status != domain.FightStatusActive {
		return nil, fmt.Errorf("fight not active: status is %s", currentFight.Status)
	}

	if currentFight.UserID != userID {
		return nil, fmt.Errorf("user %s does not own this fight", userID)
	}

	// 2. Fetch session
	currentSession, err := s.repo.GetSession(ctx, tx, currentFight.CampaignSessionID)
	if err != nil {
		return nil, fmt.Errorf("get session: %w", err)
	}

	// 3. Validate action belongs to player's creature
	playerCreatureID := currentSession.PlayerCreatureID
	valid, err := s.creatureService.ValidateAction(ctx, playerCreatureID, actionID)
	if err != nil {
		return nil, fmt.Errorf("validate action: %w", err)
	}
	if !valid {
		return nil, fmt.Errorf("action %s not available for creature %s", actionID, playerCreatureID)
	}

	// 4. Get action details
	playerAction, err := s.actionService.GetActionDetails(ctx, actionID)
	if err != nil {
		return nil, fmt.Errorf("get action details: %w", err)
	}

	// 5. Check action point cost
	if playerAction.ActionWeight > float64(currentFight.PlayerCurrentActionPoint) {
		return nil, fmt.Errorf("insufficient action points: need %.1f, have %d",
			playerAction.ActionWeight, currentFight.PlayerCurrentActionPoint)
	}

	// ENEMY ACTION SELECTION
	enemyActions, err := s.creatureService.GetActions(ctx, currentFight.EnemyCreatureID)
	if err != nil {
		return nil, fmt.Errorf("Enemy actions list: %w", err)
	}
	enemyStats, err := s.creatureService.GetStats(ctx, currentFight.EnemyCreatureID)
	if err != nil {
		return nil, fmt.Errorf("Enemy stats: %w", err)
	}
	enemyActionInput := EnemyActionInput{
		AvailableActions: enemyActions,
		EnemyCurrentAP:   currentFight.EnemyCurrentActionPoint,
		EnemyMaxAP:       currentFight.EnemyMaxActionPoint,
		EnemyAttack:      enemyStats.Attack,
		EnemyDefence:     enemyStats.Defence,
		PlayerCurrentHP:  currentFight.PlayerCurrentHP,
		PlayerMaxHP:      currentFight.PlayerMaxHP,
		PlayerCurrentAP:  currentFight.PlayerCurrentActionPoint,
		PlayerMaxAP:      currentFight.PlayerMaxActionPoint,
		EnemyCurrentHP:   currentFight.EnemyCurrentHP,
		EnemyMaxHP:       currentFight.EnemyMaxHP,
	}
	enemyActionId, err := s.engineService.ResolveEnemyAction(enemyActionInput)
	if err != nil {
		return nil, fmt.Errorf("get enemy action details: %w", err)
	}
	// CALCULATE DAMAGE FOR BOTH
	// check if they hit

	return nil, nil
}

// HELPERS

func (s *campaignService) createFight(ctx context.Context, tx *sql.Tx, session *domain.CampaignSession) (*domain.Fight, error) {
	enemyID, err := s.repo.GetEnemy(ctx, tx, session.CampaignTemplateID, session.CurrentStageIndex)
	if err != nil {
		return nil, fmt.Errorf("get enemy: %w", err)
	}
	enemyStats, err := s.creatureService.GetStats(ctx, enemyID)
	if err != nil {
		return nil, fmt.Errorf("get enemy stats: %w", err)
	}
	fightInput := domain.CreateFightInput{
		CampaignSessionID:        session.ID,
		UserID:                   session.UserID,
		PlayerCurrentHP:          session.CurrentHP,
		PlayerMaxHP:              session.MaxHP,
		PlayerCurrentActionPoint: session.CurrentActionPoint,
		PlayerMaxActionPoint:     session.MaxActionPoint,
		EnemyCreatureID:          enemyID,
		EnemyMaxHP:               enemyStats.MaxHP,
		EnemyMaxActionPoint:      enemyStats.ActionPoint,
	}
	fight := domain.NewFight(fightInput)
	if err := s.repo.NewFight(ctx, tx, &fight); err != nil {
		return nil, fmt.Errorf("create fight: %w", err)
	}
	return &fight, nil
}
