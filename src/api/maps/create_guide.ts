interface CreateGuideParams {
  /** Name for the new guide @required */
  name: string;
}

/**
 * Create a new guide in Apple Maps
 * @param {Request} req - Request object, body is {@link CreateGuideParams}
 * @returns Guide creation result
 */
export default async function main(req: Request) {
  const params = await req.json() as CreateGuideParams;
  const { name } = params;

  if (!name) {
    throw new Error("Guide name is required");
  }

  const { createGuide } = await import("./utils/maps_util.ts");
  const result = await createGuide(name);

  return Response.json({ result });
}
