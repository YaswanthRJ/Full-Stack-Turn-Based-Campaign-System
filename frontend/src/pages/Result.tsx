import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameProvider";
import { startNextFight, getOutro } from "../service/campaign.service";
import { getCreature } from "../service/creatures.service";
import type { CampaignOutroData } from "../types/campaign.types";

// ── Confetti particle ──────────────────────────────────────────────────────
const COLORS = [
  "#a855f7", "#7c3aed", "#e879f9", "#818cf8",
  "#f472b6", "#facc15", "#34d399", "#60a5fa",
];

function ConfettiPiece({ i }: { i: number }) {
  const color = COLORS[i % COLORS.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.6;
  const duration = 1.8 + Math.random() * 1.4;
  const size = 6 + Math.random() * 8;
  const rotate = Math.random() * 720 - 360;
  const shape = Math.random() > 0.5 ? "50%" : "2px";

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: "-20px",
        width: size,
        height: size * (Math.random() * 0.6 + 0.6),
        background: color,
        borderRadius: shape,
        boxShadow: `0 0 6px ${color}88`,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
      animate={{
        y: "110vh",
        opacity: [1, 1, 0],
        rotate,
        x: [0, (Math.random() - 0.5) * 120],
      }}
      transition={{
        duration,
        delay,
        ease: "easeIn",
      }}
    />
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(60)].map((_, i) => (
        <ConfettiPiece key={i} i={i} />
      ))}
    </div>
  );
}

// ── Glowing ring pulse ─────────────────────────────────────────────────────
function WinRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: COLORS[i * 2] }}
          initial={{ width: 80, height: 80, opacity: 0.8 }}
          animate={{ width: 320, height: 320, opacity: 0 }}
          transition={{
            duration: 1.6,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Result page ───────────────────────────────────────────────────────
export function Result() {
  const { state, setState, reset } = useGame();
  const navigate = useNavigate();
  const fight = state.fight;

  const [outro, setOutro] = useState<CampaignOutroData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!fight) navigate("/");
  }, [fight, navigate]);

  useEffect(() => {
    async function fetchOutro() {
      if (!state.campaignCompleted || !state.fight?.campaignSessionId) return;
      try {
        const data = await getOutro(state.fight.campaignSessionId);
        setOutro(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOutro();
  }, [state.campaignCompleted, state.fight?.campaignSessionId]);

  // Trigger confetti on win
  useEffect(() => {
    if (!fight) return;
    const won = fight.status === "player_won";
    if (won) {
      setShowConfetti(true);
      confettiTimer.current = setTimeout(() => setShowConfetti(false), 3500);
    }
    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
  }, [fight]);

  if (!fight) return null;

  const won = fight.status === "player_won";
  const campaignCompleted = state.campaignCompleted;

  async function handleNextFight() {
    if (!state.sessionId) return;
    try {
      const nextFight = await startNextFight(state.sessionId);
      const enemy = await getCreature(nextFight.enemyCreatureId);
      setState((prev) => ({
        ...prev,
        fight: nextFight,
        enemy,
        campaignCompleted: false,
      }));
      navigate("/game");
    } catch (err) {
      console.error("Failed to start next fight:", err);
    }
  }

  function handleHome() {
    reset();
    navigate("/");
  }

  const titleText = campaignCompleted
    ? "Campaign Complete!"
    : won
    ? "Victory!"
    : "Defeated";

  const subtitleText = campaignCompleted
    ? "You've conquered the entire campaign."
    : won
    ? "The enemy has fallen. Onward!"
    : "Better luck next time, challenger.";

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-6 min-h-screen p-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      {/* Animated bg glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: won
            ? [
                "radial-gradient(circle at 50% 40%, #7c3aed22 0%, transparent 70%)",
                "radial-gradient(circle at 50% 40%, #a855f733 0%, transparent 70%)",
                "radial-gradient(circle at 50% 40%, #7c3aed22 0%, transparent 70%)",
              ]
            : "radial-gradient(circle at 50% 40%, #ef444418 0%, transparent 70%)",
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Confetti */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Central card */}
      <motion.div
        className="relative flex flex-col items-center gap-6 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Ring pulse on win */}
        {won && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2">
            <WinRing />
          </div>
        )}

        {/* Icon */}
        <motion.div
          className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: won
              ? "linear-gradient(135deg, #3b0072 0%, #7c3aed 100%)"
              : "linear-gradient(135deg, #1a0008 0%, #7f1d1d 100%)",
            border: won ? "2px solid #a855f7" : "2px solid #ef4444",
            boxShadow: won
              ? "0 0 40px #a855f755, 0 0 80px #7c3aed33"
              : "0 0 30px #ef444433",
          }}
          animate={
            won
              ? { boxShadow: ["0 0 30px #a855f755", "0 0 60px #a855f799", "0 0 30px #a855f755"] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {campaignCompleted ? "🏆" : won ? "⚔️" : "💀"}
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <motion.h1
            className="font-black tracking-widest uppercase"
            style={{
              fontSize: "2rem",
              background: won
                ? "linear-gradient(90deg, #c084fc, #e879f9, #818cf8, #a855f7)"
                : "linear-gradient(90deg, #ef4444, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {titleText}
          </motion.h1>

          <motion.p
            className="text-purple-400 text-sm mt-1 font-mono tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {subtitleText}
          </motion.p>
        </div>

        {/* Outro (campaign complete) */}
        <AnimatePresence>
          {campaignCompleted && outro && (
            <motion.div
              className="flex flex-col items-center gap-4 w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className="rounded-xl overflow-hidden border border-purple-700/50"
                style={{ boxShadow: "0 0 24px #7c3aed33" }}
              >
                <img
                  src={`src/assets/${outro.outroImage}`}
                  alt="Campaign Outro"
                  className="w-full object-cover max-h-48"
                />
              </div>
              <p
                className="text-center text-sm leading-relaxed px-2"
                style={{ color: "#d8b4fe", fontFamily: "monospace" }}
              >
                {outro.outroText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #7c3aed55, transparent)",
          }}
        />

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {won && !campaignCompleted && (
            <motion.button
              onClick={handleNextFight}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase"
              style={{
                background:
                  "linear-gradient(135deg, #3b0072 0%, #7c3aed 60%, #a855f7 100%)",
                border: "1px solid #a855f7",
                color: "#fff",
                boxShadow: "0 0 20px #7c3aed55",
                letterSpacing: "0.18em",
              }}
            >
              ⚔ Next Fight
            </motion.button>
          )}

          <motion.button
            onClick={handleHome}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
              border: "1px solid #7c3aed55",
              color: "#c084fc",
              letterSpacing: "0.18em",
            }}
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
