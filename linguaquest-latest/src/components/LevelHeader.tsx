import { Lock } from "lucide-react";
import type { Level } from "@/data/mock";

const GRADIENT_CLASS: Record<Level["gradient"], string> = {
  sunset: "gradient-sunset",
  ocean: "gradient-ocean",
  berry: "gradient-berry",
  meadow: "gradient-meadow",
  hero: "gradient-hero",
};

export function LevelHeader({ level, completed, total }: { level: Level; completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-soft ${GRADIENT_CLASS[level.gradient]}`}>
      <div className="absolute -right-6 -top-6 text-[10rem] opacity-15 select-none leading-none">
        {level.emoji}
      </div>
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Level {level.id}</p>
          <h2 className="text-display text-2xl sm:text-3xl mt-1">{level.title}</h2>
          <p className="mt-1 text-sm text-white/85 max-w-md">{level.theme}</p>
        </div>
        <div className="flex items-center gap-3">
          {!level.unlocked && (
            <span className="flex items-center gap-1 text-xs font-bold bg-black/20 px-3 py-1.5 rounded-full">
              <Lock className="h-3.5 w-3.5" /> Locked
            </span>
          )}
          <div className="text-right">
            <div className="text-xs font-semibold text-white/80">{completed} / {total} done</div>
            <div className="mt-1 w-32 h-2 rounded-full bg-black/20 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
