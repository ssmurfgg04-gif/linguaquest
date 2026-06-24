import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Wand2, Calendar, Image, PenTool, Music, Podcast, Award, Video, ChevronLeft, Copy, Download, Loader2, RotateCcw, Save, Check, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

const SAVED_KEY = "lq.creator.saved";

interface SavedItem { id: string; tool: string; title: string; content: string; date: string; }

function getSaved(): SavedItem[] { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; } }
function saveSaved(items: SavedItem[]) { localStorage.setItem(SAVED_KEY, JSON.stringify(items)); }

const TOOLS = [
  { id: "script", icon: <Wand2 className="h-5 w-5" />, title: "Script Generator", desc: "Write scripts for videos, podcasts, and presentations.", gradient: "gradient-sunset", placeholder: "What's your video/podcast about? (e.g. 'A 60-second TikTok about study tips for exams')", templates: [
    { label: "YouTube Intro", prompt: "Create a 30-second YouTube video intro about" },
    { label: "Podcast Opener", prompt: "Write a podcast opening for a show about" },
    { label: "Presentation Script", prompt: "Write a 2-minute presentation script about" },
    { label: "Short Film Scene", prompt: "Write a dramatic scene for a short film about" },
  ]},
  { id: "video", icon: <Video className="h-5 w-5" />, title: "Video Planner", desc: "Plan your content calendar and video ideas.", gradient: "gradient-ocean", placeholder: "What's your niche? (e.g. 'education, tech reviews, lifestyle')", templates: [
    { label: "Week Plan", prompt: "Plan 5 video ideas for a week of content about" },
    { label: "Series Outline", prompt: "Create a 4-part video series about" },
    { label: "Vlog Ideas", prompt: "Generate 10 vlog ideas about" },
  ]},
  { id: "calendar", icon: <Calendar className="h-5 w-5" />, title: "Content Calendar", desc: "Schedule and manage your content.", gradient: "gradient-meadow", placeholder: "How often do you post? What platforms? (e.g. '3x/week on TikTok and YouTube')", templates: [
    { label: "Monthly Plan", prompt: "Create a monthly content calendar for" },
    { label: "Weekly Schedule", prompt: "Plan a weekly posting schedule for" },
  ]},
  { id: "thumbnail", icon: <Image className="h-5 w-5" />, title: "Thumbnail Ideas", desc: "AI-generated thumbnail concepts.", gradient: "gradient-berry", placeholder: "What's the video about? (e.g. 'How to pass math exams')", templates: [
    { label: "Clickbait Style", prompt: "Design a bold thumbnail concept for a video about" },
    { label: "Clean & Minimal", prompt: "Design a clean, professional thumbnail for" },
    { label: "Text-Heavy", prompt: "Create a text-focused thumbnail concept for" },
  ]},
  { id: "caption", icon: <PenTool className="h-5 w-5" />, title: "Caption Generator", desc: "Engaging captions for every platform.", gradient: "gradient-sunset", placeholder: "What's the post about? (e.g. 'I just hit 1000 followers!')", templates: [
    { label: "Instagram Post", prompt: "Write an engaging Instagram caption for a post about" },
    { label: "TikTok Caption", prompt: "Write a viral TikTok caption for a video about" },
    { label: "LinkedIn Post", prompt: "Write a professional LinkedIn post about" },
  ]},
  { id: "brand", icon: <Sparkles className="h-5 w-5" />, title: "Brand Kit", desc: "Build and manage your brand identity.", gradient: "gradient-ocean", placeholder: "Describe your brand. (e.g. 'A youth tech education brand called CodeKids')", templates: [
    { label: "Brand Bio", prompt: "Write a brand bio and tagline for" },
    { label: "Mission Statement", prompt: "Write a mission statement for" },
    { label: "Brand Voice Guide", prompt: "Create a brand voice guide for" },
  ]},
  { id: "song", icon: <Music className="h-5 w-5" />, title: "Songwriting Assistant", desc: "Lyrics, melodies, and hooks.", gradient: "gradient-berry", placeholder: "What's the song about? What genre? (e.g. 'Afrobeats love song')", templates: [
    { label: "Full Lyrics", prompt: "Write complete lyrics for an" },
    { label: "Chorus/Hook", prompt: "Write a catchy chorus/hook for an" },
    { label: "Verse", prompt: "Write a verse for an" },
  ]},
  { id: "podcast", icon: <Podcast className="h-5 w-5" />, title: "Podcast Planner", desc: "Plan episodes, guests, and topics.", gradient: "gradient-meadow", placeholder: "What's your podcast about? (e.g. 'A podcast about African tech startups')", templates: [
    { label: "Episode Plan", prompt: "Plan a full podcast episode about" },
    { label: "Guest Questions", prompt: "Write interview questions for a guest on a podcast about" },
    { label: "Season Outline", prompt: "Outline a 6-episode season for a podcast about" },
  ]},
];

