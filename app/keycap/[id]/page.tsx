"use client";

import { useRouter } from "next/navigation";
import { swrFetcher } from "../../../src/util";
import useSWR from "swr";
import { KeycapListing } from "../../../src/types";
import { LoadingError } from "../../../src/components/LoadingError";
import Loading from "../../loading";
import {
  Box,
  VStack,
  Image,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { ListingActions } from "../../../src/components/ListingActions";
import { Keycap, ListingType } from "@prisma/client";
import KeyCapListingTable from "../../../src/components/KeycapListingTable";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  if (isNaN(parseInt(params.id))) return router.replace("/");

  const { data: listings, error: listingsError } = useSWR<
    KeycapListing[],
    Error
  >(`/api/listing/${params.id}`, swrFetcher);
  const { data: keycap, error: keycapError } = useSWR<Keycap, Error>(
    `/api/keycap/${params.id}`,
    swrFetcher
  );

  if (listingsError || keycapError) return <LoadingError />;
  if (listings == undefined || keycap == undefined) return <Loading />;

  const formattedListings = listings.map((listing) => ({
    ...listing,
    actions: <ListingActions id={listing.id} userId={listing.user.id} />,
  }));

  const [hasListings, wantListings] = formattedListings.reduce(
    (acc, listing) => {
      if (listing.type === ListingType.HAS) {
        acc[0].push(listing);
      } else {
        acc[1].push(listing);
      }
      return acc;
    },
    [[], []] as [KeycapListing[], KeycapListing[]]
  );

  return (
    <VStack spacing={4}>
      <Card>
        <CardHeader>
          <Heading size="md">{keycap.name}</Heading>
        </CardHeader>
        <CardBody>
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "200px" }}
            src={keycap.image}
            alt={keycap.name}
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Box>
            <Heading as="h2" size="lg">
              Has
            </Heading>
            <KeyCapListingTable data={hasListings} />
          </Box>
          <hr />
          <Box>
            <Heading as="h2" size="lg">
              Wants
            </Heading>
            <KeyCapListingTable data={wantListings} />
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
}
