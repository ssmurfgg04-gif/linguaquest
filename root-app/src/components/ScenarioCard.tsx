import { Link } from "@tanstack/react-router";
import { Lock, Star, Clock } from "lucide-react";
import { CHARACTER_BY_ID, type Scenario } from "@/data/mock";
import { CharacterAvatar } from "./CharacterAvatar";

export function ScenarioCard({ scenario, locked = false }: { scenario: Scenario; locked?: boolean }) {
  const character = CHARACTER_BY_ID[scenario.characterId];

  const content = (
    <div
      className={`group relative h-full surface-card p-5 border border-border/60 transition-all ${
        locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-pop"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} size="md" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              with {character.name}
            </p>
            <h3 className="text-display text-lg leading-tight text-foreground">
              <span className="mr-1">{scenario.emoji}</span>
              {scenario.title}
            </h3>
          </div>
        </div>
        {locked && <Lock className="h-5 w-5 text-muted-foreground shrink-0" />}
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{scenario.summary}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < scenario.stars ? "fill-sun text-sun" : "text-muted"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {scenario.minutes} min
          </span>
          <span className="hidden sm:inline px-2 py-1 rounded-full bg-mint/20 text-mint-foreground border border-mint/30">
            {scenario.realLifeSkill}
          </span>
        </div>
      </div>
    </div>
  );

  if (locked) return <div>{content}</div>;
  return (
    <Link
      to="/scenarios/$scenarioId"
      params={{ scenarioId: scenario.id }}
      className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-ring rounded-2xl"
    >
      {content}
    </Link>
  );
}
