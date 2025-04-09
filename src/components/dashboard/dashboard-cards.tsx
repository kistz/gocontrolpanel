import { IconTrendingUp } from "@tabler/icons-react";

import { getMapCount, getNewMapsCount } from "@/actions/database/map";
import { getNewPlayersCount, getPlayerCount } from "@/actions/database/player";
import { getNewRecordsCount, getRecordCount } from "@/actions/database/record";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardCards() {
  const totalPlayers = await getPlayerCount();
  const newPlayers = await getNewPlayersCount(30);

  const totalRecords = await getRecordCount();
  const newRecords = await getNewRecordsCount(30);

  const totalMaps = await getMapCount();
  const newMaps = await getNewMapsCount(30);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @md/main:grid-cols-1 @xl/main:grid-cols-3">
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Players</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPlayers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{newPlayers}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Records</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRecords}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{newRecords}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Maps</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalMaps}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{newMaps}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
