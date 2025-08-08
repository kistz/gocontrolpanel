"use client";

import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import DatabaseForm from "./database-form";
import NetworkForm from "./network-form";
import ServerControllerForm from "./server-controller-form";
import ServerForm from "./server-form";
import {
  AdvancedServerSetupSchema,
  AdvancedServerSetupSchemaType,
} from "./server-setup-schema";
import Summary from "./summary";

type Steps = "server" | "serverController" | "database" | "network" | "summary";

export default function AdvancedServerSetupForm({
  projectId,
  locations,
  databases,
  serverTypes,
  images,
  networks,
  callback,
}: {
  projectId: string;
  locations: HetznerLocation[];
  databases: HetznerServer[];
  serverTypes: HetznerServerType[];
  images: HetznerImage[];
  networks: HetznerNetwork[];
  callback?: () => void;
}) {
  const [step, setStep] = useState<Steps>("server");

  const form = useForm<AdvancedServerSetupSchemaType>({
    resolver: zodResolver(AdvancedServerSetupSchema),
    mode: "onChange",
    defaultValues: {
      server: {
        location:
          locations.length > 0
            ? locations.find((loc) => loc.name === "fsn1")?.name ||
              locations[0]?.name
            : "",
        serverType:
          serverTypes.length > 0
            ? serverTypes
                .find((type) => type.name === "cpx11")
                ?.id.toString() || serverTypes[0]?.id.toString()
            : "",
        image:
          images.length > 0
            ? images
                .find((img) => img.name === "ubuntu-22.04")
                ?.id.toString() || images[0]?.id.toString()
            : "",
      },
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
          <Summary
            form={form}
            projectId={projectId}
            onBack={previousStep}
            callback={callback}
          />
        </TabsContent>
      </Form>
    </Tabs>
  );
}
