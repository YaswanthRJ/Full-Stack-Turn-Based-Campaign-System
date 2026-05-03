package domain

import (
	"time"

	"github.com/google/uuid"
)

type CampaignTemplate struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	ImageUrl       string `json:"imageUrl"`
	ImagePublicKey string `json:"imagePublicKey"`
	OutroText      string `json:"outroText"`
	OutroImage     string `json:"outroImage"`
	OutroPublicKey string `json:"outroPublicKey"`
	Status         string `json:"status"`
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
	ID                 string    `json:"id"`
	UserID             string    `json:"userId"`
	CampaignTemplateID string    `json:"campaignTemplateId"`
	CurrentStageIndex  int       `json:"currentStageIndex"`
	PlayerCreatureID   string    `json:"playerCreatureId"`
	MaxHP              int       `json:"maxHp"`
	CurrentHP          int       `json:"currentHp"`
	MaxActionPoint     int       `json:"maxActionPoint"`
	CurrentActionPoint int       `json:"currentActionPoint"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
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
	ID                       string    `json:"id"`
	CampaignSessionID        string    `json:"campaignSessionId"`
	UserID                   string    `json:"userId"`
	PlayerCurrentHP          int       `json:"playerCurrentHp"`
	PlayerMaxHP              int       `json:"playerMaxHp"`
	PlayerCurrentActionPoint int       `json:"playerCurrentActionPoint"`
	PlayerMaxActionPoint     int       `json:"playerMaxActionPoint"`
	EnemyCreatureID          string    `json:"enemyCreatureId"`
	EnemyCurrentHP           int       `json:"enemyCurrentHp"`
	EnemyMaxHP               int       `json:"enemyMaxHp"`
	EnemyCurrentActionPoint  int       `json:"enemyCurrentActionPoint"`
	EnemyMaxActionPoint      int       `json:"enemyMaxActionPoint"`
	RoundNumber              int       `json:"roundNumber"`
	Status                   string    `json:"status"`
	CreatedAt                time.Time `json:"createdAt"`
	UpdatedAt                time.Time `json:"updatedAt"`
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

func NewCampaignTemplate(name string, description string, imageUrl string, imagePublicKey string, outroText string, outroImage string, outroPublicKey string) CampaignTemplate {
	return CampaignTemplate{
		ID:             uuid.New().String(),
		Name:           name,
		Description:    description,
		ImageUrl:       imageUrl,
		ImagePublicKey: imagePublicKey,
		OutroText:      outroText,
		OutroImage:     outroImage,
		OutroPublicKey: outroPublicKey,
		Status:         "active",
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

type CampaignOutroData struct {
	OutroImage string `json:"outroImage"`
	OutroText  string `json:"outroText"`
}
