import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameProvider";
import type { GameState, ResultData } from "../context/GameProvider";
import { useGameInitializer } from "../context/useGameInitializer";
import { CreatureCard } from "../components/CreatureCard";
import { ActionsPanel } from "../components/ActionPanel";
import { LogBox } from "../components/LogBox";
import {
  resolveAction,
  startNextFight,
  getOutro,
} from "../service/campaign.service";
import { getCreature } from "../service/creatures.service";
import type { Fight, RoundLogEntry } from "../types/campaign.types";
import { useAudio, useLoopScreen } from "../music";

// ── AnimEvent ──────────────────────────────────────────────────────────────

type AnimEvent =
  | "player_move" | "enemy_move"
  | "player_hit" | "enemy_hit"
  | "player_miss" | "enemy_miss"
  | "player_skip" | "enemy_skip"
  | "player_defeated" | "enemy_defeated";

const ANIM_EVENTS = new Set<string>([
  "player_move", "enemy_move", "player_hit", "enemy_hit",
  "player_miss", "enemy_miss", "player_skip", "enemy_skip",
  "player_defeated", "enemy_defeated",
]);

// ── Confetti ───────────────────────────────────────────────────────────────

const COLORS = [
  "#a855f7", "#7c3aed", "#e879f9", "#818cf8",
  "#f472b6", "#facc15", "#34d399", "#60a5fa",
];

function ConfettiPiece({ i }: { i: number }) {
  const color = COLORS[i % COLORS.length];
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: "-20px",
        width: 6 + Math.random() * 8,
        height: (6 + Math.random() * 8) * (Math.random() * 0.6 + 0.6),
        background: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        boxShadow: `0 0 6px ${color}88`,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: "110vh", opacity: [1, 1, 0], rotate: Math.random() * 720 - 360 }}
      transition={{ duration: 1.8 + Math.random() * 1.4, delay: Math.random() * 0.6, ease: "easeIn" }}
    />
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(60)].map((_, i) => <ConfettiPiece key={i} i={i} />)}
    </div>
  );
}

// ── FightPanel ─────────────────────────────────────────────────────────────

type FightPanelProps = {
  state: Extract<GameState, { phase: "fight" }>;
  onFightEnded: (result: ResultData) => void;
};

function FightPanel({ state, onFightEnded }: FightPanelProps) {
  const { session, fight } = state;

  const [uiFight, setUiFight] = useState<Fight>(fight);
  const [lines, setLines] = useState<RoundLogEntry[]>([]);
  const [eventAnim, setEventAnim] = useState<AnimEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const playing = useRef(false);
  const pendingResult = useRef<{ fight: Fight; campaignSessionCompleted: boolean; roundLog: RoundLogEntry[] } | null>(null);

  async function handleAction(actionId: string) {
    if (submitting || playing.current) return;
    setSubmitting(true);

    try {
      const res = await resolveAction(fight.id, actionId);
      pendingResult.current = res;
      playing.current = true;
      setLines(res.roundLog);
    } catch (err) {
      console.error("Round failed:", err);
      playing.current = false;
      setLines([]);
      setSubmitting(false);
    }
  }

  function applyEffect(effect: string, serverFight: Fight) {
    setUiFight((cur) => {
      const next = { ...cur };
      switch (effect) {
        case "player_move":
        case "player_skip":
          next.playerCurrentActionPoint = serverFight.playerCurrentActionPoint; break;
        case "enemy_move":
        case "enemy_skip":
          next.enemyCurrentActionPoint = serverFight.enemyCurrentActionPoint; break;
        case "player_hit":
          next.playerCurrentHp = serverFight.playerCurrentHp; break;
        case "enemy_hit":
          next.enemyCurrentHp = serverFight.enemyCurrentHp; break;
      }
      return next;
    });

    if (ANIM_EVENTS.has(effect)) {
      setEventAnim(effect as AnimEvent);
      setTimeout(() => setEventAnim(null), 700);
    }
  }

  function handleLogDone() {
    const res = pendingResult.current;
    if (!res) return;

    playing.current = false;
    pendingResult.current = null;
    setLines([]);
    setSubmitting(false);
    setEventAnim(null);

    const serverFight = res.fight;
    const completed = res.campaignSessionCompleted;

    if (serverFight.status === "active") {
      setUiFight(serverFight);
      return;
    }

    const outcome = serverFight.status as ResultData["outcome"];
    const result: ResultData = { fight: serverFight, outcome, campaignCompleted: completed, outro: null };

    if (completed && serverFight.campaignSessionId) {
      getOutro(serverFight.campaignSessionId)
        .then((outro) => onFightEnded({ ...result, outro }))
        .catch(() => onFightEnded(result));
    } else {
      onFightEnded(result);
    }
  }

  return (
    // h-full fills the <main> container cleanly
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#06000f" }}>
      <div
        className="flex flex-col gap-5 p-3 flex-1 overflow-auto"
        style={{
          background: "linear-gradient(180deg, #0a0018 0%, #0d001f 100%)",
          borderTop: "2px solid #7c3aed44",
        }}
      >
        <CreatureCard
          name={session.enemy.name}
          hpCurrent={uiFight.enemyCurrentHp}
          hpMax={uiFight.enemyMaxHp}
          apCurrent={uiFight.enemyCurrentActionPoint}
          apMax={uiFight.enemyMaxActionPoint}
          imageUrl={session.enemy.imageUrl}
          isEnemy
          anim={eventAnim}
        />
        <CreatureCard
          name={session.player.name}
          hpCurrent={uiFight.playerCurrentHp}
          hpMax={uiFight.playerMaxHp}
          apCurrent={uiFight.playerCurrentActionPoint}
          apMax={uiFight.playerMaxActionPoint}
          imageUrl={session.player.imageUrl}
          anim={eventAnim}
        />
        <LogBox
          logs={lines}
          onStep={(entry) => {
            if (pendingResult.current) applyEffect(entry.effect, pendingResult.current.fight);
          }}
          onDone={handleLogDone}
        />
        <ActionsPanel
          actions={session.actions}
          onSelect={handleAction}
          disabled={submitting || playing.current}
          currentAp={uiFight.playerCurrentActionPoint}
        />
      </div>
    </div>
  );
}

