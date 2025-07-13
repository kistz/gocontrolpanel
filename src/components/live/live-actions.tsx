"use client";
import { triggerModeScriptEventArray } from "@/actions/gbx/game";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface LiveActionsProps {
  id: string;
  pauseAvailable: boolean;
  isPaused: boolean;
  isWarmUp: boolean;
}

export default function LiveActions({
  id,
  pauseAvailable,
  isPaused,
  isWarmUp,
}: LiveActionsProps) {
  const handlePause = async () => {
    try {
      const { error } = await triggerModeScriptEventArray(
        id,
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

  const handleEndWarmUpRound = async () => {
    try {
      const { error } = await triggerModeScriptEventArray(
        id,
        "Trackmania.WarmUp.ForceStopRound",
        [],
      );
      if (error) {
        throw new Error(error);
      }

      toast.success("Warmup round successfully ended");
    } catch (error) {
      toast.error("Error while ending the warmup round", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleEndWarmUp = async () => {
    try {
      const { error } = await triggerModeScriptEventArray(
        id,
        "Trackmania.WarmUp.ForceStop",
        [],
      );
      if (error) {
        throw new Error(error);
      }

      toast.success("Warmup successfully ended");
    } catch (error) {
      toast.error("Error while ending the warmup", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {pauseAvailable && (
        <Button variant={"outline"} onClick={handlePause}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
      )}

      {isWarmUp && (
        <Button variant={"outline"} onClick={handleEndWarmUpRound}>
          End Warmup Round
        </Button>
      )}

      {isWarmUp && (
        <Button variant={"outline"} onClick={handleEndWarmUp}>
          End Warmup
        </Button>
      )}
    </div>
  );
}
