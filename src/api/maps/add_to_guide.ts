interface AddToGuideParams {
  /** Name of the guide to add the location to @required */
  guide_name: string;
  /** Location search query @required */
  location_query: string;
}

/**
 * Add a location to an existing guide in Apple Maps
 * @param {Request} req - Request object, body is {@link AddToGuideParams}
 * @returns Confirmation of location added to guide
 */
export default async function main(req: Request) {
  const params = await req.json() as AddToGuideParams;
  const { guide_name, location_query } = params;

  if (!guide_name || !location_query) {
    throw new Error("Guide name and location query are required");
  }

  const { addToGuide } = await import("./utils/maps_util.ts");
  const result = await addToGuide(guide_name, location_query);

  return Response.json({ result });
}
