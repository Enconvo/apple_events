import { Commander } from "@enconvo/api";

/**
 * Send a request to the unified appleReminders handler in the macOS app
 * @private
 */
async function send(params: Record<string, any>): Promise<any> {
  const resp = await Commander.send("appleReminders", params);
  if (resp.error) {
    throw new Error(resp.error);
  }
  return resp.data;
}

export async function addEventToAppleReminder(params: Record<string, any>) {
  return send({ action: "add", ...params });
}

export async function updateRemindersItem(params: Record<string, any>) {
  return send({ action: "edit", ...params });
}

export async function deleteRemindersItem(reminderId: string) {
  return send({ action: "delete", reminderId });
}

export async function getRemindersList() {
  return send({ action: "lists" });
}

export async function getRemindersEventList() {
  const data = await send({ action: "show" });
  return data?.reminders;
}

export async function toggleReminderCompletionStatus(reminderId: string) {
  return send({ action: "toggle", reminderId });
}
