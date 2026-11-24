import { beforeEach, describe, expect, it } from "vitest";

import { LESSON_XP } from "@/data/curriculum";
import { CHALLENGE_XP } from "@/data/content";
import { dayKey } from "@/lib/activity";
import { computeAchievements } from "@/lib/achievements";
import { DUEL_WIN_XP, useStore } from "@/lib/store";

describe("progress rules", () => {
  beforeEach(() => useStore.getState().resetProgress());

  it("starts a new learner at zero with no achievements", () => {
    const s = useStore.getState();
    expect(s.xp).toBe(0);
    expect(s.completedLessons).toEqual([]);
    expect(s.duelWins).toBe(0);
    expect(s.notifications).toEqual([]);
    expect(s.activity).toEqual({});
    const unlocked = computeAchievements({
      completedLessons: s.completedLessons,
      bestStreak: 0,
      solvedChallenges: 0,
      duelWins: 0,
      xp: 0,
      completedProjects: 0,
    });
    expect(unlocked.size).toBe(0);
  });

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

  it("logs earned XP and active minutes against today", () => {
    useStore.getState().completeLesson("what-is-java");
    useStore.getState().recordDuel(true);
    useStore.getState().logMinutes(1);
    useStore.getState().logMinutes(1);
    expect(useStore.getState().activity[dayKey()]).toEqual({ xp: LESSON_XP + DUEL_WIN_XP, minutes: 2 });
  });
});

describe("saved-progress upgrade", () => {
  it("drops the old sample progress and sample profile", async () => {
    const migrate = useStore.persist.getOptions().migrate;
    expect(migrate).toBeDefined();
    const old = {
      xp: 1250,
      streak: 8,
      completedLessons: ["what-is-java"],
      duelWins: 3,
      settings: { name: "Yashika Gupta", email: "yashika@codecraft.dev", dailyGoal: 45 },
    };
    const next = (await migrate?.(old, 0)) as ReturnType<typeof useStore.getState>;
    expect(next.xp).toBe(0);
    expect(next.completedLessons).toEqual([]);
    expect(next.duelWins).toBe(0);
    expect(next.settings.name).toBe("");
    expect(next.settings.dailyGoal).toBe(45);
  });
});
