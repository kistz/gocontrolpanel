import { capitalizeWords } from "@/lib/utils";
import { ClubActivity } from "@/types/api/nadeo";
import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";
import { parseTmTags } from "tmtags";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function ActivityCard({ activity }: { activity: ClubActivity }) {
  return (
    <Card className="flex flex-col flex-1 relative">
      <div className="relative">
        {activity.mediaUrl ? (
          <Image
            src={activity.mediaUrl}
            fill
            alt={activity.name}
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
              __html: parseTmTags(activity.name ?? ""),
            }}
          ></h3>

          <div className="flex items-center gap-2">
            <span className="text-sm truncate text-white">
              {capitalizeWords(activity.activityType || "Unknown")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 overflow-x-hidden">
            {activity.public && <Badge variant={"outline"}>Public</Badge>}
            {activity.active && <Badge variant={"outline"}>Active</Badge>}
            {activity.featured && <Badge variant={"outline"}>Featured</Badge>}
            {activity.password && <Badge variant={"outline"}>Password</Badge>}
          </div>
        </div>
      </div>
    </Card>
  );
}
