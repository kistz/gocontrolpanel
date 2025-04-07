"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHasScrollbar } from "@/hooks/use-has-scrollbar";
import { usePagination } from "@/hooks/use-pagination";
import { usePaginationAPI } from "@/hooks/use-pagination-api";
import { useSorting } from "@/hooks/use-sorting";

interface PaginationTableProps<TData, TValue> {
  createColumns: (refetch: () => void) => ColumnDef<TData, TValue>[];
  fetchData: (
    pagination: {
      skip: number;
      limit: number;
    },
    sorting: {
      field: string;
      order: string;
    },
  ) => Promise<{ data: TData[]; totalCount: number }>;
  pageSize?: number;
  limitHeight?: number;
}

export function PaginationTable<TData, TValue>({
  createColumns,
  fetchData,
  pageSize = 10,
  limitHeight = 206,
}: PaginationTableProps<TData, TValue>) {
  const { ref: tableBodyRef, hasScrollbar } =
    useHasScrollbar<HTMLTableSectionElement>();

  const { pagination, setPagination, skip, limit } = usePagination(pageSize);
  const { sorting, setSorting, field, order } = useSorting();
  const { data, totalCount, loading, refetch } = usePaginationAPI<TData>(
    fetchData,
    { skip, limit },
    { field, order },
  );

  const columns = createColumns(refetch);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (newPagination) => setPagination(newPagination),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    rowCount: totalCount,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="rounded-md border flex-1 overflow-hidden">
        <Table>
          <TableHeader
            className={`table table-fixed ${hasScrollbar ? "w-[calc(100%-1em)]" : "w-full"}`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody
            ref={tableBodyRef}
            className="block overflow-auto"
            style={{ maxHeight: `calc(100vh - ${limitHeight}px)` }}
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="table table-fixed w-full"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 overflow-hidden overflow-ellipsis">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              <TableRow className="block">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="p-8 flex justify-center items-center"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin border-t-(--primary)"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
