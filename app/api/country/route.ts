import * as countries from "../../../src/countries.json";

async function getHandler() {
  return Response.json(
    Object.keys(countries).filter((name) => name !== "default")
  );
}

export { getHandler as GET };
