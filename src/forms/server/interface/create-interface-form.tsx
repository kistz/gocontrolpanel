"use client";

import { createInterface } from "@/actions/database/interfaces";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Interfaces } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateInterfaceSchema,
  CreateInterfaceSchemaType,
} from "./create-interface-schema";

export default function CreateInterfaceForm({
  id,
  callback,
}: {
  id: string;
  callback?: (newInterface: Interfaces) => void;
}) {
  const form = useForm<CreateInterfaceSchemaType>({
    resolver: zodResolver(CreateInterfaceSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateInterfaceSchemaType) {
    try {
      const { data, error } = await createInterface(id, values.name, "");
      if (error) {
        throw new Error(error);
      }
      toast.success("Interface successfully created");
      if (callback) {
        callback(data);
      }
    } catch (error) {
      toast.error("Failed to create interface", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormElement
          name={"name"}
          label="Name"
          description="The name of the interface."
          placeholder="Enter interface name"
          isRequired
        />

        <Button type="submit" className="w-full mt-4">
          Create Interface
        </Button>
      </form>
    </Form>
  );
}
