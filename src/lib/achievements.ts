import { useMemo } from "react";

import { modules } from "@/data/curriculum";
import { useStore } from "@/lib/store";

export function computeAchievements(s: {
  completedLessons: string[];
  streak: number;
  solvedChallenges: string[];
  duelWins: number;
  xp: number;
  completedProjects: string[];
}) {
  const set = new Set<string>();
  if (s.completedLessons.length >= 1) set.add("first-lesson");
  if (s.completedLessons.length >= 5) set.add("five-lessons");
  if (modules.some((m) => m.lessons.every((l) => s.completedLessons.includes(l.id)))) set.add("module-done");
  if (s.streak >= 7) set.add("streak-7");
  if (s.solvedChallenges.length >= 1) set.add("challenge");
  if (s.duelWins >= 1) set.add("duel-win");
  if (s.xp >= 2000) set.add("xp-2000");
  if (s.completedProjects.length >= 1) set.add("project");
  return set;
}

export function useUnlockedAchievements() {
  const completedLessons = useStore((s) => s.completedLessons);
  const streak = useStore((s) => s.streak);
  const solvedChallenges = useStore((s) => s.solvedChallenges);
  const duelWins = useStore((s) => s.duelWins);
  const xp = useStore((s) => s.xp);
  const completedProjects = useStore((s) => s.completedProjects);
  return useMemo(
    () => computeAchievements({ completedLessons, streak, solvedChallenges, duelWins, xp, completedProjects }),
    [completedLessons, streak, solvedChallenges, duelWins, xp, completedProjects],
  );
}
