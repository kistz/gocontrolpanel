import { IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @md/main:grid-cols-1 @xl/main:grid-cols-3">
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Players</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            534
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +87
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Records</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +535
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card gap-6 py-6">
        <CardHeader>
          <CardDescription>Maps</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            34
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +6
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
