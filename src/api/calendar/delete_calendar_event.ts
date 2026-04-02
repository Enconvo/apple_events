import { RequestOptions, AppleCalender } from "@enconvo/api";

/** Delete calendar event request params */
interface DeleteCalendarEventOptions extends RequestOptions {
  /** ID of the event to delete @required */
  eventId: string
  /** Whether to delete all recurrences of a repeating event */
  deleteAllRecurrences?: boolean
}

/**
 * Delete a calendar event by ID
 * @param {Request} req - Request object, body is {@link DeleteCalendarEventOptions}
 * @returns Deletion result
 */
export default async function main(req: Request) {
  const options: DeleteCalendarEventOptions = await req.json()

  const result = await AppleCalender.deleteCalendarEvent(options)

  return Response.json({ result })
}
