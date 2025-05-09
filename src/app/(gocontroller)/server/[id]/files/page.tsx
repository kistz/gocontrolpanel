import { getUserData } from "@/actions/filemanager";

export default async function ServerFilesPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const { data: userData, error: userDataError } = await getUserData(id);

  if (userDataError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Failed to get files.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Server Files</h1>
        <h4 className="text-muted-foreground">
          Manage the files of the server.
        </h4>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex w-full border-b-2">
          <h1 className="text-lg font-bold">Folders</h1>
        </div>
        <div className="flex gap-2"></div>
      </div>
    </div>
  );
}
