import { useEffect, useState } from "react";

interface PaginationAPIHook<TData> {
  data: TData[];
  totalCount: number;
  loading: boolean;
}

export const usePaginationAPI = <TData>(
  fetchData: (
    pagination: { skip: number; limit: number },
    sorting: { field: string; order: string },
  ) => Promise<{ data: TData[]; totalCount: number }>,
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): PaginationAPIHook<TData> => {
  const [data, setData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDataFromAPI = async () => {
    setLoading(true);
    try {
      const { data: fetchedData, totalCount: fetchedTotalCount } =
        await fetchData(pagination, sorting);
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
  }, [pagination.skip, pagination.limit, sorting.field, sorting.order]);

  return { data, totalCount, loading };
};
