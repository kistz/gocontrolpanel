"use client";
import { addMapList, removeMapList } from "@/actions/gbx/map";
import { getErrorMessage } from "@/lib/utils";
import { Map, OrderMap } from "@/types/map";
import { useState } from "react";
import { toast } from "sonner";
import { DndList, DndListColumn } from "../dnd/dnd-list";
import { Button } from "../ui/button";

export default function MapOrder({
  mapList,
  serverId,
  createColumns,
}: {
  mapList: Map[];
  serverId: number;
  createColumns: (
    onRemoveMap: (map: OrderMap) => void,
  ) => DndListColumn<OrderMap>[];
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

  async function onRemoveMap(map: OrderMap) {
    const newMapOrder = mapOrder.filter((m) => m.uid !== map.uid);
    setMapOrder(newMapOrder);
    setDefaultMapList(newMapOrder);
  }

  const columns = createColumns(onRemoveMap);

  return (
    <div className="flex flex-col gap-3">
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
