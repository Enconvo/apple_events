import { runAppleScript } from "@enconvo/api";

interface ListFoldersParams {
  /** Account to list folders from */
  account?: string;
}

/**
 * List all folders in Apple Notes with note counts
 * @param {Request} req - Request object, body is {@link ListFoldersParams}
 * @returns Array of folders with id, name, and note_count
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListFoldersParams;

  const foldersSource = params.account
    ? `folders of account ${JSON.stringify(params.account)}`
    : `folders`;

  const script = `
    set output to ""
    tell application "Notes"
      set folderCount to 0
      repeat with aFolder in ${foldersSource}
        if folderCount > 0 then set output to output & "$end"
        set output to output & (id of aFolder as string) & "$break" & (name of aFolder as string) & "$break" & (count of notes of aFolder)
        set folderCount to folderCount + 1
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = data.split("$end");
  const result = records.map((r) => {
    const [id, name, noteCount] = r.split("$break");
    return { id, name, note_count: parseInt(noteCount) };
  });

  return Response.json({ result });
}
