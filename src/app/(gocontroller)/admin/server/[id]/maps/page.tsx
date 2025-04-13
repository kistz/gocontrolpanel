import { getLocalMaps } from "@/actions/gbx/server";

export default async function ServerMapsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  console.log(await getLocalMaps(id));
}
