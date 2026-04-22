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
	ResolveRound(ctx context.Context, userID string, fightID string, actionID string) (*ResolveRoundResult, error)
	StartNextFight(ctx context.Context, userID string, sessionID string) (*domain.Fight, error)
	GetActiveUserSession(ctx context.Context, userID string) (*UserSessionResult, error)
}

type campaignService struct {
	db              *sql.DB
	repo            repository.CampaignRepository
	creatureService CreatureService
	actionService   ActionService
	engineService   EngineService
}

func NewCampaignService(
	db *sql.DB,
	repo repository.CampaignRepository,
	creatureService CreatureService,
	actionService ActionService,
	engineService EngineService,
) CampaignService {
	return &campaignService{
		db:              db,
		repo:            repo,
		creatureService: creatureService,
		actionService:   actionService,
		engineService:   engineService,
	}
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

func (s *campaignService) ResolveRound(
	ctx context.Context,
	userID string,
	fightID string,
	actionID string,
) (*ResolveRoundResult, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// Validation

	currentFight, err := s.repo.GetFight(ctx, tx, fightID)
	if err != nil {
		return nil, fmt.Errorf("get fight: %w", err)
	}

	if currentFight.Status != domain.FightStatusActive {
		return nil, fmt.Errorf("fight not active")
	}

	if currentFight.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}

	currentSession, err := s.repo.GetSession(ctx, tx, currentFight.CampaignSessionID)
	if err != nil {
		return nil, fmt.Errorf("get session: %w", err)
	}

	playerCreatureID := currentSession.PlayerCreatureID

	valid, err := s.creatureService.ValidateAction(ctx, playerCreatureID, actionID)
	if err != nil {
		return nil, fmt.Errorf("validate action: %w", err)
	}
	if !valid {
		return nil, fmt.Errorf("invalid action")
	}

	playerAction, err := s.actionService.GetActionDetails(ctx, actionID)
	if err != nil {
		return nil, fmt.Errorf("player action: %w", err)
	}

	if playerAction.ActionWeight > float64(currentFight.PlayerCurrentActionPoint) {
		return nil, fmt.Errorf("insufficient AP")
	}

	// Fetch Stats

	playerStats, err := s.creatureService.GetStats(ctx, playerCreatureID)
	if err != nil {
		return nil, fmt.Errorf("player stats: %w", err)
	}

	enemyStats, err := s.creatureService.GetStats(ctx, currentFight.EnemyCreatureID)
	if err != nil {
		return nil, fmt.Errorf("enemy stats: %w", err)
	}

	enemyActions, err := s.creatureService.GetActions(ctx, currentFight.EnemyCreatureID)
	if err != nil {
		return nil, fmt.Errorf("enemy actions: %w", err)
	}

	enemyActionID, err := s.engineService.ResolveEnemyAction(EnemyActionInput{
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
	})

	// Resolve Player And Enemy Actions

	playerResolved, err := s.resolveAction(playerAction, playerStats.Attack)
	if err != nil {
		return nil, fmt.Errorf("resolve player action: %w", err)
	}

	// Enemy passes if no affordable actions
	var enemyAction *domain.Action
	enemyResolved := ResolvedAction{}
	if enemyActionID != "" {
		ea, err := s.actionService.GetActionDetails(ctx, enemyActionID)
		if err != nil {
			return nil, fmt.Errorf("enemy action details: %w", err)
		}
		enemyAction = &ea
		enemyResolved, err = s.resolveAction(ea, enemyStats.Attack)
		if err != nil {
			return nil, fmt.Errorf("resolve enemy action: %w", err)
		}
	}

	// Turn order

	playerFirst := s.engineService.ResolveTurnOrder(
		playerStats.Speed,
		enemyStats.Speed,
	)

	// Calculate damage

	playerDamage := 0
	if playerResolved.isOffensive && playerResolved.hit {
		playerDamage = s.applyDamage(playerResolved.raw, enemyStats.Defence, enemyResolved.block)
	}

	enemyDamage := 0
	if enemyResolved.isOffensive && enemyResolved.hit {
		enemyDamage = s.applyDamage(enemyResolved.raw, playerStats.Defence, playerResolved.block)
	}

	playerHP := currentFight.PlayerCurrentHP
	enemyHP := currentFight.EnemyCurrentHP

	if playerFirst {
		enemyHP -= playerDamage
		if enemyHP > 0 {
			playerHP -= enemyDamage
		}
	} else {
		playerHP -= enemyDamage
		if playerHP > 0 {
			enemyHP -= playerDamage
		}
	}

	playerHP = s.engineService.ClampHP(playerHP)
	enemyHP = s.engineService.ClampHP(enemyHP)

	// Update fight state

	currentFight.PlayerCurrentHP = playerHP
	currentFight.EnemyCurrentHP = enemyHP
	currentFight.PlayerCurrentActionPoint = s.applyAPChange(
		currentFight.PlayerCurrentActionPoint,
		currentFight.PlayerMaxActionPoint,
		int(playerAction.ActionWeight),
		playerAction.Type == ActionDefensive,
	)
	if enemyAction != nil {
		currentFight.EnemyCurrentActionPoint = s.applyAPChange(
			currentFight.EnemyCurrentActionPoint,
			currentFight.EnemyMaxActionPoint,
			int(enemyAction.ActionWeight),
			enemyAction.Type == ActionDefensive,
		)
	}
	currentFight.RoundNumber++

	if playerHP == 0 {
		currentFight.Status = domain.FightStatusPlayerLost
	}
	if enemyHP == 0 && currentFight.Status != domain.FightStatusPlayerLost {
		currentFight.Status = domain.FightStatusPlayerWon
	}

	if err = s.repo.UpdateFight(ctx, tx, currentFight); err != nil {
		return nil, fmt.Errorf("update fight: %w", err)
	}

	// Handle fight outcome on session

	sessionCompleted := false

	if currentFight.Status == domain.FightStatusPlayerLost {
		currentSession.Status = domain.SessionStatusLost
		if err = s.repo.UpdateSession(ctx, tx, currentSession); err != nil {
			return nil, fmt.Errorf("update session: %w", err)
		}
	}

	if currentFight.Status == domain.FightStatusPlayerWon {
		currentSession.CurrentHP = playerHP
		currentSession.CurrentActionPoint = currentFight.PlayerCurrentActionPoint
		currentSession.CurrentStageIndex++

		stageCount, err := s.repo.GetStageCount(ctx, tx, currentSession.CampaignTemplateID)
		if err != nil {
			return nil, fmt.Errorf("get stage count: %w", err)
		}

		if currentSession.CurrentStageIndex >= stageCount {
			currentSession.Status = domain.SessionStatusCompleted
			sessionCompleted = true
		}

		if err = s.repo.UpdateSession(ctx, tx, currentSession); err != nil {
			return nil, fmt.Errorf("update session: %w", err)
		}
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit transaction: %w", err)
	}

	return &ResolveRoundResult{
		Fight:                    currentFight,
		CampaignSessionCompleted: sessionCompleted,
	}, nil
}

