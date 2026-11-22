import { Link, useRouterState } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion } from "motion/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { navItems } from "./nav-items";
import { ProCard } from "./ProCard";

function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`));
}

export function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(item.to);
        const link = (
          <Link
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-btn px-3 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-btn border border-border bg-sidebar-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <item.icon
              className={cn(
                "relative size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                active ? "text-primary" : "text-subtle group-hover:text-muted-foreground",
              )}
            />
            {!collapsed && <span className="relative truncate">{item.label}</span>}
          </Link>
        );
        if (!collapsed) return <div key={item.to}>{link}</div>;
        return (
          <Tooltip key={item.to} delayDuration={100}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar() {
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const toggle = useStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 232 }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
      className="hidden shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar lg:flex"
    >
      <div className={cn("flex h-20 items-center px-5", collapsed && "justify-center px-0")}>
        <Logo collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        {!collapsed && <p className="eyebrow mb-2 px-3">Menu</p>}
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className="space-y-3 px-3 pb-4">
        {!collapsed && <ProCard />}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-btn px-3 text-xs font-medium text-subtle transition-colors hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </motion.aside>
  );
}
