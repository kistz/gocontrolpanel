import { getClub } from "@/actions/nadeo/clubs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasPermission } from "@/lib/auth";
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
                    className="static! rounded-lg h-40! max-w-92 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg flex items-center justify-center max-w-92">
                    <IconPhoto className="text-gray-500" size={48} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <h2
                      className="text-xl font-bold"
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
                  </div>

                  {club.description.trim() && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: parseTmTags(club.description.trim()),
                      }}
                    ></p>
                  )}

                  <div>
                    <span className="font-semibold">Author</span>:{" "}
                    {club.authorName}
                  </div>

                  <div>
                    <span className="font-semibold">Latest Editor</span>:{" "}
                    {club.latestEditorName}
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
