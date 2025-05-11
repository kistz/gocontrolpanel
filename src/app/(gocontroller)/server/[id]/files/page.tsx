import { getUserData } from "@/actions/filemanager";
import FileCard from "@/components/filemanager/file-card";
import FolderCard from "@/components/filemanager/folder-card";
import { FileEntry } from "@/types/filemanager";

export default async function ServerFilesPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const { data, error } = await getUserData(id);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Failed to get files.</h1>
      </div>
    );
  }

  const folders = data.filter((fileEntry: FileEntry) => fileEntry.isDir);
  const files = data.filter((fileEntry: FileEntry) => !fileEntry.isDir);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Server Files</h1>
        <h4 className="text-muted-foreground">
          Manage the files of the server.
        </h4>
      </div>

      <div className="flex flex-col gap-2">
        {folders.length > 0 && (
          <>
            <div className="flex w-full border-b-1">
              <h1 className="font-bold">Folders</h1>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-2">
              {folders.map((fileEntry: FileEntry) => (
                <FolderCard key={fileEntry.path} fileEntry={fileEntry} />
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
                <FileCard key={fileEntry.path} fileEntry={fileEntry} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
