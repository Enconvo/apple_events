import { Action, RequestOptions, EnconvoResponse, ResponseAction } from "@enconvo/api";
import osascript from 'osascript-tag';

export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()

  const result = await osascript`
tell application "Calendar"
    get name of every calendar
end tell
`;


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
