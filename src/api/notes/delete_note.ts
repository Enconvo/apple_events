import { runAppleScript } from "@enconvo/api";

interface DeleteNoteParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Note IDs for batch delete */
  ids?: string[];
  /** Name of the note to delete */
  note_name?: string;
  /** Optional folder name where the note is located */
  folder?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Delete one or more notes by id, name, or batch ids
 * @param {Request} req - Request object, body is {@link DeleteNoteParams}
 * @returns Confirmation message with deleted note count or name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteNoteParams;

  // Batch delete by ids
  if (params.ids?.length) {
    const deleteStatements = params.ids
      .map((id) => `delete (first note whose id is ${JSON.stringify(id)})`)
      .join("\n        ");

    const script = `
      tell application "Notes"
        ${deleteStatements}
      end tell
    `;
    await runAppleScript(script);
    return Response.json({ result: `Deleted ${params.ids.length} note(s)` });
  }

  if (!params.id && !params.note_name) {
    throw new Error("Either id, ids, or note_name is required");
  }

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
      set noteName to name of targetNote as string
      delete targetNote
      return "Note deleted: " & noteName
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
