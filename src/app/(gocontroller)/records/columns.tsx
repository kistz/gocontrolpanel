"use client";

import { deleteRecordById } from "@/actions/record";
import ConfirmDialog from "@/components/confirm-dialog";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import TimeDisplay from "@/components/time-display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Record } from "@/types/record";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const createColumns = (refetch: () => void): ColumnDef<Record>[] => [
  {
    accessorKey: "login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Login"} />
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Time"} />
    ),
    cell: ({ row }) => <TimeDisplay time={row.getValue("time")} />,
  },
  {
    accessorKey: "mapUid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Map Uid"} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Driven"} />
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
      const record = row.original;
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);
      const { data: session, status } = useSession();
      const isAdmin =
        status === "authenticated" && session.user.roles.includes("admin");

      const handleDelete = () => {
        startTransition(async () => {
          try {
            await deleteRecordById(record._id);
            refetch();
            toast.success("Record deleted successfully");
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            toast.error("Error deleting record", {
              description: errorMessage,
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
              <DropdownMenuItem>View record</DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setIsOpen(true)}
                  >
                    Delete record
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleDelete}
            title="Delete record"
            description="Are you sure you want to delete this record?"
            confirmText="Delete"
            cancelText="Cancel"
          />
        </div>
      );
    },
  },
];
