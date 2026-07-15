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
        <div className="flex items-center gap-4">
          <span>
            {value == ExchangeType.IRL
              ? "IRL"
              : `${value.charAt(0).toUpperCase()}${value
                  .slice(1)
                  .toLowerCase()}`}
          </span>
          <span className="text-lg 2xl:text-4xl">{ExchangeIcons[value]}</span>
        </div>
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
        <div className="flex items-center gap-4">
          <span>{data.getValue()}</span>
          <span className="text-lg 2xl:text-5xl">
            {data.row.original.country.flag}
          </span>
        </div>
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
      <div className="mb-4 flex flex-grow flex-col items-center justify-center">
        <h3 className="text-sm font-bold">No listings</h3>
      </div>
    );

  return <KeyCapListingTableBody {...props} columns={columns} />;
}
