import { execFile, exec } from "child_process";
import { promisify } from "util";
import { access } from "node:fs/promises";

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES, delay = RETRY_DELAY): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retryOperation(operation, retries - 1, delay);
    }
    throw error;
  }
}

export async function runAppleScript(script: string): Promise<string> {
  const { stdout } = await execFileAsync("osascript", ["-e", script]);
  return stdout.trim();
}

export function normalizePhoneNumber(phone: string): string[] {
  const cleaned = phone.replace(/[^0-9+]/g, '');

  if (/^\+1\d{10}$/.test(cleaned)) return [cleaned];
  if (/^1\d{10}$/.test(cleaned)) return [`+${cleaned}`];
  if (/^\d{10}$/.test(cleaned)) return [`+1${cleaned}`];

  const formats = new Set<string>();
  if (cleaned.startsWith('+1')) {
    formats.add(cleaned);
  } else if (cleaned.startsWith('1')) {
    formats.add(`+${cleaned}`);
  } else {
    formats.add(`+1${cleaned}`);
  }
  return Array.from(formats);
}

export async function checkMessagesDBAccess(): Promise<boolean> {
  try {
    const dbPath = `${process.env.HOME}/Library/Messages/chat.db`;
    await access(dbPath);
    await execAsync(`sqlite3 "${dbPath}" "SELECT 1;"`);
    return true;
  } catch {
    return false;
  }
}

export function decodeAttributedBody(hexString: string): { text: string; url?: string } {
  try {
    const buffer = Buffer.from(hexString, 'hex');
    const content = buffer.toString();

    const patterns = [
      /NSString">(.*?)</,
      /NSString">([^<]+)/,
      /NSNumber">\d+<.*?NSString">(.*?)</,
      /NSArray">.*?NSString">(.*?)</,
      /"string":\s*"([^"]+)"/,
      /text[^>]*>(.*?)</,
      /message>(.*?)</
    ];

    let text = '';
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match?.[1] && match[1].length > 5) {
        text = match[1];
        break;
      }
    }

    const urlPatterns = [
      /(https?:\/\/[^\s<"]+)/,
      /NSString">(https?:\/\/[^\s<"]+)/,
      /"url":\s*"(https?:\/\/[^"]+)"/,
      /link[^>]*>(https?:\/\/[^<]+)/
    ];

    let url: string | undefined;
    for (const pattern of urlPatterns) {
      const match = content.match(pattern);
      if (match?.[1]) { url = match[1]; break; }
    }

    if (!text && !url) {
      const readableText = content
        .replace(/streamtyped.*?NSString/g, '')
        .replace(/NSAttributedString.*?NSString/g, '')
        .replace(/NSDictionary.*?$/g, '')
        .replace(/\+[A-Za-z]+\s/g, '')
        .replace(/NSNumber.*?NSValue.*?\*/g, '')
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (readableText.length > 5) {
        text = readableText;
      } else {
        return { text: '[Message content not readable]' };
      }
    }

    if (text) {
      text = text.replace(/^[+\s]+/, '').replace(/\s*iI\s*[A-Z]\s*$/, '').replace(/\s+/g, ' ').trim();
    }

    return { text: text || url || '', url };
  } catch {
    return { text: '[Message content not readable]' };
  }
}

async function getAttachmentPaths(messageId: number): Promise<string[]> {
  try {
    const query = `SELECT filename FROM attachment INNER JOIN message_attachment_join ON attachment.ROWID = message_attachment_join.attachment_id WHERE message_attachment_join.message_id = ${messageId}`;
    const { stdout } = await execAsync(`sqlite3 -json "${process.env.HOME}/Library/Messages/chat.db" "${query}"`);
    if (!stdout.trim()) return [];
    const attachments = JSON.parse(stdout);
    return attachments.map((a: any) => a.filename).filter(Boolean);
  } catch {
    return [];
  }
}

