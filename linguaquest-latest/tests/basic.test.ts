import { describe, it, expect } from "vitest";

describe("mock data integrity", () => {
  it("all scenarios reference valid characters", async () => {
    const { CHARACTERS, SCENARIOS } = await import("../src/data/mock");
    const validIds = new Set(CHARACTERS.map((c) => c.id));
    for (const s of SCENARIOS) {
      expect(validIds.has(s.characterId)).toBe(true);
    }
  });

  it("all scenarios reference valid levels", async () => {
    const { LEVELS, SCENARIOS } = await import("../src/data/mock");
    const validLevels = new Set(LEVELS.map((l) => l.id));
    for (const s of SCENARIOS) {
      expect(validLevels.has(s.level)).toBe(true);
    }
  });

  it("all characters have unique ids", async () => {
    const { CHARACTERS } = await import("../src/data/mock");
    const ids = CHARACTERS.map((c: any) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("scenario ids are unique", async () => {
    const { SCENARIOS } = await import("../src/data/mock");
    const ids = SCENARIOS.map((s: any) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
