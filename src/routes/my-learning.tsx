import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, Lock } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { LevelBadge, PageHeader, ProgressBar } from "@/components/codecraft/PageHeader";
import { achievements, weeklyActivity } from "@/data/content";
import { allLessons, modules } from "@/data/curriculum";
import { useUnlockedAchievements } from "@/lib/achievements";
import { levelFromXp, moduleProgress, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-learning")({
  head: () => ({
    meta: [
      { title: "My Learning — CodeCraft" },
      { name: "description", content: "Your Java progress, module completion, XP level and unlocked achievements in one place." },
      { property: "og:title", content: "My Learning — CodeCraft" },
      { property: "og:description", content: "Track lessons, modules and achievements on CodeCraft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyLearning,
});

function MyLearning() {
  const completed = useStore((s) => s.completedLessons);
  const xp = useStore((s) => s.xp);
  const unlocked = useUnlockedAchievements();
  const lvl = levelFromXp(xp);
  const overall = Math.round((completed.length / allLessons.length) * 100);
  const recent = allLessons.filter((l) => completed.includes(l.id)).slice(-5).reverse();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Progress" title="My Learning" description="Everything you've completed so far, and what's next." />

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="surface p-5">
          <p className="text-xs text-muted-foreground">Course completion</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{overall}%</p>
          <ProgressBar value={overall} className="mt-3" />
        </div>
        <div className="surface p-5">
          <p className="text-xs text-muted-foreground">Current level</p>
          <p className="mt-2 font-display text-3xl font-extrabold">Level {lvl.level}</p>
          <ProgressBar value={lvl.pct} className="mt-3" />
          <p className="mt-2 text-xs text-subtle">{lvl.toNext - lvl.into} XP to Level {lvl.level + 1}</p>
        </div>
        <div className="surface p-5">
          <p className="text-xs text-muted-foreground">XP this week</p>
          <div className="mt-1 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--subtle)", fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{ background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => [`${String(v)} XP`, "Earned"]}
                />
                <Bar dataKey="xp" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="surface p-5">
          <h2 className="mb-4 text-base font-bold">Modules</h2>
          <ul className="space-y-4">
            {modules.map((m) => {
              const p = moduleProgress(completed, m.id);
              return (
                <li key={m.id} className="flex items-center gap-4">
                  <span className="w-8 font-mono text-xs text-subtle">{String(m.index).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{m.title}</span>
                      <span className="text-xs text-subtle">
                        {p.done}/{p.total}
                      </span>
                    </div>
                    <ProgressBar value={p.pct} />
                  </div>
                  <LevelBadge level={m.level} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="surface p-5">
          <h2 className="mb-4 text-base font-bold">Recently completed</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing yet —{" "}
              <Link to="/learn" className="text-primary hover:underline">
                start your first lesson
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link
                    to="/learn/$lessonId"
                    params={{ lessonId: l.id }}
                    className="flex items-center gap-3 rounded-btn bg-secondary/50 px-3 py-2.5 transition-colors hover:bg-secondary"
                  >
                    <CheckCircle2 className="size-4 text-success" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{l.title}</span>
                      <span className="block truncate text-xs text-subtle">{l.moduleTitle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="achievements" className="scroll-mt-6">
        <h2 className="mb-3 text-lg font-bold">Achievements</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {achievements.map((a) => {
            const on = unlocked.has(a.id);
            return (
              <div key={a.id} className={cn("surface p-4", !on && "opacity-60")}>
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-btn",
                    on ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle",
                  )}
                >
                  {on ? <Award className="size-5" /> : <Lock className="size-4" />}
                </span>
                <p className="mt-3 text-sm font-bold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
