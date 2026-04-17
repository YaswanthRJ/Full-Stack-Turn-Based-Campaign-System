package handler

type ActionRequest struct {
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	Multiplier   float64 `json:"multiplier"`
	Type         string  `json:"type"`
	Tag          string  `json:"tag"`
	Accuracy     float64 `json:"accuracy"`
	ActionWeight float64 `json:"action_weight"`
}
