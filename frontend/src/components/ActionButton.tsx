import { motion } from "framer-motion";
import type { Action } from "../types/action.types";

type ActionButtonProps = {
  action: Action;
  onClick: () => void;
  disabled?: boolean;
  currentAp?: number;
};

export function ActionButton({
  action,
  onClick,
  disabled = false,
  currentAp = 0,
}: ActionButtonProps) {
  const hasInsufficientAp = currentAp < action.actionWeight;
  const isDisabled = disabled || hasInsufficientAp;

  const powerPercent = Math.round(action.multiplier * 100);
  const accuracyPercent = Math.round(action.accuracy * 100);

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      className="w-full rounded-xl px-3 py-2 text-left transition-all"
      style={{
        background: isDisabled
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #0d0018 0%, #1a0030 100%)",
        border: `1px solid ${isDisabled ? "#374151" : "#7c3aed66"}`,
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="font-black text-sm text-purple-100 truncate">
          {action.name}
        </span>

        <span
          className={`text-[11px] font-black ${
            hasInsufficientAp ? "text-red-400" : "text-purple-400"
          }`}
        >
          {action.actionWeight} AP
        </span>
      </div>

      {/* Bottom row (minimal stats) */}
      <div className="mt-1 text-[12px] text-purple-400 font-mono opacity-90">
        {powerPercent}% · {accuracyPercent}%
      </div>
    </motion.button>
  );
}