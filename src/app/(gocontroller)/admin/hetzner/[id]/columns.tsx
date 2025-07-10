"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { HetznerServer } from "@/types/api/hetzner/servers";
import { ColumnDef } from "@tanstack/react-table";

export const createColumns = (): ColumnDef<HetznerServer>[] => [
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
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Created At"} />
    ),
  },
];
