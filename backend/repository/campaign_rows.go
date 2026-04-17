package repository

import "database/sql"

type campaignRow struct {
	ID              string
	Name            string
	Description     string
	Status          string
	CreatureID      sql.NullString
	StageIndex      sql.NullInt64
	EnemyCreatureID sql.NullString
}
