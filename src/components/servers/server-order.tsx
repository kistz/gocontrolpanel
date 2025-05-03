"use client";
import { getServers, orderServers } from "@/actions/gbxconnector/servers";
import { createColumns } from "@/app/(gocontroller)/admin/servers/server-order-columns";
import DndListHeaders from "@/components/dnd/dnd-list-headers";
import { getErrorMessage } from "@/lib/utils";
import { Server } from "@/types/server";
import { useState } from "react";
import { toast } from "sonner";
import { DndList } from "../dnd/dnd-list";
import { Button } from "../ui/button";

export default function ServerOrder({ servers }: { servers: Server[] }) {
  const [defaultServers, setDefaultServers] = useState<Server[]>(servers);
  const [serverOrder, setServerOrder] = useState<Server[]>(servers);

  async function saveServerOrder() {
    try {
      // Update order
      const { data, error } = await orderServers(serverOrder);
      if (error) {
        throw new Error(error);
      }

      setDefaultServers(data);
      setServerOrder(data);

      toast.success("Server order saved successfully");
    } catch (error) {
      toast.error("Error saving server order", {
        description: getErrorMessage(error),
      });
    }
  }

  async function resetServerOrder() {
    setServerOrder(defaultServers);
  }

  async function refetchServers() {
    const updatedServers = await getServers();
    const updatedServerOrder = serverOrder.map((server) => {
      const updatedServer = updatedServers.find((s) => s.id === server.id);
      return updatedServer ? { ...server, ...updatedServer } : server;
    });
    setServerOrder(updatedServerOrder);
  }

  async function onRemoveServer(server: Server) {
    const newServerOrder = serverOrder.filter((m) => m.id !== server.id);
    setServerOrder(newServerOrder);
    setDefaultServers(newServerOrder);
  }

  const columns = createColumns(onRemoveServer, refetchServers);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <DndListHeaders columns={columns} />
        <DndList
          columns={columns}
          data={serverOrder}
          setData={setServerOrder}
        />
      </div>
      <div className="flex flex-row-reverse gap-2">
        <Button onClick={saveServerOrder}>Save Order</Button>

        <Button variant="outline" onClick={resetServerOrder}>
          Reset Order
        </Button>
      </div>
    </div>
  );
}
