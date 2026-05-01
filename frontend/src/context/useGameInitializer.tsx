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

    // Already in fight — nothing to do
    if (state.phase === "fight") return;

    async function init() {
      setState({ phase: "loading" });

      try {
        const res = await getSession();

        if (!res.currentSession || !res.currentFight) {
          setState({ phase: "idle" });
          return;
        }

        const creatureId = res.currentSession.playerCreatureId;
        const [actions, player, enemy] = await Promise.all([
          getCreatureActions(creatureId),
          getCreature(creatureId),
          getCreature(res.currentFight.enemyCreatureId),
        ]);

        setState({
          phase: "fight",
          session: {
            sessionId: res.currentSession.id,
            creatureId,
            player,
            enemy,
            actions,
          },
          fight: res.currentFight,
        });
      } catch (err) {
        console.error("Game init failed:", err);
        setState({ phase: "idle" });
      }
    }

    init();
  }, []);
}