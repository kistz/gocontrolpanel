import AddServerForm from "@/forms/admin/add-server-form";
import { IconX } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { DefaultModalProps } from "./default-props";

export default function AddServerModal({ setIsOpen }: DefaultModalProps<void>) {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card onClick={stopPropagation} className="p-6 gap-6 min-w-[400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Server</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={() => setIsOpen(false)}
        />
      </div>

      <AddServerForm callback={() => setIsOpen(false)} />
    </Card>
  );
}
