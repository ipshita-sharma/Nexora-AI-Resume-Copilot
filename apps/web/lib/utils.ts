import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | string) {
  const value = typeof score === "string" ? Number(score) : score;
  if (Number.isNaN(value)) return "0";
  return Math.round(value).toString();
}

export function scoreTone(score: number) {
  if (score >= 82) return "text-emerald-600 dark:text-emerald-300";
  if (score >= 68) return "text-cyan-600 dark:text-cyan-300";
  return "text-red-600 dark:text-red-300";
}
