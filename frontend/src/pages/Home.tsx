import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSession, startNextFight } from "../service/campaign.service";
import { getCreature, getCreatureActions } from "../service/creatures.service";
import { useGame } from "../context/GameProvider";
import type { CurrentState } from "../types/campaign.types";

import { useLoopScreen } from "../music";
import purpleBg from "../assets/castle.jpg";

// ── Menu button ────────────────────────────────────────────────────────────
interface MenuButtonProps {
  text: string;
  action: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

function MenuButton({ text, action, variant = "secondary" }: MenuButtonProps) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)",
      border: "1px solid #a855f766",
      color: "#e9d5ff",
      boxShadow: "0 0 12px #7c3aed33",
    },
    secondary: {
      background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
      border: "1px solid #7c3aed66",
      color: "#d8b4fe",
      boxShadow: "0 0 12px #7c3aed22",
    },
    ghost: {
      background: "transparent",
      border: "1px solid #374151",
      color: "#6b7280",
      boxShadow: "none",
    },
  };

  return (
    <motion.button
      onClick={action}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase overflow-hidden"
      style={styles[variant]}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, transparent 30%, #ffffff0a 50%, transparent 70%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <span>{text}</span>
    </motion.button>
  );
}

// ── Home page ──────────────────────────────────────────────────────────────
export function Home() {
  useLoopScreen("home");
  const [sessionState, setSessionState] = useState<CurrentState | null>(null);
  const { setState: setGameState } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then((res) => setSessionState(res));
  }, []);

  const canContinue = sessionState?.currentSession?.status === "active";

  async function handleContinue() {
    if (!sessionState?.currentSession) return;
    const session = sessionState.currentSession;
    let fight = sessionState.currentFight;
    if (!fight) fight = await startNextFight(session.id);

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
    <motion.div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        backgroundImage: `url(${purpleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(5, 0, 20, 0.45)" }}
      />

      <div className="relative flex flex-col flex-1 px-6 pb-10">
        <div className="flex-1" />

        <div className="w-full max-w-xs mx-auto flex flex-col gap-3 py-4 mb-20">
          {canContinue && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <MenuButton text="Continue" action={handleContinue} variant="primary" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <MenuButton
              text="New Campaign"
              action={() => navigate("/campaigns")}
              variant="secondary"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <MenuButton text="Exit" action={() => console.log("exit game")} variant="ghost" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}