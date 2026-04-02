import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface SaveAttachmentParams {
  /** Message ID (numeric) @required */
  id: string;
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
  /** Attachment name @required */
  attachment_name: string;
  /** Directory to save to @default "~/Desktop" */
  save_path?: string;
}

/**
 * Save an email attachment to disk
 * @param {Request} req - Request object, body is {@link SaveAttachmentParams}
 * @returns Confirmation with saved file path
 */
export default async function main(req: Request) {
  const params = (await req.json()) as SaveAttachmentParams;

  if (!params.id || !params.account || !params.mailbox || !params.attachment_name) {
    throw new Error("id, account, mailbox, and attachment_name are required");
  }

  const savePath = params.save_path || "~/Desktop";

  const script = `
    tell application "Mail"
      set targetBox to first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"
      set msg to (first message of targetBox whose id is ${params.id})
      set targetAtt to first mail attachment of msg whose name is "${esc(params.attachment_name)}"
      set savePath to POSIX path of (POSIX file "${esc(savePath)}")
      set saveFile to savePath & "/" & name of targetAtt
      save targetAtt in POSIX file saveFile
      return "Saved: " & saveFile
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
