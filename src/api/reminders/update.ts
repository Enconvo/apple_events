import { updateRemindersItem } from "./utils/reminders_util.ts";

/** Update reminder request params */
interface UpdateReminderParams {
  /** ID of the reminder to update @required */
  reminderId: string;
  /** Updated reminder title */
  title?: string;
  /** Updated notes/description */
  notes?: string;
  /** Updated due date in ISO 8601 format */
  dueDate?: string;
  /** Updated priority level: none, low, medium, high */
  priority?: string;
  /** Updated recurrence rule */
  recurrence?: {
    /** Recurrence frequency: daily, weekly, monthly, yearly */
    frequency: string;
    /** Interval between occurrences */
    interval: number;
    /** End date for recurrence */
    endDate?: string;
  };
  /** Updated location address */
  address?: string;
  /** Updated proximity trigger: arrive or depart */
  proximity?: string;
  /** Updated geofence radius in meters */
  radius?: number;
}

/**
 * Update an existing reminder's properties
 * @param {Request} req - Request object, body is {@link UpdateReminderParams}
 * @returns The updated reminder with full details
 */
export default async function main(req: Request) {
  const params = (await req.json()) as UpdateReminderParams;
  const result = await updateRemindersItem(params);
  return Response.json({ result });
}
