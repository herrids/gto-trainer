import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchWithRetry = async (url: string, options: any, maxRetries = 5) => {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();
      if (response.status !== 429 && response.status < 500) break;
    } catch (e) { if (i === maxRetries - 1) throw e; }
    await new Promise(res => setTimeout(res, delay));
    delay *= 2;
  }
  throw new Error("Failed after retries");
};
