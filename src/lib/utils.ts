import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const QAmode = import.meta.env.VITE_MODE === "qa";
export const is_local = import.meta.env.VITE_IS_LOCAL === "true";