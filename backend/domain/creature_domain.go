package domain

import "github.com/google/uuid"

type Creature struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	IsPlayable  bool   `json:"isPlayable"`
}
type CreatureStats struct {
	CreatureID  string `json:"creatureId"`
	MaxHP       int    `json:"maxHp"`
	Attack      int    `json:"attack"`
	Defense     int    `json:"defense"`
	ActionPoint int    `json:"actionPoint"`
}

func NewCreature(name string, description string, isPlayable bool) *Creature {
	return &Creature{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		IsPlayable:  isPlayable,
	}
}

func NewCreatureStats(creatureID string, maxHP, attack, defense, actionPoint int) *CreatureStats {
	return &CreatureStats{
		CreatureID:  creatureID,
		MaxHP:       maxHP,
		Attack:      attack,
		Defense:     defense,
		ActionPoint: actionPoint,
	}
}
