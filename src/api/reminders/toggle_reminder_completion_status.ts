import { toggleReminderCompletionStatus } from "./utils/reminders_util.ts";

/** Toggle reminder completion status params */
interface ToggleReminderCompletionStatusParams {
  /** ID of the reminder to toggle @required */
  reminderId: string;
}

/**
 * Toggle a reminder's completion status
 * @param {Request} req - Request object, body is {@link ToggleReminderCompletionStatusParams}
 * @returns Updated reminder status
 */
export default async function main(req: Request) {
  const params = await req.json() as ToggleReminderCompletionStatusParams;

  const result = await toggleReminderCompletionStatus(params.reminderId);

  return Response.json({ result });
}
