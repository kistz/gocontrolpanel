/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Maps } from "@/lib/prisma/generated";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { parseTmTags } from "tmtags";

export const createColumns = (
  onAddMap: (map: Maps) => void,
): ColumnDef<Maps>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Map Name"} />
    ),
    cell: ({ row }) => (
      <span
        dangerouslySetInnerHTML={{ __html: parseTmTags(row.getValue("name")) }}
      />
    ),
  },
  {
    accessorKey: "authorNickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Author"} />
    ),
    cell: ({ row }) => (
      <span
        dangerouslySetInnerHTML={{
          __html: parseTmTags(row.getValue("authorNickname")),
        }}
      />
    ),
  },
  {
    accessorKey: "uid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"UID"} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const map = row.original;
      const [_, startTransition] = useTransition();

      const handleAddMap = () => {
        startTransition(() => {
          onAddMap(map);
        });
      };

      return (
        <div className="flex justify-end">
          <Button onClick={handleAddMap}>Add to Jukebox</Button>
        </div>
      );
    },
  },
];
