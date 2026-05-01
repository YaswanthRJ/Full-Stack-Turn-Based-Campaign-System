import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSession, startNextFight } from "../service/campaign.service";
import { getCreature, getCreatureActions } from "../service/creatures.service";
import { useGame } from "../context/GameProvider";
import type { CurrentState } from "../types/campaign.types";

// ── Floating orb background ────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 180, x: "10%", y: "8%", color: "#7c3aed", delay: 0, duration: 7 },
    { size: 120, x: "70%", y: "15%", color: "#a855f7", delay: 1.5, duration: 9 },
    { size: 90, x: "55%", y: "55%", color: "#6d28d9", delay: 0.8, duration: 6 },
    { size: 60, x: "20%", y: "65%", color: "#e879f9", delay: 2, duration: 8 },
    { size: 40, x: "85%", y: "70%", color: "#818cf8", delay: 0.3, duration: 5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}44 0%, transparent 70%)`,
            filter: "blur(24px)",
          }}
          animate={{ y: [0, -24, 0], scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Particle sparks ────────────────────────────────────────────────────────
function Sparks() {
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    w: 2 + Math.random() * 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: ["#a855f7", "#e879f9", "#818cf8", "#c084fc"][i % 4],
    dur: 2 + Math.random() * 2,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.w,
            height: s.w,
            left: s.left,
            top: s.top,
            background: s.color,
            boxShadow: `0 0 6px ${s.color}`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Hero title ─────────────────────────────────────────────────────────────
function HeroTitle() {
  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Icon with subtle darker circle */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Subtle circle background - slightly darker */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            background: "radial-gradient(circle, #1a0033 0%, #0d001f 80%, transparent 100%)",
            border: "1px solid #7c3aed44",
          }}
        />
        
        {/* Icon - larger now */}
        <img 
          src="/src/assets/logo.png"
          alt="Game Logo"
          className="relative z-10 w-24 h-24 object-contain"
          style={{ filter: "drop-shadow(0 0 20px #a855f7)" }}
        />
      </div>

      {/* Game title */}
      <h1
        className="font-black tracking-widest uppercase text-center leading-none"
        style={{
          fontSize: "2.2rem",
          background: "linear-gradient(90deg, #c084fc 0%, #e879f9 40%, #818cf8 80%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.12em",
        }}
      >
        FSTBCS
      </h1>
    </div>
  );
}


// ── Menu button ────────────────────────────────────────────────────────────
interface MenuButtonProps {
  text: string;
  action: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: string;
  delay?: number;
}

function MenuButton({ text, action, variant = "secondary", icon, delay = 0 }: MenuButtonProps) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg, #4c0099 0%, #7c3aed 60%, #a855f7 100%)",
      border: "1px solid #c084fc",
      color: "#fff",
      boxShadow: "0 0 24px #7c3aed55, inset 0 1px 0 #ffffff22",
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
      transition={{ delay, duration: 0.35 }}
      className="relative w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase overflow-hidden"
      style={styles[variant]}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(120deg, transparent 30%, #ffffff0a 50%, transparent 70%)" }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      {icon && <span className="text-base">{icon}</span>}
      <span>{text}</span>
    </motion.button>
  );
}

// ── Home page ──────────────────────────────────────────────────────────────
export function Home() {
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
    <div
      className="relative flex flex-col overflow-hidden" style={{ height: "calc(100vh - 64px)" }}
      // style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <FloatingOrbs />
      <Sparks />

      <div className="relative flex flex-col items-center flex-1 px-6 pt-16 pb-10 gap-16">
        {/* Hero */}
        <HeroTitle />

        {/* Menu */}
        <div className="w-full max-w-xs flex flex-col gap-3 py-4">
         
          {canContinue && (
            <MenuButton text="Continue" action={handleContinue} variant="primary" icon="▶" delay={0.7} />
          )}
          <MenuButton text="New Campaign" action={() => navigate("/campaigns")} variant="secondary" icon="✦" delay={0.8} />
          <MenuButton text="Exit" action={() => console.log("exit game")} variant="ghost" icon="✕" delay={0.9} />
        </div>
      </div>
    </div>
  );
}