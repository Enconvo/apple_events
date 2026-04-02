import { updateRemindersItem } from "./utils/reminders_util.ts";

/** Update reminder request params */
interface UpdateRemindersItemOptions {
  /** ID of the reminder to update @required */
  reminderId: string;
  /** Updated reminder title */
  title?: string;
  /** Updated notes/description */
  notes?: string;
  /** Updated due date in ISO 8601 format */
  dueDate?: string;
  /** Updated priority level */
  priority?: string;
  /** Updated recurrence rule */
  recurrence?: any;
  /** Updated location address */
  address?: string;
  /** Updated proximity trigger */
  proximity?: string;
  /** Updated geofence radius */
  radius?: number;
}

/**
 * Update an existing reminder's properties
 * @param {Request} req - Request object, body is {@link UpdateRemindersItemOptions}
 * @returns Updated reminder
 */
export default async function main(req: Request) {
  const params = await req.json() as UpdateRemindersItemOptions;

  const result = await updateRemindersItem(params)

  return Response.json({ result })
}
