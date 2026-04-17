package domain

import "github.com/google/uuid"

type Creature struct {
	ID          string
	Name        string
	Description string
	IsPlayable  bool
}
type CreatureStats struct {
	ID          string
	CreatureID  string
	MaxHP       int
	Attack      int
	Defence     int
	ActionPoint int
}

type CreatureDetails struct {
	ID          string
	Name        string
	Description string
	IsPlayable  bool

	MaxHP       int
	Attack      int
	Defence     int
	ActionPoint int
}

func NewCreature(name string, description string, isPlayable bool) Creature {
	return Creature{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		IsPlayable:  isPlayable,
	}
}

func NewCreatureStats(creatureID string, maxHP, attack, defence, actionPoint int) CreatureStats {
	return CreatureStats{
		ID:          uuid.New().String(),
		CreatureID:  creatureID,
		MaxHP:       maxHP,
		Attack:      attack,
		Defence:     defence,
		ActionPoint: actionPoint,
	}
}
