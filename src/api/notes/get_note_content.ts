import { runAppleScript } from "@enconvo/api";

interface GetNoteContentParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Name of the note to retrieve */
  note_name?: string;
  /** Optional folder name where the note is located */
  folder?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Get the full HTML body of a note by id or name
 * @param {Request} req - Request object, body is {@link GetNoteContentParams}
 * @returns The note's id, name, and HTML content
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetNoteContentParams;

  if (!params.id && !params.note_name) {
    throw new Error("Either id or note_name is required");
  }

  let noteRef: string;
  if (params.id) {
    noteRef = `first note whose id is ${JSON.stringify(params.id)}`;
  } else if (params.account && params.folder) {
    noteRef = `first note of folder ${JSON.stringify(params.folder)} of account ${JSON.stringify(params.account)} whose name is ${JSON.stringify(params.note_name)}`;
  } else if (params.folder) {
    noteRef = `first note of folder ${JSON.stringify(params.folder)} whose name is ${JSON.stringify(params.note_name)}`;
  } else {
    noteRef = `first note whose name is ${JSON.stringify(params.note_name)}`;
  }

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      set noteId to id of targetNote as string
      set noteName to name of targetNote as string
      set noteBody to body of targetNote as string
      return noteId & "$break" & noteName & "$break" & noteBody
    end tell
  `;

  const result = await runAppleScript(script);
  const breakIdx = result.indexOf("$break");
  const secondBreak = result.indexOf("$break", breakIdx + 6);
  const id = result.substring(0, breakIdx);
  const name = result.substring(breakIdx + 6, secondBreak);
  const content = result.substring(secondBreak + 6);

  return Response.json({ result: { id, name, content } });
}
