import { useNavigate } from "@tanstack/react-router";
import { BookOpen, FolderKanban, Lightbulb, Layers, Search, Target } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { search, type SearchKind, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";

const kindIcon: Record<SearchKind, typeof BookOpen> = {
  Module: Layers,
  Lesson: BookOpen,
  Concept: Lightbulb,
  Challenge: Target,
  Project: FolderKanban,
};

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (r: SearchResult) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    if (r.params) navigate({ to: "/learn/$lessonId", params: { lessonId: r.params["lessonId"] ?? "" } });
    else navigate({ to: r.to as "/learn" });
  };

  const showList = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        aria-label="Search courses, lessons and Java topics"
        placeholder="Search courses, lessons, Java topics..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            go(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="h-11 w-full rounded-btn border border-border bg-card pl-10 pr-14 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-chip border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:block">
        Ctrl K
      </kbd>
      {showList && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-card border border-border bg-popover shadow-pop">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No results for “{query}”</p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto p-1.5">
              {results.map((r, i) => {
                const Icon = kindIcon[r.kind];
                return (
                  <li
                    key={r.id}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      go(r);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-btn px-3 py-2.5",
                      i === active && "bg-secondary",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-chip bg-secondary text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{r.title}</span>
                      <span className="block truncate text-xs text-subtle">{r.subtitle}</span>
                    </span>
                    <span className="rounded-chip border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {r.kind}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
