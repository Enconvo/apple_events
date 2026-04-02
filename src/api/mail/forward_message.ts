import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface ForwardMessageParams {
  /** Message ID (numeric) @required */
  id: string;
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
  /** Recipient email addresses @required */
  to: string[];
  /** Message to prepend */
  body?: string;
  /** Send immediately or save as draft @default true */
  send?: boolean;
}

/**
 * Forward a message to recipients with optional body prepend
 * @param {Request} req - Request object, body is {@link ForwardMessageParams}
 * @returns Confirmation that message was forwarded or draft created
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ForwardMessageParams;

  if (!params.id || !params.account || !params.mailbox || !params.to?.length) {
    throw new Error("id, account, mailbox, and to are required");
  }

  const shouldSend = params.send !== false;

  const toRecipients = params.to
    .map((addr) => `make new to recipient at end of to recipients with properties {address:"${esc(addr)}"}`)
    .join("\n        ");

  const prependBody = params.body
    ? `set content of fwdMsg to "${esc(params.body)}" & return & return & content of fwdMsg`
    : "";

  const script = `
    tell application "Mail"
      tell account "${esc(params.account)}"
        set targetBox to first mailbox whose name is "${esc(params.mailbox)}"
        set msg to (first message of targetBox whose id is ${params.id})
      end tell
      set fwdMsg to forward msg
      tell fwdMsg
        ${toRecipients}
      end tell
      ${prependBody}
      ${shouldSend ? "send fwdMsg" : 'set visible of fwdMsg to true\n      return "Forward draft created"'}
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: shouldSend ? "Message forwarded" : "Forward draft created" });
}
