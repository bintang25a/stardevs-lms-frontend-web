import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = className
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
