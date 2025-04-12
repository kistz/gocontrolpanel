import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: number): string {
  if (time < 60000) {
    return (time / 1000).toFixed(3);
  }

  const minutes = Math.floor(time / 60000);
  const seconds = (time % 60000) / 1000;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

export function getErrorMessage(error: unknown): string {
  let errorMessage = error instanceof Error ? error.message : "Unknown error";

  const match = errorMessage.match(/Error: XML-RPC fault:\s*(.*)/);
  return match ? match[1] : errorMessage;
}

export function generatePath(path: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, String(value));
  }, path);
}