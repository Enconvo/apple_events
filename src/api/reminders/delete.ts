import { deleteRemindersItem } from "./utils/reminders_util.ts";

/** Delete reminder request params */
interface DeleteReminderParams {
  /** ID of the reminder to delete @required */
  reminderId: string;
}

/**
 * Delete a reminder by ID
 * @param {Request} req - Request object, body is {@link DeleteReminderParams}
 * @returns Deletion result with id and status
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteReminderParams;
  const result = await deleteRemindersItem(params.reminderId);
  return Response.json({ result });
}
