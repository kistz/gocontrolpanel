"use client";
import { deleteGroup, GroupsWithUsers } from "@/actions/database/groups";
import ConfirmModal from "@/components/modals/confirm-modal";
import EditGroupModal from "@/components/modals/edit-group";
import Modal from "@/components/modals/modal";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Servers, Users } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const createColumns = (
  refetch: () => void,
  data: {
    servers: Servers[];
    users: Users[];
  },
): ColumnDef<GroupsWithUsers>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Group Name"} />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Description"} />
    ),
  },
  {
    accessorKey: "_count.users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Members"} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original;
      const { update } = useSession();
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);

      const handleDelete = () => {
        startTransition(async () => {
          try {
            const { error } = await deleteGroup(group.id);
            if (error) {
              throw new Error(error);
            }
            refetch();
            update();
            toast.success("Group successfully deleted");
          } catch (error) {
            toast.error("Error deleting group", {
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
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit group
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setIsOpen(true)}
              >
                Delete group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleDelete}
            title="Delete group"
            description={`Are you sure you want to delete ${group.name}?`}
            confirmText="Delete"
            cancelText="Cancel"
          />

          <Modal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            onClose={() => refetch()}
          >
            <EditGroupModal
              data={{
                group,
                servers: data.servers,
                users: data.users,
              }}
            />
          </Modal>
        </div>
      );
    },
  },
];
