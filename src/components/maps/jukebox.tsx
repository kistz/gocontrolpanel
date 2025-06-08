"use client";

import {
  addMapToJukebox,
  clearJukebox,
  getJukebox,
  setJukebox,
} from "@/actions/gbx/map";
import { createColumns as createJukeboxColumns } from "@/app/(gocontroller)/server/[uuid]/maps/jukebox-columns";
import { createColumns as createMapColumns } from "@/app/(gocontroller)/server/[uuid]/maps/server-maps-columns";
import { Maps } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { JukeboxMap } from "@/types/map";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DndList } from "../dnd/dnd-list";
import DndListHeaders from "../dnd/dnd-list-headers";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

interface JukeboxProps {
  serverUuid: string;
  jukebox: JukeboxMap[];
  maps: Maps[];
}

export default function Jukebox({ serverUuid, jukebox, maps }: JukeboxProps) {
  const [defaultJukebox, setDefaultJukebox] = useState<JukeboxMap[]>(
    jukebox || [],
  );
  const [jukeboxOrder, setJukeboxOrder] =
    useState<JukeboxMap[]>(defaultJukebox);

  useEffect(() => {
    const intervalIndex = setInterval(async () => {
      const { data: jukebox } = await getJukebox(serverUuid);

      if (jukebox[0]?.id !== jukeboxOrder[0]?.id) {
        setJukeboxOrder(jukebox);
        setDefaultJukebox(jukebox);
      }
    }, 10000);

    return () => clearInterval(intervalIndex);
  }, [jukeboxOrder, serverUuid]);

  async function saveJukebox() {
    try {
      const { error } = await setJukebox(serverUuid, jukeboxOrder);
      if (error) {
        throw new Error(error);
      }
      setDefaultJukebox(jukeboxOrder);

      toast.success("Jukebox successfully saved");
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

  async function onAddMap(map: Maps) {
    try {
      const { data: newMap, error } = await addMapToJukebox(serverUuid, map);
      if (error) {
        throw new Error(error);
      }
      setJukeboxOrder((prev) => [...prev, newMap]);
      setDefaultJukebox((prev) => [...prev, newMap]);
      toast.success("Map successfully added to jukebox");
    } catch (error) {
      toast.error("Error adding map to jukebox", {
        description: getErrorMessage(error),
      });
    }
  }

  async function onClearJukebox() {
    try {
      const { error } = await clearJukebox(serverUuid);
      if (error) {
        throw new Error(error);
      }
      setJukeboxOrder([]);
      setDefaultJukebox([]);
      toast.success("Jukebox successfully cleared");
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
          <DndListHeaders columns={jukeboxColumns} />
          <DndList
            columns={jukeboxColumns}
            data={jukeboxOrder}
            setData={setJukeboxOrder}
            serverUuid={serverUuid}
          />
          <div className="flex flex-row-reverse gap-2">
            <Button onClick={saveJukebox}>Save Jukebox</Button>

            <Button variant={"destructive"} onClick={onClearJukebox}>
              Clear Jukebox
            </Button>
          </div>
        </div>
      )}

      <DataTable data={maps} columns={mapColumns} pagination />
    </div>
  );
}
