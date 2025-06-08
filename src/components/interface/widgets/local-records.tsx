"use client";

import { renderLocalRecordsWidget } from "@/actions/gbx/manialink/local-records";
import { getManialinkPosition, getManialinkSize } from "@/lib/utils";
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
  render: (serverId: number, EDITOR_DEFAULT_WIDTH: number, EDITOR_DEFAULT_HEIGHT: number) => Promise<void>;
};

const LocalRecordsWidgetComponent = forwardRef<
  LocalRecordsWidgetHandles,
  InterfaceComponent
>(({ scale, onClick }, ref) => {
  const [header, setHeader] = useState("Records");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 140, height: 210 });

  useImperativeHandle(ref, () => ({
    render: async (
      serverId: number,
      EDITOR_DEFAULT_WIDTH: number,
      EDITOR_DEFAULT_HEIGHT: number,
    ) => {
      const positionPercentage = {
        x: (position.x / EDITOR_DEFAULT_WIDTH) * 100,
        y: (position.y / EDITOR_DEFAULT_HEIGHT) * 100,
      };

      const sizePercentage = {
        width: (size.width / EDITOR_DEFAULT_WIDTH) * 100,
        height: (size.height / EDITOR_DEFAULT_HEIGHT) * 100,
      };

      await renderLocalRecordsWidget(
        serverId,
        [
          { player: "Player1", time: 123456 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
          { player: "Player2", time: 234567 },
        ],
        getManialinkPosition(positionPercentage),
        getManialinkSize(sizePercentage),
      );
    },
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

export default LocalRecordsWidgetComponent;
