import { describe, expect, it } from "vitest";

import { computeStreak, weekSeries, type ActivityLog } from "@/lib/activity";
import { upcomingActivities } from "@/lib/upcoming";

const on = { xp: 50, minutes: 0 };
// Wednesday 18 Nov 2026
const wed = new Date(2026, 10, 18, 15, 0);

describe("streak", () => {
  it("is zero with no activity", () => {
    expect(computeStreak({}, wed)).toEqual({ current: 0, best: 0 });
  });

  it("counts consecutive days up to today", () => {
    const log: ActivityLog = { "2026-11-16": on, "2026-11-17": on, "2026-11-18": on };
    expect(computeStreak(log, wed).current).toBe(3);
  });

  it("stays alive from yesterday until today ends", () => {
    const log: ActivityLog = { "2026-11-16": on, "2026-11-17": on };
    expect(computeStreak(log, wed).current).toBe(2);
  });

  it("resets after a missed day but keeps the best run", () => {
    const log: ActivityLog = { "2026-11-10": on, "2026-11-11": on, "2026-11-12": on, "2026-11-16": on };
    expect(computeStreak(log, wed)).toEqual({ current: 0, best: 3 });
  });
});

describe("weekly activity", () => {
  it("runs Monday to Sunday and marks today", () => {
    const week = weekSeries({ "2026-11-16": { xp: 0, minutes: 12 } }, wed);
    expect(week.map((d) => d.day)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(week[0]?.minutes).toBe(12);
    expect(week[2]?.isToday).toBe(true);
    expect(week[3]?.isFuture).toBe(true);
  });
});

describe("up next", () => {
  it("points a new learner at the first lesson and shows no certificate", () => {
    const items = upcomingActivities({ completedLessons: [], solvedChallenges: [], projectSteps: {}, completedProjects: [] });
    expect(items[0]).toMatchObject({ kind: "lesson", lessonId: "what-is-java" });
    expect(items.some((i) => i.kind === "certificate")).toBe(false);
  });
});
