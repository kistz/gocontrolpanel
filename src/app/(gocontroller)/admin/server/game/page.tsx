import { getMapList } from "@/actions/database/map";
import MapCarousel from "@/components/maps/map-carousel";

export default async function ServerGamePage() {
  const mapList = await getMapList();

  return (
    <div className="flex flex-col gap-4">
      <MapCarousel maps={mapList} loop={true} className="max-w-max" />
    </div>
  );
}
