"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface BreadcrumbContextProps {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextProps | undefined>(
  undefined,
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
}
