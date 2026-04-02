import { runAppleScript } from "@enconvo/api";

/**
 * List all shared/collaborative notes
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of shared notes with id, name, folder, and modification_date
 */
export default async function main(_req: Request) {
  const script = `
    set output to ""
    tell application "Notes"
      set noteCount to 0
      repeat with aNote in notes
        if shared of aNote is true then
          if noteCount > 0 then set output to output & "$end"
          set output to output & (id of aNote as string) & "$break" & (name of aNote as string) & "$break" & (name of container of aNote as string) & "$break" & (modification date of aNote as string)
          set noteCount to noteCount + 1
        end if
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) return Response.json({ result: [] });

  const records = data.split("$end");
  const result = records.map((r) => {
    const [id, name, folder, modificationDate] = r.split("$break");
    return { id, name, folder, modification_date: modificationDate };
  });

  return Response.json({ result });
}
