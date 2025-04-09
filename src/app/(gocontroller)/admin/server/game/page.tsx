import { getMapList } from "@/actions/database/map";
import { getCurrentMapIndex } from "@/actions/gbx/map";
import MapCarousel from "@/components/maps/map-carousel";

export default async function ServerGamePage() {
  const mapList = await getMapList();
  const currentIndex = await getCurrentMapIndex();

  return (
    <div className="flex flex-col gap-4">
      <MapCarousel maps={mapList} startIndex={currentIndex} loop={true} className="max-w-max" />
    </div>
  );
}
