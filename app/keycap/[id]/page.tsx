"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { swrFetcher } from "../../../src/util";
import { KeycapListing } from "../../../src/types";
import { LoadingError } from "../../../src/components/LoadingError";
import Loading from "../../loading";
import { ListingActions } from "../../../src/components/ListingActions";
import { Keycap, ListingType } from "@prisma/client";
import KeyCapListingTable from "../../../src/components/KeycapListingTable";
import NotFound from "../../not-found";
import { isUndefined } from "swr/_internal";
import useSWR from "swr";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  if (isNaN(parseInt(id))) return router.replace("/");

  const { data: listings, error: listingsError } = useSWR<
    KeycapListing[],
    Error
  >(`/api/listing/${id}`, swrFetcher);
  const { data: keycap, error: keycapError } = useSWR<Keycap, Error>(
    `/api/keycap/${id}`,
    swrFetcher
  );

  if (listingsError || keycapError) return <LoadingError />;
  if (isUndefined(listings) || isUndefined(keycap)) return <Loading />;
  if ("error" in listings || "error" in keycap) return <NotFound />;

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
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="px-6 pt-4">
          <h2 className="text-lg font-bold">{keycap.name}</h2>
        </div>
        <div className="p-6">
          <div className="overflow-hidden rounded-[15px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="max-w-full object-cover"
              src={keycap.image}
              alt={keycap.name}
            />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <div>
            <h2 className="text-2xl font-bold">Has</h2>
            <KeyCapListingTable data={hasListings} />
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div>
            <h2 className="text-2xl font-bold">Wants</h2>
            <KeyCapListingTable data={wantListings} />
          </div>
        </div>
      </div>
    </div>
  );
}
