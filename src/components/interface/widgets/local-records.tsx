"use client";

import { useState } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { InterfaceComponent } from "../editor";

export default function LocalRecordsWidget({
  onClick,
  boundaryRef,
}: InterfaceComponent) {
  const [header, setHeader] = useState("Records");

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

  const onResizeStop: RndResizeCallback = (
    e,
    dir,
    elementRef,
    delta,
    position,
  ) => {
    console.log("Resize stopped:", {
      event: e,
      direction: dir,
      element: elementRef,
      delta,
      position,
    });
  };

  const onDragStop: RndDragCallback = (e, data) => {
    console.log("Drag stopped:", {
      event: e,
      data,
    });
  };

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
      bounds={boundaryRef?.current ?? undefined}
      className="bg-black"
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
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
}
