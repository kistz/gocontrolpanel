import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ComponentHandles, ComponentProps } from "../../editor";
import QuadForm from "./quad-form";
import { QuadSchemaType } from "./quad-schema";

interface QuadComponentProps extends ComponentProps {
  defaultAttributes?: QuadSchemaType;
}

const QuadComponent = forwardRef<ComponentHandles, QuadComponentProps>(
  ({ scale, onClick, defaultAttributes }, ref) => {
    const id = "quad-component";

    const componentRef = useRef<Rnd | null>(null);

    const [attributes, setAttributes] =
      useState<QuadSchemaType | undefined>(defaultAttributes);

    useImperativeHandle(ref, () => ({
      attributesForm() {
        return <QuadForm attributes={attributes} />;
      },
    }));

    return (
      <Rnd scale={scale} bounds="parent" onClick={onClick} ref={componentRef} />
    );
  },
);

QuadComponent.displayName = "QuadComponent";

export default QuadComponent;
