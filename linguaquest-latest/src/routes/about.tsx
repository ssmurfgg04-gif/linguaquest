import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, Heart, Target, Users, Mail, Phone, MapPin } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Ujuziverse by Creative Divine Concepts" },
      { name: "description", content: "Ujuziverse is a product of Creative Divine Concepts Ltd. We build tools that help Africa's youth learn, practice, create, and thrive." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: <Eye className="h-5 w-5" />, title: "Vision", desc: "A future where every young African has the skills, confidence, and opportunities to thrive." },
  { icon: <Heart className="h-5 w-5" />, title: "Mission", desc: "Build AI-powered tools that make skill-building accessible, engaging, and practical for Africa's youth." },
  { icon: <Target className="h-5 w-5" />, title: "Values", desc: "Innovation. Inclusion. Integrity. Impact." },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-8 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-display text-4xl sm:text-5xl">
            <span className="text-foreground">Ujuzi</span><span className="text-primary">verse</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">A product of Creative Divine Concepts Ltd</p>
        </section>

        <section className="mt-10 grid sm:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <div key={i} className="surface-card p-6 text-center border border-border/60">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">{v.icon}</div>
              <h2 className="font-bold text-lg">{v.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{v.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 surface-card p-6 rounded-2xl border border-border/60">
          <h2 className="text-display text-xl flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Meet the Team</h2>
          <p className="text-sm text-muted-foreground mt-2">Creative Divine Concepts Ltd brings together expertise in web development, AI, design, and education technology to build tools that empower Africa's next generation.</p>
        </section>

        <section className="mt-10 surface-card p-6 rounded-2xl border border-border/60">
          <h2 className="text-display text-xl mb-4">Contact Us</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Nairobi, Kenya
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" /> +254 733 985142
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" /> info@creativedivineconcepts.com
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Mon–Fri 9:00 AM – 5:00 PM (East Africa Time)</p>
        </section>
      </main>
    </div>
  );
}
