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
import { useEffect, useState } from "react";
import { HetznerImage, HetznerServerType } from "@/types/api/hetzner/servers";
import { getServerTypes } from "@/actions/hetzner/server-types";
import { getHetznerImages } from "@/actions/hetzner/images";
import { HetznerLocation } from "@/types/api/hetzner/locations";
import { getHetznerLocations } from "@/actions/hetzner/locations";

export default function AddHetznerServerForm({
  projectId,
  callback,
}: {
  projectId: string;
  callback?: () => void;
}) {
  const [serverTypes, setServerTypes] = useState<HetznerServerType[]>([]);
  const [images, setImages] = useState<HetznerImage[]>([]);
  const [locations, setLocations] = useState<HetznerLocation[]>([]);

  useEffect(() => {
    const fetchServerTypes = async () => {
      try {
        const { data, error } = await getServerTypes(projectId);
        if (error) {
          throw new Error(error);
        }
        setServerTypes(data);
      } catch (error) {
        toast.error("Failed to fetch server types", {
          description: getErrorMessage(error),
        });
      }
    }

    const fetchImages = async () => {
      try {
        const { data, error } = await getHetznerImages(projectId);
        if (error) {
          throw new Error(error);
        }
        setImages(data);
      } catch (error) {
        toast.error("Failed to fetch images", {
          description: getErrorMessage(error),
        });
      }
    };

    const fetchLocations = async () => {
      try {
        const { data, error } = await getHetznerLocations(projectId);
        if (error) {
          throw new Error(error);
        }
        setLocations(data);
      } catch (error) {
        toast.error("Failed to fetch locations", {
          description: getErrorMessage(error),
        });
      }
    };

    fetchServerTypes();
    fetchImages();
    fetchLocations();
  }, []);

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
          disabled={form.formState.isSubmitting}
        >
          Add Server
        </Button>
      </form>
    </Form>
  );
}
