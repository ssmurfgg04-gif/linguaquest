import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Send, Loader2, Check, MessageSquare, Clock, HelpCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Ujuziverse" },
      { name: "description", content: "Get in touch with Creative Divine Concepts Ltd. Nairobi, Kenya. +254 733 985142." },
    ],
  }),
  component: ContactPage,
});

const FAQ = [
  { q: "What is Ujuziverse?", a: "Ujuziverse is an AI-powered platform for learning, practicing, creating, and thriving. Built by Creative Divine Concepts Ltd for Africa's youth." },
  { q: "Is Ujuziverse free?", a: "Yes! Start for free. We offer premium features for advanced simulations, creator tools, and institution plans." },
  { q: "Who is Ujuziverse for?", a: "Students, creators, young professionals, schools, NGOs, and corporate partners across Africa." },
  { q: "How do I get started?", a: "Create a free account, choose your journey, and start learning with AI-powered simulations and coaching." },
  { q: "Can schools partner with Ujuziverse?", a: "Yes! Visit our Partner page or contact us directly to discuss institution plans and pilot programs." },
];

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setName(""); setEmail(""); setMessage("");
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-6 grid lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-display text-3xl sm:text-4xl">Get in Touch</h1>
            <p className="text-muted-foreground mt-2">Have a question, partnership idea, or just want to say hello? We'd love to hear from you.</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border/60">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Visit Us</p>
                  <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border/60">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Call Us</p>
                  <p className="text-sm text-muted-foreground">+254 733 985142</p>
                  <p className="text-xs text-muted-foreground">Mon–Fri 9:00 AM – 5:00 PM (EAT)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border/60">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Email Us</p>
                  <p className="text-sm text-muted-foreground">info@creativedivineconcepts.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Send a Message</h2>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email" className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message…" rows={4} className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <button
                type="submit"
                disabled={loading || !name || !email || !message}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <><Check className="h-4 w-4" /> Sent!</> : <><Send className="h-4 w-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </section>

        <section className="mt-12 surface-card p-6 rounded-2xl border border-border/60">
          <h2 className="text-display text-xl flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions</h2>
          <div className="mt-4 space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-border/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm hover:bg-accent transition-colors"
                >
                  {item.q}
                  <span className={`transition-transform ${faqOpen === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {faqOpen === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
