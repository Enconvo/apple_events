import { Action, AppleCalender, res, SystemMessage, UserMessage, RequestOptions, LLMProvider, ResponseAction, Response, StringTemplate } from "@enconvo/api";
import { extract_calendar_event_prompt } from "./prompts.ts";

/**
 * Interface defining the options for adding an event to Apple Calendar
 */
interface AddEventToAppleCalenderOptions extends RequestOptions {
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

export default async function main(req: Request): Promise<Response> {

  const options: AddEventToAppleCalenderOptions = await req.json()

  let content = options.input_text || options.selection_text || options.context;

  let params: AppleCalender.EventOptions

  if (content) {
    // format : 2021-01-01 10:00:00
    const nowTime = new Date().toLocaleString()
    // Define messages for LLM to extract calendar event details from natural language

    const template = new StringTemplate(extract_calendar_event_prompt)
    const prompt = template.format({
      content,
      nowTime
    })


    const messages = [
      new SystemMessage(`As Apple's Calendar software`),
      new UserMessage(prompt)
    ];


    res.writeLoading("Analyzing the event ...")

    const llmProvider = await LLMProvider.fromEnv()
    const resultMessage = await llmProvider.call({ messages })

    let completion: string | undefined = resultMessage.text();

    completion = completion.replace(/```json/g, "")
    completion = completion.replace(/```/g, "")
    completion = completion.match(/{.*}/s)?.[0];

    if (!completion) throw new Error("Invalid JSON format")

    params = JSON.parse(completion)

  } else {
    //@ts-ignore
    params = options
  }

  console.log("params", JSON.stringify(params, null, 2))

  const result = await AppleCalender.addEvent(params)

  const actions: ResponseAction[] = [
    Action.OpenApplication({ app: "Calendar", title: "Open Calendar.app", icon: "calender.png" }),
    Action.Paste({
      content: result.toString(),
      closeMainWindow: true
    }),
    Action.Copy({
      content: result.toString(),
      closeMainWindow: true
    })
  ]

  return {
    type: "text",
    content: result.toString(),
    actions: actions
  };


}
