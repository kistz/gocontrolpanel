"use client";

import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { UseFormReturn } from "react-hook-form";
import { ServerSetupSchemaType } from "./server-setup-schema";

export default function ServerControllerForm({
  form,
  onNext,
  onBack,
}: {
  form: UseFormReturn<ServerSetupSchemaType>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <form className="flex flex-col gap-4">
      <FormElement
        name="serverController.type"
        label="Controller"
        description="Select the server controller you want to use"
        className="min-w-32"
        isRequired
        type="select"
        options={[
          { value: "evosc", label: "EvoSC" },
          { value: "maniacontrol", label: "ManiaControl" },
          { value: "minicontrol", label: "MiniControl" },
          { value: "pyplanet", label: "PyPlanet" },
        ]}
      />

      {form.watch("serverController.type") === "maniacontrol" && (
        <ManiaControlSettingsForm />
      )}

      {form.watch("serverController.type") === "evosc" && <EvoSCSettingsForm />}

      {form.watch("serverController.type") === "minicontrol" && (
        <MiniControlSettingsForm />
      )}

      {form.watch("serverController.type") === "pyplanet" && (
        <PyPlanetSettingsForm />
      )}

      <div className="flex gap-2 justify-between">
        <Button className="flex-1 max-w-32" variant="outline" onClick={onBack}>
          <IconArrowNarrowLeft />
          Previous
        </Button>
        <Button className="flex-1 max-w-32" type="button" onClick={onNext}>
          Next
          <IconArrowNarrowRight />
        </Button>
      </div>
    </form>
  );
}

function ManiaControlSettingsForm() {
  return (
    <>
      <FormElement
        name="serverController.admins"
        label="Admins"
        description="List of admin usernames"
        isRequired
      />
    </>
  );
}

function EvoSCSettingsForm() {
  return <></>;
}

function MiniControlSettingsForm() {
  return (
    <>
      <FormElement
        name="serverController.admins"
        label="Admins"
        description="List of admin usernames"
        isRequired
      />
      <FormElement
        name="serverController.excludedPlugins"
        label="Excluded Plugins"
        description="List of plugins to exclude from MiniControl"
      />
      <FormElement
        name="serverController.contactInfo"
        label="Contact Info"
        description="Contact information so nadeo can reach you"
        isRequired
      />
      <FormElement
        name="serverController.identifier"
        label="Identifier"
        description="Trackmania API identifier"
        type="text"
      />
      <FormElement
        name="serverController.secret"
        label="Secret"
        description="Trackmania API secret"
        type="password"
      />
    </>
  );
}

function PyPlanetSettingsForm() {
  return <></>;
}
