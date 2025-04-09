import { cn } from "@/lib/utils";
import { Map } from "@/types/map";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
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
  return (
    <Carousel
      opts={{
        loop: loop,
        startIndex: startIndex,
      }}
      className={cn("px-12 md:max-w-[calc(100vw-340px)]", className)}
    >
      <CarouselContent>
        {maps.map((map, index) => (
          <CarouselItem key={index} className="lg:basis-1/2 xl:basis-1/3">
            <CarouselMapCard map={map} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
