package service

import "backend/domain"

type CreateCampaignTemplateInput struct {
	Name        string
	Description string
}
type AddCreaturesToCampaignInput struct {
	CampaignID  string
	CreatureIDs []string
}
type CampaignStageInput struct {
	StageIndex      int
	EnemyCreatureID string
}

type AddStagesInput struct {
	CampaignID string
	Stages     []CampaignStageInput
}

type EditStageCreatureInput struct {
	StageIndex      int
	EnemyCreatureID string
}

type ResolvedAction struct {
	isOffensive bool
	raw         int
	hit         bool
	block       float64
}

type ResolveRoundResult struct {
	Fight                    *domain.Fight `json:"fight"`
	CampaignSessionCompleted bool          `json:"campaignSessionCompleted"`
}
type UserSessionResult struct {
	CurrentSession *domain.CampaignSession `json:"currentSession"`
	CurrentFight   *domain.Fight           `json:"currentFight"`
}
