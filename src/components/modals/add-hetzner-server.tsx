"use client";
import AddHetznerServerForm from "@/forms/admin/hetzner/add-hetzner-server-form";
import { HetznerLocation } from "@/types/api/hetzner/locations";
import { HetznerImage, HetznerServerType } from "@/types/api/hetzner/servers";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function AddHetznerServerModal({
  closeModal,
  data,
}: DefaultModalProps<{
  projectId: string;
  serverTypes: HetznerServerType[];
  images: HetznerImage[];
  locations: HetznerLocation[];
}>) {
  const router = useRouter();

  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    closeModal?.();
    router.refresh();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Server</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>

      <AddHetznerServerForm
        projectId={data.projectId}
        serverTypes={data.serverTypes}
        images={data.images}
        locations={data.locations}
        callback={handleSubmit}
      />
    </Card>
  );
}
