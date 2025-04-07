import { Button } from "@/components/ui/button";
import { Map } from "@/types/map";
import { IconDownload, IconHeartbeat } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MapCardActionsProps {
  map: Map;
  ref: React.RefObject<HTMLDivElement | null>;
}

export default function MapCardActions({ map, ref }: MapCardActionsProps) {
  const [isCompact, setIsCompact] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin =
    status === "authenticated" && session.user.roles.includes("admin");

  useEffect(() => {
    const checkCompact = () => {
      if (ref.current) {
        if (!isCompact && ref.current.scrollWidth < 370) {
          setIsCompact(true);
        } else if (isCompact && ref.current.scrollWidth >= 370) {
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
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        {map.fileUrl && (
          <Link href={map.fileUrl} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <IconDownload size={16} />
              Download
            </Button>
          </Link>
        )}
        <Link
          href={`https://trackmania.io/#/leaderboard/${map.uid}`}
          target="_blank"
        >
          <Button variant="outline" size="sm">
            <IconHeartbeat size={16} />
            {isCompact ? "Trackmania.io" : "View on Trackmania.io"}
          </Button>
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View map</DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  console.log("Delete player");
                }}
              >
                Delete player
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
