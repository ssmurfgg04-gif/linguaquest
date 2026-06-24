import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { Mic, Square, AlertCircle, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { getLanguage } from "@/lib/sessions";
import { isSpeechSupported, SPEECH_LOCALE } from "@/lib/voice";

export const Route = createFileRoute("/pronunciation")({
  head: () => ({
    meta: [
      { title: "Pronunciation — Ujuziverse" },
      { name: "description", content: "Practice your pronunciation and get instant feedback." },
    ],
  }),
  component: PronunciationPage,
});

const TARGET_PHRASES: Record<LanguageCode, { phrase: string; phonetic: string }[]> = {
  en: [
    { phrase: "Good morning, how are you?", phonetic: "ɡʊd ˈmɔːnɪŋ haʊ ɑː juː" },
    { phrase: "My name is", phonetic: "maɪ neɪm ɪz" },
    { phrase: "I would like some water, please", phonetic: "aɪ wʊd laɪk sʌm ˈwɔːtər pliːz" },
    { phrase: "Thank you very much", phonetic: "θæŋk juː ˈveri mʌtʃ" },
    { phrase: "Can you help me?", phonetic: "kæn juː help miː" },
    { phrase: "Nice to meet you", phonetic: "naɪs tuː miːt juː" },
    { phrase: "I don't understand", phonetic: "aɪ doʊnt ˌʌndərˈstænd" },
    { phrase: "Could you repeat that?", phonetic: "kʊd juː rɪˈpiːt ðæt" },
    { phrase: "How much does this cost?", phonetic: "haʊ mʌtʃ dʌz ðɪs kɒst" },
    { phrase: "Where is the bathroom?", phonetic: "weər ɪz ðə ˈbɑːθruːm" },
  ],
  fr: [
    { phrase: "Bonjour, comment allez-vous?", phonetic: "bɔ̃ʒuʁ kɔmɑ̃ tale vu" },
    { phrase: "Je m'appelle", phonetic: "ʒə mapɛl" },
    { phrase: "Merci beaucoup", phonetic: "mɛʁsi boku" },
    { phrase: "Parlez-vous anglais?", phonetic: "paʁle vu ɑ̃ɡlɛ" },
    { phrase: "Où sont les toilettes?", phonetic: "u sɔ̃ le twalɛt" },
    { phrase: "Combien ça coûte?", phonetic: "kɔ̃bjɛ̃ sa kut" },
    { phrase: "Je ne comprends pas", phonetic: "ʒə nə kɔ̃pʁɑ̃ pa" },
    { phrase: "Répétez s'il vous plaît", phonetic: "ʁepete sil vu plɛ" },
  ],
  de: [
    { phrase: "Guten Morgen, wie geht es Ihnen?", phonetic: "ˈɡuːtən ˈmɔʁɡən viː ɡeːt ɛs ˈiːnən" },
    { phrase: "Ich heiße", phonetic: "ɪç ˈhaɪsə" },
    { phrase: "Danke schön", phonetic: "ˈdaŋkə ʃøːn" },
    { phrase: "Sprechen Sie Englisch?", phonetic: "ˈʃpʁɛçən ziː ˈɛŋlɪʃ" },
    { phrase: "Ich verstehe nicht", phonetic: "ɪç fɛɐˈʃteːə nɪçt" },
    { phrase: "Wo ist die Toilette?", phonetic: "voː ɪst diː toˈlɛtə" },
    { phrase: "Wie viel kostet das?", phonetic: "viː fiːl ˈkɔstət das" },
    { phrase: "Können Sie mir helfen?", phonetic: "ˈkœnən ziː miːɐ ˈhɛlfən" },
  ],
  sw: [
    { phrase: "Habari za asubuhi?", phonetic: "hɑbɑri zɑ ɑsubuhi" },
    { phrase: "Jina langu ni", phonetic: "ʄinɑ lɑnɡu ni" },
    { phrase: "Asante sana", phonetic: "ɑsɑnte sɑnɑ" },
    { phrase: "Unaongea Kiingereza?", phonetic: "unɑɔnɡeɑ kiinɡereza" },
    { phrase: "Sielewi", phonetic: "siɛlɛwi" },
    { phrase: "Choo kiko wapi?", phonetic: "ʧoːo kiːko wɑpi" },
    { phrase: "Bei gani?", phonetic: "bei ɡɑni" },
    { phrase: "Tafadhali", phonetic: "tɑfɑðɑli" },
    { phrase: "Karibu", phonetic: "kɑribu" },
    { phrase: "Nina furaha kukutana nawe", phonetic: "ninɑ furɑhɑ kukutɑnɑ nɑwe" },
  ],
};

function PronunciationPage() {
  const [language, setLanguageState] = useState<LanguageCode>(() => getLanguage());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const phrases = TARGET_PHRASES[language] || TARGET_PHRASES.en;
  const current = phrases[currentIdx];

  const startRecording = useCallback(() => {
    if (recording) return;
    if (!isSpeechSupported()) {
      setError("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }
    setError(null);
    setFeedback(null);
    setTranscript("");
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: any = new SR();
    recognition.lang = SPEECH_LOCALE[language] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const similarity = computeSimilarity(text.toLowerCase(), current.phrase.toLowerCase());
      const score = Math.round(similarity * 100);
      setFeedback({
        score,
        message: score >= 80 ? "Great pronunciation!" : score >= 50 ? "Getting better!" : "Keep practicing!",
      });
    };
    recognition.onerror = () => {
      setError("Could not hear clearly. Try again in a quiet place.");
    };
    recognition.onend = () => setRecording(false);
    recognition.start();
    setRecording(true);
    recognitionRef.current = recognition;
  }, [recording, language, current]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  }, []);

  function computeSimilarity(a: string, b: string): number {
    if (!a || !b) return 0;
    const setA = new Set(a.split(/\s+/));
    const setB = new Set(b.split(/\s+/));
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-meadow text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">🎤</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Pronunciation Practice</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Speak & Check</h1>
          <p className="mt-2 text-white/90 max-w-lg">Say the phrase aloud and get instant feedback.</p>
        </section>

        <section className="mt-6 surface-card p-6">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLanguageState(l.code); setCurrentIdx(0); setFeedback(null); setTranscript(""); }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                  language === l.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface border-border hover:bg-accent"
                }`}
              >
                <span>{l.flag}</span>
                {l.nativeLabel}
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phrase {currentIdx + 1} of {phrases.length}</p>
            <h2 className="text-display text-3xl sm:text-4xl mt-2">{current.phrase}</h2>
            <p className="text-sm text-muted-foreground mt-2 italic">{current.phonetic}</p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            {!recording ? (
              <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-6 py-3 shadow-pop hover:scale-105 transition-transform">
                <Mic className="h-5 w-5" /> Start Speaking
              </button>
            ) : (
              <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-full bg-coral text-white font-bold px-6 py-3 shadow-pop hover:scale-105 transition-transform">
                <Square className="h-5 w-5" /> Stop
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {transcript && (
            <div className="mt-4 surface-pop p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">You said:</p>
              <p className="mt-1 text-lg italic">"{transcript}"</p>
            </div>
          )}

          {feedback && (
            <div className={`mt-4 rounded-2xl p-4 text-center ${feedback.score >= 80 ? "bg-mint/20 border border-mint/30" : feedback.score >= 50 ? "bg-sun/25 border border-sun/40" : "bg-coral/15 border border-coral/30"}`}>
              <div className="text-3xl font-bold text-display">{feedback.score}%</div>
              <p className={`text-sm font-bold mt-1 ${feedback.score >= 80 ? "text-mint-foreground" : feedback.score >= 50 ? "text-sun-foreground" : "text-coral"}`}>
                {feedback.message}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => { setCurrentIdx((i) => (i - 1 + phrases.length) % phrases.length); setFeedback(null); setTranscript(""); setError(null); }}
              className="text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Previous
            </button>
            <button
              onClick={() => { setCurrentIdx((i) => (i + 1) % phrases.length); setFeedback(null); setTranscript(""); setError(null); }}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              Next <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
