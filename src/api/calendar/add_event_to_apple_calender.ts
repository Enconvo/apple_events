import { AppleCalender, RequestOptions } from "@enconvo/api";

/** Add event to Apple Calendar request params */
interface AddEventToAppleCalenderOptions extends RequestOptions {
  /** Raw input text for event creation */
  input_text: string;
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
  /** Availability status (0=busy, 1=free) */
  availability?: number;
  /** Alarm offsets in minutes before event */
  alarms?: number[];
  /** Recurrence rule for repeating events */
  recurrence?: {
    /** Recurrence frequency */
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    /** Interval between occurrences */
    interval?: number;
    /** End date for recurrence */
    endDate?: string;
    /** Number of occurrences */
    count?: number;
  };
}

/**
 * Add a new event to Apple Calendar
 * @param {Request} req - Request object, body is {@link AddEventToAppleCalenderOptions}
 * @returns The created calendar event
 */
export default async function main(req: Request) {
  const options: AddEventToAppleCalenderOptions = await req.json()

  //@ts-ignore
  const params: AppleCalender.EventOptions = options

  const result = await AppleCalender.addEvent(params)

  return Response.json({ result })
}
