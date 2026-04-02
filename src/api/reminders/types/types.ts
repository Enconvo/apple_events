
// Define the Reminder interface
export interface Reminder {
    id: string;                // Unique identifier for the reminder
    openUrl: string;           // URL to open the reminder
    title: string;             // Title of the reminder
    url?: string;              // Optional URL associated with the reminder
    notes: string;             // Notes for the reminder
    dueDate?: string;          // Optional due date in "yyyy-MM-dd HH:mm:ss" or "yyyy-MM-dd" format
    isCompleted: boolean;      // Flag indicating if the reminder is completed
    priority: string;          // Priority level of the reminder
    completionDate: string;    // Completion date of the reminder
    isRecurring: boolean;      // Flag indicating if the reminder is recurring
    recurrenceRule: string;    // Recurrence rule for the reminder
    list?: ReminderList;       // Optional list to which the reminder belongs
    location?: Location;       // Optional location associated with the reminder
}

// Define the ReminderList interface
export interface ReminderList {
    id: string;                // Unique identifier for the list
    title: string;             // Title of the list
    color: string;             // Color associated with the list
    isDefault: boolean;        // Flag indicating if the list is the default list
}

// Define the Location interface
// Define the Location interface
export interface Location {
    address: string;           // Address of the location
    proximity: string;         // Proximity type for location-based reminders
    radius?: number;           // Optional radius for location-based reminders
}
