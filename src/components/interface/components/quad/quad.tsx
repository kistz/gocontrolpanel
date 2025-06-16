import {
  manialinkPositionToEditorPosition,
  manialinkSizeToEditorSize,
} from "@/lib/interface/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ComponentHandles, ComponentProps } from "../../editor";
import QuadForm from "./quad-form";
import { QuadSchemaType } from "./quad-schema";

const QuadComponent = forwardRef<
  ComponentHandles<QuadSchemaType>,
  ComponentProps<QuadSchemaType>
>(({ scale, onClick, uuid, defaultAttributes }, ref) => {
  const id = "quad-component";

  const componentRef = useRef<Rnd | null>(null);

  const [attributes, setAttributes] = useState<QuadSchemaType>(
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
      }
    },
    attributesForm() {
      return (
        <QuadForm
          attributes={attributes}
          onChange={(data) => {
            setAttributes(data);
          }}
        />
      );
    },
  }));

  const translateX = attributes?.hAlign === "center" ? -50 : 0;
  const translateY = attributes?.vAlign === "center" ? -50 : 0;

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
      size={manialinkSizeToEditorSize({
        width: attributes?.size?.width ?? 0,
        height: attributes?.size?.height ?? 0,
      })}
      disableDragging={true}
      enableResizing={false}
    >
      <div
        className="w-full h-full"
        style={{
          zIndex: attributes?.zIndex,
          transform: `scale(${attributes.scale || 1}) rotate(${attributes?.rot || 0}deg) translateX(${translateX}%) translateY(${translateY}%)`,
          transformOrigin: "top left",
          display: attributes?.hidden ? "none" : "flex",
          opacity: attributes?.opacity ? 1 : 0,
          backgroundImage: `url(${attributes?.image || ""})`,
          backgroundColor: "#" + attributes?.bgColor,
          filter: `blur(${attributes?.blurAmount || 0}px)`,
        }}
      />
    </Rnd>
  );
});

QuadComponent.displayName = "QuadComponent";

export default QuadComponent;
