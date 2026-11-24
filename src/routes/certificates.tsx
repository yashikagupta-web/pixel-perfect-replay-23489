import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Lock, Printer } from "lucide-react";

import { LogoMark } from "@/components/layout/Logo";
import { PageHeader, ProgressBar } from "@/components/codecraft/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { modules, type Module } from "@/data/curriculum";
import { displayName } from "@/lib/progress";
import { moduleProgress, useStore } from "@/lib/store";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — CodeCraft" },
      { name: "description", content: "Earn a CodeCraft certificate for every Java module you complete." },
      { property: "og:title", content: "Certificates — CodeCraft" },
      { property: "og:description", content: "Module certificates for your Java learning journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Certificates,
});

function CertificateArt({ mod, name }: { mod: Module; name: string }) {
  return (
    <div className="dot-grid relative overflow-hidden rounded-hero bg-cream p-8 text-cream-foreground sm:p-10">
      <div className="absolute inset-3 rounded-card border border-ink/15" />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-extrabold">CodeCraft</span>
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-ink/55">Certificate of completion</p>
        <p className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{name}</p>
        <p className="mt-3 max-w-md text-sm text-ink/70">
          has successfully completed all lessons and exercises in <strong className="text-ink">Module {mod.index}: {mod.title}</strong>{" "}
          of the CodeCraft Java track.
        </p>
        <div className="mt-8 flex items-end justify-between gap-4 text-xs text-ink/60">
          <span>
            Issued {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="font-mono">ID CC-{mod.index.toString().padStart(3, "0")}-JAVA</span>
        </div>
      </div>
    </div>
  );
}

function Certificates() {
  const completed = useStore((s) => s.completedLessons);
  const name = displayName(useStore((s) => s.settings.name));
  const earned = modules.filter((m) => moduleProgress(completed, m.id).pct === 100).length;

  return (
    <div>
      <PageHeader
        eyebrow="Credentials"
        title="Certificates"
        description={`Finish every lesson in a module to earn its certificate. You've earned ${earned} of ${modules.length}.`}
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {modules.map((m) => {
          const p = moduleProgress(completed, m.id);
          const unlocked = p.pct === 100;
          return (
            <article key={m.id} className="surface flex flex-col p-5">
              <div className="flex items-center gap-3">
                <span
                  className={
                    unlocked
                      ? "grid size-11 place-items-center rounded-btn bg-primary text-primary-foreground"
                      : "grid size-11 place-items-center rounded-btn bg-secondary text-subtle"
                  }
                >
                  {unlocked ? <Award className="size-5" /> : <Lock className="size-4" />}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-subtle">MODULE {String(m.index).padStart(2, "0")}</p>
                  <h2 className="truncate text-base font-bold">{m.title}</h2>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-subtle">
                    {p.done}/{p.total} lessons
                  </span>
                  <span className="font-semibold text-primary">{p.pct}%</span>
                </div>
                <ProgressBar value={p.pct} />
              </div>
              <div className="mt-5">
                {unlocked ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        View certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card p-4 sm:p-5">
                      <DialogTitle className="sr-only">Certificate for {m.title}</DialogTitle>
                      <CertificateArt mod={m} name={name} />
                      <Button onClick={() => window.print()} className="justify-self-end">
                        <Printer /> Print or save as PDF
                      </Button>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/learn">Continue module</Link>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
