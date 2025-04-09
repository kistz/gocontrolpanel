import { cn } from "@/lib/utils";
import { Map } from "@/types/map";
import { Card } from "../ui/card";
import { parseTmTags } from "tmtags";
import { IconPhoto } from "@tabler/icons-react";

interface CarouselMapCardProps {
  map: Map;
  className?: string;
  onClick?: () => void;
}

export default function CarouselMapCard({
  map,
  className,
  onClick,
}: CarouselMapCardProps) {
  return (
    <Card className={cn("flex flex-col flex-1", className)} onClick={onClick}>
      <div className="relative">
        {map.thumbnailUrl ? (
          <img
            loading="lazy"
            src={map.thumbnailUrl}
            alt={map.name}
            className="w-full rounded-lg h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 rounded-t-lg flex items-center justify-center">
            <IconPhoto className="text-gray-500" size={48} />
          </div>
        )}
        <div className="flex items-center space-x-2 justify-between rounded-b-lg absolute bottom-0 left-0 right-0 bg-white/20 p-2 backdrop-blur-sm dark:bg-black/40">
          <h3
            className="overflow-hidden overflow-ellipsis text-nowrap text-lg font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: parseTmTags(map.name) }}
          ></h3>

          <div className="flex items-center gap-2">
            <span className="text-sm overflow-hidden overflow-ellipsis max-w-[150px]">
              {map.authorNickname}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
