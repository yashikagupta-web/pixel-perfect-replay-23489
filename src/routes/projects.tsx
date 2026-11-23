import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LevelBadge, PageHeader, ProgressBar } from "@/components/codecraft/PageHeader";
import { projects } from "@/data/content";
import { PROJECT_XP, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — CodeCraft" },
      { name: "description", content: "Build real Java projects step by step: bank systems, library managers, games and more." },
      { property: "og:title", content: "Projects — CodeCraft" },
      { property: "og:description", content: "Guided Java projects from beginner to advanced." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projects,
});

function Projects() {
  const steps = useStore((s) => s.projectSteps);
  const done = useStore((s) => s.completedProjects);
  const toggle = useStore((s) => s.toggleProjectStep);
  const [open, setOpen] = useState<string>(projects[0]?.id ?? "");

  return (
    <div>
      <PageHeader
        eyebrow="Build"
        title="Projects"
        description={`Apply what you've learned. Tick off each milestone — finishing a project earns ${PROJECT_XP} XP.`}
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {projects.map((p) => {
          const mine = steps[p.id] ?? [];
          const pct = Math.round((mine.length / p.steps.length) * 100);
          const isOpen = open === p.id;
          const finished = done.includes(p.id);
          return (
            <article key={p.id} className={cn("surface flex flex-col p-5", finished && "border-primary/50")}>
              <div className="flex items-center justify-between">
                <LevelBadge level={p.level} />
                <span className="flex items-center gap-1 text-xs text-subtle">
                  <Clock className="size-3.5" /> ~{p.hours}h
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <span key={s} className="rounded-chip bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-subtle">
                    {mine.length}/{p.steps.length} milestones
                  </span>
                  <span className="font-semibold text-primary">{finished ? "Completed" : `${pct}%`}</span>
                </div>
                <ProgressBar value={pct} />
              </div>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? "" : p.id)}
                aria-expanded={isOpen}
                className="mt-4 text-left text-sm font-semibold text-primary hover:underline"
              >
                {isOpen ? "Hide milestones" : "View milestones"}
              </button>
              {isOpen && (
                <ul className="mt-3 space-y-1.5">
                  {p.steps.map((s, i) => {
                    const checked = mine.includes(i);
                    return (
                      <li key={s}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={() => {
                            const willFinish = !checked && mine.length + 1 === p.steps.length && !finished;
                            toggle(p.id, i, p.steps.length);
                            if (willFinish) toast.success(`Project complete · +${PROJECT_XP} XP`, { description: p.title });
                          }}
                          className="flex w-full items-center gap-3 rounded-btn px-2.5 py-2 text-left text-sm transition-colors hover:bg-secondary"
                        >
                          <span
                            className={cn(
                              "grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors",
                              checked ? "border-primary bg-primary text-primary-foreground" : "border-subtle",
                            )}
                          >
                            {checked && <Check className="size-3.5" />}
                          </span>
                          <span className={cn(checked && "text-subtle line-through")}>{s}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
