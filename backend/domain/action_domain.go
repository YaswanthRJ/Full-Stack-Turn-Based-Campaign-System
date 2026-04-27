package domain

import "github.com/google/uuid"

type Action struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	IconUrl      string  `json:"iconUrl"`
	Multiplier   float64 `json:"multiplier"`
	Type         string  `json:"type"`
	Tag          string  `json:"tag"`
	Accuracy     float64 `json:"accuracy"`
	ActionWeight float64 `json:"actionWeight"`
}

func NewAction(name string, description string, iconUrl string, multiplier float64, actionType string, tag string, accuracy float64, actionWeight float64) Action {
	return Action{
		ID:           uuid.New().String(),
		Name:         name,
		Description:  description,
		IconUrl:      iconUrl,
		Multiplier:   multiplier,
		Type:         actionType,
		Tag:          tag,
		Accuracy:     accuracy,
		ActionWeight: actionWeight,
	}
}
