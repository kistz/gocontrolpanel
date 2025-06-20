"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DefaultAttributesForm from "../default-attributes-form";
import { FrameSchema, FrameSchemaType } from "./frame-schema";

interface FrameFormProps {
  attributes?: FrameSchemaType;
  onChange?: (attributes: FrameSchemaType) => void;
}

export default function FrameForm({ attributes, onChange }: FrameFormProps) {
  const form = useForm<FrameSchemaType>({
    resolver: zodResolver(FrameSchema),
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
        </div>
      </form>
    </Form>
  );
}
