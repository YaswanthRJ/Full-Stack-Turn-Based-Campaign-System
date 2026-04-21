package domain

import (
	"time"

	"github.com/google/uuid"
)

type CampaignTemplate struct {
	ID          string
	Name        string
	Description string
	Status      string
}

type CampaignStage struct {
	StageIndex      int
	EnemyCreatureID string
}

type Campaign struct {
	Template            CampaignTemplate
	PlayableCreatureIDs []string
	Stages              []CampaignStage
}

type CampaignSession struct {
	ID                 string
	UserID             string
	CampaignTemplateID string
	CurrentStageIndex  int
	PlayerCreatureID   string
	MaxHP              int
	CurrentHP          int
	MaxActionPoint     int
	CurrentActionPoint int
	Status             string
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

const (
	SessionStatusActive    = "active"
	SessionStatusCompleted = "completed"
	SessionStatusLost      = "lost"
)

type CreateCampaignSessionInput struct {
	UserID             string
	CampaignTemplateID string
	PlayerCreatureID   string
	MaxHP              int
	MaxActionPoint     int
}

type Fight struct {
	ID                       string
	CampaignSessionID        string
	UserID                   string
	PlayerCurrentHP          int
	PlayerMaxHP              int
	PlayerCurrentActionPoint int
	PlayerMaxActionPoint     int
	EnemyCreatureID          string
	EnemyCurrentHP           int
	EnemyMaxHP               int
	EnemyCurrentActionPoint  int
	EnemyMaxActionPoint      int
	RoundNumber              int
	Status                   string
	CreatedAt                time.Time
	UpdatedAt                time.Time
}

const (
	FightStatusActive     = "active"
	FightStatusPlayerWon  = "player_won"
	FightStatusPlayerLost = "player_lost"
)

type CreateFightInput struct {
	CampaignSessionID        string
	UserID                   string
	PlayerCurrentHP          int
	PlayerMaxHP              int
	PlayerCurrentActionPoint int
	PlayerMaxActionPoint     int
	EnemyCreatureID          string
	EnemyMaxHP               int
	EnemyMaxActionPoint      int
}

func NewFight(input CreateFightInput) Fight {
	now := time.Now()
	return Fight{
		ID:                       uuid.New().String(),
		CampaignSessionID:        input.CampaignSessionID,
		UserID:                   input.UserID,
		PlayerCurrentHP:          input.PlayerCurrentHP,
		PlayerMaxHP:              input.PlayerMaxHP,
		PlayerCurrentActionPoint: input.PlayerCurrentActionPoint,
		PlayerMaxActionPoint:     input.PlayerMaxActionPoint,
		EnemyCreatureID:          input.EnemyCreatureID,
		EnemyCurrentHP:           input.EnemyMaxHP,
		EnemyMaxHP:               input.EnemyMaxHP,
		EnemyCurrentActionPoint:  input.EnemyMaxActionPoint,
		EnemyMaxActionPoint:      input.EnemyMaxActionPoint,
		RoundNumber:              1,
		Status:                   FightStatusActive,
		CreatedAt:                now,
		UpdatedAt:                now,
	}
}

func NewCampaignTemplate(name string, description string) CampaignTemplate {
	return CampaignTemplate{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		Status:      "active",
	}
}

func NewCampaignSession(input CreateCampaignSessionInput) CampaignSession {
	now := time.Now()
	return CampaignSession{
		ID:                 uuid.New().String(),
		UserID:             input.UserID,
		CampaignTemplateID: input.CampaignTemplateID,
		CurrentStageIndex:  0,
		PlayerCreatureID:   input.PlayerCreatureID,
		MaxHP:              input.MaxHP,
		CurrentHP:          input.MaxHP,
		CurrentActionPoint: input.MaxActionPoint,
		MaxActionPoint:     input.MaxActionPoint,
		Status:             SessionStatusActive,
		CreatedAt:          now,
		UpdatedAt:          now,
	}
}
