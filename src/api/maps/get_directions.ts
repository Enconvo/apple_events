interface GetDirectionsParams {
  /** Starting address (omit for current location) */
  from_address?: string;
  /** Starting address (alias for from_address) */
  from?: string;
  /** Destination address @required */
  to_address?: string;
  /** Destination address (alias for to_address) */
  to?: string;
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
  const from_address = params.from_address || params.from;
  const to_address = params.to_address || params.to;
  const transport_type = params.transport_type;

  if (!to_address) {
    throw new Error("Destination address (to_address) is required");
  }

  const { getDirections } = await import("./utils/maps_util.ts");
  const result = await getDirections(from_address, to_address, transport_type || "driving");

  return Response.json({ result });
}
