import type { Character } from "@/data/mock";

const GRADIENT_CLASS: Record<Character["gradient"], string> = {
  sunset: "gradient-sunset",
  ocean: "gradient-ocean",
  berry: "gradient-berry",
  meadow: "gradient-meadow",
  hero: "gradient-hero",
};

const SIZES = {
  sm: "h-12 w-12 text-2xl",
  md: "h-16 w-16 text-3xl",
  lg: "h-24 w-24 text-5xl",
  xl: "h-32 w-32 text-6xl",
} as const;

export function CharacterAvatar({
  character,
  size = "md",
  animate = false,
  ring = true,
}: {
  character: Character;
  size?: keyof typeof SIZES;
  animate?: boolean;
  ring?: boolean;
}) {
  return (
    <div className={`relative ${animate ? "animate-bob" : ""}`}>
      <div
        className={`${SIZES[size]} ${GRADIENT_CLASS[character.gradient]} ${
          ring ? "ring-4 ring-surface" : ""
        } rounded-full flex items-center justify-center shadow-soft select-none`}
        aria-hidden
      >
        <span>{character.emoji}</span>
      </div>
    </div>
  );
}
