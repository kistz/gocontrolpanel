import { getRoute } from "@/actions/filemanager";
import FilesBreadcrumbs from "@/components/filemanager/breadcrumbs";
import FileCard from "@/components/filemanager/file-card";
import FolderCard from "@/components/filemanager/folder-card";
import { pathToBreadcrumbs } from "@/lib/utils";
import { FileEntry } from "@/types/filemanager";

export default async function ServerFilesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ path: string }>;
}) {
  const { id } = await params;
  const { path } = await searchParams;

  const { data, error } = await getRoute(id, path || "/UserData");

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
      <FilesBreadcrumbs
        crumbs={pathToBreadcrumbs(path).slice(1)}
        serverId={id}
      />

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
                  serverId={id}
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
                  serverId={id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
