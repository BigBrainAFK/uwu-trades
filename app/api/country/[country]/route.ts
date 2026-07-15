import * as countries from "../../../../src/countries.json";

async function getHandler(
  _: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  return Response.json(countries[country as keyof typeof countries]);
}

export { getHandler as GET };
