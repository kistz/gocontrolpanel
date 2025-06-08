import {
  EDITOR_DEFAULT_HEIGHT,
  EDITOR_DEFAULT_WIDTH,
} from "@/components/interface/editor";
import { TBreadcrumb } from "@/components/shell/breadcrumbs";
import { routes } from "@/routes";
import { ServerError } from "@/types/responses";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: number): string {
  if (time <= 0) {
    return "--:--.---";
  }

  if (time < 60000) {
    return (time / 1000).toFixed(3).padStart(6, "0");
  }

  const minutes = Math.floor(time / 60000);
  const seconds = (time % 60000) / 1000;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

export function getErrorMessage(error: unknown): string {
  const errorMessage =
    error instanceof Error || error instanceof ServerError
      ? error.message
      : "Something went wrong";

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
export function useCurrentServerUuid(pathname: string): string | null {
  for (const route of Object.values(routes.servers)) {
    const regex = pathToRegex(route);
    const match = pathname?.match(regex);
    if (match) {
      return match[1]; // Assuming the server UUID is the first captured group
    }
  }

  return null;
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = "Operation timed out",
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), ms),
  );
  return Promise.race([promise, timeout]);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatTimeToAgo(date: Date): string {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000; // in seconds

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const ranges: { [K: string]: number } = {
    year: 60 * 60 * 24 * 365, // 365 days
    month: 60 * 60 * 24 * 30, // 30 days
    week: 60 * 60 * 24 * 7, // 7 days
    day: 60 * 60 * 24, // 24 hours
    hour: 60 * 60, // 60 minutes
    minute: 60, // 60 seconds
    second: 1, // 1 second
  };

  for (const [unit, secondsInUnit] of Object.entries(ranges)) {
    const delta = diff / secondsInUnit;
    if (Math.abs(delta) >= 1 || unit === "second") {
      return rtf.format(Math.round(delta), unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return "just now";
}

export function pathToBreadcrumbs(path?: string): TBreadcrumb[] {
  if (!path) {
    return [];
  }

  const segments = path.split("/").filter(Boolean);
  const crumbs: TBreadcrumb[] = [];
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    currentPath += "/" + segments[i];
    crumbs.push({
      label: segments[i],
      path: currentPath,
    });
  }

  return crumbs;
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

export function getRoles(roles: any): string[] {
  if (Array.isArray(roles)) {
    return roles.map(String);
  } else if (typeof roles === "string") {
    return [roles];
  } else if (typeof roles === "object" && roles !== null) {
    return Object.keys(roles);
  }
  return [];
}

export function removePrefix(str: string, prefix: string): string {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  }
  return str;
}

export function initGbxWebsocketClient(path: string, token: string): WebSocket {
  const envUrl = process.env.NEXT_PUBLIC_CONNECTOR_URL;
  const baseUri = envUrl && envUrl != "" ? envUrl : "/gbx";
  return new WebSocket(`${baseUri}${path}?token=${token}`);
}

export function getManialinkPosition(positionPercentage: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const width = 320;
  const height = 180;

  // 0, 0 is in the middle of the screen
  const x = (positionPercentage.x / 100) * width - width / 2;
  const y = ((positionPercentage.y / 100) * height - height / 2) * -1;
  return { x, y };
}

export function getManialinkSize(sizePercentage: {
  width: number;
  height: number;
}): { width: number; height: number } {
  const maniaLinkWidth = 320;
  const maniaLinkHeight = 180;

  const width = (sizePercentage.width / 100) * maniaLinkWidth;
  const height = (sizePercentage.height / 100) * maniaLinkHeight;
  return { width, height };
}

export function getValueFromPercentage(
  percentage: number,
  total: number,
): number {
  return (percentage / 100) * total;
}

export function getDefaultPosition(
  positionPercentage?: { x: number; y: number },
  defaultPosition?: { x: number; y: number },
): { x: number; y: number } {
  if (positionPercentage) {
    return {
      x: getValueFromPercentage(positionPercentage.x, EDITOR_DEFAULT_WIDTH),
      y: getValueFromPercentage(positionPercentage.y, EDITOR_DEFAULT_HEIGHT),
    };
  } else if (defaultPosition) {
    return defaultPosition;
  }

  return { x: 0, y: 0 };
}

export function getDefaultSize(
  sizePercentage?: { width: number; height: number },
  defaultSize?: { width: number; height: number },
): { width: number; height: number } {
  if (sizePercentage) {
    return {
      width: getValueFromPercentage(sizePercentage.width, EDITOR_DEFAULT_WIDTH),
      height: getValueFromPercentage(
        sizePercentage.height,
        EDITOR_DEFAULT_HEIGHT,
      ),
    };
  } else if (defaultSize) {
    return defaultSize;
  }

  return { width: 140, height: 210 };
}
