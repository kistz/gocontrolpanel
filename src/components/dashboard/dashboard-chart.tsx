"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig = {
  records: {
    label: "Records",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const chartData = [
  { date: new Date("2025-04-02T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-03T18:13:25.025+00:00"), records: 34 },
  { date: new Date("2025-04-04T18:13:25.025+00:00"), records: 4 },
  { date: new Date("2025-04-05T18:13:25.025+00:00"), records: 323 },
  { date: new Date("2025-04-06T18:13:25.025+00:00"), records: 344 },
  { date: new Date("2025-04-07T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-08T18:13:25.025+00:00"), records: 3 },
  { date: new Date("2025-04-09T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-10T18:13:25.025+00:00"), records: 233 },
  { date: new Date("2025-04-11T18:13:25.025+00:00"), records: 23 },
  { date: new Date("2025-04-12T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-13T18:13:25.025+00:00"), records: 323 },
  { date: new Date("2025-04-14T18:13:25.025+00:00"), records: 32 },
  { date: new Date("2025-04-15T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-16T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-17T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-18T18:13:25.025+00:00"), records: 23 },
  { date: new Date("2025-04-19T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-20T18:13:25.025+00:00"), records: 321 },
  { date: new Date("2025-04-21T18:13:25.025+00:00"), records: 624 },
  { date: new Date("2025-04-22T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-23T18:13:25.025+00:00"), records: 535 },
  { date: new Date("2025-04-24T18:13:25.025+00:00"), records: 12 },
  { date: new Date("2025-04-25T18:13:25.025+00:00"), records: 25 },
  { date: new Date("2025-04-26T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-27T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-28T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-29T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-04-30T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-01T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-02T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-03T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-04T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-05T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-06T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-07T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-08T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-09T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-10T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-11T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-12T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-13T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-14T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-15T18:13:25.025+00:00"), records: 523 },
  { date: new Date("2025-05-16T18:13:25.025+00:00"), records: 523 },
];

export default function DashboardChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const referenceDate = new Date("2025-05-16");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = referenceDate;
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return item.date >= startDate;
  });

  return (
    <Card className="@container/card gap-6 py-6">
      <CardHeader>
        <CardTitle>Total Records</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRecords" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-records)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-records)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    return new Date(payload[0].payload.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="records"
              type="monotone"
              fill="url(#fillRecords)"
              stroke="var(--color-records)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
