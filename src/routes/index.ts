import { TBreadcrumb } from "@/components/shell/breadcrumbs";

export const routes = {
  dashboard: "/",
  servers: {
    settings: "/server/:id/settings",
    game: "/server/:id/game",
    maps: "/server/:id/maps",
    players: "/server/:id/players",
    live: "/server/:id/live",
    files: "/server/:id/files",
    editor: "/server/:id/files/editor",
    dev: "/server/:id/dev",
    interface: "/server/:id/interface",
  },
  admin: {
    users: "/admin/users",
    servers: "/admin/servers",
    groups: "/admin/groups",
    roles: "/admin/roles",
    hetzner: "/admin/hetzner",
    hetznerProject: "/admin/hetzner/:id",
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
    path: routes.admin.roles,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Roles",
      }
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
  {
    path: routes.admin.hetznerProject,
    breadCrumbs: [
      {
        label: "Admin",
      },
      {
        label: "Hetzner",
        path: routes.admin.hetzner,
      },
      {
        label: "Project",
      },
    ],
  },
];
