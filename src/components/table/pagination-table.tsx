"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
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
import { usePaginationAPI } from "@/hooks/use-pagination-api";
import { useSorting } from "@/hooks/use-sorting";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface PaginationTableProps<TData, TValue, TArgs, TFetch> {
  createColumns: (
    refetch: () => void,
    data: TArgs,
  ) => ColumnDef<TData, TValue>[];
  fetchData: (
    pagination: PaginationState,
    sorting: {
      field: string;
      order: "asc" | "desc";
    },
    filter?: string,
    fetchArgs?: TFetch,
  ) => Promise<ServerResponse<PaginationResponse<TData>>>;
  args?: TArgs;
  pageSize?: number;
  filter?: boolean;
  fetchArgs?: TFetch;
  actions?: React.ReactNode;
}

export function PaginationTable<TData, TValue, TArgs, TFetch>({
  createColumns,
  fetchData,
  args = {} as TArgs,
  pageSize = 10,
  filter = false,
  fetchArgs = {} as TFetch,
  actions,
}: PaginationTableProps<TData, TValue, TArgs, TFetch>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize,
    pageIndex: 0,
  });
  const { sorting, setSorting, field, order } = useSorting();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { data, totalCount, loading, refetch } = usePaginationAPI<
    TData,
    TFetch
  >(fetchData, pagination, { field, order }, globalFilter, fetchArgs);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [globalFilter]);

  const columns = createColumns(refetch, args);

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
    defaultColumn: {
      size: 100,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {(filter || actions) && (
        <div
          className={clsx(
            "flex justify-between items-center gap-2 max-w-full",
            !filter && "justify-end",
          )}
        >
          {filter && (
            <Input
              placeholder="Search..."
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="flex-1 sm:max-w-1/3"
            />
          )}

          {actions}
        </div>
      )}

      <div className="overflow-x-auto rounded-md border flex-1">
        <Table>
          <TableHeader className="table-fixed">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 max-w-64"
                    style={{ minWidth: header.column.getSize() }}
                  >
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

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="table-fixed min-h-12"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 overflow-hidden overflow-ellipsis max-w-64"
                      style={{ minWidth: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24"
                >
                  <p className="text-muted-foreground">Loading...</p>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
