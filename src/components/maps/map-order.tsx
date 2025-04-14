"use client";
import { deleteRecordById } from "@/actions/database/record";
import { getErrorMessage } from "@/lib/utils";
import { Map, OrderMap } from "@/types/map";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";
import ConfirmDialog from "../confirm-dialog";
import { DndList, DndListColumn } from "../dnd/dnd-list";
import { Button } from "../ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function MapOrder({ mapList }: { mapList: Map[] }) {
  const [mapOrder, setMapOrder] = useState<OrderMap[]>(
    mapList.map((map) => ({
      ...map,
      id: map.uid,
    })),
  );

  const columns: DndListColumn<OrderMap>[] = [
    {
      id: "id",
      cell: () => <></>,
      visibility: false,
    },
    {
      id: "name",
      cell: ({ data }) => (
        <span
          className="overflow-hidden overflow-ellipsis whitespace-nowrap"
          dangerouslySetInnerHTML={{ __html: parseTmTags(data.name) }}
        />
      ),
    },
    {
      id: "authorNickname",
    },
    {
      id: "uid",
    },
    {
      id: "actions",
      cell: ({ data }) => {
        const [_, startTransition] = useTransition();
        const [isOpen, setIsOpen] = useState(false);
        const { data: session, status } = useSession();
        const isAdmin =
          status === "authenticated" && session.user.roles.includes("admin");

        const handleDelete = () => {
          startTransition(async () => {
            try {
              await deleteRecordById(data._id);
              toast.success("Record deleted successfully");
            } catch (error) {
              toast.error("Error deleting record", {
                description: getErrorMessage(error),
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

  return <DndList columns={columns} data={mapOrder} setData={setMapOrder} />;
}
