import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

/** Schedule message request params */
interface ScheduleMessageParams {
  /** Phone number or email of the recipient @required */
  recipient: string;
  /** Message content to send @required */
  message: string;
  /** ISO 8601 date string for when to send the message @required */
  scheduled_time: string;
}

/**
 * Schedule an iMessage to be sent at a future time
 * @param {Request} req - Request object, body is {@link ScheduleMessageParams}
 * @returns Confirmation with scheduled time
 */
export default async function main(req: Request) {
  const params = await req.json() as ScheduleMessageParams;
  const { recipient, message, scheduled_time } = params;

  if (!recipient || !message || !scheduled_time) {
    throw new Error("Recipient, message, and scheduled_time are required");
  }

  const scheduledDate = new Date(scheduled_time);
  if (isNaN(scheduledDate.getTime())) {
    throw new Error("Invalid scheduled_time format. Use ISO 8601 format.");
  }

  if (scheduledDate.getTime() <= Date.now()) {
    throw new Error("Scheduled time must be in the future");
  }

  const delaySeconds = Math.floor((scheduledDate.getTime() - Date.now()) / 1000);

  const escapedMessage = message.replace(/"/g, '\\"');
  const escapedRecipient = recipient.replace(/"/g, '\\"');

  const script = `
    tell application "Messages"
      send "${escapedMessage}" to buddy "${escapedRecipient}" of (service 1 whose service type = iMessage)
    end tell
  `;

  const atCommand = `echo 'osascript -e '"'"'${script.replace(/'/g, "'\\''")}'"'"'' | at now + ${delaySeconds} seconds`;

  try {
    await execFileAsync("bash", ["-c", atCommand]);
    return Response.json({
      result: `Message scheduled to ${recipient} at ${scheduledDate.toISOString()}`
    });
  } catch (error: any) {
    if (error.message?.includes("at")) {
      const delay = scheduledDate.getTime() - Date.now();
      setTimeout(async () => {
        try {
          await execFileAsync("osascript", ["-e", script]);
        } catch { }
      }, delay);

      return Response.json({
        result: `Message scheduled to ${recipient} at ${scheduledDate.toISOString()} (using timer fallback)`
      });
    }
    throw error;
  }
}
