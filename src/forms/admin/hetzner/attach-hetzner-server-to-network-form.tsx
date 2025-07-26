"use client";

import { attachHetznerServerToNetwork } from "@/actions/hetzner/servers";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AttachHetznerServerToNetworkSchema,
  AttachHetznerServerToNetworkSchemaType,
} from "./attach-hetzner-server-to-network-schema";

export default function AttachHetznerServerToNetworkForm({
  projectId,
  serverId,
  callback,
}: {
  projectId: string;
  serverId: number;
  callback?: () => void;
}) {
  const form = useForm<AttachHetznerServerToNetworkSchemaType>({
    resolver: zodResolver(AttachHetznerServerToNetworkSchema),
  });

  async function onSubmit(values: AttachHetznerServerToNetworkSchemaType) {
    try {
      const { error } = await attachHetznerServerToNetwork(
        projectId,
        serverId,
        values,
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Hetzner server attached to network successfully");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to attach Hetzner server", {
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
          name="networkId"
          label="Network ID"
          placeholder="Enter network ID"
          type="number"
          isRequired
        />

        <FormElement
          name="ip"
          label="IP Address"
          placeholder="Enter IP address"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
