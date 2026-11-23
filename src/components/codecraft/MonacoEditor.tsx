import Editor, { type BeforeMount } from "@monaco-editor/react";

import type { CodeEditorProps } from "./CodeEditor";

const beforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("codecraft", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "F4A65A" },
      { token: "string", foreground: "91C99A" },
      { token: "number", foreground: "E9B66D" },
      { token: "comment", foreground: "77756F", fontStyle: "italic" },
      { token: "type", foreground: "F5E4C9" },
    ],
    colors: {
      "editor.background": "#0B0B0A",
      "editor.foreground": "#F5F2EC",
      "editorLineNumber.foreground": "#4A4842",
      "editorLineNumber.activeForeground": "#D89A56",
      "editor.lineHighlightBackground": "#1D1D1A",
      "editor.selectionBackground": "#F4A65A33",
      "editorCursor.foreground": "#F4A65A",
      "editorIndentGuide.background1": "#25231F",
    },
  });
};

export default function MonacoEditor({ value, onChange, readOnly, fontSize = 14, height = "100%" }: CodeEditorProps) {
  return (
    <Editor
      height={height}
      defaultLanguage="java"
      value={value}
      theme="codecraft"
      beforeMount={beforeMount}
      onChange={(v) => onChange?.(v ?? "")}
      loading={<span className="font-mono text-xs text-subtle">Loading editor…</span>}
      options={{
        readOnly: readOnly ?? false,
        fontSize,
        fontFamily: "'JetBrains Mono', monospace",
        fontLigatures: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "line",
        smoothScrolling: true,
        tabSize: 4,
        automaticLayout: true,
      }}
    />
  );
}
