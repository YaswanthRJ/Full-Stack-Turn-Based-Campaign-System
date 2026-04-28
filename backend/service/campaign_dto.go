package service

import "backend/domain"

const NoAction = "NO_ACTION"

type CreateCampaignTemplateInput struct {
	Name        string
	Description string
	ImageUrl    string
	OutroText   string
	OutroImage  string
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
	lines       []RoundLogEntry
	isDefensive bool
	skipped     bool
	aliveAfter  bool
}

type ResolveRoundResult struct {
	Fight                    *domain.Fight   `json:"fight"`
	CampaignSessionCompleted bool            `json:"campaignSessionCompleted"`
	RoundLog                 []RoundLogEntry `json:"roundLog"`
}

type UserSessionResult struct {
	CurrentSession *domain.CampaignSession `json:"currentSession"`
	CurrentFight   *domain.Fight           `json:"currentFight"`
}

type RoundLogEntry struct {
	Text   string `json:"text"`
	Effect string `json:"effect"`
}

const (
	EffectNone = "none"

	EffectPlayerAttack = "player_attack"
	EffectEnemyAttack  = "enemy_attack"

	EffectPlayerDefend = "player_defend"
	EffectEnemyDefend  = "enemy_defend"

	EffectPlayerHit = "player_hit"
	EffectEnemyHit  = "enemy_hit"

	EffectPlayerMiss = "player_miss"
	EffectEnemyMiss  = "enemy_miss"

	EffectPlayerSkip = "player_skip"
	EffectEnemySkip  = "enemy_skip"

	EffectPlayerDefeated = "player_defeated"
	EffectEnemyDefeated  = "enemy_defeated"
)