func (s *campaignService) StartNextFight(ctx context.Context, userID string, sessionID string) (*domain.Fight, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()
	currentSession, err := s.repo.GetSession(ctx, tx, sessionID)
	if err != nil {
		return nil, err
	}
	if currentSession.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}
	if currentSession.Status != domain.SessionStatusActive {
		return nil, fmt.Errorf("session is not active")
	}

	// Guard against duplicate fights for the same stage
	existing, err := s.repo.GetActiveFight(ctx, tx, sessionID)
	if err != nil {
		return nil, fmt.Errorf("check active fight: %w", err)
	}
	if existing != nil {
		return nil, fmt.Errorf("fight already active for this stage")
	}

	nextEnemyID, err := s.repo.GetEnemy(ctx, tx, currentSession.CampaignTemplateID, currentSession.CurrentStageIndex)
	if err != nil {
		return nil, fmt.Errorf("get enemy: %w", err)
	}

	enemyStats, err := s.creatureService.GetStats(ctx, nextEnemyID)
	if err != nil {
		return nil, fmt.Errorf("enemy stats: %w", err)
	}

	newFight := domain.NewFight(domain.CreateFightInput{
		CampaignSessionID:        sessionID,
		UserID:                   userID,
		PlayerCurrentHP:          currentSession.CurrentHP,
		PlayerMaxHP:              currentSession.MaxHP,
		PlayerCurrentActionPoint: currentSession.CurrentActionPoint,
		PlayerMaxActionPoint:     currentSession.MaxActionPoint,
		EnemyCreatureID:          nextEnemyID,
		EnemyMaxHP:               enemyStats.MaxHP,
		EnemyMaxActionPoint:      enemyStats.ActionPoint,
	})

	if err = s.repo.NewFight(ctx, tx, &newFight); err != nil {
		return nil, fmt.Errorf("create fight: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit: %w", err)
	}

	return &newFight, nil
}

func (s *campaignService) GetActiveUserSession(ctx context.Context, userID string) (*UserSessionResult, error) {

	session, err := s.repo.GetActiveUserSession(ctx, s.db, userID)
	if err != nil {
		return nil, err
	}
	if session == nil {
		return &UserSessionResult{}, nil
	}

	result := &UserSessionResult{
		CurrentSession: session,
	}

	fight, err := s.repo.GetActiveFight(ctx, s.db, session.ID)
	if err != nil {
		return nil, err
	}

	if fight != nil {
		result.CurrentFight = fight
	}

	return result, nil
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

func (s *campaignService) resolveAction(action domain.Action, sourceAttack int) (ResolvedAction, error) {
	hit, err := s.engineService.RollAccuracy(AccuracyInput{
		Accuracy: action.Accuracy,
	})
	if err != nil {
		return ResolvedAction{}, fmt.Errorf("roll accuracy: %w", err)
	}

	raw := 0
	if action.Type == ActionOffensive && hit {
		raw, err = s.engineService.EstimateDamage(EstimateDamageInput{
			SourceAttack:     sourceAttack,
			ActionMultiplier: action.Multiplier,
		})
		if err != nil {
			return ResolvedAction{}, fmt.Errorf("estimate damage: %w", err)
		}
	}

	block := 0.0
	if action.Type == ActionDefensive {
		block = action.Multiplier
	}

	return ResolvedAction{
		isOffensive: action.Type == ActionOffensive,
		raw:         raw,
		hit:         hit,
		block:       block,
	}, nil
}

func (s *campaignService) applyDamage(
	raw int,
	defenderDef int,
	block float64,
) int {
	final, err := s.engineService.EstimateFinalDamage(EstimateFinalDamageInput{
		RawAttack:         raw,
		CreatureDefense:   defenderDef,
		DefenceMultiplier: block,
	})
	if err != nil {
		return 0
	}
	return final
}

func (s *campaignService) applyAPChange(
	currentAP int,
	maxAP int,
	actionWeight int,
	isDefensive bool,
) int {

	// spend
	currentAP -= actionWeight

	// regen %
	regenPercent := 20
	if isDefensive {
		regenPercent = regenPercent / 2
	}

	regen := (maxAP * regenPercent) / 100
	currentAP += regen

	// clamp lower
	if currentAP < 0 {
		currentAP = 0
	}

	// clamp upper
	if currentAP > maxAP {
		currentAP = maxAP
	}

	return currentAP
}
