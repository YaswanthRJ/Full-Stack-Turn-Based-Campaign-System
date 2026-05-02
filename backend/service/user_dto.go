package service

type AuthCheckResult struct {
	IsAuthenticated bool    `json:"isAuthenticated"`
	Username        *string `json:"username"`
}

type UserStatsResult struct {
	CompletedCampaigns int `json:"completedCampaigns"`
	Fights             int `json:"fights"`
	Wins               int `json:"wins"`
	Losses             int `json:"losses"`
}
