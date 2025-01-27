import { Action, AppleCalender, res, SystemMessage, UserMessage, RequestOptions, EnconvoResponse, LLMProvider, ResponseAction } from "@enconvo/api";

export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()

  let content = options.event_describe_text || options.input_text || options.selection_text || options.context;

  if (!content) {
    throw new Error("No text to process")
  }

  // format : 2021-01-01 10:00:00
  const nowTime = new Date().toLocaleString()
  const messages = [
    new SystemMessage(`As Apple's Calendar software`),
    new UserMessage(`Please extract the title and  startDate & endDate(format: (YYYY-MM-DD HH:MM:SS) like 2022-12-31 23:59:59) of Calendar Event from the following text.And Just return it to me in JSON format, No explanation needed!.
Example Input:
  Remind me tomorrow morning at 10 o'clock to go to Beijing for a meeting.

Example Output:
{
  "title": "Go to Beijing for a meeting at 10 o'clock",
  "startDate": "2021-01-02 10:00:00"
  "endDate": "2021-01-02 11:00:00"
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
  const resultMessage = await llmProvider.call({ messages })

  let completion: string | undefined = resultMessage.text();

  completion = completion.replace(/```json/g, "")
  completion = completion.replace(/```/g, "")
  completion = completion.match(/{.*}/s)?.[0];

  if (!completion) throw new Error("Invalid JSON format")

  const completionOBJ = JSON.parse(completion)

  const result = await AppleCalender.addEvent({
    title: completionOBJ.title,
    startDate: completionOBJ.startDate,
    endDate: completionOBJ.endDate,
  })


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

  return {
    type: "text",
    content: result,
    actions: actions
  };


}
