import { useEffect, useState } from "react";
import { getUserStats } from "../service/user.service";
import type { UserStats } from "../types/user.types";

export function UserStatsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const res = await getUserStats();
      setStats(res);
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Static ambient orbs — no animation, no layout cost */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 220, height: 220,
            left: "15%", top: "10%",
            background: "radial-gradient(circle, #7c3aed33 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 160, height: 160,
            left: "70%", top: "55%",
            background: "radial-gradient(circle, #e879f933 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="relative flex flex-col flex-1 px-6 pt-10 pb-10 gap-10 items-center">
        <h1
          className="font-black tracking-widest uppercase text-center leading-none"
          style={{
            fontSize: "2rem",
            background: "linear-gradient(90deg, #c084fc 0%, #e879f9 40%, #818cf8 80%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.12em",
          }}
        >
          Stats
        </h1>

        <div
          className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
          style={{
            background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
            border: "1px solid #7c3aed66",
            boxShadow: "0 0 14px #7c3aed22",
          }}
        >
          {loading && (
            <p className="text-center text-sm tracking-widest uppercase text-purple-200">
              Loading...
            </p>
          )}
          {!loading && !stats && (
            <p className="text-center text-sm tracking-widest uppercase text-red-300">
              Failed to load stats
            </p>
          )}
          {!loading && stats && (
            <>
              <StatRow label="Completed Campaigns" value={stats.completedCampaigns} />
              <StatRow label="Fights" value={stats.fights} />
              <StatRow label="Wins" value={stats.wins} />
              <StatRow label="Losses" value={stats.losses} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(124,58,237,0.25)",
      }}
    >
      <span className="text-xs font-black tracking-widest uppercase text-purple-200">
        {label}
      </span>
      <span className="text-lg font-black text-purple-100">{value}</span>
    </div>
  );
}