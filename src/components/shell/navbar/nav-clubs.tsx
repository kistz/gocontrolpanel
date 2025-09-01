import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import { IconUsersGroup } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { parseTmTags } from "tmtags";
import { NavGroup } from ".";

export default async function NavClubs() {
  const session = await auth();
  if (!session) {
    return null;
  }

  const clubs = session.user.adminClubs;

  const group: NavGroup = {
    name: "Clubs",
    items: clubs.map((club) => ({
      id: club.id,
      name: club.name,
      url: generatePath(routes.clubs, { id: club.id }),
      icon: IconUsersGroup,
    })),
  };

  return (
    <Collapsible className="group/collapsible">
      <SidebarGroup
        className="group-data-[collapsible=icon]:hidden select-none"
        key={group.name || "default"}
      >
        {group.name && (
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="flex items-center cursor-pointer">
              <span>{group.name}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
        )}

        <CollapsibleContent>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    {item.url ? (
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: parseTmTags(item.name),
                          }}
                        ></span>
                      </Link>
                    ) : (
                      <div>
                        {item.icon && <item.icon />}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: parseTmTags(item.name),
                          }}
                        ></span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
