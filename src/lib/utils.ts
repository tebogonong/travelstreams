import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with consistent formatting between server and client
 * to prevent hydration mismatches. Uses en-US locale for consistency.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
