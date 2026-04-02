import { runAppleScript } from "@enconvo/api";
import { parseDelimited } from "./utils/mail_util.ts";

/**
 * Get per-account inbox statistics including total and unread message counts
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of accounts with name, email, totalMessages, and unreadMessages
 */
export default async function main(_req: Request) {
  const script = `
    set output to ""
    tell application "Mail"
      repeat with acct in every account
        set acctName to name of acct
        set acctEmails to email addresses of acct
        if (count of acctEmails) > 0 then
          set acctEmail to item 1 of acctEmails
        else
          set acctEmail to ""
        end if
        try
          set inboxBox to first mailbox of acct whose name is "INBOX"
          set inboxTotal to count of messages of inboxBox
          set inboxUnread to unread count of inboxBox
        on error
          set inboxTotal to 0
          set inboxUnread to 0
        end try
        set output to output & acctName & "$break" & acctEmail & "$break" & inboxTotal & "$break" & inboxUnread & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = parseDelimited(data);
  const result = records.map(([name, email, totalMessages, unreadMessages]) => ({
    name,
    email,
    totalMessages: parseInt(totalMessages),
    unreadMessages: parseInt(unreadMessages),
  }));

  return Response.json({ result });
}
