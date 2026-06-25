import { CommandMenu } from "@/components/dashboard/command-menu";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        overflow-hidden
        bg-[#0b0b0f]
        text-white
      "
    >
      {/* Ambient background glow */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-[-10%]
            top-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-10%]
            right-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />
      </div>

      <div className="relative flex">
        <Sidebar />

        <div
          className="
            min-w-0
            flex-1
            pb-8
          "
        >
          <Topbar />
          <CommandMenu />
          <main
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-6
              md:px-6
            "
          >
            <div className="space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}