"use client";
import AddProjectForm from "@/forms/admin/hetzner/add-project-form";
import { Users } from "@/lib/prisma/generated";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function AddProjectModal({
  closeModal,
  data,
}: DefaultModalProps<{
  users: Users[];
}>) {
  const router = useRouter();
  const { update } = useSession();

  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCallback = () => {
    closeModal?.();
    update();
    router.refresh();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Project</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>
      <AddProjectForm users={data.users} callback={handleCallback} />
    </Card>
  );
}
