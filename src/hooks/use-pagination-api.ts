import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface PaginationAPIHook<TData> {
  data: TData[];
  totalCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const usePaginationAPI = <TData>(
  fetchData: (
    pagination: PaginationState,
    sorting: { field: string; order: "asc" | "desc" },
    filter?: string,
  ) => Promise<ServerResponse<PaginationResponse<TData>>>,
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" } = {
    field: "id",
    order: "asc",
  },
  filter: string = "",
): PaginationAPIHook<TData> => {
  const [data, setData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDataFromAPI = async () => {
    setLoading(true);
    try {
      const {
        data: { data: fetchedData, totalCount: fetchedTotalCount },
        error,
      } = await fetchData(pagination, sorting, filter);

      if (error) {
        throw new Error(error);
      }

      setData(fetchedData);
      setTotalCount(fetchedTotalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting.field,
    sorting.order,
    filter,
  ]);

  return { data, totalCount, loading, refetch: fetchDataFromAPI };
};
