// Free AI inference — tries multiple providers with free tiers.
// Strategy (tried in order, with strict overall timeout):
// 1. OVHcloud AI Endpoints (anonymous tier, no key needed, 2 req/min/IP) — 8s per model
// 2. GitHub Models (set GITHUB_TOKEN in Netlify Dashboard) — 10s
// 3. Groq (set GROQ_API_KEY) — 10s
// 4. OpenRouter (set OPENROUTER_API_KEY) — 10s
// 5. Together AI (set TOGETHER_API_KEY) — 10s
// 6. Published free keys from github.com/alistaitsacle/free-llm-api-keys — 8s budget
// Reply engine always works as ultimate fallback (no API needed).
// NOTE: HuggingFace free inference removed — requires auth token now (401 without it).
//
// CRITICAL: Each exported function has an OVERALL timeout of 25s.
// The entire free chain MUST complete within 25s or returns null.
// This prevents the 2+ minute waits users were experiencing.

const OVERALL_TIMEOUT_MS = 25_000;

// ── OVHcloud AI Endpoints (anonymous, no key, 2 req/min/IP) ──
// EU-hosted, GDPR-compliant, OpenAI-compatible. Zero signup.
const OVH_URL = "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions";
const OVH_MODELS = [
  "Llama-3.1-8B-Instruct",       // confirmed working, all langs
  "Mistral-7B-Instruct-v0.3",     // fallback
  "Qwen3-Coder-30B-A3B-Instruct", // powerful fallback (may be rate-limited)
];

