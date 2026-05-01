import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-2"
      style={{
        background: "linear-gradient(180deg, #0a0015 0%, #0d001f 100%)",
        borderRadius: "1.25rem",
        border: "1px solid #4c1d9522",
      }}
    >
      <AnimatePresence mode="wait">
        {!showInfo ? (
          /* ACTIONS VIEW */
          <motion.div
            key="actions"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onClick={() => onSelect(action.id)}
                  disabled={disabled}
                  currentAp={currentAp}
                />
              ))}
            </div>

            {/* Bottom row: Skip Turn + Info */}
            <div className="flex gap-2">
              <motion.button
                onClick={() => onSelect(NO_ACTION)}
                disabled={disabled}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="flex-1 py-2.5 rounded-xl font-black text-sm tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, #1a0035 0%, #2d0055 100%)",
                  border: "1px solid #7c3aed55",
                  color: "#c084fc",
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                Skip Turn
              </motion.button>

              <motion.button
                onClick={() => setShowInfo(true)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="px-4 py-2.5 rounded-xl font-black text-sm tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, #1a0035 0%, #2d0055 100%)",
                  border: "1px solid #7c3aed55",
                  color: "#a855f7",
                }}
              >
                Info
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* INFO VIEW - Description list */
          <motion.div
            key="info"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {actions.map((action) => {
                const powerPercent = Math.round(action.multiplier * 100);
                const accuracyPercent = Math.round(action.accuracy * 100);

                return (
                  <div
                    key={action.id}
                    className="rounded-xl p-3"
                    style={{
                      background: "linear-gradient(135deg, #0d0018 0%, #1a0030 100%)",
                      border: "1px solid #7c3aed44",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-purple-200">
                        {action.name}
                      </span>
                      <span className="text-[10px] text-purple-400 font-mono">
                        {action.actionWeight} AP
                      </span>
                    </div>

                    <p className="text-[11px] text-purple-400/70 leading-relaxed mb-2">
                      {action.description || "No description available."}
                    </p>

                    <div className="flex gap-3 text-[9px] font-mono">
                      <span className="text-purple-500">
                        POW {powerPercent}%
                      </span>
                      <span className="text-purple-500">
                        ACC {accuracyPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back button */}
            <motion.button
              onClick={() => setShowInfo(false)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="w-full py-2.5 rounded-xl font-black text-sm tracking-widest uppercase"
              style={{
                background: "linear-gradient(135deg, #1a0035 0%, #2d0055 100%)",
                border: "1px solid #7c3aed55",
                color: "#c084fc",
              }}
            >
              ← Back to Actions
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}