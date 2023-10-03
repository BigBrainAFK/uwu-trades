"use client";

import {
  ColumnFiltersState,
  FilterFn,
  createColumnHelper,
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
import { ExchangeType } from "@prisma/client";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { KeycapListingTableFilter } from "./KeycapListingTableFilter";
import { Keycap } from "../Keycap";

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

const columnHelper = createColumnHelper<KeycapListing>();

const columns = [
  columnHelper.accessor("user", {
    cell: (data) => data.getValue().name,
    footer: (props) => props.column.id,
    header: "Discord Username",
  }),
  columnHelper.accessor("type", {
    cell: (data) =>
      `${data.getValue().charAt(0)}${data.getValue().slice(1).toLowerCase()}`,
    footer: (props) => props.column.id,
    header: "Type",
  }),
  columnHelper.accessor((row) => row.keycap.name, {
    cell: (data) => data.getValue(),
    footer: (props) => props.column.id,
    id: "keycapName",
    header: "Keycap Name",
  }),
  columnHelper.accessor("keycap", {
    cell: (data) => {
      const { name, image } = data.getValue();
      return <Keycap name={name} image={image} />;
    },
    footer: (props) => props.column.id,
    id: "keycapImage",
    header: "Image",
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
  columnHelper.accessor("exchange", {
    cell: (data) => {
      const value = data.getValue();
      return value == ExchangeType.IRL
        ? value
        : `${value.charAt(0)}${value.slice(1).toLowerCase()}`;
    },
    footer: (props) => props.column.id,
    header: "Exchange",
  }),
  columnHelper.accessor("country", {
    cell: (data) => data.getValue(),
    footer: (props) => props.column.id,
    header: "Country",
  }),
  columnHelper.accessor("city", {
    cell: (data) => data.getValue(),
    footer: (props) => props.column.id,
    header: "Nearest city",
  }),
  columnHelper.accessor("actions", {
    cell: (data) => data.getValue(),
    footer: (props) => props.column.id,
    header: "Actions",
    enableHiding: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
];

export type DataTableProps = {
  data: KeycapListing[];
};

export function KeyCapListingTable({ data }: DataTableProps) {
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
