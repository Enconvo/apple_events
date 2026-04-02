import { runAppleScript } from "@enconvo/api";
import { esc, parseDelimited } from "./utils/mail_util.ts";

interface ListAttachmentsParams {
  /** Message ID (numeric) @required */
  id: string;
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
}

/**
 * List attachments of a specific email message
 * @param {Request} req - Request object, body is {@link ListAttachmentsParams}
 * @returns Array of attachments with name, size, and mimeType
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListAttachmentsParams;

  if (!params.id || !params.account || !params.mailbox) {
    throw new Error("id, account, and mailbox are required");
  }

  const script = `
    set output to ""
    tell application "Mail"
      set targetBox to first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"
      set msg to (first message of targetBox whose id is ${params.id})
      repeat with att in mail attachments of msg
        set attName to name of att
        set attSize to file size of att
        set attType to MIME type of att
        set output to output & attName & "$break" & attSize & "$break" & attType & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = parseDelimited(data);
  const result = records.map(([name, size, mimeType]) => ({
    name,
    size: parseInt(size),
    mimeType,
  }));

  return Response.json({ result });
}
