import { runAppleScript } from "@enconvo/api";

interface ListNotesParams {
  /** Optional folder name to filter notes */
  folder?: string;
  /** Account to list notes from */
  account?: string;
  /** Only return notes modified after this ISO date (YYYY-MM-DD) */
  modified_since?: string;
  /** Maximum number of notes to return @default 20 */
  limit?: number;
}

/**
 * List notes with optional folder, account, date, and limit filters
 * @param {Request} req - Request object, body is {@link ListNotesParams}
 * @returns Array of notes with id, name, and dates
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListNotesParams;
  const limit = Number(params.limit) || 20;

  let notesSource: string;
  if (params.account && params.folder) {
    notesSource = `notes of folder ${JSON.stringify(params.folder)} of account ${JSON.stringify(params.account)}`;
  } else if (params.folder) {
    notesSource = `notes of folder ${JSON.stringify(params.folder)}`;
  } else if (params.account) {
    notesSource = `notes of account ${JSON.stringify(params.account)}`;
  } else {
    notesSource = `notes`;
  }

  let dateFilter = "";
  if (params.modified_since) {
    dateFilter = `
            set modSince to date "${params.modified_since}"
            if (modification date of aNote) < modSince then set skip to true`;
  }

  const script = `
    tell application "Notes"
      set notesList to {}
      set noteCount to 0
      set allNotes to ${notesSource}
      repeat with aNote in allNotes
        if noteCount < ${limit} then
          set skip to false
          ${dateFilter}
          if skip is false then
            set noteInfo to (id of aNote as string) & "$break" & (name of aNote as string) & "$break" & (creation date of aNote as string) & "$break" & (modification date of aNote as string)
            set end of notesList to noteInfo
            set noteCount to noteCount + 1
          end if
        else
          exit repeat
        end if
      end repeat
      set output to ""
      repeat with i from 1 to count of notesList
        set output to output & item i of notesList
        if i < (count of notesList) then set output to output & "$end"
      end repeat
      return output
    end tell
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = data.split("$end");
  const result = records.map((r) => {
    const [id, name, creationDate, modificationDate] = r.split("$break");
    return { id, name, creation_date: creationDate, modification_date: modificationDate };
  });

  return Response.json({ result });
}
