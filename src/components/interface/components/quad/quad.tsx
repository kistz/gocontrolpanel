import {
  getTranslateX,
  getTranslateY,
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
  const [isHovered, setIsHovered] = useState(false);

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
      size={manialinkSizeToEditorSize({
        width: attributes?.size?.width ?? 0,
        height: attributes?.size?.height ?? 0,
      })}
      disableDragging={true}
      enableResizing={false}
      style={{
        zIndex: attributes?.zIndex || 0,
      }}
    >
      <div
        className="w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `scale(${attributes.scale || 1}) rotate(${attributes?.rot || 0}deg) translateX(${getTranslateX(attributes.hAlign)}%) translateY(${getTranslateY(attributes.vAlign)}%)`,
          transformOrigin: "top left",
          display: attributes?.hidden ? "none" : "flex",
          opacity: attributes?.opacity ? 1 : 0,
          backgroundImage: `url(${(isHovered ? attributes.imageFocus : attributes?.image) || ""})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: isHovered
            ? "#" + attributes?.bgColorFocus
            : attributes?.bgColor
              ? "#" + attributes?.bgColor
              : "transparent",
          filter: `blur(${attributes?.blurAmount || 0}px)`,

          ...(attributes.alphaMask && {
            maskImage: `url(${attributes?.alphaMask || ""})`,
            maskSize: "100% 100%",
            maskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskImage: `url(${attributes.alphaMask})`,
            WebkitMaskSize: "100% 100%",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
          }),
        }}
      />
    </Rnd>
  );
});

QuadComponent.displayName = "QuadComponent";

export default QuadComponent;
