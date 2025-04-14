import { getMapList } from "@/actions/database/map";
import MapOrder from "@/components/maps/map-order";

export default async function ServerMapsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const maps = await getMapList(id);

  return <MapOrder mapList={maps} />;
}
