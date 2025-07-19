"use client";

import { Maps } from "@/lib/prisma/generated";
import { cn } from "@/lib/utils";
import {
  IconArrowForwardUp,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import CarouselMapCard from "./carousel-map-card";

interface MapCarouselProps {
  serverId: string;
  maps: Maps[];
  loop?: boolean;
  startIndex?: number;
  className?: string;
}

export default function MapCarousel({
  serverId,
  maps,
  loop = false,
  startIndex = 0,
  className,
}: MapCarouselProps) {
  const { status } = useSession();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [follow, setFollow] = useState<boolean>(true);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const followRef = useRef(follow);
  const apiRef = useRef(api);

  // Keep refs in sync with state
  useEffect(() => {
    followRef.current = follow;
  }, [follow]);

  useEffect(() => {
    apiRef.current = api;
  }, [api]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const ws = new WebSocket(`/api/ws/map/${serverId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "activeMap":
          const activeMap = data.data;
          const index = maps.findIndex((m) => m.uid === activeMap);
          if (index !== -1) {
            setCurrentIndex(index);
            if (followRef.current && apiRef.current) {
              apiRef.current.scrollTo(index);
            }
          }
          break;
        case "endMap":
          setIsSwitching(true);
          break;
        case "startMap":
          const { mapUid } = data.data;
          const newIndex = maps.findIndex((m) => m.uid === mapUid);
          if (newIndex !== -1) {
            setCurrentIndex(newIndex);
            if (followRef.current && apiRef.current) {
              apiRef.current.scrollTo(newIndex);
            }
          }
          setIsSwitching(false);
          break;
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onerror = () => {
      ws.close();
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [serverId, maps, status]);

  return (
    <div className="flex flex-col gap-2">
      <Carousel
        setApi={setApi}
        opts={{
          loop,
          startIndex,
          align: "center",
        }}
        className={cn("px-12 md:max-w-[calc(100vw-340px)]", className)}
      >
        <CarouselContent>
          {maps.map((map, index) => (
            <CarouselItem
              key={index}
              className="min-[1060px]:basis-1/2 min-[1380px]:basis-1/3 m-auto"
            >
              <CarouselMapCard
                serverId={serverId}
                map={map}
                index={index}
                isCurrent={index === currentIndex}
                isSwitching={isSwitching}
                total={maps.length}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          className="group relative"
          onClick={() => setFollow(!follow)}
        >
          {follow ? <IconLock size={16} /> : <IconLockOpen size={16} />}
          <span>{follow ? "Following" : "Not Following"}</span>
        </Button>

        <Button variant="outline" onClick={() => api?.scrollTo(currentIndex)}>
          <IconArrowForwardUp size={16} />
          <span>Jump to current</span>
        </Button>
      </div>
    </div>
  );
}
