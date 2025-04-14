"use client";
import { deleteRecordById } from "@/actions/database/record";
import { addMapList, removeMapList } from "@/actions/gbx/map";
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
];

export default function MapOrder({
  mapList,
  serverId,
}: {
  mapList: Map[];
  serverId: number;
}) {
  const [defaultMapList, setDefaultMapList] = useState<Map[]>(mapList);
  const [mapOrder, setMapOrder] = useState<OrderMap[]>(
    defaultMapList.map((map) => ({
      ...map,
      id: map.uid,
    })),
  );

  function getDivergingMaps() {
    const minLength = Math.min(defaultMapList.length, mapOrder.length);
    let divergenceIndex = minLength;

    for (let i = 0; i < minLength; i++) {
      if (defaultMapList[i].uid !== mapOrder[i].uid) {
        divergenceIndex = i;
        break;
      }
    }

    return mapOrder.slice(divergenceIndex).map((map) => map.fileName);
  }

  async function saveMapOrder() {
    try {
      const files = getDivergingMaps();
      if (!files.length || files.length == 0) return;

      await removeMapList(serverId, files);

      await addMapList(serverId, files);

      setDefaultMapList(mapOrder);

      toast.success("Map order saved successfully");
    } catch (error) {
      toast.error("Error saving map order", {
        description: getErrorMessage(error),
      });
    }
  }

  async function resetMapOrder() {
    setMapOrder(
      defaultMapList.map((map) => ({
        ...map,
        id: map.uid,
      })),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <DndList columns={columns} data={mapOrder} setData={setMapOrder} />
      <div className="flex flex-row-reverse gap-2">
        <Button onClick={saveMapOrder}>Save Order</Button>

        <Button variant="outline" onClick={resetMapOrder}>
          Reset Order
        </Button>
      </div>
    </div>
  );
}
