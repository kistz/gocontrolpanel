import { cn } from "@/lib/utils";
import { TMXMap } from "@/types/api/tmx";
import { IconPhoto, IconTrophyFilled, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { parseTmTags } from "tmtags";
import MapMedals from "../maps/map-medals";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function TMXMapCard({
  serverId,
  fmHealth,
  map,
  className,
}: {
  serverId: string;
  fmHealth: boolean;
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
            src={`https://trackmania.exchange/mapimage/${map.MapId}${imagePosition > -1 ? `/${imagePosition}` : ""}`}
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

      <div className="flex flex-col p-2 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 justify-between">
            <div className="flex gap-1">
              {map.Tags.map((tag, index) => (
                <Badge key={index} variant={"outline"}>
                  {tag.Name}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <span>{map.AwardCount}</span>
              <IconTrophyFilled className="text-yellow-400" size={18} />
            </div>
          </div>
        </div>

        <MapMedals
          medals={{
            authorTime: map.Medals.Author,
            goldTime: map.Medals.Gold,
            silverTime: map.Medals.Silver,
            bronzeTime: map.Medals.Bronze,
          }}
        />
      </div>
    </Card>
  );
}
