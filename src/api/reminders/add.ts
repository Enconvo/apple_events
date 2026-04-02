import { addEventToAppleReminder } from "./utils/reminders_util.ts";

/** Add reminder request params */
interface AddReminderParams {
  /** Reminder title @required */
  title: string;
  /** Reminder list ID to add to */
  listId?: string;
  /** Reminder notes/description */
  notes?: string;
  /** Due date in ISO 8601 format */
  dueDate?: string;
  /** Priority level: none, low, medium, high */
  priority?: string;
  /** Recurrence rule for repeating reminders */
  recurrence?: {
    /** Recurrence frequency: daily, weekly, monthly, yearly */
    frequency: string;
    /** Interval between occurrences */
    interval: number;
    /** End date for recurrence */
    endDate?: string;
  };
  /** Location address for location-based reminder */
  address?: string;
  /** Proximity trigger: arrive or depart */
  proximity?: string;
  /** Geofence radius in meters */
  radius?: number;
}

/**
 * Add a new reminder to Apple Reminders
 * @param {Request} req - Request object, body is {@link AddReminderParams}
 * @returns The created reminder with full details
 */
export default async function main(req: Request) {
  const params = (await req.json()) as AddReminderParams;
  const result = await addEventToAppleReminder(params);
  return Response.json({ result });
}
