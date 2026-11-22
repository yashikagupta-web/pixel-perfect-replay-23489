import { createFileRoute } from "@tanstack/react-router";
import { Crown, Loader2, Swords, Timer, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/codecraft/PageHeader";
import { Button } from "@/components/ui/button";
import { duelQuestions, leaderboard, type DuelQuestion } from "@/data/content";
import { initials } from "@/components/layout/TopNav";
import { DUEL_WIN_XP, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deathmatch")({
  head: () => ({
    meta: [
      { title: "Deathmatch — CodeCraft" },
      { name: "description", content: "Fast-paced 1v1 Java quiz duels. Answer quicker than your rival to climb the leaderboard." },
      { property: "og:title", content: "Deathmatch — CodeCraft" },
      { property: "og:description", content: "Challenge a rival to a five-round Java duel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deathmatch,
});

const ROUNDS = 5;
const ROUND_SECONDS = 12;
const rivals = ["Arjun Mehta", "Sara Khan", "Dev Patel", "Neha Iyer"];

type Phase = "idle" | "matching" | "playing" | "done";

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Deathmatch() {
  const name = useStore((s) => s.settings.name);
  const wins = useStore((s) => s.duelWins);
  const played = useStore((s) => s.duelsPlayed);
  const recordDuel = useStore((s) => s.recordDuel);

  const [phase, setPhase] = useState<Phase>("idle");
  const [rival, setRival] = useState(rivals[0] as string);
  const [qs, setQs] = useState<DuelQuestion[]>([]);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [me, setMe] = useState(0);
  const [them, setThem] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [rivalAnswered, setRivalAnswered] = useState(false);
  const recorded = useRef(false);

  const start = () => {
    setPhase("matching");
    setRival(rivals[Math.floor(Math.random() * rivals.length)] as string);
    setTimeout(() => {
      setQs(shuffle(duelQuestions).slice(0, ROUNDS));
      setRound(0);
      setMe(0);
      setThem(0);
      setPicked(null);
      setRivalAnswered(false);
      setTimeLeft(ROUND_SECONDS);
      recorded.current = false;
      setPhase("playing");
    }, 1400);
  };

  const nextRound = useCallback(() => {
    setTimeout(() => {
      setRound((r) => {
        if (r + 1 >= ROUNDS) {
          setPhase("done");
          return r;
        }
        setPicked(null);
        setRivalAnswered(false);
        setTimeLeft(ROUND_SECONDS);
        return r + 1;
      });
    }, 1100);
  }, []);

  // round timer
  useEffect(() => {
    if (phase !== "playing" || picked !== null) return;
    if (timeLeft <= 0) {
      setPicked(-1);
      nextRound();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, picked, nextRound]);

  // rival bot
  useEffect(() => {
    if (phase !== "playing") return;
    const delay = 2500 + Math.random() * 6000;
    const id = setTimeout(() => {
      setRivalAnswered(true);
      if (Math.random() < 0.6) setThem((s) => s + 100 + Math.round(((ROUND_SECONDS * 1000 - delay) / 1000) * 5));
    }, delay);
    return () => clearTimeout(id);
  }, [phase, round]);

  useEffect(() => {
    if (phase === "done" && !recorded.current) {
      recorded.current = true;
      const won = me > them;
      recordDuel(won);
      if (won) toast.success(`Victory! +${DUEL_WIN_XP} XP`);
    }
  }, [phase, me, them, recordDuel]);

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === qs[round]?.answer) setMe((s) => s + 100 + timeLeft * 5);
    nextRound();
  };

  const q = qs[round];
  const board = [...leaderboard, { name, xp: useStore.getState().xp, wins }].sort((a, b) => b.xp - a.xp);

  return (
    <div>
      <PageHeader
        eyebrow="Compete"
        title="Deathmatch"
        description="Five rapid-fire Java questions against a rival. Correct answers score 100 points plus a speed bonus."
        actions={
          <span className="rounded-btn border border-border bg-card px-3 py-2 text-sm">
            Record <strong className="ml-1 tabular-nums">{wins}W – {played - wins}L</strong>
          </span>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="surface overflow-hidden">
          {/* scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-secondary/40 p-5">
            <Player name={name} score={me} tone="primary" />
            <span className="grid size-11 place-items-center rounded-full border border-border bg-card">
              <Swords className="size-5 text-primary" />
            </span>
            <Player name={phase === "idle" ? "Waiting…" : rival} score={them} tone="caramel" align="right" answered={rivalAnswered && phase === "playing"} />
          </div>

          <div className="min-h-[340px] p-6">
            {phase === "idle" && (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <Swords className="size-10 text-primary" />
                <h2 className="mt-4 text-2xl font-extrabold">Ready to duel?</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {ROUNDS} rounds · {ROUND_SECONDS}s each. Win to earn {DUEL_WIN_XP} XP.
                </p>
                <Button size="lg" className="mt-6" onClick={start}>
                  Find opponent
                </Button>
              </div>
            )}
            {phase === "matching" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Matching you with a rival…</p>
              </div>
            )}
            {phase === "playing" && q && (
              <motion.div key={round} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-mono text-subtle">
                    Round {round + 1}/{ROUNDS}
                  </span>
                  <span className={cn("flex items-center gap-1.5 font-mono font-semibold tabular-nums", timeLeft <= 3 ? "text-destructive" : "text-primary")}>
                    <Timer className="size-4" /> {timeLeft}s
                  </span>
                </div>
                <div className="mb-6 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }} />
                </div>
                <h2 className="mb-5 text-xl font-bold">{q.q}</h2>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {q.options.map((o, i) => {
                    const reveal = picked !== null;
                    return (
                      <button
                        key={o}
                        type="button"
                        disabled={reveal}
                        onClick={() => answer(i)}
                        className={cn(
                          "rounded-btn border px-4 py-3.5 text-left text-sm font-medium transition-all",
                          !reveal && "border-border bg-secondary/50 hover:-translate-y-0.5 hover:border-primary/60",
                          reveal && i === q.answer && "border-success bg-success/10",
                          reveal && i === picked && i !== q.answer && "border-destructive bg-destructive/10",
                          reveal && i !== q.answer && i !== picked && "border-border opacity-50",
                        )}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                {picked === -1 && <p className="mt-4 text-sm text-destructive">Time's up!</p>}
              </motion.div>
            )}
            {phase === "done" && (
              <div className="flex flex-col items-center py-10 text-center">
                <Trophy className={cn("size-12", me > them ? "text-primary" : "text-subtle")} />
                <h2 className="mt-4 text-3xl font-extrabold">{me > them ? "Victory!" : me === them ? "Draw" : "Defeated"}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {me} – {them} against {rival}
                </p>
                <Button size="lg" className="mt-6" onClick={start}>
                  Rematch
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Crown className="size-4 text-primary" /> Leaderboard
          </h2>
          <ol className="mt-4 space-y-1.5">
            {board.map((p, i) => (
              <li
                key={p.name}
                className={cn("flex items-center gap-3 rounded-btn px-3 py-2.5", p.name === name ? "bg-primary/10 ring-1 ring-primary/30" : "bg-secondary/50")}
              >
                <span className={cn("w-5 font-mono text-sm font-semibold", i < 3 ? "text-primary" : "text-subtle")}>{i + 1}</span>
                <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold">{initials(p.name)}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                <span className="text-right text-xs">
                  <span className="block font-semibold tabular-nums">{p.xp.toLocaleString("en-IN")} XP</span>
                  <span className="text-subtle">{p.wins} wins</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function Player({
  name,
  score,
  tone,
  align = "left",
  answered = false,
}: {
  name: string;
  score: number;
  tone: "primary" | "caramel";
  align?: "left" | "right";
  answered?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold text-ink", tone === "primary" ? "bg-primary" : "bg-caramel")}>
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{name}</span>
        <span className="font-display text-xl font-extrabold tabular-nums">{score}</span>
        {answered && <span className="ml-2 text-[11px] text-subtle">answered</span>}
      </span>
    </div>
  );
}
