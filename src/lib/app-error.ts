const ERROR_CODES = {
  MISSING_API_KEY: "MISSING_API_KEY",
  RATE_LIMITED: "RATE_LIMITED",
  INVALID_API_KEY: "INVALID_API_KEY",
} as const;

export function serverError(code: string, message: string): never {
  const err = new Error(message);
  (err as any).code = code;
  throw err;
}

export function parseClientError(err: unknown): { code?: string; message: string } {
  if (err instanceof Error) {
    const code = (err as any).code;
    if (code) return { code, message: err.message };
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.code) return parsed;
    } catch {}
    return { message: err.message };
  }
  if (typeof err === "object" && err && "message" in (err as any)) {
    const e = err as any;
    if (e.code) return { code: e.code, message: e.message };
    return { message: e.message };
  }
  return { message: String(err) };
}

export { ERROR_CODES };
