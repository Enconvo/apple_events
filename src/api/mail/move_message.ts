import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface MoveMessageParams {
  /** Message ID or array of IDs @required */
  ids: string | string[];
  /** Source account name @required */
  account: string;
  /** Source mailbox name @required */
  mailbox: string;
  /** Destination mailbox name @required */
  to_mailbox: string;
  /** Destination account (if different from source) */
  to_account?: string;
}

/**
 * Move one or more messages to a different mailbox
 * @param {Request} req - Request object, body is {@link MoveMessageParams}
 * @returns Confirmation with moved message count
 */
export default async function main(req: Request) {
  const params = (await req.json()) as MoveMessageParams;
  const ids = Array.isArray(params.ids) ? params.ids : [params.ids];

  if (!ids.length || !params.account || !params.mailbox || !params.to_mailbox) {
    throw new Error("ids, account, mailbox, and to_mailbox are required");
  }

  const destAccount = params.to_account || params.account;

  const moveStatements = ids
    .map(
      (id) =>
        `set msg to (first message of sourceBox whose id is ${id})
        move msg to destBox`
    )
    .join("\n        ");

  const script = `
    tell application "Mail"
      set sourceBox to first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"
      set destBox to first mailbox of account "${esc(destAccount)}" whose name is "${esc(params.to_mailbox)}"
      ${moveStatements}
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: `Moved ${ids.length} message(s) to ${params.to_mailbox}` });
}
