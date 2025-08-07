import { cn } from "@/lib/utils";
import { TMXMap } from "@/types/api/tmx";
import { IconPhoto, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { parseTmTags } from "tmtags";
import { Card } from "../ui/card";

export default function TMXMapCard({
  map,
  className,
}: {
  map: TMXMap;
  className?: string;
}) {
  const imagePosition = map.Images.reduce(
    (max, img) => Math.max(max, img.Position),
    -1,
  );

  return (
    <Card className={cn("flex flex-col flex-1 relative", className)}>
      <div className="relative">
        {map.HasThumbnail || imagePosition > 0 ? (
          <Image
            src={`https://trackmania.exchange/mapimage/${map.MapId}${imagePosition > -1 ? `/${imagePosition}` : ""}?hq=true`}
            fill
            alt={map.Name}
            className="static! rounded-t-lg h-40! object-cover"
          />
        ) : (
          <div className="w-full h-40 rounded-t-lg flex items-center justify-center">
            <IconPhoto className="text-gray-500" size={48} />
          </div>
        )}
        <div className="flex items-center space-x-2 justify-between absolute bottom-0 left-0 right-0 bg-white/20 p-2 backdrop-blur-sm dark:bg-black/40">
          <h3
            className="truncate text-lg font-semibold text-white"
            dangerouslySetInnerHTML={{
              __html: parseTmTags(map.GbxMapName ?? ""),
            }}
          ></h3>

          <div className="flex items-center gap-2">
            <IconUser className="!size-5 flex-shrink-0" />
            <span
              className="text-sm truncate"
              dangerouslySetInnerHTML={{
                __html: parseTmTags(map.Authors[0]?.User.Name ?? ""),
              }}
            ></span>
          </div>
        </div>
      </div>
    </Card>
  );
}
