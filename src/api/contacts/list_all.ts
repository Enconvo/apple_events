interface ListAllContactsParams {
  /** Maximum number of contacts to return @default 50 */
  limit?: number;
}

/**
 * List all contacts with optional limit
 * @param {Request} req - Request object, body is {@link ListAllContactsParams}
 * @returns Array of contacts
 */
export default async function main(req: Request) {
  const params = await req.json() as ListAllContactsParams;
  const limit = params.limit || 50;

  const { getAllContacts } = await import("./utils/contacts_util.ts");
  const result = await getAllContacts(limit);

  return Response.json({ result });
}
