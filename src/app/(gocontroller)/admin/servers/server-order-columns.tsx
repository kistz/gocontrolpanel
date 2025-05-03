"use client";

import { removeServer } from "@/actions/gbxconnector/servers";
import ConfirmDialog from "@/components/confirm-dialog";
import { DndListColumn } from "@/components/dnd/dnd-list";
import EditServerModal from "@/components/modals/edit-server";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getErrorMessage } from "@/lib/utils";
import { Server } from "@/types/server";
import { MoreHorizontal } from "lucide-react";
import { memo, useState, useTransition } from "react";
import { toast } from "sonner";

const ServerActionsCell = memo(function ServerActionsCell({
  server,
  refetch,
}: {
  server: Server;
  refetch: () => void;
}) {
  const [_, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);

  const handleRemove = () => {
    startTransition(async () => {
      try {
        const { error } = await removeServer(server.id);
        if (error) {
          throw new Error(error);
        }
        refetch();
        toast.success("Server successfully removed");
      } catch (error) {
        toast.error("Error removing server", {
          description: getErrorMessage(error),
        });
      }
    });
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditIsOpen(true)}>
            Edit server
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsOpen(true)}
          >
            Remove server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleRemove}
        title="Remove server"
        description="Are you sure you want to remove this server?"
        confirmText="Remove"
        cancelText="Cancel"
      />

      <Modal isOpen={editIsOpen} setIsOpen={setEditIsOpen} onClose={refetch}>
        <EditServerModal data={server} />
      </Modal>
    </div>
  );
});

export const createColumns = (
  refetch: () => void,
): DndListColumn<Server>[] => [
  {
    id: "id",
    cell: () => <></>,
    visibility: false,
  },
  {
    id: "name",
    cell: ({ data }) => (
      <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
        {data.name}
      </span>
    ),
  },
  {
    id: "description",
    cell: ({ data }) => (
      <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
        {data.description}
      </span>
    ),
  },
  {
    id: "host",
  },
  {
    id: "xmlrpcPort",
  },
  {
    id: "actions",
    cell: ({ data }) => (
      <ServerActionsCell server={data} refetch={refetch} />
    ),
  },
];
