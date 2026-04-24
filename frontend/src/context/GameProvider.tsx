import { createContext, useContext, useState } from "react";
import type { Fight } from "../types/campaign.types";
import type { Action } from "../types/action.types";
import type { Creature } from "../types/creature.types";

type GameState = {
  sessionId: string | null;
  creatureId: string | null;
  fight: Fight | null;
  actions: Action[];
  player: Creature | null;
  enemy: Creature | null;
  loading: boolean;
  campaignCompleted: boolean;
};

type GameContextType = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  reset: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    sessionId: null,
    creatureId: null,
    fight: null,
    actions: [],
    player: null,
    enemy: null,
    loading: false,
    campaignCompleted: false,
  });

  function reset() {
    localStorage.removeItem("sessionId");
    setState({
      sessionId: null,
      creatureId: null,
      fight: null,
      actions: [],
      player: null,
      enemy: null,
      loading: false,
      campaignCompleted: false,
    });
  }

  return (
    <GameContext.Provider value={{ state, setState, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}