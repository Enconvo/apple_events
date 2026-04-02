import { runAppleScript } from "@enconvo/api";

interface UpdateNoteContentParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Name of the note to update */
  note_name?: string;
  /** Name of the note (alias for note_name) */
  name?: string;
  /** New content for the note @required */
  new_content?: string;
  /** Content (alias for new_content) */
  content?: string;
  /** New title for the note (optional rename) */
  new_title?: string;
  /** New title (alias for new_title) */
  title?: string;
  /** Optional folder name where the note is located */
  folder?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Replace the content of a note and optionally rename it
 * @param {Request} req - Request object, body is {@link UpdateNoteContentParams}
 * @returns Confirmation message with the updated note name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as UpdateNoteContentParams;
  const note_name = params.note_name || params.name;
  const new_content = params.new_content || params.content;
  const new_title = params.new_title || params.title;

  if (!params.id && !note_name) {
    throw new Error("Either id or note_name is required");
  }
  if (!new_content) {
    throw new Error("new_content is required");
  }

  let noteRef: string;
  if (params.id) {
    noteRef = `first note whose id is ${JSON.stringify(params.id)}`;
  } else if (params.folder) {
    noteRef = `first note of folder ${JSON.stringify(params.folder)} whose name is ${JSON.stringify(note_name)}`;
  } else {
    noteRef = `first note whose name is ${JSON.stringify(note_name)}`;
  }

  const renameScript = new_title
    ? `set name of targetNote to ${JSON.stringify(new_title)}`
    : "";

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      set body of targetNote to ${JSON.stringify(new_content)}
      ${renameScript}
      return "Note updated: " & (name of targetNote as string)
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
