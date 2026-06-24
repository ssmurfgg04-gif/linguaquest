export function getAiModel(): string {
  return process.env.AI_MODEL || "gemini-2.0-flash";
}
