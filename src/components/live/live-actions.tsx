"use client";
import { triggerModeScriptEventArray } from "@/actions/gbx/game";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface LiveActionsProps {
  serverId: number;
  pauseAvailable: boolean;
  isPaused: boolean;
}

export default function LiveActions({
  serverId,
  pauseAvailable,
  isPaused,
}: LiveActionsProps) {
  const handlePause = async () => {
    try {
      const { error } = await triggerModeScriptEventArray(
        serverId,
        "Maniaplanet.Pause.SetActive",
        [isPaused ? "false" : "true"],
      );
      if (error) {
        throw new Error(error);
      }

      toast.success(`Game successfully ${isPaused ? "resumed" : "paused"}`);
    } catch (error) {
      toast.error(`Error while ${isPaused ? "resuming" : "pausing"} the game`, {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex gap-2">
      {pauseAvailable && (
        <Button variant={"outline"} onClick={handlePause}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
      )}
    </div>
  );
}
