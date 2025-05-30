"use client";
import { uploadFiles } from "@/actions/filemanager";
import { getErrorMessage, pathToBreadcrumbs } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconUpload } from "@tabler/icons-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Actions from "./actions";
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

  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setFolders(data.filter((fileEntry: FileEntry) => fileEntry.isDir));
    setFiles(data.filter((fileEntry: FileEntry) => !fileEntry.isDir));
  }, [data]);

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

        toast.success("Files successfully uploaded");
      } catch (error) {
        toast.error("Failed to upload files", {
          description: getErrorMessage(error),
        });
      }
    },
    [serverId, path],
  );

  const handleSelect = (fileEntry: FileEntry) => {
    if (selectedItem?.path === fileEntry.path) {
      setSelectedItem(null);
    } else {
      setSelectedItem(fileEntry);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      setDragActive(false);
      e.preventDefault();
      const files = e.dataTransfer.files;

      if (files.length > 0) {
        await uploadFilesCallback(files);
      }
    },
    [uploadFilesCallback],
  );

  const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className="flex flex-col gap-4 h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {dragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center w-full h-full rounded-lg shadow-lg">
              <IconUpload size={92} />

              <h1 className="text-2xl font-bold mt-4">Drop files here</h1>
              <p className="text-lg">to upload</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center w-full">
        <FilesBreadcrumbs
          crumbs={pathToBreadcrumbs(path).slice(1)}
          serverId={serverId}
        />

        <Actions
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setFolders={setFolders}
          setFiles={setFiles}
          serverId={serverId}
          path={path}
          uploadFilesCallback={uploadFilesCallback}
        />
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
