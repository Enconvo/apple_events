import { RequestOptions } from "@enconvo/api";
import { addEventToAppleReminder } from "./utils/reminders_util.ts";

/** Add reminder request params */
interface AddEventToAppleReminderOptions extends RequestOptions {
  /** Reminder title @required */
  title: string;
  /** Reminder list ID to add to */
  listId?: string;
  /** Reminder notes/description */
  notes?: string;
  /** Due date in ISO 8601 format */
  dueDate?: string;
  /** Priority level (none, low, medium, high) */
  priority?: string;
  /** Recurrence rule for repeating reminders */
  recurrence?: {
    /** Recurrence frequency */
    frequency: string;
    /** Interval between occurrences */
    interval: number;
    /** End date for recurrence */
    endDate?: string;
  };
  /** Location address for location-based reminder */
  address?: string;
  /** Proximity trigger (arrive or depart) */
  proximity?: string;
  /** Geofence radius in meters */
  radius?: number;
}

/**
 * Add a new reminder to Apple Reminders
 * @param {Request} req - Request object, body is {@link AddEventToAppleReminderOptions}
 * @returns The created reminder
 */
export default async function main(req: Request) {
  const options: AddEventToAppleReminderOptions = await req.json()

  const result = await addEventToAppleReminder(options)

  return Response.json({ result })
}