function generateContent(toolId: string, prompt: string): string {
  const p = prompt.trim();
  if (!p) return "";

  if (toolId === "script") {
    return `# ${p}\n\n## Opening Hook (0-5 seconds)\n"${getRandomOpener()}"\n\n## Main Content (5-45 seconds)\n${generateScriptBody(p)}\n\n## Call to Action (45-60 seconds)\n"${getRandomCTA()}"\n\n---\n**Tips:**\n- Speak with energy and clarity\n- Use hand gestures to emphasize key points\n- Look directly at the camera\n- Keep sentences short and punchy`;
  }

  if (toolId === "caption") {
    const captions = [
      `${p}\n\nThis changed everything for me. Here's what I learned:\n\n1. Start before you're ready\n2. Consistency beats talent\n3. Your unique voice is your superpower\n\nWho else needed to hear this? Drop a comment!\n\n#contentcreator #growthmindset #africancreators`,
      `${p}\n\nI wasn't going to post this, but here we are.\n\nThe truth is: progress isn't always pretty. Some days you show up and nothing works. But you show up anyway.\n\nThat's the secret. Just keep showing up.\n\nSave this for when you need a reminder.\n\n#motivation #creatorjourney #keepgoing`,
      `${p}\n\nPOV: You finally figured out what works.\n\nThe moment everything clicked. After weeks of trial and error, the algorithm finally noticed. But here's what nobody tells you:\n\nThe algorithm rewards CONSISTENCY more than perfection.\n\nWhat's one thing you've been putting off? Start today.\n\n#viral #fyp #growth`,
    ];
    return captions[Math.floor(Math.random() * captions.length)];
  }

  if (toolId === "video") {
    return `# Content Plan: ${p}\n\n## Video Ideas\n\n1. "${generateVideoTitle(p)}"\n   - Hook: Ask a relatable question\n   - Main: Share 3 actionable tips\n   - CTA: Subscribe for part 2\n   - Est. length: 8-12 min\n\n2. "${generateVideoTitle(p)}"\n   - Hook: Start with a surprising fact\n   - Main: Step-by-step walkthrough\n   - CTA: Download free resource (link in bio)\n   - Est. length: 10-15 min\n\n3. "${generateVideoTitle(p)}"\n   - Hook: "Nobody talks about this..."\n   - Main: Share personal story + lessons\n   - CTA: Comment your experience\n   - Est. length: 6-8 min\n\n## Posting Schedule\n- Monday: Long-form YouTube\n- Wednesday: Short-form TikTok/Reels\n- Friday: Community post or behind-the-scenes\n\n## Content Pillars\n- Educational (how-tos, tutorials)\n- Entertaining (stories, reactions)\n- Inspiring (transformation, results)`;
  }

  if (toolId === "thumbnail") {
    return `# Thumbnail Concepts for: ${p}\n\n## Concept 1: Bold Text\n- Background: Bright yellow or electric blue\n- Big text: "YOU NEED TO KNOW THIS"\n- Your face: Surprised/serious expression, zoomed in\n- Arrow pointing to key element\n\n## Concept 2: Split Screen\n- Left side: "BEFORE" (messy/confused)\n- Right side: "AFTER" (clean/confident)\n- Red arrow in the middle\n- Clean white text overlay\n\n## Concept 3: Minimalist\n- Solid dark background (black or deep purple)\n- One small bright element (highlighted word)\n- Your face small in corner\n- Lots of negative space = premium feel\n\n## Concept 4: Number Style\n- Big bold number: "7 THINGS..."\n- Each item as a small icon/emoji\n- Your face pointing at the list\n- Bright accent color for the number`;
  }

  if (toolId === "calendar") {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let plan = `# Weekly Content Calendar\n\n`;
    days.forEach((day) => {
      const types = ["Reel/TikTok", "YouTube Video", "Story Series", "Carousel Post", "Live Stream", "Behind the Scenes", "Community Poll"];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = Math.random() > 0.3 ? "Planned" : "Draft";
      plan += `## ${day}\n- **Type:** ${type}\n- **Status:** ${status}\n- **Topic:** ${p} — ${day} edition\n- **Best time:** ${9 + Math.floor(Math.random() * 4)}:00 AM\n\n`;
    });
    return plan;
  }

  if (toolId === "brand") {
    return `# Brand Identity Kit: ${p}\n\n## Brand Name\n(Use your brand name here)\n\n## Tagline Options\n1. "Where [your value] meets [your mission]"\n2. "Empowering [audience] to [outcome]"\n3. "Your journey to [result] starts here"\n\n## Brand Voice\n- **Tone:** Friendly but knowledgeable, like a smart older sibling\n- **Words we use:** empower, create, grow, build, together, future\n- **Words we avoid:** cheap, basic, try, maybe, hack\n- **Example sentence:** "We believe every young African has the power to create something amazing."\n\n## Mission Statement\n"To [verb] [audience] in [location/context] so they can [outcome], because [why it matters]."\n\n## Color Palette\n- Primary: Warm amber/gold (energy, optimism)\n- Secondary: Deep blue (trust, knowledge)\n- Accent: Bright green (growth, freshness)\n- Background: Off-white or very light gray`;
  }

  if (toolId === "song") {
    return `# ${p}\n\n[Verse 1]\nWoke up feeling like the world is mine\nEvery step I take is on the grind\nThey told me slow down, take my time\nBut I got dreams that are one of a kind\n\n[Pre-Chorus]\nCan you feel it? Can you feel the rhythm?\nHeart beating like a drum, yeah I'm with 'em\nEvery setback just a setup for the comeback\nWatch me turn this whole thing around\n\n[Chorus]\nWe rise, we rise, from the ashes to the sky\nNo limits, no boundaries, we were born to fly\nEvery tear we shed was watering the ground\nNow the flowers of our future are around\n\n[Verse 2]\nLate nights writing, early mornings grinding\nEvery bar I spit is a new beginning\nThey doubted me but now they all listening\nThis African sound is what the world's missing\n\n[Bridge]\nOne step, two step, three step, four\nKnocking on every single door\nNo more waiting for the perfect time\nThe perfect time is right now, it's mine\n\n[Outro]\nYeah, we made it. We really made it.\nThis is just the beginning.\n\n---\n*Tempo: 95-105 BPM*\n*Key: C minor or F minor*\n*Style: Afrobeats fusion*`;
  }

  if (toolId === "podcast") {
    return `# Podcast Episode Plan: ${p}\n\n## Episode Details\n- **Duration target:** 25-35 minutes\n- **Format:** Solo monologue + guest segment\n\n## Opening (0-3 min)\n"Welcome to [Podcast Name]. Today we're diving into ${p}."\n- Hook: Share a surprising statistic or story\n- Preview: "By the end of this episode, you'll know exactly..."\n\n## Segment 1: Context (3-10 min)\n- Background on the topic\n- Why it matters NOW\n- 2-3 key data points\n\n## Segment 2: Deep Dive (10-22 min)\n- Break down the main ideas\n- Share real examples and case studies\n- Address common misconceptions\n\n## Segment 3: Action Steps (22-28 min)\n- 3 things listeners can do THIS WEEK\n- Resources to explore further\n- Common mistakes to avoid\n\n## Closing (28-32 min)\n- Recap key takeaways\n- Tease next episode\n- CTA: Subscribe, rate, share with a friend\n\n## Potential Guest Questions\n1. "What's the one thing you wish you knew earlier?"\n2. "How has this changed your perspective?"\n3. "What advice would you give someone just starting out?"`;
  }

  return `Generated content for: ${p}\n\nThis is a starting point. Edit and customize it to match your unique voice and style.`;
}

