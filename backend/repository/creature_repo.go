package repository

import (
	"backend/domain"
	"context"
	"database/sql"
	"fmt"
)

type CreatureRepository interface {
	Create(ctx context.Context, db DBTX, creature domain.Creature) error
	CreateStats(ctx context.Context, db DBTX, stats domain.CreatureStats) error
	AddActionsToCreature(ctx context.Context, db DBTX, creatureId string, actionIds []string) error
	GetAllCreatures(ctx context.Context, db DBTX) ([]domain.Creature, error)
	GetCreatureDetails(ctx context.Context, db DBTX, creatureID string) (domain.CreatureDetails, error)
	UpdateCreatureStats(ctx context.Context, db DBTX, stats domain.CreatureStats) error
	DeleteCreature(ctx context.Context, db DBTX, creatureID string) error
	Count(ctx context.Context, db DBTX) (int, error)
	GetStats(ctx context.Context, db DBTX, creatureID string) (domain.CreatureStats, error)
	ValidateAction(ctx context.Context, db DBTX, creatureID string, actionID string) (bool, error)
	GetActions(ctx context.Context, db DBTX, creatureID string) ([]domain.Action, error)
}

type creatureRepo struct {
}

func NewCreatureRepo() CreatureRepository {
	return &creatureRepo{}
}

func (r *creatureRepo) Create(ctx context.Context, db DBTX, creature domain.Creature) error {
	_, err := db.ExecContext(ctx,
		"INSERT INTO creatures (id,name,description,is_playable) VALUES ($1,$2,$3,$4)",
		creature.ID, creature.Name, creature.Description, creature.IsPlayable,
	)
	return err
}

func (r *creatureRepo) CreateStats(ctx context.Context, db DBTX, stats domain.CreatureStats) error {
	_, err := db.ExecContext(ctx,
		"INSERT INTO creature_stats (id,creature_id,max_hp,attack,defence,action_point) VALUES ($1,$2,$3,$4,$5,$6)",
		stats.ID, stats.CreatureID, stats.MaxHP, stats.Attack, stats.Defence, stats.ActionPoint,
	)
	return err
}

func (r *creatureRepo) AddActionsToCreature(ctx context.Context, db DBTX, creatureId string, actionIds []string) error {
	query := `INSERT INTO creature_actions (creature_id, action_id) VALUES `

	values := []interface{}{}
	for i, actionID := range actionIds {
		if i > 0 {
			query += ","
		}
		query += fmt.Sprintf("($%d, $%d)", i*2+1, i*2+2)
		values = append(values, creatureId, actionID)
	}

	query += ` ON CONFLICT (creature_id, action_id) DO NOTHING`

	_, err := db.ExecContext(ctx, query, values...)
	return err
}

func (r *creatureRepo) GetAllCreatures(ctx context.Context, db DBTX) ([]domain.Creature, error) {
	var creatures []domain.Creature

	query := `SELECT id, name, description, is_playable FROM creatures`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("creatureRepo.GetAllCreatures query error: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var c domain.Creature

		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.Description,
			&c.IsPlayable,
		); err != nil {
			return nil, fmt.Errorf("creatureRepo.GetAllCreatures scan error: %w", err)
		}

		creatures = append(creatures, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("creatureRepo.GetAllCreatures rows error: %w", err)
	}

	return creatures, nil
}

func (r *creatureRepo) GetCreatureDetails(ctx context.Context, db DBTX, creatureID string) (domain.CreatureDetails, error) {
	var creatureDetails domain.CreatureDetails
	query := `
		SELECT 
			c.id, c.name, c.description, c.is_playable,
			s.max_hp, s.attack, s.defence, s.action_point
		FROM creatures c
		JOIN creature_stats s ON c.id = s.creature_id
		WHERE c.id = $1
	`

	err := db.QueryRowContext(ctx, query, creatureID).Scan(
		&creatureDetails.ID,
		&creatureDetails.Name,
		&creatureDetails.Description,
		&creatureDetails.IsPlayable,
		&creatureDetails.MaxHP,
		&creatureDetails.Attack,
		&creatureDetails.Defence,
		&creatureDetails.ActionPoint,
	)
	if err != nil {
		return domain.CreatureDetails{}, fmt.Errorf("GetCreatureDetails: %w", err)
	}
	return creatureDetails, nil
}

func (r *creatureRepo) UpdateCreatureStats(ctx context.Context, db DBTX, stats domain.CreatureStats) error {
	res, err := db.ExecContext(ctx, `
		UPDATE creature_stats
		SET max_hp = $2, attack = $3, defence = $4, action_point = $5
		WHERE creature_id = $1
	`, stats.CreatureID, stats.MaxHP, stats.Attack, stats.Defence, stats.ActionPoint)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("creature stats not found")
	}

	return nil
}

func (r *creatureRepo) DeleteCreature(ctx context.Context, db DBTX, creatureID string) error {
	res, err := db.ExecContext(ctx, `
		DELETE FROM creatures
		WHERE id = $1
	`, creatureID)
	if err != nil {
		return fmt.Errorf("delete creature: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("creature not found")
	}

	return nil
}

func (r *creatureRepo) Count(ctx context.Context, db DBTX) (int, error) {
	var count int

	err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM creatures`).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("creatureRepo.Count: %w", err)
	}
	return count, nil
}

func (r *creatureRepo) GetStats(ctx context.Context, db DBTX, creatureID string) (domain.CreatureStats, error) {
	var stats domain.CreatureStats
	err := db.QueryRowContext(ctx,
		`SELECT max_hp, attack, defence, action_point 
         FROM creature_stats 
         WHERE creature_id = $1`,
		creatureID,
	).Scan(&stats.MaxHP, &stats.Attack, &stats.Defence, &stats.ActionPoint)
	if err != nil {
		if err == sql.ErrNoRows {
			return domain.CreatureStats{}, fmt.Errorf("creature stats not found for id %s", creatureID)
		}
		return domain.CreatureStats{}, fmt.Errorf("getStats: %w", err)
	}
	return stats, nil
}

func (r *creatureRepo) ValidateAction(ctx context.Context, db DBTX, creatureID string, actionID string) (bool, error) {
	var exists bool

	err := db.QueryRowContext(ctx,
		`SELECT EXISTS(SELECT 1 FROM creature_actions  WHERE creature_id = $1 AND action_id = $2)`, creatureID, actionID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("creatureRepo.ValidateAction: %w", err)
	}
	return exists, nil
}
func (r *creatureRepo) GetActions(ctx context.Context, db DBTX, creatureID string) ([]domain.Action, error) {
	query := `
		SELECT a.id, a.name, a.type, a.accuracy, a.multiplier, a.action_weight
		FROM actions a
		JOIN creature_actions ca ON ca.action_id = a.id
		WHERE ca.creature_id = $1
	`

	rows, err := db.QueryContext(ctx, query, creatureID)
	if err != nil {
		return nil, fmt.Errorf("get actions query: %w", err)
	}
	defer rows.Close()

	var actions []domain.Action

	for rows.Next() {
		var a domain.Action

		if err := rows.Scan(
			&a.ID,
			&a.Name,
			&a.Type,
			&a.Accuracy,
			&a.Multiplier,
			&a.ActionWeight,
		); err != nil {
			return nil, fmt.Errorf("get actions scan: %w", err)
		}

		actions = append(actions, a)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("get actions rows: %w", err)
	}

	return actions, nil
}
