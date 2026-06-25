"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { AppAuthProvider } from "@/components/auth/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppAuthProvider>
      <ThemeProvider attribute="class">
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </AppAuthProvider>
  );
}
