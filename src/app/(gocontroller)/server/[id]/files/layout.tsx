import { withAuth } from "@/lib/auth";
import { getFileManager } from "@/lib/filemanager";

export default async function FilesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: number }>;
}) {
  await withAuth(["admin"]);

  const { id } = await params;

  const fileManager = await getFileManager(id);
  if (!fileManager.health) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">File Manager is not available</h1>
      </div>
    );
  }

  return children;
}
