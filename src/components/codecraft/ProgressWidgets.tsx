import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpen, CalendarClock, Flame, FolderKanban, Lock, Target, Trophy, User } from "lucide-react";
import { useMemo } from "react";

import { achievements } from "@/data/content";
import { allLessons } from "@/data/curriculum";
import { nextAchievement, useUnlockedAchievements } from "@/lib/achievements";
import { useLearnerProgress } from "@/lib/progress";
import { levelFromXp, useStore } from "@/lib/store";
import { upcomingActivities, type UpcomingItem } from "@/lib/upcoming";
import { cn } from "@/lib/utils";
import { initials } from "@/components/layout/TopNav";

export function ProfileSummaryCard() {
  const p = useLearnerProgress();
  const lvl = levelFromXp(p.xp);
  const ring = 2 * Math.PI * 34;

  return (
    <section aria-labelledby="profile-summary" className="surface p-5 text-center">
      <div className="relative mx-auto size-[84px]">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r="34" fill="none" strokeWidth="5" className="stroke-secondary" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="stroke-primary transition-all duration-700"
            strokeDasharray={ring}
            strokeDashoffset={ring - (ring * lvl.pct) / 100}
          />
        </svg>
        <span className="absolute inset-2 grid place-items-center rounded-full bg-cream font-display text-lg font-extrabold text-cream-foreground">
          {p.hasName ? initials(p.name) : <User className="size-6" />}
        </span>
      </div>
      <h3 id="profile-summary" className="mt-3 text-base font-bold">
        {p.name}
      </h3>
      <p className="text-xs text-subtle">
        Level {lvl.level} · {lvl.into}/{lvl.toNext} XP to next
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-left">
        {[
          { label: "Lessons", value: `${p.lessonsDone}/${p.lessonsTotal}` },
          { label: "Solved", value: p.solvedChallenges },
          { label: "Wins", value: p.duelWins },
        ].map((s) => (
          <div key={s.label} className="rounded-btn bg-secondary px-2.5 py-2">
            <p className="font-display text-base font-bold tabular-nums">{s.value}</p>
            <p className="text-[11px] text-subtle">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 text-xs">
        <Link to="/my-learning" className="font-medium text-primary hover:underline">
          View progress
        </Link>
        <span className="text-subtle" aria-hidden>
          ·
        </span>
        <Link to="/settings" className="font-medium text-muted-foreground hover:text-foreground hover:underline">
          {p.hasName ? "Edit profile" : "Add your name"}
        </Link>
      </div>
    </section>
  );
}

export function StreakCard() {
  const p = useLearnerProgress();
  const completed = useStore((s) => s.completedLessons);
  const next = allLessons.find((l) => !completed.includes(l.id));

  return (
    <section aria-labelledby="streak-title" className="surface p-5">
      <div className="flex items-center justify-between">
        <h3 id="streak-title" className="text-sm font-bold">
          Weekly streak
        </h3>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          <Flame className="size-4" fill="currentColor" /> {p.streak} {p.streak === 1 ? "day" : "days"}
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5">
        {p.week.map((d) => (
          <li key={d.date} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-subtle">{d.day.slice(0, 1)}</span>
            <span
              aria-label={`${d.day}: ${d.active ? "active" : d.isFuture ? "upcoming" : "no activity"}`}
              className={cn(
                "grid size-8 place-items-center rounded-chip text-[11px] font-semibold",
                d.active ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle",
                d.isFuture && "opacity-50",
                d.isToday && "ring-2 ring-cream/70 ring-offset-2 ring-offset-card",
              )}
            >
              {d.active ? <Flame className="size-3.5" fill="currentColor" /> : "·"}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        {p.todayActive
          ? "Today counts — come back tomorrow to keep it going."
          : p.streak > 0
            ? "Learn something today to keep your streak alive."
            : "No streak yet. Finish a lesson today to light the first flame."}
        {p.bestStreak > 0 && <span className="text-subtle"> Best: {p.bestStreak}.</span>}
      </p>
      {!p.todayActive && next && (
        <Link
          to="/learn/$lessonId"
          params={{ lessonId: next.id }}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Do today's lesson <ArrowRight className="size-3" />
        </Link>
      )}
    </section>
  );
}

const upcomingIcon: Record<UpcomingItem["kind"], typeof Target> = {
  lesson: BookOpen,
  challenge: Target,
  project: FolderKanban,
  certificate: Award,
};

function UpcomingRow({ item }: { item: UpcomingItem }) {
  const Icon = upcomingIcon[item.kind];
  const body = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-chip bg-secondary text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-snug">{item.title}</span>
        <span className="block truncate text-xs text-subtle">{item.detail}</span>
      </span>
      <ArrowRight className="size-3.5 shrink-0 text-subtle transition-colors group-hover:text-primary" />
    </>
  );
  const cls = "group flex items-center gap-3 rounded-btn border border-border bg-secondary/60 p-3 transition-colors hover:border-primary/40";
  switch (item.kind) {
    case "lesson":
      return (
        <Link to="/learn/$lessonId" params={{ lessonId: item.lessonId }} className={cls}>
          {body}
        </Link>
      );
    case "challenge":
      return (
        <Link to="/daily-challenge" className={cls}>
          {body}
        </Link>
      );
    case "project":
      return (
        <Link to="/projects" className={cls}>
          {body}
        </Link>
      );
    case "certificate":
      return (
        <Link to="/certificates" className={cls}>
          {body}
        </Link>
      );
  }
}

export function UpcomingCard() {
  const completedLessons = useStore((s) => s.completedLessons);
  const solvedChallenges = useStore((s) => s.solvedChallenges);
  const projectSteps = useStore((s) => s.projectSteps);
  const completedProjects = useStore((s) => s.completedProjects);
  const items = useMemo(
    () => upcomingActivities({ completedLessons, solvedChallenges, projectSteps, completedProjects }),
    [completedLessons, solvedChallenges, projectSteps, completedProjects],
  );

  return (
    <section aria-labelledby="upcoming-title" className="surface p-5">
      <h3 id="upcoming-title" className="flex items-center gap-2 text-sm font-bold">
        <CalendarClock className="size-4 text-primary" /> Up next
      </h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">You've finished everything on the track. Time to build something of your own.</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {items.map((item) => (
            <li key={item.kind}>
              <UpcomingRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AchievementsCard({ limit = achievements.length }: { limit?: number }) {
  const unlocked = useUnlockedAchievements();
  const upNext = nextAchievement(unlocked);

  return (
    <section aria-labelledby="achievements-title" className="surface p-5">
      <div className="flex items-center justify-between">
        <h3 id="achievements-title" className="flex items-center gap-2 text-sm font-bold">
          <Trophy className="size-4 text-primary" /> Achievements
        </h3>
        <Link to="/my-learning" hash="achievements" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <p className="mt-1 text-xs text-subtle">
        {unlocked.size} of {achievements.length} unlocked
      </p>
      {unlocked.size === 0 && (
        <p className="mt-3 rounded-btn bg-secondary/60 p-3 text-xs text-muted-foreground">
          No achievements yet. Your first one, <strong className="text-foreground">First Steps</strong>, unlocks when you complete a lesson.
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-2">
        {achievements.slice(0, limit).map((a) => {
          const on = unlocked.has(a.id);
          return (
            <li
              key={a.id}
              title={`${a.title} — ${a.description}`}
              className={cn(
                "flex items-center gap-1 rounded-chip border px-2 py-1 text-[11px] font-medium",
                on ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-subtle",
              )}
            >
              {on ? <Award className="size-3" /> : <Lock className="size-3" />}
              {a.title}
              <span className="sr-only">{on ? "(unlocked)" : "(locked)"}</span>
            </li>
          );
        })}
      </ul>
      {upNext && unlocked.size > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Next: <span className="font-semibold text-foreground">{upNext.title}</span> — {upNext.description.toLowerCase()}.
        </p>
      )}
    </section>
  );
}
