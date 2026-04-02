import { getRemindersList } from "./utils/reminders_util.ts";

/**
 * Get all reminder lists from Apple Reminders
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of reminder lists with id, title, color, isDefault
 */
export default async function main(_req: Request) {
  const result = await getRemindersList();
  return Response.json({ result });
}
