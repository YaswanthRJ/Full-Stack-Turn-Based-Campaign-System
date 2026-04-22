package handler

type CreateCampaignTemplateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AddCampaignCreaturesRequest struct {
	CreatureIDs []string `json:"creature_ids"`
}

type AddCampaignStagesRequest struct {
	Stages []CampaignStageRequest `json:"stages"`
}

type CampaignStageRequest struct {
	StageIndex      int    `json:"stage_index"`
	EnemyCreatureID string `json:"enemy_creature_id"`
}

type updateStageRequest struct {
	EnemyCreatureID string `json:"enemyCreatureId"`
}

type StartCampaignRequest struct {
	EnemyCreatureID string `json:"enemyCreatureId"`
}

type ResolveRoundRequest struct {
	ActionID string `json:"actionId"`
}
