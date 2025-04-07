import { Breadcrumb as TBreadcrumb } from "@/providers/breadcrumb-provider";
import { routes } from "@/routes";
import Link from "next/link";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbsProps {
  crumbs: TBreadcrumb[];
  className?: string;
}

export default function Breadcrumbs({ crumbs, className }: BreadcrumbsProps) {
  const [open, setOpen] = useState(false);

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
              <BreadcrumbItem key={index}>
                {item.path ? (
                  <>
                    <BreadcrumbLink
                      asChild
                      className="max-w-20 truncate md:max-w-none"
                    >
                      <Link href={item.path}>{item.label}</Link>
                    </BreadcrumbLink>
                    {index !== crumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                ) : (
                  <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
