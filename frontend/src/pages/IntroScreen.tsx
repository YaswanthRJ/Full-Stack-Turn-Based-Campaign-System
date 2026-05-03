import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import logo from "../assets/logo.png";

// ── Floating orbs ─────────────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 220, x: "5%",  y: "5%",  color: "#7c3aed", delay: 0, duration: 9 },
    { size: 160, x: "65%", y: "10%", color: "#a855f7", delay: 2, duration: 11 },
    { size: 100, x: "50%", y: "50%", color: "#6d28d9", delay: 1, duration: 8 },
    { size: 80,  x: "15%", y: "60%", color: "#e879f9", delay: 3, duration: 10 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}28 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Sparks ────────────────────────────────────────────────────────────────
function Sparks() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: 1.5 + Math.random() * 1.5,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        color: ["#a855f7", "#e879f9", "#818cf8", "#c084fc"][i % 4],
        dur: 3 + Math.random() * 3,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full will-change-transform"
          style={{ width: s.size, height: s.size, left: s.left, top: s.top, background: s.color }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Intro Screen ──────────────────────────────────────────────────────────
export function IntroScreen({ onStart }: { onStart: () => void }) {
  const [exiting, setExiting] = useState(false);

  function handleClick() {
  if (exiting) return;
  setExiting(true);
  setTimeout(onStart, 700);
}

  return (
    // backgroundColor on the wrapper itself — so when opacity fades to 0
    // the dark bg fades with it rather than revealing white underneath.
    // The child <div className="absolute inset-0 bg-[#080012]" /> alone is
    // not enough because it only covers *inside* the element; the composited
    // fade still blends against the document background.
    <motion.div
  className="relative h-dvh w-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
  style={{ backgroundColor: "#080012" }}
  onClick={handleClick}
  animate={
    exiting
      ? { opacity: 0, scale: 0.95, filter: "blur(6px)" }
      : { opacity: 1, scale: 1, filter: "blur(0px)" }
  }
  transition={{ duration: 0.7, ease: "easeInOut" }}
>
      {/* Animated atmosphere */}
      <FloatingOrbs />
      <Sparks />

      {/* Soft radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(4,0,16,0.8) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Logo */}
        <motion.div
          className="relative w-28 h-28 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full will-change-transform"
            style={{
              background: "radial-gradient(circle, #7c3aed22 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="relative w-28 h-28 flex items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle, #1a0033 0%, #0d001f 100%)",
              border: "1px solid rgba(124,58,237,0.22)",
            }}
          >
            <img
              src={logo}
              alt="Game logo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              style={{ filter: "drop-shadow(0 0 10px #a855f755)" }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-black tracking-[0.18em] uppercase text-center m-0"
          style={{
            fontSize: "2.1rem",
            lineHeight: 1,
            background: "linear-gradient(135deg, #c084fc 0%, #e879f9 45%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        >
          FSTBCS
        </motion.h1>

        {/* Hint */}
        <motion.p
          className="text-xs tracking-[0.28em] uppercase text-purple-300/50 m-0"
          style={{ height: "1.2em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.55, 1, 0.55] }}
          transition={{
            duration: 2.5,
            delay: 1.8,
            times: [0, 0.25, 0.55, 0.75, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ◈ &nbsp; tap anywhere to enter &nbsp; ◈
        </motion.p>
      </div>
    </motion.div>
  );
}