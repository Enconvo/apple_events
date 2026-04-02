import { runAppleScript } from "@enconvo/api";

/**
 * Get the currently selected note in the Notes app
 * @param {Request} req - Request object, no parameters needed
 * @returns Selected note with id, name, plaintext content, dates, folder, attachment count
 */
export default async function main(req: Request) {
  const script = `
    tell application "Notes"
      set sel to selection
      if (count of sel) is 0 then
        return ""
      end if
      set output to ""
      repeat with n in sel
        set noteId to id of n as string
        set noteName to name of n as string
        set noteCreated to creation date of n as string
        set noteModified to modification date of n as string
        try
          set noteContainer to name of container of n as text
        on error
          set noteContainer to "Unknown"
        end try
        set noteAttachCount to count of attachments of n
        set notePlaintext to plaintext of n as string
        set output to output & noteId & "$break" & noteName & "$break" & noteCreated & "$break" & noteModified & "$break" & noteContainer & "$break" & noteAttachCount & "$break" & notePlaintext & "$end"
      end repeat
      return output
    end tell
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) {
    return Response.json({ result: null, message: "No note is currently selected in Notes app" });
  }

  const records = data.split("$end").filter(s => s.trim());
  const result = records.map(record => {
    const [id, name, creationDate, modificationDate, folder, attachmentCount, ...contentParts] = record.split("$break");
    return {
      id,
      name,
      creation_date: creationDate,
      modification_date: modificationDate,
      folder,
      attachment_count: parseInt(attachmentCount),
      plaintext: contentParts.join("$break"),
    };
  });

  return Response.json({ result: result.length === 1 ? result[0] : result });
}
