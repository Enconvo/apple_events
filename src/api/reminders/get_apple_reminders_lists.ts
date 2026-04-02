import { getRemindersList } from "./utils/reminders_util.ts";

/**
 * Get all reminder lists from Apple Reminders
 * @param {Request} req - Request object (no parameters)
 * @returns Array of reminder lists
 */
export default async function main(req: Request) {
  const result = await getRemindersList();

  return Response.json({ result });
}
