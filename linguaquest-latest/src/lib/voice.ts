export const SPEECH_LOCALE: Record<string, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  sw: "sw-KE",
};

// ── SpeechRecognition support (Chromium-based browsers) ──
export function isSpeechSupported(): boolean {
  return !!(
    (typeof window !== "undefined") &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  );
}

// ── TTS: browser speechSynthesis (works on all browsers) ──

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];
let ttsUtteranceCount = 0;

function resetChromeTts(): void {
  if (ttsUtteranceCount >= 200) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.getVoices();
    ttsUtteranceCount = 0;
  }
}

export function loadBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesLoaded && cachedVoices.length > 0) return Promise.resolve(cachedVoices);
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      cachedVoices = voices;
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const all = window.speechSynthesis.getVoices();
        voicesLoaded = true;
        cachedVoices = all;
        resolve(all);
      };
      setTimeout(() => {
        const fallback = window.speechSynthesis.getVoices();
        voicesLoaded = true;
        cachedVoices = fallback;
        resolve(fallback);
      }, 1500);
    }
  });
}

function pickBrowserVoice(language: string): SpeechSynthesisVoice | null {
  const all = cachedVoices;
  if (all.length === 0) return null;
  const locale = SPEECH_LOCALE[language] ?? "en-US";
  const langPrefix = locale.split("-")[0];

  const local = all.filter((v) => v.lang.startsWith(langPrefix) && v.localService);
  if (local.length > 0) return local[0];

  const anyLang = all.filter((v) => v.lang.startsWith(langPrefix));
  if (anyLang.length > 0) return anyLang[0];

  return all[0];
}

function browserSpeak(text: string, language: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    resetChromeTts();
    window.speechSynthesis.cancel();

    const snippet = text.length > 200 ? text.slice(0, 200) + "…" : text;
    const u = new SpeechSynthesisUtterance(snippet);
    u.lang = SPEECH_LOCALE[language] ?? "en-US";
    const voice = pickBrowserVoice(language);
    if (voice) u.voice = voice;
    u.rate = 0.92;
    u.pitch = 1.05;

    let done = false;
    const finish = () => { if (!done) { done = true; ttsUtteranceCount++; resolve(); } };
    u.onend = finish;
    u.onerror = finish;

    window.speechSynthesis.speak(u);
    setTimeout(() => { if (!done) { done = true; resolve(); } }, 8000);
  });
}

export async function speakText(text: string, language: string): Promise<void> {
  await browserSpeak(text, language);
}

// ── STT: browser SpeechRecognition (Chromium only, no signup needed) ──

export function startListening(
  language: string,
  onResult: (text: string) => void,
  onError: (error: string) => void,
): { stop: () => void; started: boolean } {
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    onError("Voice input needs Chrome or Edge. Switch to text mode.");
    return { stop: () => {}, started: false };
  }

  const rec: any = new SR();
  rec.lang = SPEECH_LOCALE[language] ?? "en-US";
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e: any) => {
    const transcript = e.results?.[0]?.[0]?.transcript;
    if (transcript) onResult(transcript);
  };
  rec.onerror = (e: any) => {
    if (e.error === "no-speech") onError("No speech detected. Speak into the mic.");
    else if (e.error === "not-allowed") onError("Microphone blocked. Allow mic access in browser settings.");
    else if (e.error === "aborted") { /* user cancelled */ }
    else onError(`Speech error: ${e.error}`);
  };

  let started = false;
  try {
    rec.start();
    started = true;
  } catch (err: any) {
    onError(`Could not start mic: ${err?.message ?? "unknown"}`);
  }

  return {
    stop: () => { try { rec.abort(); } catch {} },
    started,
  };
}
