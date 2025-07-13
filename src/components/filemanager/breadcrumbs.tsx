import { TBreadcrumb } from "@/components/shell/breadcrumbs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn, generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbsProps {
  crumbs: TBreadcrumb[];
  id: string;
  className?: string;
}

export default function FilesBreadcrumbs({
  crumbs,
  id,
  className,
}: BreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={generatePath(routes.servers.files, {
                uuid: id,
              })}
            >
              <IconHome size={20} />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.length > 0 && (
          <>
            <BreadcrumbSeparator />
            {crumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.path && index !== crumbs.length - 1 ? (
                    <>
                      <BreadcrumbLink
                        asChild
                        className="max-w-20 truncate md:max-w-none"
                      >
                        <Link
                          href={`${generatePath(routes.servers.files, { uuid: id })}?path=${item.path}`}
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    </>
                  ) : (
                    <BreadcrumbPage
                      className={cn("max-w-20 truncate md:max-w-none")}
                    >
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index !== crumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
