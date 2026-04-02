import { getCalendarEvents } from "./apple_calendar.ts";

/** Get calendar events request params */
interface GetCalendarEventsParams {
  /** Number of days ahead to fetch events @default 7 */
  days?: number;
  /** Start date in ISO 8601 format */
  from?: string;
  /** End date in ISO 8601 format */
  to?: string;
  /** Filter by calendar name */
  calendar?: string;
}

/**
 * Get upcoming calendar events for the specified number of days
 * @param {Request} req - Request object, body is {@link GetCalendarEventsParams}
 * @returns Array of calendar events grouped by calendar
 */
export default async function main(req: Request) {
  const params = (await req.json()) as GetCalendarEventsParams;
  const result = await getCalendarEvents(params);
  return Response.json({ result });
}
