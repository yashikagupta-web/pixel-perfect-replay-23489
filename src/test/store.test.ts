import { beforeEach, describe, expect, it } from "vitest";

import { LESSON_XP } from "@/data/curriculum";
import { CHALLENGE_XP } from "@/data/content";
import { useStore } from "@/lib/store";

describe("progress rules", () => {
  beforeEach(() => useStore.getState().resetProgress());

  it("awards lesson XP only once per lesson", () => {
    const s = useStore.getState();
    expect(s.completeLesson("what-is-java")).toBe(true);
    expect(useStore.getState().completeLesson("what-is-java")).toBe(false);
    expect(useStore.getState().xp).toBe(LESSON_XP);
  });

  it("awards challenge XP only once", () => {
    useStore.getState().solveChallenge("string-pool");
    useStore.getState().solveChallenge("string-pool");
    expect(useStore.getState().xp).toBe(CHALLENGE_XP);
  });
});