function getRandomOpener() {
  const openers = [
    "Stop scrolling — this will change how you think about everything.",
    "What if I told you the secret was right in front of you this whole time?",
    "Nobody's talking about this, and it's a problem.",
    "I spent 6 months figuring this out so you don't have to.",
    "This is the video I wish I had when I started.",
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}

function getRandomCTA() {
  const ctas = [
    "If this helped you, smash that subscribe button — I drop videos like this every week.",
    "Which tip will you try first? Tell me in the comments!",
    "Share this with someone who needs to hear it today.",
    "Follow for part 2 tomorrow — it gets even better.",
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
}

function generateVideoTitle(topic: string) {
  const formats = [
    `The Truth About ${topic} (Nobody Will Tell You This)`,
    `How I Mastered ${topic} in 30 Days`,
    `${topic} for Beginners: Everything You Need in One Video`,
    `Why Most People Fail at ${topic} (And How to Succeed)`,
    `I Tried ${topic} for a Week — Here's What Happened`,
    `Stop Making These ${topic} Mistakes!`,
  ];
  return formats[Math.floor(Math.random() * formats.length)];
}

function generateScriptBody(topic: string) {
  return `Let me tell you something about ${topic} that most people overlook.

First, ${topic} isn't as complicated as it seems. The key is to break it down into small, manageable pieces. When I first started, I made the mistake of trying to do everything at once. Don't do that.

Second, consistency matters more than perfection. Show up every single day, even if it's just for 10 minutes. Those small efforts compound over time.

Third, find a community. You don't have to do this alone. There are people out there who are on the same journey — connect with them, learn from them, and help each other grow.`;
}

export const Route = createFileRoute("/creator-studio")({
  head: () => ({
    meta: [
      { title: "UjuziCreate — Creator Studio | Ujuziverse" },
      { name: "description", content: "Build your content and brand with AI-powered tools. Script generator, video planner, content calendar, and more." },
    ],
  }),
  component: CreatorStudio,
});

function CreatorStudio() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(getSaved);

  const tool = TOOLS.find((t) => t.id === activeTool);

  const handleGenerate = () => {
    if (!prompt.trim() || !tool) return;
    setGenerating(true);
    setOutput("");
    // Simulate generation delay for feel
    setTimeout(() => {
      const result = generateContent(tool.id, prompt);
      setOutput(result);
      setGenerating(false);
    }, 800 + Math.random() * 700);
  };

  const handleSave = () => {
    if (!output || !tool) return;
    const item: SavedItem = {
      id: crypto.randomUUID(),
      tool: tool.title,
      title: prompt.slice(0, 50),
      content: output,
      date: new Date().toISOString(),
    };
    const updated = [item, ...savedItems];
    saveSaved(updated);
    setSavedItems(updated);
    toast("Saved to your workspace!", { description: "Find it in 'My Saved Creations'." });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast("Copied to clipboard!");
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedItems.filter((i) => i.id !== id);
    saveSaved(updated);
    setSavedItems(updated);
  };

  const handleTemplate = (template: string) => {
    setPrompt(template + " ");
  };

  // Tool workspace view
  if (tool) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
          <button
            onClick={() => { setActiveTool(null); setOutput(""); setPrompt(""); }}
            className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Studio
          </button>

          <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl">{tool.icon}</div>
              <div>
                <h1 className="text-display text-2xl sm:text-3xl">{tool.title}</h1>
                <p className="text-sm text-white/80">{tool.desc}</p>
              </div>
            </div>
          </section>

          {/* Quick templates */}
          <div className="mt-4">
            <p className="text-xs font-bold text-muted-foreground mb-2">Quick start templates:</p>
            <div className="flex flex-wrap gap-2">
              {tool.templates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleTemplate(t.prompt)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold hover:bg-accent transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 surface-card p-5 rounded-2xl border border-border/60">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={tool.placeholder}
              rows={3}
              className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm shadow-pop hover:scale-105 transition-transform disabled:opacity-50"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "Generating..." : "Generate"}
              </button>
              {output && (
                <>
                  <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface font-bold px-4 py-2.5 text-xs hover:bg-accent transition-colors">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                  <button onClick={handleSave} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface font-bold px-4 py-2.5 text-xs hover:bg-accent transition-colors">
                    <Save className="h-3.5 w-3.5" /> Save
                  </button>
                </>
              )}
            </div>
          </div>

          {generating && (
            <div className="mt-6 surface-card p-8 text-center">
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-3 w-3 rounded-full bg-primary animate-bob" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Creating something amazing for you...</p>
            </div>
          )}

          {output && !generating && (
            <div className="mt-6 surface-card p-6 rounded-2xl border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5"><Check className="h-4 w-4 text-mint-foreground" /> Generated</h3>
                <button onClick={handleGenerate} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" /> Regenerate
                </button>
              </div>
              <div className="rounded-xl bg-muted/40 p-5 text-sm leading-relaxed whitespace-pre-wrap">{output}</div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Main studio view
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🎨</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziCreate</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Creator Studio</h1>
          <p className="mt-2 text-white/85 max-w-lg">AI-powered tools to help you create content, build your brand, and grow your audience.</p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTool(t.id)}
              className={`relative overflow-hidden rounded-2xl ${t.gradient} text-white p-5 text-left shadow-soft hover:-translate-y-1 transition-all`}
            >
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">{t.icon}</div>
              <h3 className="font-bold">{t.title}</h3>
              <p className="text-xs text-white/80 mt-1">{t.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-white/70">
                Open <ChevronLeft className="h-3 w-3 rotate-180" />
              </div>
            </button>
          ))}
        </section>

        {/* Saved creations */}
        {savedItems.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-display text-xl flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> My Saved Creations</h2>
              <span className="text-xs text-muted-foreground">{savedItems.length} items</span>
            </div>
            <div className="space-y-2">
              {savedItems.slice(0, 5).map((item) => (
                <div key={item.id} className="surface-card p-4 border border-border/60 flex items-center gap-3 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.tool}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium mt-1 truncate">{item.title}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSaved(item.id)}
                    className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-coral hover:border-coral/30 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    aria-label="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creator Challenge */}
        <section className="mt-8 surface-card p-6 rounded-2xl border border-border/60">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-display text-lg">Creator Challenge of the Week</h2>
          </div>
          <p className="text-sm text-muted-foreground">Create a 30-second video introducing your creative journey. Share it with #UjuziCreate for a chance to be featured!</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTool("script"); setPrompt("A 30-second video introducing my creative journey"); }}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-soft hover:scale-105 transition-transform"
            >
              <Wand2 className="h-4 w-4" /> Write Your Script
            </button>
            <button
              onClick={() => toast("Great mindset! Film your video and share with #UjuziCreate", { description: "Winners get featured on our platform and social media." })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface font-bold px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              Mark as Done
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}