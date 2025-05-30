"use client";
import { deleteEntry } from "@/actions/filemanager";
import { getErrorMessage } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../modals/confirm-modal";
import { Button } from "../ui/button";

interface ActionsProps {
  selectedItem: FileEntry | null;
  setSelectedItem: Dispatch<SetStateAction<FileEntry | null>>;
  setFolders: Dispatch<SetStateAction<FileEntry[]>>;
  setFiles: Dispatch<SetStateAction<FileEntry[]>>;
  serverId: number;
  uploadFilesCallback: (files: FileList | null) => void;
}

export default function Actions({
  selectedItem,
  setSelectedItem,
  setFolders,
  setFiles,
  serverId,
  uploadFilesCallback,
}: ActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    uploadFilesCallback(files);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        const { error } = await deleteEntry(serverId, selectedItem.path);
        if (error) {
          throw new Error(error);
        }

        setFolders((prev) =>
          prev.filter((folder) => folder.path !== selectedItem.path),
        );

        setFiles((prev) =>
          prev.filter((file) => file.path !== selectedItem.path),
        );

        setSelectedItem(null);
        toast.success("Item successfully deleted", {
          description: `Deleted ${selectedItem.name}`,
        });
      } catch (error) {
        toast.error("Failed to delete item", {
          description: getErrorMessage(error),
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {selectedItem && (
        <>
          <Button
            variant="destructive"
            onClick={() => setIsDeleting(true)}
          >
            <IconTrash size={20} />
            <span className="max-lg:sr-only">Delete</span>
          </Button>

          <ConfirmModal
            isOpen={isDeleting}
            onConfirm={handleDelete}
            onClose={() => setIsDeleting(false)}
            title="Delete item"
            description={`Are you sure you want to delete ${selectedItem?.name}?`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}

      <Button variant={"outline"}>
        <IconPlus />
        <span>Folder</span>
      </Button>

      <Button variant={"outline"}>
        <IconPlus />
        <span>File</span>
      </Button>

      <Button onClick={triggerUpload}>
        <IconUpload />
        <span className="max-lg:sr-only">Upload</span>
      </Button>

      <input
        ref={fileInputRef}
        multiple
        type="file"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
