import { TBreadcrumb } from "@/components/shell/breadcrumbs";

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
