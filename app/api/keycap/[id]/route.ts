import { Database } from "../../../../src/db";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (isNaN(parseInt(id))) {
    return Response.json({ error: "ID must be an integer" }, { status: 400 });
  }

  const keycap = await Database.keycap.findUnique({
    where: { id: parseInt(id) },
  });

  if (keycap == null) {
    return Response.json({ error: "Keycap not found" }, { status: 404 });
  }

  return Response.json(keycap);
}

export { getHandler as GET };
