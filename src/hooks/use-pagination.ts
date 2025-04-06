import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

interface PaginationHook {
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  skip: number;
  limit: number;
}

export const usePagination = (initialPageSize: number): PaginationHook => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: initialPageSize,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    pagination,
    setPagination,
    skip: pageIndex * pageSize,
    limit: pageSize,
  };
};
