import { Action, RequestOptions, ResponseAction, AppleCalender, Response } from "@enconvo/api";

export default async function main(req: Request): Promise<Response> {

  const options: RequestOptions = await req.json()

  const resp = await AppleCalender.getCalendarEventList({ days: 1 })
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

  return Response.text(result, actions);


}
