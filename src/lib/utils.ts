import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
/**
 * Utility to merge Tailwind CSS classes safely, handling conflicts and conditional logic.
 * Essential for the 'Illustrative Academic' theme's complex card and button variants.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Formats currency values in 'Lingshi' (Academic Coins) format.
 */
export function formatLingshi(amount: number): string {
  return new Intl.NumberFormat('zh-CN').format(amount);
}
/**
 * Safe date parsing for academic deadlines.
 */
export function safeParseDate(dateStr: string | undefined): Date {
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}