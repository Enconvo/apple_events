import { runAppleScript } from "@enconvo/api";

interface MoveNoteParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Note IDs for batch move */
  ids?: string[];
  /** Name of the note to move */
  note_name?: string;
  /** Destination folder @required */
  folder: string;
  /** Account containing the note/folder */
  account?: string;
}

/**
 * Move one or more notes to a different folder
 * @param {Request} req - Request object, body is {@link MoveNoteParams}
 * @returns Confirmation message with moved note count or name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as MoveNoteParams;

  if (!params.folder) throw new Error("Destination folder is required");

  const destFolder = params.account
    ? `folder ${JSON.stringify(params.folder)} of account ${JSON.stringify(params.account)}`
    : `folder ${JSON.stringify(params.folder)}`;

  // Batch move
  if (params.ids?.length) {
    const moveStatements = params.ids
      .map((id) => `move (first note whose id is ${JSON.stringify(id)}) to ${destFolder}`)
      .join("\n        ");

    const script = `
      tell application "Notes"
        ${moveStatements}
      end tell
    `;
    await runAppleScript(script);
    return Response.json({ result: `Moved ${params.ids.length} note(s) to ${params.folder}` });
  }

  if (!params.id && !params.note_name) {
    throw new Error("Either id, ids, or note_name is required");
  }

  const noteRef = params.id
    ? `first note whose id is ${JSON.stringify(params.id)}`
    : `first note whose name is ${JSON.stringify(params.note_name)}`;

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      move targetNote to ${destFolder}
      return "Moved note to ${params.folder}: " & (name of targetNote as string)
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
