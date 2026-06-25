"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Command,
  Menu,
  Search,
  Sparkles
} from "lucide-react";
import type { Route } from "next";

import { UserMenu } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function Topbar() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 md:px-6">
      <div
        className="
          glass-premium
          flex
          h-20
          items-center
          justify-between
          rounded-[28px]
          border
          border-white/10
          bg-white/[0.03]
          px-5
          shadow-xl
          backdrop-blur-2xl
        "
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="
              rounded-2xl
              hover:bg-white/10
              lg:hidden
            "
            aria-label="Open navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 lg:hidden"
          >
            <Sparkles className="h-5 w-5 text-cyan-400" />

            <span className="font-semibold text-white">
              Nexora AI
            </span>
          </Link>

          <div className="hidden lg:block">
            <p className="text-base font-semibold text-white">
              Career readiness workspace
            </p>

            <p className="text-sm text-zinc-400">
              Structured AI workflows, not a prompt box
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2.5
              text-sm
              text-zinc-400
              backdrop-blur-xl
            "
          >
            <Search className="h-4 w-4" />

            <span>Search workflows...</span>

            <div
              className="
                ml-3
                flex
                items-center
                gap-1
                rounded-lg
                bg-white/[0.05]
                px-2
                py-1
                text-xs
              "
            >
              <Command className="h-3 w-3" />
              K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="scale-105">
            <UserMenu />
          </div>
        </div>
      </div>

      {open && (
        <nav
          className="
            glass-premium
            mt-3
            grid
            gap-1
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-3
            backdrop-blur-2xl
            lg:hidden
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setOpen(false)}
                className={cn(
                  `
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  text-zinc-400
                  transition-all
                  hover:bg-white/[0.05]
                  hover:text-white
                  `,
                  active &&
                    `
                    glass-premium
                    text-white
                    `
                )}
              >
                <Icon className="h-4 w-4" />

                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}