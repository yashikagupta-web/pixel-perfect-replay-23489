/** Pure date helpers for the learner activity log (no store imports, safe for tests). */

export interface DayActivity {
  xp: number;
  minutes: number;
}

/** Keyed by local calendar day, `YYYY-MM-DD`. */
export type ActivityLog = Record<string, DayActivity>;

export const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function dayKey(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function isActive(day: DayActivity | undefined) {
  return !!day && (day.xp > 0 || day.minutes > 0);
}

/**
 * Current streak counts back from today; if today has no activity yet the streak
 * stays alive from yesterday until midnight. Best is the longest run ever logged.
 */
export function computeStreak(activity: ActivityLog, today: Date = new Date()) {
  let cursor = isActive(activity[dayKey(today)]) ? today : addDays(today, -1);
  let current = 0;
  while (isActive(activity[dayKey(cursor)])) {
    current++;
    cursor = addDays(cursor, -1);
  }

  const days = Object.keys(activity)
    .filter((k) => isActive(activity[k]))
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of days) {
    if (prev) {
      const [y, m, d] = prev.split("-").map(Number) as [number, number, number];
      run = dayKey(addDays(new Date(y, m - 1, d), 1)) === k ? run + 1 : 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = k;
  }
  return { current, best: Math.max(best, current) };
}

export interface WeekDay {
  day: (typeof WEEK_LABELS)[number];
  date: string;
  minutes: number;
  xp: number;
  active: boolean;
  isToday: boolean;
  isFuture: boolean;
}

/** Monday-to-Sunday series for the week containing `today`. */
export function weekSeries(activity: ActivityLog, today: Date = new Date()): WeekDay[] {
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  const todayKey = dayKey(today);
  return WEEK_LABELS.map((label, i) => {
    const key = dayKey(addDays(monday, i));
    const a = activity[key];
    return {
      day: label,
      date: key,
      minutes: a?.minutes ?? 0,
      xp: a?.xp ?? 0,
      active: isActive(a),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    };
  });
}
