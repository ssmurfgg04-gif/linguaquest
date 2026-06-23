import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Ujuziverse" },
      { name: "description", content: "Workshops, bootcamps, webinars, creator camps, competitions, and live masterclasses." },
    ],
  }),
  component: EventsPage,
});

const EVENTS = [
  { emoji: "💻", title: "Web Development Bootcamp", date: "July 15–19, 2026", type: "Bootcamp", spots: "24 spots left" },
  { emoji: "🎤", title: "Public Speaking Masterclass", date: "July 22, 2026", type: "Webinar", spots: "Free" },
  { emoji: "🎨", title: "Content Creator Camp", date: "August 5–7, 2026", type: "Camp", spots: "18 spots left" },
  { emoji: "💼", title: "Pitch Competition", date: "August 20, 2026", type: "Competition", spots: "Register now" },
];

function EventsPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">📅</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Events</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Upcoming Events</h1>
          <p className="mt-2 text-white/85 max-w-lg">Workshops, bootcamps, competitions, and live masterclasses.</p>
        </section>

        <section className="mt-8 space-y-4">
          {EVENTS.map((e, i) => (
            <div key={i} className="surface-card p-5 border border-border/60 flex flex-col sm:flex-row sm:items-center gap-4 hover:-translate-y-0.5 hover:shadow-pop transition-all">
              <div className="text-4xl">{e.emoji}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{e.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.date}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.type}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {e.spots}</span>
                </div>
              </div>
              <button
                onClick={() => toast(`Registered for ${e.title}!`, { description: `We'll send event details to your email. See you on ${e.date.split(",")[0]}! 📅` })}
                className="shrink-0 rounded-full bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 shadow-pop hover:scale-105 transition-transform"
              >
                Register
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
