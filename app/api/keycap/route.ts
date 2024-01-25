import { Database } from "../../../src/const";

async function getHandler() {
  const keycaps = await Database.keycap.findMany({ orderBy: { id: "asc" } });
  return Response.json(keycaps);
}

export { getHandler as GET };
