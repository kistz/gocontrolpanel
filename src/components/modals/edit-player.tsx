"use client";
import EditPlayerForm from "@/forms/admin/edit-player-form";
import { Player } from "@/types/player";
import { IconX } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function EditPlayerModal({
  closeModal,
  data,
}: DefaultModalProps<Player>) {
  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card onClick={stopPropagation} className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Edit {data.nickName}</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>
      <EditPlayerForm player={data} callback={closeModal} />
    </Card>
  );
}
