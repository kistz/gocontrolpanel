"use client";

import FormElement from "@/components/form/form-element";
import SizeInput from "@/components/form/manialink/size-input";
import { Form } from "@/components/ui/form";
import {
  BLENDS,
  H_ALIGN,
  KEEP_RATIO,
  V_ALIGN,
} from "@/lib/manialink/attributes";
import { capitalizeWords } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DefaultAttributesForm from "../default-attributes-form";
import { QuadSchema, QuadSchemaType } from "./quad-schema";

interface QuadFormProps {
  attributes?: QuadSchemaType;
  onChange?: (attributes: QuadSchemaType) => void;
}

export default function QuadForm({ attributes, onChange }: QuadFormProps) {
  const form = useForm<QuadSchemaType>({
    resolver: zodResolver(QuadSchema),
    defaultValues: attributes,
  });

  form.watch((data) => {
    if (onChange) {
      onChange(data);
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <DefaultAttributesForm />

          <SizeInput name="size" />

          <FormElement
            name={"hAlign"}
            label="Horizontal Align"
            type="select"
            options={H_ALIGN.map((o) => {
              return { label: capitalizeWords(o), value: o };
            })}
          />

          <FormElement
            name={"vAlign"}
            label="Vertical Align"
            type="select"
            options={V_ALIGN.map((o) => {
              return { label: capitalizeWords(o), value: o };
            })}
          />

          <FormElement name="opacity" label="Opacity" type="checkbox" />

          <FormElement
            name="scriptEvents"
            label="Script Events"
            type="checkbox"
          />

          <FormElement name="action" label="Action" placeholder="myAction" />

          <FormElement
            name="url"
            label="URL"
            placeholder="https://example.com/image.png"
          />

          <FormElement
            name="manialink"
            label="Manialink"
            placeholder="myManialink"
          />

          <FormElement
            name="scriptAction"
            label="Script Action"
            placeholder="EventType'EventData1'EventData2'EventData3'…"
          />

          <FormElement
            name="image"
            label="Image"
            placeholder="https://example.com/image.png"
          />

          <FormElement
            name="imageFocus"
            label="Image Focus"
            placeholder="https://example.com/image-focus.png"
          />

          <FormElement
            name="alphaMask"
            label="Alpha Mask"
            placeholder="https://example.com/alpha-mask.png"
          />

          <FormElement
            name="bgColor"
            label="Background Color"
            placeholder="FFFFFF"
          />

          <FormElement
            name="bgColorFocus"
            label="Background Color Focus"
            placeholder="FFFFFF"
          />

          <FormElement
            name="blurAmount"
            label="Blur Amount"
            type="number"
            placeholder="0"
            min={0}
          />

          <FormElement
            name="blend"
            label="Blend Mode"
            type="select"
            options={BLENDS.map((o) => {
              return { label: capitalizeWords(o), value: o };
            })}
          />

          <FormElement name="style" label="Style" placeholder="myStyle" />

          <FormElement
            name="subStyle"
            label="Sub Style"
            placeholder="mySubStyle"
          />

          <FormElement
            name="styleSelected"
            label="Style Selected"
            type="checkbox"
          />

          <FormElement name="colorize" label="Colorize" placeholder="FFFFFF" />

          <FormElement
            name="modulateColor"
            label="Modulate Color"
            placeholder="FFFFFF"
          />

          <FormElement name="autoScale" label="Auto Scale" type="checkbox" />

          <FormElement
            name="keepRatio"
            label="Keep Ratio"
            type="select"
            options={KEEP_RATIO.map((o) => {
              return { label: capitalizeWords(o), value: o };
            })}
          />

          <FormElement
            name="autoScaleFixedWidth"
            label="Auto Scale Fixed Width"
            type="checkbox"
          />

          <FormElement
            name="pinCorners"
            label="Pin Corners"
            placeholder="<-0.75,1.>:<1.,1.>:<0.75,-1.>:<-1.,-1.>"
          />
        </div>
      </form>
    </Form>
  );
}
