import { CHALLENGE_XP, challenges, projects } from "@/data/content";
import { allLessons, modules } from "@/data/curriculum";

export type UpcomingItem =
  | { kind: "lesson"; title: string; detail: string; lessonId: string }
  | { kind: "challenge"; title: string; detail: string }
  | { kind: "project"; title: string; detail: string }
  | { kind: "certificate"; title: string; detail: string };

/** What the learner can do next, derived from their own progress — no scheduled or invented events. */
export function upcomingActivities(s: {
  completedLessons: string[];
  solvedChallenges: string[];
  projectSteps: Record<string, number[]>;
  completedProjects: string[];
}): UpcomingItem[] {
  const items: UpcomingItem[] = [];

  const next = allLessons.find((l) => !s.completedLessons.includes(l.id));
  if (next) {
    items.push({
      kind: "lesson",
      title: s.completedLessons.length === 0 ? `Start: ${next.title}` : `Next lesson: ${next.title}`,
      detail: `${next.minutes} min · ${next.moduleTitle}`,
      lessonId: next.id,
    });
  }

  const today = challenges[0];
  if (today) {
    items.push(
      s.solvedChallenges.includes(today.id)
        ? { kind: "challenge", title: "New daily challenge", detail: "Unlocks at midnight" }
        : { kind: "challenge", title: `Daily challenge: ${today.title}`, detail: `${today.difficulty} · +${CHALLENGE_XP} XP` },
    );
  }

  const active = projects.find(
    (p) => (s.projectSteps[p.id]?.length ?? 0) > 0 && !s.completedProjects.includes(p.id),
  );
  if (active) {
    const done = s.projectSteps[active.id] ?? [];
    const stepIndex = active.steps.findIndex((_, i) => !done.includes(i));
    items.push({ kind: "project", title: `Next step: ${active.steps[stepIndex] ?? "Wrap up"}`, detail: active.title });
  } else {
    const fresh = projects.find((p) => !s.completedProjects.includes(p.id));
    if (fresh) items.push({ kind: "project", title: `Start a project: ${fresh.title}`, detail: `${fresh.level} · ~${fresh.hours}h` });
  }

  const closest = modules
    .map((m) => ({ m, done: m.lessons.filter((l) => s.completedLessons.includes(l.id)).length }))
    .filter(({ m, done }) => done > 0 && done < m.lessons.length)
    .sort((a, b) => a.m.lessons.length - a.done - (b.m.lessons.length - b.done))[0];
  if (closest) {
    const left = closest.m.lessons.length - closest.done;
    items.push({
      kind: "certificate",
      title: `${closest.m.title} certificate`,
      detail: `${left} lesson${left === 1 ? "" : "s"} to go`,
    });
  }

  return items;
}
