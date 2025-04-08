import { routes } from "@/routes";
import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export interface TBreadcrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: TBreadcrumb[];
  className?: string;
}

export default function Breadcrumbs({ crumbs, className }: BreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.dashboard}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.length > 0 && (
          <>
            <BreadcrumbSeparator />
            {crumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.path ? (
                    <>
                      <BreadcrumbLink
                        asChild
                        className="max-w-20 truncate md:max-w-none"
                      >
                        <Link href={item.path}>{item.label}</Link>
                      </BreadcrumbLink>
                    </>
                  ) : (
                    <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
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
