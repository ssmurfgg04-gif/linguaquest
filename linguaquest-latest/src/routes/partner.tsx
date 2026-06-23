import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, BookOpen, Users, BarChart3, Download, Calendar, CheckCircle, Loader2, Send, Sparkles, Target, Eye, Heart } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner With Us — Ujuziverse" },
      { name: "description", content: "Schools, NGOs, government, and corporate partners. Partner with Ujuziverse to empower Africa's youth." },
    ],
  }),
  component: PartnerPage,
});

const PARTNER_TYPES = [
  { emoji: "🏫", title: "Schools", desc: "Track student progress, assign programs, and measure impact." },
  { emoji: "🤝", title: "NGOs", desc: "Scale youth impact programs with AI-powered tools." },
  { emoji: "🏦", title: "Financial Institutions", desc: "Empower entrepreneurs and creators with skills training." },
  { emoji: "🏛️", title: "Government", desc: "Support national youth skill development initiatives." },
  { emoji: "💼", title: "Corporates", desc: "Build talent pipelines and upskill your workforce." },
];

const CASE_STUDIES = [
  { emoji: "🏫", title: "Kenyan Secondary School", result: "42% improvement in English proficiency over 6 months", students: "1,200+ students" },
  { emoji: "🤝", title: "Youth NGO Partnership", result: "3,500 youth trained in communication skills", students: "85% completion rate" },
  { emoji: "🏦", title: "Bank Entrepreneurship Program", result: "200+ young entrepreneurs supported", students: "60% launched businesses" },
];

function PartnerPage() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.org) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: "", email: "", org: "", role: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 1000);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-hero text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🤝</div>
          <h1 className="text-display text-3xl sm:text-4xl">Partner With Us</h1>
          <p className="mt-2 text-white/85 max-w-xl">Empower Africa's next generation. Schools, NGOs, government, and corporate partners — let's build the future together.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-display text-2xl">The Problem</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">Millions of young Africans lack access to practical, AI-powered skill-building tools. Traditional education doesn't prepare them for real-world communication, creativity, and career opportunities.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-display text-xl">How Ujuziverse Works</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            <div className="surface-card p-5 border border-border/60 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3"><Target className="h-5 w-5" /></div>
              <h3 className="font-bold">Assess</h3>
              <p className="text-sm text-muted-foreground mt-1">AI-powered skill assessment and goal setting.</p>
            </div>
            <div className="surface-card p-5 border border-border/60 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3"><Sparkles className="h-5 w-5" /></div>
              <h3 className="font-bold">Train</h3>
              <p className="text-sm text-muted-foreground mt-1">Immersive simulations and AI coaching.</p>
            </div>
            <div className="surface-card p-5 border border-border/60 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3"><BarChart3 className="h-5 w-5" /></div>
              <h3 className="font-bold">Measure</h3>
              <p className="text-sm text-muted-foreground mt-1">Track progress with detailed impact reports.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-display text-xl">Case Studies</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {CASE_STUDIES.map((c, i) => (
              <div key={i} className="surface-card p-5 border border-border/60">
                <div className="text-3xl mb-2">{c.emoji}</div>
                <h3 className="font-bold">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{c.result}</p>
                <p className="text-xs text-primary font-bold mt-2">{c.students}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid lg:grid-cols-2 gap-8">
          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Request a Demo</h2>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Your email" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Organization" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Your role" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your needs…" rows={3} className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <button type="submit" disabled={loading || !form.name || !form.email || !form.org} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <><CheckCircle className="h-4 w-4" /> Request Sent</> : <><Send className="h-4 w-4" /> Request Demo</>}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-6 rounded-2xl border border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="text-display text-lg">Download Resources</h2>
              </div>
              <p className="text-sm text-muted-foreground">Get our concept note and case study PDFs to share with your team.</p>
              <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface border border-border font-bold text-sm px-4 py-2 hover:bg-accent transition-colors">
                <Download className="h-4 w-4" /> Download Concept Note
              </button>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-display text-lg">Who We Partner With</h2>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {PARTNER_TYPES.map((p, i) => (
                  <div key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border/60 px-3 py-1.5 text-xs font-bold">
                    <span>{p.emoji}</span> {p.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
