import { cn, getErrorMessage } from "@/lib/utils";
import { ClubCampaign } from "@/types/api/nadeo";
import {
  IconDownload,
  IconMapPlus,
  IconPhoto,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

export default function ClubCampaignCard({
  serverId,
  fmHealth,
  campaign,
  className,
}: {
  serverId: string;
  fmHealth: boolean;
  campaign: ClubCampaign;
  className?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const onDownload = async () => {
    try {
      if (!fmHealth) {
        toast.error("File manager is not healthy, cannot download campaign");
        return;
      }

      if (campaign.campaign.playlist.length === 0) {
        toast.error("Campaign has no maps to download");
        return;
      }

      if (isDownloading) return;

      setIsDownloading(true);

      // const { error } = await downloadCampaign(
      //   serverId,

      // );
      // if (error) {
      //   throw new Error(error);
      // }

      toast.success("Campaign successfully downloaded", {
        description: `You can find the maps in the Maps/Downloaded/${campaign.campaign.name} folder`,
      });
    } catch (err) {
      toast.error("Failed to download campaign", {
        description: getErrorMessage(err),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const onAdd = async () => {
    try {
      if (!fmHealth) {
        toast.error("File manager is not healthy, cannot add campaign");
        return;
      }

      if (campaign.campaign.playlist.length === 0) {
        toast.error("Campaign has no maps to add");
        return;
      }

      if (isDownloading) return;

      setIsDownloading(true);

      // const { error } = await addMapToServer(
      //   serverId,
      //   day.map.fileUrl,
      //   day.map.fileName,
      // );
      // if (error) {
      //   throw new Error(error);
      // }

      toast.success("Campaign successfully added to server");
    } catch (err) {
      toast.error("Failed to add campaign to server", {
        description: getErrorMessage(err),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col flex-1 relative", className)}>
      <div className="relative">
        {campaign.mediaUrl ? (
          <Image
            src={campaign.mediaUrl}
            fill
            alt={campaign.campaign.name}
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
              __html: parseTmTags(campaign.campaign.name ?? ""),
            }}
          ></h3>

          <div className="flex items-center gap-2">
            <IconUser className="!size-5 flex-shrink-0" />
            <span
              className="text-sm truncate"
              dangerouslySetInnerHTML={{
                __html: parseTmTags(campaign.clubName),
              }}
            ></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 gap-2">
        {fmHealth && campaign.campaign.playlist.length > 0 && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onDownload}
                disabled={isDownloading}
              >
                <IconDownload />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={onAdd}
                disabled={isDownloading}
              >
                <IconMapPlus />
                Add to Server
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
