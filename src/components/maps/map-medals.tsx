import { Map } from "@/types/map";
import { IconMedal } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import TimeDisplay from "../time-display";
import { Card } from "../ui/card";

interface MapMedalsProps {
  map: Map;
  ref: React.RefObject<HTMLDivElement | null>;
}

export default function MapMedals({ map, ref }: MapMedalsProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkCompact = () => {
      if (ref.current) {
        if (!isCompact && ref.current.scrollWidth < 410) {
          setIsCompact(true);
        } else if (isCompact && ref.current.scrollWidth >= 410) {
          setIsCompact(false);
        }
      }
    };

    checkCompact();

    const resizeObserver = new ResizeObserver(checkCompact);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isCompact, ref]);

  return (
    <Card className="flex flex-1 p-2 flex-row items-center rounded-sm bg-black/40 border-none justify-between gap-2">
      <div className="flex items-center gap-2">
        <IconMedal className="text-green-700" size={24} />
        <TimeDisplay time={map.authorTime} className="text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <IconMedal className="text-yellow-500" size={24} />
        <TimeDisplay time={map.goldTime} className="text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <IconMedal className="text-gray-400" size={24} />
        <TimeDisplay time={map.silverTime} className="text-sm" />
      </div>
      {!isCompact && (
        <div className="flex items-center gap-2">
          <IconMedal className="text-amber-700" size={24} />
          <TimeDisplay time={map.bronzeTime} className="text-sm" />
        </div>
      )}
    </Card>
  );
}
