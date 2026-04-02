import { runAppleScript } from "@enconvo/api";

export function esc(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function findAndTell(account: string, mailbox: string, messageId: string, script: string): Promise<string> {
  const as = `
    tell application "Mail"
      set targetAcct to account "${esc(account)}"
      set targetBox to first mailbox of targetAcct whose name is "${esc(mailbox)}"
      set msg to (first message of targetBox whose id is ${messageId})
      ${script}
    end tell
  `;
  return await runAppleScript(as);
}

export async function findMessageGlobally(messageId: string): Promise<{ script: string }> {
  return {
    script: `
      tell application "Mail"
        repeat with acct in every account
          repeat with box in every mailbox of acct
            try
              set msg to (first message of box whose id is ${messageId})
              return {msg, box, acct}
            end try
          end repeat
        end repeat
        error "Message not found"
      end tell
    `,
  };
}

export function parseDelimited(data: string): string[][] {
  const records = data.split("$end");
  records.pop();
  return records.map((r) => r.split("$break"));
}

export const joinListFn = `
  on joinList(theList, delimiter)
    set AppleScript's text item delimiters to delimiter
    set theString to theList as string
    set AppleScript's text item delimiters to ""
    return theString
  end joinList
`;

export const escTextFn = `
  on escText(t)
    set output to ""
    repeat with c in characters of t
      if c as string is "\\"" then
        set output to output & "\\\\\\""
      else if c as string is "\\\\" then
        set output to output & "\\\\\\\\"
      else
        set output to output & (c as string)
      end if
    end repeat
    return output
  end escText
`;
