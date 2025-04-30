import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

interface EditPlayerModalProps extends DefaultModalProps {
  playerId: string;
}

export default function EditPlayerModal({
  playerId,
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
        className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <Card onClick={stopPropagation} className="p-6 gap-6">
          <h1 className="text-2xl font-bold">Edit Player {playerId}</h1>
          <p>Manage players here.</p>
        </Card>
      </div>
    )
  );
}
