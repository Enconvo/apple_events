import { getRemindersEventList } from "./utils/reminders_util.ts";

/**
 * Get all incomplete reminder items from Apple Reminders
 * @param {Request} _req - Request object (no parameters)
 * @returns Array of incomplete reminders
 */
export default async function main(_req: Request) {
  const result = await getRemindersEventList();
  return Response.json({ result });
}
