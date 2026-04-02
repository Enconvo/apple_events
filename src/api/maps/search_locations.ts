interface SearchLocationsParams {
  /** Search query for locations @required */
  query: string;
}

/**
 * Search for locations in Apple Maps
 * @param {Request} req - Request object, body is {@link SearchLocationsParams}
 * @returns Array of matching locations
 */
export default async function main(req: Request) {
  const params = await req.json() as SearchLocationsParams;
  const { query } = params;

  if (!query) {
    throw new Error("Search query is required");
  }

  const { searchLocations } = await import("./utils/maps_util.ts");
  const result = await searchLocations(query);

  return Response.json({ result });
}
