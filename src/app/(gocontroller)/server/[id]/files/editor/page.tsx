import { getFile } from "@/actions/filemanager";
import TextEditor from "@/components/filemanager/text-editor";
import { Button } from "@/components/ui/button";
import { arrayBufferToBase64, generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import Image from "next/image";
import Link from "next/link";

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

  if (data.type === "image") {
    return (
      <div>
        <Link
          href={`${generatePath(routes.servers.files, { id })}?path=${path.split("/").slice(0, -1).join("/")}`}
        >
          <Button variant="outline" className="absolute top-16 left-4">
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-center h-full">
          <Image
            src={`data:image/png;base64,${arrayBufferToBase64(data.value as ArrayBuffer)}`}
            alt={path.split("/").pop() || "Image"}
            fill
            className="object-contain static! max-h-[calc(100vh-8rem)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <TextEditor
        defaultText={data.value as string}
        path={path}
        serverId={id}
      />
    </div>
  );
}
