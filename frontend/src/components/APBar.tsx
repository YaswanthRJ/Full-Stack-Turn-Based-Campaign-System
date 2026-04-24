
export function APBar({ current, max }: { current: number; max: number }) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.max(0, Math.min(100, (current / safeMax) * 100));

  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getAPColor = (pct: number) => {
    if (pct > 60) return "#3b82f6";
    if (pct > 30) return "#eab308";
    return "#f97316";
  };

  const apColor = getAPColor(percentage);

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#1e1b4b" strokeWidth="10" />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke={apColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold uppercase" style={{ color: apColor }}>AP</span>
        <span className="text-white text-sm font-bold">{current}</span>
      </div>
    </div>
  );
}