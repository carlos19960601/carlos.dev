import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 组合 Tailwind 类名
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
