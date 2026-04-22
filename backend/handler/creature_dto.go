package handler

type CreatureRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	IsPlayable  bool   `json:"is_playable"`
	MaxHP       int    `json:"maxhp"`
	Attack      int    `json:"attack"`
	Defence     int    `json:"defence"`
	ActionPoint int    `json:"action_point"`
	Speed       int    `json:"speed"`
}

type CreatureActionRequest struct {
	ActionIDs []string `json:"action_id"`
}

type UpdateStatsRequest struct {
	MaxHP       int `json:"maxhp"`
	Attack      int `json:"attack"`
	Defence     int `json:"defence"`
	ActionPoint int `json:"action_point"`
	Speed       int `json:"speed"`
}
