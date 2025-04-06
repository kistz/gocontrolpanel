import { SortingState } from "@tanstack/react-table";
import { useState } from "react";

interface SortingHook {
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  field: string;
  order: string;
}

export const useSorting = (
  initialField: string = "_id",
  initialOrder: string = "ASC",
): SortingHook => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: initialField,
      desc: initialOrder === "DESC",
    },
  ]);

  return {
    sorting,
    setSorting,
    field: sorting[0]?.id || "_id",
    order: sorting[0]?.desc ? "DESC" : "ASC",
  };
};
