"use client";

import FormElement from "@/components/form/form-element";

export default function FourSideInput({
  control,
  name,
  label,
  errors,
}: {
  control: any;
  name: string;
  label: string;
  errors?: {
    top?: any;
    right?: any;
    bottom?: any;
    left?: any;
  };
}) {
  return (
    <div className="flex flex-col gap-1">
      <span>{label}</span>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <FormElement
          control={control}
          name={`${name}.top`}
          label="Top"
          type="number"
          placeholder="0"
          error={errors?.top}
        />
        <FormElement
          control={control}
          name={`${name}.right`}
          label="Right"
          type="number"
          placeholder="0"
          error={errors?.right}
        />
        <FormElement
          control={control}
          name={`${name}.bottom`}
          label="Bottom"
          type="number"
          placeholder="0"
          error={errors?.bottom}
        />
        <FormElement
          control={control}
          name={`${name}.left`}
          label="Left"
          type="number"
          placeholder="0"
          error={errors?.left}
        />
      </div>
    </div>
  );
}
