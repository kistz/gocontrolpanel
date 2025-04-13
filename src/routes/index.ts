import { getServers } from "@/actions/servers";
import { TBreadcrumb } from "@/components/shell/breadcrumbs";
import { NavGroup } from "@/components/shell/navbar";
import { generatePath } from "@/lib/utils";
import {
  IconAdjustmentsAlt,
  IconDashboard,
  IconDeviceGamepad,
  IconMap,
  IconServer,
  IconStopwatch,
  IconUsers,
} from "@tabler/icons-react";

export const routes = {
  dashboard: "/",
  players: "/players",
  maps: "/maps",
  records: "/records",
  servers: {
    settings: "/admin/server/:id/settings",
    game: "/admin/server/:id/game",
    maps: "/admin/server/:id/maps",
  },
  login: "/login",
};

const servers = await getServers();

export const navGroups: NavGroup[] = [
  {
    items: [
      {
        name: "Dashboard",
        url: routes.dashboard,
        icon: IconDashboard,
      },
      {
        name: "Players",
        url: routes.players,
        icon: IconUsers,
      },
      {
        name: "Records",
        url: routes.records,
        icon: IconStopwatch,
      },
      {
        name: "Maps",
        url: routes.maps,
        icon: IconMap,
      },
    ],
  },
  {
    name: "Servers",
    items: servers.map((server) => ({
      id: server.id,
      name: server.name,
      icon: IconServer,
      items: [
        {
          name: "Settings",
          url: generatePath(routes.servers.settings, {
            id: server.id,
          }),
          icon: IconAdjustmentsAlt,
        },
        {
          name: "Game",
          url: generatePath(routes.servers.game, {
            id: server.id,
          }),
          icon: IconDeviceGamepad,
        },
        {
          name: "Maps",
          url: generatePath(routes.servers.maps, {
            id: server.id,
          }),
          icon: IconMap,
        },
      ],
    })),
  },
];

export const breadCrumbs: {
  path: string;
  breadCrumbs: TBreadcrumb[];
}[] = [
  {
    path: routes.dashboard,
    breadCrumbs: [
      {
        label: "Dashboard",
      },
    ],
  },
  {
    path: routes.players,
    breadCrumbs: [
      {
        label: "Players",
      },
    ],
  },
  {
    path: routes.maps,
    breadCrumbs: [
      {
        label: "Maps",
      },
    ],
  },
  {
    path: routes.records,
    breadCrumbs: [
      {
        label: "Records",
      },
    ],
  },
  {
    path: routes.servers.settings,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Settings",
      },
    ],
  },
  {
    path: routes.servers.game,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Game",
      },
    ],
  },
  {
    path: routes.servers.maps,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Maps",
      },
    ],
  },
];
