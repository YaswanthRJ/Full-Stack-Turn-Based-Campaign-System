package service

import (
	"fmt"
	"math"
	"math/rand"
	"sort"
	"time"
)

type EngineService interface {
	ResolveEnemyAction(input EnemyActionInput) (EnemyActionResult, error)
	EstimateDamage(input EstimateDamageInput) (int, error)
	EstimateFinalDamage(input EstimateFinalDamageInput) (int, error)
	RollAccuracy(input AccuracyInput) (bool, error)
	ResolveTurnOrder(playerSpeed, enemySpeed int) bool
	ClampHP(hp int) int
}

type engineService struct {
	rng *rand.Rand
}

func NewEngineService() EngineService {
	return &engineService{
		rng: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// ResolveEnemyAction selects the best enemy action based on combat state.
func (s *engineService) ResolveEnemyAction(input EnemyActionInput) (EnemyActionResult, error) {
	if input.EnemyMaxHP <= 0 || input.PlayerMaxHP <= 0 {
		return EnemyActionResult{}, fmt.Errorf("invalid HP values")
	}

	if input.EnemyMaxAP <= 0 || input.PlayerMaxAP <= 0 {
		return EnemyActionResult{}, fmt.Errorf("invalid AP values")
	}

	valid := filterValidActions(input.AvailableActions, input.EnemyCurrentAP)

	if len(valid) == 0 {
		return EnemyActionResult{
			Skip: true,
		}, nil
	}

	scored := scoreActions(valid, input)

	if len(scored) == 0 {
		return EnemyActionResult{Skip: true}, nil
	}

	best := scored[0]

	if best.Score < MIN_ACTION_THRESHOLD {
		return EnemyActionResult{Skip: true}, nil
	}

	// Shuffle first so ties aren't deterministic
	s.rng.Shuffle(len(scored), func(i, j int) {
		scored[i], scored[j] = scored[j], scored[i]
	})

	sort.SliceStable(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	chosen := pickWithRandomness(scored, s.rng)

	return EnemyActionResult{
		ActionID: chosen.Action.ID,
		Skip:     false,
	}, nil
}

// EstimateDamage returns raw pre-mitigation damage.
func (s *engineService) EstimateDamage(input EstimateDamageInput) (int, error) {
	if input.SourceAttack < 0 {
		return 0, fmt.Errorf("invalid source attack")
	}

	if input.ActionMultiplier < 0 {
		return 0, fmt.Errorf("invalid multiplier")
	}

	damage := float64(input.SourceAttack) * input.ActionMultiplier

	if damage < 1 {
		damage = 1
	}

	return int(math.Round(damage)), nil
}

// EstimateFinalDamage resolves final damage after block + defence
func (s *engineService) EstimateFinalDamage(input EstimateFinalDamageInput) (int, error) {
	if input.RawAttack < 0 {
		return 0, fmt.Errorf("invalid raw attack")
	}

	if input.CreatureDefense < 0 {
		return 0, fmt.Errorf("invalid creature defense")
	}

	if input.DefenceMultiplier < 0 {
		return 0, fmt.Errorf("invalid defence multiplier")
	}

	block := input.DefenceMultiplier
	if block > 1 {
		block = 1
	}

	raw := float64(input.RawAttack)

	// Step 1: active block %
	remaining := raw * (1 - block)

	// Full block
	if remaining <= 0 {
		return 0, nil
	}

	// Step 2: natural defense reduction
	def := float64(input.CreatureDefense)

	damage := remaining * (remaining / (remaining + def))

	if damage < 1 {
		damage = 1
	}

	return int(math.Round(damage)), nil
}

// RollAccuracy returns true if attack lands.
func (s *engineService) RollAccuracy(input AccuracyInput) (bool, error) {
	if input.Accuracy < 0 {
		return false, fmt.Errorf("invalid accuracy")
	}

	acc := input.Accuracy
	if acc > 1 {
		acc = 1
	}

	return s.rng.Float64() <= acc, nil
}

// ResolveTurnOrder returns true if player goes first
func (s *engineService) ResolveTurnOrder(playerSpeed, enemySpeed int) bool {
	if playerSpeed > enemySpeed {
		return true
	}
	if enemySpeed > playerSpeed {
		return false
	}
	return s.rng.Float64() < 0.5
}

// ClampHP ensures HP never goes below 0
func (s *engineService) ClampHP(hp int) int {
	if hp < 0 {
		return 0
	}
	return hp
}
