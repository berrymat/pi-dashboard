"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Lightbulb,
  GitBranch,
  Activity,
  Sparkles,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/work", label: "Work", icon: Hammer },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/decisions", label: "Decisions", icon: GitBranch },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center gap-2.5 px-3 py-4 mb-6">
        <Sparkles className="h-5 w-5 text-sidebar-primary" />
        <span className="font-heading text-lg font-semibold tracking-tight">
          Project Intelligence
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && "text-sidebar-primary")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
