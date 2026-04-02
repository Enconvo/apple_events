import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface CreateMailboxParams {
  /** Name of the new mailbox @required */
  name: string;
  /** Account to create the mailbox in */
  account?: string;
}

/**
 * Create a new mailbox in a mail account
 * @param {Request} req - Request object, body is {@link CreateMailboxParams}
 * @returns Confirmation message with mailbox name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as CreateMailboxParams;

  if (!params.name) throw new Error("Mailbox name is required");

  const target = params.account
    ? `account "${esc(params.account)}"`
    : `first account`;

  const script = `
    tell application "Mail"
      make new mailbox with properties {name:"${esc(params.name)}"} at ${target}
      return "Mailbox created: ${esc(params.name)}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
