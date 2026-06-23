export interface JournalEntry {
  id: string;
  title: string;
  text: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "lq.journal";

export function getJournalEntries(): JournalEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry) {
  const entries = getJournalEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteJournalEntry(id: string) {
  const entries = getJournalEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
