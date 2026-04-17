package service

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
