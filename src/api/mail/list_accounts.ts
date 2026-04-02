import { runAppleScript } from "@enconvo/api";
import { parseDelimited } from "./utils/mail_util.ts";

/**
 * List all mail accounts with name, email, and full name
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of accounts with name, email, and fullName
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
        set acctFullName to full name of acct
        set output to output & acctName & "$break" & acctEmail & "$break" & acctFullName & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  const records = parseDelimited(data);
  const result = records.map(([name, email, fullName]) => ({ name, email, fullName }));

  return Response.json({ result });
}
