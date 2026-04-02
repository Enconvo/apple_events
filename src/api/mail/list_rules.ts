import { runAppleScript } from "@enconvo/api";
import { parseDelimited } from "./utils/mail_util.ts";

/**
 * List all mail rules with enabled status
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of rules with name and enabled status
 */
export default async function main(_req: Request) {
  const script = `
    set output to ""
    tell application "Mail"
      repeat with r in every rule
        set ruleName to name of r
        set ruleEnabled to enabled of r
        set output to output & ruleName & "$break" & ruleEnabled & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = parseDelimited(data);
  const result = records.map(([name, enabled]) => ({
    name,
    enabled: enabled === "true",
  }));

  return Response.json({ result });
}
