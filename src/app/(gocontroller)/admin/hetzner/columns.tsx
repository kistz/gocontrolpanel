"use client";
import {
  deleteHetznerProject,
  HetznerProjectsWithUsers,
} from "@/actions/database/hetzner-projects";
import ConfirmModal from "@/components/modals/confirm-modal";
import EditProjectModal from "@/components/modals/edit-project";
import Modal from "@/components/modals/modal";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const createColumns = (
  refetch: () => void,
  data: {
    users: Users[];
  },
): ColumnDef<HetznerProjectsWithUsers>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
  },
  {
    accessorKey: "apiTokens",
    header: "API Tokens",
    cell: ({ row }) => (
      <span>{(row.getValue("apiTokens") as string[])?.length}</span>
    ),
  },
  {
    accessorKey: "_count.users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);

      const handleDelete = () => {
        startTransition(async () => {
          try {
            const { error } = await deleteHetznerProject(project.id);
            if (error) {
              throw new Error(error);
            }
            refetch();
            toast.success("Project successfully deleted");
          } catch (error) {
            toast.error("Error deleting project", {
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
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setIsOpen(true)}
              >
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleDelete}
            title="Delete project"
            description={`Are you sure you want to delete ${project.name}? Deleting a project does not delete the servers in it. You can manage those servers again when you create a new project with the same API Token.`}
            confirmText="Delete"
            cancelText="Cancel"
          />

          <Modal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            onClose={() => refetch()}
          >
            <EditProjectModal
              data={{
                project,
                users: data.users,
              }}
            />
          </Modal>
        </div>
      );
    },
  },
];
