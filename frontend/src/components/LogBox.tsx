import { useState, useEffect } from "react";

type LogProp = {
  logs: string[];
  speed?: number;
  delay?: number;
  onDone?: () => void;
};

export function LogBox({ logs, speed = 25, delay = 700, onDone }: LogProp) {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    setLineIndex(0);
    setText("");
  }, [logs]);

  useEffect(() => {
    if (lineIndex >= logs.length) {
      if (logs.length > 0) onDone?.();
      return;
    }

    const full = logs[lineIndex];
    let i = 0;

    setText("");

    const interval = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;

      if (i >= full.length) {
        clearInterval(interval);

        setTimeout(() => {
          setLineIndex((prev) => prev + 1);
        }, delay);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lineIndex, logs, speed, delay, onDone]);

  if (logs.length === 0) return null;

  return (
    <div className="p-3 font-mono text-sm min-h-[40px]">
      {text}
    </div>
  );
}