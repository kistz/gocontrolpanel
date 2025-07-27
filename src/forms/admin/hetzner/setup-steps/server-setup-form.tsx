"use client";

import { getHetznerImages } from "@/actions/hetzner/images";
import { getHetznerLocations } from "@/actions/hetzner/locations";
import { getAllNetworks } from "@/actions/hetzner/networks";
import { getServerTypes } from "@/actions/hetzner/server-types";
import { getAllDatabases } from "@/actions/hetzner/servers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage } from "@/lib/utils";
import { HetznerLocation } from "@/types/api/hetzner/locations";
import { HetznerNetwork } from "@/types/api/hetzner/networks";
import {
  HetznerImage,
  HetznerServer,
  HetznerServerType,
} from "@/types/api/hetzner/servers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DatabaseForm from "./database-form";
import NetworkForm from "./network-form";
import ServerControllerForm from "./server-controller-form";
import ServerForm from "./server-form";
import {
  ServerSetupSchema,
  ServerSetupSchemaType,
} from "./server-setup-schema";
import Summary from "./summary";
import { Form } from "@/components/ui/form";

type Steps = "server" | "serverController" | "database" | "network" | "summary";

export default function ServerSetupForm({
  projectId,
  callback,
}: {
  projectId: string;
  callback?: () => void;
}) {
  const [databases, setDatabases] = useState<HetznerServer[]>([]);
  const [networks, setNetworks] = useState<HetznerNetwork[]>([]);
  const [locations, setLocations] = useState<HetznerLocation[]>([]);
  const [serverTypes, setServerTypes] = useState<HetznerServerType[]>([]);
  const [images, setImages] = useState<HetznerImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);

      const [
        databasesResult,
        locationsResult,
        serverTypesResult,
        imagesResult,
        networksResult,
      ] = await Promise.allSettled([
        getAllDatabases(projectId),
        getHetznerLocations(projectId),
        getServerTypes(projectId),
        getHetznerImages(projectId),
        getAllNetworks(projectId),
      ]);

      // Handle databases
      if (databasesResult.status === "fulfilled") {
        const { data, error } = databasesResult.value;
        if (!error) {
          setDatabases(data);
        } else {
          toast.error("Failed to fetch existing databases", {
            description: error,
          });
        }
      } else {
        toast.error("Failed to fetch existing databases", {
          description: getErrorMessage(databasesResult.reason),
        });
      }

      // Handle locations
      if (locationsResult.status === "fulfilled") {
        const { data, error } = locationsResult.value;
        if (!error) {
          setLocations(data);
          const defaultLocationName =
            data.find((loc) => loc.name === "fsn1")?.name ||
            data[0]?.name ||
            "";
          form.setValue("server.location", defaultLocationName);
        } else {
          toast.error("Failed to fetch locations", { description: error });
          setError("Failed to get locations: " + error);
        }
      } else {
        toast.error("Failed to fetch locations", {
          description: getErrorMessage(locationsResult.reason),
        });
      }

      // Handle server types
      if (serverTypesResult.status === "fulfilled") {
        const { data, error } = serverTypesResult.value;
        if (!error) {
          setServerTypes(data);
          const defaultServerType =
            data.find((st) => st.name === "cx22")?.id.toString() ||
            data[0]?.id.toString() ||
            "";
          form.setValue("server.serverType", defaultServerType);
        } else {
          toast.error("Failed to fetch server types", { description: error });
          setError("Failed to get server types: " + error);
        }
      } else {
        toast.error("Failed to fetch server types", {
          description: getErrorMessage(serverTypesResult.reason),
        });
      }

      // Handle images
      if (imagesResult.status === "fulfilled") {
        const { data, error } = imagesResult.value;
        if (!error) {
          setImages(data);
          const defaultImage =
            data.find((img) => img.name === "ubuntu-24.04")?.id.toString() ||
            data[0]?.id.toString() ||
            "";
          form.setValue("server.image", defaultImage);
        } else {
          toast.error("Failed to fetch images", { description: error });
          setError("Failed to get images: " + error);
        }
      } else {
        toast.error("Failed to fetch images", {
          description: getErrorMessage(imagesResult.reason),
        });
      }

      // Handle networks
      if (networksResult.status === "fulfilled") {
        const { data, error } = networksResult.value;
        if (!error) {
          setNetworks(data);
        } else {
          toast.error("Failed to fetch networks", { description: error });
          setError("Failed to get networks: " + error);
        }
      } else {
        toast.error("Failed to fetch networks", {
          description: getErrorMessage(networksResult.reason),
        });
      }

      setLoading(false);
    }

    fetch();
  }, []);

  const [step, setStep] = useState<Steps>("server");

  const form = useForm<ServerSetupSchemaType>({
    resolver: zodResolver(ServerSetupSchema),
    mode: "onChange",
    defaultValues: {
      server: {},
      serverController: undefined,
      database: undefined,
      network: undefined,
    },
  });

  const controllerSelected = form.watch("server.controller");

  useEffect(() => {
    if (!controllerSelected) {
      form.reset({
        ...form.getValues(),
        serverController: undefined,
        database: undefined,
        network: undefined,
      });
    }
  }, [controllerSelected]);

  const nextStep = async () => {
    if (step !== "summary") {
      const valid = await form.trigger(
        step as "server" | "serverController" | "database" | "network",
      );
      if (!valid) return;
    }

    switch (step) {
      case "server":
        setStep(controllerSelected ? "serverController" : "summary");
        break;
      case "serverController":
        setStep("database");
        break;
      case "database":
        setStep("network");
        break;
      case "network":
        setStep("summary");
        break;
    }
  };

  const previousStep = () => {
    switch (step) {
      case "serverController":
        setStep("server");
        break;
      case "database":
        setStep("serverController");
        break;
      case "network":
        setStep("database");
        break;
      case "summary":
        if (!controllerSelected) {
          setStep("server");
        } else {
          setStep("network");
        }
        break;
      default:
        setStep("server");
    }
  };

  if (loading) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return (
    <Tabs value={step} onValueChange={() => {}} className="w-full gap-3">
      <TabsList className="w-full">
        <TabsTrigger value="server" className="cursor-default">
          <span className="block sm:hidden">1</span>
          <span className="hidden sm:block">Server</span>
        </TabsTrigger>
        <TabsTrigger value="serverController" className="cursor-default">
          <span className="block sm:hidden">2</span>
          <span className="hidden sm:block">Controller</span>
        </TabsTrigger>
        <TabsTrigger value="database" className="cursor-default">
          <span className="block sm:hidden">3</span>
          <span className="hidden sm:block">Database</span>
        </TabsTrigger>
        <TabsTrigger value="network" className="cursor-default">
          <span className="block sm:hidden">4</span>
          <span className="hidden sm:block">Network</span>
        </TabsTrigger>
        <TabsTrigger value="summary" className="cursor-default">
          <span className="block sm:hidden">5</span>
          <span className="hidden sm:block">Summary</span>
        </TabsTrigger>
      </TabsList>

      <Form {...form}>
        <TabsContent value="server">
          <ServerForm
            form={form}
            onNext={nextStep}
            locations={locations}
            serverTypes={serverTypes}
            images={images}
          />
        </TabsContent>

        <TabsContent value="serverController">
          <ServerControllerForm
            form={form}
            onNext={nextStep}
            onBack={previousStep}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseForm
            form={form}
            onNext={nextStep}
            onBack={previousStep}
            databases={databases}
            serverTypes={serverTypes}
            images={images}
            locations={locations}
            serverController={form.watch("serverController.type")}
          />
        </TabsContent>

        <TabsContent value="network">
          <NetworkForm
            form={form}
            onNext={nextStep}
            onBack={previousStep}
            networks={networks}
            databases={databases}
            locations={locations}
          />
        </TabsContent>

        <TabsContent value="summary">
          <Summary form={form} projectId={projectId} onBack={previousStep} />
        </TabsContent>
      </Form>
    </Tabs>
  );
}
