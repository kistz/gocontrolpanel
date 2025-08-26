"use client";

import CreateInterfaceForm from "@/forms/server/interface/create-interface-form";
import { Interfaces } from "@/lib/prisma/generated";
import { IconX } from "@tabler/icons-react";
import { Card } from "../../ui/card";
import { DefaultModalProps } from "../default-props";

export default function CreateInterfaceModal({
  serverId,
  closeModal,
  onSubmit,
}: DefaultModalProps<void, Interfaces>) {
  if (!serverId) {
    throw new Error("serverId is required for CreateInterfaceModal");
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = (newInterface: Interfaces) => {
    onSubmit?.(newInterface);
    closeModal?.();
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

      <CreateInterfaceForm serverId={serverId} callback={handleSubmit} />
    </Card>
  );
}
