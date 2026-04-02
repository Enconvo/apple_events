import { runAppleScript } from "@enconvo/api";

interface CreateFolderParams {
  /** Folder name @required */
  name: string;
  /** Account to create the folder in */
  account?: string;
}

/**
 * Create a new folder in Apple Notes
 * @param {Request} req - Request object, body is {@link CreateFolderParams}
 * @returns Confirmation message with folder name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as CreateFolderParams;

  if (!params.name) throw new Error("Folder name is required");

  const target = params.account
    ? `account ${JSON.stringify(params.account)}`
    : `default account`;

  const script = `
    tell application "Notes"
      make new folder at ${target} with properties {name:${JSON.stringify(params.name)}}
      return "Folder created: ${params.name}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
