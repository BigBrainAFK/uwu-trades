"use client";

import { Flex, Heading } from "@chakra-ui/react";
import { KeyCapListingTable } from "../src/components/KeycapListingTable/KeycapListingTable";
import type { KeycapListing } from "../src/types";
import { LoadingError } from "../src/components/LoadingError";
import useSWR from "swr";
import { swrFetcher } from "../src/util";
import { Loading } from "../src/components/Loading";
import { ListingActions } from "../src/components/ListingActions";

export default function Page() {
  const { data: listings, error } = useSWR<KeycapListing[], Error>(
    "/api/listing",
    swrFetcher
  );

  if (error) return <LoadingError />;
  if (listings == undefined) return <Loading />;

  if (listings.length === 0) {
    return (
      <Heading as="h1" size="xl">
        No listings found
      </Heading>
    );
  }

  const formattedListings = listings.map((listing) => ({
    ...listing,
    actions: <ListingActions id={listing.id} userId={listing.user.id} />,
  }));

  return (
    <Flex alignItems="flex-start" flexDirection="column" flexGrow="1">
      <KeyCapListingTable data={formattedListings} />
    </Flex>
  );
}
