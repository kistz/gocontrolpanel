"use client";
import { editServer } from "@/actions/gbxconnector/servers";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { Server } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditServerSchema, EditServerSchemaType } from "./edit-server-schema";

export default function EditServerForm({
  server,
  callback,
}: {
  server: Server;
  callback?: () => void;
}) {
  const form = useForm<EditServerSchemaType>({
    resolver: zodResolver(EditServerSchema),
    defaultValues: {
      name: server.name,
      description: server.description,
      host: server.host,
      xmlrpcPort: server.xmlrpcPort,
      user: server.user,
      pass: server.pass,
      fmHost: server.fmHost,
      fmPort: server.fmPort,
    },
  });

  async function onSubmit(values: EditServerSchemaType) {
    try {
      const { error } = await editServer(server.id, values);
      if (error) {
        throw new Error(error);
      }
      toast.success("Server updated successfully");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update server", {
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
          control={form.control}
          name={"name"}
          label="Name"
          description="The name of the server."
          placeholder="Enter server name"
          error={form.formState.errors.name}
          isRequired
        />

        <FormElement
          control={form.control}
          name={"description"}
          label="Description"
          description="The description of the server."
          placeholder="Enter server description"
          error={form.formState.errors.description}
        />

        <FormElement
          control={form.control}
          name={"host"}
          label="Host"
          description="The host of the server."
          placeholder="Enter server host"
          error={form.formState.errors.host}
          isRequired
        />

        <FormElement
          control={form.control}
          name={"xmlrpcPort"}
          label="XMLRPC Port"
          description="The XMLRPC port of the server."
          placeholder="Enter server XMLRPC port"
          error={form.formState.errors.xmlrpcPort}
          type="number"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"user"}
          label="User"
          description="The XMLRPC user."
          placeholder="Enter user"
          error={form.formState.errors.user}
          isRequired
        />

        <FormElement
          control={form.control}
          name={"pass"}
          label="Password"
          description="The XMLRPC password."
          placeholder="Enter password"
          error={form.formState.errors.pass}
          isRequired
        />

        <FormElement
          control={form.control}
          name={"fmHost"}
          label="Filemanager Host"
          description="The host of the filemanager."
          placeholder="Enter filemanager host"
          error={form.formState.errors.fmHost}
        />

        <FormElement
          control={form.control}
          name={"fmPort"}
          label="Filemanager Port"
          description="The port of the filemanager."
          placeholder="Enter filemanager port"
          error={form.formState.errors.fmPort}
          type="number"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Edit Server
        </Button>
      </form>
    </Form>
  );
}
