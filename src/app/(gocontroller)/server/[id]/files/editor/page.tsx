import { getFile } from "@/actions/filemanager";
import TextEditor from "@/components/filemanager/text-editor";

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ path: string }>;
}) {
  const { id } = await params;
  const { path } = await searchParams;

  const { data, error } = await getFile(id, path || "/UserData");

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Failed to get file.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <TextEditor defaultText={data} path={path} serverId={id}/>
    </div>
  );
}
