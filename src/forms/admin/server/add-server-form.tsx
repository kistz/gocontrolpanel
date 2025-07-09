"use client";
import { addServer } from "@/actions/gbxconnector/servers";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddServerSchema, AddServerSchemaType } from "./add-server-schema";

export default function AddServerForm({ callback }: { callback?: () => void }) {
  const form = useForm<AddServerSchemaType>({
    resolver: zodResolver(AddServerSchema),
    defaultValues: {
      name: "",
      host: "",
      xmlrpcPort: 0,
      user: "",
      pass: "",
    },
  });

  async function onSubmit(values: AddServerSchemaType) {
    try {
      const { error } = await addServer(values);
      if (error) {
        throw new Error(error);
      }
      toast.success("Server successfully added");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to add server", {
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
          description="The name of the server."
          placeholder="Enter server name"
          isRequired
        />

        <FormElement
          name={"description"}
          label="Description"
          description="The description of the server."
          placeholder="Enter server description"
        />

        <FormElement
          name={"host"}
          label="Host"
          description="The host of the server."
          placeholder="Enter server host"
          isRequired
        />

        <FormElement
          name={"xmlrpcPort"}
          label="XMLRPC Port"
          description="The XMLRPC port of the server."
          placeholder="Enter server XMLRPC port"
          type="number"
          isRequired
        />

        <FormElement
          name={"user"}
          label="User"
          description="The XMLRPC user."
          placeholder="Enter user"
          isRequired
        />

        <FormElement
          name={"pass"}
          label="Password"
          description="The XMLRPC password."
          placeholder="Enter password"
          isRequired
        />

        <FormElement
          name={"fmUrl"}
          label="Filemanager url"
          description="The url of the filemanager."
          placeholder="Enter filemanager url"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Add Server
        </Button>
      </form>
    </Form>
  );
}
