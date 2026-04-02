import { runAppleScript } from "@enconvo/api";

interface ListAttachmentsParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Note title */
  note_name?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * List attachments of a specific note
 * @param {Request} req - Request object, body is {@link ListAttachmentsParams}
 * @returns Array of attachments with id, name, and creation_date
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ListAttachmentsParams;

  if (!params.id && !params.note_name) {
    throw new Error("Either id or note_name is required");
  }

  const noteRef = params.id
    ? `first note whose id is ${JSON.stringify(params.id)}`
    : `first note whose name is ${JSON.stringify(params.note_name)}`;

  const script = `
    set output to ""
    tell application "Notes"
      set targetNote to ${noteRef}
      set attCount to 0
      repeat with att in attachments of targetNote
        if attCount > 0 then set output to output & "$end"
        set attName to name of att as string
        set attId to id of att as string
        set attCreated to creation date of att as string
        set output to output & attId & "$break" & attName & "$break" & attCreated
        set attCount to attCount + 1
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = data.split("$end");
  const result = records.map((r) => {
    const [id, name, creationDate] = r.split("$break");
    return { id, name, creation_date: creationDate };
  });

  return Response.json({ result });
}
