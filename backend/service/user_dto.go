package service

type AuthCheckResult struct {
	IsAuthenticated bool    `json:"isAuthenticated"`
	Username        *string `json:"username"`
}
