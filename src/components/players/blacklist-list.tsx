"use client";

import { cleanBlacklist, getBlacklist } from "@/actions/gbx/player";
import { createColumns } from "@/app/(gocontroller)/server/[id]/players/blacklist-columns";
import BlacklistForm from "@/forms/server/players/blacklist-form";
import { getErrorMessage } from "@/lib/utils";
import { PlayerInfo } from "@/types/player";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../modals/confirm-modal";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

interface BlacklistListProps {
  serverId: number;
}

export default function BlacklistList({ serverId }: BlacklistListProps) {
  const [blacklist, setBlacklist] = useState<PlayerInfo[]>([]);

  const [confirmClearBlacklist, setConfirmClearBlacklist] = useState(false);

  useEffect(() => {
    refetch();
  }, [serverId]);

  const refetch = async () => {
    try {
      const { data, error } = await getBlacklist(serverId);
      if (error) {
        throw new Error(error);
      }

      setBlacklist(data);
    } catch (error) {
      toast.error("Error fetching blacklist", {
        description: getErrorMessage(error),
      });
    }
  };

  const columns = createColumns(serverId, refetch);

  const handleClearBlacklist = async () => {
    try {
      const { error } = await cleanBlacklist(serverId);
      if (error) {
        throw new Error(error);
      }

      toast.success("Blacklist cleared");
      refetch();
    } catch (error) {
      toast.error("Error clearing blacklist", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <>
      <div className="flex flex-row max-[800px]:flex-col justify-between gap-2">
        <BlacklistForm serverId={serverId} />
        <div>
          <Button
            variant="destructive"
            onClick={() => setConfirmClearBlacklist(true)}
          >
            Clear Blacklist
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={blacklist} pagination />

      <ConfirmModal
        title="Clear Blacklist"
        description="Are you sure you want to clear the blacklist?"
        isOpen={confirmClearBlacklist}
        onClose={() => setConfirmClearBlacklist(false)}
        onConfirm={handleClearBlacklist}
        confirmText="Clear"
        cancelText="Cancel"
      />
    </>
  );
}
