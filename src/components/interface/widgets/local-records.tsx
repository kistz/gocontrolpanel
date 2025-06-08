"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Rnd } from "react-rnd";
import { InterfaceComponent } from "../editor";

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

export type LocalRecordsWidgetHandles = {
  getData: () => {
    header: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
};

const LocalRecordsWidget = forwardRef<
  LocalRecordsWidgetHandles,
  InterfaceComponent
>(({ scale, onClick }, ref) => {
  const [header, setHeader] = useState("Records");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 140, height: 210 });

  useImperativeHandle(ref, () => ({
    getData: () => ({
      header,
      position,
      size,
    }),
  }));

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 140,
        height: 210,
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

export default LocalRecordsWidget;
