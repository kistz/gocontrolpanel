"use client";

import { deleteHetznerServer } from "@/actions/hetzner/servers";
import ConfirmModal from "@/components/modals/confirm-modal";
import HetznerServerDetailsModal from "@/components/modals/hetzner-server-details";
import Modal from "@/components/modals/modal";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage } from "@/lib/utils";
import { HetznerServer } from "@/types/api/hetzner/servers";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const createColumns = (
  refetch: () => void,
  data: {
    projectId: string;
  },
): ColumnDef<HetznerServer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Server Name"} />
    ),
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
  },
  {
    accessorKey: "public_net.ipv4.ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"IP Address"} />
    ),
  },
  {
    accessorKey: "server_type.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Server Type"} />
    ),
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Created At"} />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created);
      return <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original;
      const [_, startTransition] = useTransition();
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const [isViewOpen, setIsViewOpen] = useState(false);

      const handleDelete = () => {
        startTransition(async () => {
          try {
            const { error } = await deleteHetznerServer(
              data.projectId,
              server.id,
            );
            if (error) {
              throw new Error(error);
            }
            refetch();
            toast.success("Server successfully deleted");
          } catch (error) {
            toast.error("Error deleting server", {
              description: getErrorMessage(error),
            });
          }
        });
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
                View Details
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete server"
            description={`Are you sure you want to delete ${server.name}?`}
            confirmText="Delete"
            cancelText="Cancel"
          />

          <Modal isOpen={isViewOpen} setIsOpen={setIsViewOpen}>
            <HetznerServerDetailsModal
              data={{
                server,
              }}
            />
          </Modal>
        </div>
      );
    },
  },
];
