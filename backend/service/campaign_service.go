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
}

type campaignService struct {
	db   *sql.DB
	repo repository.CampaignRepository
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
