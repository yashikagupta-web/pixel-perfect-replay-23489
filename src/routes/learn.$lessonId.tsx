import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Clock, Code2, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { QuizCard } from "@/components/codecraft/QuizCard";
import { RichText } from "@/components/codecraft/RichText";
import { Button } from "@/components/ui/button";
import { findLesson, LESSON_XP, modules, nextLesson, prevLesson } from "@/data/curriculum";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/$lessonId")({
  loader: ({ params }) => {
    const lesson = findLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.lesson.title} — Learn Java · CodeCraft` : "Lesson unavailable — CodeCraft";
    const description = loaderData?.lesson.summary ?? "This lesson could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: LessonPage,
});

function wrapForPlayground(code: string) {
  if (/static\s+void\s+main/.test(code)) return code;
  const body = code
    .split("\n")
    .map((l) => `        ${l}`)
    .join("\n");
  return `public class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
}

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const completed = useStore((s) => s.completedLessons);
  const completeLesson = useStore((s) => s.completeLesson);
  const setPlaygroundCode = useStore((s) => s.setPlaygroundCode);
  const navigate = useNavigate();
  const mod = modules.find((m) => m.id === lesson.moduleId);
  const done = completed.includes(lesson.id);
  const next = nextLesson(lesson.id);
  const prev = prevLesson(lesson.id);

  const finish = () => {
    if (completeLesson(lesson.id)) {
      toast.success(`Lesson complete · +${LESSON_XP} XP`, { description: lesson.title });
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_260px]">
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-subtle">
          <Link to="/learn" className="hover:text-foreground">
            Learn Java
          </Link>
          <ChevronRight className="size-3.5" />
          <span>{lesson.moduleTitle}</span>
          <ChevronRight className="size-3.5" />
          <span className="text-muted-foreground">{lesson.title}</span>
        </nav>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-subtle">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {lesson.minutes} min read
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="size-3.5" /> +{LESSON_XP} XP
            </span>
            {done && (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="size-3.5" /> Completed
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{lesson.summary}</p>
        </header>

        <div className="prose-lesson max-w-[68ch] space-y-4">
          {lesson.body.map((p) => (
            <p key={p.slice(0, 24)}>
              <RichText text={p} />
            </p>
          ))}
        </div>

        <div className="my-8 rounded-card border-l-2 border-primary bg-card p-5">
          <p className="eyebrow mb-3">Key points</p>
          <ul className="prose-lesson space-y-2">
            {lesson.keyPoints.map((k) => (
              <li key={k} className="flex gap-2.5">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <RichText text={k} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between rounded-t-card border border-b-0 border-border bg-card px-4 py-2.5">
            <span className="font-mono text-xs text-subtle">Example.java</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(lesson.code);
                  toast("Code copied");
                }}
              >
                <Copy /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPlaygroundCode(wrapForPlayground(lesson.code));
                  void navigate({ to: "/playground" });
                }}
              >
                <Code2 /> Try it
              </Button>
            </div>
          </div>
          <pre className="code-block m-0 rounded-t-none">{lesson.code}</pre>
        </div>

        <QuizCard
          key={lesson.id}
          question={lesson.quiz.question}
          options={lesson.quiz.options}
          answer={lesson.quiz.answer}
          explanation={lesson.quiz.explanation}
          onCorrect={finish}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          {prev ? (
            <Button asChild variant="ghost">
              <Link to="/learn/$lessonId" params={{ lessonId: prev.id }}>
                <ArrowLeft /> {prev.title}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            {!done && (
              <Button variant="secondary" onClick={finish}>
                <CheckCircle2 /> Mark complete
              </Button>
            )}
            {next && (
              <Button asChild>
                <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                  Next: {next.title} <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>

      {mod && (
        <aside className="hidden xl:block">
          <div className="sticky top-0 surface p-4">
            <p className="eyebrow mb-1">Module {mod.index}</p>
            <p className="mb-3 font-display text-sm font-bold">{mod.title}</p>
            <ol className="space-y-1">
              {mod.lessons.map((l) => {
                const isCurrent = l.id === lesson.id;
                const isDone = completed.includes(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      to="/learn/$lessonId"
                      params={{ lessonId: l.id }}
                      className={cn(
                        "flex items-center gap-2 rounded-chip px-2.5 py-2 text-sm transition-colors",
                        isCurrent ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <CheckCircle2 className={cn("size-4 shrink-0", isDone ? "text-success" : "text-border")} />
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      )}
    </div>
  );
}
