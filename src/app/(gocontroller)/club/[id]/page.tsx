import { getClub } from "@/actions/nadeo/clubs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasPermission } from "@/lib/auth";
import { capitalizeWords } from "@/lib/utils";
import { routePermissions } from "@/routes";
import { IconPhoto, IconRosetteDiscountCheck } from "@tabler/icons-react";
import Image from "next/image";
import { parseTmTags } from "tmtags";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const canEdit = await hasPermission(routePermissions.clubs.edit);

  const { data: club } = await getClub(id);

  const createdAt = new Date(club.creationTimestamp * 1000);
  const updatedAt = new Date(club.editionTimestamp * 1000);

  return (
    <div
      className="h-full bg-cover bg-center bg-no-repeat overflow-y-none rounded-t-xl"
      style={{
        backgroundImage: club?.backgroundUrl
          ? `url(${club.backgroundUrl})`
          : undefined,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b dark:from-black/100 dark:via-black/100 from-white/100 via-white/100 to-transparent h-96 md:h-80 rounded-t-xl" />

      <div className="relative flex flex-col gap-6 p-4 lg:p-6 overflow-y-auto z-10">
        <div className="flex gap-2 justify-between sm:items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Club Overview</h1>
            <h4 className="text-muted-foreground">
              View and manage the details of your club.
            </h4>
          </div>
        </div>

        {club && (
          <div>
            <Card className="p-4 flex flex-col gap-4">
              <div className="flex gap-4 flex-col lg:flex-row">
                {club.iconUrl ? (
                  <Image
                    src={club.iconUrl}
                    fill
                    alt={club.name}
                    className="static! rounded-lg max-w-92 object-cover"
                  />
                ) : (
                  <div className="w-full rounded-lg flex items-center justify-center max-w-92">
                    <IconPhoto className="text-gray-500" size={48} />
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center flex-wrap">
                      <h2
                        className="text-xl font-bold truncate"
                        dangerouslySetInnerHTML={{
                          __html: parseTmTags(club.name),
                        }}
                      ></h2>

                      {club.verified && <IconRosetteDiscountCheck />}

                      {club.tag && (
                        <Badge
                          variant={"secondary"}
                          className="text-md"
                          dangerouslySetInnerHTML={{
                            __html: parseTmTags(club.tag),
                          }}
                        ></Badge>
                      )}

                      {capitalizeWords(club.state.replaceAll("-", " "))}
                    </div>

                    {club.description.trim() && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: parseTmTags(club.description.trim()),
                        }}
                      ></p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-w-128">
                    <div className="flex flex-col">
                      <span className="font-semibold">Author</span>
                      <span className="truncate">{club.authorName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Latest Editor</span>
                      <span className="truncate">{club.latestEditorName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Created At</span>
                      <span className="truncate">
                        {createdAt.toLocaleDateString()}{" "}
                        {createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Updated At</span>
                      <span className="truncate">
                        {updatedAt.toLocaleDateString()}{" "}
                        {updatedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
