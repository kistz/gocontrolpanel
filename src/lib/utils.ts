import { routes } from "@/routes";
import { ServerError } from "@/types/responses";
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
  const errorMessage =
    error instanceof Error || error instanceof ServerError
      ? error.message
      : "Unknown error";

  const match = errorMessage.match(/Error: XML-RPC fault:\s*(.*)/);
  return match ? match[1] : errorMessage;
}

export function generatePath(
  path: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, String(value));
  }, path);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDivergingList<T extends Record<string, any>>(
  list1: T[],
  list2: T[],
  key: string,
): [T[], T[]] {
  const minLength = Math.min(list1.length, list2.length);
  let divergenceIndex = minLength;

  for (let i = 0; i < minLength; i++) {
    if (list1[i][key] !== list2[i][key]) {
      divergenceIndex = i;
      break;
    }
  }

  return [list1.slice(divergenceIndex), list2.slice(divergenceIndex)];
}

export function toReadableTitle(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Utility: Convert route pattern to RegExp
function pathToRegex(path: string) {
  return new RegExp("^" + path.replace(/:[^/]+/g, "([^/]+)") + "$");
}

// Use in a React client component
export function useCurrentServerId(pathname: string): number | null {
  for (const route of Object.values(routes.servers)) {
    const regex = pathToRegex(route);
    const match = pathname?.match(regex);
    if (match) {
      return parseInt(match[1], 10); // Return the captured `:id`
    }
  }

  return null;
}