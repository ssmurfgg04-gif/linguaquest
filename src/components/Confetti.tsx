// Lightweight confetti component — no external dependencies
// Renders CSS-animated confetti pieces that auto-cleanup

import { useEffect, useState, useCallback } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  size: number;
  shape: "circle" | "rect" | "star";
}

const COLORS = [
  "var(--color-primary)",
  "var(--color-sun)",
  "var(--color-mint)",
  "var(--color-sky)",
  "var(--color-grape)",
  "var(--color-coral)",
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function Confetti({ show, count = 60 }: { show: boolean; count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const trigger = useCallback(() => {
    if (show) setPieces(generatePieces(count));
  }, [show, count]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (!show) setPieces([]);
  }, [show]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--confetti-rotation": `${p.rotation}deg`,
          } as React.CSSProperties}
        >
          {p.shape === "circle" ? (
            <div
              className="rounded-full"
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
            />
          ) : p.shape === "rect" ? (
            <div
              style={{
                width: p.size * 0.6,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: 2,
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          ) : (
            <div
              className="text-lg"
              style={{ color: p.color, fontSize: p.size + 2 }}
            >
              {["✦", "★", "✧", "⭐"][p.id % 4]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// XP popup that floats up and fades out
export function XPPopup({ xp, show, label }: { xp: number; show: boolean; label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none animate-xp-float">
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl animate-bounce">✨</span>
        <span className="text-2xl font-bold text-sun-foreground drop-shadow-lg">+{xp} XP</span>
        {label && <span className="text-sm font-semibold text-foreground/80">{label}</span>}
      </div>
    </div>
  );
}

// Level up celebration overlay
export function LevelUpOverlay({ show, level, onClose }: { show: boolean; level: number; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  useEffect(() => {
    if (!visible && show) onClose();
  }, [visible, show, onClose]);

  if (!visible) return null;

  const emojis = ["🌱", "🌿", "🌻", "⭐", "🔥", "💎", "🚀", "👑", "🌟", "🏆"];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 animate-fade-in" />
      <div className="relative animate-scale-in flex flex-col items-center gap-3 p-8 rounded-3xl bg-surface border border-border shadow-pop">
        <span className="text-7xl animate-bounce">{emojis[Math.min(level - 1, emojis.length - 1)]}</span>
        <h2 className="text-display text-3xl text-primary">Level Up!</h2>
        <p className="text-xl font-bold text-foreground">You're now Level {level}!</p>
        <p className="text-sm text-muted-foreground">Keep going, superstar!</p>
      </div>
      <Confetti show={visible} count={80} />
    </div>
  );
}