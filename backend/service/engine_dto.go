package service

import "backend/domain"

const (
	lowHPThreshold    = 0.3
	highAPThreshold   = 0.6
	lowAPThreshold    = 0.3
	panicDefenceBoost = 1.5
	lowAPOffenceBoost = 1.2
)

type EnemyActionInput struct {
	AvailableActions []domain.Action
	EnemyCurrentAP   int
	EnemyMaxAP       int
	EnemyAttack      int
	EnemyDefence     int
	PlayerCurrentHP  int
	PlayerMaxHP      int
	PlayerCurrentAP  int
	PlayerMaxAP      int
	EnemyCurrentHP   int
	EnemyMaxHP       int
}

type scoredAction struct {
	Action domain.Action
	Score  float64
}

const (
	ActionOffensive = "offensive"
	ActionDefensive = "defensive"
)

type EstimateDamageInput struct {
	ActionMultiplier float64
	SourceAttack     int
}
type EstimateFinalDamageInput struct {
	RawAttack         int
	CreatureDefense   int
	DefenceMultiplier float64
}

type AccuracyInput struct {
	Accuracy float64
}
