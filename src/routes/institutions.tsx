import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, BarChart3, Award, BookOpen, TrendingUp, Download, Mail, CheckCircle, Shield } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions — Ujuziverse for Schools & Partners" },
      { name: "description", content: "UjuziImpact — Institution portal for schools, NGOs, and partners. Track learners, generate reports, and measure impact." },
    ],
  }),
  component: InstitutionsPage,
});

const FEATURES = [
  { icon: <Users className="h-5 w-5" />, title: "Total Learners", desc: "Track all enrolled students and their progress.", gradient: "gradient-ocean" },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Progress Rates", desc: "Real-time data on module completion and skill growth.", gradient: "gradient-sunset" },
  { icon: <BookOpen className="h-5 w-5" />, title: "Active Modules", desc: "See which simulations and courses are most used.", gradient: "gradient-meadow" },
  { icon: <Award className="h-5 w-5" />, title: "Certificates Earned", desc: "Track certifications and achievements.", gradient: "gradient-berry" },
  { icon: <TrendingUp className="h-5 w-5" />, title: "Impact Reports", desc: "Generate detailed reports for stakeholders.", gradient: "gradient-ocean" },
  { icon: <Shield className="h-5 w-5" />, title: "Admin Controls", desc: "Invite users, assign programs, manage access.", gradient: "gradient-sunset" },
];

function InstitutionsPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🏫</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziImpact</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">For Institutions</h1>
          <p className="mt-2 text-white/85 max-w-lg">Empower your students and track their growth with Ujuziverse's institution portal.</p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl ${f.gradient} text-white p-5 shadow-soft`}>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">{f.icon}</div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-xs text-white/80 mt-1">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Dashboard Overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-surface border border-border/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">1,247</p>
                <p className="text-xs text-muted-foreground">Total Learners</p>
              </div>
              <div className="bg-surface border border-border/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-mint-foreground">78%</p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
              <div className="bg-surface border border-border/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-sun-foreground">342</p>
                <p className="text-xs text-muted-foreground">Certificates</p>
              </div>
              <div className="bg-surface border border-border/60 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-coral">12</p>
                <p className="text-xs text-muted-foreground">Active Programs</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg flex items-center gap-2"><Download className="h-5 w-5 text-primary" /> Reports & Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => toast("Report downloading…", { description: "Your impact report is being generated. 📊" })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-border/60 hover:bg-accent transition-colors text-sm font-bold"
              >
                <span>Download Impact Report</span> <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => toast("Invite users", { description: "Share your institution code with learners. ✉️" })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-border/60 hover:bg-accent transition-colors text-sm font-bold"
              >
                <span>Invite Users</span> <Mail className="h-4 w-4 text-muted-foreground" />
              </button>
              <Link to="/partner" className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/60 hover:bg-accent transition-colors text-sm font-bold">
                <span>Request a Demo</span> <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
