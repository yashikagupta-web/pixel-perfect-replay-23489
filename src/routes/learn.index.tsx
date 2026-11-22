import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown, Circle, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { LevelBadge, PageHeader, ProgressBar } from "@/components/codecraft/PageHeader";
import { modules, type Level } from "@/data/curriculum";
import { moduleProgress, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn Java — CodeCraft" },
      { name: "description", content: "A structured Java curriculum from foundations to streams: modules, lessons, examples and exercises." },
      { property: "og:title", content: "Learn Java — CodeCraft" },
      { property: "og:description", content: "Eight structured Java modules from beginner to advanced." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnPage,
});

const filters: ("All" | Level)[] = ["All", "Beginner", "Intermediate", "Advanced"];

function LearnPage() {
  const completed = useStore((s) => s.completedLessons);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<string | null>(modules.find((m) => moduleProgress(completed, m.id).pct < 100)?.id ?? null);
  const list = modules.filter((m) => filter === "All" || m.level === filter);

  return (
    <div>
      <PageHeader
        eyebrow="Java track"
        title="Learn Java"
        description="Eight modules that take you from your first println to streams and lambdas. Each lesson ends with an exercise."
      />
      <div role="tablist" aria-label="Filter by level" className="mb-5 inline-flex rounded-btn border border-border bg-card p-1">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-chip px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f ? "bg-secondary text-foreground" : "text-subtle hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((m) => {
          const p = moduleProgress(completed, m.id);
          const isOpen = open === m.id;
          return (
            <section key={m.id} className={cn("surface overflow-hidden transition-colors", isOpen && "border-subtle")}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : m.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-btn font-mono text-sm font-semibold",
                    p.pct === 100 ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
                  )}
                >
                  {String(m.index).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-bold">{m.title}</span>
                    <LevelBadge level={m.level} />
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">{m.description}</span>
                </span>
                <span className="hidden w-40 sm:block">
                  <span className="mb-1.5 flex justify-between text-xs">
                    <span className="text-subtle">
                      {p.done}/{p.total}
                    </span>
                    <span className="font-semibold text-primary">{p.pct}%</span>
                  </span>
                  <ProgressBar value={p.pct} />
                </span>
                <ChevronDown className={cn("size-5 shrink-0 text-subtle transition-transform", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="border-t border-border px-3 pb-3 pt-2">
                      <div className="flex flex-wrap gap-1.5 px-2 py-2">
                        {m.topics.map((t) => (
                          <span key={t} className="rounded-chip bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                      <ul>
                        {m.lessons.map((l, i) => {
                          const done = completed.includes(l.id);
                          return (
                            <li key={l.id}>
                              <Link
                                to="/learn/$lessonId"
                                params={{ lessonId: l.id }}
                                className="group flex items-center gap-3 rounded-btn px-3 py-3 transition-colors hover:bg-secondary"
                              >
                                {done ? (
                                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                                ) : (
                                  <Circle className="size-5 shrink-0 text-subtle" />
                                )}
                                <span className="font-mono text-xs text-subtle">
                                  {m.index}.{i + 1}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium group-hover:text-primary">{l.title}</span>
                                  <span className="block truncate text-xs text-subtle">{l.summary}</span>
                                </span>
                                <span className="flex items-center gap-1 text-xs text-subtle">
                                  <Clock className="size-3.5" /> {l.minutes}m
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}
