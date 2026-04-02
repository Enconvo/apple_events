import { runAppleScript } from "@enconvo/api";

/**
 * Get total notes/folders count and per-account breakdown
 * @param {Request} _req - Request object (no parameters)
 * @returns Statistics with total_notes, total_folders, and accounts array
 */
export default async function main(_req: Request) {
  const script = `
    set output to ""
    tell application "Notes"
      set totalNotes to count of notes
      set totalFolders to count of folders
      set acctCount to 0
      repeat with acct in every account
        if acctCount > 0 then set output to output & "$end"
        set acctName to name of acct
        set acctNotes to count of notes of acct
        set acctFolders to count of folders of acct
        set output to output & acctName & "$break" & acctNotes & "$break" & acctFolders
        set acctCount to acctCount + 1
      end repeat
      return (totalNotes as string) & "$total" & (totalFolders as string) & "$total" & output
    end tell
  `;

  const data = await runAppleScript(script);
  const [totalNotesStr, totalFoldersStr, accountsData] = data.split("$total");

  const accounts = accountsData
    ? accountsData.split("$end").map((r) => {
        const [name, noteCount, folderCount] = r.split("$break");
        return { name, note_count: parseInt(noteCount), folder_count: parseInt(folderCount) };
      })
    : [];

  return Response.json({
    result: {
      total_notes: parseInt(totalNotesStr),
      total_folders: parseInt(totalFoldersStr),
      accounts,
    },
  });
}
