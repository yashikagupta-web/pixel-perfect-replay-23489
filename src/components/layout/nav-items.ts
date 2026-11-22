import {
  Award,
  BookOpen,
  Code2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Swords,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to:
    | "/"
    | "/learn"
    | "/my-learning"
    | "/playground"
    | "/daily-challenge"
    | "/deathmatch"
    | "/projects"
    | "/community"
    | "/certificates"
    | "/settings";
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Learn Java", to: "/learn", icon: BookOpen },
  { label: "My Learning", to: "/my-learning", icon: GraduationCap },
  { label: "Coding Playground", to: "/playground", icon: Code2 },
  { label: "Daily Challenge", to: "/daily-challenge", icon: Target },
  { label: "Deathmatch", to: "/deathmatch", icon: Swords },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Community", to: "/community", icon: Users },
  { label: "Certificates", to: "/certificates", icon: Award },
  { label: "Settings", to: "/settings", icon: Settings },
];
