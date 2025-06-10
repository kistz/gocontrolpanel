"use client";
import { saveInterface } from "@/actions/database/interfaces";
import { renderInterface } from "@/actions/gbx/manialink/render-interface";
import { Interfaces } from "@/lib/prisma/generated";
import { parseComponentId } from "@/lib/utils";
import {
  IconDeviceFloppy,
  IconEye,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
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
} from "./widgets/local-records/local-records";

export type InterfaceComponent<T = InterfaceComponentHandles> = {
  uuid: string;
  onClick?: () => void;
  scale?: number;
  ref?: React.Ref<T>;
};

export type InterfaceComponentHandles = {
  uuid: string;
  render: () => void;
  getEditFields: () => React.ReactNode;
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
  const [selectedComponent, setSelectedComponent] =
    useState<React.RefObject<any> | null>(null);

  const [scale, setScale] = useState(1);

  const onInterfaceChange = (value: string) => {
    const newInterface = interfaces.find((i) => i.id === value);
    if (!newInterface) {
      toast.error("Interface not found");
      return;
    }

    setSelectedComponent(null);
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
    const id = crypto.randomUUID();

    setComponents((prev) => [
      ...prev,
      <Widget key={id} uuid={id} ref={newRef} />,
    ]);
  };

  const handleDelete = () => {
    if (selectedComponent === null) return;
    setComponents(
      components.filter((c) => c.key !== selectedComponent.current?.uuid),
    );
    setSelectedComponent(null);
  };

  const onSave = async () => {
    if (!selectedInterface) {
      toast.error("No interface selected");
      return;
    }

    const data = widgetRefs.current
      .map((ref) => ref.current && ref.current.render())
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
            const id = crypto.randomUUID();

            newComponents.push(
              <LocalRecordsWidgetComponent
                key={id}
                uuid={id}
                ref={newRef}
                defaultValues={{
                  attributes: widgetData.attributes,
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

  const render = async () => {
    if (!selectedInterface) {
      toast.error("No interface selected");
      return;
    }

    const { error } = await renderInterface(selectedInterface);
    if (error) {
      console.error("Failed to render interface:", error);
      toast.error("Failed to render interface");
      return;
    }

    toast.success("Interface rendered successfully");
  };

  const handleSelect = (Comp: JSX.Element) => {
    const ref = widgetRefs.current.find(
      (r) => r.current?.uuid === Comp.props.uuid,
    );
    if (!ref) {
      console.warn("Component ref not found:", Comp.props.uuid);
      return;
    }

    setSelectedComponent(ref);
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

          {components.map((Comp) =>
            cloneElement(Comp, {
              scale,
              onClick: () => {
                handleSelect(Comp);
              },
            }),
          )}
        </div>
      </div>

      <Card
        className="flex-1"
        style={{ maxHeight: `${EDITOR_DEFAULT_HEIGHT * scale}px` }}
      >
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
                  Local Records
                </Button>
              </div>
              <Separator />
              {selectedComponent !== null && (
                <div className="overflow-y-scroll">
                  <div className="flex gap-2 justify-between w-full">
                    <h2 className="text-lg font-semibold">
                      {parseComponentId(
                        selectedComponent.current?.render(serverUuid).id,
                      ) || "Selected Component"}
                    </h2>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      <IconTrash />
                    </Button>
                  </div>

                  <div className="w-full h-full">
                    {selectedComponent.current?.getEditFields()}
                  </div>
                </div>
              )}
              <Separator className="mt-auto" />

              <div className="flex gap-2 flex-col">
                <div className="w-full flex gap-2">
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
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={!selectedInterface}
                    onClick={render}
                    className="flex-1"
                  >
                    <IconEye />
                    Render
                  </Button>

                  <Button
                    onClick={onSave}
                    disabled={!selectedInterface}
                    className="flex-1"
                  >
                    <IconDeviceFloppy />
                    Save
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
