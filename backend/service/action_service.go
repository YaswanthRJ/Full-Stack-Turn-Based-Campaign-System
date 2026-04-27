package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"database/sql"
	"fmt"
)

type ActionService interface {
	CreateAction(ctx context.Context, action CreateActionInput) (domain.Action, error)
	GetAllActions(ctx context.Context) ([]domain.Action, error)
	GetActionDetails(ctx context.Context, actionID string) (domain.Action, error)
	UpdateAction(ctx context.Context, id string, input UpdateActionInput) (domain.Action, error)
	DeleteAction(ctx context.Context, actionID string) error
}

type actionService struct {
	db   *sql.DB
	repo repository.ActionRepository
}

func NewActionService(db *sql.DB, repo repository.ActionRepository) ActionService {
	return &actionService{db: db, repo: repo}
}

func (s *actionService) CreateAction(ctx context.Context, action CreateActionInput) (domain.Action, error) {
	newAction := domain.NewAction(
		action.Name,
		action.Description,
		action.IconUrl,
		action.Multiplier,
		action.Type,
		action.Tag,
		action.Accuracy,
		action.ActionWeight,
	)

	if err := s.repo.Create(ctx, s.db, newAction); err != nil {
		return domain.Action{}, err
	}

	return newAction, nil
}

func (s *actionService) UpdateAction(ctx context.Context, id string, input UpdateActionInput) (domain.Action, error) {
	action := domain.Action{
		ID:           id,
		Name:         input.Name,
		Description:  input.Description,
		IconUrl:      input.IconUrl,
		Type:         input.Type,
		Multiplier:   input.Multiplier,
		Tag:          input.Tag,
		Accuracy:     input.Accuracy,
		ActionWeight: input.ActionWeight,
	}

	if err := s.repo.Update(ctx, s.db, action); err != nil {
		return domain.Action{}, err
	}

	return action, nil
}

func (s *actionService) GetAllActions(ctx context.Context) ([]domain.Action, error) {
	actions, err := s.repo.GetAllActions(ctx, s.db)
	if err != nil {
		return nil, fmt.Errorf("GetAllActions: %w", err)
	}
	return actions, nil
}

func (s *actionService) GetActionDetails(ctx context.Context, actionID string) (domain.Action, error) {
	action, err := s.repo.GetActionDetails(ctx, s.db, actionID)
	if err != nil {
		return domain.Action{}, fmt.Errorf("GetActionDetails: %w", err)
	}
	return action, nil
}

func (s *actionService) DeleteAction(ctx context.Context, actionID string) error {
	if actionID == "" {
		return fmt.Errorf("invalid action id")
	}

	if err := s.repo.Delete(ctx, s.db, actionID); err != nil {
		return fmt.Errorf("delete action: %w", err)
	}

	return nil
}
