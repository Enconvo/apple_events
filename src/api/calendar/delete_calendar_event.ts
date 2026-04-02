import { AppleCalender } from "@enconvo/api";

/** Delete calendar event request params */
interface DeleteCalendarEventParams {
  /** ID of the event to delete @required */
  eventId: string;
  /** Whether to delete all recurrences of a repeating event */
  allEvents?: boolean;
}

/**
 * Delete a calendar event by ID
 * @param {Request} req - Request object, body is {@link DeleteCalendarEventParams}
 * @returns Deletion confirmation with status and id
 */
export default async function main(req: Request) {
  const params = (await req.json()) as DeleteCalendarEventParams;

  if (!params.eventId) {
    throw new Error("eventId is required");
  }

  const result = await AppleCalender.deleteCalendarEvent(params);
  return Response.json({ result });
}
