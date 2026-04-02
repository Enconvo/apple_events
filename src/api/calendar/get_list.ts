import { getCalendarList } from "./apple_calendar.ts";

/**
 * Get list of all calendars with details
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of calendars with id, title, color, source
 */
export default async function main(_req: Request) {
  const result = await getCalendarList();
  return Response.json({ result });
}
