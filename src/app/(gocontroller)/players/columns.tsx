"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePlayerById } from "@/database/player";
import { Player } from "@/types/player";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "nickName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Nickname"} />
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
      const [isPending, startTransition] = useTransition();
      const router = useRouter();

      const handleDelete = () => {
        startTransition(async () => {
          try {
            await deletePlayerById(player._id);
            router.refresh();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error deleting player", {
              description: errorMessage
            });
          }
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View player</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
            >
              Delete player
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
