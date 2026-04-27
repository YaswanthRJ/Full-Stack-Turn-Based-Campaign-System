package handler

type CreateCampaignTemplateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AddCampaignCreaturesRequest struct {
	CreatureIDs []string `json:"creatureIds"`
}

type AddCampaignStagesRequest struct {
	Stages []CampaignStageRequest `json:"stages"`
}

type CampaignStageRequest struct {
	StageIndex      int    `json:"stageIndex"`
	EnemyCreatureID string `json:"enemyCreatureId"`
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
