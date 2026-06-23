import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Award, Briefcase, Star, Zap, DollarSign, Users, Save, ChevronLeft, ExternalLink, Clock, MapPin, X, Check } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

const SAVED_OPPS_KEY = "lq.saved.opps";
const APPLIED_KEY = "lq.applied.opps";

interface OppListing {
  id: string;
  emoji: string;
  title: string;
  org: string;
  type: string;
  description: string;
  requirements: string[];
  deadline: string;
  location: string;
  reward: string;
  link?: string;
  gradient: string;
}

function getSaved(): string[] { try { return JSON.parse(localStorage.getItem(SAVED_OPPS_KEY) || "[]"); } catch { return []; } }
function saveSaved(ids: string[]) { localStorage.setItem(SAVED_OPPS_KEY, JSON.stringify(ids)); }
function getApplied(): string[] { try { return JSON.parse(localStorage.getItem(APPLIED_KEY) || "[]"); } catch { return []; } }
function saveApplied(ids: string[]) { localStorage.setItem(APPLIED_KEY, JSON.stringify(ids)); }

const OPPORTUNITIES: OppListing[] = [
  { id: "scholarship-1", emoji: "📚", title: "Mastercard Foundation Scholars Program", org: "Mastercard Foundation", type: "Scholarship", description: "Full scholarship for African students pursuing undergraduate studies at partner universities. Covers tuition, accommodation, books, and a stipend.", requirements: ["African citizen", "Strong academic record", "Leadership potential", "Under 29 years old"], deadline: "August 30, 2026", location: "Multiple African countries", reward: "Full tuition + stipend", gradient: "gradient-ocean" },
  { id: "scholarship-2", emoji: "📚", title: "Aga Khan Foundation International Scholarship", org: "Aga Khan Foundation", type: "Scholarship", description: "50/50 grant and loan for outstanding students from developing countries pursuing postgraduate studies.", requirements: ["Outstanding academic record", "Admitted to a reputable university", "Under 30 years old", "From a developing country"], deadline: "March 31, 2027", location: "International", reward: "50% grant + 50% loan", gradient: "gradient-ocean" },
  { id: "comp-1", emoji: "🏆", title: "African Storytelling Challenge", org: "Ujuziverse", type: "Competition", description: "Share your story of growth, resilience, or innovation in under 3 minutes. Top 3 win cash prizes and mentorship.", requirements: ["African resident", "Ages 15-30", "Original content", "Video or written format"], deadline: "July 31, 2026", location: "Online", reward: "$500 + mentorship", gradient: "gradient-sunset" },
  { id: "comp-2", emoji: "🏆", title: "Hult Prize Campus Challenge", org: "Hult Prize Foundation", type: "Competition", description: "The world's largest student competition for social entrepreneurship. Form a team and solve a pressing social challenge.", requirements: ["University student", "Team of 3-4", "Social business idea", "Any nationality"], deadline: "December 15, 2026", location: "Your campus", reward: "$1,000,000 prize", gradient: "gradient-sunset" },
  { id: "job-1", emoji: "💼", title: "Junior Content Creator — African Languages", org: "Ujuziverse", type: "Job", description: "Create educational content in Swahili, French, or Amharic. Remote, flexible hours. Perfect for creative students and recent graduates.", requirements: ["Fluent in one African language", "Creative writing skills", "Basic video editing", "Reliable internet"], deadline: "Open until filled", location: "Remote — Africa", reward: "$300-600/month", gradient: "gradient-meadow" },
  { id: "job-2", emoji: "💼", title: "Social Media Intern", org: "Creative Divine Concepts", type: "Job", description: "Manage social media accounts, create engaging content, and grow online communities. 3-month internship with potential for full-time.", requirements: ["Active social media user", "Creative eye for content", "18+ years old", "Based in Kenya or remote"], deadline: "July 15, 2026", location: "Nairobi, Kenya / Remote", reward: "KES 25,000/month", gradient: "gradient-meadow" },
  { id: "intern-1", emoji: "📋", title: "Product Design Intern", org: "Andela", type: "Internship", description: "Learn from world-class designers while working on real products. Mentorship, portfolio projects, and career guidance included.", requirements: ["Portfolio of design work", "Understanding of Figma", "Strong communication", "Ages 18-28"], deadline: "September 1, 2026", location: "Lagos / Nairobi / Remote", reward: "Paid internship", gradient: "gradient-berry" },
  { id: "brand-1", emoji: "🤝", title: "Brand Ambassador — Education Tech", org: "Ujuziverse", type: "Brand Deal", description: "Represent Ujuziverse at your school or university. Earn commissions for every student you refer. Top ambassadors get bonus perks.", requirements: ["Currently enrolled student", "Active on social media", "Passionate about education", "Good communication skills"], deadline: "Rolling applications", location: "Any African country", reward: "Commission per referral + perks", gradient: "gradient-sunset" },
  { id: "funding-1", emoji: "💰", title: "Tony Elumelu Foundation Entrepreneurship Programme", org: "Tony Elumelu Foundation", type: "Funding", description: "$5,000 seed capital for African entrepreneurs. Includes 12-week business training, mentorship, and access to a network of 15,000+ alumni.", requirements: ["African citizen", "For-profit business idea", "Business must be based in Africa", "18+ years old"], deadline: "March 1, 2027", location: "All 54 African countries", reward: "$5,000 + training", gradient: "gradient-ocean" },
  { id: "freelance-1", emoji: "🎯", title: "Freelance Translator — English/Swahili/French", org: "Multiple Platforms", type: "Freelance Gig", description: "Translate educational content, marketing materials, or app interfaces. Flexible hours, work from anywhere. Build your portfolio while earning.", requirements: ["Fluent in 2+ languages", "Attention to detail", "Reliable internet", "Meet deadlines"], deadline: "Ongoing", location: "Remote", reward: "$10-30 per 1000 words", gradient: "gradient-meadow" },
  { id: "pitch-1", emoji: "🎤", title: "Africa Startup Pitch Competition", org: "Africa Business Heroes", type: "Pitch Competition", description: "Pitch your startup idea to a panel of judges. Top 10 finalists receive intensive mentorship and the winner receives $300,000 in grant funding.", requirements: ["Startup based in Africa", "Founder must be African", "Business must be operational", "Scalable business model"], deadline: "June 30, 2027", location: "Pan-African", reward: "$300,000 grand prize", gradient: "gradient-berry" },
];

