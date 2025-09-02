import { capitalizeWords } from "@/lib/utils";
import { ClubActivity } from "@/types/api/nadeo";
import { IconEdit, IconEye, IconMap, IconPhoto } from "@tabler/icons-react";
import Image from "next/image";
import { parseTmTags } from "tmtags";
import ActivityDetailsModal from "../modals/clubs/activity-details";
import Modal from "../modals/modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

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
              {capitalizeWords(
                activity.activityType?.replaceAll("-", " ") || "Unknown",
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 gap-2">
        <div className="flex justify-between gap-2">
          <div className="flex gap-1 overflow-x-hidden">
            {activity.public && <Badge variant={"outline"}>Public</Badge>}
            {activity.active && <Badge variant={"outline"}>Active</Badge>}
            {activity.featured && <Badge variant={"outline"}>Featured</Badge>}
            {activity.password && <Badge variant={"outline"}>Password</Badge>}
          </div>

          {activity.activityType === "campaign" && (
            <span className="flex items-center gap-2">
              <IconMap size={18} />
              {activity.itemsCount}
            </span>
          )}
        </div>

        <Separator />

        <div className="flex gap-2">
          <Modal>
            <ActivityDetailsModal data={activity} />
            <Button
              variant={"outline"}
              disabled={activity.activityType !== "room"}
            >
              <IconEye />
              View Activity
            </Button>
          </Modal>

          <Modal>
            <></>
            <Button
              variant={"outline"}
              disabled={activity.activityType !== "room"}
            >
              <IconEdit />
              Edit Activity
            </Button>
          </Modal>
        </div>
      </div>
    </Card>
  );
}
