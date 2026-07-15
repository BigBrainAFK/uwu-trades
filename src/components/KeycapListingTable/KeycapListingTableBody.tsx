"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { KeycapListing } from "../../types";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { KeycapListingTableFilter } from "./KeycapListingTableFilter";
import { Button, inputClass } from "../ui";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

type DataTableProps = {
  data: KeycapListing[];
  columns: ColumnDef<KeycapListing, any>[];
};

export function KeyCapListingTableBody({ data, columns }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable<KeycapListing>({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onPaginationChange: setPagination,
  });
  const { status } = useSession();

  // Hide the Actions column if the user is not authenticated
  if (status !== "authenticated") {
    const actionColumn = table
      .getAllColumns()
      .find((col) => col.columnDef.header === "Actions");

    if (actionColumn?.getIsVisible()) actionColumn.toggleVisibility();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <table className="border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) return <th key={header.id} />;

                return (
                  <th key={header.id} className="px-4 py-2 align-top">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="flex cursor-pointer items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>

                        {header.column.getIsSorted() ? (
                          <span className="pl-1">
                            {header.column.getIsSorted() === "desc" ? (
                              <FaCaretDown aria-label="sorted descending" />
                            ) : (
                              <FaCaretUp aria-label="sorted ascending" />
                            )}
                          </span>
                        ) : null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <KeycapListingTableFilter
                          column={header.column}
                          table={table}
                        />
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  <div className="flex justify-center">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-8 self-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <span>Page</span>
          <span className="font-bold">
            {`${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Go to page:</span>
          <input
            type="number"
            className={`${inputClass} w-20`}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </div>
        <select
          className={inputClass}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 15, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
