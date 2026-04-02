import { runAppleScript } from "@enconvo/api";
import { esc, parseDelimited } from "./utils/mail_util.ts";

interface GetMessageParams {
  /** Message ID (numeric) @required */
  id: string;
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
  /** Return HTML source instead of plain text */
  prefer_html?: boolean;
}

/**
 * Get full message content including recipients and CC
 * @param {Request} req - Request object, body is {@link GetMessageParams}
 * @returns Full message with subject, sender, recipients, content, and metadata
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetMessageParams;

  if (!params.id || !params.account || !params.mailbox) {
    throw new Error("id, account, and mailbox are required");
  }

  const contentProp = params.prefer_html ? "source of msg" : "content of msg";

  const script = `
    tell application "Mail"
      tell account "${esc(params.account)}"
        set targetBox to first mailbox whose name is "${esc(params.mailbox)}"
        set msg to (first message of targetBox whose id is ${params.id})
        set msgSubject to subject of msg
        set msgSender to sender of msg
        set msgSenderName to extract name from sender of msg
        set msgSenderAddr to extract address from sender of msg
        set msgDate to date sent of msg as string
        set msgRead to read status of msg
        set msgFlagged to flagged status of msg
        set msgContent to ${contentProp}
        set numAttach to count of mail attachments of msg

        set recipList to ""
        repeat with r in to recipients of msg
          set recipList to recipList & address of r & ","
        end repeat

        set ccList to ""
        repeat with r in cc recipients of msg
          set ccList to ccList & address of r & ","
        end repeat

        return msgSubject & "$break" & msgSenderName & "$break" & msgSenderAddr & "$break" & msgDate & "$break" & msgRead & "$break" & msgFlagged & "$break" & numAttach & "$break" & recipList & "$break" & ccList & "$break" & msgContent & "$end"
      end tell
    end tell
  `;

  const data = await runAppleScript(script);
  const records = parseDelimited(data);
  if (records.length === 0) throw new Error("Message not found");

  const [subject, senderName, senderAddress, date, read, flagged, numAttachments, to, cc, content] = records[0];

  const result = {
    id: params.id,
    subject,
    senderName,
    senderAddress,
    date,
    read: read === "true",
    flagged: flagged === "true",
    numAttachments: parseInt(numAttachments),
    to: to ? to.split(",").filter(Boolean) : [],
    cc: cc ? cc.split(",").filter(Boolean) : [],
    content,
  };

  return Response.json({ result });
}
