import { getEffectiveTypeParameterDeclarations } from "typescript";
import * as countries from "../../../../src/countries.json";

async function getHandler(
  _: Request,
  { params }: { params: { country: string } }
) {
  return Response.json(countries[params.country as keyof typeof countries]);
}

export { getHandler as GET };
