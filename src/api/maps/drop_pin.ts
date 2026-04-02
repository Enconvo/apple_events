interface DropPinParams {
  /** Address or location to drop a pin at @required */
  address: string;
  /** Optional label for the pin */
  label?: string;
}

/**
 * Drop a pin at a location in Apple Maps
 * @param {Request} req - Request object, body is {@link DropPinParams}
 * @returns Pin drop result
 */
export default async function main(req: Request) {
  const params = await req.json() as DropPinParams;
  const { address, label } = params;

  if (!address) {
    throw new Error("Address is required");
  }

  const { dropPin } = await import("./utils/maps_util.ts");
  const result = await dropPin(address, label);

  return Response.json({ result });
}
