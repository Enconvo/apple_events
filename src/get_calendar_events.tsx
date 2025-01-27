import { Action, RequestOptions, ResponseAction, AppleCalender, Response, renderkskkskdkdkksskskks } from "@enconvo/api";
import App from "./components/create_new_agent";
import React from "react";

interface GetCalendarEventsOptions extends RequestOptions {
  days?: number
}

export default async function main(req: Request): Promise<Response> {

  const options: GetCalendarEventsOptions = await req.json()

  const resp = await AppleCalender.getCalendarEventList({ days: options.days || 7 })
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


  // const helloPage = () => {
  //   return <div>
  //     <App >
  //     </App>
  //   </div>
  // }

  // const container = { id: 'hello', children: [], pendingChildren: [] };
  // renderkskkskdkdkksskskks(React.createElement(helloPage), container, () => {
  //   console.log("renderkskkskdkdkksskskks")
  // });


  return Response.text(result, actions);
}
