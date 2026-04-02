import { runAppleScript } from "@enconvo/api";
import { esc } from "./utils/mail_util.ts";

interface DisableRuleParams {
  /** Rule name @required */
  name: string;
}

/**
 * Disable a mail rule by name
 * @param {Request} req - Request object, body is {@link DisableRuleParams}
 * @returns Confirmation message
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DisableRuleParams;

  if (!params.name) throw new Error("Rule name is required");

  const script = `
    tell application "Mail"
      set enabled of rule "${esc(params.name)}" to false
      return "Rule disabled: ${esc(params.name)}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
