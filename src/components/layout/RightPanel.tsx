import { AchievementsCard, ProfileSummaryCard, StreakCard, UpcomingCard } from "@/components/codecraft/ProgressWidgets";

export function RightPanel() {
  return (
    <aside aria-label="Learning activity" className="hidden w-[310px] shrink-0 space-y-4 border-l border-border p-5 xl:block">
      <ProfileSummaryCard />
      <StreakCard />
      <UpcomingCard />
      <AchievementsCard limit={6} />
    </aside>
  );
}
