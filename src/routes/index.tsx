import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Flame, Play, Swords, Target, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { LevelBadge, ProgressBar } from "@/components/codecraft/PageHeader";
import { Button } from "@/components/ui/button";
import { challenges, weeklyActivity } from "@/data/content";
import { allLessons, modules } from "@/data/curriculum";
import { moduleProgress, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodeCraft" },
      { name: "description", content: "Your personal Java learning dashboard: continue lessons, track XP and streaks, and jump into today's challenge." },
      { property: "og:title", content: "Dashboard — CodeCraft" },
      { property: "og:description", content: "Track your Java learning progress, streaks and daily challenges on CodeCraft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function HeroArt() {
  return (
    <svg viewBox="0 0 260 180" className="h-full w-full" aria-hidden>
      <rect x="40" y="18" width="190" height="130" rx="14" className="fill-ink" />
      <circle cx="58" cy="36" r="4" className="fill-primary" />
      <circle cx="72" cy="36" r="4" className="fill-caramel" />
      <circle cx="86" cy="36" r="4" className="fill-cream" opacity=".5" />
      <rect x="58" y="56" width="58" height="7" rx="3.5" className="fill-primary" />
      <rect x="122" y="56" width="40" height="7" rx="3.5" className="fill-cream" opacity=".45" />
      <rect x="74" y="72" width="96" height="7" rx="3.5" className="fill-cream" opacity=".7" />
      <rect x="74" y="88" width="62" height="7" rx="3.5" className="fill-caramel" />
      <rect x="90" y="104" width="80" height="7" rx="3.5" className="fill-cream" opacity=".35" />
      <rect x="58" y="120" width="30" height="7" rx="3.5" className="fill-primary" opacity=".8" />
      <g transform="translate(6 96)">
        <rect width="78" height="70" rx="12" className="fill-primary" />
        <text x="39" y="45" textAnchor="middle" className="fill-ink font-mono" fontSize="26" fontWeight="700">
          {"{ }"}
        </text>
      </g>
      <g transform="translate(196 118)">
        <path d="M0 10h36v18a18 18 0 0 1-36 0z" className="fill-cream" />
        <path d="M36 15h5a6.5 6.5 0 0 1 0 13h-5" fill="none" strokeWidth="4" className="stroke-cream" />
        <path d="M10 -2c-3 4 3 5 0 9M22 -2c-3 4 3 5 0 9" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-cream" opacity=".7" />
      </g>
    </svg>
  );
}

function Dashboard() {
  const name = useStore((s) => s.settings.name);
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const completed = useStore((s) => s.completedLessons);
  const solved = useStore((s) => s.solvedChallenges);
  const next = allLessons.find((l) => !completed.includes(l.id)) ?? allLessons[allLessons.length - 1];
  const overall = Math.round((completed.length / allLessons.length) * 100);
  const inProgress = modules
    .map((m) => ({ m, p: moduleProgress(completed, m.id) }))
    .filter(({ p }) => p.pct < 100)
    .slice(0, 3);
  const today = challenges[0];
  const totalMinutes = weeklyActivity.reduce((a, d) => a + d.minutes, 0);

  const stats = [
    { label: "Total XP", value: xp.toLocaleString("en-IN"), icon: Zap, hint: "+260 this week" },
    { label: "Day streak", value: `${streak}`, icon: Flame, hint: "Best: 14 days" },
    { label: "Lessons done", value: `${completed.length}/${allLessons.length}`, icon: BookOpen, hint: `${overall}% of the course` },
    { label: "Time this week", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, icon: Clock, hint: "Goal: 3h 30m" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-hero bg-cream text-cream-foreground">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Welcome back, {name.split(" ")[0]}</p>
            <h1 className="mt-3 max-w-lg text-3xl font-extrabold leading-[1.1] sm:text-[40px]">
              Craft Java, one clean line at a time.
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
              Up next: <strong className="text-ink">{next?.title}</strong> in {next?.moduleTitle}. You're {overall}% through the
              Java track.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {next && (
                <Button asChild size="lg">
                  <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                    <Play fill="currentColor" /> Continue learning
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline-ink">
                <Link to="/learn">Browse modules</Link>
              </Button>
            </div>
          </div>
          <div className="hidden h-48 md:block">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-extrabold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-xs text-subtle">{s.hint}</p>
          </div>
        ))}
      </section>

      {/* Continue learning */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Continue learning</h2>
          <Link to="/learn" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            All modules <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {inProgress.map(({ m, p }, i) => {
            const nextInModule = m.lessons.find((l) => !completed.includes(l.id)) ?? m.lessons[0];
            return (
              <Link
                key={m.id}
                to="/learn/$lessonId"
                params={{ lessonId: nextInModule?.id ?? "" }}
                className={`group surface flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-subtle ${i === 0 ? "ring-1 ring-primary/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-subtle">MODULE {String(m.index).padStart(2, "0")}</span>
                  <LevelBadge level={m.level} />
                </div>
                <h3 className="mt-3 text-base font-bold">{m.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
                <div className="mt-auto pt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-subtle">
                      {p.done}/{p.total} lessons
                    </span>
                    <span className="font-semibold text-primary">{p.pct}%</span>
                  </div>
                  <ProgressBar value={p.pct} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity + side cards */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Learning activity</h2>
              <p className="text-xs text-subtle">Minutes spent coding this week</p>
            </div>
            <span className="rounded-chip bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">This week</span>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ left: -20, right: 4, top: 8 }}>
                <defs>
                  <linearGradient id="fillMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--subtle)", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--subtle)", fontSize: 12 }} />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${String(v)} min`, "Time"]}
                />
                <Area type="monotone" dataKey="minutes" stroke="var(--primary)" strokeWidth={2.5} fill="url(#fillMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4">
          {today && (
            <Link to="/daily-challenge" className="group surface-2 block p-5 transition-colors hover:border-primary/50">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Target className="size-4" /> Daily challenge
                </span>
                <LevelBadge level={today.difficulty} />
              </div>
              <h3 className="mt-3 text-base font-bold">{today.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {solved.includes(today.id) ? "Solved today — nice work." : "Predict the output and earn +100 XP."}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-primary">
                {solved.includes(today.id) ? "Review solution" : "Solve now"} <ArrowRight className="size-3.5" />
              </span>
            </Link>
          )}
          <Link to="/deathmatch" className="group surface block p-5 transition-colors hover:border-primary/50">
            <span className="flex items-center gap-2 text-xs font-semibold text-caramel">
              <Swords className="size-4" /> Deathmatch
            </span>
            <h3 className="mt-3 text-base font-bold">Quick duel · 5 rounds</h3>
            <p className="mt-1 text-sm text-muted-foreground">Answer faster than your rival to climb the leaderboard.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold group-hover:text-primary">
              Find opponent <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
