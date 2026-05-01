import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { RoundLogEntry } from "../types/campaign.types";

type LogProp = {
  logs: RoundLogEntry[];
  speed?: number;
  delay?: number;
  effectDelay?: number;
  onDone?: () => void;
  onStep?: (entry: RoundLogEntry) => void;
};

export function LogBox({
  logs,
  speed = 25,
  delay = 700,
  effectDelay = 250,
  onDone,
  onStep,
}: LogProp) {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  const onDoneRef = useRef(onDone);
  const onStepRef = useRef(onStep);

  onDoneRef.current = onDone;
  onStepRef.current = onStep;

  useEffect(() => {
    setLineIndex(0);
    setText("");
  }, [logs]);

  useEffect(() => {
    if (logs.length === 0) return;

    if (lineIndex >= logs.length) {
      onDoneRef.current?.();
      return;
    }

    const entry = logs[lineIndex];
    const full = entry.text;
    let i = 0;

    setText("");

    const interval = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;

      if (i >= full.length) {
        clearInterval(interval);

        setTimeout(() => {
          onStepRef.current?.(entry);

          setTimeout(() => {
            setLineIndex((prev) => prev + 1);
          }, delay);
        }, effectDelay);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lineIndex, logs, speed, delay, effectDelay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0018 0%, #12002a 100%)",
        border: "1px solid #7c3aed44",
        boxShadow: "0 0 20px #7c3aed18, inset 0 0 30px #3b0072 11",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5"
        style={{
          background: "linear-gradient(90deg, #3b0072 0%, #1e003a 100%)",
          borderBottom: "1px solid #7c3aed33",
        }}
      >
        <span className="text-purple-300 text-[9px] font-black tracking-widest uppercase">
          Battle Log
        </span>
      </div>

      {/* Text area */}
      <div className="px-4 py-3 min-h-11 flex items-center">
        <p
          className="text-sm font-mono tracking-wide"
          style={{ color: "#e9d5ff" }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}