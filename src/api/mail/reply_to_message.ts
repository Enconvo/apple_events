import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface ReplyToMessageParams {
  /** Message ID (numeric) @required */
  id: string;
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
  /** Reply body @required */
  body: string;
  /** Reply to all recipients @default false */
  reply_all?: boolean;
  /** Send immediately or save as draft @default true */
  send?: boolean;
}

/**
 * Reply to a message with optional reply-all and send/draft options
 * @param {Request} req - Request object, body is {@link ReplyToMessageParams}
 * @returns Confirmation that reply was sent or draft created
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ReplyToMessageParams;

  if (!params.id || !params.account || !params.mailbox || !params.body) {
    throw new Error("id, account, mailbox, and body are required");
  }

  const replyAll = params.reply_all ? "with properties {reply to all:true}" : "";
  const shouldSend = params.send !== false;

  const script = `
    tell application "Mail"
      tell account "${esc(params.account)}"
        set targetBox to first mailbox whose name is "${esc(params.mailbox)}"
        set msg to (first message of targetBox whose id is ${params.id})
      end tell
      set replyMsg to reply msg ${replyAll}
      set content of replyMsg to "${esc(params.body)}" & return & return & content of replyMsg
      ${shouldSend ? "send replyMsg" : 'set visible of replyMsg to true\n      return "Reply draft created"'}
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: shouldSend ? "Reply sent" : "Reply draft created" });
}
