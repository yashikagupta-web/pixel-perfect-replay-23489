import { Link, useNavigate } from "@tanstack/react-router";
import { Award, Bell, BookOpen, Flame, LogOut, Menu, Settings, Target, Trophy, User, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore, type AppNotification } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchBox } from "./SearchBox";

const noteIcon: Record<AppNotification["kind"], typeof Bell> = {
  milestone: Trophy,
  lesson: BookOpen,
  challenge: Target,
  achievement: Award,
};

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const name = useStore((s) => s.settings.name);
  const email = useStore((s) => s.settings.email);
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-20 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6 lg:px-9">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
        <Menu />
      </Button>
      <SearchBox />
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-btn border border-border bg-card px-3 py-2 sm:flex" title="Total XP">
          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
            <Zap className="size-3" fill="currentColor" />
          </span>
          <span className="text-sm font-semibold tabular-nums">{xp.toLocaleString("en-IN")} XP</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-btn border border-border bg-card px-3 py-2" title="Daily streak">
          <Flame className="size-4 text-primary" fill="currentColor" />
          <span className="text-sm font-semibold tabular-nums">
            {streak} <span className="hidden sm:inline">Days</span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" aria-label={`Notifications, ${unread} unread`} className="relative">
              <Bell />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-card border-border bg-popover p-0 shadow-pop">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-display text-sm font-bold">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-primary hover:underline disabled:text-subtle"
                disabled={unread === 0}
              >
                Mark all read
              </button>
            </div>
            <DropdownMenuSeparator className="m-0 bg-border" />
            <div className="max-h-80 overflow-y-auto p-1.5">
              {notifications.slice(0, 8).map((n) => {
                const Icon = noteIcon[n.kind];
                return (
                  <DropdownMenuItem key={n.id} className="items-start gap-3 rounded-btn px-3 py-2.5">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-chip bg-secondary text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-sm leading-snug", n.read ? "text-muted-foreground" : "text-foreground")}>
                        {n.title}
                      </span>
                      <span className="text-xs text-subtle">{n.time}</span>
                    </span>
                    {!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open profile menu"
              className="grid size-10 place-items-center rounded-full bg-cream font-display text-sm font-extrabold text-cream-foreground ring-2 ring-transparent transition hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-primary"
            >
              {initials(name)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-card border-border bg-popover p-1.5 shadow-pop">
            <DropdownMenuLabel className="px-3 py-2">
              <span className="block text-sm font-semibold">{name}</span>
              <span className="block text-xs font-normal text-subtle">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="gap-2.5 rounded-btn px-3 py-2">
              <Link to="/settings">
                <User className="size-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2.5 rounded-btn px-3 py-2">
              <Link to="/my-learning">
                <BookOpen className="size-4" /> My Learning
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2.5 rounded-btn px-3 py-2">
              <Link to="/my-learning" hash="achievements">
                <Trophy className="size-4" /> Achievements
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2.5 rounded-btn px-3 py-2">
              <Link to="/settings">
                <Settings className="size-4" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="gap-2.5 rounded-btn px-3 py-2 text-destructive focus:text-destructive"
              onSelect={() => {
                toast("Signed out", { description: "Accounts arrive in a later phase — your progress stays on this device." });
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
