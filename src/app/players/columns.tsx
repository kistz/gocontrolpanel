"use client";

import { Player } from "@/types/player";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "nickName",
    header: "Nickname",
  },
  {
    accessorKey: "login",
    header: "Login",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => console.log(`Edit ${player.nickName}`)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => console.log(`Delete ${player.nickName}`)}
          >
            Delete
          </button>
        </div>
      );
    }
  }
]