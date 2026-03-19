---
name: calender
description: >
  Apple Calendar integration with full CRUD operations -- add, update, delete, and query events and calendars using native macOS APIs, with support for recurrence rules, alarms, and all-day events.
metadata:
  author: ysnows
  version: "0.0.130"
---

## API Reference

Just use the `local_api` tool to request these APIs.

To view full parameter details for a specific endpoint, run: `node skills/scripts/api_detail.cjs <endpoint-path>`

| Endpoint | Description |
|----------|-------------|
| `calender/add_event_to_apple_calender` | Add an event to Apple Calendar. |
| `calender/update_calendar_event` | Update an event to Apple Calendar. |
| `calender/get_calendar_events` | Get calendar events. |
| `calender/delete_calendar_event` | Delete calendar event. |
| `calender/get_calendar_list` | Get calendar list. |

