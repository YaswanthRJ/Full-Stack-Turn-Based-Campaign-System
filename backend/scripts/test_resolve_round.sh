#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8080"
H="Content-Type: application/json"
TAG="$$"  # PID as unique suffix to avoid collisions with previous runs

# Helper: curl + print response, exit on HTTP error
call() {
  local resp
  resp=$(curl -s -w "\n%{http_code}" "$@")
  local body code
  body=$(echo "$resp" | sed '$d')
  code=$(echo "$resp" | tail -1)
  echo "$body"
  if [ "$code" -ge 400 ]; then
    echo "ERROR: HTTP $code"
    exit 1
  fi
}

echo "=== 1. Create user ==="
DUMMY_UUID="00000000-0000-0000-0000-000000000000"
USER_ID=$(call -X POST "$BASE/game/user" -H "X-User-ID: $DUMMY_UUID" | jq -r '.user_id')
echo "User: $USER_ID"

echo ""
echo "=== 2. Create actions ==="

call -X POST "$BASE/actions" -H "$H" -d "{
  \"name\": \"Slash_$TAG\",
  \"description\": \"A strong slash\",
  \"multiplier\": 1.5,
  \"type\": \"offensive\",
  \"tag\": \"physical\",
  \"accuracy\": 0.9,
  \"action_weight\": 3
}"

call -X POST "$BASE/actions" -H "$H" -d "{
  \"name\": \"Shield_$TAG\",
  \"description\": \"Raise shield\",
  \"multiplier\": 0.5,
  \"type\": \"defensive\",
  \"tag\": \"physical\",
  \"accuracy\": 1.0,
  \"action_weight\": 2
}"

ACTIONS=$(call "$BASE/actions")
SLASH_ID=$(echo "$ACTIONS" | jq -r "[.[] | select(.Name==\"Slash_$TAG\")] | first | .ID")
SHIELD_ID=$(echo "$ACTIONS" | jq -r "[.[] | select(.Name==\"Shield_$TAG\")] | first | .ID")
echo "Slash:  $SLASH_ID"
echo "Shield: $SHIELD_ID"

echo ""
echo "=== 3. Create creatures ==="

call -X POST "$BASE/creatures" -H "$H" -d "{
  \"name\": \"Hero_$TAG\",
  \"description\": \"The player hero\",
  \"is_playable\": true,
  \"maxhp\": 100,
  \"attack\": 20,
  \"defence\": 10,
  \"action_point\": 10
}"

call -X POST "$BASE/creatures" -H "$H" -d "{
  \"name\": \"Goblin_$TAG\",
  \"description\": \"A weak goblin\",
  \"is_playable\": false,
  \"maxhp\": 50,
  \"attack\": 12,
  \"defence\": 5,
  \"action_point\": 8
}"

CREATURES=$(call "$BASE/creatures")
HERO_ID=$(echo "$CREATURES" | jq -r "[.data[] | select(.Name==\"Hero_$TAG\")] | first | .ID")
GOBLIN_ID=$(echo "$CREATURES" | jq -r "[.data[] | select(.Name==\"Goblin_$TAG\")] | first | .ID")
echo "Hero:   $HERO_ID"
echo "Goblin: $GOBLIN_ID"

echo ""
echo "=== 4. Assign actions to creatures ==="
call -X POST "$BASE/creatures/$HERO_ID/actions" -H "$H" \
  -d "{\"action_id\": [\"$SLASH_ID\", \"$SHIELD_ID\"]}"

call -X POST "$BASE/creatures/$GOBLIN_ID/actions" -H "$H" \
  -d "{\"action_id\": [\"$SLASH_ID\", \"$SHIELD_ID\"]}"

echo ""
echo "=== 5. Create campaign ==="
call -X POST "$BASE/campaigns" -H "$H" -d "{
  \"name\": \"Campaign_$TAG\",
  \"description\": \"A test campaign for ResolveRound\"
}"

CAMPAIGN_ID=$(call "$BASE/campaigns" | jq -r "[.[] | select(.Name==\"Campaign_$TAG\")] | first | .ID")
echo "Campaign: $CAMPAIGN_ID"

echo ""
echo "=== 6. Add creature and stages to campaign ==="
call -X POST "$BASE/campaigns/$CAMPAIGN_ID/creatures" -H "$H" \
  -d "{\"creature_ids\": [\"$HERO_ID\"]}"

call -X POST "$BASE/campaigns/$CAMPAIGN_ID/stages" -H "$H" \
  -d "{\"stages\": [{\"stage_index\": 0, \"enemy_creature_id\": \"$GOBLIN_ID\"}]}"

echo ""
echo "=== 7. Start campaign ==="
START_RESP=$(call -X POST "$BASE/game/campaign/$CAMPAIGN_ID/start" \
  -H "$H" -H "X-User-ID: $USER_ID" \
  -d "{\"enemyCreatureId\": \"$HERO_ID\"}")
echo "$START_RESP" | jq .

FIGHT_ID=$(echo "$START_RESP" | jq -r '.fight.ID')
echo "Fight: $FIGHT_ID"

echo ""
echo "=== 8. Resolve rounds (attack until fight ends) ==="
for i in $(seq 1 20); do
  echo "--- Round $i ---"
  ROUND_RESP=$(call -X POST "$BASE/game/campaign/fight/$FIGHT_ID/round" \
    -H "$H" -H "X-User-ID: $USER_ID" \
    -d "{\"actionId\": \"$SLASH_ID\"}")
  echo "$ROUND_RESP" | jq .

  STATUS=$(echo "$ROUND_RESP" | jq -r '.fight.Status')
  COMPLETED=$(echo "$ROUND_RESP" | jq -r '.campaignSessionCompleted')

  echo "Status: $STATUS | Campaign completed: $COMPLETED"

  if [ "$STATUS" != "active" ]; then
    echo ""
    echo "=== Fight ended with status: $STATUS ==="
    echo "=== Campaign completed: $COMPLETED ==="
    break
  fi
done

echo ""
echo "=== Done ==="
