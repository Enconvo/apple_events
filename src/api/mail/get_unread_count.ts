import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface GetUnreadCountParams {
  /** Mailbox name (defaults to INBOX) */
  mailbox?: string;
  /** Account name */
  account?: string;
}

/**
 * Get unread message count for a mailbox, summing across accounts if no account specified
 * @param {Request} req - Request object, body is {@link GetUnreadCountParams}
 * @returns The mailbox name and unread count
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetUnreadCountParams;
  const mailbox = params.mailbox || "INBOX";
  const account = params.account;

  let script: string;
  if (account) {
    script = `
      tell application "Mail"
        return unread count of mailbox "${esc(mailbox)}" of account "${esc(account)}"
      end tell
    `;
  } else {
    script = `
      tell application "Mail"
        set total to 0
        repeat with acct in every account
          try
            set total to total + (unread count of mailbox "${esc(mailbox)}" of acct)
          end try
        end repeat
        return total
      end tell
    `;
  }

  const count = await runAppleScript(script);

  return Response.json({ result: { mailbox, unreadCount: parseInt(count) } });
}
