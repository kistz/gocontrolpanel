import { Map } from "@/types/map";
import { IconDownload, IconShare } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface MapCardActionsProps {
  map: Map;
}

export default function MapCardActions({ map }: MapCardActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => {
          // Handle download action
          console.log(`Downloading map: ${map.name}`);
        }}
      >
        <IconDownload size={16} />
        Download
      </Button>
    </div>
  );
}