"use client";

import { getDefaultPosition, getDefaultSize } from "@/lib/interface/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
  render: (editorRef: HTMLDivElement) => {
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
  const widgetRef = useRef<Rnd | null>(null);

  const defaultAttributes = defaultValues?.attributes ?? {
    header: {
      text: "Records",
      font: "RobotoCondensedBold",
    },
    record: {
      padding: {
        left: 2,
        right: 2,
        top: 0,
        bottom: 0,
      },
      border: {
        color: "8888",
        bottom: 1,
        top: 0,
        left: 0,
        right: 0,
      },
      position: {
        width: 16,
        font: "RobotoCondensedBold",
        color: "FFF",
      },
      player: {
        font: "RobotoCondensed",
        color: "FFF",
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      time: {
        font: "RobotoCondensedBold",
        color: "0C6",
        padding: {
          left: 2,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
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
      if (!widgetRef.current) {
        throw new Error("Widget reference is not set");
      }

      if (!widgetRef.current.resizableElement.current) {
        throw new Error("Resizable element reference not found");
      }

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
    attributesForm() {
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
      onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, position) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(position);
      }}
      ref={widgetRef}
      onClick={onClick}
    >
      <div
        style={{
          background: "#0C6",
          textAlign: "center",
          fontFamily: "RobotoCondensedBold",
          fontSize: "10.5px",
        }}
      >
        <span>{attributes.header?.text || "\u00A0"}</span>
      </div>

      <div className="h-full">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex text-[10.5px] items-center bg-black"
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
            <span
              className="font-bold ml-auto"
              style={{
                color: `#${attributes.record?.time?.color ?? "0C6"}`,
                padding: `${attributes.record?.time?.padding?.top ?? 0}px ${attributes.record?.time?.padding?.right ?? 0}px ${attributes.record?.time?.padding?.bottom ?? 0}px ${attributes.record?.time?.padding?.left ?? 0}px`,
              }}
            >
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
