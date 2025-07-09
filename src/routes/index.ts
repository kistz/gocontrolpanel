import { TBreadcrumb } from "@/components/shell/breadcrumbs";

export const routes = {
  dashboard: "/",
  servers: {
    settings: "/server/:uuid/settings",
    game: "/server/:uuid/game",
    maps: "/server/:uuid/maps",
    players: "/server/:uuid/players",
    live: "/server/:uuid/live",
    files: "/server/:uuid/files",
    editor: "/server/:uuid/files/editor",
    dev: "/server/:uuid/dev",
    interface: "/server/:uuid/interface",
  },
  admin: {
    users: "/admin/users",
    servers: "/admin/servers",
    groups: "/admin/groups",
    hetzner: "/admin/hetzner",
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
  {
    path: routes.servers.players,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Players",
      },
    ],
  },
  {
    path: routes.servers.live,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Live",
      },
    ],
  },
  {
    path: routes.servers.files,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Files",
      },
    ],
  },
  {
    path: routes.servers.editor,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Files",
      },
      {
        label: "Editor",
      },
    ],
  },
  {
    path: routes.servers.dev,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Dev",
      },
    ],
  },
  {
    path: routes.servers.interface,
    breadCrumbs: [
      {
        label: "Server",
      },
      {
        label: "Interface",
      },
    ],
  },
  {
    path: routes.admin.users,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Users",
      },
    ],
  },
  {
    path: routes.admin.groups,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Groups",
      },
    ],
  },
  {
    path: routes.admin.servers,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Servers",
      },
    ],
  },
  {
    path: routes.admin.hetzner,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Hetzner",
      },
    ],
  },
];
