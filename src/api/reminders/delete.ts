import { deleteRemindersItem } from "./utils/reminders_util.ts";

/** Delete reminder request params */
interface DeleteRemindersItemParams {
  /** ID of the reminder to delete @required */
  reminderId: string;
}

/**
 * Delete a reminder by ID
 * @param {Request} req - Request object, body is {@link DeleteRemindersItemParams}
 * @returns Deletion result
 */
export default async function main(req: Request) {
  const params = await req.json() as DeleteRemindersItemParams;

  const result = await deleteRemindersItem(params.reminderId)

  return Response.json({ result })
}
