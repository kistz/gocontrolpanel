"use client";

import { deleteEntry, uploadFiles } from "@/actions/filemanager";
import { getErrorMessage, pathToBreadcrumbs } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../modals/confirm-modal";
import { Button } from "../ui/button";
import FilesBreadcrumbs from "./breadcrumbs";
import FileCard from "./file-card";
import FolderCard from "./folder-card";

interface BrowserProps {
  data: FileEntry[];
  serverId: number;
  path: string;
}

export default function Browser({ data, serverId, path }: BrowserProps) {
  const [folders, setFolders] = useState<FileEntry[]>(
    data.filter((fileEntry: FileEntry) => fileEntry.isDir),
  );
  const [files, setFiles] = useState<FileEntry[]>(
    data.filter((fileEntry: FileEntry) => !fileEntry.isDir),
  );

  const [selectedItem, setSelectedItem] = useState<FileEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setFolders(data.filter((fileEntry: FileEntry) => fileEntry.isDir));
    setFiles(data.filter((fileEntry: FileEntry) => !fileEntry.isDir));
  }, [data]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    uploadFilesCallback(files);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const uploadFilesCallback = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
        formData.append("paths[]", path);
      }

      try {
        const { data, error } = await uploadFiles(serverId, formData);
        if (error) {
          throw new Error(error);
        }

        setFolders((prev) => [
          ...prev.filter(
            (item: FileEntry) =>
              !data.some(
                (fileEntry: FileEntry) => fileEntry.path === item.path,
              ),
          ),
          ...data.filter((fileEntry: FileEntry) => fileEntry.isDir),
        ]);

        setFiles((prev) => [
          ...prev.filter(
            (item: FileEntry) =>
              !data.some(
                (fileEntry: FileEntry) => fileEntry.path === item.path,
              ),
          ),
          ...data.filter((fileEntry: FileEntry) => !fileEntry.isDir),
        ]);

        toast.success("Files uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload files", {
          description: getErrorMessage(error),
        });
      }
    },
    [serverId, path],
  );

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
        toast.success("Item deleted successfully", {
          description: `Deleted ${selectedItem.name}`,
        });
      } catch (error) {
        toast.error("Failed to delete item", {
          description: getErrorMessage(error),
        });
      }
    }
  };

  const handleSelect = (fileEntry: FileEntry) => {
    if (selectedItem?.path === fileEntry.path) {
      setSelectedItem(null);
    } else {
      setSelectedItem(fileEntry);
    }
  };

  return (
    <div className="flex flex-col gap-4" onDragOver={(e) => e.preventDefault()}>
      <div className="flex justify-between items-center w-full">
        <FilesBreadcrumbs
          crumbs={pathToBreadcrumbs(path).slice(1)}
          serverId={serverId}
        />

        <div className="flex items-center gap-2">
          {selectedItem && (
            <>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsDeleting(true)}
              >
                <IconTrash size={20} />
                <span className="sr-only">Delete</span>
              </Button>

              <ConfirmModal
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleDelete}
                title="Delete item"
                description={`Are you sure you want to delete ${selectedItem?.name}?`}
                confirmText="Delete"
                cancelText="Cancel"
              />
            </>
          )}

          <Button size="icon" onClick={triggerUpload}>
            <IconUpload />
            <span className="sr-only">Upload</span>
          </Button>

          <input
            ref={fileInputRef}
            multiple
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">No files found.</h1>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {folders.length > 0 && (
          <>
            <div className="flex w-full border-b-1">
              <h1 className="font-bold">Folders</h1>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-2">
              {folders.map((fileEntry: FileEntry) => (
                <FolderCard
                  key={fileEntry.path}
                  fileEntry={fileEntry}
                  serverId={serverId}
                  active={selectedItem?.path === fileEntry.path}
                  onClick={() => {
                    handleSelect(fileEntry);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {files.length > 0 && (
          <>
            <div className="flex w-full border-b-1">
              <h1 className="font-bold">Files</h1>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-2">
              {files.map((fileEntry: FileEntry) => (
                <FileCard
                  key={fileEntry.path}
                  fileEntry={fileEntry}
                  serverId={serverId}
                  active={selectedItem?.path === fileEntry.path}
                  onClick={() => {
                    handleSelect(fileEntry);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
