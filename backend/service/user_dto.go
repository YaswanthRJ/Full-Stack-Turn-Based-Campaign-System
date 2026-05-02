package service

type AuthCheckResult struct {
	IsAuthenticated bool
	Username        *string
}
