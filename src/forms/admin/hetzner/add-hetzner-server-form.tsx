"use client";

import { createHetznerServer } from "@/actions/hetzner/servers";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AddHetznerServerSchema,
  AddHetznerServerSchemaType,
} from "./add-hetzner-server-schema";

export default function AddHetznerServerForm({
  projectId,
  callback,
}: {
  projectId: string;
  callback?: () => void;
}) {
  const form = useForm<AddHetznerServerSchemaType>({
    resolver: zodResolver(AddHetznerServerSchema),
  });

  async function onSubmit(values: AddHetznerServerSchemaType) {
    try {
      const { error } = await createHetznerServer(projectId, values);
      if (error) {
        throw new Error(error);
      }

      toast.success("Hetzner server successfully created");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to create Hetzner server", {
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
          label="Server Name"
          placeholder="Enter server name"
          isRequired
        />

        <FormElement
          name={"serverType"}
          label="Server Type"
          placeholder="Enter server type"
          isRequired
        />

        <FormElement
          name={"image"}
          label="Image"
          placeholder="Enter image name"
          isRequired
        />

        <FormElement
          name={"location"}
          label="Location"
          placeholder="Enter server location"
          isRequired
        />

        <FormElement
          name={"dediLogin"}
          label="Trackmania Server Login"
          placeholder="Enter server login"
          isRequired
        />

        <FormElement
          name={"dediPassword"}
          label="Trackmania Server Password"
          placeholder="Enter server password"
          type="password"
          isRequired
        />

        <FormElement
          name={"roomPassword"}
          label="Room Password"
          placeholder="Enter room password"
        />

        <FormElement
          name={"superAdminPassword"}
          label="Super Admin Password"
          placeholder="Enter super admin password"
          type="password"
        />

        <FormElement
          name={"adminPassword"}
          label="Admin Password"
          placeholder="Enter admin password"
          type="password"
        />

        <FormElement
          name={"userPassword"}
          label="User Password"
          placeholder="Enter user password"
          type="password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Add Server
        </Button>
      </form>
    </Form>
  );
}
