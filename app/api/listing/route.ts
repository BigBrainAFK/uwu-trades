import { Database, authOptions } from "../../../src/const";
import { stringToExchangeType, stringToListingType } from "../../../src/util";
import { getServerSession } from "next-auth";
import countries from "../../../src/countries.json";

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

export { postHandler as POST };
