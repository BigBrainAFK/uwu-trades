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
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
  Select,
  Input,
  Text,
  Button,
  Container,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
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
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      sorting,
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
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) return <></>;

                const meta: any = header.column.columnDef.meta;
                return (
                  <Th key={header.id} isNumeric={meta?.isNumeric}>
                    <VStack justify="center">
                      <HStack onClick={header.column.getToggleSortingHandler()}>
                        <Text>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Text>

                        {header.column.getIsSorted() ? (
                          <chakra.span pl="1">
                            {header.column.getIsSorted() === "desc" ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )}
                          </chakra.span>
                        ) : (
                          <></>
                        )}
                      </HStack>
                      {header.column.getCanFilter() ? (
                        <KeycapListingTableFilter
                          column={header.column}
                          table={table}
                        />
                      ) : (
                        <></>
                      )}
                    </VStack>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    <Flex justify="center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Flex>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex alignSelf="center" justifyItems="center" gap="2rem">
        <HStack>
          <Button
            onClick={() => table.setPageIndex(0)}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </HStack>
        <Container>
          <Text>Page</Text>
          <Text as="b">
            {`${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
          </Text>
        </Container>
        <Container>
          <HStack>
            <Text>Go to page:</Text>
            <Input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </HStack>
        </Container>
        <Select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </Flex>
    </>
  );
}
