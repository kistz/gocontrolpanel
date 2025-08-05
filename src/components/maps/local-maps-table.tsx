"use client";

import { addMapList } from "@/actions/gbx/map";
import { getLocalMaps } from "@/actions/gbx/server";
import { createColumns as createLocalMapColumns } from "@/app/(gocontroller)/server/[id]/maps/local-maps-columns";
import { getErrorMessage } from "@/lib/utils";
import { LocalMapInfo } from "@/types/map";
import { IconMapPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../modals/confirm-modal";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

export default function LocalMapsTable({ serverId }: { serverId: string }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [filter, setFilter] = useState<string>("");

  const [data, setData] = useState<LocalMapInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocalMaps() {
      const { data } = await getLocalMaps(serverId);
      setData(data);
      setIsLoading(false);
    }

    fetchLocalMaps();
  }, [serverId]);

  const columns = createLocalMapColumns(serverId);

  const getFilteredData = () => {
    return data.filter(
      (map) =>
        map.Path.toLowerCase().includes(filter.toLowerCase()) ||
        map.FileName.toLowerCase().includes(filter.toLowerCase()) ||
        map.Name.toLowerCase().includes(filter.toLowerCase()) ||
        map.AuthorNickname.toLowerCase().includes(filter.toLowerCase()),
    );
  };

  const addAllMaps = async () => {
    try {
      const filteredMaps = getFilteredData().map((map) => map.FileName);

      if (filteredMaps.length === 0) {
        toast.error("No maps found with the current filter");
        return;
      }

      const { data: res, error } = await addMapList(serverId, filteredMaps);
      if (error) {
        throw new Error(error);
      }

      toast.success(`${res} map(s) successfully added`);
    } catch (error) {
      toast.error("Error adding all maps", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      filter={true}
      pagination
      actions={
        <>
          <Button onClick={() => setIsConfirmOpen(true)}>
            <IconMapPlus />
            Add All Maps
          </Button>

          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={addAllMaps}
            title="Add all maps"
            description={`Are you sure you want to add ${
              getFilteredData().length
            } map(s)? This will add all the maps with the current filter applied.`}
            confirmText="Add"
            cancelText="Cancel"
            variant="default"
          />
        </>
      }
      globalFilter={filter}
      onGlobalFilterChange={setFilter}
    />
  );
}
