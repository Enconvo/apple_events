import { runAppleScript } from "@enconvo/api";
import { esc, parseDelimited } from "./utils/mail_util.ts";

interface ListMessagesParams {
  /** Mailbox name (defaults to INBOX) */
  mailbox?: string;
  /** Account name */
  account?: string;
  /** Maximum number of messages @default 20 */
  limit?: number;
  /** Number of messages to skip @default 0 */
  offset?: number;
  /** Filter by sender email or name */
  from?: string;
  /** Only show unread messages */
  unread_only?: boolean;
}

/**
 * List messages in a mailbox with pagination and filters
 * @param {Request} req - Request object, body is {@link ListMessagesParams}
 * @returns Array of messages with id, subject, sender, date, read/flagged status
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListMessagesParams;
  const mailbox = params.mailbox || "INBOX";
  const limit = Number(params.limit) || 20;
  const offset = Number(params.offset) || 0;
  const unreadOnly = params.unread_only || false;
  const fromFilter = params.from;

  let targetBoxScript: string;
  if (params.account) {
    targetBoxScript = `set targetBox to mailbox "${esc(mailbox)}" of account "${esc(params.account)}"`;
  } else {
    targetBoxScript = `
      set targetBox to missing value
      repeat with acct in every account
        try
          set targetBox to mailbox "${esc(mailbox)}" of acct
          exit repeat
        end try
      end repeat
      if targetBox is missing value then error "Mailbox ${mailbox} not found"`;
  }

  let whereClause = "";
  const conditions: string[] = [];
  if (unreadOnly) conditions.push("read status is false");
  if (fromFilter) conditions.push(`sender contains "${esc(fromFilter)}"`);
  if (conditions.length > 0) whereClause = ` whose ${conditions.join(" and ")}`;

  const script = `
    set output to ""
    tell application "Mail"
      ${targetBoxScript}
      set msgs to (every message of targetBox${whereClause})
      set msgCount to count of msgs
      set startIdx to ${offset} + 1
      set endIdx to ${offset} + ${limit}
      if endIdx > msgCount then set endIdx to msgCount
      repeat with i from startIdx to endIdx
        set msg to item i of msgs
        set senderName to extract name from sender of msg
        set senderAddr to extract address from sender of msg
        set output to output & (id of msg) & "$break" & (subject of msg) & "$break" & senderName & "$break" & senderAddr & "$break" & (date sent of msg as string) & "$break" & (read status of msg) & "$break" & (flagged status of msg) & "$break" & (count of mail attachments of msg) & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = parseDelimited(data);
  const result = records.map(([id, subject, senderName, senderAddress, date, read, flagged, numAttachments]) => ({
    id,
    subject,
    senderName,
    senderAddress,
    date,
    read: read === "true",
    flagged: flagged === "true",
    numAttachments: parseInt(numAttachments),
  }));

  return Response.json({ result });
}
