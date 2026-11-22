import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuizCard({
  question,
  options,
  answer,
  explanation,
  onCorrect,
  label = "Exercise",
  mono = false,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  onCorrect?: () => void;
  label?: string;
  mono?: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked === answer;

  return (
    <div className="surface p-5 sm:p-6">
      <p className="eyebrow">{label}</p>
      <h3 className="mt-2 text-lg font-bold">{question}</h3>
      <div role="radiogroup" aria-label={question} className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const state = checked ? (i === answer ? "right" : i === picked ? "wrong" : "idle") : picked === i ? "picked" : "idle";
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={picked === i}
              disabled={correct}
              onClick={() => {
                setPicked(i);
                setChecked(false);
              }}
              className={cn(
                "flex items-center gap-3 rounded-btn border px-4 py-3 text-left text-sm transition-all",
                mono && "font-mono",
                state === "idle" && "border-border bg-secondary/50 hover:border-subtle",
                state === "picked" && "border-primary bg-primary/10 text-foreground",
                state === "right" && "border-success bg-success/10 text-foreground",
                state === "wrong" && "border-destructive bg-destructive/10",
              )}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-chip bg-secondary font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              {o}
            </button>
          );
        })}
      </div>
      {checked && (
        <div
          role="status"
          className={cn(
            "mt-4 flex items-start gap-2.5 rounded-btn p-3 text-sm",
            correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {correct ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
          <span>
            <strong>{correct ? "Correct!" : "Not quite."}</strong>{" "}
            <span className="text-muted-foreground">{correct ? explanation : "Look at the example again and try another option."}</span>
          </span>
        </div>
      )}
      {!correct && (
        <Button
          className="mt-4"
          disabled={picked === null}
          onClick={() => {
            setChecked(true);
            if (picked === answer) onCorrect?.();
          }}
        >
          Check answer
        </Button>
      )}
    </div>
  );
}
