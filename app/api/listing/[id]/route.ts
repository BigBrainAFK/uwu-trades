import { Database, authOptions } from "../../../../src/const";
import { getServerSession } from "next-auth";
import { KeycapListing } from "../../../../src/types";
import { getDiscordUser } from "../../../../src/util";
import countryFlags from "../../../../src/countryFlags.json";

async function getHandler(_: Request, { params }: { params: { id: string } }) {
  if (isNaN(parseInt(params.id))) {
    return Response.json({ error: "ID must be an integer" }, { status: 400 });
  }

  const listings = await Database.listing
    .findMany({
      where: { keycapId: parseInt(params.id) },
    })
    .then(async (listings) => {
      const formattedListings: KeycapListing[] = [];

      for (const listing of listings) {
        const user = await getDiscordUser(listing.userId);

        formattedListings.push({
          id: listing.id,
          user,
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

async function deleteHandler(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (
    session == null ||
    session.user.id == null ||
    session.user.id == undefined
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(parseInt(params.id))) {
    return Response.json({ error: "ID must be an integer" }, { status: 400 });
  }

  const listing = await Database.listing.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (listing == null) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  const response = await Database.listing
    .delete({ where: { id: parseInt(params.id) } })
    .then(() => Response.json({ success: true }, { status: 200 }))
    .catch((err) => Response.json({ error: err }, { status: 500 }));

  return response;
}

export { getHandler as GET, deleteHandler as DELETE };
