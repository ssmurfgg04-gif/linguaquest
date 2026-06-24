import { useCallback } from "react";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { setLanguage as saveLang } from "@/lib/sessions";

export function LanguageSelector({
  current,
  onChange,
}: {
  current: LanguageCode;
  onChange: (code: LanguageCode) => void;
}) {
  const pick = useCallback((code: LanguageCode) => {
    saveLang(code);
    onChange(code);
  }, [onChange]);

  return (
    <div className="flex flex-wrap gap-1.5">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => pick(l.code)}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
            current === l.code
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <span>{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
