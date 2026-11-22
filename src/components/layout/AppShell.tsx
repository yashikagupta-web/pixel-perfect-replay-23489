import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "./Logo";
import { ProCard } from "./ProCard";
import { RightPanel } from "./RightPanel";
import { DesktopSidebar, SidebarNav } from "./Sidebar";
import { TopNav } from "./TopNav";

const PANEL_ROUTES = ["/", "/learn", "/my-learning", "/daily-challenge"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const showPanel = PANEL_ROUTES.includes(pathname);
  const fullBleed = pathname === "/playground";

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="h-dvh bg-canvas lg:p-3">
      <div className="mx-auto flex h-full max-w-[1920px] overflow-hidden border-border bg-background lg:rounded-shell lg:border">
        <DesktopSidebar />

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                key="drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
                className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar lg:hidden"
              >
                <div className="flex h-20 items-center justify-between px-5">
                  <Logo />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="grid size-9 place-items-center rounded-btn text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3">
                  <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </div>
                <div className="p-3">
                  <ProCard />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav onOpenMenu={() => setMobileOpen(true)} />
          <div className="flex min-h-0 flex-1 overflow-y-auto">
            <main
              className={
                fullBleed
                  ? "flex min-w-0 flex-1 flex-col"
                  : "mx-auto w-full min-w-0 max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8"
              }
            >
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={fullBleed ? "flex flex-1 flex-col" : undefined}
              >
                {children}
              </motion.div>
            </main>
            {showPanel && <RightPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
