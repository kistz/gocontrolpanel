"use client";

import TimeDisplay from "@/components/time-display";
import { Records } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { parseTmTags } from "tmtags";

export const createColumns = (rounds?: boolean): ColumnDef<Records>[] => {
  const columns: ColumnDef<Records>[] = [
    {
      accessorKey: "login",
      header: () => <span>Login</span>,
      cell: ({ row }) => (
        <span
          dangerouslySetInnerHTML={{ __html: parseTmTags(row.original.login) }}
        />
      ),
    },
    {
      accessorKey: "time",
      header: () => <span>Time</span>,
      cell: ({ row }) => <TimeDisplay time={row.original.time} />,
    },
    {
      accessorKey: "checkpoints",
      header: () => <span>Checkpoints</span>,
      cell: ({ row }) => (
        <div className="flex gap-2 max-w-32 truncate">
          {getList<number>(row.original.checkpoints).map((cp, i) => (
            <TimeDisplay key={i} time={cp} />
          ))}
        </div>
      ),
    },
  ];

  if (rounds) {
    columns.push({
      accessorKey: "round",
      header: () => <span>Round</span>,
    });
  }

  return columns;
};
