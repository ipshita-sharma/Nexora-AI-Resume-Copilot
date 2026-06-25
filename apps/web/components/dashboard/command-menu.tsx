"use client";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";

const items: {
  label: string;
  path: Route;
}[] = [
  { label: "Resume Analyzer", path: "/resume" },
  { label: "Mock Interview", path: "/interview" },
  { label: "JD Matcher", path: "/matcher" },
  { label: "Learning Roadmap", path: "/learning" },
  { label: "Reports", path: "/reports" }
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);

    return () =>
      document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Background overlay */}

      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command box */}

      <div
        className="
          fixed
          top-[20%]
          left-1/2
          z-50
          w-[600px]
          -translate-x-1/2
          rounded-[30px]
          border
          border-white/10
          bg-[#101014]/95
          p-4
          shadow-2xl
          backdrop-blur-2xl
        "
      >
        <Command className="w-full">
          <Command.Input
            placeholder="Search workflows..."
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.05]
              p-4
              outline-none
              text-white
            "
          />

          <Command.List className="mt-4 space-y-2">
            {items.map((item) => (
              <Command.Item
                key={item.path}
                onSelect={() => {
                  router.push(item.path);

                  setOpen(false);
                }}
                className="
                  cursor-pointer
                  rounded-2xl
                  p-4
                  text-zinc-300
                  transition-all
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </>
  );
}