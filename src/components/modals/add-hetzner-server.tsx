"use client";
import { createHetznerServer } from "@/actions/hetzner/servers";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function AddHetznerServerModal({
  closeModal,
  data,
}: DefaultModalProps<string>) {
  const router = useRouter();

  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    await createHetznerServer(data);
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

      <Button onClick={handleSubmit}>Test</Button>
    </Card>
  );
}
