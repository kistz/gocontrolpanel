"use client";

import FormElement from "@/components/form/form-element";
import SizeInput from "@/components/form/manialink/size-input";
import { Form } from "@/components/ui/form";
import { FONTS, H_ALIGN, V_ALIGN } from "@/lib/manialink/attributes";
import { capitalizeWords } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DefaultAttributesForm from "../default-attributes-form";
import { LabelSchema, LabelSchemaType } from "./label-schema";

interface LabelFormProps {
  attributes?: LabelSchemaType;
  onChange?: (attributes: LabelSchemaType) => void;
}

export default function LabelForm({ attributes, onChange }: LabelFormProps) {
  const form = useForm<LabelSchemaType>({
    resolver: zodResolver(LabelSchema),
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
            options={H_ALIGN.map((o) => ({
              label: capitalizeWords(o),
              value: o,
            }))}
          />

          <FormElement
            name={"vAlign"}
            label="Vertical Align"
            type="select"
            options={V_ALIGN.map((o) => ({
              label: capitalizeWords(o),
              value: o,
            }))}
          />

          <FormElement
            name="scriptEvents"
            label="Script Events"
            type="checkbox"
          />
          <FormElement name="opacity" label="Opacity" type="checkbox" />

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

          <FormElement name="style" label="Style" placeholder="myStyle" />

          <FormElement
            name="textFont"
            label="Text Font"
            type="select"
            options={FONTS.map((font) => ({
              label: capitalizeWords(font),
              value: font,
            }))}
          />

          <FormElement
            name="textSize"
            label="Text Size"
            type="number"
            min={0}
            placeholder="12"
          />

          <FormElement
            name="textColor"
            label="Text Color"
            placeholder="FFFFFF"
          />

          <FormElement
            name="focusAreaColor1"
            label="Focus Area Color 1"
            placeholder="FFFFFF"
          />

          <FormElement
            name="focusAreaColor2"
            label="Focus Area Color 2"
            placeholder="FFFFFF"
          />

          <FormElement name="text" label="Text" placeholder="Hello, World!" />

          <FormElement
            name="textPrefix"
            label="Text Prefix"
            placeholder="Prefix: "
          />

          <FormElement name="textEmboss" label="Text Emboss" type="checkbox" />

          <FormElement
            name="autoNewLine"
            label="Auto New Line"
            type="checkbox"
          />

          <FormElement
            name="lineSpacing"
            label="Line Spacing"
            type="number"
            min={0}
            placeholder="0"
          />

          <FormElement
            name="maxLine"
            label="Max Line"
            type="number"
            min={1}
            placeholder="1"
          />

          <FormElement name="translate" label="Translate" type="checkbox" />

          <FormElement name="textId" label="Text Id" placeholder="myTextId" />

          <FormElement
            name="appendEllipsis"
            label="Append Ellipsis"
            type="checkbox"
          />

          <FormElement
            name="italicSlope"
            label="Italic Slope"
            type="number"
            min={-1}
            max={1}
            step={0.01}
            placeholder="0"
          />
        </div>
      </form>
    </Form>
  );
}
