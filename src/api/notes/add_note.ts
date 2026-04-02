import { runAppleScript } from "@enconvo/api";

interface AddNoteParams {
  /** Name/title of the new note @required */
  name: string;
  /** Content of the new note @required */
  content: string;
  /** Folder to create the note in @default "Notes" */
  folder?: string;
  /** Account to create the note in */
  account?: string;
}

/**
 * Create a new note in Apple Notes
 * @param {Request} req - Request object, body is {@link AddNoteParams}
 * @returns The created note's id and name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as AddNoteParams;
  const name = params.name;
  const content = params.content;
  const folder = params.folder || "Notes";
  const account = params.account;

  if (!name || !content) {
    throw new Error("Note name and content are required");
  }

  const folderRef = account
    ? `folder ${JSON.stringify(folder)} of account ${JSON.stringify(account)}`
    : `folder ${JSON.stringify(folder)}`;

  const script = `
    tell application "Notes"
      set targetFolder to ${folderRef}
      set newNote to make new note at targetFolder with properties {name:${JSON.stringify(name)}, body:${JSON.stringify(content)}}
      return (id of newNote as string) & "$break" & (name of newNote as string)
    end tell
  `;

  const result = await runAppleScript(script);
  const [id, noteName] = result.split("$break");

  return Response.json({ result: { id: id.trim(), name: noteName.trim() } });
}
