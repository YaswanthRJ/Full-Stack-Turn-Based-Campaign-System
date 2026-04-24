import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, startNextFight } from "../service/campaign.service";
import { getCreature, getCreatureActions } from "../service/creatures.service";
import { useGame } from "../context/GameProvider";
import type { CurrentState } from "../types/campaign.types";

export function Home() {
  const [state, setState] = useState<CurrentState | null>(null);
  const { setState: setGameState } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then((res) => {
      setState(res);
    });
  }, []);

  const canContinue = state?.currentSession?.status === "active";

  async function handleContinue() {
    if (!state?.currentSession) return;

    const session = state.currentSession;
    let fight = state.currentFight;

    if (!fight) {
      fight = await startNextFight(session.id);
    }

    const [player, enemy, actions] = await Promise.all([
      getCreature(session.playerCreatureId),
      getCreature(fight.enemyCreatureId),
      getCreatureActions(session.playerCreatureId),
    ]);

    setGameState((prev) => ({
      ...prev,
      sessionId: session.id,
      creatureId: session.playerCreatureId,
      fight,
      actions,
      player,
      enemy,
    }));

    navigate("/game");
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-purple-400 h-[300px]" />

      <div className="grid gap-2">
        {canContinue && (
          <MenuButton
            text="Continue"
            action={handleContinue}
          />
        )}
        <MenuButton
          text="New Campaign"
          action={() => navigate("/campaigns")}
        />

        <MenuButton
          text="Exit"
          action={() => console.log("exit game")}
        />

      </div>
    </div>
  );
}

interface ButtonProps {
  text: string;
  action: () => void;
}

function MenuButton({ text, action }: ButtonProps) {
  return (
    <button
      onClick={action}
      className="bg-purple-700 text-white py-2 rounded"
    >
      {text}
    </button>
  );
}