import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Creature } from "../types/creature.types";
import { getCreatures } from "../service/creatures.service";
import { useStartCampaign } from "../context/useStartCampaign";

// ── Background ─────────────────────────────────────────────────────────────
function BgLayer() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#7c3aed22 1px, transparent 1px),
            linear-gradient(90deg, #7c3aed22 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7c3aed33 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </>
  );
}

// ── Stat pip row ───────────────────────────────────────────────────────────
function StatPips({ label, value, max = 5, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-black tracking-widest uppercase w-6" style={{ color }}>
        {label}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-1.5 rounded-sm"
            style={{
              background: i < value ? color : "#1e003a",
              border: `1px solid ${i < value ? color + "88" : "#7c3aed22"}`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Creature card ──────────────────────────────────────────────────────────
type CreatureCellProps = {
  data: Creature;
  onSelect: () => void;
  isSelected: boolean;
  index: number;
};

function CreatureCell({ data, onSelect, isSelected, index }: CreatureCellProps) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;

  // Derive simple visual stats from whatever fields exist
  const hp = (data as any).maxHp ?? (data as any).hp ?? 3;
  const ap = (data as any).maxActionPoint ?? (data as any).ap ?? 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: "easeOut" }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: isSelected
          ? "linear-gradient(135deg, #1e003a 0%, #3b0072 100%)"
          : "linear-gradient(135deg, #0d0018 0%, #1a0030 100%)",
        border: isSelected
          ? "1px solid #c084fc"
          : hovered
          ? "1px solid #7c3aed"
          : "1px solid #7c3aed33",
        boxShadow: isSelected
          ? "0 0 32px #a855f766, inset 0 0 40px #7c3aed18"
          : hovered
          ? "0 0 20px #7c3aed44"
          : "0 4px 16px #7c3aed11",
        transition: "border 0.25s, box-shadow 0.25s, background 0.25s",
      }}
    >
      {/* Slide-in shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, transparent 0%, #a855f711 50%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: active ? "100%" : "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Selection glow pulse */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ border: "1px solid #c084fc44" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      <div className="flex gap-4 p-4">
        {/* Avatar */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <motion.div
            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 40% 35%, #3b0072 0%, #0d0015 100%)",
              border: isSelected ? "2px solid #a855f7" : "1px solid #7c3aed44",
              boxShadow: isSelected ? "0 0 16px #a855f755" : "none",
            }}
            animate={isSelected ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {(data as any).imageUrl ? (
              <img
                src={`src/assets/${(data as any).imageUrl}`}
                alt={data.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span
                className="text-2xl font-black"
                style={{ color: isSelected ? "#e9d5ff" : "#9333ea" }}
              >
                {data.name.charAt(0)}
              </span>
            )}
          </motion.div>

          {/* Selected check */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <span className="text-[9px] font-black tracking-widest text-purple-300 uppercase">
                  Selected
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2
              className="font-black text-sm leading-tight"
              style={{ color: isSelected ? "#f3e8ff" : "#d8b4fe" }}
            >
              {data.name}
            </h2>
            {isSelected && (
              <motion.span
                className="text-lg shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✦
              </motion.span>
            )}
          </div>

          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "#9333ea88" }}>
            {data.description}
          </p>

          {/* Stat pips */}
          <div className="flex flex-col gap-1 mt-auto">
            <StatPips label="HP" value={Math.min(Math.round(hp / 20), 5)} color="#a855f7" />
            <StatPips label="AP" value={Math.min(Math.round(ap / 2), 5)} color="#818cf8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Creatures ─────────────────────────────────────────────────────────
export function Creatures() {
  const [creatures, setCreatures] = useState<Creature[] | null>(null);
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null);
  const { campaignId } = useParams();
  const { begin } = useStartCampaign();

  useEffect(() => {
    if (!campaignId) return;
    getCreatures(campaignId).then((data) => setCreatures(data));
  }, [campaignId]);

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <BgLayer />

      <div className="relative flex flex-col h-full gap-4 p-5 pb-6">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-1 pt-4"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="font-black text-xl tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, #c084fc, #e879f9, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Creatures
          </h1>
          <p className="text-purple-500 text-xs font-mono tracking-widest">
            Choose your champion
          </p>
          <motion.div
            className="w-24 h-px mt-2"
            style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.div>

        {/* List */}
        <div className="flex-1 overflow-auto flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {!creatures ? (
              <motion.div
                key="loading"
                className="flex flex-col items-center gap-3 py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border-4 border-purple-600 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-purple-400 font-mono text-xs tracking-widest">Loading...</span>
              </motion.div>
            ) : creatures.length === 0 ? (
              <motion.p
                key="empty"
                className="text-center text-purple-500 font-mono py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No creatures available
              </motion.p>
            ) : (
              <motion.div key="list" className="flex flex-col gap-3">
                {creatures.map((c, i) => (
                  <CreatureCell
                    key={c.id}
                    data={c}
                    index={i}
                    onSelect={() => setSelectedCreatureId(c.id)}
                    isSelected={selectedCreatureId === c.id}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Begin button */}
        <motion.button
          onClick={() => begin(campaignId, selectedCreatureId)}
          disabled={!selectedCreatureId}
          whileTap={{ scale: selectedCreatureId ? 0.96 : 1 }}
          whileHover={{ scale: selectedCreatureId ? 1.02 : 1 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase overflow-hidden"
          style={{
            background: selectedCreatureId
              ? "linear-gradient(135deg, #4c0099 0%, #7c3aed 60%, #a855f7 100%)"
              : "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
            border: selectedCreatureId ? "1px solid #c084fc" : "1px solid #7c3aed33",
            color: selectedCreatureId ? "#fff" : "#4c1d95",
            boxShadow: selectedCreatureId ? "0 0 24px #7c3aed55" : "none",
            transition: "all 0.3s",
          }}
        >
          {/* Shimmer */}
          {selectedCreatureId && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(120deg, transparent 20%, #ffffff15 50%, transparent 80%)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span className="relative z-10">
            {selectedCreatureId ? "⚔ Begin Campaign" : "Select a Creature"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}