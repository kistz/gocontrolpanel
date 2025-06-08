import { withAuth } from "@/lib/auth";
import { getFileManager } from "@/lib/filemanager";
import { redirect } from "next/navigation";

export default async function FilesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ uuid: string }>;
}) {
  try {
    await withAuth(["admin"]);
  } catch {
    redirect("/");
  }

  const { uuid } = await params;

  try {
    const fileManager = await getFileManager(uuid);
    if (!fileManager?.health) {
      throw new Error("File Manager is not available");
    }

    return children;
  } catch {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">File Manager is not available</h1>
      </div>
    );
  }
}
