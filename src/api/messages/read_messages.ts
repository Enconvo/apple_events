interface ReadMessagesParams {
  /** Phone number or chat ID to read messages from @required */
  phone_number?: string;
  /** Phone number (alias for phone_number) */
  phoneNumber?: string;
  /** Chat ID (alias for phone_number) */
  chatId?: string;
  /** Maximum number of messages to return @default 10 */
  limit?: number;
}

/**
 * Read message history from a specific phone number or chat ID
 * @param {Request} req - Request object, body is {@link ReadMessagesParams}
 * @returns Array of messages from the conversation
 */
export default async function main(req: Request) {
  const params = await req.json() as ReadMessagesParams;
  const phone_number = params.phone_number || params.phoneNumber || params.chatId;
  const limit = params.limit;

  if (!phone_number) {
    throw new Error("Phone number or chat ID is required");
  }

  const { readMessages } = await import("./utils/message_util.ts");
  const result = await readMessages(phone_number, limit || 10);

  return Response.json({ result });
}
