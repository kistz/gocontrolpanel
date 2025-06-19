import {
  getAlignHorizontal,
  getAlignVertical,
  getTranslateX,
  getTranslateY,
  manialinkPositionToEditorPosition,
  manialinkSizeToEditorSize,
} from "@/lib/interface/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ComponentHandles, ComponentProps } from "../../editor";
import LabelForm from "./label-form";
import { LabelSchemaType } from "./label-schema";

const LabelComponent = forwardRef<
  ComponentHandles<LabelSchemaType>,
  ComponentProps<LabelSchemaType>
>(({ scale, onClick, uuid, defaultAttributes }, ref) => {
  const id = "label-component";

  const componentRef = useRef<Rnd | null>(null);

  const [attributes, setAttributes] = useState<LabelSchemaType>(
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
        <LabelForm
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
      <span
        className="w-full h-full select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `scale(${attributes.scale || 1}) rotate(${attributes?.rot || 0}deg) translateX(${getTranslateX(attributes.hAlign)}%) translateY(${getTranslateY(attributes.vAlign)}%)`,
          transformOrigin: "top left",
          display: attributes?.hidden ? "none" : "flex",
          alignItems: getAlignVertical(attributes?.vAlign),
          justifyContent: getAlignHorizontal(attributes?.hAlign),
          opacity: attributes?.opacity ? 1 : 0,
          fontFamily: attributes?.textFont,
          fontSize: attributes?.textSize ? 4 + attributes.textSize * 5 : 16,
          lineHeight: 1,
          color: "#" + attributes?.textColor,
          backgroundColor: isHovered
            ? "#" + (attributes?.focusAreaColor2 || "0937")
            : attributes?.focusAreaColor1
              ? "#" + attributes?.focusAreaColor1
              : "transparent",
        }}
      >
        {(attributes.textPrefix ?? "") + (attributes.text ?? "")}
      </span>
    </Rnd>
  );
});

LabelComponent.displayName = "LabelComponent";

export default LabelComponent;
