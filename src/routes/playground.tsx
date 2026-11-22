import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Play, RotateCcw, Terminal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CodeEditor } from "@/components/codecraft/CodeEditor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { runJava, type RunResult } from "@/lib/java-runner";
import { DEFAULT_CODE, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Coding Playground — CodeCraft" },
      { name: "description", content: "Write and run Java snippets in a full-screen editor with instant console output." },
      { property: "og:title", content: "Coding Playground — CodeCraft" },
      { property: "og:description", content: "A focused Java editor with syntax highlighting and a live console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Playground,
});

const templates: Record<string, string> = {
  hello: DEFAULT_CODE,
  variables: `public class Main {
    public static void main(String[] args) {
        int apples = 12;
        int friends = 4;
        double each = 12.0 / 4;
        System.out.println("Apples: " + apples);
        System.out.println("Each friend gets " + each);
    }
}`,
  strings: `public class Main {
    public static void main(String[] args) {
        String language = "Java";
        String shout = language.toUpperCase();
        System.out.println(shout + " has " + language.length() + " letters");
    }
}`,
};

function Playground() {
  const code = useStore((s) => s.playgroundCode);
  const setCode = useStore((s) => s.setPlaygroundCode);
  const fontSize = useStore((s) => s.settings.editorFontSize);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setResult(runJava(code));
      setRunning(false);
    }, 350);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="flex min-h-[420px] flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
          <span className="rounded-chip bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground">Main.java</span>
          <Select onValueChange={(v) => setCode(templates[v] ?? DEFAULT_CODE)}>
            <SelectTrigger className="h-8 w-40 rounded-btn border-border bg-card text-xs" aria-label="Load a template">
              <SelectValue placeholder="Templates" />
            </SelectTrigger>
            <SelectContent className="rounded-card border-border bg-popover">
              <SelectItem value="hello">Hello World</SelectItem>
              <SelectItem value="variables">Variables</SelectItem>
              <SelectItem value="strings">Strings</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy code"
              onClick={() => {
                void navigator.clipboard.writeText(code);
                toast("Code copied");
              }}
            >
              <Copy />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Reset code" onClick={() => setCode(DEFAULT_CODE)}>
              <RotateCcw />
            </Button>
            <Button size="sm" onClick={run} disabled={running}>
              {running ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />} Run
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-canvas">
          <CodeEditor value={code} onChange={setCode} fontSize={fontSize} />
        </div>
      </section>

      <section className="flex min-h-[260px] flex-col lg:w-[38%] lg:max-w-[520px]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
          <Terminal className="size-4 text-primary" />
          <span className="text-sm font-semibold">Console</span>
          {result && (
            <span className={cn("ml-2 text-xs", result.ok ? "text-success" : "text-destructive")}>
              {result.ok ? `Finished in ${result.ms}ms` : "Compilation failed"}
            </span>
          )}
          <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="Clear console" onClick={() => setResult(null)}>
            <Trash2 />
          </Button>
        </div>
        <div className="flex-1 overflow-auto bg-canvas p-4 font-mono text-[13px] leading-relaxed sm:p-6" aria-live="polite">
          {!result && !running && <p className="text-subtle">Press Run to execute Main.java. Output appears here.</p>}
          {running && <p className="text-subtle">$ javac Main.java && java Main</p>}
          {result && !running && (
            <>
              <p className="mb-2 text-subtle">$ java Main</p>
              {result.output.map((line, i) => (
                <p key={i} className="whitespace-pre-wrap text-foreground">
                  {line}
                </p>
              ))}
              {result.error && <p className="mt-2 whitespace-pre-wrap text-destructive">{result.error}</p>}
              {result.ok && result.output.length === 0 && <p className="text-subtle">(no output)</p>}
            </>
          )}
        </div>
        <p className="border-t border-border px-4 py-2.5 text-[11px] text-subtle sm:px-6">
          Preview runner: supports variables, strings, arithmetic and print statements inside main().
        </p>
      </section>
    </div>
  );
}
