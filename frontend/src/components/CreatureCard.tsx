import { motion, AnimatePresence } from "framer-motion";
import { StatBar } from "./StatBar";

type AnimEvent =
  | "player_move"
  | "enemy_move"
  | "player_hit"
  | "enemy_hit"
  | "player_miss"
  | "enemy_miss"
  | "player_skip"
  | "enemy_skip"
  | "player_defeated"
  | "enemy_defeated"
  | null;

type CreatureCardProps = {
  imageUrl?: string;
  name: string;
  hpCurrent: number;
  hpMax: number;
  apCurrent: number;
  apMax: number;
  isEnemy?: boolean;
  level?: number;
  anim?: AnimEvent;
};

export function CreatureCard({
  imageUrl,
  name,
  hpCurrent,
  hpMax,
  apCurrent,
  apMax,
  isEnemy = false,
  level,
  anim = null,
}: CreatureCardProps) {
  const hpPct = (hpCurrent / Math.max(hpMax, 1)) * 100;
  const hpColor =
    hpPct > 60 ? "#a855f7" : hpPct > 30 ? "#eab308" : "#ef4444";

  const apPct = (apCurrent / Math.max(apMax, 1)) * 100;
  const apColor = apPct > 60 ? "#818cf8" : "#f97316";

  const isTarget =
    (anim?.startsWith("enemy_") && isEnemy) ||
    (anim?.startsWith("player_") && !isEnemy);

  const isHit = isTarget && anim?.endsWith("_hit");
  const isMiss = isTarget && anim?.endsWith("_miss");

  return (
    <motion.div
      initial={{ opacity: 0, x: isEnemy ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative flex ${isEnemy ? "flex-row-reverse" : "flex-row"
        } items-center gap-4 px-4 py-3 rounded-2xl`}
      style={{
        background: isEnemy
          ? "linear-gradient(135deg, #0b0015 0%, #0a102a 60%, #070018 100%)"
          : "linear-gradient(135deg, #0d0015 0%, #1a0030 60%, #0a001a 100%)",
        border: isEnemy ? "1px solid #60a5fa33" : "1px solid #7c3aed55",
        boxShadow: isEnemy ? "0 4px 24px #60a5fa22" : "0 4px 24px #7c3aed22",
      }}
    >
      {/* Sprite */}
      <div className="relative shrink-0">
        <motion.div
          className="w-24 h-24 rounded-xl overflow-hidden border-2"
          style={{
            borderColor: isEnemy ? "#60a5fa44" : "#7c3aed55",
            background:
              "radial-gradient(circle at 40% 40%, #2e0060 0%, #0d0015 100%)",
            boxShadow: isEnemy ? "0 0 14px #60a5fa33" : "0 0 14px #7c3aed44",
          }}
          animate={{
            opacity: isHit || isMiss ? 0.35 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              style={{
                imageRendering: "auto",
                transform: "translateZ(0)",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-purple-200 text-3xl font-black">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </motion.div>

        {/* HIT / MISS overlay */}
        <AnimatePresence>
          {(isHit || isMiss) && (
            <motion.div
              key={anim}
              initial={{ opacity: 0, scale: 0.7, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -6 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="px-2 py-1 rounded-lg text-xs font-black tracking-widest"
                style={{
                  background: isHit
                    ? "linear-gradient(90deg, #ef4444 0%, #f97316 100%)"
                    : "linear-gradient(90deg, #64748b 0%, #334155 100%)",
                  color: "white",
                  border: "1px solid #ffffff33",
                  boxShadow: isHit
                    ? "0 0 16px #ef444466"
                    : "0 0 14px #94a3b833",
                }}
              >
                {isHit ? "HIT" : "MISS"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level badge */}
        {level !== undefined && level !== null && (
          <div
            className="absolute -bottom-1 -right-1 rounded-md px-1.5 text-[8px] font-black text-white tracking-wide"
            style={{
              background: isEnemy
                ? "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                : "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
              border: "1px solid #ffffff22",
            }}
          >
            Lv{level}
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={`flex-1 flex flex-col gap-2 min-w-0 ${isEnemy ? "items-end" : "items-start"
          }`}
      >
        <span className="text-white font-black text-sm tracking-wide truncate uppercase">
          {name}
        </span>

        <StatBar current={hpCurrent} max={hpMax} color={hpColor} label="HP" />
        <StatBar current={apCurrent} max={apMax} color={apColor} label="AP" />
      </div>
    </motion.div>
  );
}