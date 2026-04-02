import { runAppleScript } from "@enconvo/api";

/**
 * List all Notes accounts with note and folder counts
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of accounts with id, name, note_count, and folder_count
 */
export default async function main(_req: Request) {
  const script = `
    set output to ""
    tell application "Notes"
      set acctCount to 0
      repeat with acct in every account
        if acctCount > 0 then set output to output & "$end"
        set acctName to name of acct
        set acctId to id of acct as string
        set noteCount to count of notes of acct
        set folderCount to count of folders of acct
        set output to output & acctId & "$break" & acctName & "$break" & noteCount & "$break" & folderCount
        set acctCount to acctCount + 1
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = data.split("$end");
  const result = records.map((r) => {
    const [id, name, noteCount, folderCount] = r.split("$break");
    return { id, name, note_count: parseInt(noteCount), folder_count: parseInt(folderCount) };
  });

  return Response.json({ result });
}
