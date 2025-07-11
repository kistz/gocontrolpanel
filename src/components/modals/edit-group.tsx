"use client";
import { GroupsWithUsers } from "@/actions/database/groups";
import EditGroupForm from "@/forms/admin/group/edit-group-form";
import { Users } from "@/lib/prisma/generated";
import { Server } from "@/types/server";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function EditGroupModal({
  closeModal,
  data,
}: DefaultModalProps<{
  group: GroupsWithUsers;
  servers: Server[];
  users: Users[];
}>) {
  const { update } = useSession();

  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCallback = () => {
    closeModal?.();
    update();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Edit {data.group.name}</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>
      <EditGroupForm
        group={data.group}
        servers={data.servers}
        users={data.users}
        callback={handleCallback}
      />
    </Card>
  );
}
