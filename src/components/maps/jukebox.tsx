"use client";

import {
  addMapToJukebox,
  clearJukebox,
  getJukebox,
  setJukebox,
} from "@/actions/gbx/map";
import { createColumns as createJukeboxColumns } from "@/app/(gocontroller)/admin/server/[id]/maps/jukebox-columns";
import { createColumns as createMapColumns } from "@/app/(gocontroller)/admin/server/[id]/maps/server-maps-columns";
import { getErrorMessage } from "@/lib/utils";
import { JukeboxMap, Map } from "@/types/map";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DndList } from "../dnd/dnd-list";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

interface JukeboxProps {
  serverId: number;
  jukebox: JukeboxMap[];
  maps: Map[];
}

export default function Jukebox({ serverId, jukebox, maps }: JukeboxProps) {
  const [defaultJukebox, setDefaultJukebox] = useState<JukeboxMap[]>(
    jukebox || [],
  );
  const [jukeboxOrder, setJukeboxOrder] =
    useState<JukeboxMap[]>(defaultJukebox);

  useEffect(() => {
    const intervalIndex = setInterval(async () => {
      const jukebox = await getJukebox(serverId);

      if (jukebox[0]?.id !== jukeboxOrder[0]?.id) {
        setJukeboxOrder(jukebox);
        setDefaultJukebox(jukebox);
      }
    }, 10000);

    return () => clearInterval(intervalIndex);
  }, [jukeboxOrder, serverId]);

  async function saveJukebox() {
    try {
      await setJukebox(serverId, jukeboxOrder);
      setDefaultJukebox(jukeboxOrder);

      toast.success("Jukebox saved successfully");
    } catch (error) {
      toast.error("Error saving jukebox", {
        description: getErrorMessage(error),
      });
    }
  }

  async function onRemoveMap(map: JukeboxMap) {
    const newJukebox = jukeboxOrder.filter((m) => m.id !== map.id);
    setJukeboxOrder(newJukebox);
  }

  async function onAddMap(map: Map) {
    try {
      const newMap = await addMapToJukebox(serverId, map);
      setJukeboxOrder((prev) => [...prev, newMap]);
      setDefaultJukebox((prev) => [...prev, newMap]);
      toast.success("Map added to jukebox successfully");
    } catch (error) {
      toast.error("Error adding map to jukebox", {
        description: getErrorMessage(error),
      });
    }
  }

  async function onClearJukebox() {
    try {
      await clearJukebox(serverId);
      setJukeboxOrder([]);
      setDefaultJukebox([]);
      toast.success("Jukebox cleared successfully");
    } catch (error) {
      toast.error("Error clearing jukebox", {
        description: getErrorMessage(error),
      });
    }
  }

  const jukeboxColumns = createJukeboxColumns(onRemoveMap);
  const mapColumns = createMapColumns(onAddMap);

  return (
    <div className="flex flex-col gap-5">
      {jukeboxOrder.length === 0 ? (
        <p className="text-muted-foreground">No maps in jukebox.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <DndList
            columns={jukeboxColumns}
            data={jukeboxOrder}
            setData={setJukeboxOrder}
            serverId={serverId}
          />
          <div className="flex flex-row-reverse gap-2">
            <Button onClick={saveJukebox}>Save Jukebox</Button>

            <Button variant={"destructive"} onClick={onClearJukebox}>
              Clear Jukebox
            </Button>
          </div>
        </div>
      )}

      <DataTable data={maps} columns={mapColumns} limitHeight={0} pagination />
    </div>
  );
}
