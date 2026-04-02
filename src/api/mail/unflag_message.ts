import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface UnflagMessageParams {
  /** Message ID or array of IDs @required */
  ids: string | string[];
  /** Account name @required */
  account: string;
  /** Mailbox name @required */
  mailbox: string;
}

/**
 * Remove flag from one or more messages
 * @param {Request} req - Request object, body is {@link UnflagMessageParams}
 * @returns Confirmation with unflagged message count
 */
export default async function main(req: Request) {
  const params = (await req.json()) as UnflagMessageParams;
  const ids = Array.isArray(params.ids) ? params.ids : [params.ids];

  if (!ids.length || !params.account || !params.mailbox) {
    throw new Error("ids, account, and mailbox are required");
  }

  const statements = ids
    .map((id) => `set flagged status of (first message of targetBox whose id is ${id}) to false`)
    .join("\n        ");

  const script = `
    tell application "Mail"
      set targetBox to first mailbox of account "${esc(params.account)}" whose name is "${esc(params.mailbox)}"
      ${statements}
    end tell
  `;

  await runAppleScript(script);
  return Response.json({ result: `Unflagged ${ids.length} message(s)` });
}
