"use client";

import { deletePlayerById } from "@/actions/database/player";
import ConfirmDialog from "@/components/confirm-dialog";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getErrorMessage } from "@/lib/utils";
import { Player } from "@/types/player";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";

export const createColumns = (refetch: () => void): ColumnDef<Player>[] => [
  {
    accessorKey: "nickName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Nickname"} />
    ),
    cell: ({ row }) => (
      <span
        dangerouslySetInnerHTML={{
          __html: parseTmTags(row.getValue("nickName")),
        }}
      />
    ),
  },
  {
    accessorKey: "login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Login"} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Joined"} />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original;
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);
      const { data: session, status } = useSession();
      const isAdmin =
        status === "authenticated" && session.user.roles.includes("admin");

      const handleDelete = () => {
        startTransition(async () => {
          try {
            await deletePlayerById(player._id);
            refetch();
            toast.success("Player deleted successfully");
          } catch (error) {
            toast.error("Error deleting player", {
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
              <DropdownMenuItem>View player</DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIsOpen(true)}
                  >
                    Delete player
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleDelete}
            title="Delete player"
            description={`Are you sure you want to delete ${player.nickName}?`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </div>
      );
    },
  },
];
