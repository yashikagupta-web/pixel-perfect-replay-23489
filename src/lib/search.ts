import { modules } from "@/data/curriculum";
import { challenges, projects } from "@/data/content";

export type SearchKind = "Module" | "Lesson" | "Concept" | "Challenge" | "Project";

export interface SearchResult {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  to: string;
  params?: Record<string, string>;
}

function buildIndex(): SearchResult[] {
  const items: SearchResult[] = [];
  for (const m of modules) {
    items.push({ id: `m-${m.id}`, kind: "Module", title: m.title, subtitle: `Module ${m.index} · ${m.level}`, to: "/learn" });
    for (const t of m.topics) {
      items.push({
        id: `c-${m.id}-${t}`,
        kind: "Concept",
        title: t,
        subtitle: `Concept in ${m.title}`,
        to: "/learn/$lessonId",
        params: { lessonId: m.lessons[0]?.id ?? "" },
      });
    }
    for (const l of m.lessons) {
      items.push({
        id: `l-${l.id}`,
        kind: "Lesson",
        title: l.title,
        subtitle: `${m.title} · ${l.minutes} min`,
        to: "/learn/$lessonId",
        params: { lessonId: l.id },
      });
    }
  }
  for (const c of challenges) {
    items.push({ id: `ch-${c.id}`, kind: "Challenge", title: c.title, subtitle: `${c.difficulty} · ${c.topic}`, to: "/daily-challenge" });
  }
  for (const p of projects) {
    items.push({ id: `p-${p.id}`, kind: "Project", title: p.title, subtitle: `${p.level} · ${p.skills.join(", ")}`, to: "/projects" });
  }
  return items;
}

const index = buildIndex();

export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = index
    .map((item) => {
      const title = item.title.toLowerCase();
      const sub = item.subtitle.toLowerCase();
      let score = 0;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 60;
      else if (title.includes(q)) score = 40;
      else if (sub.includes(q)) score = 10;
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}
