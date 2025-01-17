import { Action, res, AppleCalender, SystemMessage, UserMessage, LLMProvider, ResponseAction, RequestOptions, EnconvoResponse } from "@enconvo/api";

export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()

  let content = options.reminder_describe_text || options.input_text || options.selection_text || options.context;

  if (!content) {
    throw new Error("No text to process")
  }

  // format : 2021-01-01 10:00:00
  const nowTime = new Date().toLocaleString()

  const messages = [
    new SystemMessage(`As Apple's Reminder software`),
    new UserMessage(`Please extract the title and due date(format: (YYYY-MM-DD HH:MM:SS) like 2022-12-31 23:59:59) of Reminder from the following text.And Just return it to me in JSON format, No explanation needed!.
Example Input:
  Remind me tomorrow morning at 10 o'clock to go to Beijing for a meeting.

Example Output:
{
  "title": "go to Beijing for a meeting",
  "dueDate": "2021-01-02 10:00:00"
}


Input: 
${content}

Explanation About The DueDate :
 1. Please carefully and seriously calculate the time, do not make any errors in time! This is very important to me!
 2. If no specific time is specified, then it defaults to 08:00:00 of that day.
 3. Now is ${nowTime} 

Response Language:
Reply in the same language as the one used for input.

Output:

  `),
  ];


  res.writeLoading("Analyzing the event ...")


  const llmProvider = await LLMProvider.fromEnv()
  const llmResult = await llmProvider.call({ messages })

  let completion: string | undefined = llmResult.text();

  completion = completion.replace(/```json/g, "")
  completion = completion.replace(/```/g, "")
  completion = completion.match(/{.*}/s)?.[0];

  if (!completion) throw new Error("Invalid JSON format")

  const completionOBJ = JSON.parse(completion)

  const result = await AppleCalender.addReminder({
    title: completionOBJ.title,
    dueDate: completionOBJ.dueDate,
  })


  const actions: ResponseAction[] = [
    Action.OpenApplication({ app: "Reminders", title: "Open Reminders.app", icon: "reminder.png" }),
    Action.Paste({
      content: result,
      closeMainWindow: true
    }),
    Action.Copy({
      content: result,
      closeMainWindow: true
    })
  ]


  return {
    type: "text",
    content: result,
    actions: actions
  };

}
