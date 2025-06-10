"use client";

import FormElement from "@/components/form/form-element";
import { Control, FieldError, FieldValues, Merge, Path } from "react-hook-form";

export default function FourSideInput<TControl extends FieldValues>({
  control,
  name,
  label,
  errors,
  min,
}: {
  control: Control<TControl>;
  name: Path<TControl>;
  label: string;
  errors?: {
    top?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
    right?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
    bottom?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
    left?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
  };
  min?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span>{label}</span>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <FormElement
          control={control}
          name={`${name}.top` as Path<TControl & FieldValues>}
          label="Top"
          type="number"
          placeholder="0"
          min={min}
          error={errors?.top}
        />
        <FormElement
          control={control}
          name={`${name}.right` as Path<TControl & FieldValues>}
          label="Right"
          type="number"
          placeholder="0"
          min={min}
          error={errors?.right}
        />
        <FormElement
          control={control}
          name={`${name}.bottom` as Path<TControl & FieldValues>}
          label="Bottom"
          type="number"
          placeholder="0"
          min={min}
          error={errors?.bottom}
        />
        <FormElement
          control={control}
          name={`${name}.left` as Path<TControl & FieldValues>}
          label="Left"
          type="number"
          placeholder="0"
          min={min}
          error={errors?.left}
        />
      </div>
    </div>
  );
}
