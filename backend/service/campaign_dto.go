package service

import "backend/domain"

const NoAction = "NO_ACTION"

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

type actorLog struct {
	lines       []string
	isDefensive bool
	skipped     bool
	aliveAfter  bool
}

type ResolveRoundResult struct {
	Fight                    *domain.Fight `json:"fight"`
	CampaignSessionCompleted bool          `json:"campaignSessionCompleted"`
	RoundLog                 []string      `json:"roundLog"`
}
type UserSessionResult struct {
	CurrentSession *domain.CampaignSession `json:"currentSession"`
	CurrentFight   *domain.Fight           `json:"currentFight"`
}
