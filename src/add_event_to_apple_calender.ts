import { uuid, Action, ActionProps, AppleCalender, res, ChatHistory, LLMUtil, LLMProviderBase, ServiceProvider } from "@enconvo/api";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";



export default async function main(req: Request) {

  const { options } = await req.json()
  const { input_text, context } = options

  let content = input_text || context;

  if (!content) {
    throw new Error("No text to process")
  }

  const requestId = uuid()

  // format : 2021-01-01 10:00:00
  const nowTime = new Date().toLocaleString()
  const messages = [
    new SystemMessage(`As Apple's Calendar software`),
    new HumanMessage(`Please extract the title and  startDate & endDate(format: (YYYY-MM-DD HH:MM:SS) like 2022-12-31 23:59:59) of Calendar Event from the following text.And Just return it to me in JSON format, No explanation needed!.
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


  const resultID = uuid()

  await res.write({
    content: {
      id: resultID,
      role: "ai",
      content: [
        {
          type: 'text',
          text: "Analyzing the event ...",
        }
      ]
    },
    overwrite: true
  })


  const chat: LLMProviderBase = ServiceProvider.load(options.llm)

  const stream = (await chat.call({ messages })).stream!
  const llmResult = await LLMUtil.invokeLLM(stream)


  let completion: string | undefined = llmResult;

  completion = completion.replace(/```json/g, "")
  completion = completion.replace(/```/g, "")
  // 只获取 {}json内容，如果有多余的文字，去掉
  completion = completion.match(/{.*}/s)?.[0];

  if (!completion) throw new Error("Invalid JSON format")

  const completionOBJ = JSON.parse(completion)
  console.log("completionOBJ", completionOBJ)


  const result = await AppleCalender.addEvent({
    title: completionOBJ.title,
    startDate: completionOBJ.startDate,
    endDate: completionOBJ.endDate,
  })
  console.log("result", result)

  await ChatHistory.saveChatMessages({
    input: content,
    output: result,
    llmOptions: options.llm,
    messages,
    requestId
  });

  const actions: ActionProps[] = [
    Action.Paste({
      content: result,
      closeMainWindow: true
    }),
    Action.OpenApplication({ app: "Calendar", title: "Open Calendar.app", icon: "calender.png" }),
    Action.Copy({
      content: result,
      closeMainWindow: true
    })
  ]

  const output = {
    type: "messages",
    messages: [
      {
        id: resultID,
        role: "ai",
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      }
    ],
    actions: actions
  }

  return output;


}
