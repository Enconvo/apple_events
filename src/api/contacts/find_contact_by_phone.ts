interface FindContactByPhoneParams {
  /** Phone number to look up @required */
  phone_number?: string;
  /** Phone number to look up (alias for phone_number) */
  phoneNumber?: string;
}

/**
 * Find a contact by phone number
 * @param {Request} req - Request object, body is {@link FindContactByPhoneParams}
 * @returns Contact details, or null if not found
 */
export default async function main(req: Request) {
  const params = await req.json() as FindContactByPhoneParams;
  const phone_number = params.phone_number || params.phoneNumber;

  if (!phone_number) {
    throw new Error("Phone number is required");
  }

  const { findContactByPhone } = await import("./utils/contacts_util.ts");
  const result = await findContactByPhone(phone_number);

  if (!result) {
    return Response.json({ result: null, message: `No contact found for phone number "${phone_number}"` });
  }

  return Response.json({ result });
}
