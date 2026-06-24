import { clsx, type ClassValue } from "clsx";

/**
 * Utility to merge Tailwind / conditional class names.
 * Usage: cn("base-class", isActive && "active", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
