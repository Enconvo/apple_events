import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface SendEmailParams {
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
  /** Account to send from */
  account?: string;
  /** File paths to attach (max 20) */
  attachments?: string[];
}

/**
 * Send an email with optional CC, BCC, and attachments
 * @param {Request} req - Request object, body is {@link SendEmailParams}
 * @returns Confirmation that the email was sent
 */
export default async function main(req: Request) {
  const params = (await req.json()) as SendEmailParams;

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

  const attachmentScript = (params.attachments || [])
    .slice(0, 20)
    .map(
      (path) => `
        try
          make new attachment with properties {file name:POSIX file "${esc(path)}"} at after last paragraph
          delay 1
        end try`
    )
    .join("\n");

  const script = `
    tell application "Mail"
      set newMsg to make new outgoing message with properties {subject:"${esc(params.subject)}", content:"${esc(params.body)}", visible:false${senderProp}}
      tell newMsg
        ${toRecipients}
        ${ccRecipients}
        ${bccRecipients}
        ${attachmentScript}
      end tell
      send newMsg
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: "Email sent successfully" });
}
