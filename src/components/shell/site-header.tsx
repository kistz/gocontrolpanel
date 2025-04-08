"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import Breadcrumbs from "./breadcrumbs";

export function SiteHeader() {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b 
    transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
    sticky! z-10 top-0 bg-white/20 p-2 backdrop-blur-sm dark:bg-black/40 rounded-t-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
    </header>
  );
}
