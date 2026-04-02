import { Reminder } from "../types/types.ts"
import { Commander } from "@enconvo/api"


export const addEventToAppleReminder = async (params: any) => {
    const resp = await Commander.send("addEventToAppleReminder", params)

    let result = resp.data as Reminder

    return result
}

// Function to delete a reminder by its ID
export const deleteRemindersItem = async (reminderId: string) => {
    // Send a command to delete the reminder with the specified ID
    const resp = await Commander.send("deleteRemindersItem", { reminderId: reminderId });

    // Check if the response indicates success
    return resp.data || false
}

// The JSON structure for the `UpdateReminderPayload` is as follows:
/*
{
    "reminderId": "string",       // The unique identifier of the reminder to be updated
    "title": "string",            // (Optional) The new title for the reminder
    "notes": "string",            // (Optional) The new notes for the reminder
    "dueDate": "string",          // (Optional) The new due date for the reminder in the format "yyyy-MM-dd HH:mm:ss"
    "priority": "string",         // (Optional) The new priority for the reminder, can be "high", "medium", "low", or "none"
    "recurrence": {               // (Optional) The new recurrence rule for the reminder
        "frequency": "string",    // The frequency of the recurrence, e.g., "daily", "weekly", "monthly", "yearly"
        "interval": "integer",    // The interval of the recurrence
        "end": {                  // (Optional) The end of the recurrence
            "endDate": "string",  // The end date of the recurrence in the format "yyyy-MM-dd"
            "occurrenceCount": "integer" // The number of occurrences for the recurrence
        }
    },
    "address": "string",          // (Optional) The new address for the location-based reminder
    "proximity": "string",        // (Optional) The new proximity for the location-based reminder, e.g., "enter", "leave"
    "radius": "number"            // (Optional) The new radius for the location-based reminder in meters
}
*/

interface UpdateRemindersItemParams {
    reminderId: string;
    title?: string;
    notes?: string;
    dueDate?: string;
    priority?: string;
    recurrence?: {
        frequency: string;
        interval: number;
        endDate?: string;
        occurrenceCount?: number;
    };
    address?: string;
    proximity?: string;
    radius?: number;
}

// Function to update a reminder
export const updateRemindersItem = async (updatePayload: UpdateRemindersItemParams) => {
    // Send a command to update the reminder with the specified ID and payload
    const resp = await Commander.send("updateEventToAppleReminder", updatePayload);

    // Check if the response indicates success
    return resp.data as Reminder;
}
