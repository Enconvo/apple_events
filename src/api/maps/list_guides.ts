/**
 * List all guides in Apple Maps
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of guides
 */
export default async function main(_req: Request) {
  const { listGuides } = await import("./utils/maps_util.ts");
  const result = await listGuides();

  return Response.json({ result });
}
