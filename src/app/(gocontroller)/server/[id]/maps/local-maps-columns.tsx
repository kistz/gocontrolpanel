"use client";
import { addMap } from "@/actions/gbx/map";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { LocalMapInfo } from "@/types/map";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";

export const createColumns = (serverId: string): ColumnDef<LocalMapInfo>[] => [
  {
    accessorKey: "Path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Folder"} />
    ),
  },
  {
    accessorKey: "FileName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"File Name"} />
    ),
    cell: ({ row }) => {
      const fileName = row.getValue("FileName") as string;
      return <span>{fileName?.split("/").pop()}</span>;
    },
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Map Name"} />
    ),
    cell: ({ row }) => (
      <span
        dangerouslySetInnerHTML={{ __html: parseTmTags(row.getValue("Name")) }}
      ></span>
    ),
  },
  {
    accessorKey: "AuthorNickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Author"} />
    ),
    cell: ({ row }) => (
      <span
        dangerouslySetInnerHTML={{
          __html: parseTmTags(row.getValue("AuthorNickname")),
        }}
      ></span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const localMap = row.original;
      const [_, startTransition] = useTransition();

      const handleAddMap = () => {
        startTransition(async () => {
          try {
            const { error } = await addMap(serverId, localMap.FileName);
            if (error) {
              throw new Error(error);
            }
            toast.success("Map successfully added");
          } catch (error) {
            toast.error("Error adding map", {
              description: getErrorMessage(error),
            });
          }
        });
      };

      return (
        <div className="flex justify-end">
          <Button onClick={handleAddMap}>Add Map</Button>
        </div>
      );
    },
  },
];
