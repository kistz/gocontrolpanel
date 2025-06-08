"use client";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import {
  cloneElement,
  createRef,
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import LocalRecordsWidgetComponent from "./widgets/local-records";

export type InterfaceComponent<T = InterfaceComponentHandles> = {
  onClick?: () => void;
  scale?: number;
  ref?: React.Ref<T>;
};

export type InterfaceComponentHandles = {
  render: (
    serverId: number,
    EDITOR_DEFAULT_WIDTH: number,
    EDITOR_DEFAULT_HEIGHT: number,
  ) => Promise<void>;
};

const EDITOR_DEFAULT_WIDTH = 1169;
const EDITOR_DEFAULT_HEIGHT = (EDITOR_DEFAULT_WIDTH / 16) * 9; // 16:9 aspect ratio

export default function InterfaceEditor({ serverId }: { serverId: number }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const widgetRefs = useRef<React.RefObject<any>[]>([]);

  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!editorRef.current) return;

    const observer = new ResizeObserver(({ 0: { contentRect } }) => {
      const widthRatio = contentRect.width / EDITOR_DEFAULT_WIDTH;
      const heightRatio = contentRect.height / EDITOR_DEFAULT_HEIGHT;
      setScale(Math.min(widthRatio, heightRatio));
    });

    observer.observe(editorRef.current);

    return () => observer.disconnect();
  }, []);

  const addWidget = <T,>(
    Widget: React.ComponentType<InterfaceComponent<T>>,
  ) => {
    const newRef = createRef<T>();
    widgetRefs.current.push(newRef);

    setComponents((prev) => [
      ...prev,
      <Widget key={prev.length} ref={newRef} />,
    ]);
  };

  const handleDelete = () => {
    if (selectedIndex === null) return;
    setComponents(components.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);
  };

  const onSave = async () => {
    widgetRefs.current.map(
      (ref) =>
        ref.current &&
        ref.current.render(
          serverId,
          EDITOR_DEFAULT_WIDTH,
          EDITOR_DEFAULT_HEIGHT,
        ),
    );
  };

  return (
    <div className="flex w-full gap-4 flex-col md:flex-row">
      <div
        ref={editorRef}
        className="relative flex-4 h-full aspect-video overflow-hidden"
        style={{
          width: EDITOR_DEFAULT_WIDTH * scale,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            aspectRatio: "16 / 9",
            width: EDITOR_DEFAULT_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
          }}
        >
          <Image
            src="/tm-background.png"
            alt="Interface Background"
            fill
            className="rounded-lg"
          />

          {components.map((Comp, i) =>
            cloneElement(Comp, {
              key: i,
              scale,
              onClick: () => setSelectedIndex(i),
            }),
          )}
        </div>
      </div>

      <Card className="flex-1">
        <div className="flex flex-col gap-4 p-4 h-full">
          <h2 className="text-lg font-semibold">Widgets</h2>
          <div className="flex flex-col gap-2">
            <Button onClick={() => addWidget(LocalRecordsWidgetComponent)}>
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

          <Separator className="mt-auto" />

          <Button onClick={onSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
