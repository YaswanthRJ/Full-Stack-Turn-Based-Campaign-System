import { useEffect, useRef } from "react";
import { useGame } from "./GameProvider";
import { getSession } from "../service/campaign.service";
import { getCreature, getCreatureActions } from "../service/creatures.service";

export function useGameInitializer() {
  const { state, setState } = useGame();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        // If fight already exists → only ensure actions
        if (state.fight && state.actions.length > 0) return;

        setState((prev) => ({ ...prev, loading: true }));

        // Recover session from backend
        const res = await getSession();

        if (!res.currentSession) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const creatureId = res.currentSession.playerCreatureId;

        // Fetch actions
        const actions = await getCreatureActions(creatureId);

        //fetch creatures
        const player = await getCreature(creatureId)
        const enemy = await getCreature(res.currentFight.enemyCreatureId)
        setState({
          sessionId: res.currentSession.id,
          creatureId,
          fight: res.currentFight,
          actions,
          player,
          enemy,
          loading: false,
          campaignCompleted: false,
        });
      } catch (err) {
        console.error("Game init failed:", err);

        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    init();
  }, []);
}