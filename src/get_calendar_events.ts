import { Action, RequestOptions, EnconvoResponse, ResponseAction } from "@enconvo/api";
import osascript from 'osascript-tag';

export default async function main(req: Request): Promise<EnconvoResponse> {

  const options: RequestOptions = await req.json()


  const result = await osascript.default`
tell application "Calendar"
    set today to current date
    set futureDate to today + (30 * days)
    set eventList to ""

    repeat with aCalendar in calendars
        set matchedEvents to (events of aCalendar where start date ≥ today and start date ≤ futureDate)
        repeat with anEvent in matchedEvents
            set eventTitle to summary of anEvent
            set startTime to start date of anEvent
            set eventList to eventList & "标题: " & eventTitle & "\n" & "时间: " & startTime & "\n\n"
        end repeat
    end repeat
    return eventList
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
