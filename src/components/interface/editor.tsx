"use client";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { cloneElement, JSX, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import LocalRecordsWidget from "./widgets/local-records";

export type InterfaceComponent = {
  onClick?: () => void;
  boundaryRef: React.RefObject<HTMLDivElement | null>;
};

export default function InterfaceEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [editorSize, setEditorSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!editorRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      console.log("Editor size changed:", width, height);
      setEditorSize({ width, height });
    });

    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDelete = () => {
    if (selectedIndex === null) return;
    setComponents(components.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);
  };

  const renderWidget = (Widget: React.ComponentType<InterfaceComponent>) => {
    return <Widget key={components.length} boundaryRef={editorRef} />;
  };

  return (
    <div className="flex w-full gap-4">
      <div className="relative flex-3 aspect-video" ref={editorRef}>
        <Image
          src="/tm-background.png"
          alt="Interface Background"
          fill
          className="rounded-lg"
        />

        {components.map((Component, index) => {
          const scale = editorSize.width / 1169;

          const cloned = cloneElement(Component, {
            onClick: () => {
              setSelectedIndex(index);
            },
          });

          return (
            <div
              key={index}
              className="absolute cursor-pointer"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              {cloned}
            </div>
          )
        })}
      </div>

      <Card className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold">Widgets</h2>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                setComponents([
                  ...components,
                  renderWidget(LocalRecordsWidget),
                ]);
              }}
            >
              <IconPlus />
              Add Local Records Widget
            </Button>
          </div>

          <Separator />

          <h2 className="text-lg font-semibold">Selected Component</h2>
          {selectedIndex !== null && (
            <div className="flex flex-col gap-2">
              <p>
                Component {selectedIndex + 1}:{" "}
                {components[selectedIndex].type.name}
              </p>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Component
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
