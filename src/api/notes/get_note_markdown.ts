import { runAppleScript } from "@enconvo/api";

interface GetNoteMarkdownParams {
  /** Note ID (preferred over note_name) */
  id?: string;
  /** Note title */
  note_name?: string;
  /** Account containing the note */
  account?: string;
}

/**
 * Convert a note's content to markdown format
 * @param {Request} req - Request object, body is {@link GetNoteMarkdownParams}
 * @returns The note's name and markdown content
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetNoteMarkdownParams;

  if (!params.id && !params.note_name) {
    throw new Error("Either id or note_name is required");
  }

  const noteRef = params.id
    ? `first note whose id is ${JSON.stringify(params.id)}`
    : `first note whose name is ${JSON.stringify(params.note_name)}`;

  const script = `
    tell application "Notes"
      set targetNote to ${noteRef}
      set noteName to name of targetNote as string
      set notePlain to plaintext of targetNote as string
      return noteName & "$break" & notePlain
    end tell
  `;

  const data = await runAppleScript(script);
  const breakIdx = data.indexOf("$break");
  const name = data.substring(0, breakIdx);
  const plaintext = data.substring(breakIdx + 6);

  // Convert plaintext to basic markdown
  const lines = plaintext.split("\n");
  let markdown = `# ${name}\n\n`;
  for (const line of lines) {
    if (line === name) continue; // skip title line
    markdown += line + "\n";
  }

  return Response.json({ result: { name, markdown: markdown.trim() } });
}
