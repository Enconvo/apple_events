interface SaveLocationParams {
  /** Name to save the location as @required */
  name: string;
  /** Address of the location @required */
  address: string;
}

/**
 * Save a location as a favorite in Apple Maps
 * @param {Request} req - Request object, body is {@link SaveLocationParams}
 * @returns Save confirmation
 */
export default async function main(req: Request) {
  const params = await req.json() as SaveLocationParams;
  const { name, address } = params;

  if (!name || !address) {
    throw new Error("Name and address are required");
  }

  const { saveLocation } = await import("./utils/maps_util.ts");
  const result = await saveLocation(name, address);

  return Response.json({ result });
}
