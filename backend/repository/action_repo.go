package repository

import (
	"backend/domain"
	"context"
	"database/sql"
	"fmt"
)

type ActionRepository interface {
	Create(ctx context.Context, db DBTX, action domain.Action) error
	GetAllActions(ctx context.Context, db DBTX) ([]domain.Action, error)
	GetActionDetails(ctx context.Context, db DBTX, actionID string) (domain.Action, error)
	Update(ctx context.Context, db DBTX, action domain.Action) error
	Delete(ctx context.Context, db DBTX, actionID string) error
	Count(ctx context.Context, db DBTX) (int, error)
}

type actionRepo struct{}

func NewActionRepo() ActionRepository {
	return &actionRepo{}
}

func (r *actionRepo) Create(ctx context.Context, db DBTX, action domain.Action) error {
	_, err := db.ExecContext(ctx, "UPDATE actions (id, name, description, multiplier, type, tag, accuracy, action_weight) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", action.ID, action.Name, action.Description, action.Multiplier, action.Type, action.Tag, action.Accuracy, action.ActionWeight)
	if err != nil {
		return fmt.Errorf("actionRepo.Create %w", err)
	}
	return nil
}

func (r *actionRepo) Update(ctx context.Context, db DBTX, action domain.Action) error {
	res, err := db.ExecContext(ctx, `
	UPDATE actions 
	SET name = $2, 
	    description = $3, 
	    multiplier = $4, 
	    type = $5, 
	    tag = $6, 
	    accuracy = $7, 
	    action_weight = $8 
	WHERE id = $1`,
		action.ID, action.Name, action.Description, action.Multiplier,
		action.Type, action.Tag, action.Accuracy, action.ActionWeight,
	)
	if err != nil {
		return fmt.Errorf("actionRepo.Update: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("actionRepo.Update rows check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("action not found")
	}

	return nil
}

func (r *actionRepo) GetAllActions(ctx context.Context, db DBTX) ([]domain.Action, error) {
	var actions []domain.Action

	query := `SELECT id, name, description, type, multiplier, tag, accuracy, action_weight FROM actions`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("actionRepo.GetAllActions query error: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var a domain.Action

		if err := rows.Scan(
			&a.ID,
			&a.Name,
			&a.Description,
			&a.Type,
			&a.Multiplier,
			&a.Tag,
			&a.Accuracy,
			&a.ActionWeight,
		); err != nil {
			return nil, fmt.Errorf("actionRepo.GetAllActions scan error: %w", err)
		}

		actions = append(actions, a)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("actionRepo.GetAllActions rows error: %w", err)
	}

	return actions, nil
}

func (r *actionRepo) GetActionDetails(ctx context.Context, db DBTX, actionID string) (domain.Action, error) {
	var action domain.Action

	err := db.QueryRowContext(ctx, `SELECT id, name, description, multiplier, type, tag, accuracy, action_weight FROM actions WHERE id = $1`,
		actionID).Scan(
		&action.ID,
		&action.Name,
		&action.Description,
		&action.Multiplier,
		&action.Type,
		&action.Tag,
		&action.Accuracy,
		&action.ActionWeight,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return domain.Action{}, fmt.Errorf("action not found: %w", err)
		}
		return domain.Action{}, fmt.Errorf("actionRepo.GetActionDetails: %w", err)
	}

	return action, nil
}

func (r *actionRepo) Delete(ctx context.Context, db DBTX, actionID string) error {
	res, err := db.ExecContext(ctx, `
		DELETE FROM actions
		WHERE id = $1
	`, actionID)
	if err != nil {
		return fmt.Errorf("actionRepo.Delete: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("actionRepo.Delete rows check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("action not found")
	}

	return nil
}
func (r *actionRepo) Count(ctx context.Context, db DBTX) (int, error) {
	var count int

	err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM actions`).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("actionRepo.Count: %w", err)
	}
	return count, nil
}
