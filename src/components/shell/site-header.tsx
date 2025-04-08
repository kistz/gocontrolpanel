"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { routes } from "@/routes";
import { usePathname } from "next/navigation";
import Breadcrumbs, { TBreadcrumb } from "./breadcrumbs";

const breadCrumbs: {
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
    path: routes.admin.server.settings,
    breadCrumbs: [
      {
        label: "Server",
        path: routes.admin.server.settings,
      },
      {
        label: "Settings",
      },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  const activeBreadCrumbs = breadCrumbs.filter((item) => {
    if (item.path === pathname) {
      return item;
    }
  })[0];

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b 
    transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
    sticky! z-10 top-0 bg-white/20 p-2 backdrop-blur-sm dark:bg-black/40 rounded-t-xl"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumbs crumbs={activeBreadCrumbs?.breadCrumbs || []} />
      </div>
    </header>
  );
}
