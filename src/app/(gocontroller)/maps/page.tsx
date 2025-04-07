"use client";
import MapsCards from "@/components/maps/maps-cards";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import { useEffect } from "react";

export default function MapsPage() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Maps" }]);
  }, []);

  return <MapsCards />;
}
