import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Users, Calendar, Star, BookOpen, Trophy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Ujuziverse" },
      { name: "description", content: "Join Africa's community of learners, creators, and professionals. Discussion boards, study groups, mentorship, and more." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🌍</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Community</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Connect & Grow Together</h1>
          <p className="mt-2 text-white/85 max-w-lg">Safe space for Africa's youth. Discuss, create, mentor, and celebrate wins.</p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { emoji: "💬", title: "Discussion Boards", desc: "Ask questions, share ideas, get feedback." },
            { emoji: "📚", title: "Study Groups", desc: "Learn together with peers across Africa." },
            { emoji: "🎨", title: "Creator Circles", desc: "Connect with fellow creators." },
            { emoji: "🧠", title: "Mentorship", desc: "Get guidance from experienced professionals." },
            { emoji: "🎪", title: "Events", desc: "Workshops, bootcamps, and live sessions." },
            { emoji: "🏆", title: "Celebrate Wins", desc: "Share your achievements with the community." },
          ].map((c, i) => (
            <button
              key={i}
              onClick={() => toast(`${c.title}`, { description: "Community features are being built. Join our waitlist to get early access! 🌍" })}
              className="surface-card p-5 border border-border/60 hover:-translate-y-1 hover:shadow-pop transition-all cursor-pointer text-left"
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
