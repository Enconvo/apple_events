import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface CreateDraftParams {
  /** Recipient email addresses @required */
  to: string[];
  /** Email subject @required */
  subject: string;
  /** Email body @required */
  body: string;
  /** CC recipients */
  cc?: string[];
  /** BCC recipients */
  bcc?: string[];
  /** Account to create draft in */
  account?: string;
}

/**
 * Create an email draft with recipients and content
 * @param {Request} req - Request object, body is {@link CreateDraftParams}
 * @returns Confirmation message with draft subject
 */
export default async function main(req: Request) {
  const params = (await req.json()) as CreateDraftParams;

  if (!params.to?.length || !params.subject || !params.body) {
    throw new Error("to, subject, and body are required");
  }

  const toRecipients = params.to
    .map((addr) => `make new to recipient at end of to recipients with properties {address:"${esc(addr)}"}`)
    .join("\n        ");

  const ccRecipients = (params.cc || [])
    .map((addr) => `make new cc recipient at end of cc recipients with properties {address:"${esc(addr)}"}`)
    .join("\n        ");

  const bccRecipients = (params.bcc || [])
    .map((addr) => `make new bcc recipient at end of bcc recipients with properties {address:"${esc(addr)}"}`)
    .join("\n        ");

  const senderProp = params.account ? `, sender:"${esc(params.account)}"` : "";

  const script = `
    tell application "Mail"
      set newMsg to make new outgoing message with properties {subject:"${esc(params.subject)}", content:"${esc(params.body)}", visible:true${senderProp}}
      tell newMsg
        ${toRecipients}
        ${ccRecipients}
        ${bccRecipients}
      end tell
      return "Draft created: ${esc(params.subject)}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
