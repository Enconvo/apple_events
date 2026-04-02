interface FindNumberParams {
  /** Name of the contact to find phone numbers for @required */
  contact_name: string;
}

/**
 * Find phone numbers for a contact by name
 * @param {Request} req - Request object, body is {@link FindNumberParams}
 * @returns Contact with phone numbers, or null if not found
 */
export default async function main(req: Request) {
  const params = await req.json() as FindNumberParams;
  const { contact_name } = params;

  if (!contact_name) {
    throw new Error("Contact name is required");
  }

  const { findNumber } = await import("./utils/contacts_util.ts");
  const result = await findNumber(contact_name);

  if (!result) {
    return Response.json({ result: null, message: `No contact found matching "${contact_name}"` });
  }

  return Response.json({ result });
}
