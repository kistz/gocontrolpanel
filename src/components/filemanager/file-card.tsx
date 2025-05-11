"use client";
import { formatBytes, formatTimeToAgo } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";
import { IconFile } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function FileCard({
  fileEntry,
  serverId,
}: {
  fileEntry: FileEntry;
  serverId: number;
}) {
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/server/${serverId}/files/editor?path=${fileEntry.path}`);
  };

  return (
    <div
      className="flex w-full p-2 gap-2 border rounded-lg items-center cursor-pointer select-none"
      onDoubleClick={handleDoubleClick}
    >
      <IconFile size={48} className="min-w-12" />
      <div className="flex flex-col min-w-0">
        <h1 className="text-md font-bold truncate">{fileEntry.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatBytes(fileEntry.size || 0, 2)}
        </p>
        <p className="text-sm text-muted-foreground">
          {fileEntry.lastModified
            ? formatTimeToAgo(fileEntry.lastModified)
            : "No last modified date"}
        </p>
      </div>
    </div>
  );
}
