import { Map } from "@/types/map";
import { IconMedal } from "@tabler/icons-react";
import TimeDisplay from "../time-display";
import { Card } from "../ui/card";

interface MapMedalsProps {
  map: Map;
}

export default function MapMedals({ map }: MapMedalsProps) {
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
      <div className="flex items-center gap-2">
        <IconMedal className="text-amber-700" size={24} />
        <TimeDisplay time={map.bronzeTime} className="text-sm" />
      </div>
    </Card>
  );
}
