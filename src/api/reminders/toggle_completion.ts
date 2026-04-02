import { toggleReminderCompletionStatus } from "./utils/reminders_util.ts";

/** Toggle reminder completion params */
interface ToggleCompletionParams {
  /** ID of the reminder to toggle @required */
  reminderId: string;
}

/**
 * Toggle a reminder's completion status between complete and incomplete
 * @param {Request} req - Request object, body is {@link ToggleCompletionParams}
 * @returns Boolean indicating success
 */
export default async function main(req: Request) {
  const params = (await req.json()) as ToggleCompletionParams;
  const result = await toggleReminderCompletionStatus(params.reminderId);
  return Response.json({ result });
}
