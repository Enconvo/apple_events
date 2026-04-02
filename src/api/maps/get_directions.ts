interface GetDirectionsParams {
  /** Starting address (omit for current location) */
  from_address?: string;
  /** Destination address @required */
  to_address: string;
  /** Transport type @default "driving" */
  transport_type?: "driving" | "walking" | "transit";
}

/**
 * Get directions between two locations in Apple Maps
 * @param {Request} req - Request object, body is {@link GetDirectionsParams}
 * @returns Directions result
 */
export default async function main(req: Request) {
  const params = await req.json() as GetDirectionsParams;
  const { from_address, to_address, transport_type } = params;

  if (!to_address) {
    throw new Error("Destination address (to_address) is required");
  }

  const { getDirections } = await import("./utils/maps_util.ts");
  const result = await getDirections(from_address, to_address, transport_type || "driving");

  return Response.json({ result });
}
