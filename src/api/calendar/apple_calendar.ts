import { Commander } from "@enconvo/api";

/**
 * Send a request to the unified appleCalendar handler in the macOS app
 * @private
 */
async function send(params: Record<string, any>): Promise<any> {
  const resp = await Commander.send("appleCalendar", params);
  return resp.data;
}

export async function addEvent(params: Record<string, any>) {
  return send({ action: "add", ...params });
}

export async function updateEvent(params: Record<string, any>) {
  return send({ action: "edit", ...params });
}

export async function getCalendarEvents(params: Record<string, any> = {}) {
  return send({ action: "show", ...params });
}

export async function getCalendarList() {
  return send({ action: "calendars" });
}

export async function deleteCalendarEvent(params: Record<string, any>) {
  return send({ action: "delete", ...params });
}
