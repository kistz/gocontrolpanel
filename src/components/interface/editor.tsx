"use client";
import { saveInterface } from "@/actions/database/interfaces";
import { Interfaces } from "@/lib/prisma/generated";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import {
  cloneElement,
  createRef,
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import CreateInterfaceModal from "../modals/create-interface-modal";
import Modal from "../modals/modal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import LocalRecordsWidgetComponent, {
  LocalRecordsWidgetComponentHandles,
} from "./widgets/local-records";

export type InterfaceComponent<T = InterfaceComponentHandles> = {
  onClick?: () => void;
  scale?: number;
  ref?: React.Ref<T>;
};

export type InterfaceComponentHandles = {
  render: () => void;
};

export const EDITOR_DEFAULT_WIDTH = 1169;
export const EDITOR_DEFAULT_HEIGHT = (EDITOR_DEFAULT_WIDTH / 16) * 9; // 16:9 aspect ratio

export default function InterfaceEditor({
  serverUuid,
  defaultInterface,
  defaultInterfaces = [],
}: {
  serverUuid: string;
  defaultInterface?: Interfaces | null;
  defaultInterfaces?: Interfaces[];
}) {
  const [loading, setLoading] = useState(true);
  const [selectedInterface, setSelectedInterface] = useState<Interfaces | null>(
    defaultInterface || null,
  );
  const [interfaces, setInterfaces] = useState<Interfaces[]>(defaultInterfaces);

  const editorRef = useRef<HTMLDivElement>(null);
  const widgetRefs = useRef<React.RefObject<any>[]>([]);

  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [scale, setScale] = useState(1);

  const onInterfaceChange = (value: string) => {
    const newInterface = interfaces.find((i) => i.id === value);
    if (!newInterface) {
      toast.error("Interface not found");
      return;
    }

    setSelectedIndex(null);
    setComponents([]);
    setLoading(true);
    setSelectedInterface(newInterface);
  };

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
    if (!selectedInterface) {
      toast.error("No interface selected");
      return;
    }

    const data = widgetRefs.current
      .map((ref) => ref.current && ref.current.render(serverUuid))
      .filter((d) => d !== null && d !== undefined);

    const { data: savedInterface, error } = await saveInterface(
      serverUuid,
      selectedInterface.id,
      JSON.stringify(data),
    );
    if (error) {
      console.error("Failed to save interface:", error);
      toast.error("Failed to save interface");
      return;
    }

    toast.success("Interface saved successfully");

    setSelectedInterface(savedInterface);
    setInterfaces((prev) =>
      prev.map((i) => (i.id === savedInterface.id ? savedInterface : i)),
    );
  };

  const loadWidgets = (dataString: string) => {
    if (!dataString) {
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(dataString);
      const newComponents: JSX.Element[] = [];

      data.forEach((widgetData: any, i: number) => {
        switch (widgetData.id) {
          case "local-records-widget":
            const newRef = createRef<LocalRecordsWidgetComponentHandles>();
            widgetRefs.current.push(newRef);

            newComponents.push(
              <LocalRecordsWidgetComponent
                key={i}
                ref={newRef}
                defaultValues={{
                  header: widgetData.header,
                  positionPercentage: widgetData.positionPercentage,
                  sizePercentage: widgetData.sizePercentage,
                }}
              />,
            );
            break;
          default:
            console.warn(`Unknown widget id: ${widgetData.id}`);
        }
      });

      setComponents(newComponents);
      setLoading(false);
    } catch (error) {
      console.error("Failed to parse widget data:", error);
      toast.error("Failed to load widgets");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedInterface) {
      setLoading(false);
      return;
    }
    loadWidgets(selectedInterface.interfaceString);
  }, [selectedInterface]);

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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Widgets</h2>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => addWidget(LocalRecordsWidgetComponent)}
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
              <Separator className="mt-auto" />

              <div className="flex gap-2">
                <Select
                  onValueChange={onInterfaceChange}
                  defaultValue={selectedInterface?.id || ""}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select interface" />
                  </SelectTrigger>
                  <SelectContent>
                    {interfaces?.map((i) => (
                      <SelectItem
                        key={i.id}
                        value={i.id}
                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Modal>
                  <CreateInterfaceModal
                    serverUuid={serverUuid}
                    onSubmit={(newInterface?: Interfaces) => {
                      if (!newInterface) return;
                      setInterfaces((prev) => [...prev, newInterface]);
                    }}
                  />
                  <Button size="icon">
                    <IconPlus />
                    <span className="sr-only">Create New Interface</span>
                  </Button>
                </Modal>

                <Button onClick={onSave}>
                  <IconDeviceFloppy />
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
