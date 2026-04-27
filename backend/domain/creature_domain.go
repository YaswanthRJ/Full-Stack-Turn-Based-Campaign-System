package domain

import "github.com/google/uuid"

type Creature struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageUrl    string `json:"imageUrl"`
	IsPlayable  bool   `json:"isPlayable"`
}

type CreatureStats struct {
	ID          string `json:"id"`
	CreatureID  string `json:"creatureId"`
	MaxHP       int    `json:"maxHp"`
	Attack      int    `json:"attack"`
	Defence     int    `json:"defence"`
	ActionPoint int    `json:"actionPoint"`
	Speed       int    `json:"speed"`
}

type CreatureDetails struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImageUrl    string `json:"imageUrl"`
	IsPlayable  bool   `json:"isPlayable"`
	MaxHP       int    `json:"maxHp"`
	Attack      int    `json:"attack"`
	Defence     int    `json:"defence"`
	ActionPoint int    `json:"actionPoint"`
	Speed       int    `json:"speed"`
}

func NewCreature(name string, description string, imageUrl string, isPlayable bool) Creature {
	return Creature{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		ImageUrl:    imageUrl,
		IsPlayable:  isPlayable,
	}
}

func NewCreatureStats(creatureID string, maxHP, attack, defence, actionPoint int, speed int) CreatureStats {
	return CreatureStats{
		ID:          uuid.New().String(),
		CreatureID:  creatureID,
		MaxHP:       maxHP,
		Attack:      attack,
		Defence:     defence,
		ActionPoint: actionPoint,
		Speed:       speed,
	}
}
