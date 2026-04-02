import { runAppleScript } from "@enconvo/api";

interface DeleteFolderParams {
  /** Folder name to delete @required */
  name: string;
  /** Account containing the folder */
  account?: string;
}

/**
 * Delete a folder from Apple Notes
 * @param {Request} req - Request object, body is {@link DeleteFolderParams}
 * @returns Confirmation message with folder name
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteFolderParams;

  if (!params.name) throw new Error("Folder name is required");

  const folderRef = params.account
    ? `folder ${JSON.stringify(params.name)} of account ${JSON.stringify(params.account)}`
    : `folder ${JSON.stringify(params.name)}`;

  const script = `
    tell application "Notes"
      delete ${folderRef}
      return "Folder deleted: ${params.name}"
    end tell
  `;

  const result = await runAppleScript(script);
  return Response.json({ result });
}
