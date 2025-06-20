"use client";

import CreateInterfaceForm from "@/forms/server/interface/create-interface-form";
import { IconX } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";
import { Interfaces } from "@/lib/prisma/generated";

export default function CreateInterfaceModal({
  serverUuid,
  closeModal,
  onSubmit,
}: DefaultModalProps<void, Interfaces>) {
  if (!serverUuid) {
    throw new Error("serverUuid is required for CreateInterfaceModal");
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = (newInterface: Interfaces) => {
    closeModal?.();
    if (onSubmit) {
      onSubmit(newInterface);
    }
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Create Interface</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>

      <CreateInterfaceForm serverUuid={serverUuid} callback={handleSubmit} />
    </Card>
  );
}