const TYPE_FILTERS = [
  { id: "all", label: "All", emoji: "🎯" },
  { id: "Scholarship", label: "Scholarships", emoji: "📚" },
  { id: "Competition", label: "Competitions", emoji: "🏆" },
  { id: "Job", label: "Jobs", emoji: "💼" },
  { id: "Internship", label: "Internships", emoji: "📋" },
  { id: "Brand Deal", label: "Brand Deals", emoji: "🤝" },
  { id: "Funding", label: "Funding", emoji: "💰" },
  { id: "Freelance Gig", label: "Freelance", emoji: "🎯" },
  { id: "Pitch Competition", label: "Pitch", emoji: "🎤" },
];

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "UjuziLaunch — Opportunities Hub | Ujuziverse" },
      { name: "description", content: "Discover scholarships, competitions, jobs, internships, brand deals, and funding opportunities." },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const [filter, setFilter] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<OppListing | null>(null);
  const [savedOpps, setSavedOpps] = useState<string[]>(getSaved);
  const [appliedOpps, setAppliedOpps] = useState<string[]>(getApplied);

  const filtered = filter === "all" ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.type === filter);

  const toggleSave = (id: string) => {
    const next = savedOpps.includes(id) ? savedOpps.filter((x) => x !== id) : [...savedOpps, id];
    saveSaved(next);
    setSavedOpps(next);
    toast(next.includes(id) ? "Saved!" : "Removed from saved", {
      description: next.includes(id) ? "Find it in your saved list anytime." : "",
    });
  };

  const handleApply = (opp: OppListing) => {
    if (appliedOpps.includes(opp.id)) return;
    const next = [...appliedOpps, opp.id];
    saveApplied(next);
    setAppliedOpps(next);
    toast(`Applied to ${opp.title}!`, {
      description: `We've noted your interest. ${opp.org} will be in touch if selected. Good luck!`,
    });
  };

  // Detail view
  if (selectedOpp) {
    const isSaved = savedOpps.includes(selectedOpp.id);
    const isApplied = appliedOpps.includes(selectedOpp.id);
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24">
          <button
            onClick={() => setSelectedOpp(null)}
            className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Opportunities
          </button>

          <section className="mt-4 relative overflow-hidden rounded-3xl gradient-meadow text-white p-6 sm:p-8 shadow-soft">
            <div className="text-5xl mb-3">{selectedOpp.emoji}</div>
            <h1 className="text-display text-2xl sm:text-3xl">{selectedOpp.title}</h1>
            <p className="text-sm text-white/80 mt-1">{selectedOpp.org}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{selectedOpp.type}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedOpp.deadline}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedOpp.location}</span>
            </div>
          </section>

          <section className="mt-6 surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg">About This Opportunity</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selectedOpp.description}</p>
          </section>

          <section className="mt-4 surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg">Requirements</h2>
            <ul className="mt-3 space-y-2">
              {selectedOpp.requirements.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-mint-foreground shrink-0 mt-0.5" /> {r}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 surface-card p-6 rounded-2xl border border-border/60">
            <h2 className="text-display text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-sun-foreground" /> Reward / Compensation</h2>
            <p className="mt-2 text-lg font-bold">{selectedOpp.reward}</p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleApply(selectedOpp)}
              disabled={isApplied}
              className={`inline-flex items-center gap-2 rounded-full font-bold px-6 py-3 text-sm shadow-pop hover:scale-105 transition-transform ${
                isApplied ? "bg-mint text-mint-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              {isApplied ? <><Check className="h-4 w-4" /> Applied</> : <>Apply Now <ExternalLink className="h-4 w-4" /></>}
            </button>
            <button
              onClick={() => toggleSave(selectedOpp.id)}
              className={`inline-flex items-center gap-2 rounded-full border font-bold px-5 py-3 text-sm transition-colors ${
                isSaved ? "bg-primary/10 text-primary border-primary" : "border-border bg-surface hover:bg-accent"
              }`}
            >
              <Save className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} /> {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // List view
  const savedList = savedOpps.length > 0 ? OPPORTUNITIES.filter((o) => savedOpps.includes(o.id)) : [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-meadow text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🌟</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziLaunch</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Opportunities Hub</h1>
          <p className="mt-2 text-white/85 max-w-lg">Discover scholarships, competitions, jobs, and funding. Your next big break starts here.</p>
          <div className="mt-3 flex gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-bold">{OPPORTUNITIES.length} opportunities</span>
            {appliedOpps.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-bold"><Check className="h-3.5 w-3.5" /> {appliedOpps.length} applied</span>
            )}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {TYPE_FILTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                  filter === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-accent"
                }`}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((o) => {
              const isSaved = savedOpps.includes(o.id);
              const isApplied = appliedOpps.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpp(o)}
                  className="w-full surface-card p-5 border border-border/60 flex flex-col sm:flex-row sm:items-center gap-4 hover:-translate-y-0.5 hover:shadow-pop transition-all text-left group"
                >
                  <div className="text-4xl shrink-0">{o.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base">{o.title}</h3>
                      {isApplied && <span className="text-[10px] font-bold text-mint-foreground bg-mint/20 px-2 py-0.5 rounded-full">Applied</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.org}</p>
                    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {o.deadline}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {o.reward}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(o.id); }}
                      className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors ${
                        isSaved ? "bg-primary/10 text-primary border-primary" : "border-border bg-surface hover:bg-accent text-muted-foreground"
                      }`}
                      aria-label={isSaved ? "Unsave" : "Save"}
                    >
                      <Save className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center">
                      <ChevronLeft className="h-4 w-4 rotate-180" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 surface-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground font-semibold">No {filter} opportunities right now.</p>
              <p className="text-xs text-muted-foreground mt-1">Check back soon — new ones are added regularly.</p>
            </div>
          )}
        </section>

        {savedList.length > 0 && (
          <section className="mt-10">
            <h2 className="text-display text-xl flex items-center gap-2 mb-4"><Save className="h-5 w-5 text-primary" /> Saved Opportunities</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {savedList.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpp(o)}
                  className="surface-card p-4 border border-border/60 text-left hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{o.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{o.title}</p>
                      <p className="text-[11px] text-muted-foreground">{o.org} · {o.deadline}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}