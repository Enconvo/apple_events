import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

async function runAppleScript(script: string): Promise<string> {
  const { stdout } = await execFileAsync("osascript", ["-e", script]);
  return stdout.trim();
}

export interface Contact {
  name: string;
  phones: string[];
  emails: string[];
}

function parseContactOutput(raw: string): Contact[] {
  if (!raw.trim()) return [];

  return raw.split("\n").filter(Boolean).map(line => {
    const [name, phones, emails] = line.split("\t");
    return {
      name: name || "",
      phones: phones ? phones.split("|").filter(Boolean) : [],
      emails: emails ? emails.split("|").filter(Boolean) : []
    };
  });
}

// Build AppleScript to extract full info from a list of person refs
function buildExtractScript(matchExpr: string): string {
  return `
    tell application "Contacts"
      set matches to ${matchExpr}
      set output to ""
      repeat with p in matches
        set personName to name of p as string

        set phoneList to ""
        repeat with aPhone in phones of p
          if phoneList is not "" then set phoneList to phoneList & "|"
          set phoneList to phoneList & (value of aPhone as string)
        end repeat

        set emailList to ""
        repeat with anEmail in emails of p
          if emailList is not "" then set emailList to emailList & "|"
          set emailList to emailList & (value of anEmail as string)
        end repeat

        set output to output & personName & "\\t" & phoneList & "\\t" & emailList & "\\n"
      end repeat
      return output
    end tell
  `;
}

/**
 * Search contacts by name using AppleScript's `whose name contains` (case-insensitive, server-side).
 */
async function searchByName(query: string): Promise<Contact[]> {
  const script = buildExtractScript(
    `every person whose name contains ${JSON.stringify(query)}`
  );
  const result = await runAppleScript(script);
  return parseContactOutput(result);
}

/**
 * Search contacts by phone. Exact match required by Contacts.app.
 * Tries +1 prefix, raw, and stripped formats.
 */
async function searchByPhone(phone: string): Promise<Contact[]> {
  const cleaned = phone.replace(/[^0-9+]/g, "");

  // Build candidate formats for exact matching
  const candidates = new Set<string>();
  candidates.add(cleaned);
  if (/^\d{10}$/.test(cleaned)) {
    candidates.add(`+1${cleaned}`);
    candidates.add(`1${cleaned}`);
  } else if (/^1\d{10}$/.test(cleaned)) {
    candidates.add(`+${cleaned}`);
    candidates.add(cleaned.slice(1));
  } else if (/^\+1\d{10}$/.test(cleaned)) {
    candidates.add(cleaned.slice(2));
    candidates.add(cleaned.slice(1));
  }

  // Try each format — Contacts.app needs exact string match
  for (const fmt of candidates) {
    const script = buildExtractScript(
      `every person whose value of phones contains ${JSON.stringify(fmt)}`
    );
    try {
      const result = await runAppleScript(script);
      const contacts = parseContactOutput(result);
      if (contacts.length > 0) return contacts;
    } catch {
      // No match with this format, try next
    }
  }

  return [];
}

/**
 * Search contacts by query. Detects phone-like queries and routes accordingly.
 */
export async function searchContacts(query: string): Promise<Contact[]> {
  const isPhoneLike = /^[+\d\s()-]{7,}$/.test(query.trim());

  if (isPhoneLike) {
    const phoneResults = await searchByPhone(query);
    if (phoneResults.length > 0) return phoneResults;
  }

  // Name/email search — use AppleScript name filter
  return searchByName(query);
}

/**
 * Find phone numbers for a contact by name.
 * Uses AppleScript `whose name contains` for fast lookup, then applies
 * progressive JS matching for best result ordering.
 */
export async function findNumber(contactName: string): Promise<{ name: string; numbers: string[] } | null> {
  const matches = await searchByName(contactName);
  if (matches.length === 0) return null;

  const lowerName = contactName.toLowerCase();

  // Strategy 1: Exact name match
  let best = matches.find(c => c.name.toLowerCase() === lowerName);
  if (best) return { name: best.name, numbers: best.phones };

  // Strategy 2: Starts with
  best = matches.find(c => c.name.toLowerCase().startsWith(lowerName));
  if (best) return { name: best.name, numbers: best.phones };

  // Strategy 3: First name match
  best = matches.find(c => c.name.split(" ")[0].toLowerCase() === lowerName);
  if (best) return { name: best.name, numbers: best.phones };

  // Strategy 4: Last name match
  best = matches.find(c => {
    const parts = c.name.split(" ");
    return parts[parts.length - 1].toLowerCase() === lowerName;
  });
  if (best) return { name: best.name, numbers: best.phones };

  // Strategy 5: All query words in name
  const queryWords = lowerName.split(/\s+/);
  best = matches.find(c => {
    const nameLower = c.name.toLowerCase();
    return queryWords.every(w => nameLower.includes(w));
  });
  if (best) return { name: best.name, numbers: best.phones };

  // Fallback: return first match from AppleScript
  return { name: matches[0].name, numbers: matches[0].phones };
}

/**
 * Reverse lookup: find a contact by phone number.
 * Tries multiple formats since Contacts.app requires exact string match.
 */
export async function findContactByPhone(phoneNumber: string): Promise<Contact | null> {
  const results = await searchByPhone(phoneNumber);
  return results.length > 0 ? results[0] : null;
}

/**
 * List all contacts (with optional limit).
 */
export async function getAllContacts(limit?: number): Promise<Contact[]> {
  const limitClause = limit ? `
    if (count of matches) > ${limit} then
      set matches to items 1 thru ${limit} of matches
    end if` : "";

  const script = `
    tell application "Contacts"
      set matches to every person${limitClause}
      set output to ""
      repeat with p in matches
        set personName to name of p as string

        set phoneList to ""
        repeat with aPhone in phones of p
          if phoneList is not "" then set phoneList to phoneList & "|"
          set phoneList to phoneList & (value of aPhone as string)
        end repeat

        set emailList to ""
        repeat with anEmail in emails of p
          if emailList is not "" then set emailList to emailList & "|"
          set emailList to emailList & (value of anEmail as string)
        end repeat

        set output to output & personName & "\\t" & phoneList & "\\t" & emailList & "\\n"
      end repeat
      return output
    end tell
  `;

  const result = await runAppleScript(script);
  return parseContactOutput(result);
}
