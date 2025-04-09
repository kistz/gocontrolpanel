"use client";
import { getCurrentMapIndex } from "@/actions/gbx/map";
import { cn } from "@/lib/utils";
import { Map } from "@/types/map";
import { IconArrowForwardUp, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
  maps: Map[];
  loop?: boolean;
  startIndex?: number;
  className?: string;
}

export default function MapCarousel({
  maps,
  loop = false,
  startIndex = 0,
  className,
}: MapCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [follow, setFollow] = useState<boolean>(true);

  useEffect(() => {
    const intervalIndex = setInterval(async () => {
      const index = await getCurrentMapIndex();

      if (index === currentIndex) return;

      if (api && follow) {
        api.scrollTo(index);
      }

      setCurrentIndex(index);
    }, 10000);

    return () => clearInterval(intervalIndex);
  }, [api, currentIndex, follow]);

  return (
    <div className="flex flex-col gap-2">
      <Carousel
        setApi={setApi}
        opts={{
          loop: loop,
          startIndex: startIndex,
        }}
        className={cn("px-12 md:max-w-[calc(100vw-340px)]", className)}
      >
        <CarouselContent>
          {maps.map((map, index) => (
            <CarouselItem
              key={index}
              className="min-[1060px]:basis-1/2 min-[1380px]:basis-1/3"
            >
              <CarouselMapCard
                map={map}
                index={index}
                isCurrent={index === currentIndex}
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
          <IconEye
            size={16}
            className={cn(
              "absolute top-1/4 left-2 transition-all duration-200",
              follow
                ? "opacity-100 group-hover:opacity-0"
                : "opacity-0 group-hover:opacity-100",
            )}
          />{" "}
          <IconEyeOff
            size={16}
            className={cn(
              "absolute top-1/4 left-2 transition-all duration-200",
              follow
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100 group-hover:opacity-0",
            )}
          />
          <span className="pl-4">{follow ? "Unfollow" : "Follow"}</span>
        </Button>

        <Button variant="outline" onClick={() => api?.scrollTo(currentIndex)}>
          <IconArrowForwardUp size={16} />
          <span>Jump to current</span>
        </Button>
      </div>
    </div>
  );
}