async function processMessages(messages: any[]): Promise<any[]> {
  return Promise.all(
    messages
      .filter((msg: any) => msg.content !== null || msg.cache_has_attachments === 1)
      .map(async (msg: any) => {
        let content = msg.content || '';
        let url: string | undefined;

        if (msg.content_type === 1) {
          const decoded = decodeAttributedBody(content);
          content = decoded.text;
          url = decoded.url;
        } else {
          const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) url = urlMatch[1];
        }

        let attachments: string[] = [];
        if (msg.cache_has_attachments) {
          attachments = await getAttachmentPaths(msg.message_id);
        }

        if (msg.subject) content = `Subject: ${msg.subject}\n${content}`;

        const formattedMsg: any = {
          content: content || '[No text content]',
          date: new Date(msg.date).toISOString(),
          sender: msg.sender,
          is_from_me: Boolean(msg.is_from_me)
        };

        if (attachments.length > 0) {
          formattedMsg.attachments = attachments;
        }
        if (url) {
          formattedMsg.url = url;
        }

        return formattedMsg;
      })
  );
}

export async function readMessages(phoneNumber: string, limit = 10): Promise<any[]> {
  const hasAccess = await retryOperation(checkMessagesDBAccess);
  if (!hasAccess) return [];

  const phoneFormats = normalizePhoneNumber(phoneNumber);
  const placeholders = phoneFormats.map(f => `'${f}'`).join(', ');

  const query = `SELECT m.ROWID as message_id, CASE WHEN m.text IS NOT NULL AND m.text != '' THEN m.text WHEN m.attributedBody IS NOT NULL THEN hex(m.attributedBody) ELSE NULL END as content, datetime(m.date/1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as date, h.id as sender, m.is_from_me, m.is_audio_message, m.cache_has_attachments, m.subject, CASE WHEN m.text IS NOT NULL AND m.text != '' THEN 0 WHEN m.attributedBody IS NOT NULL THEN 1 ELSE 2 END as content_type FROM message m INNER JOIN handle h ON h.ROWID = m.handle_id WHERE h.id IN (${placeholders}) AND (m.text IS NOT NULL OR m.attributedBody IS NOT NULL OR m.cache_has_attachments = 1) AND m.is_from_me IS NOT NULL AND m.item_type = 0 AND m.is_audio_message = 0 ORDER BY m.date DESC LIMIT ${limit}`;

  const { stdout } = await retryOperation(() =>
    execAsync(`sqlite3 -json "${process.env.HOME}/Library/Messages/chat.db" "${query}"`)
  );

  if (!stdout.trim()) return [];
  return processMessages(JSON.parse(stdout));
}

export async function getUnreadMessages(limit = 10): Promise<any[]> {
  const hasAccess = await retryOperation(checkMessagesDBAccess);
  if (!hasAccess) return [];

  const query = `SELECT m.ROWID as message_id, CASE WHEN m.text IS NOT NULL AND m.text != '' THEN m.text WHEN m.attributedBody IS NOT NULL THEN hex(m.attributedBody) ELSE NULL END as content, datetime(m.date/1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as date, h.id as sender, m.is_from_me, m.is_audio_message, m.cache_has_attachments, m.subject, CASE WHEN m.text IS NOT NULL AND m.text != '' THEN 0 WHEN m.attributedBody IS NOT NULL THEN 1 ELSE 2 END as content_type FROM message m INNER JOIN handle h ON h.ROWID = m.handle_id WHERE m.is_from_me = 0 AND m.is_read = 0 AND (m.text IS NOT NULL OR m.attributedBody IS NOT NULL OR m.cache_has_attachments = 1) AND m.is_audio_message = 0 AND m.item_type = 0 ORDER BY m.date DESC LIMIT ${limit}`;

  const { stdout } = await retryOperation(() =>
    execAsync(`sqlite3 -json "${process.env.HOME}/Library/Messages/chat.db" "${query}"`)
  );

  if (!stdout.trim()) return [];
  return processMessages(JSON.parse(stdout));
}

export async function sendMessage(recipient: string, message: string): Promise<string> {
  const script = `
    tell application "Messages"
      send ${JSON.stringify(message)} to buddy ${JSON.stringify(recipient)} of (service 1 whose service type = iMessage)
    end tell
  `;
  await runAppleScript(script);
  return `Message sent successfully to ${recipient}`;
}
