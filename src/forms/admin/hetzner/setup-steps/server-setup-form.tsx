"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodTypeAny } from "zod";
import ServerControllerForm from "./server-controller-form";
import ServerForm from "./server-form";
import {
  ControllerStepSchema,
  DatabaseStepSchema,
  NetworkStepSchema,
  ServerSetupSchema,
  ServerSetupSchemaType,
  ServerStepSchema,
} from "./server-setup-schema";

type Steps = "server" | "controller" | "database" | "network" | "summary";
const steps: Steps[] = [
  "server",
  "controller",
  "database",
  "network",
  "summary",
];

export default function ServerSetupForm({
  projectId,
  callback,
}: {
  projectId: string;
  callback?: () => void;
}) {
  const [step, setStep] = useState<Steps>("server");

  const schemaByStep: Record<Steps, ZodTypeAny> = {
    server: ServerStepSchema,
    controller: ControllerStepSchema,
    database: DatabaseStepSchema,
    network: NetworkStepSchema,
    summary: ServerSetupSchema,
  };

  const currentSchema = useMemo(() => schemaByStep[step], [step]);

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onChange",
    defaultValues: {
      server: {},
      serverController: undefined,
      database: undefined,
      network: undefined,
    },
  });

  async function onSubmit(values: ServerSetupSchemaType) {
    try {
      // Here you would typically call an API to submit the form data
      // For example:
      // const response = await submitServerSetup(projectId, values);
      // if (response.error) throw new Error(response.error);

      toast.success("Server setup successfully completed");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to set up server", {
        description: getErrorMessage(error),
      });
    }
  }

  const controllerSelected = form.watch("server.controller");
  const isValid = form.formState.isValid;

  const nextStep = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    switch (step) {
      case "server":
        setStep(controllerSelected ? "controller" : "summary");
        break;
      case "controller":
        setStep("database");
        break;
      case "database":
        setStep("network");
        break;
      case "network":
        setStep("summary");
        break;
      case "summary":
        onSubmit(form.getValues() as ServerSetupSchemaType);
        break;
    }
  };

  const previousStep = () => {
    switch (step) {
      case "controller":
        setStep("server");
        break;
      case "database":
        setStep("controller");
        break;
      case "network":
        setStep("database");
        break;
      case "summary":
        setStep("network");
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
        <TabsTrigger
          value="controller"
          disabled={!controllerSelected}
          className="cursor-default"
        >
          <span className="block sm:hidden">2</span>
          <span className="hidden sm:block">Controller</span>
        </TabsTrigger>
        <TabsTrigger
          value="database"
          disabled={!controllerSelected}
          className="cursor-default"
        >
          <span className="block sm:hidden">3</span>
          <span className="hidden sm:block">Database</span>
        </TabsTrigger>
        <TabsTrigger
          value="network"
          disabled={!controllerSelected}
          className="cursor-default"
        >
          <span className="block sm:hidden">4</span>
          <span className="hidden sm:block">Network</span>
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          disabled={!isValid}
          className="cursor-default"
        >
          <span className="block sm:hidden">5</span>
          <span className="hidden sm:block">Summary</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="server">
        <ServerForm form={form} onNext={nextStep} projectId={projectId} />
      </TabsContent>

      <TabsContent value="controller">
        <ServerControllerForm
          form={form}
          onNext={nextStep}
          onBack={previousStep}
          projectId={projectId}
        />
      </TabsContent>
    </Tabs>
  );
}
