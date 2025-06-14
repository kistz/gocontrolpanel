"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QuadSchema, QuadSchemaType } from "./quad-schema";

interface QuadFormProps {
  attributes: QuadSchemaType;
  onChange: (attributes: QuadSchemaType) => void;
}

export default function QuadForm({ attributes, onChange }: QuadFormProps) {
  const form = useForm<QuadSchemaType>({
    resolver: zodResolver(QuadSchema),
    defaultValues: attributes,
  });

  form.watch((data) => {
    onChange(data);
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          
        </div>
      </form>
    </Form>
  );
}
