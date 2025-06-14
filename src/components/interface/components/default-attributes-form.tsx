"use client";

import FormElement from "@/components/form/form-element";
import PositionInput from "@/components/form/manialink/position-input";
import { UseFormReturn } from "react-hook-form";
import { DefaultAttributesSchemaType } from "./default-attributes-schema";

interface DefaultAttributesFormProps {
  form: UseFormReturn<DefaultAttributesSchemaType>;
}

export default function DefaultAttributesForm({
  form,
}: DefaultAttributesFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <PositionInput name="pos" label="Position" min={-1000} />

      <FormElement
        name="zIndex"
        label="Z Index"
        type="number"
        placeholder="0"
      />

      <FormElement name="scale" label="Scale" type="number" placeholder="1" />

      <FormElement name="rot" label="Rotation" type="number" placeholder="0" />

      <FormElement name="hidden" label="Hidden" type="checkbox" />

      <FormElement name="id" label="Id" placeholder="my-element" />

      <FormElement name="class" label="Class" placeholder="my-class" />
    </div>
  );
}
