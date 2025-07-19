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
import { Separator } from "@/components/ui/separator";
import { getErrorMessage, hasPermissionSync } from "@/lib/utils";
import { routePermissions } from "@/routes";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const createColumns = (
  refetch: () => void,
): ColumnDef<HetznerProjectsWithUsers>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
  },
  {
    accessorKey: "apiTokensCount",
    header: "API Tokens",
  },
  {
    accessorKey: "_count.hetznerProjectUsers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      const { data: session } = useSession();
      const router = useRouter();
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);

      const canView = hasPermissionSync(
        session,
        routePermissions.admin.hetzner.servers.view,
        project.id,
      );
      const canEdit = hasPermissionSync(
        session,
        routePermissions.admin.hetzner.edit,
        project.id,
      );
      const canDelete = hasPermissionSync(
        session,
        routePermissions.admin.hetzner.delete,
        project.id,
      );

      const handleDelete = () => {
        if (!canDelete) {
          toast.error("You do not have permission to delete this project.");
          return;
        }

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

      if (!canView && !canEdit && !canDelete) {
        return null;
      }

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
              {canView && (
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/hetzner/${project.id}`)}
                >
                  View Project
                </DropdownMenuItem>
              )}
              {canView && (canEdit || canDelete) && <Separator />}
              {canEdit && (
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  Edit Project
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setIsOpen(true)}
                >
                  Delete Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {canDelete && (
            <ConfirmModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onConfirm={handleDelete}
              title="Delete project"
              description={`Are you sure you want to delete ${project.name}? Deleting a project does not delete the servers in it. You can manage those servers again when you create a new project with the same API Token.`}
              confirmText="Delete"
              cancelText="Cancel"
            />
          )}

          {canEdit && (
            <Modal
              isOpen={isEditOpen}
              setIsOpen={setIsEditOpen}
              onClose={() => refetch()}
            >
              <EditProjectModal data={project} />
            </Modal>
          )}
        </div>
      );
    },
  },
];
