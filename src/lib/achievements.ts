import { useMemo } from "react";

import { achievements } from "@/data/content";
import { modules } from "@/data/curriculum";
import { useLearnerProgress } from "@/lib/progress";
import { useStore } from "@/lib/store";

/** Unlocked achievement ids, derived only from the learner's recorded progress. */
export function computeAchievements(s: {
  completedLessons: string[];
  bestStreak: number;
  solvedChallenges: number;
  duelWins: number;
  xp: number;
  completedProjects: number;
}) {
  const set = new Set<string>();
  if (s.completedLessons.length >= 1) set.add("first-lesson");
  if (s.completedLessons.length >= 5) set.add("five-lessons");
  if (modules.some((m) => m.lessons.every((l) => s.completedLessons.includes(l.id)))) set.add("module-done");
  if (s.bestStreak >= 7) set.add("streak-7");
  if (s.solvedChallenges >= 1) set.add("challenge");
  if (s.duelWins >= 1) set.add("duel-win");
  if (s.xp >= 2000) set.add("xp-2000");
  if (s.completedProjects >= 1) set.add("project");
  return set;
}

export function useUnlockedAchievements() {
  const completedLessons = useStore((s) => s.completedLessons);
  const p = useLearnerProgress();
  return useMemo(
    () =>
      computeAchievements({
        completedLessons,
        bestStreak: p.bestStreak,
        solvedChallenges: p.solvedChallenges,
        duelWins: p.duelWins,
        xp: p.xp,
        completedProjects: p.projectsDone,
      }),
    [completedLessons, p.bestStreak, p.solvedChallenges, p.duelWins, p.xp, p.projectsDone],
  );
}

/** The first locked achievement in catalogue order — the next one to aim for. */
export function nextAchievement(unlocked: Set<string>) {
  return achievements.find((a) => !unlocked.has(a.id)) ?? null;
}
