import { manialinkPositionToEditorPosition } from "@/lib/interface/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ComponentHandles, ComponentProps } from "../../editor";
import FrameForm from "./frame-form";
import { FrameSchemaType } from "./frame-schema";

const FrameComponent = forwardRef<
  ComponentHandles<FrameSchemaType>,
  ComponentProps<FrameSchemaType>
>(({ scale, onClick, uuid, defaultAttributes }, ref) => {
  const id = "frame-component";

  const componentRef = useRef<Rnd | null>(null);

  const [attributes, setAttributes] = useState<FrameSchemaType>(
    defaultAttributes ?? {},
  );

  useImperativeHandle(ref, () => ({
    uuid,
    id,
    getAttributes: () => {
      return {
        componentId: id,
        uuid,
        attributes,
      };
    },
    attributesForm() {
      return (
        <FrameForm
          attributes={attributes}
          onChange={(data) => {
            setAttributes(data);
          }}
        />
      );
    },
  }));

  return (
    <Rnd
      scale={scale}
      bounds="parent"
      onClick={onClick}
      ref={componentRef}
      position={
        manialinkPositionToEditorPosition({
          x: attributes?.pos?.x ?? 0,
          y: attributes?.pos?.y ?? 0,
        }) || { x: 0, y: 0 }
      }
      className="border border-gray-300 rounded-lg bg-white shadow-sm"
      disableDragging={true}
      enableResizing={false}
      style={{
        zIndex: attributes?.zIndex ?? 0,
      }}
    >
      <div></div>
    </Rnd>
  );
});

FrameComponent.displayName = "FrameComponent";

export default FrameComponent;
