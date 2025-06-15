import {
  EDITOR_DEFAULT_HEIGHT,
  EDITOR_DEFAULT_WIDTH,
} from "@/components/interface/editor";

export function getManialinkPosition(positionPercentage: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const manialinkWidth = 320;
  const manialinkHeight = 180;

  // 0, 0 is in the middle of the screen
  const x = (positionPercentage.x / 100) * manialinkWidth - manialinkWidth / 2;
  const y =
    ((positionPercentage.y / 100) * manialinkHeight - manialinkHeight / 2) * -1;
  return { x, y };
}

export function getManialinkSize(sizePercentage: {
  width: number;
  height: number;
}): { width: number; height: number } {
  const manialinkWidth = 320;
  const manialinkHeight = 180;

  const width = (sizePercentage.width / 100) * manialinkWidth;
  const height = (sizePercentage.height / 100) * manialinkHeight;

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

export function parseComponentId(id: string): string {
  // Replace - with space
  const formattedId = id.replace(/-/g, " ");

  // Capitalize the first letter of each word
  return formattedId
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function manialinkPositionToEditorPosition(position: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const manialinkWidth = 320;
  const manialinkHeight = 180;

  // Convert to percentage
  const x = (position.x + manialinkWidth / 2) / manialinkWidth;
  const y = (position.y * -1 + manialinkHeight / 2) / manialinkHeight;

  // Get the editor position
  return {
    x: x * EDITOR_DEFAULT_WIDTH,
    y: y * EDITOR_DEFAULT_HEIGHT,
  };
}

export function manialinkSizeToEditorSize(size: {
  width: number;
  height: number;
}): { width: number; height: number } {
  const manialinkWidth = 320;
  const manialinkHeight = 180;

  // Convert to percentage
  const width = (size.width / manialinkWidth) * EDITOR_DEFAULT_WIDTH;
  const height = (size.height / manialinkHeight) * EDITOR_DEFAULT_HEIGHT;

  return { width, height };
}
