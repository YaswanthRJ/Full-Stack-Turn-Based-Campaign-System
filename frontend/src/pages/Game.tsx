import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../context/GameProvider";
import { useGameInitializer } from "../context/useGameInitializer";
import { CreatureCard } from "../components/CreatureCard";
import { ActionsPanel } from "../components/ActionPanel";
import { resolveAction } from "../service/campaign.service";
import { LogBox } from "../components/LogBox";
import type { Fight, RoundLogEntry } from "../types/campaign.types";

type AnimEvent =
  | "player_move"
  | "enemy_move"
  | "player_hit"
  | "enemy_hit"
  | "player_miss"
  | "enemy_miss"
  | "player_skip"
  | "enemy_skip"
  | "player_defeated"
  | "enemy_defeated";

export function Game() {
  useGameInitializer();

  const { state, setState } = useGame();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [lines, setLines] = useState<RoundLogEntry[]>([]);
  const [visualFight, setVisualFight] = useState<Fight | null>(state.fight);

  const [eventAnim, setEventAnim] = useState<AnimEvent | null>(null);

  useEffect(() => {
    setVisualFight(state.fight);
  }, [state.fight]);

  const playing = useRef(false);
  const pendingResult = useRef<any>(null);
  const fight = state.fight;

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-purple-300 font-mono text-sm tracking-widest">
          Loading...
        </span>
      </div>
    );
  }

  if (!fight || !visualFight || !state.enemy || !state.player) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-purple-400 font-mono">No active fight</span>
      </div>
    );
  }

  async function handleAction(actionId: string) {
    if (submitting || playing.current || !fight) return;
    setSubmitting(true);

    try {
      const res = await resolveAction(fight.id, actionId);
      pendingResult.current = res;
      playing.current = true;

      setVisualFight(fight);
      setLines(res.roundLog);
    } catch (err) {
      console.error("Round failed:", err);
      playing.current = false;
      setLines([]);
      setSubmitting(false);
    }
  }

  function handleLogDone() {
    const res = pendingResult.current;
    if (!res) return;

    setState((prev) => ({
      ...prev,
      fight: res.fight,
      campaignCompleted: res.campaignSessionCompleted,
    }));

    playing.current = false;
    setLines([]);
    setSubmitting(false);
    pendingResult.current = null;
    setEventAnim(null);

    if (res.fight.status !== "active") {
      setTimeout(() => navigate("/result"), 400);
    }
  }

  function applyEffect(effect: string, finalFight: Fight) {
    setVisualFight((current) => {
      if (!current) return current;
      const next = { ...current };

      // AP updates
      switch (effect) {
        case "player_move":
        case "player_skip":
          next.playerCurrentActionPoint = finalFight.playerCurrentActionPoint;
          break;

        case "enemy_move":
        case "enemy_skip":
          next.enemyCurrentActionPoint = finalFight.enemyCurrentActionPoint;
          break;
      }

      // HP updates
      switch (effect) {
        case "player_hit":
          next.playerCurrentHp = finalFight.playerCurrentHp;
          break;

        case "enemy_hit":
          next.enemyCurrentHp = finalFight.enemyCurrentHp;
          break;
      }

      return next;
    });

    // animation trigger
    const allowed: AnimEvent[] = [
      "player_move",
      "enemy_move",
      "player_hit",
      "enemy_hit",
      "player_miss",
      "enemy_miss",
      "player_skip",
      "enemy_skip",
      "player_defeated",
      "enemy_defeated",
    ];

    if (allowed.includes(effect as AnimEvent)) {
      setEventAnim(effect as AnimEvent);

      setTimeout(() => {
        setEventAnim(null);
      }, 700);
    }
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "#06000f" }}
    >
      <div
        className="flex flex-col gap-2 p-3 flex-1 overflow-auto"
        style={{
          background: "linear-gradient(180deg, #0a0018 0%, #0d001f 100%)",
          borderTop: "2px solid #7c3aed44",
        }}
      >
        {/* Enemy */}
        <CreatureCard
          name={state.enemy.name}
          hpCurrent={visualFight.enemyCurrentHp}
          hpMax={visualFight.enemyMaxHp}
          apCurrent={visualFight.enemyCurrentActionPoint}
          apMax={visualFight.enemyMaxActionPoint}
          imageUrl={state.enemy.imageUrl}
          isEnemy
          anim={eventAnim}
        />

        {/* Player */}
        <CreatureCard
          name={state.player.name}
          hpCurrent={visualFight.playerCurrentHp}
          hpMax={visualFight.playerMaxHp}
          apCurrent={visualFight.playerCurrentActionPoint}
          apMax={visualFight.playerMaxActionPoint}
          imageUrl={state.player.imageUrl}
          anim={eventAnim}
        />

        {/* Log */}
        <LogBox
          logs={lines}
          onStep={(entry) => {
            const res = pendingResult.current;
            if (!res || !fight) return;
            applyEffect(entry.effect, res.fight);
          }}
          onDone={handleLogDone}
        />

        {/* Actions */}
        <ActionsPanel
          actions={state.actions}
          onSelect={handleAction}
          disabled={submitting || playing.current}
          currentAp={visualFight?.playerCurrentActionPoint}
        />
      </div>
    </div>
  );
}