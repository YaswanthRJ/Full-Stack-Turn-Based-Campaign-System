package domain

import (
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

func NewCampaignTemplate(name string, description string) CampaignTemplate {
	return CampaignTemplate{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		Status:      "active",
	}
}
