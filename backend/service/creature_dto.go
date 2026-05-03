package service

type CreateCreatureInput struct {
	Name          string
	Description   string
	ImageUrl      string
	ImagePublicID string
	IsPlayable    bool
	MaxHP         int
	Attack        int
	Defence       int
	ActionPoint   int
	Speed         int
}

type UpdateCreatureStatInput struct {
	MaxHP       int
	Attack      int
	Defence     int
	ActionPoint int
	Speed       int
}
