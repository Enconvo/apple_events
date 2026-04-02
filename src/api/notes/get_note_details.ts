import { runAppleScript } from "@enconvo/api";

interface GetNoteDetailsParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Note title */
  note_name?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Get note metadata without content (folder, dates, attachment count, length)
 * @param {Request} req - Request object, body is {@link GetNoteDetailsParams}
 * @returns Note metadata including id, name, dates, folder, attachment_count, content_length
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetNoteDetailsParams;

  if (!params.id && !params.note_name) {
    throw new Error("Either id or note_name is required");
  }

  const noteRef = params.id
    ? `first note whose id is ${JSON.stringify(params.id)}`
    : `first note whose name is ${JSON.stringify(params.note_name)}`;

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      set noteId to id of targetNote as string
      set noteName to name of targetNote as string
      set noteCreated to creation date of targetNote as string
      set noteModified to modification date of targetNote as string
      try
        set noteContainer to name of container of targetNote as text
      on error
        set noteContainer to "Unknown"
      end try
      set noteAttachCount to count of attachments of targetNote
      set notePlaintext to plaintext of targetNote as string
      set noteLen to length of notePlaintext
      return noteId & "$break" & noteName & "$break" & noteCreated & "$break" & noteModified & "$break" & noteContainer & "$break" & noteAttachCount & "$break" & noteLen
    end tell
  `;

  const data = await runAppleScript(script);
  const [id, name, creationDate, modificationDate, folder, attachmentCount, contentLength] = data.split("$break");

  return Response.json({
    result: {
      id,
      name,
      creation_date: creationDate,
      modification_date: modificationDate,
      folder,
      attachment_count: parseInt(attachmentCount),
      content_length: parseInt(contentLength),
    },
  });
}
