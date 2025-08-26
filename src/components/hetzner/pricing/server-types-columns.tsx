/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrencySymbol } from "@/lib/utils";
import { HetznerServerType } from "@/types/api/hetzner/servers";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export const createColumns = (
  location: string,
  currency: string,
): ColumnDef<HetznerServerType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name"} />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Description"} />
    ),
  },
  {
    accessorKey: "cores",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Cores"} />
    ),
  },
  {
    accessorKey: "memory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Memory"} />
    ),
    cell: ({ row }) => `${row.original.memory} GB`,
  },
  {
    accessorKey: "disk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Disk"} />
    ),
    cell: ({ row }) => `${row.original.disk} GB`,
  },
  {
    accessorKey: "prices.price_hourly",
    header: () => <span>Hourly Price</span>,
    cell: ({ row }) => {
      const price = row.original.prices.find(
        (price) => price.location === location,
      );
      return price
        ? `${getCurrencySymbol(currency)} ${parseFloat(price.price_hourly.gross)}`
        : "-";
    },
  },
  {
    accessorKey: "prices.price_monthly",
    header: () => <span>Monthly Price</span>,
    cell: ({ row }) => {
      const price = row.original.prices.find(
        (price) => price.location === location,
      );
      return price
        ? `${getCurrencySymbol(currency)} ${parseFloat(price.price_monthly.gross).toFixed(2)}`
        : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const serverType = row.original;
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
