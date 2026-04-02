interface SendMessageParams {
  /** Phone number or email of the recipient @required */
  recipient: string;
  /** Message content to send @required */
  message: string;
}

/**
 * Send an iMessage to a recipient
 * @param {Request} req - Request object, body is {@link SendMessageParams}
 * @returns Confirmation that the message was sent
 */
export default async function main(req: Request) {
  const params = await req.json() as SendMessageParams;
  const { recipient, message } = params;

  if (!recipient || !message) {
    throw new Error("Recipient and message are required");
  }

  const { sendMessage } = await import("./utils/message_util.ts");
  const result = await sendMessage(recipient, message);

  return Response.json({ result });
}
