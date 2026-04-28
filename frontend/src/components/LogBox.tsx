import { useState, useEffect, useRef } from "react";
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
    if (lineIndex >= logs.length) {
      if (logs.length > 0) onDoneRef.current?.();
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

  if (logs.length === 0) return null;

  return <div className="p-3 font-mono text-sm min-h-[40px]">{text}</div>;
}