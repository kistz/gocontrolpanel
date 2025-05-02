import { PaginationResponse, ServerResponse } from "@/types/responses";
import { useEffect, useState } from "react";

interface PaginationAPIHook<TData> {
  data: TData[];
  totalCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const usePaginationAPI = <TData>(
  fetchData: (
    pagination: { skip: number; limit: number },
    sorting: { field: string; order: string },
    filter?: string,
  ) => Promise<ServerResponse<PaginationResponse<TData>>>,
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string } = { field: "_id", order: "ASC" },
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
  }, [pagination.skip, pagination.limit, sorting.field, sorting.order, filter]);

  return { data, totalCount, loading, refetch: fetchDataFromAPI };
};
