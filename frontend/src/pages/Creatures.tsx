import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Creature } from "../types/creature.types";
import { getCreatures } from "../service/creatures.service";
import { useStartCampaign } from "../context/useStartCampaign";

// ── Background ─────────────────────────────────────────────────────────────
function BgLayer() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(circle at center, #7c3aed11 0%, transparent 80%)",
      }}
    />
  );
}

// ── Creature card ──────────────────────────────────────────────────────────
type CreatureCardProps = {
  data: Creature;
  onSelect: () => void;
  isSelected: boolean;
};

function CreatureCard({ data, onSelect, isSelected }: CreatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-xl p-3"
        style={{
          background: isSelected
            ? "linear-gradient(135deg, #12002a 0%, #1e003a 100%)"  // Just slightly lighter
            : "linear-gradient(135deg, #0d0018 0%, #1a0030 100%)",
          border: isSelected ? "1px solid #7c3aed88" : "1px solid #7c3aed33",  // Same color, more opaque
        }}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className="shrink-0 w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: "#1a0033",
              border: "1px solid #7c3aed44",
            }}
          >
            <img
              src={`/src/assets/${data.imageUrl}`}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-base text-purple-200">
              {data.name}
            </h2>
            <p className="text-[11px] text-purple-400/60 leading-relaxed mt-0.5">
              {data.description}
            </p>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="shrink-0">
              <span className="text-purple-500 text-lg">✓</span>
            </div>
          )}
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

  if (!creatures) {
    return (
      <div
        className="relative flex flex-col min-h-screen items-center justify-center"
        style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
        <span className="text-purple-400 font-mono text-xs mt-3">Loading creatures...</span>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <BgLayer />

      <div className="relative flex flex-col px-5 pt-4 pb-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-6">
          <h1 className="font-black text-xl tracking-widest uppercase text-purple-200">
            Choose Your Creature
          </h1>
        </div>

        {/* Creature list */}
        <div className="flex flex-col gap-2 mb-8">
          {creatures.map((creature) => (
            <CreatureCard
              key={creature.id}
              data={creature}
              onSelect={() => setSelectedCreatureId(creature.id)}
              isSelected={selectedCreatureId === creature.id}
            />
          ))}
        </div>

        {/* Begin button - always visible */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => selectedCreatureId && begin(campaignId, selectedCreatureId)}
          disabled={!selectedCreatureId}
          className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase transition-all"
          style={{
            background: selectedCreatureId
              ? "linear-gradient(135deg, #2e0066, #4c1d95)"
              : "#1a0033",
            color: selectedCreatureId ? "#d8b4fe" : "#4c1d95",
            border: "1px solid #7c3aed44",
            opacity: selectedCreatureId ? 1 : 0.6,
            cursor: selectedCreatureId ? "pointer" : "default",
          }}
          whileTap={{ scale: selectedCreatureId ? 0.97 : 1 }}
        >
         Begin
        </motion.button>
      </div>
    </div>
  );
}