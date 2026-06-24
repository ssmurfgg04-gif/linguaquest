import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { USER_STATS } from "@/data/mock";
import { BottomNavBar } from "./BottomNavBar";
import { loadXPState, getLevelEmoji, getLevelName } from "@/lib/xp-system";

const AUTH_KEY = "lq.auth";

interface AuthUser {
  name: string;
  email: string;
  language: string;
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lq.dark") === "true";
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [, setKey] = useState(0);
  const [xpState, setXpState] = useState(() => loadXPState());

  useEffect(() => {
    setUser(getStoredUser());
    setXpState(loadXPState());
  }, []);

  // Re-read on focus (e.g. user signs out from another tab)
  useEffect(() => {
    const handler = () => {
      const u = getStoredUser();
      setUser(u);
      setXpState(loadXPState());
      setKey((k) => k + 1);
    };
    window.addEventListener("focus", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("focus", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("lq.dark", String(dark));
  }, [dark]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/simulations", label: "Simulations" },
    { to: "/creator-studio", label: "Studio" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/institutions", label: "Institutions" },
    { to: "/about", label: "About Us" },
  ];

  const name = user?.name ?? USER_STATS.name;
  const initial = name[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <span className="text-3xl group-hover:animate-wiggle inline-block">🚀</span>
            <span className="text-display text-xl sm:text-2xl">
              <span className="text-foreground">Ujuzi</span><span className="text-primary">verse</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-tight mt-0.5">
              Learn. Practice.<br />Create. Thrive.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {links.slice(0, 6).map((l) => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* XP Level Badge — visible when user has XP */}
            {xpState.totalXP > 0 && (
              <Link
                to="/badges"
                className="hidden sm:flex items-center gap-1.5 h-9 rounded-full bg-sun/20 border border-sun/30 px-3 hover:bg-sun/30 transition-colors"
                title={`${getLevelName(xpState.level)} — ${xpState.totalXP} XP`}
              >
                <span className="text-sm">{getLevelEmoji(xpState.level)}</span>
                <span className="text-xs font-bold text-sun-foreground">Lv.{xpState.level}</span>
                <Sparkles className="h-3 w-3 text-sun-foreground" />
              </Link>
            )}

            <button
              onClick={() => setDark((d) => !d)}
              className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-surface font-bold text-xs px-3 h-8 hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground font-bold text-xs px-3 h-8 shadow-pop hover:scale-105 transition-transform"
            >
              Try Free
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-grape text-primary-foreground text-display text-sm font-bold shadow-soft hover:scale-105 transition-transform"
              aria-label={user ? `Dashboard` : "Sign in"}
            >
              {initial}
            </Link>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md px-4 py-3 space-y-1">
            {/* Show XP level in mobile menu too */}
            {xpState.totalXP > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 mb-1 rounded-xl bg-sun/10 border border-sun/20">
                <span className="text-lg">{getLevelEmoji(xpState.level)}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-sun-foreground">{getLevelName(xpState.level)} — Level {xpState.level}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-sun-foreground" style={{ width: `${Math.min(100, (xpState.currentLevelXP / xpState.nextLevelXP) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-sun-foreground">{xpState.totalXP} XP</span>
              </div>
            )}
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <BottomNavBar />
    </>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
      activeProps={{ className: "bg-accent text-foreground" }}
    >
      {children}
    </Link>
  );
}

function StatChip({
  icon, value, label, tone,
}: { icon: React.ReactNode; value: number; label: string; tone: "coral" | "sun" }) {
  const toneClass = tone === "coral"
    ? "bg-coral/15 text-coral border-coral/30"
    : "bg-sun/25 text-sun-foreground border-sun/40";
  return (
    <div
      className={`hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-full border font-bold text-sm ${toneClass}`}
      title={`${value} ${label}`}
    >
      {icon}
      <span>{value}</span>
    </div>
  );
}