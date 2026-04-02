interface SearchContactsParams {
  /** Search query (name, phone, or email) @required */
  query: string;
}

/**
 * Search contacts by name, phone, or email
 * @param {Request} req - Request object, body is {@link SearchContactsParams}
 * @returns Array of matching contacts
 */
export default async function main(req: Request) {
  const params = await req.json() as SearchContactsParams;
  const { query } = params;

  if (!query) {
    throw new Error("Search query is required");
  }

  const { searchContacts } = await import("./utils/contacts_util.ts");
  const result = await searchContacts(query);

  return Response.json({ result });
}
