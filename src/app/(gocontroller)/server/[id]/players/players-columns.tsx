"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayerInfo } from "@/types/player";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { parseTmTags } from "tmtags";

export const createColumns = (): ColumnDef<PlayerInfo>[] => [
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
    accessorKey: "teamId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Team"} />
    ),
  },
  {
    accessorKey: "spectatorStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Spectator Status"} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original;
      const [isOpen, setIsOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);

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
                Edit player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
