import { Action, RequestOptions, ResponseAction, AppleCalender, Response } from "@enconvo/api";

interface GetCalendarEventsOptions extends RequestOptions {
  days?: number
}

export default async function main(req: Request): Promise<Response> {

  const options: GetCalendarEventsOptions = await req.json()

  const resp = await AppleCalender.getCalendarEventList({ days: options.days || 7 })
  // Convert calendar events to markdown table format

  if (options.runType === "agent") {
    return Response.json({
      events: resp
    })
  }

  const eventsToMarkdownTable = (events: any[]) => {
    // Create table header
    let markdown = '| Title | Start Date | End Date | Calendar | Status |\n';
    markdown += '|--------|------------|-----------|-----------|--------|\n';

    // Add each event as a table row
    events.forEach(event => {
      const startDate = new Date(event.startDate).toLocaleDateString();
      const endDate = new Date(event.endDate).toLocaleDateString();
      markdown += `|[${event.title}](${event.openUrl})|${startDate}|${endDate}|${event.calendarTitle}|${event.status}|\n`;
    });

    return markdown;
  };

  // Format events into markdown table
  const result = resp.map(calendar => {
    const markdown = eventsToMarkdownTable(calendar.events);
    return `## ${calendar.calendar.title}\n\n${markdown}\n`;
  }).join('\n');


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
