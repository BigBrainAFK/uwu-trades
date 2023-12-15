import { Database } from "../../../../src/const";

async function getHandler(_: Request, { params }: { params: { id: string } }) {
  if (isNaN(parseInt(params.id))) {
    return Response.json({ error: "ID must be an integer" }, { status: 400 });
  }

  const keycap = await Database.keycap.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (keycap == null) {
    return Response.json({ error: "Keycap not found" }, { status: 404 });
  }

  return Response.json(keycap);
}

export { getHandler as GET };
