"use client";

import { getDefaultPosition, getDefaultSize } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Rnd } from "react-rnd";
import {
  EDITOR_DEFAULT_HEIGHT,
  EDITOR_DEFAULT_WIDTH,
  InterfaceComponent,
  InterfaceComponentHandles,
} from "../editor";

const records = [
  { player: "Marijntje04Marijntje04", time: "1:23.456" },
  { player: "Marijntje04", time: "1:24.789" },
  { player: "Marijntje04", time: "1:25.012" },
  { player: "Marijntje04", time: "1:26.345" },
  { player: "Marijntje04", time: "1:27.678" },
  { player: "Marijntje04", time: "1:28.901" },
  { player: "Marijntje04", time: "1:29.234" },
  { player: "Marijntje04", time: "1:30.567" },
  { player: "Marijntje04", time: "1:31.890" },
  { player: "Marijntje04", time: "1:32.123" },
];

export interface LocalRecordsWidgetComponentProps
  extends InterfaceComponent<LocalRecordsWidgetComponentHandles> {
  defaultValues?: {
    header?: string;
    positionPercentage?: { x: number; y: number };
    sizePercentage?: { width: number; height: number };
  };
}

export type LocalRecordsWidgetComponentHandles = Omit<
  InterfaceComponentHandles,
  "render"
> & {
  render: () => {
    id: string;
    header: string;
    positionPercentage: { x: number; y: number };
    sizePercentage: { width: number; height: number };
  };
};

const LocalRecordsWidgetComponent = forwardRef<
  LocalRecordsWidgetComponentHandles,
  LocalRecordsWidgetComponentProps
>(({ scale, onClick, defaultValues }, ref) => {
  const id = "local-records-widget";

  const defaultHeader = defaultValues?.header ?? "Records";
  const defaultPosition = getDefaultPosition(
    defaultValues?.positionPercentage,
    { x: EDITOR_DEFAULT_WIDTH - 140, y: 100 },
  );

  const defaultSize = getDefaultSize(defaultValues?.sizePercentage, {
    width: 140,
    height: 210,
  });

  const [header, _] = useState(defaultHeader);
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);

  useImperativeHandle(ref, () => ({
    render: () => {
      const positionPercentage = {
        x: (position.x / EDITOR_DEFAULT_WIDTH) * 100,
        y: (position.y / EDITOR_DEFAULT_HEIGHT) * 100,
      };

      const sizePercentage = {
        width: (size.width / EDITOR_DEFAULT_WIDTH) * 100,
        height: (size.height / EDITOR_DEFAULT_HEIGHT) * 100,
      };

      return {
        id,
        header,
        positionPercentage,
        sizePercentage,
      };
    },
  }));

  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      minWidth={140}
      minHeight={210}
      scale={scale ?? 1}
      bounds="parent"
      className="bg-black"
      onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, position) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(position);
      }}
      onClick={onClick}
    >
      {header && (
        <div className="bg-primary text-center font-bold text-sm">
          <span>{header}</span>
        </div>
      )}

      <div className="h-full">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex text-[12px] justify-between px-1 items-center border-b border-gray-700 last:border-b-0"
          >
            <span className="text-white overflow-hidden text-ellipsis">
              {record.player}
            </span>
            <span className="text-green-400">{record.time}</span>
          </div>
        ))}
      </div>
    </Rnd>
  );
});

LocalRecordsWidgetComponent.displayName = "LocalRecordsWidgetComponent";

export default LocalRecordsWidgetComponent;
