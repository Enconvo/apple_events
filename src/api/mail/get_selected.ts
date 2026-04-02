import { runAppleScript } from "@enconvo/api";
import { parseDelimited } from "./utils/mail_util.ts";

/**
 * Get the currently selected messages in the Mail app
 * @param {Request} req - Request object, no parameters needed
 * @returns Selected messages with id, subject, sender, date, read/flagged status
 */
export default async function main(req: Request) {
  const script = `
    set output to ""
    tell application "Mail"
      set sel to selection
      if (count of sel) is 0 then
        return ""
      end if
      repeat with msg in sel
        set senderName to extract name from sender of msg
        set senderAddr to extract address from sender of msg
        set msgContent to content of msg
        set recipList to ""
        repeat with r in to recipients of msg
          set recipList to recipList & address of r & ","
        end repeat
        set ccList to ""
        repeat with r in cc recipients of msg
          set ccList to ccList & address of r & ","
        end repeat
        set output to output & (id of msg) & "$break" & (subject of msg) & "$break" & senderName & "$break" & senderAddr & "$break" & (date sent of msg as string) & "$break" & (read status of msg) & "$break" & (flagged status of msg) & "$break" & (count of mail attachments of msg) & "$break" & recipList & "$break" & ccList & "$break" & msgContent & "$end"
      end repeat
    end tell
    return output
  `;

  const data = await runAppleScript(script);
  if (!data.trim()) {
    return Response.json({ result: null, message: "No message is currently selected in Mail app" });
  }

  const records = parseDelimited(data);
  const result = records.map(([id, subject, senderName, senderAddress, date, read, flagged, numAttachments, to, cc, ...contentParts]) => ({
    id,
    subject,
    senderName,
    senderAddress,
    date,
    read: read === "true",
    flagged: flagged === "true",
    numAttachments: parseInt(numAttachments),
    to: to ? to.split(",").filter(Boolean) : [],
    cc: cc ? cc.split(",").filter(Boolean) : [],
    content: contentParts.join("$break"),
  }));

  return Response.json({ result: result.length === 1 ? result[0] : result });
}
