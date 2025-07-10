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
import { useHasScrollbar } from "@/hooks/use-has-scrollbar";
import { usePaginationAPI } from "@/hooks/use-pagination-api";
import { useSorting } from "@/hooks/use-sorting";
import { PaginationResponse, ServerResponse } from "@/types/responses";
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
}

export function PaginationTable<TData, TValue, TArgs, TFetch>({
  createColumns,
  fetchData,
  args = {} as TArgs,
  pageSize = 10,
  filter = false,
  fetchArgs = {} as TFetch,
}: PaginationTableProps<TData, TValue, TArgs, TFetch>) {
  const { ref: tableBodyRef, hasScrollbar } =
    useHasScrollbar<HTMLTableSectionElement>();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  });

  return (
    <div className="flex flex-col gap-4">
      {filter && (
        <Input
          placeholder="Search..."
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="min-w-64 w-1/3"
        />
      )}

      <div className="rounded-md border flex-1 overflow-hidden">
        <Table>
          <TableHeader
            className={`table table-fixed ${hasScrollbar ? "w-[calc(100%-0.5em)]" : "w-full"}`}
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

          <TableBody ref={tableBodyRef} className="block overflow-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="table table-fixed w-full"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 overflow-hidden overflow-ellipsis"
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
              <TableRow className="block">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="p-8 flex justify-center items-center"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-muted-foreground">Loading...</p>
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

      <div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
