import { Action, RequestOptions, ResponseAction, AppleCalender, EnconvoResponse } from "@enconvo/api";

interface UpdateCalendarEventOptions extends RequestOptions {
  eventId: string
  // Natural language description of the event
  input_text: string;
  // Title of the calendar event
  title: string;
  // Start date and time in format 'yyyy-MM-dd HH:mm:ss'
  startDate: string;
  // End date and time in format 'yyyy-MM-dd HH:mm:ss'
  endDate: string;
  // Additional notes or description for the event
  notes?: string;
  // Whether this is an all-day event
  isAllDay?: boolean;
  // URL associated with the event
  url?: string;
  // Location of the event
  location?: string;
  // ID of calendar to add event to
  calendarId?: string;
  // Event availability status (0: free, 1: busy, etc)
  availability?: number;
  // Array of alarm offset times in seconds before event
  alarms?: number[];
  // Recurrence rule for repeating events
  recurrence?: {
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    endDate?: string;
    count?: number;
  };
}

export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: UpdateCalendarEventOptions = await req.json()

  const resp = await AppleCalender.updateEvent(options as AppleCalender.EventOptions & { eventId: string })
  console.log("resp", JSON.stringify(resp, null, 2))
  const result = JSON.stringify(resp)

  const actions: ResponseAction[] = [
    Action.OpenApplication({ app: "Calendar", title: "Open Calendar.app", icon: "calender.png" }),
    Action.Paste({
      content: result,
      closeMainWindow: true
    }),
    Action.Copy({
      content: result,
      closeMainWindow: true
    })
  ]

  return EnconvoResponse.text(result, actions);


}