// ── ResultPanel ────────────────────────────────────────────────────────────

type ResultPanelProps = {
  state: Extract<GameState, { phase: "result" }>;
  onNextFight: () => void;
  onHome: () => void;
  isNavigating: boolean;
};

function ResultPanel({ state, onNextFight, onHome, isNavigating }: ResultPanelProps) {
  const { result } = state;
  const won = result.outcome === "player_won";

  const [showConfetti, setShowConfetti] = useState(
    () => won && !result.campaignCompleted
  );

  useRef((() => {
    if (!showConfetti) return;
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  })());

  if (result.campaignCompleted) {
    return (
      // h-full instead of min-h-screen — fits inside Layout's <main>
      <div className="h-full flex flex-col items-center p-6 bg-linear-to-b from-[#06000f] to-[#0d001f]">
        <h2 className="text-purple-300 text-sm tracking-widest uppercase mb-4">
          Campaign Complete
        </h2>
        {result.outro && (
  <>
    <motion.div
      className="w-full max-w-md rounded-xl border border-purple-700 overflow-hidden"
      style={{ aspectRatio: "16/9" }}  // ← reserves space before image loads
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <img
        src={result.outro.outroImage}
        alt=""
        className="w-full h-full object-cover"
      />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-purple-200 mt-4 text-sm max-w-md"
    >
      {result.outro.outroText}
    </motion.p>
  </>
)}
        <button
          onClick={onHome}
          className="mt-6 py-3 px-6 rounded-xl font-bold uppercase bg-black text-purple-300 border border-purple-700"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center h-full p-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <motion.div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div
          className="w-24 h-24 flex items-center justify-center text-5xl rounded-full"
          style={{
            background: won
              ? "linear-gradient(135deg, #3b0072, #7c3aed)"
              : "linear-gradient(135deg, #1a0008, #7f1d1d)",
            border: won ? "2px solid #a855f7" : "2px solid #ef4444",
          }}
        >
          {won ? "⚔️" : "💀"}
        </div>

        <h1 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-400">
          {won ? "Victory!" : "Defeated"}
        </h1>

        <p className="text-purple-300 text-sm text-center">
          {won ? "The enemy has fallen. Onward!" : "Better luck next time."}
        </p>

        <div className="flex flex-col gap-3 w-full">
          {won && (
            <button
              onClick={onNextFight}
              disabled={isNavigating}
              className="py-3 rounded-xl font-bold uppercase bg-purple-700 text-white disabled:opacity-50"
            >
              {isNavigating ? "Loading..." : "Next Fight"}
            </button>
          )}
          <button
            onClick={onHome}
            disabled={isNavigating}
            className="py-3 rounded-xl font-bold uppercase bg-black text-purple-300 border border-purple-700 disabled:opacity-50"
          >
            Back Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── GameScreen ─────────────────────────────────────────────────────────────

export function GameScreen() {
  const { playSfx } = useAudio();
  useLoopScreen("combat");
  useGameInitializer();

  const { state, setState, reset } = useGame();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  function handleFightEnded(result: ResultData) {
    if (state.phase !== "fight") return;
    if (result.campaignCompleted && result.outcome === "player_won") {
      playSfx("campaignVictory");
    } else if (result.outcome === "player_won") {
      playSfx("victory");
    } else {
      playSfx("defeat");
    }
    setState({ phase: "result", session: state.session, result });
  }

  async function handleNextFight() {
    if (state.phase !== "result" || isNavigating) return;
    setIsNavigating(true);

    try {
      const nextFight = await startNextFight(state.session.sessionId);
      const nextEnemy = await getCreature(nextFight.enemyCreatureId);
      setState({ phase: "fight", session: { ...state.session, enemy: nextEnemy }, fight: nextFight });
    } catch (err) {
      console.error("Next fight failed:", err);
    } finally {
      setIsNavigating(false);
    }
  }

  function handleHome() {
    reset();
    navigate("/");
  }

  switch (state.phase) {
    case "idle":
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-purple-400 font-mono">No active fight</span>
        </div>
      );

    case "loading":
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

    case "fight":
      return <FightPanel state={state} onFightEnded={handleFightEnded} />;

    case "result":
      return (
        <ResultPanel
          state={state}
          onNextFight={handleNextFight}
          onHome={handleHome}
          isNavigating={isNavigating}
        />
      );
  }
}