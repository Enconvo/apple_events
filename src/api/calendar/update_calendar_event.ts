import { updateEvent } from "./apple_calendar.ts";

/** Update calendar event request params */
interface UpdateCalendarEventParams {
  /** ID of the event to update @required */
  eventId: string;
  /** Updated event title */
  title?: string;
  /** Updated start date in ISO 8601 format */
  startDate?: string;
  /** Updated end date in ISO 8601 format */
  endDate?: string;
  /** Whether this is an all-day event */
  isAllDay?: boolean;
  /** Updated event location */
  location?: string;
  /** Updated event notes */
  notes?: string;
  /** Updated URL */
  url?: string;
  /** Updated availability: busy, free, tentative, unavailable */
  availability?: string;
  /** Updated alarm offsets in minutes */
  alarms?: number[];
  /** Calendar name to move the event to */
  calendarName?: string;
  /** Calendar ID to move the event to */
  calendarId?: string;
  /** Apply changes to all events in a recurring series */
  allEvents?: boolean;
}

/**
 * Update an existing calendar event
 * @param {Request} req - Request object, body is {@link UpdateCalendarEventParams}
 * @returns The updated calendar event with full details
 */
export default async function main(req: Request) {
  const params = (await req.json()) as UpdateCalendarEventParams;

  if (!params.eventId) {
    throw new Error("eventId is required");
  }

  const result = await updateEvent(params);
  return Response.json({ result });
}
