import { Card } from "@/components/ui/card";
import { Map } from "@/types/map";
import { IconPhoto, IconUser } from "@tabler/icons-react";
import { parseTmTags } from "tmtags";
import MapCardActions from "./map-card-actions";

interface MapCardProps {
  map: Map;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <Card className="flex flex-col flex-1 p-0 gap-0">
      <div className="relative">
        {map.thumbnailUrl ? (
          <img
            loading="lazy"
            src={map.thumbnailUrl}
            alt={map.name}
            className="w-full rounded-t-lg h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 rounded-t-lg flex items-center justify-center">
            <IconPhoto className="text-gray-500" size={48} />
          </div>
        )}
        <div className="flex items-center space-x-2 justify-between absolute bottom-0 left-0 right-0 bg-white/20 p-2 backdrop-blur-sm dark:bg-black/40">
          <h3
            className="overflow-hidden overflow-ellipsis text-nowrap text-lg font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: parseTmTags(map.name) }}
          ></h3>

          <div className="flex items-center gap-2">
            <IconUser className="!size-5 flex-shrink-0" />
            <span className="text-sm overflow-hidden overflow-ellipsis max-w-[150px]">
              {map.authorNickname}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-1 items-end">
        <div>
          <MapCardActions map={map} />
        </div>
      </div>
    </Card>
  );
}
