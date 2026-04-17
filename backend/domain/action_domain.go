package domain

import "github.com/google/uuid"

type Action struct {
	ID           string
	Name         string
	Description  string
	Multiplier   float64
	Type         string
	Tag          string
	Accuracy     float64
	ActionWeight float64
}

func NewAction(name string, description string, multiplier float64, actionType string, tag string, accuracy float64, actionWeight float64) Action {
	return Action{
		ID:           uuid.New().String(),
		Name:         name,
		Description:  description,
		Multiplier:   multiplier,
		Type:         actionType,
		Tag:          tag,
		Accuracy:     accuracy,
		ActionWeight: actionWeight,
	}
}
