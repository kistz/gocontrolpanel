"use client";
import EditRoleForm from "@/forms/admin/role/edit-role-form";
import { Roles } from "@/lib/prisma/generated";
import { IconX } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function EditRoleModal({
  closeModal,
  data,
}: DefaultModalProps<Roles>) {
  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Edit {data.name}</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>
      <EditRoleForm role={data} callback={closeModal} />
    </Card>
  );
}
