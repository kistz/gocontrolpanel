"use client";
import { saveInterface } from "@/actions/database/interfaces";
import { renderInterface } from "@/actions/gbx/manialink/render-interface";
import { Interfaces } from "@/lib/prisma/generated";
import { cn, getErrorMessage } from "@/lib/utils";
import {
  IconDeviceFloppy,
  IconEye,
  IconLayoutSidebar,
  IconLayoutSidebarRight,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import React, {
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
import LabelComponent from "./components/label/label";
import QuadComponent from "./components/quad/quad";
import { QuadSchemaType } from "./components/quad/quad-schema";

export type InterfaceComponent<T = InterfaceComponentHandles> = {
  uuid: string;
  onClick?: () => void;
  scale?: number;
  ref?: React.Ref<T>;
};

export type InterfaceComponentHandles = {
  id: string;
  uuid: string;
  render: (editorRef: HTMLDivElement) => void;
  attributesForm: () => React.ReactNode;
};

export interface ComponentProps<T> {
  uuid: string;
  scale?: number;
  onClick?: () => void;
  ref?: React.Ref<ComponentHandles<T>>;
  defaultAttributes?: T;
}

export interface ComponentHandles<T = any> {
  uuid: string;
  id: string;
  getAttributes: () => {
    componentId: string;
    uuid: string;
    attributes: T;
  };
  attributesForm: () => React.ReactNode;
}

type ComponentEntry = {
  element: JSX.Element;
  uuid: string;
  label: string;
  ref: React.RefObject<ComponentHandles>;
};

export const EDITOR_DEFAULT_WIDTH = 1169;
export const EDITOR_DEFAULT_HEIGHT = (EDITOR_DEFAULT_WIDTH / 16) * 9; // 16:9 aspect ratio

export default function InterfaceEditor({
  serverId,
  defaultInterface,
  defaultInterfaces = [],
}: {
  serverId: string;
  defaultInterface?: Interfaces | null;
  defaultInterfaces?: Interfaces[];
}) {
  const [loading, setLoading] = useState(true);
  const [selectedInterface, setSelectedInterface] = useState<Interfaces | null>(
    defaultInterface || null,
  );
  const [interfaces, setInterfaces] = useState<Interfaces[]>(defaultInterfaces);

  const editorRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<React.RefObject<any>[]>([]);

  const [components, setComponents] = useState<ComponentEntry[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentEntry | null>(null);

  const [scale, setScale] = useState(1);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

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

  const addComponent = <T,>(
    Component: React.ComponentType<ComponentProps<T>>,
    label: string,
    defaultAttributes?: T,
  ) => {
    const newRef = createRef<ComponentHandles<T>>();
    const id = crypto.randomUUID();

    componentRefs.current.push(newRef);

    const element = (
      <Component
        key={id}
        uuid={id}
        ref={newRef}
        defaultAttributes={defaultAttributes}
      />
    );

    setComponents((prev) => [
      ...prev,
      {
        element,
        uuid: id,
        label,
        ref: newRef as React.RefObject<ComponentHandles>,
      },
    ]);
  };

  const handleDelete = (uuid: string) => {
    setComponents(components.filter((c) => c.element.key !== uuid));
    if (selectedComponent?.uuid === uuid) {
      setSelectedComponent(null);
    }
  };

  const onSave = async () => {
    if (!selectedInterface) {
      toast.error("No interface selected");
      return;
    }

    if (!editorRef.current) {
      toast.error("Editor not initialized");
      return;
    }

    const data = componentRefs.current
      .map((ref) => ref.current && ref.current.getAttributes())
      .filter((d) => d !== null && d !== undefined);

    const { data: savedInterface, error } = await saveInterface(
      serverId,
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

  const loadComponents = (dataString: string) => {
    if (!dataString) {
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(dataString);
      const newComponents: ComponentEntry[] = [];

      data.forEach((componentData: any) => {
        switch (componentData.componentId) {
          case "quad-component":
            const newRef = createRef<ComponentHandles<QuadSchemaType>>();
            componentRefs.current.push(newRef);

            newComponents.push({
              element: (
                <QuadComponent
                  key={componentData.uuid}
                  uuid={componentData.uuid}
                  ref={newRef}
                  defaultAttributes={componentData.attributes}
                />
              ),
              uuid: componentData.uuid,
              label: "Quad Component",
              ref: newRef as React.RefObject<ComponentHandles>,
            });
            break;
          case "label-component":
            const labelRef = createRef<ComponentHandles>();
            componentRefs.current.push(labelRef);

            newComponents.push({
              element: (
                <LabelComponent
                  key={componentData.uuid}
                  uuid={componentData.uuid}
                  ref={labelRef}
                  defaultAttributes={componentData.attributes}
                />
              ),
              uuid: componentData.uuid,
              label: "Label Component",
              ref: labelRef as React.RefObject<ComponentHandles>,
            });
            break;
          default:
            console.warn(`Unknown component id: ${componentData.id}`);
        }
      });

      setComponents(newComponents);
      setLoading(false);
    } catch (error) {
      console.error("Failed to parse component data:", error);
      toast.error("Failed to load components");
      setLoading(false);
    }
  };

  const render = async () => {
    if (!selectedInterface) {
      toast.error("No interface selected");
      return;
    }

    try {
      const { error } = await renderInterface(selectedInterface);
      if (error) {
        throw new Error(error);
      }

      toast.success("Interface rendered successfully");
    } catch (error) {
      console.error("Failed to render interface:", error);
      toast.error("Failed to render interface", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleSelect = (entry: ComponentEntry) => {
    const ref = componentRefs.current.find(
      (r) => r.current?.uuid === entry.uuid,
    );
    if (!ref) {
      console.warn("Component ref not found:", entry.uuid);
      return;
    }

    setSelectedComponent(entry);
  };

  useEffect(() => {
    if (!selectedInterface) {
      setLoading(false);
      return;
    }
    loadComponents(selectedInterface.interfaceString);
  }, [selectedInterface]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="flex flex-row justify-between px-4 py-2 items-center">
        <div className="flex gap-2">
          <span
            className="sr-only"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          >
            Toggle Left Sidebar
          </span>
          <IconLayoutSidebar
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          />
          <span
            className="sr-only"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          >
            Toggle Right Sidebar
          </span>
          <IconLayoutSidebarRight
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            onValueChange={onInterfaceChange}
            defaultValue={selectedInterface?.id || ""}
            disabled={loading}
          >
            <SelectTrigger>
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
              serverId={serverId}
              onSubmit={(newInterface?: Interfaces) => {
                if (!newInterface) return;
                setInterfaces((prev) => [...prev, newInterface]);
              }}
            />
            <Button size="icon" variant={"outline"}>
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
      </Card>

      <div className="flex w-full gap-2 flex-col md:flex-row">
        <Card
          className={cn(
            "overflow-x-hidden",
            leftSidebarOpen ? "flex-1" : "hidden w-0",
          )}
          style={{ maxHeight: `${EDITOR_DEFAULT_HEIGHT * scale}px` }}
        >
          <div className="flex flex-col gap-4 p-4 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Components</h2>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="justify-start w-full"
                    onClick={() =>
                      addComponent(QuadComponent, "Quad Component", {
                        pos: { x: 0, y: 0 },
                        size: { width: 100, height: 40 },
                        bgColor: "000",
                        opacity: true,
                      })
                    }
                  >
                    <IconPlus />
                    Quad
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start w-full"
                    onClick={() =>
                      addComponent(LabelComponent, "Label Component", {
                        pos: { x: 0, y: 0 },
                        size: { width: 100, height: 40 },
                        opacity: true,
                        text: "Label",
                      })
                    }
                  >
                    <IconPlus />
                    Label
                  </Button>
                </div>
                <Separator />

                <div className="flex flex-col gap-2">
                  {components.length === 0 ? (
                    <p className="text-muted-foreground">
                      No components added yet.
                    </p>
                  ) : (
                    components.map((Comp) => (
                      <Button
                        key={Comp.element.key}
                        variant="outline"
                        className={cn(
                          " justify-between w-full",
                          selectedComponent?.uuid === Comp.uuid &&
                            "border-primary!",
                        )}
                        onClick={() => handleSelect(Comp)}
                      >
                        {Comp.label}

                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete(Comp.uuid);
                          }}
                        >
                          <IconTrash />
                        </span>
                      </Button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        <div
          ref={editorRef}
          className="relative flex-4 h-full aspect-video overflow-hidden"
          style={{
            width: EDITOR_DEFAULT_WIDTH * scale,
            position: "relative",
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
              className="rounded-xl"
            />

            {components.map((Comp) =>
              cloneElement(Comp.element, {
                scale,
                onClick: () => {
                  handleSelect(Comp);
                },
              }),
            )}
          </div>
        </div>

        <Card
          className={cn(
            "overflow-x-hidden",
            rightSidebarOpen ? "flex-1" : "hidden w-0",
          )}
          style={{ maxHeight: `${EDITOR_DEFAULT_HEIGHT * scale}px` }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-muted-foreground text-center">Loading...</p>
            </div>
          ) : selectedComponent !== null &&
            selectedComponent.ref.current !== null ? (
            <div
              key={selectedComponent.uuid}
              className="overflow-y-scroll w-full flex flex-col gap-4 p-4 h-full"
            >
              {selectedComponent.ref.current?.attributesForm()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-muted-foreground text-center">
                Select a component to edit its attributes.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
