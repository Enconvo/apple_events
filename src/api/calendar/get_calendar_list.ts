import { runAppleScript } from "@enconvo/api";

/**
 * Get list of all calendars with name and description
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of calendars with name and description
 */
export default async function main(_req: Request) {
  const script = `
    tell application "Calendar"
      set calList to {}
      repeat with aCal in calendars
        set calName to name of aCal as string
        set calDescription to description of aCal as string
        set calInfo to "{\\"name\\":\\"" & calName & "\\",\\"description\\":\\"" & calDescription & "\\"}"
        set end of calList to calInfo
      end repeat
      return "[" & my joinList(calList, ",") & "]"
    end tell

    on joinList(theList, delimiter)
      set AppleScript's text item delimiters to delimiter
      set theString to theList as string
      set AppleScript's text item delimiters to ""
      return theString
    end joinList
  `;

  const results = await runAppleScript(script);

  return Response.json({ result: JSON.parse(results) })
}
