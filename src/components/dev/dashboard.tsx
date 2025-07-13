"use client";
import { connectFakePlayer } from "@/actions/gbx/player";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface DevDashboardProps {
  id: string;
}

export default function DevDashboard({ id }: DevDashboardProps) {
  const handleAddPlayer = async () => {
    try {
      const { error } = await connectFakePlayer(id);
      if (error) {
        throw new Error(error);
      }

      toast.success("Fake player successfully connected");
    } catch (error) {
      toast.error("Error connecting fake player", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dev Dashboard</h1>
      <Button variant="outline" onClick={handleAddPlayer}>
        Add Fake Player
      </Button>
    </div>
  );
}
