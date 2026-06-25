"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  BarChart3,
  BookOpenCheck,
  FileSearch,
  Gauge,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sparkles,
  Bot
} from "lucide-react";

import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resume Analyzer", icon: FileSearch },
  { href: "/matcher", label: "JD Matcher", icon: Gauge },
  { href: "/interview", label: "Mock Interview", icon: MessageSquareText },
  { href: "/learning", label: "Learning Roadmap", icon: BookOpenCheck },
  { href: "/assistant", label: "AI Career Assistant", icon: Bot },
  {href: "/resume-engine", label: "AI Resume Engine", icon: Sparkles},
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="
hidden
lg:flex
min-h-[calc(100vh-32px)]
w-72
shrink-0
flex-col
m-4
rounded-[28px]
glass-premium
border border-white/10
bg-white/[0.03]
px-5
py-6
shadow-2xl
backdrop-blur-2xl
">
      <Link
  href="/dashboard"
  className="
    mb-10
    flex
    items-center
    gap-4
    rounded-2xl
    px-3
    py-2
    transition-all
    hover:bg-white/5
  "
>
        <span
  className="
    glow
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-2xl
    bg-gradient-to-br
    from-cyan-400
    to-teal-500
    text-white
    shadow-lg
  "
>
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Nexora AI</span>
          <span className="text-xs text-muted-foreground">AI Career Platform</span>
        </span>
      </Link>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={cn(
  `
  group
  flex
  items-center
  gap-3
  rounded-2xl
  px-4
  py-3
  text-sm
  font-medium
  text-zinc-400
  transition-all
  duration-300
  hover:bg-white/[0.06]
  hover:text-white
  hover:translate-x-1
  `,
  active &&
    `
    glass-premium
    text-white
    shadow-lg
    border
    border-white/10
    `
)}
            >
              <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
