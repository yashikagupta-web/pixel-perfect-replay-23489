import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LESSON_XP, modules } from "@/data/curriculum";
import { CHALLENGE_XP, seedPosts, type Post } from "@/data/content";
import { dayKey, type ActivityLog } from "@/lib/activity";

export const DUEL_WIN_XP = 75;
export const DUEL_PLAY_XP = 15;
export const PROJECT_XP = 200;

export const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        String name = "CodeCraft";
        System.out.println("Hello from " + name + "!");
        System.out.println("2 + 3 = " + (2 + 3));
    }
}`;

export interface AppNotification {
  id: string;
  kind: "milestone" | "lesson" | "challenge" | "achievement";
  title: string;
  time: string;
  read: boolean;
}

interface Settings {
  name: string;
  email: string;
  dailyGoal: number;
  emailReminders: boolean;
  challengeReminders: boolean;
  editorFontSize: number;
}

export interface CodeCraftState {
  xp: number;
  /** Per-day XP and active minutes; streaks and weekly charts derive from it. */
  activity: ActivityLog;
  completedLessons: string[];
  solvedChallenges: string[];
  duelWins: number;
  duelsPlayed: number;
  projectSteps: Record<string, number[]>;
  completedProjects: string[];
  posts: Post[];
  votedPosts: string[];
  notifications: AppNotification[];
  playgroundCode: string;
  sidebarCollapsed: boolean;
  isPro: boolean;
  settings: Settings;

  completeLesson: (id: string) => boolean;
  solveChallenge: (id: string) => boolean;
  recordDuel: (won: boolean) => void;
  toggleProjectStep: (projectId: string, step: number, totalSteps: number) => void;
  addPost: (post: Pick<Post, "title" | "body" | "tag">) => void;
  votePost: (id: string) => void;
  markAllRead: () => void;
  setPlaygroundCode: (code: string) => void;
  logMinutes: (minutes: number) => void;
  toggleSidebar: () => void;
  upgradePro: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
}

/** A brand-new learner: no XP, no streak, no lessons, no achievements. */
const initialProgress = {
  xp: 0,
  activity: {} as ActivityLog,
  completedLessons: [] as string[],
  solvedChallenges: [] as string[],
  duelWins: 0,
  duelsPlayed: 0,
  projectSteps: {} as Record<string, number[]>,
  completedProjects: [] as string[],
  notifications: [] as AppNotification[],
  isPro: false,
};

const defaultSettings: Settings = {
  name: "",
  email: "",
  dailyGoal: 30,
  emailReminders: true,
  challengeReminders: true,
  editorFontSize: 14,
};

/** Adds XP to today's entry in the activity log. */
export function withXp(activity: ActivityLog, xp: number, now: Date = new Date()): ActivityLog {
  const key = dayKey(now);
  const day = activity[key] ?? { xp: 0, minutes: 0 };
  return { ...activity, [key]: { ...day, xp: day.xp + xp } };
}

let nid = 100;
const note = (kind: AppNotification["kind"], title: string): AppNotification => ({
  id: `n${++nid}-${Date.now()}`,
  kind,
  title,
  time: "Just now",
  read: false,
});

export const useStore = create<CodeCraftState>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      posts: seedPosts,
      votedPosts: [],
      playgroundCode: DEFAULT_CODE,
      sidebarCollapsed: false,
      settings: defaultSettings,

      completeLesson: (id) => {
        if (get().completedLessons.includes(id)) return false;
        set((s) => {
          const completed = [...s.completedLessons, id];
          const notes = [note("lesson", `Lesson completed · +${LESSON_XP} XP`)];
          const mod = modules.find((m) => m.lessons.some((l) => l.id === id));
          if (mod && mod.lessons.every((l) => completed.includes(l.id))) {
            notes.push(note("milestone", `Module finished: ${mod.title} — certificate unlocked`));
          }
          return {
            completedLessons: completed,
            xp: s.xp + LESSON_XP,
            activity: withXp(s.activity, LESSON_XP),
            notifications: [...notes, ...s.notifications],
          };
        });
        return true;
      },

      solveChallenge: (id) => {
        if (get().solvedChallenges.includes(id)) return false;
        set((s) => ({
          solvedChallenges: [...s.solvedChallenges, id],
          xp: s.xp + CHALLENGE_XP,
          activity: withXp(s.activity, CHALLENGE_XP),
          notifications: [note("challenge", `Daily challenge solved · +${CHALLENGE_XP} XP`), ...s.notifications],
        }));
        return true;
      },

      recordDuel: (won) =>
        set((s) => {
          const gained = won ? DUEL_WIN_XP : DUEL_PLAY_XP;
          return {
            duelsPlayed: s.duelsPlayed + 1,
            duelWins: s.duelWins + (won ? 1 : 0),
            xp: s.xp + gained,
            activity: withXp(s.activity, gained),
          };
        }),

      toggleProjectStep: (projectId, step, totalSteps) =>
        set((s) => {
          const current = s.projectSteps[projectId] ?? [];
          const next = current.includes(step) ? current.filter((x) => x !== step) : [...current, step];
          const done = next.length === totalSteps;
          const wasDone = s.completedProjects.includes(projectId);
          return {
            projectSteps: { ...s.projectSteps, [projectId]: next },
            completedProjects: done
              ? wasDone
                ? s.completedProjects
                : [...s.completedProjects, projectId]
              : s.completedProjects.filter((p) => p !== projectId),
            xp: done && !wasDone ? s.xp + PROJECT_XP : s.xp,
            activity: done && !wasDone ? withXp(s.activity, PROJECT_XP) : s.activity,
          };
        }),

      addPost: ({ title, body, tag }) =>
        set((s) => ({
          posts: [
            { id: `p${Date.now()}`, author: s.settings.name, title, body, tag, votes: 0, replies: 0, time: "Just now" },
            ...s.posts,
          ],
        })),

      votePost: (id) =>
        set((s) => {
          const voted = s.votedPosts.includes(id);
          return {
            votedPosts: voted ? s.votedPosts.filter((v) => v !== id) : [...s.votedPosts, id],
            posts: s.posts.map((p) => (p.id === id ? { ...p, votes: p.votes + (voted ? -1 : 1) } : p)),
          };
        }),

      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      setPlaygroundCode: (code) => set({ playgroundCode: code }),
      logMinutes: (minutes) =>
        set((s) => {
          const key = dayKey();
          const day = s.activity[key] ?? { xp: 0, minutes: 0 };
          return { activity: { ...s.activity, [key]: { ...day, minutes: day.minutes + minutes } } };
        }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      upgradePro: () => set({ isPro: true }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetProgress: () => set({ ...initialProgress }),
    }),
    {
      name: "codecraft-state",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 2,
      // Version 1 shipped with sample progress (XP, streak, lessons, duels) and a
      // sample profile. Drop those so returning visitors start from their real zero.
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<CodeCraftState> & { streak?: number };
        if (version >= 2) return old as CodeCraftState;
        const oldSettings: Partial<Settings> = old.settings ?? {};
        const isSample = oldSettings.name === "Yashika Gupta" && oldSettings.email === "yashika@codecraft.dev";
        return {
          ...initialProgress,
          posts: old.posts ?? seedPosts,
          votedPosts: old.votedPosts ?? [],
          playgroundCode: old.playgroundCode ?? DEFAULT_CODE,
          sidebarCollapsed: old.sidebarCollapsed ?? false,
          settings: { ...defaultSettings, ...oldSettings, ...(isSample ? { name: "", email: "" } : {}) },
        } as CodeCraftState;
      },
    },
  ),
);

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const into = xp % 500;
  return { level, into, toNext: 500, pct: Math.round((into / 500) * 100) };
}

export function moduleProgress(completed: string[], moduleId: string) {
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return { done: 0, total: 0, pct: 0 };
  const done = mod.lessons.filter((l) => completed.includes(l.id)).length;
  return { done, total: mod.lessons.length, pct: Math.round((done / mod.lessons.length) * 100) };
}
