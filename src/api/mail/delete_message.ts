import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface DeleteMessageParams {
  /** Message ID or array of IDs @required */
  ids: string | string[];
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
}

/**
 * Delete one or more messages (moves to Trash)
 * @param {Request} req - Request object, body is {@link DeleteMessageParams}
 * @returns Confirmation with deleted message count
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteMessageParams;
  const ids = Array.isArray(params.ids) ? params.ids : [params.ids];

  if (!ids.length || !params.account || !params.mailbox) {
    throw new Error("ids, account, and mailbox are required");
  }

  const deleteStatements = ids
    .map((id) => `delete (first message of targetBox whose id is ${id})`)
    .join("\n        ");

  const script = `
    tell application "Mail"
      set targetBox to first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"
      ${deleteStatements}
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: `Deleted ${ids.length} message(s)` });
}
