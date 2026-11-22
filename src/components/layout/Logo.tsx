import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-btn bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* steam */}
        <path d="M10 2.5c-.8 1 .8 2-.1 3" />
        <path d="M14 2.5c-.8 1 .8 2-.1 3" />
        {/* cup made of code braces */}
        <path d="M6.5 9h11v4.5a5.5 5.5 0 0 1-11 0z" />
        <path d="M17.5 10.5h1a2 2 0 0 1 0 4h-1.3" />
        <path d="m10.5 11.5-1.2 1.5 1.2 1.5M13.5 11.5l1.2 1.5-1.2 1.5" />
        <path d="M5 21.5h14" />
      </svg>
    </span>
  );
}

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      {!collapsed && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          Code<span className="text-primary">Craft</span>
        </span>
      )}
    </div>
  );
}
