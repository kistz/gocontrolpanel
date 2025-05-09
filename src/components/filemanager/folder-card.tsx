import { FileEntry } from "@/types/filemanager";

export default function FolderCard({ fileEntry }: { fileEntry: FileEntry }) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-2 border rounded-lg">
      <h1 className="text-lg font-bold">{fileEntry.name}</h1>
      <p className="text-sm text-muted-foreground">{fileEntry.size} bytes</p>
    </div>
  );
}
