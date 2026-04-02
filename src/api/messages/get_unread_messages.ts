interface GetUnreadMessagesParams {
  /** Maximum number of unread messages to return @default 10 */
  limit?: number;
}

/**
 * Get recent unread iMessages
 * @param {Request} req - Request object, body is {@link GetUnreadMessagesParams}
 * @returns Array of unread messages
 */
export default async function main(req: Request) {
  const params = await req.json() as GetUnreadMessagesParams;
  const limit = params.limit || 10;

  const { getUnreadMessages } = await import("./utils/message_util.ts");
  const result = await getUnreadMessages(limit);

  return Response.json({ result });
}
