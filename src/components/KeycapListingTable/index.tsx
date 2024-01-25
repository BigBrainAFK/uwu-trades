import { Center, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { ExchangeType } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { KeycapListing } from "../../types";
import { KeyCapListingTableBody } from "./KeycapListingTableBody";

const ExchangeIcons: { [x in ExchangeType]: ReactNode } = {
  [ExchangeType.IRL]: <BsPeopleFill />,
  [ExchangeType.MAIL]: <AiOutlineMail />,
};

const columnHelper = createColumnHelper<KeycapListing>();

const columns = [
  columnHelper.accessor((row) => row.user.name, {
    cell: (data) => data.getValue(),
    footer: (props) => props.column.id,
    header: "Discord Username",
  }),
  columnHelper.accessor("exchange", {
    cell: (data) => {
      const value = data.getValue();
      return (
        <HStack spacing="4">
          <Text>
            {value == ExchangeType.IRL
              ? value
              : `${value.charAt(0)}${value.slice(1).toLowerCase()}`}
          </Text>
          <Text fontSize={{ base: "lg", "2xl": "4xl" }}>
            {ExchangeIcons[value]}
          </Text>
        </HStack>
      );
    },
    footer: (props) => props.column.id,
    header: "Exchange",
  }),
  columnHelper.accessor((row) => row.country.name, {
    cell: (data) =>
      data.getValue() === "Unspecified" ? (
        data.getValue()
      ) : (
        <HStack spacing="4">
          <Text>{data.getValue()}</Text>
          <Text fontSize={{ base: "lg", "2xl": "5xl" }}>
            {data.row.original.country.flag}
          </Text>
        </HStack>
      ),
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

interface Props {
  data: KeycapListing[];
}

export default function KeycapListingTable(props: Props) {
  if (props.data.length === 0)
    return (
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        flexGrow="1"
        mb="4"
      >
        <Heading size="sm">No listings</Heading>
      </Flex>
    );

  return <KeyCapListingTableBody {...props} columns={columns} />;
}
