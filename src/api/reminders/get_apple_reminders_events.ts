import { AppleReminders } from "@enconvo/api";

/**
 * Get all reminder items from Apple Reminders
 * @param {Request} req - Request object (no parameters)
 * @returns Array of reminders
 */
export default async function main(req: Request) {
  const result = await AppleReminders.getRemindersEventList()

  return Response.json({ result })
}
