/**
 * Single read path for a learner's progress.
 *
 * Every screen that shows XP, streak, lessons or weekly time reads it through
 * `useLearnerProgress()`. Today the source is the on-device store; when signed-in
 * accounts are added, swap the source inside this hook (keeping the
 * `LearnerProgress` shape) and every dashboard section follows automatically.
 */
import { useEffect, useMemo, useState } from "react";

import { allLessons } from "@/data/curriculum";
import { computeStreak, weekSeries, type WeekDay } from "@/lib/activity";
import { useStore } from "@/lib/store";

export { computeStreak, dayKey, weekSeries, WEEK_LABELS, type ActivityLog, type DayActivity, type WeekDay } from "@/lib/activity";

export function displayName(name: string) {
  return name.trim() || "Guest learner";
}

export function formatMinutes(total: number) {
  if (total < 60) return `${total}m`;
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}

/** Today's date, only after mount — keeps server and first client render identical. */
export function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
    const id = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return today;
}

export interface LearnerProgress {
  name: string;
  hasName: boolean;
  xp: number;
  streak: number;
  bestStreak: number;
  lessonsDone: number;
  lessonsTotal: number;
  coursePct: number;
  solvedChallenges: number;
  duelWins: number;
  duelsPlayed: number;
  projectsDone: number;
  week: WeekDay[];
  weekMinutes: number;
  weekXp: number;
  weeklyGoalMinutes: number;
  todayActive: boolean;
  hasAnyProgress: boolean;
}

export function useLearnerProgress(): LearnerProgress {
  const rawName = useStore((s) => s.settings.name);
  const dailyGoal = useStore((s) => s.settings.dailyGoal);
  const xp = useStore((s) => s.xp);
  const activity = useStore((s) => s.activity);
  const completed = useStore((s) => s.completedLessons);
  const solved = useStore((s) => s.solvedChallenges);
  const duelWins = useStore((s) => s.duelWins);
  const duelsPlayed = useStore((s) => s.duelsPlayed);
  const projectsDone = useStore((s) => s.completedProjects.length);
  const today = useToday();

  return useMemo(() => {
    const now = today ?? new Date(0);
    const { current, best } = today ? computeStreak(activity, now) : { current: 0, best: 0 };
    const week = today ? weekSeries(activity, now) : weekSeries({}, new Date(2024, 0, 1));
    const weekMinutes = week.reduce((a, d) => a + d.minutes, 0);
    const weekXp = week.reduce((a, d) => a + d.xp, 0);
    return {
      name: displayName(rawName),
      hasName: rawName.trim().length > 0,
      xp,
      streak: current,
      bestStreak: best,
      lessonsDone: completed.length,
      lessonsTotal: allLessons.length,
      coursePct: Math.round((completed.length / allLessons.length) * 100),
      solvedChallenges: solved.length,
      duelWins,
      duelsPlayed,
      projectsDone,
      week: today ? week : week.map((d) => ({ ...d, isToday: false, isFuture: false })),
      weekMinutes,
      weekXp,
      weeklyGoalMinutes: dailyGoal * 7,
      todayActive: week.some((d) => d.isToday && d.active),
      hasAnyProgress: xp > 0 || completed.length > 0 || duelsPlayed > 0 || Object.keys(activity).length > 0,
    };
  }, [rawName, dailyGoal, xp, activity, completed, solved, duelWins, duelsPlayed, projectsDone, today]);
}

/**
 * Logs one minute of active time per minute the page is visible and the learner
 * has typed, clicked or scrolled in the last two minutes. Mount it on pages where
 * learners write or read code.
 */
export function useActiveTimeTracker() {
  const logMinutes = useStore((s) => s.logMinutes);
  useEffect(() => {
    let last = Date.now();
    const bump = () => {
      last = Date.now();
    };
    const events = ["keydown", "pointerdown", "pointermove", "wheel", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { capture: true, passive: true }));
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - last < 120_000) logMinutes(1);
    }, 60_000);
    return () => {
      clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, bump, { capture: true }));
    };
  }, [logMinutes]);
}
