"use client";

import { getDefaultPosition, getDefaultSize } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Rnd } from "react-rnd";
import {
  EDITOR_DEFAULT_HEIGHT,
  EDITOR_DEFAULT_WIDTH,
  InterfaceComponent,
  InterfaceComponentHandles,
} from "../../editor";
import LocalRecordsForm from "./local-records-form";
import { LocalRecordsSchemaType } from "./local-records-schema";

const records = [
  { player: "Marijntje04", time: 121345 },
  { player: "Cheeselover2298", time: 121345 },
  { player: "Marijntje04", time: 121345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
];

export interface LocalRecordsWidgetComponentProps
  extends InterfaceComponent<LocalRecordsWidgetComponentHandles> {
  defaultValues?: {
    attributes?: LocalRecordsSchemaType;
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
    attributes: LocalRecordsSchemaType;
    positionPercentage: { x: number; y: number };
    sizePercentage: { width: number; height: number };
  };
};

const LocalRecordsWidgetComponent = forwardRef<
  LocalRecordsWidgetComponentHandles,
  LocalRecordsWidgetComponentProps
>(({ scale, onClick, defaultValues, uuid }, ref) => {
  const id = "local-records-widget";

  const defaultAttributes = defaultValues?.attributes ?? {
    header: {
      text: "Records",
      font: "RobotoCondensedBold",
    },
  };
  const defaultPosition = getDefaultPosition(
    defaultValues?.positionPercentage,
    { x: EDITOR_DEFAULT_WIDTH - 140, y: 100 },
  );

  const defaultSize = getDefaultSize(defaultValues?.sizePercentage, {
    width: 140,
    height: 182,
  });

  const [attributes, setAttributes] =
    useState<LocalRecordsSchemaType>(defaultAttributes);
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);

  useImperativeHandle(ref, () => ({
    id,
    uuid,
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
        attributes,
        positionPercentage,
        sizePercentage,
      };
    },
    getEditFields() {
      return (
        <LocalRecordsForm
          defaultValues={attributes}
          onChange={(data) => {
            setAttributes(data);
          }}
        />
      );
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
      position={position}
      size={size}
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
      <div className="bg-primary text-center font-bold text-[10.5px]">
        <span>{attributes.header?.text || "\u00A0"}</span>
      </div>

      <div className="h-full">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex text-[10.5px] items-center"
            style={{
              padding: `${attributes.record?.padding?.top ?? 0}px ${attributes.record?.padding?.right ?? 0}px ${attributes.record?.padding?.bottom ?? 0}px ${attributes.record?.padding?.left ?? 0}px`,
              borderBottom: `${
                attributes.record?.border?.bottom ?? 0
              }px solid #${attributes.record?.border?.color ?? "8888"}`,
            }}
          >
            <span
              className="font-bold text-center pr-1"
              style={{
                width: `${attributes.record?.position?.width ?? 4}px`,
                color: `#${attributes.record?.position?.color ?? "FFF"}`,
              }}
            >
              {index + 1}
            </span>
            <span
              className="overflow-hidden"
              style={{
                color: `#${attributes.record?.player?.color ?? "FFF"}`,
                padding: `${attributes.record?.player?.padding?.top ?? 0}px ${attributes.record?.player?.padding?.right ?? 0}px ${attributes.record?.player?.padding?.bottom ?? 0}px ${attributes.record?.player?.padding?.left ?? 0}px`,
              }}
            >
              {record.player}
            </span>
            <span className="text-green-400 font-bold ml-auto">
              {record.time}
            </span>
          </div>
        ))}
      </div>
    </Rnd>
  );
});

LocalRecordsWidgetComponent.displayName = "LocalRecordsWidgetComponent";

export default LocalRecordsWidgetComponent;
