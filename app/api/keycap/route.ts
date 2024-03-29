import { Database } from "../../../src/const";

async function getHandler() {
  const keycaps = await Database.keycap.findMany({ orderBy: { name: "asc" } });
  return Response.json(keycaps);
}

export { getHandler as GET };
