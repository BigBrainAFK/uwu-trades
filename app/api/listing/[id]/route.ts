import { Database, authOptions } from "../../../../src/const";
import { getServerSession } from "next-auth";

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

export { deleteHandler as DELETE };
