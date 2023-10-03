import { Database, authOptions } from "../../../src/const";
import type { KeycapListing } from "../../../src/types";
import {
  getDiscordUser,
  stringToExchangeType,
  stringToListingType,
} from "../../../src/util";
import { getServerSession } from "next-auth";
import countries from "../../../src/countries.json";
import countryFlags from "../../../src/countryFlags.json";

async function getHandler() {
  const listings = await Database.listing
    .findMany({
      include: { keycap: true },
    })
    .then(async (listings) => {
      const formattedListings: KeycapListing[] = [];

      for (const listing of listings) {
        const user = await getDiscordUser(listing.userId);

        formattedListings.push({
          id: listing.id,
          user,
          keycap: listing.keycap,
          type: listing.type,
          exchange: listing.exchange,
          country: {
            name: listing.country,
            flag:
              countryFlags.find((entry) => entry.name === listing.country)
                ?.emoji ?? "",
          },
          city: listing.nearestCity,
          actions: undefined,
        });
      }

      return formattedListings;
    });

  return Response.json(listings);
}

async function postHandler(req: Request) {
  const session = await getServerSession(authOptions);

  if (
    session == null ||
    session.user.id == null ||
    session.user.id == undefined
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keycap, type, exchange, country, city } = await req.json();

  if (typeof keycap !== "string" || isNaN(parseInt(keycap))) {
    return Response.json(
      { error: "Keycap must be a string containing an integer" },
      {
        status: 400,
      }
    );
  }
  if (typeof type !== "string") {
    return Response.json({ error: "Type must be a string" }, { status: 400 });
  }
  if (typeof exchange !== "string") {
    return Response.json(
      { error: "Exchange must be a string" },
      { status: 400 }
    );
  }
  if (typeof country !== "string") {
    return Response.json(
      { error: "Country must be a string" },
      { status: 400 }
    );
  }
  if (country !== "Unspecified" && !Object.keys(countries).includes(country)) {
    return Response.json(
      { error: `Invalid country '${country}'` },
      {
        status: 400,
      }
    );
  }
  if (typeof city !== "string") {
    return Response.json({ error: "City must be a string" }, { status: 400 });
  }
  if (
    city !== "Unspecified" &&
    !countries[country as keyof typeof countries]?.includes(city)
  ) {
    return Response.json(
      { error: `Invalid city '${city}' for country '${country}'` },
      {
        status: 400,
      }
    );
  }

  const userId = session.user.id;

  const listingType = stringToListingType(type);

  if (listingType == undefined) {
    return Response.json(
      { error: `Listing type not found for '${type}'` },
      {
        status: 400,
      }
    );
  }

  const exchangeType = stringToExchangeType(exchange);

  if (exchangeType == undefined) {
    return Response.json(
      { error: `Exchange type not found for '${exchange}'` },
      {
        status: 400,
      }
    );
  }

  await Database.listing.create({
    data: {
      userId,
      keycapId: parseInt(keycap),
      type: listingType,
      exchange: exchangeType,
      country,
      nearestCity: city,
    },
  });

  return Response.json({ success: true }, { status: 200 });
}

export { getHandler as GET, postHandler as POST };
