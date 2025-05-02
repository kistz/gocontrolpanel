"use client";
import { addMapList, removeMapList } from "@/actions/gbx/map";
import { createColumns } from "@/app/(gocontroller)/server/[id]/maps/map-order-columns";
import { getDivergingList, getErrorMessage } from "@/lib/utils";
import { Map, OrderMap } from "@/types/map";
import { useState } from "react";
import { toast } from "sonner";
import { DndList } from "../dnd/dnd-list";
import { Button } from "../ui/button";
import DndListHeaders from "../dnd/dnd-list-headers";

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

  async function saveMapOrder() {
    try {
      const files = getDivergingList(defaultMapList, mapOrder, "uid")[1].map(
        (map) => map.fileName,
      );

      if (!files.length || files.length == 0) return;

      const { error: removeError } = await removeMapList(serverId, files);
      if (removeError) {
        throw new Error(removeError);
      }

      const { error: addError } = await addMapList(serverId, files);
      if (addError) {
        throw new Error(addError);
      }

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

  async function onRemoveMap(map: OrderMap) {
    const newMapOrder = mapOrder.filter((m) => m.uid !== map.uid);
    setMapOrder(newMapOrder);
    setDefaultMapList(newMapOrder);
  }

  const columns = createColumns(onRemoveMap);

  return (
    <div className="flex flex-col gap-3">
      <DndListHeaders columns={columns} />
      <DndList
        columns={columns}
        data={mapOrder}
        setData={setMapOrder}
        serverId={serverId}
      />
      <div className="flex flex-row-reverse gap-2">
        <Button onClick={saveMapOrder}>Save Order</Button>

        <Button variant="outline" onClick={resetMapOrder}>
          Reset Order
        </Button>
      </div>
    </div>
  );
}
