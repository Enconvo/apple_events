import { runAppleScript } from "@enconvo/api";
import { esc, parseDelimited } from "./utils/mail_util.ts";

interface SearchMessagesParams {
  /** Text to search in subject, sender, or content */
  query?: string;
  /** Filter by sender email address or name */
  from?: string;
  /** Filter by subject line */
  subject?: string;
  /** Mailbox to search in */
  mailbox?: string;
  /** Account to search in */
  account?: string;
  /** Filter by read status */
  is_read?: boolean;
  /** Filter by flagged status */
  is_flagged?: boolean;
  /** Start date (YYYY-MM-DD) */
  date_from?: string;
  /** End date (YYYY-MM-DD) */
  date_to?: string;
  /** Maximum number of results @default 20 */
  limit?: number;
}

/**
 * Search messages with query, sender, subject, date, and status filters
 * @param {Request} req - Request object, body is {@link SearchMessagesParams}
 * @returns Array of matching messages with id, subject, sender, date, status
 */
export default async function main(req: Request) {
  const params = (await req.json()) as SearchMessagesParams;
  const limit = Number(params.limit) || 20;

  const conditions: string[] = [];
  if (params.query) conditions.push(`(subject of msg contains "${esc(params.query)}" or sender of msg contains "${esc(params.query)}")`);
  if (params.from) conditions.push(`sender of msg contains "${esc(params.from)}"`);
  if (params.subject) conditions.push(`subject of msg contains "${esc(params.subject)}"`);
  if (params.is_read === true) conditions.push("read status of msg is true");
  if (params.is_read === false) conditions.push("read status of msg is false");
  if (params.is_flagged === true) conditions.push("flagged status of msg is true");
  if (params.is_flagged === false) conditions.push("flagged status of msg is false");

  const filterCondition = conditions.length > 0
    ? `if ${conditions.join(" and ")} then`
    : "if true then";

  let dateFromCheck = "";
  let dateToCheck = "";
  if (params.date_from) {
    dateFromCheck = `
              set df to date "${params.date_from}"
              if (date sent of msg) < df then set skip to true`;
  }
  if (params.date_to) {
    dateToCheck = `
              set dt to (date "${params.date_to}") + 1 * days
              if (date sent of msg) > dt then set skip to true`;
  }

  const mailboxScope = params.account
    ? params.mailbox
      ? `{first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"}`
      : `every mailbox of account "${esc(params.account)}"`
    : params.mailbox
      ? `{first mailbox of first account whose name is "${esc(params.mailbox)}"}`
      : `every mailbox of every account`;

  // For a simple, reliable search: iterate messages in INBOX by default
  const targetMailbox = params.mailbox || "INBOX";
  const accountRef = params.account
    ? `account "${esc(params.account)}"`
    : `first account`;

  const script = `
    set output to ""
    set matchCount to 0
    tell application "Mail"
      set targetBox to first mailbox of ${accountRef} whose name is "${esc(targetMailbox)}"
      set allMsgs to every message of targetBox
      set totalMsgs to count of allMsgs
      repeat with i from 1 to totalMsgs
        if matchCount ≥ ${limit} then exit repeat
        set msg to item i of allMsgs
        set skip to false
        ${dateFromCheck}
        ${dateToCheck}
        if skip is false then
          ${filterCondition}
            set senderName to extract name from sender of msg
            set senderAddr to extract address from sender of msg
            set output to output & (id of msg) & "$break" & (subject of msg) & "$break" & senderName & "$break" & senderAddr & "$break" & (date sent of msg as string) & "$break" & (read status of msg) & "$break" & (flagged status of msg) & "$break" & (count of mail attachments of msg) & "$end"
            set matchCount to matchCount + 1
          end if
        end if
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
