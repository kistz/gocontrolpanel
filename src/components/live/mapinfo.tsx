"use client";

import { getMapByUid } from "@/actions/database/maps";
import { Maps } from "@/lib/prisma/generated";
import { formatTime, getErrorMessage } from "@/lib/utils";
import {
  IconPhoto,
  IconScript,
  IconStopwatch,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import LiveActions from "./live-actions";

interface MapInfoProps {
  serverUuid: string;
  map?: string;
  mode?: string;
  pauseAvailable: boolean;
  isPaused: boolean;
  isWarmUp: boolean;
}

export default function MapInfo({
  serverUuid,
  map,
  mode,
  pauseAvailable,
  isPaused,
  isWarmUp,
}: MapInfoProps) {
  const session = useSession();
  const [mapInfo, setMapInfo] = useState<Maps | null>(null);

  useEffect(() => {
    if (!map) return;

    const fetchData = async () => {
      try {
        const { data, error } = await getMapByUid(map);
        if (error) {
          console.error("Error fetching map info:", error);
          return;
        }

        setMapInfo(data);
      } catch (error) {
        toast.error("Error fetching map info", {
          description: getErrorMessage(error),
        });
      }
    };

    fetchData();
  }, [map]);

  if (!mapInfo) {
    return (
      <Card className="flex flex-col flex-1">
        <div className="w-full h-40 rounded-t-lg flex items-center justify-center">
          <IconPhoto className="text-gray-500" size={48} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-min flex-col">
      <div className="relative">
        {mapInfo.thumbnailUrl ? (
          <Image
            src={mapInfo.thumbnailUrl}
            fill
            alt={mapInfo.name}
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
            dangerouslySetInnerHTML={{ __html: parseTmTags(mapInfo.name) }}
          ></h3>

          <div className="flex items-center gap-2">
            <IconUser size={20} />
            <span
              className="text-sm truncate"
              dangerouslySetInnerHTML={{
                __html: parseTmTags(mapInfo.authorNickname),
              }}
            ></span>
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-bold text-sm">
            <IconScript size={20} /> Mode:
          </span>
          <span className="text-sm truncate">{mode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-sm">
            <IconStopwatch size={20} /> Author Time:
          </span>
          <span className="text-sm">{formatTime(mapInfo.authorTime)}</span>
        </div>

        {session.data?.user?.roles?.includes("admin") && (
          <>
            <Separator />
            <LiveActions
              serverUuid={serverUuid}
              pauseAvailable={pauseAvailable}
              isPaused={isPaused}
              isWarmUp={isWarmUp}
            />
          </>
        )}
      </div>
    </Card>
  );
}