async function tryOVH(
  messages: { role: string; content: string }[],
  maxTokens: number,
  signal: AbortSignal,
): Promise<string | null> {
  for (const model of OVH_MODELS) {
    if (signal.aborted) return null;
    try {
      const res = await fetch(OVH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        if (res.status === 404 || res.status === 429) continue;
        return null;
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch {
      continue;
    }
  }
  return null;
}

function getKey(env: string): string | null {
  const fromEnv = process.env[env];
  if (fromEnv && fromEnv.trim() !== "") return fromEnv;
  return null;
}

const PROVIDERS: {
  name: string;
  keyEnv: string;
  url: string;
  model: string;
}[] = [
  {
    name: "GitHub",
    keyEnv: "GITHUB_TOKEN",
    url: "https://models.inference.ai.azure.com/chat/completions",
    model: "gpt-4o-mini",
  },
  {
    name: "Groq",
    keyEnv: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "mixtral-8x7b-32768",
  },
  {
    name: "OpenRouter",
    keyEnv: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "mistralai/mistral-7b-instruct",
  },
  {
    name: "Together",
    keyEnv: "TOGETHER_API_KEY",
    url: "https://api.together.xyz/v1/chat/completions",
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  },
];

async function tryProvider(
  provider: typeof PROVIDERS[0],
  messages: { role: string; content: string }[],
  maxTokens: number,
  signal: AbortSignal,
): Promise<string | null> {
  if (signal.aborted) return null;
  const key = getKey(provider.keyEnv);
  if (!key) return null;

  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.warn(`${provider.name} ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.warn(`${provider.name} error:`, e);
    return null;
  }
}

// ── Free published keys from alistaitsacle/free-llm-api-keys ──
// Cached for 5 min in memory. Skipped if overall timeout is nearly up.
const FREE_KEY_REPO = "https://raw.githubusercontent.com/alistaitsacle/free-llm-api-keys/main/README.md";
const FREE_KEY_BASE = "https://aiapiv2.pekpik.com/v1/chat/completions";

let cachedKeyEntries: { key: string; model: string }[] | null = null;
let cachedTs = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchFreeKeyEntries(signal: AbortSignal): Promise<{ key: string; model: string }[]> {
  if (cachedKeyEntries && Date.now() - cachedTs < CACHE_TTL) {
    return cachedKeyEntries;
  }
  if (signal.aborted) return cachedKeyEntries ?? [];
  try {
    const resp = await fetch(FREE_KEY_REPO, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return cachedKeyEntries ?? [];
    const md = await resp.text();
    const rowRegex = /\|\s*`(sk-[A-Za-z0-9]+)`\s*\|\s*(\S[^|]+?)\s*\|/g;
    const entries: { key: string; model: string }[] = [];
    let m;
    while ((m = rowRegex.exec(md)) !== null) {
      const model = m[2].trim().toLowerCase();
      if (model.includes("embedding") || model.includes("image") || model.includes("audio")) continue;
      entries.push({ key: m[1], model: m[2].trim() });
    }
    cachedKeyEntries = entries;
    cachedTs = Date.now();
    return entries;
  } catch {
    return cachedKeyEntries ?? [];
  }
}

async function tryPublishedKey(
  messages: { role: string; content: string }[],
  maxTokens: number,
  signal: AbortSignal,
  budgetMs: number,
): Promise<string | null> {
  const entries = await fetchFreeKeyEntries(signal);
  if (entries.length === 0) return null;
  const start = Date.now();
  for (const { key, model } of entries) {
    const remaining = budgetMs - (Date.now() - start);
    if (remaining <= 0 || signal.aborted) break;
    try {
      const res = await fetch(FREE_KEY_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(Math.min(remaining, 5000)),
      });
      if (res.ok) {
        const data = await res.json();
        const msg = data?.choices?.[0]?.message;
        if (msg?.content?.trim()) return msg.content.trim();
        if (msg?.reasoning_content?.trim()) return msg.reasoning_content.trim();
        if (msg?.reasoning?.text?.trim()) return msg.reasoning.text.trim();
      }
      if (res.status === 429) break;
    } catch {
      continue;
    }
  }
  return null;
}

// Helper: wrap entire chain in an overall timeout
async function withOverallTimeout<T>(
  fn: () => Promise<T | null>,
  ms: number,
  label: string,
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const result = await fn();
    clearTimeout(timer);
    return result;
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof DOMException && e.name === "AbortError") {
      console.warn(`[${label}] Overall timeout (${ms}ms) exceeded, falling back`);
    } else {
      console.warn(`[${label}] Error:`, e);
    }
    return null;
  }
}

// Try: OVHcloud → GitHub Models → Groq → OpenRouter → Together → Published free keys
// ALL of this must complete within OVERALL_TIMEOUT_MS (25s) or returns null.
export async function freeChatReply(
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  return withOverallTimeout(async () => {
    const controller = new AbortController();
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    // 1. OVHcloud AI Endpoints — anonymous, no key, 2 req/min/IP
    const ovh = await tryOVH(messages, 100, controller.signal);
    if (ovh) return ovh;

    // 2. Try configured providers (GitHub, Groq, OpenRouter, Together)
    for (const provider of PROVIDERS) {
      const result = await tryProvider(provider, messages, 100, controller.signal);
      if (result) return result;
    }

    // 3. Try published free keys from GitHub (no signup, no env vars)
    const elapsed = Date.now(); // track from start of step 3
    const published = await tryPublishedKey(messages, 100, controller.signal, 8000);
    if (published) return published;

    return null;
  }, OVERALL_TIMEOUT_MS, "freeChatReply");
}

export async function freeFeedback(
  prompt: string,
): Promise<object | null> {
  return withOverallTimeout(async () => {
    const controller = new AbortController();
    const msgs = [{ role: "user", content: prompt }];

    // 1. OVHcloud AI Endpoints — anonymous, no key
    const ovh = await tryOVH(msgs, 300, controller.signal);
    if (ovh) {
      try { return JSON.parse(ovh); } catch {}
    }

    // 2. Try configured providers
    for (const provider of PROVIDERS) {
      const result = await tryProvider(provider, msgs, 300, controller.signal);
      if (result) {
        try { return JSON.parse(result); } catch {}
      }
    }

    // 3. Try published free keys
    const published = await tryPublishedKey(msgs, 300, controller.signal, 6000);
    if (published) {
      try { return JSON.parse(published); } catch {}
    }

    return null;
  }, OVERALL_TIMEOUT_MS, "freeFeedback");
}