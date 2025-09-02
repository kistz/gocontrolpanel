"use client";
import { getClubRoomWithNames } from "@/actions/nadeo/clubs";
import { getErrorMessage } from "@/lib/utils";
import { ClubActivity, ClubRoomWithNames } from "@/types/api/nadeo";
import { IconPhoto, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseTmTags } from "tmtags";
import { Card } from "../../ui/card";
import { DefaultModalProps } from "../default-props";

export default function ActivityDetailsModal({
  closeModal,
  data,
}: DefaultModalProps<ClubActivity>) {
  const [clubRoom, setClubRoom] = useState<ClubRoomWithNames | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClubRoom = async () => {
    if (!data) return;

    try {
      setLoading(true);

      const { data: clubRoom, error: getClubRoomError } =
        await getClubRoomWithNames(data.clubId, data.id);
      if (getClubRoomError) {
        throw new Error(getClubRoomError);
      }

      setClubRoom(clubRoom);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(getErrorMessage(error));
        toast.error("Failed to fetch club room", {
          description: getErrorMessage(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubRoom();
  }, [data]);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Activity Details</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>

      {loading && <span>Loading...</span>}

      {error && <span>{error}</span>}

      {clubRoom && (
        <div>
          <Card className="p-4 flex flex-col gap-4">
            <div className="flex gap-4 flex-col lg:flex-row lg:min-w-128">
              {clubRoom.mediaUrl ? (
                <Image
                  src={clubRoom.mediaUrl}
                  fill
                  alt={clubRoom.name}
                  className="static! rounded-lg max-w-92 object-cover"
                />
              ) : (
                <div className="w-full rounded-lg flex items-center justify-center max-w-92">
                  <IconPhoto className="text-gray-500" size={48} />
                </div>
              )}
              <div className="flex flex-col gap-4 lg:min-w-92">
                <div className="flex flex-col gap-2">
                  <h2
                    className="text-xl font-bold truncate"
                    dangerouslySetInnerHTML={{
                      __html: parseTmTags(clubRoom.name),
                    }}
                  ></h2>
                </div>

                <div className="grid grid-cols-2 gap-2 max-w-128">
                  <div className="flex flex-col">
                    <span className="font-semibold">Creator</span>
                    <span className="truncate">{clubRoom.creatorName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Latest Editor</span>
                    <span className="truncate">
                      {clubRoom.latestEditorName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Created At</span>
                    <span className="text-nowrap">
                      {new Date(
                        clubRoom.creationTimestamp * 1000,
                      ).toLocaleDateString()}{" "}
                      {new Date(
                        clubRoom.creationTimestamp * 1000,
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
