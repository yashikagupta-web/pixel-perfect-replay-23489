import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MonacoEditor = lazy(() => import("./MonacoEditor"));

export interface CodeEditorProps {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  fontSize?: number;
  height?: string;
}

function EditorFallback({ value, height = "100%" }: { value: string; height?: string }) {
  return (
    <pre className="m-0 overflow-auto bg-canvas p-4 font-mono text-[13px] leading-[1.7] text-muted-foreground" style={{ height }}>
      {value}
    </pre>
  );
}

export function CodeEditor(props: CodeEditorProps) {
  return (
    <ClientOnly fallback={<EditorFallback value={props.value} height={props.height} />}>
      <Suspense fallback={<EditorFallback value={props.value} height={props.height} />}>
        <MonacoEditor {...props} />
      </Suspense>
    </ClientOnly>
  );
}
