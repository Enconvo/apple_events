interface ReadMessagesParams {
  /** Phone number to read messages from @required */
  phone_number: string;
  /** Maximum number of messages to return @default 10 */
  limit?: number;
}

/**
 * Read message history from a specific phone number
 * @param {Request} req - Request object, body is {@link ReadMessagesParams}
 * @returns Array of messages from the conversation
 */
export default async function main(req: Request) {
  const params = await req.json() as ReadMessagesParams;
  const { phone_number, limit } = params;

  if (!phone_number) {
    throw new Error("Phone number is required");
  }

  const { readMessages } = await import("./utils/message_util.ts");
  const result = await readMessages(phone_number, limit || 10);

  return Response.json({ result });
}
