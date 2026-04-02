import { getRemindersEventList } from "./utils/reminders_util.ts";

/**
 * Get all reminder items from Apple Reminders
 * @param {Request} req - Request object (no parameters)
 * @returns Array of reminders
 */
export default async function main(req: Request) {
  const result = await getRemindersEventList();

  return Response.json({ result });
}
