import { cn, getErrorMessage } from "@/lib/utils";
import { Map } from "@/types/map";
import { IconBounceRight, IconPhoto, IconPlayerTrackNext, IconPlayerTrackPrev, IconRotateClockwise, IconUser } from "@tabler/icons-react";
import { parseTmTags, stripTmTags } from "tmtags";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { nextMap, restartMap } from "@/actions/gbx/game";
import { jumpToMap } from "@/actions/gbx/map";
import { toast } from "sonner";

interface CarouselMapCardProps {
  map: Map;
  index: number;
  isCurrent?: boolean;
  total: number;
  className?: string;
}

export default function CarouselMapCard({
  map,
  index,
  isCurrent = false,
  total,
  className,
}: CarouselMapCardProps) {
  const onPreviousMap = async () => {
    try {
      const previousIndex = index - 1 < 0 ? total - 1 : index - 1;
      await jumpToMap(previousIndex);
      toast.success("Gone back to previous map", {
        description: `Gone back to ${stripTmTags(map.name)} by ${map.authorNickname}`,
      });
    } catch (error) {
      toast.error("Failed to jump to previous map", {
        description: getErrorMessage(error),
      });
    }
  };

  const onRestartMap = async () => {
    try {
      await restartMap();
      toast.success("Restarted map", {
        description: `Restarted ${stripTmTags(map.name)} by ${map.authorNickname}`,
      });
    } catch (error) {
      toast.error("Failed to restart map", {
        description: getErrorMessage(error),
      });
    }
  };

  const onNextMap = async () => {
    try {
      await nextMap();
      toast.success("Skipped to next map", {
        description: `Skipped to ${stripTmTags(map.name)} by ${map.authorNickname}`,
      });
    } catch (error) {
      toast.error("Failed to skip to next map", {
        description: getErrorMessage(error),
      });
    }
  };

  const onJumpToMap = async () => {
    try {
      await jumpToMap(index);
      toast.success("Jumped to map", {
        description: `Jumped to ${stripTmTags(map.name)} by ${map.authorNickname}`,
      });
    } catch (error) {
      toast.error("Failed to jump to map", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Card className={cn("flex flex-col flex-1 relative", className)}>
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
      <div className="p-3 flex gap-2 justify-between">
        {isCurrent ? (
          <>
            <Button
              variant={"outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={onPreviousMap}
            >
              <IconPlayerTrackPrev className="mt-[2px]" />
              <span className="hidden min-[450px]:block">Previous</span>
            </Button>

            <Button
              variant={"outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={onRestartMap}
            >
              <IconRotateClockwise className="mt-[2px] rotate-180" />
              <span className="hidden min-[450px]:block">Restart</span>
            </Button>

            <Button
              variant={"outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={onNextMap}
            >
              <IconPlayerTrackNext className="mt-[2px]" />
              <span className="hidden min-[450px]:block">Next</span>
            </Button>
          </>
        ) : (
          <Button
            variant={"outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={onJumpToMap}
          >
            <IconBounceRight className="mt-[2px]" />
            Jump to Map
          </Button>
        )}
      </div>

      {isCurrent && (
        <Badge
          variant={"outline"}
          className="absolute top-2 left-2 z-10 bg-black flex gap-2"
        >
          <span className="bg-green-500 w-2 h-2 rounded-full"></span>
          Current Map
        </Badge>
      )}
    </Card>
  );
}
