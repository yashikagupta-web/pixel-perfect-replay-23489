/**
 * A tiny in-browser preview runner. It does not compile Java: it walks the
 * statements inside main(), tracks simple variable assignments and evaluates
 * System.out.print/println calls built from literals, variables and + / - * arithmetic.
 */
export interface RunResult {
  ok: boolean;
  output: string[];
  error?: string;
  ms: number;
}

type Value = string | number | boolean;

function splitTopLevel(expr: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inStr = false;
  let cur = "";
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i] as string;
    if (ch === '"' && expr[i - 1] !== "\\") inStr = !inStr;
    if (!inStr) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === sep && depth === 0) {
        parts.push(cur);
        cur = "";
        continue;
      }
    }
    cur += ch;
  }
  parts.push(cur);
  return parts.map((p) => p.trim());
}

function evalTerm(term: string, vars: Map<string, Value>): Value {
  const t = term.trim();
  if (/^".*"$/.test(t)) return t.slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"');
  if (/^'.'$/.test(t)) return t.slice(1, -1);
  if (t === "true" || t === "false") return t === "true";
  if (/^\(.*\)$/.test(t)) return evalExpr(t.slice(1, -1), vars);
  if (/^[\d\s+\-*/%().]+$/.test(t)) {
    const n = Function(`"use strict"; return (${t});`)() as number;
    return Number.isInteger(n) ? n : Number(n.toFixed(6));
  }
  const len = t.match(/^(\w+)\.length\(\)$/);
  if (len && vars.has(len[1] as string)) return String(vars.get(len[1] as string)).length;
  const upper = t.match(/^(\w+)\.toUpperCase\(\)$/);
  if (upper && vars.has(upper[1] as string)) return String(vars.get(upper[1] as string)).toUpperCase();
  if (vars.has(t)) return vars.get(t) as Value;
  if (/^[\w\s+\-*/%().]+$/.test(t)) {
    const replaced = t.replace(/[A-Za-z_]\w*/g, (name) => {
      if (!vars.has(name)) throw new Error(`cannot find symbol: ${name}`);
      return String(vars.get(name));
    });
    return evalTerm(replaced, vars);
  }
  throw new Error(`Unsupported expression in preview runner: ${t}`);
}

function evalExpr(expr: string, vars: Map<string, Value>): Value {
  const parts = splitTopLevel(expr, "+");
  if (parts.length === 1) return evalTerm(parts[0] as string, vars);
  let acc: Value = evalTerm(parts[0] as string, vars);
  for (const p of parts.slice(1)) {
    const v = evalTerm(p, vars);
    acc = typeof acc === "number" && typeof v === "number" ? acc + v : String(acc) + String(v);
  }
  return acc;
}

export function runJava(source: string): RunResult {
  const start = performance.now();
  const output: string[] = [];
  const vars = new Map<string, Value>();
  try {
    if (!/static\s+void\s+main\s*\(/.test(source)) {
      throw new Error("error: no main method found. Add public static void main(String[] args).");
    }
    const open = (source.match(/{/g) ?? []).length;
    const close = (source.match(/}/g) ?? []).length;
    if (open !== close) throw new Error("error: reached end of file while parsing — check your braces.");

    const body = source.slice(source.indexOf("{", source.search(/static\s+void\s+main/)) + 1);
    const lines = body
      .replace(/\/\/.*$/gm, "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "}" && l !== "{");

    let line = "";
    for (const raw of lines) {
      line = raw;
      if (!line.endsWith(";") && !line.endsWith("{") && !line.endsWith("}")) {
        throw new Error(`error: ';' expected\n    ${line}`);
      }
      const stmt = line.replace(/;$/, "");
      const print = stmt.match(/^System\.out\.(println|print)\((.*)\)$/);
      if (print) {
        const val = print[2]?.trim() ? evalExpr(print[2] as string, vars) : "";
        if (print[1] === "println") output.push(String(val));
        else if (output.length) output[output.length - 1] += String(val);
        else output.push(String(val));
        continue;
      }
      const decl = stmt.match(/^(?:final\s+)?(?:int|long|double|float|String|boolean|char|var)\s+(\w+)\s*=\s*(.+)$/);
      const assign = stmt.match(/^(\w+)\s*=\s*(.+)$/);
      const m = decl ?? assign;
      if (m) {
        vars.set(m[1] as string, evalExpr(m[2] as string, vars));
        continue;
      }
      const inc = stmt.match(/^(\w+)(\+\+|--)$/);
      if (inc && typeof vars.get(inc[1] as string) === "number") {
        vars.set(inc[1] as string, (vars.get(inc[1] as string) as number) + (inc[2] === "++" ? 1 : -1));
        continue;
      }
    }
    return { ok: true, output, ms: Math.round(performance.now() - start) + 40 };
  } catch (e) {
    return { ok: false, output, error: e instanceof Error ? e.message : String(e), ms: Math.round(performance.now() - start) };
  }
}
