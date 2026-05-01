import { motion } from "framer-motion";

type StatBarProps = {
  current: number;
  max: number;
  color: string;
  label: string;
  showValues?: boolean;  // Optional: hide numbers for compact view
};

export function StatBar({ current, max, color, label, showValues = true }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(max, 1)) * 100));
  
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {showValues && (
        <div className="flex justify-between items-center">
          <span
            style={{ color }}
            className="text-[9px] font-black tracking-widest uppercase"
          >
            {label}
          </span>
          <span className="text-[9px] text-purple-300 font-bold">
            {current}/{max}
          </span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-black/60 border border-purple-900/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}