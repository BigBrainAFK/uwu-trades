import { HStack, Text } from "@chakra-ui/react";
import { ExchangeType } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { KeycapListing } from "../../types";
import { Keycap } from "../Keycap";
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
      return (
        <HStack spacing="4">
          <Text>
            {value == ExchangeType.IRL
              ? value
              : `${value.charAt(0)}${value.slice(1).toLowerCase()}`}
          </Text>
          <Text fontSize="4xl">{ExchangeIcons[value]}</Text>
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
          <Text fontSize="5xl">{data.row.original.country.flag}</Text>
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
  return <KeyCapListingTableBody {...props} columns={columns} />;
}
