import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold text-foreground sm:text-[34px]">{title}</h1>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const tone =
    level === "Beginner" || level === "Easy"
      ? "text-success border-success/30 bg-success/10"
      : level === "Intermediate" || level === "Medium"
        ? "text-warning border-warning/30 bg-warning/10"
        : "text-destructive border-destructive/30 bg-destructive/10";
  return <span className={`rounded-chip border px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{level}</span>;
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-secondary ${className}`}
    >
      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}
