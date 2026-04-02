/** Reminder item */
export interface Reminder {
    /** Unique identifier for the reminder */
    id: string;
    /** URL to open the reminder in Apple Reminders */
    openUrl: string;
    /** Title of the reminder */
    title: string;
    /** URL associated with the reminder */
    url?: string;
    /** Notes for the reminder */
    notes: string;
    /** Due date in "yyyy-MM-dd HH:mm:ss" or "yyyy-MM-dd" format */
    dueDate?: string;
    /** Whether the reminder is completed */
    isCompleted: boolean;
    /** Priority level: none, low, medium, high */
    priority: string;
    /** Completion date of the reminder */
    completionDate: string;
    /** Whether the reminder is recurring */
    isRecurring: boolean;
    /** Recurrence rule description */
    recurrenceRule: string;
    /** List to which the reminder belongs */
    list?: ReminderList;
    /** Location associated with the reminder */
    location?: Location;
}

/** Reminder list */
export interface ReminderList {
    /** Unique identifier for the list */
    id: string;
    /** Title of the list */
    title: string;
    /** Color associated with the list */
    color: string;
    /** Whether this is the default list */
    isDefault: boolean;
}

/** Location for location-based reminders */
export interface Location {
    /** Address of the location */
    address: string;
    /** Proximity trigger type: enter or leave */
    proximity: string;
    /** Geofence radius in meters */
    radius?: number;
}
