import { Link } from "@tanstack/react-router";
import { CalendarClock, Flame, Trophy } from "lucide-react";

import { achievements, upcomingSessions } from "@/data/content";
import { allLessons } from "@/data/curriculum";
import { levelFromXp, useStore } from "@/lib/store";
import { useUnlockedAchievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { initials } from "./TopNav";

const week = ["M", "T", "W", "T", "F", "S", "S"];

export function RightPanel() {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const name = useStore((s) => s.settings.name);
  const completed = useStore((s) => s.completedLessons.length);
  const solved = useStore((s) => s.solvedChallenges.length);
  const duelWins = useStore((s) => s.duelWins);
  const unlocked = useUnlockedAchievements();
  const lvl = levelFromXp(xp);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const ring = 2 * Math.PI * 34;

  return (
    <aside aria-label="Learning activity" className="hidden w-[310px] shrink-0 space-y-4 border-l border-border p-5 xl:block">
      <section className="surface p-5 text-center">
        <div className="relative mx-auto size-[84px]">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90">
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
            {initials(name)}
          </span>
        </div>
        <h3 className="mt-3 text-base font-bold">{name}</h3>
        <p className="text-xs text-subtle">
          Level {lvl.level} · {lvl.into}/{lvl.toNext} XP to next
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-left">
          {[
            { label: "Lessons", value: `${completed}/${allLessons.length}` },
            { label: "Solved", value: solved },
            { label: "Wins", value: duelWins },
          ].map((s) => (
            <div key={s.label} className="rounded-btn bg-secondary px-2.5 py-2">
              <p className="font-display text-base font-bold tabular-nums">{s.value}</p>
              <p className="text-[11px] text-subtle">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Streak</h3>
          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
            <Flame className="size-4" fill="currentColor" /> {streak} days
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {week.map((d, i) => {
            const done = i <= todayIndex && todayIndex - i < streak;
            const today = i === todayIndex;
            return (
              <div key={`${d}-${i}`} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-subtle">{d}</span>
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-chip text-[11px] font-semibold",
                    done ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle",
                    today && "ring-2 ring-cream/70 ring-offset-2 ring-offset-card",
                  )}
                >
                  {done ? <Flame className="size-3.5" fill="currentColor" /> : "·"}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Complete one lesson today to keep the flame alive.</p>
      </section>

      <section className="surface p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <CalendarClock className="size-4 text-primary" /> Upcoming
        </h3>
        <ul className="mt-3 space-y-2.5">
          {upcomingSessions.map((s) => (
            <li key={s.title} className="rounded-btn border border-border bg-secondary/60 p-3">
              <p className="text-sm font-semibold leading-snug">{s.title}</p>
              <p className="mt-0.5 text-xs text-subtle">
                {s.time} · {s.host}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <Trophy className="size-4 text-primary" /> Achievements
          </h3>
          <Link to="/my-learning" hash="achievements" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {achievements.slice(0, 6).map((a) => {
            const on = unlocked.has(a.id);
            return (
              <span
                key={a.id}
                title={`${a.title} — ${a.description}`}
                className={cn(
                  "rounded-chip border px-2 py-1 text-[11px] font-medium",
                  on ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-subtle",
                )}
              >
                {a.title}
              </span>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
