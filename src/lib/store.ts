import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LESSON_XP, modules } from "@/data/curriculum";
import { CHALLENGE_XP, seedPosts, type Post } from "@/data/content";

export const DUEL_WIN_XP = 75;
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
  streak: number;
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
  toggleSidebar: () => void;
  upgradePro: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
}

const seedNotifications: AppNotification[] = [
  { id: "n1", kind: "milestone", title: "You passed 1,000 XP — nice momentum!", time: "1h ago", read: false },
  { id: "n2", kind: "challenge", title: "Today's Daily Challenge is live", time: "3h ago", read: false },
  { id: "n3", kind: "lesson", title: "Completed: Working with Strings", time: "Yesterday", read: true },
  { id: "n4", kind: "achievement", title: "Achievement unlocked: Week Warrior", time: "2d ago", read: true },
];

const initialProgress = {
  xp: 1250,
  streak: 8,
  completedLessons: ["what-is-java", "first-program", "jdk-jre-jvm", "primitive-types", "strings", "type-casting", "operators"],
  solvedChallenges: [] as string[],
  duelWins: 3,
  duelsPlayed: 5,
  projectSteps: { "bank-account": [0, 1] } as Record<string, number[]>,
  completedProjects: [] as string[],
  posts: seedPosts,
  votedPosts: [] as string[],
  notifications: seedNotifications,
  playgroundCode: DEFAULT_CODE,
  isPro: false,
};

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
      sidebarCollapsed: false,
      settings: {
        name: "Yashika Gupta",
        email: "yashika@codecraft.dev",
        dailyGoal: 30,
        emailReminders: true,
        challengeReminders: true,
        editorFontSize: 14,
      },

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
          notifications: [note("challenge", `Daily challenge solved · +${CHALLENGE_XP} XP`), ...s.notifications],
        }));
        return true;
      },

      recordDuel: (won) =>
        set((s) => ({
          duelsPlayed: s.duelsPlayed + 1,
          duelWins: s.duelWins + (won ? 1 : 0),
          xp: s.xp + (won ? DUEL_WIN_XP : 15),
        })),

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
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      upgradePro: () => set({ isPro: true }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetProgress: () => set({ ...initialProgress, completedLessons: [], xp: 0, streak: 0, duelWins: 0, duelsPlayed: 0, projectSteps: {} }),
    }),
    {
      name: "codecraft-state",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
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
