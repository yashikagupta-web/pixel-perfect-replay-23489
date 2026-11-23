import { describe, expect, it } from "vitest";

import { runJava } from "@/lib/java-runner";
import { search } from "@/lib/search";

describe("search", () => {
  it("finds modules by name", () => {
    expect(search("Loops").some((r) => r.kind === "Module" && r.title === "Loops")).toBe(true);
  });
  it("finds lessons by title", () => {
    expect(search("For Loops")[0]?.kind).toBe("Lesson");
  });
  it("finds Java concepts", () => {
    expect(search("polymorphism").some((r) => r.kind === "Concept")).toBe(true);
  });
  it("finds challenges and projects", () => {
    expect(search("String Pool").some((r) => r.kind === "Challenge")).toBe(true);
    expect(search("Library").some((r) => r.kind === "Project")).toBe(true);
  });
});

describe("preview runner", () => {
  it("prints string concatenation and arithmetic", () => {
    const res = runJava(`public class Main { public static void main(String[] args) {
      String name = "CodeCraft";
      System.out.println("Hi " + name);
      System.out.println("2 + 3 = " + (2 + 3));
    } }`.replace(/; /g, ";\n").replace(/{ /g, "{\n"));
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(["Hi CodeCraft", "2 + 3 = 5"]);
  });
  it("reports a missing semicolon", () => {
    const res = runJava(`public class Main {\n public static void main(String[] args) {\n System.out.println("x")\n }\n}`);
    expect(res.ok).toBe(false);
    expect(res.error).toContain("';' expected");
  });
});
