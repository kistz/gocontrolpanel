"use client";
import EditPlayerForm from "@/forms/admin/edit-player-form";
import { Player } from "@/types/player";
import { IconX } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

interface EditPlayerModalProps extends DefaultModalProps {
  player: Player;
}

export default function EditPlayerModal({
  player,
  isOpen,
  setIsOpen,
}: EditPlayerModalProps) {
  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 z-[9998] flex h-screen w-screen items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <Card onClick={stopPropagation} className="p-6 gap-6 min-w-[400px]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Edit {player.nickName}</h1>
            <IconX
              className="h-6 w-6 cursor-pointer text-muted-foreground"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <EditPlayerForm player={player} callback={() => setIsOpen(false)} />
        </Card>
      </div>
    )
  );
}
