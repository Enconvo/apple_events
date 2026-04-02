import { RequestOptions, AppleCalender } from "@enconvo/api";

/** Update calendar event request params */
interface UpdateCalendarEventOptions extends RequestOptions {
  /** ID of the event to update @required */
  eventId: string
  /** Raw input text for event update */
  input_text: string;
  /** Updated event title @required */
  title: string;
  /** Updated start date in ISO 8601 format @required */
  startDate: string;
  /** Updated end date in ISO 8601 format @required */
  endDate: string;
  /** Updated event notes/description */
  notes?: string;
  /** Whether this is an all-day event */
  isAllDay?: boolean;
  /** URL associated with the event */
  url?: string;
  /** Updated event location */
  location?: string;
  /** Calendar ID to move the event to */
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
 * Update an existing calendar event
 * @param {Request} req - Request object, body is {@link UpdateCalendarEventOptions}
 * @returns The updated calendar event
 */
export default async function main(req: Request) {
  const options: UpdateCalendarEventOptions = await req.json()

  const result = await AppleCalender.updateEvent(options as AppleCalender.EventOptions & { eventId: string })

  return Response.json({ result })
}
