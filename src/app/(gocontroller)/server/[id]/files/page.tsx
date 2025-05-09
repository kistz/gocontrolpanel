export default async function ServerFilesPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Server Files</h1>
      <p className="text-muted-foreground">
        Manage your server files and folders.
      </p>

      <div className="flex flex-col gap-4">{/* File manager component */}</div>
    </div>
  );
}