import { APBar } from "./APBar";
import { HealthBar } from "./HealthBar";

type CreatureCardProps = {
  imageUrl?: string;
  name: string;
  hpCurrent: number;
  hpMax: number;
  apCurrent: number;
  apMax: number;
  isEnemy?: boolean;
};

export function CreatureCard({
  imageUrl,
  name,
  hpCurrent,
  hpMax,
  apCurrent,
  apMax,
  isEnemy = false,
}: CreatureCardProps) {
  const bgColor = isEnemy ? "bg-[#950606]" : "bg-indigo-950";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className={`w-full h-[180px] flex flex-col ${bgColor} rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10`}>
      <h3 className="text-indigo-200 font-bold text-sm truncate py-2 px-3 text-center border-b border-indigo-500/30 bg-indigo-950/50 rounded-t-xl shrink-0">
        {name}
      </h3>

      <div className="flex-1 flex items-center gap-3 p-3 min-h-0">
        {/* Avatar - takes full available height */}
        <div className="h-20 aspect-square rounded-full border-2 border-indigo-400/50 bg-indigo-950 overflow-hidden shrink-0 shadow-lg shadow-indigo-500/20">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-indigo-200 text-2xl font-bold">
                {firstLetter}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 h-full flex gap-4 items-center justify-center">
          <HealthBar current={hpCurrent} max={hpMax} />
          <APBar current={apCurrent} max={apMax} />
        </div>
      </div>
    </div>
  );
}