"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import { useParams, usePathname } from "next/navigation";
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
];

export function SiteHeader() {
  const pathname = usePathname();
  const params = useParams();

  const getUpdatedBreadCrumbs = (path: string): TBreadcrumb[] | null => {
    const dynamicParams = params as Record<string, string | number>;

    const dynamicPath = generatePath(path, dynamicParams);

    if (dynamicPath === pathname) {
      let breadcrumb = breadCrumbs.find((item) => item.path === path);
      if (!breadcrumb) return null;

      breadcrumb = {
        path: generatePath(breadcrumb.path, dynamicParams),
        breadCrumbs: breadcrumb.breadCrumbs.map((crumb) => {
          const updatedCrumb = { ...crumb };
          if (updatedCrumb.path) {
            updatedCrumb.path = generatePath(updatedCrumb.path, dynamicParams);
          }
          return updatedCrumb;
        }),
      };

      return breadcrumb.breadCrumbs;
    }

    return null;
  };

  const activeBreadCrumbs = breadCrumbs
    .map((item) => getUpdatedBreadCrumbs(item.path))
    .find((crumbs) => crumbs !== null);

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

        <Breadcrumbs crumbs={activeBreadCrumbs || []} />
      </div>
    </header>
  );
}
