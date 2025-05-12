"use client";

import { deleteEntry } from "@/actions/filemanager";
import { getErrorMessage, pathToBreadcrumbs } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
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
      } catch (error) {
        toast.error("Failed to delete item", {
          description: getErrorMessage(error),
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <FilesBreadcrumbs
          crumbs={pathToBreadcrumbs(path).slice(1)}
          serverId={serverId}
        />

        {selectedItem && (
          <div className="flex items-center gap-2">
            <IconTrash
              size={20}
              color="#9d4042"
              className="cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        )}
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
                  onClick={() => {
                    setSelectedItem(fileEntry);
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
                  onClick={() => {
                    setSelectedItem(fileEntry);
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
