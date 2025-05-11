"use client";
import { formatTimeToAgo } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconFolder } from "@tabler/icons-react";
import { redirect, useRouter } from "next/navigation";

export default function FolderCard({
  fileEntry,
  serverId,
}: {
  fileEntry: FileEntry;
  serverId: number;
}) {
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/server/${serverId}/files?path=${fileEntry.path}`);
  };

  return (
    <div
      className="flex w-full p-2 gap-3 border rounded-lg"
      onDoubleClick={handleDoubleClick}
    >
      <IconFolder className="h-full w-auto" />
      <div className="flex flex-col">
        <h1 className="text-md font-bold">{fileEntry.name}</h1>
        <p className="text-sm text-muted-foreground">-</p>
        <p className="text-sm text-muted-foreground">
          {fileEntry.lastModified
            ? formatTimeToAgo(fileEntry.lastModified)
            : "No last modified date"}
        </p>
      </div>
    </div>
  );
}
