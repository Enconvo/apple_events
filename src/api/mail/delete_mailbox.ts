import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface DeleteMailboxParams {
  /** Name of the mailbox to delete @required */
  name: string;
  /** Account containing the mailbox */
  account?: string;
}

/**
 * Delete a mailbox from a mail account
 * @param {Request} req - Request object, body is {@link DeleteMailboxParams}
 * @returns Confirmation message with mailbox name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteMailboxParams;

  if (!params.name) throw new Error("Mailbox name is required");

  const target = params.account
    ? `mailbox "${esc(params.name)}" of account "${esc(params.account)}"`
    : `mailbox "${esc(params.name)}" of first account`;

  const script = `
    tell application "Mail"
      delete ${target}
      return "Mailbox deleted: ${esc(params.name)}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
