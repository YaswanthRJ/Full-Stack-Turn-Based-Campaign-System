import { motion } from "framer-motion";

type CreatureCardProps = {
  imageUrl?: string;
  name: string;
  hpCurrent: number;
  hpMax: number;
  apCurrent: number;
  apMax: number;
  isEnemy?: boolean;
  isDefending?: boolean;
  level?: number;
};

function StatBar({
  current,
  max,
  color,
  label,
}: {
  current: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(max, 1)) * 100));
  return (
    <div className="flex flex-col gap-0.5 w-full">
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

export function CreatureCard({
  imageUrl,
  name,
  hpCurrent,
  hpMax,
  apCurrent,
  apMax,
  isEnemy = false,
  isDefending = false,
  level,
}: CreatureCardProps) {
  const hpPct = (hpCurrent / Math.max(hpMax, 1)) * 100;
  const hpColor =
    hpPct > 60 ? "#a855f7" : hpPct > 30 ? "#eab308" : "#ef4444";
  const apColor =
    (apCurrent / Math.max(apMax, 1)) * 100 > 60
      ? "#818cf8"
      : "#f97316";

  return (
    <motion.div
      initial={{ opacity: 0, x: isEnemy ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex ${isEnemy ? "flex-row-reverse" : "flex-row"} items-center gap-3 px-3 py-2 rounded-2xl border border-purple-700/40 shadow-lg`}
      style={{
        background:
          "linear-gradient(135deg, #0d0015 0%, #1a0030 60%, #0a001a 100%)",
        boxShadow: isDefending
          ? "0 0 18px 4px #a855f766, inset 0 0 20px #7c3aed22"
          : "0 4px 24px #7c3aed22",
      }}
    >
      {/* Defending glow ring */}
      {isDefending && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-purple-400 pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Sprite */}
      <div className="relative shrink-0">
        <motion.div
          className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-600/50"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, #2e0060 0%, #0d0015 100%)",
            boxShadow: "0 0 12px #7c3aed44",
          }}
          animate={
            isDefending
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {imageUrl ? (
            <img
              src={`src/assets/${imageUrl}`}
              alt={name}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-purple-200 text-3xl font-black">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </motion.div>
        {/* Level badge */}
        {level && (
          <div className="absolute -bottom-1 -right-1 bg-purple-700 border border-purple-400 rounded-md px-1.5 text-[8px] font-black text-white tracking-wide">
            Lv{level}
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={`flex-1 flex flex-col gap-2 min-w-0 ${isEnemy ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex items-center gap-1.5 w-full ${isEnemy ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-white font-black text-sm tracking-wide truncate uppercase">
            {name}
          </span>
          {isEnemy && (
            <span className="text-purple-400 text-[9px] font-bold tracking-widest shrink-0">
              FOE
            </span>
          )}
        </div>

        <StatBar
          current={hpCurrent}
          max={hpMax}
          color={hpColor}
          label="HP"
        />
        <StatBar
          current={apCurrent}
          max={apMax}
          color={apColor}
          label="AP"
        />
      </div>
    </motion.div>
  );
}