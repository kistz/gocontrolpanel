import { manialinkPositionToEditorPosition } from "@/lib/interface/utils";
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
    getAttributes: () => attributes,
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
      size={{
        width: attributes?.size?.width || 100,
        height: attributes?.size?.height || 40,
      }}
      disableDragging={true}
      enableResizing={false}
      style={{
        zIndex: attributes?.zIndex,
        transform: `scale(${scale}) rotate(${attributes?.rot || 0}deg)`,
        display: attributes?.hidden ? "none" : "block",
        opacity: attributes?.opacity ? 1 : 0,
        backgroundImage: `url(${attributes?.image || ""})`,
        backgroundColor: "#" + attributes?.bgColor,
        filter: `blur(${attributes?.blurAmount || 0}px)`,
      }}
    />
  );
});

QuadComponent.displayName = "QuadComponent";

export default QuadComponent;
