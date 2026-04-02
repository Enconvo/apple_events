import { runAppleScript } from "@enconvo/api";
import { esc, parseDelimited } from "./utils/mail_util.ts";

interface ListMailboxesParams {
  /** Account name to list mailboxes from */
  account?: string;
}

/**
 * List mailboxes with unread counts, optionally filtered by account
 * @param {Request} req - Request object, body is {@link ListMailboxesParams}
 * @returns Array of mailboxes with name and unreadCount
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListMailboxesParams;
  const account = params.account;

  const target = account
    ? `every mailbox of account "${esc(account)}"`
    : `every mailbox of every account`;

  const script = account
    ? `
      set output to ""
      tell application "Mail"
        repeat with box in every mailbox of account "${esc(account)}"
          set boxName to name of box
          set unread to unread count of box
          set output to output & boxName & "$break" & unread & "$end"
        end repeat
      end tell
      return output
    `
    : `
      set output to ""
      tell application "Mail"
        repeat with acct in every account
          set acctName to name of acct
          repeat with box in every mailbox of acct
            set boxName to name of box
            set unread to unread count of box
            set output to output & acctName & "$break" & boxName & "$break" & unread & "$end"
          end repeat
        end repeat
      end tell
      return output
    `;

  const data = await runAppleScript(script);
  const records = parseDelimited(data);

  const result = account
    ? records.map(([name, unreadCount]) => ({ name, unreadCount: parseInt(unreadCount) }))
    : records.map(([accountName, name, unreadCount]) => ({
        account: accountName,
        name,
        unreadCount: parseInt(unreadCount),
      }));

  return Response.json({ result });
}
