// @ts-nocheck — Dead code: Chrome built-in AI module. Not imported anywhere.
// Kept for potential future use when Chrome AI becomes more widely available.

interface ChromeAICapabilities {
  available: "readily" | "after-download" | "no";
}

interface ChromeAISession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface ChromeAILanguageModel {
  capabilities(): Promise<ChromeAICapabilities>;
  create(options?: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChromeAISession>;
}

declare global {
  interface Window {
    ai?: {
      languageModel: ChromeAILanguageModel;
    };
  }
}

export function isChromeAIAvailable(): boolean {
  return typeof window !== "undefined" && "ai" in window && !!window.ai?.languageModel;
}

export async function getChromeAICapability(): Promise<"ready" | "download" | "unavailable"> {
  if (!isChromeAIAvailable()) return "unavailable";
  try {
    const caps = await window.ai!.languageModel.capabilities();
    if (caps.available === "readily") return "ready";
    if (caps.available === "after-download") return "download";
    return "unavailable";
  } catch {
    return "unavailable";
  }
}

let session: ChromeAISession | null = null;

export async function chromeAIChat(
  systemPrompt: string,
  userInput: string,
): Promise<string | null> {
  if (!isChromeAIAvailable()) return null;
  try {
    if (!session) {
      session = await window.ai!.languageModel.create({
        systemPrompt,
        temperature: 0.7,
        maxTokens: 100,
      });
    }
    return await session.prompt(userInput);
  } catch (e) {
    console.warn("Chrome AI error:", e);
    if (session) {
      try { session.destroy(); } catch {}
      session = null;
    }
    return null;
  }
}

export function destroyChromeAISession(): void {
  if (session) {
    try { session.destroy(); } catch {}
    session = null;
  }
}
