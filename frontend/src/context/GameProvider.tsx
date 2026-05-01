import { createContext, useContext, useState } from "react";
import type { Fight } from "../types/campaign.types";
import type { Action } from "../types/action.types";
import type { Creature } from "../types/creature.types";
import type { CampaignOutroData } from "../types/campaign.types";

// ── Shared session data (available in fight + result) ──────────────────────

type SessionData = {
  sessionId: string;
  creatureId: string;
  player: Creature;
  enemy: Creature;
  actions: Action[];
};

// ── Result payload — server decides everything ─────────────────────────────

export type ResultData = {
  fight: Fight;
  outcome: "player_won" | "player_defeated";
  campaignCompleted: boolean;
  outro: CampaignOutroData | null; // fetched async, starts null
};

// ── Discriminated union — each phase owns exactly its data ─────────────────

export type GameState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "fight"; session: SessionData; fight: Fight }
  | { phase: "result"; session: SessionData; result: ResultData };

type GameContextType = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  reset: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({ phase: "idle" });

  function reset() {
    localStorage.removeItem("sessionId");
    setState({ phase: "idle" });
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