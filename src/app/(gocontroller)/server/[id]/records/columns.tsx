/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { MatchesWithMapAndRecords } from "@/actions/database/matches";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { parseTmTags } from "tmtags";

export const createColumns = (): ColumnDef<MatchesWithMapAndRecords>[] => [
  {
    accessorKey: "map.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Map"} />
    ),
    cell: ({ row }) => (
      <span
        className="truncate"
        dangerouslySetInnerHTML={{
          __html: parseTmTags(row.original.map.name),
        }}
      />
    ),
  },
  {
    accessorKey: "mode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Mode"} />
    ),
  },
  {
    accessorKey: "_count.records",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Records"} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Created At"} />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <span>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const match = row.original;
      const { data: session, update } = useSession();
      const [_, startTransition] = useTransition();
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"></DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
