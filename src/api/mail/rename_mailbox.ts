import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface RenameMailboxParams {
  /** Current mailbox name @required */
  old_name: string;
  /** New mailbox name @required */
  new_name: string;
  /** Account containing the mailbox */
  account?: string;
}

/**
 * Rename an existing mailbox
 * @param {Request} req - Request object, body is {@link RenameMailboxParams}
 * @returns Confirmation message with old and new names
 */
export default async function main(req: Request) {
  const params = (await req.json()) as RenameMailboxParams;

  if (!params.old_name || !params.new_name) throw new Error("Both old_name and new_name are required");

  const target = params.account
    ? `mailbox "${esc(params.old_name)}" of account "${esc(params.account)}"`
    : `mailbox "${esc(params.old_name)}" of first account`;

  const script = `
    tell application "Mail"
      set name of ${target} to "${esc(params.new_name)}"
      return "Mailbox renamed from ${esc(params.old_name)} to ${esc(params.new_name)}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
