// Onboarding system — guided first-visit experience
const ONBOARDING_KEY = "lq.onboarded";

export interface OnboardingData {
  step: number; // 0-3, 3 = complete
  name: string;
  language: string;
  avatar: string;
  completedAt: string | null;
}

const AVATARS = ["🦁", "🐯", "🐻", "🐼", "🐨", "🦊", "🐰", "🐸", "🦉", "🐝", "🦋", "🐳", "🌟", "🎨", "🚀", "🎸"];

export const AVATAR_OPTIONS = AVATARS;

export function loadOnboarding(): OnboardingData {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (raw) return JSON.parse(raw) as OnboardingData;
  } catch {}
  return { step: 0, name: "", language: "en", avatar: AVATARS[0], completedAt: null };
}

export function saveOnboarding(data: OnboardingData): void {
  try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data)); } catch {}
}

export function isOnboarded(): boolean {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as OnboardingData;
    return data.step >= 3;
  } catch { return false; }
}

export function completeOnboarding(name: string, language: string, avatar: string): void {
  const data: OnboardingData = { step: 3, name, language, avatar, completedAt: new Date().toISOString() };
  saveOnboarding(data);
  // Also save as auth user so dashboard works
  try {
    localStorage.setItem("lq.auth", JSON.stringify({ name, email: "", language, journey: "student" }));
  } catch {}
}

export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}