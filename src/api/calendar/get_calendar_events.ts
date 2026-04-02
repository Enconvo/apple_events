import { RequestOptions, AppleCalender } from "@enconvo/api";

/** Get calendar events request params */
interface GetCalendarEventsOptions extends RequestOptions {
  /** Number of days ahead to fetch events @default 7 */
  days?: number
}

/**
 * Get upcoming calendar events for the specified number of days
 * @param {Request} req - Request object, body is {@link GetCalendarEventsOptions}
 * @returns Array of calendar events
 */
export default async function main(req: Request) {
  const options: GetCalendarEventsOptions = await req.json()

  const result = await AppleCalender.getCalendarEventList({ days: options.days || 7 })

  return Response.json({ result })
}
