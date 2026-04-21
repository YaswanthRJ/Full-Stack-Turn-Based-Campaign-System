package service

import (
	"backend/domain"
	"math"
	"math/rand"
)

// filterValidActions removes actions that cost more AP than available
func filterValidActions(actions []domain.Action, ap int) []domain.Action {
	var res []domain.Action
	for _, a := range actions {
		if a.ActionWeight > 0 && int(a.ActionWeight) <= ap {
			res = append(res, a)
		}
	}
	return res
}

func sanitizeAction(a domain.Action) domain.Action {
	a.Accuracy = clamp(a.Accuracy, 0, 1)
	a.Multiplier = clamp(a.Multiplier, 0, 3)
	return a
}

func actionCost(a domain.Action) float64 {
	if a.ActionWeight <= 0 {
		return 1
	}
	return float64(a.ActionWeight)
}

// scoreActions calculates scores for all valid actions
func scoreActions(actions []domain.Action, input EnemyActionInput) []scoredAction {
	var result []scoredAction

	for _, a := range actions {
		a = sanitizeAction(a)

		var score float64

		switch a.Type {
		case ActionOffensive:
			score = scoreOffensive(a, input)
		case ActionDefensive:
			score = scoreDefensive(a, input)
		default:
			continue
		}

		if score <= 0 {
			continue
		}

		result = append(result, scoredAction{
			Action: a,
			Score:  score,
		})
	}

	return result
}

// scoreOffensive calculates offensive action desirability
func scoreOffensive(a domain.Action, input EnemyActionInput) float64 {
	acc := clamp(a.Accuracy, 0, 1)
	mult := clamp(a.Multiplier, 0, 2)

	enemyHPpct := safeDiv(float64(input.EnemyCurrentHP), float64(input.EnemyMaxHP))
	enemyAPpct := safeDiv(float64(input.EnemyCurrentAP), float64(input.EnemyMaxAP))

	playerHPpct := safeDiv(float64(input.PlayerCurrentHP), float64(input.PlayerMaxHP))
	playerAPpct := safeDiv(float64(input.PlayerCurrentAP), float64(input.PlayerMaxAP))

	rawDamage := float64(input.EnemyAttack) * mult
	expectedDamage := rawDamage * acc

	cost := actionCost(a)

	score := expectedDamage / math.Sqrt(cost)

	// kill pressure
	if expectedDamage >= float64(input.PlayerCurrentHP) {
		score *= 2.0
	}

	// wounded player = finish them
	if playerHPpct < 0.35 {
		score *= 1.35
	}

	// player exhausted = opportunity to pressure
	if playerAPpct < 0.25 {
		score *= 1.25
	}

	// player full AP = may retaliate, slightly cautious
	if playerAPpct > 0.75 {
		score *= 0.92
	}

	// enemy exhausted = conserve AP
	if enemyAPpct < 0.25 {
		score *= 0.75
	}

	// enemy low HP = desperation aggression
	if enemyHPpct < 0.30 {
		score *= 1.15
	}

	return score
}

// scoreDefensive calculates defensive action desirability
func scoreDefensive(a domain.Action, input EnemyActionInput) float64 {
	acc := clamp(a.Accuracy, 0, 1)
	mult := clamp(a.Multiplier, 0, 1)

	enemyHPpct := safeDiv(float64(input.EnemyCurrentHP), float64(input.EnemyMaxHP))
	enemyAPpct := safeDiv(float64(input.EnemyCurrentAP), float64(input.EnemyMaxAP))

	playerHPpct := safeDiv(float64(input.PlayerCurrentHP), float64(input.PlayerMaxHP))
	playerAPpct := safeDiv(float64(input.PlayerCurrentAP), float64(input.PlayerMaxAP))

	cost := actionCost(a)

	base := float64(input.EnemyDefence) * mult * acc
	score := base / math.Sqrt(cost)

	// low HP = defend strongly
	if enemyHPpct < 0.35 {
		score *= 1.7
	}

	// player has lots of AP = incoming pressure likely
	if playerAPpct > 0.70 {
		score *= 1.45
	}

	// player exhausted = less need to defend
	if playerAPpct < 0.25 {
		score *= 0.65
	}

	// healthy player means longer fight possible
	if playerHPpct > 0.70 {
		score *= 1.10
	}

	// player near death = stop turtling
	if playerHPpct < 0.25 {
		score *= 0.55
	}

	// if enemy has AP to spare, defense is affordable
	if enemyAPpct > 0.60 {
		score *= 1.20
	}

	return score
}

func pickWithRandomness(actions []scoredAction, rng *rand.Rand) scoredAction {
	if len(actions) == 1 {
		return actions[0]
	}

	topN := min(3, len(actions))

	total := 0.0
	weights := make([]float64, topN)

	for i := 0; i < topN; i++ {
		w := math.Sqrt(actions[i].Score)
		if w <= 0 {
			w = 0.0001
		}
		weights[i] = w
		total += w
	}

	r := rng.Float64() * total

	cum := 0.0
	for i := 0; i < topN; i++ {
		cum += weights[i]
		if r <= cum {
			return actions[i]
		}
	}

	return actions[0]
}

// safeDiv performs division with zero protection
func safeDiv(a, b float64) float64 {
	if b == 0 {
		return 0
	}
	return a / b
}

// clamp restricts a value between min and max
func clamp(v, min, max float64) float64 {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}

// min returns the smaller of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
