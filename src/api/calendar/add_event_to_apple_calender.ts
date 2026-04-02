import { AppleCalender } from "@enconvo/api";

/** Add event to Apple Calendar request params */
interface AddEventParams {
  /** Event title @required */
  title: string;
  /** Start date in ISO 8601 format @required */
  startDate: string;
  /** End date in ISO 8601 format @required */
  endDate: string;
  /** Event notes/description */
  notes?: string;
  /** Whether this is an all-day event */
  isAllDay?: boolean;
  /** URL associated with the event */
  url?: string;
  /** Event location */
  location?: string;
  /** Calendar ID to add the event to */
  calendarId?: string;
  /** Calendar name to add the event to */
  calendarName?: string;
  /** Availability: busy, free, tentative, unavailable */
  availability?: string;
  /** Alarm offsets in minutes before event */
  alarms?: number[];
  /** Recurrence rule for repeating events */
  recurrence?: {
    /** Recurrence frequency: daily, weekly, monthly, yearly */
    frequency?: string;
    /** Interval between occurrences @default 1 */
    interval?: number;
    /** End date for recurrence */
    endDate?: string;
    /** Number of occurrences */
    count?: number;
  };
}

/**
 * Add a new event to Apple Calendar
 * @param {Request} req - Request object, body is {@link AddEventParams}
 * @returns The created calendar event with full details
 */
export default async function main(req: Request) {
  const params = (await req.json()) as AddEventParams;

  if (!params.title || !params.startDate || !params.endDate) {
    throw new Error("title, startDate, and endDate are required");
  }

  const result = await AppleCalender.addEvent(params);
  return Response.json({ result });
}
