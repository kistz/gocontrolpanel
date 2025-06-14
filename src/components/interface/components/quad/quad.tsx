import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ComponentHandles, ComponentProps } from "../../editor";
import { QuadSchemaType } from "./quad-schema";

const QuadComponent = forwardRef<
  ComponentHandles,
  QuadSchemaType & ComponentProps
>(({ scale, onClick, ...defaultAttributes }, ref) => {
  const id = "quad-component";

  const componentRef = useRef<Rnd | null>(null);

  const [attributes, setAttributes] =
    useState<QuadSchemaType>(defaultAttributes);

  useImperativeHandle(ref, () => ({
    attributesForm() {
      return <></>;
    },
  }));

  return (
    <Rnd scale={scale} bounds="parent" onClick={onClick} ref={componentRef} />
  );
});

QuadComponent.displayName = "QuadComponent";

export default QuadComponent;
