package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type CreatureService interface {
	CreateCreatureWithStats(ctx context.Context, input CreateCreatureInput) error
	AssignActionsToCreature(ctx context.Context, creatureId string, actionIds []string) error
	GetAllCreatures(ctx context.Context) ([]domain.Creature, error)
	GetCreatureDetails(ctx context.Context, creatureID string) (domain.CreatureDetails, error)
	UpdateCreatureStats(ctx context.Context, creatureID string, input UpdateCreatureStatInput) error
	DeleteCreature(ctx context.Context, creatureID string) error
	GetStats(ctx context.Context, creatureID string) (domain.CreatureStats, error)
	ValidateAction(ctx context.Context, creatureID string, actionID string) (bool, error)
	GetActions(ctx context.Context, creatureID string) ([]domain.Action, error)
}

type creatureService struct {
	db   *sql.DB
	repo repository.CreatureRepository
}

func NewCreatureService(db *sql.DB, repo repository.CreatureRepository) CreatureService {
	return &creatureService{db: db, repo: repo}
}

func (s *creatureService) CreateCreatureWithStats(ctx context.Context, creature CreateCreatureInput) (err error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	committed := false

	defer func() {
		if !committed {
			_ = tx.Rollback()
		}
	}()

	newcreature := domain.NewCreature(creature.Name, creature.Description, creature.IsPlayable)
	newCreatureStats := domain.NewCreatureStats(newcreature.ID, creature.MaxHP, creature.Attack, creature.Defence, creature.ActionPoint, creature.Speed)
	if err = s.repo.Create(ctx, tx, newcreature); err != nil {
		return fmt.Errorf("create creature: %w", err)
	}
	if err = s.repo.CreateStats(ctx, tx, newCreatureStats); err != nil {
		return fmt.Errorf("create creature stats: %w", err)
	}
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("commit transaction: %w", err)
	}
	return nil
}

func (s *creatureService) UpdateCreatureStats(ctx context.Context, creatureID string, input UpdateCreatureStatInput) error {
	creatureStats := domain.CreatureStats{
		CreatureID:  creatureID,
		MaxHP:       input.MaxHP,
		Attack:      input.Attack,
		Defence:     input.Defence,
		ActionPoint: input.ActionPoint,
	}

	if err := s.repo.UpdateCreatureStats(ctx, s.db, creatureStats); err != nil {
		return fmt.Errorf("update creature stats: %w", err)
	}

	return nil
}
func (s *creatureService) AssignActionsToCreature(ctx context.Context, creatureID string, actionIDs []string) error {
	if creatureID == "" {
		return errors.New("invalid creatureId")
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}
	committed := false
	defer func() {
		if !committed {
			_ = tx.Rollback()
		}
	}()
	if err := s.repo.AddActionsToCreature(ctx, tx, creatureID, actionIDs); err != nil {
		return fmt.Errorf("sync actions: %w", err)
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit: %w", err)
	}
	committed = true
	return nil
}

func (s *creatureService) GetAllCreatures(ctx context.Context) ([]domain.Creature, error) {
	creatures, err := s.repo.GetAllCreatures(ctx, s.db)
	if err != nil {
		return nil, fmt.Errorf("GetAllCreatures: %w", err)
	}
	return creatures, nil
}

func (s *creatureService) GetCreatureDetails(ctx context.Context, creatureID string) (domain.CreatureDetails, error) {
	creature, err := s.repo.GetCreatureDetails(ctx, s.db, creatureID)
	if err != nil {
		return domain.CreatureDetails{}, fmt.Errorf("GetActionDetails: %w", err)
	}
	return creature, nil
}

func (s *creatureService) DeleteCreature(ctx context.Context, creatureID string) error {
	if creatureID == "" {
		return fmt.Errorf("invalid creature id")
	}

	if err := s.repo.DeleteCreature(ctx, s.db, creatureID); err != nil {
		return fmt.Errorf("delete creature: %w", err)
	}

	return nil
}

func (s *creatureService) GetStats(ctx context.Context, creatureID string) (domain.CreatureStats, error) {
	if creatureID == "" {
		return domain.CreatureStats{}, fmt.Errorf("invalid creature id")
	}
	stats, err := s.repo.GetStats(ctx, s.db, creatureID)
	if err != nil {
		return domain.CreatureStats{}, fmt.Errorf("GetStats: %w", err)
	}
	return stats, nil
}

func (s *creatureService) ValidateAction(ctx context.Context, creatureID string, actionID string) (bool, error) {
	exists, err := s.repo.ValidateAction(ctx, s.db, creatureID, actionID)
	if err != nil {
		return false, fmt.Errorf("creatureService.ValidateAction: %w", err)
	}
	return exists, nil
}
func (s *creatureService) GetActions(ctx context.Context, creatureID string) ([]domain.Action, error) {
	if creatureID == "" {
		return nil, fmt.Errorf("invalid creature id")
	}

	actions, err := s.repo.GetActions(ctx, s.db, creatureID)
	if err != nil {
		return nil, fmt.Errorf("get actions: %w", err)
	}

	return actions, nil
}
