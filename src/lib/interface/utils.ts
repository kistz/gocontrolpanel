import {
  EDITOR_DEFAULT_HEIGHT,
  EDITOR_DEFAULT_WIDTH,
} from "@/components/interface/editor";

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

export function parseComponentId(id: string): string {
  // Replace - with space
  const formattedId = id.replace(/-/g, " ");

  // Capitalize the first letter of each word
  return formattedId
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getAllChildrenProps(
  children: HTMLCollection,
  editorRef: HTMLDivElement,
): Record<string, any> {
  const props: Record<string, any> = {};

  const editorRect = editorRef.getBoundingClientRect();

  function getChildrenProps(
    children: HTMLCollection,
    props: Record<string, any>,
  ): Record<string, any> {
    for (const child of children) {
      const uuid = crypto.randomUUID();

      props[uuid] = getProps(child as HTMLElement, editorRect);

      props = getChildrenProps(child.children, props);
    }

    return props;
  }

  return getChildrenProps(children, props);
}

function getProps(
  element: HTMLElement,
  editorRect: DOMRect,
): Record<string, any> {
  console.log(element.style);

  const s = element.style;

  const stylingProps = {
    background: s.background,
    border: {
      top: {
        width: s.borderTopWidth,
        style: s.borderTopStyle,
        color: s.borderTopColor,
      },
      right: {
        width: s.borderRightWidth,
        style: s.borderRightStyle,
        color: s.borderRightColor,
      },
      bottom: {
        width: s.borderBottomWidth,
        style: s.borderBottomStyle,
        color: s.borderBottomColor,
      },
      left: {
        width: s.borderLeftWidth,
        style: s.borderLeftStyle,
        color: s.borderLeftColor,
      },
    },
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    margin: {
      top: s.marginTop,
      right: s.marginRight,
      bottom: s.marginBottom,
      left: s.marginLeft,
    },
    opacity: s.opacity,
    padding: {
      top: s.paddingTop,
      right: s.paddingRight,
      bottom: s.paddingBottom,
      left: s.paddingLeft,
    },
    textAlign: s.textAlign,
    zIndex: s.zIndex,
  };

  const childRect = element.getBoundingClientRect();

  const childProps = {
    ...stylingProps,
    position: {
      x: ((childRect.x - editorRect.x) / editorRect.width) * 100,
      y: ((childRect.y - editorRect.y) / editorRect.height) * 100,
    },
    size: {
      width: (childRect.width / editorRect.width) * 100,
      height: (childRect.height / editorRect.height) * 100,
    },
  };

  return childProps;
}
