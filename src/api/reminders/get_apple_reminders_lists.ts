import { AppleReminders } from "@enconvo/api";

/**
 * Get all reminder lists from Apple Reminders
 * @param {Request} req - Request object (no parameters)
 * @returns Array of reminder lists
 */
export default async function main(req: Request) {
  const result = await AppleReminders.getRemindersList()

  return Response.json({ result })
}
