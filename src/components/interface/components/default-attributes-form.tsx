"use client";

import ClassInput from "@/components/form/manialink/class-input";
import HiddenInput from "@/components/form/manialink/hidden-input";
import IdInput from "@/components/form/manialink/id-input";
import PositionInput from "@/components/form/manialink/position-input";
import RotationInput from "@/components/form/manialink/rotation-input";
import ScaleInput from "@/components/form/manialink/scale-input";
import ZIndexInput from "@/components/form/manialink/z-index-input";
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
      <PositionInput
        control={form.control}
        name="pos"
        label="Position"
        errors={form.formState.errors.pos}
        min={-1000}
      />

      <ZIndexInput
        control={form.control}
        name="zIndex"
        error={form.formState.errors.zIndex}
      />

      <ScaleInput
        control={form.control}
        name="scale"
        error={form.formState.errors.scale}
      />

      <RotationInput
        control={form.control}
        name="rot"
        error={form.formState.errors.rot}
      />

      <HiddenInput
        control={form.control}
        name="hidden"
        error={form.formState.errors.hidden}
      />

      <IdInput
        control={form.control}
        name="id"
        error={form.formState.errors.id}
      />

      <ClassInput name="class" />
    </div>
  );
}
