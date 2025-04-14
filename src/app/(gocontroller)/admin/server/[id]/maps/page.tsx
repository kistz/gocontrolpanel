import { getMapList } from "@/actions/database/map";
import MapOrder from "@/components/maps/map-order";

export default async function ServerMapsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const maps = await getMapList(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Server Settings</h1>
        <h4 className="text-muted-foreground">
          Manage general server settings.
        </h4>
      </div>
      <MapOrder mapList={maps} />
    </div>
  );
}
