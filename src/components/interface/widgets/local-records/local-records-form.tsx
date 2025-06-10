"use client";

import FormElement from "@/components/form/form-element";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  LocalRecordsSchema,
  LocalRecordsSchemaType,
} from "./local-records-schema";

export default function LocalRecordsForm({
  defaultValues,
  onChange,
}: {
  defaultValues?: LocalRecordsSchemaType;
  onChange?: (data: LocalRecordsSchemaType) => void;
}) {
  const form = useForm<LocalRecordsSchemaType>({
    resolver: zodResolver(LocalRecordsSchema),
    defaultValues,
  });

  form.watch((data) => {
    if (onChange) {
      onChange(data);
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Header</span>

          <FormElement
            control={form.control}
            name={"header.text"}
            label="Text"
            placeholder="Records"
            error={form.formState.errors.header?.text}
          />

          <FormElement
            control={form.control}
            name={"header.font"}
            label="Font"
            placeholder="RobotoCondensedBold"
            error={form.formState.errors.header?.font}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold">Record</span>

          <FormElement
            control={form.control}
            name={"record.padding.left"}
            label="Padding Left"
            type="number"
            placeholder="0"
            error={form.formState.errors.record?.padding?.left}
          />

          <FormElement
            control={form.control}
            name={"record.padding.right"}
            label="Padding Right"
            type="number"
            placeholder="0"
            error={form.formState.errors.record?.padding?.right}
          />

          <FormElement
            control={form.control}
            name={"record.padding.top"}
            label="Padding Top"
            type="number"
            placeholder="0"
            error={form.formState.errors.record?.padding?.top}
          />

          <FormElement
            control={form.control}
            name={"record.padding.bottom"}
            label="Padding Bottom"
            type="number"
            placeholder="0"
            error={form.formState.errors.record?.padding?.bottom}
          />
        </div>
      </form>
    </Form>
  );
}
