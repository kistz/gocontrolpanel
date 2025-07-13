"use client";

import { cleanGuestlist, getGuestlist } from "@/actions/gbx/player";
import { createColumns } from "@/app/(gocontroller)/server/[id]/players/guestlist-columns";
import GuestlistForm from "@/forms/server/players/guestlist-form";
import { getErrorMessage } from "@/lib/utils";
import { PlayerInfo } from "@/types/player";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../modals/confirm-modal";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

interface GuestlistListProps {
  serverId: string;
}

export default function GuestlistList({ serverId }: GuestlistListProps) {
  const [guestlist, setGuestlist] = useState<PlayerInfo[]>([]);

  const [confirmClearGuestlist, setConfirmClearGuestlist] = useState(false);

  useEffect(() => {
    refetch();
  }, [serverId]);

  const refetch = async () => {
    try {
      const { data, error } = await getGuestlist(serverId);
      if (error) {
        throw new Error(error);
      }

      setGuestlist(data);
    } catch (error) {
      toast.error("Error fetching guest list", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleClearGuestlist = async () => {
    try {
      const { error } = await cleanGuestlist(serverId);
      if (error) {
        throw new Error(error);
      }

      toast.success("Guestlist cleared");
      refetch();
    } catch (error) {
      toast.error("Error clearing guestlist", {
        description: getErrorMessage(error),
      });
    }
  };

  const columns = createColumns(serverId, refetch);

  return (
    <>
      <div className="flex flex-row max-[800px]:flex-col justify-between gap-2">
        <GuestlistForm serverId={serverId} />
        <div>
          <Button
            variant="destructive"
            onClick={() => setConfirmClearGuestlist(true)}
          >
            Clear Guestlist
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={guestlist} pagination />

      <ConfirmModal
        title="Clear Guestlist"
        description="Are you sure you want to clear the guestlist?"
        isOpen={confirmClearGuestlist}
        onClose={() => setConfirmClearGuestlist(false)}
        onConfirm={handleClearGuestlist}
        confirmText="Clear"
        cancelText="Cancel"
      />
    </>
  );
}
