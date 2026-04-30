import { motion } from "framer-motion";
import type { Action } from "../types/action.types";

type ActionButtonProps = {
  action: Action;
  onClick: () => void;
  disabled?: boolean;
  starve?: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  NORMAL: "#9ca3af",
  FIRE: "#f97316",
  WATER: "#38bdf8",
  GRASS: "#4ade80",
  PSYCHC: "#e879f9",
  FLYING: "#818cf8",
  ELECTRIC: "#facc15",
  ICE: "#67e8f9",
  FIGHT: "#f87171",
  POISON: "#c084fc",
  GROUND: "#a16207",
  ROCK: "#78716c",
  BUG: "#84cc16",
  GHOST: "#7c3aed",
  DRAGON: "#6366f1",
  DARK: "#374151",
  STEEL: "#94a3b8",
  FAIRY: "#f9a8d4",
};

export function ActionButton({
  action,
  onClick,
  disabled,
  starve,
}: ActionButtonProps) {
  const accuracyPercent = Math.round(action.accuracy * 100);
  const typeColor = TYPE_COLORS[action.type ?? "NORMAL"] ?? "#9ca3af";
  const isDisabled = disabled || starve;

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.93 }}
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-xl text-left focus:outline-none"
      style={{
        background: starve
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #1e003a 0%, #2d0050 60%, #1a0035 100%)",
        border: starve
          ? "1px solid #374151"
          : `1px solid ${typeColor}55`,
        boxShadow: starve
          ? "none"
          : `0 0 10px ${typeColor}22, inset 0 0 20px #7c3aed11`,
        opacity: starve ? 0.45 : 1,
      }}
    >
      {/* Shimmer on hover */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(120deg, transparent 30%, ${typeColor}15 50%, transparent 70%)`,
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="p-3 flex flex-col gap-1.5">
        {/* Move name */}
        <span
          className="font-black text-sm tracking-wide truncate"
          style={{ color: starve ? "#6b7280" : "#f3e8ff" }}
        >
          {action.name}
        </span>

        {/* Type badge + stats */}
        <div className="flex items-center justify-between gap-1">
          <span
            className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-md uppercase"
            style={{
              background: `${typeColor}22`,
              color: typeColor,
              border: `1px solid ${typeColor}44`,
            }}
          >
            {action.type ?? "NORMAL"}
          </span>
          <div className="flex gap-2">
            <span className="text-[9px] text-purple-400 font-bold">
              ACC {accuracyPercent}%
            </span>
            <span
              className="text-[9px] font-bold"
              style={{ color: typeColor }}
            >
              AP {action.actionWeight}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}