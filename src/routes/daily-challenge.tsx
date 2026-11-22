import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LevelBadge, PageHeader } from "@/components/codecraft/PageHeader";
import { QuizCard } from "@/components/codecraft/QuizCard";
import { CHALLENGE_XP, challenges } from "@/data/content";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daily-challenge")({
  head: () => ({
    meta: [
      { title: "Daily Challenge — CodeCraft" },
      { name: "description", content: "A new Java puzzle every day. Predict the output, learn the trick and earn XP." },
      { property: "og:title", content: "Daily Challenge — CodeCraft" },
      { property: "og:description", content: "Solve today's Java puzzle and keep your streak alive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyChallenge,
});

function useCountdown() {
  const [left, setLeft] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const s = Math.floor((end.getTime() - now.getTime()) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLeft(`${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function DailyChallenge() {
  const solved = useStore((s) => s.solvedChallenges);
  const solveChallenge = useStore((s) => s.solveChallenge);
  const [selected, setSelected] = useState(challenges[0]?.id ?? "");
  const countdown = useCountdown();
  const current = challenges.find((c) => c.id === selected) ?? challenges[0];
  if (!current) return null;
  const isSolved = solved.includes(current.id);

  return (
    <div>
      <PageHeader
        eyebrow="Daily challenge"
        title={current.title}
        description={`${current.prompt} Solve it to earn +${CHALLENGE_XP} XP.`}
        actions={
          <span className="flex items-center gap-2 rounded-btn border border-border bg-card px-3 py-2 text-sm">
            <Clock className="size-4 text-primary" /> Next in <span className="font-mono font-semibold tabular-nums">{countdown}</span>
          </span>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <LevelBadge level={current.difficulty} />
        <span className="rounded-chip bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{current.topic}</span>
        {isSolved && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <CheckCircle2 className="size-3.5" /> Solved
          </span>
        )}
      </div>
      <pre className="code-block mb-5">{current.code}</pre>
      <QuizCard
        key={current.id}
        label="What is the output?"
        question="Choose the printed lines, in order"
        options={current.options}
        answer={current.answer}
        explanation={current.explanation}
        mono
        onCorrect={() => {
          if (solveChallenge(current.id)) toast.success(`Challenge solved · +${CHALLENGE_XP} XP`);
        }}
      />

      <h2 className="mb-3 mt-10 text-lg font-bold">Recent challenges</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {challenges.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            className={cn(
              "surface p-4 text-left transition-colors hover:border-subtle",
              c.id === current.id && "border-primary/60",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-subtle">{c.date}</span>
              {solved.includes(c.id) ? (
                <CheckCircle2 className="size-4 text-success" />
              ) : null}
            </div>
            <p className="mt-2 text-sm font-semibold">{c.title}</p>
            <div className="mt-2">
              <LevelBadge level={c.difficulty} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
