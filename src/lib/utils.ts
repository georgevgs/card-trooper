import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Pick a readable text color (dark or white) for an arbitrary hex background. */
export function contrastTextColor(hex: string): string {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) return '#FFFFFF';
  const n = parseInt(match[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  // YIQ perceived brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#262322' : '#FFFFFF';
}

/** Translucent overlay that reads on the given background: white on dark colors, black on light ones. */
export function surfaceOverlay(hex: string, alpha: number): string {
  return contrastTextColor(hex) === '#FFFFFF'
    ? `rgba(255,255,255,${alpha})`
    : `rgba(0,0,0,${alpha * 0.55})`;
}
