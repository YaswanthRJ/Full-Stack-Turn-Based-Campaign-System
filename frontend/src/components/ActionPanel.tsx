import { motion } from "framer-motion";
import type { Action } from "../types/action.types";
import { ActionButton } from "./ActionButton";

export const NO_ACTION = "NO_ACTION";

type ActionsPanelProps = {
  actions: Action[];
  onSelect: (actionId: string) => void;
  disabled?: boolean;
  currentAp?: number;
};

export function ActionsPanel({
  actions,
  onSelect,
  disabled = false,
  currentAp = 0,
}: ActionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex flex-col gap-2"
      style={{
        background:
          "linear-gradient(180deg, #0a0015 0%, #0d001f 100%)",
        borderRadius: "1.25rem",
        border: "1px solid #4c1d9522",
        padding: "12px",
        boxShadow: "0 -4px 30px #7c3aed18",
      }}
    >
      {/* Grid of action buttons */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 + 0.1 }}
          >
            <ActionButton
              action={a}
              onClick={() => onSelect(a.id)}
              disabled={disabled}
              starve={a.actionWeight > currentAp}
            />
          </motion.div>
        ))}
      </div>

      {/* Skip Turn / Cancel */}
      <motion.button
        onClick={() => onSelect(NO_ACTION)}
        disabled={disabled}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full py-2.5 rounded-xl font-black text-sm tracking-widest uppercase"
        style={{
          background:
            "linear-gradient(135deg, #1a0035 0%, #2d0055 100%)",
          border: "1px solid #7c3aed55",
          color: "#c084fc",
          letterSpacing: "0.18em",
          boxShadow: "0 2px 12px #7c3aed22",
          opacity: disabled ? 0.4 : 1,
        }}
      >
        Skip Turn
      </motion.button>
    </motion.div>
  );
}