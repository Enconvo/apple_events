import { runAppleScript } from "@enconvo/api";

interface AppendToNoteParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Name of the note to append to */
  note_name?: string;
  /** Content to append to the note @required */
  content: string;
  /** Optional folder name where the note is located */
  folder?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Append content to an existing note without replacing
 * @param {Request} req - Request object, body is {@link AppendToNoteParams}
 * @returns Confirmation message with the note name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as AppendToNoteParams;

  if (!params.id && !params.note_name) {
    throw new Error("Either id or note_name is required");
  }
  if (!params.content) {
    throw new Error("Content is required");
  }

  const htmlContent = params.content.replace(/\n/g, "<br>");

  let noteRef: string;
  if (params.id) {
    noteRef = `first note whose id is ${JSON.stringify(params.id)}`;
  } else if (params.folder) {
    noteRef = `first note of folder ${JSON.stringify(params.folder)} whose name is ${JSON.stringify(params.note_name)}`;
  } else {
    noteRef = `first note whose name is ${JSON.stringify(params.note_name)}`;
  }

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      set currentBody to body of targetNote as string
      set body of targetNote to currentBody & "<br>" & ${JSON.stringify(htmlContent)}
      return "Content appended to: " & (name of targetNote as string)
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
