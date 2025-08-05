"use client";
import { addMapList, removeMapList } from "@/actions/gbx/map";
import { createColumns } from "@/app/(gocontroller)/server/[id]/maps/map-order-columns";
import { Maps } from "@/lib/prisma/generated";
import { getDivergingList, getErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { DndList } from "../dnd/dnd-list";
import DndListHeaders from "../dnd/dnd-list-headers";
import ConfirmModal from "../modals/confirm-modal";
import { Button } from "../ui/button";

export default function MapOrder({
  mapList,
  serverId,
}: {
  mapList: Maps[];
  serverId: string;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [defaultMapList, setDefaultMapList] = useState<Maps[]>(mapList);
  const [mapOrder, setMapOrder] = useState<Maps[]>(defaultMapList);

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

      toast.success("Map order successfully saved");
    } catch (error) {
      toast.error("Error saving map order", {
        description: getErrorMessage(error),
      });
    }
  }

  function resetMapOrder() {
    setMapOrder(defaultMapList);
  }

  function onRemoveMap(map: Maps) {
    const newMapOrder = mapOrder.filter((m) => m.uid !== map.uid);
    setMapOrder(newMapOrder);
    setDefaultMapList(newMapOrder);
  }

  async function removeAllMaps() {
    try {
      const filesToRemove = mapOrder
        .map((m) => m.fileName)
        .splice(0, mapOrder.length - 1);

      const { error } = await removeMapList(serverId, filesToRemove);
      if (error) {
        throw new Error(error);
      }

      setMapOrder([mapOrder[mapOrder.length - 1]]);
      setDefaultMapList([mapOrder[mapOrder.length - 1]]);
      toast.success("All maps succesfully removed", {
        description:
          "Did not remove the last map to prevent the server from crashing.",
      });
    } catch (error) {
      toast.error("Error removing maps", {
        description: getErrorMessage(error),
      });
    }
  }

  const columns = createColumns(onRemoveMap);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <DndListHeaders columns={columns} />
        <DndList
          columns={columns}
          data={mapOrder}
          setData={setMapOrder}
          serverId={serverId}
        />
      </div>
      <div className="flex gap-2 ml-auto">
        <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
          Remove All Maps
        </Button>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={removeAllMaps}
          title="Remove all maps"
          description="Are you sure you want to remove all maps? This will not remove the last map to prevent the server from crashing."
          confirmText="Remove"
          cancelText="Cancel"
        />

        <Button variant="outline" onClick={resetMapOrder}>
          Reset Order
        </Button>
        <Button onClick={saveMapOrder}>Save Order</Button>
      </div>
    </div>
  );
}
