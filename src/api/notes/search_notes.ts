import { runAppleScript } from "@enconvo/api";

interface SearchNotesParams {
  /** Search query to match against note titles and content @required */
  query: string;
  /** Search note content in addition to titles @default true */
  search_content?: boolean;
  /** Optional folder to limit search to */
  folder?: string;
  /** Account to search in */
  account?: string;
  /** Only return notes modified after this ISO date (YYYY-MM-DD) */
  modified_since?: string;
  /** Maximum number of results to return @default 20 */
  limit?: number;
}

/**
 * Search notes by title and optionally content with filters
 * @param {Request} req - Request object, body is {@link SearchNotesParams}
 * @returns Array of matching notes with id, name, and dates
 */
export default async function main(req: Request) {
  const params = (await req.json()) as SearchNotesParams;
  const query = params.query;
  const limit = Number(params.limit) || 20;
  const searchContent = params.search_content !== false;

  if (!query) {
    throw new Error("Search query is required");
  }

  const lowerQuery = query.toLowerCase();

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

  const contentCheck = searchContent
    ? `or lowerBody contains ${JSON.stringify(lowerQuery)}`
    : "";

  const script = `
    tell application "Notes"
      set notesList to {}
      set matchCount to 0
      set allNotes to ${notesSource}
      repeat with aNote in allNotes
        if matchCount < ${limit} then
          set skip to false
          ${dateFilter}
          if skip is false then
            set noteName to name of aNote as string
            set lowerName to do shell script "echo " & quoted form of noteName & " | tr '[:upper:]' '[:lower:]'"
            ${searchContent ? `set noteBody to plaintext of aNote as string
            set lowerBody to do shell script "echo " & quoted form of noteBody & " | tr '[:upper:]' '[:lower:]'"` : ""}
            if lowerName contains ${JSON.stringify(lowerQuery)} ${contentCheck} then
              set noteInfo to (id of aNote as string) & "$break" & noteName & "$break" & (creation date of aNote as string) & "$break" & (modification date of aNote as string)
              set end of notesList to noteInfo
              set matchCount to matchCount + 1
            end if
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
