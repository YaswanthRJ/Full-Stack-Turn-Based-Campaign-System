package service

type CreateCreatureInput struct {
	Name        string
	Description string
	IsPlayable  bool
	MaxHP       int
	Attack      int
	Defence     int
	ActionPoint int
}

type UpdateCreatureStatInput struct {
	MaxHP       int
	Attack      int
	Defence     int
	ActionPoint int
}
