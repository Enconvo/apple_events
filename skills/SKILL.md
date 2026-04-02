---
name: apple-apps-and-services
description: >
  Manage Apple apps via native macOS APIs -- Calendar, Contacts, Mail, Messages, Maps, Notes, and Reminders with full CRUD operations, search, batch actions, and multi-account support.
metadata:
  author: Enconvo
  version: "0.0.133"
---

## API Reference

Just use the `local_api` tool to request these APIs.

| Endpoint | Description |
|----------|-------------|
| `apple-apps-and-services/calendar/add_event` | Add a new event to Apple Calendar. _12 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/calendar/delete_event` | Delete a calendar event by ID. Params: `eventId` (string, required), `allEvents` (boolean) |
| `apple-apps-and-services/calendar/get_events` | Get upcoming calendar events for the specified number of days. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/calendar/get_list` | Get list of all calendars with details. _No params_ |
| `apple-apps-and-services/calendar/update_event` | Update an existing calendar event. _13 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/contacts/find_contact_by_phone` | Find a contact by phone number. Params: `phone_number` (string, required), `phoneNumber` (string) |
| `apple-apps-and-services/contacts/find_number` | Find phone numbers for a contact by name. Params: `contact_name` (string, required), `name` (string) |
| `apple-apps-and-services/contacts/list_all` | List all contacts with optional limit. Params: `limit` (number, default: 50) |
| `apple-apps-and-services/contacts/search_contacts` | Search contacts by name, phone, or email. Params: `query` (string, required) |
| `apple-apps-and-services/mail/create_draft` | Create an email draft with recipients and content. _6 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/create_mailbox` | Create a new mailbox in a mail account. Params: `name` (string, required), `account` (string) |
| `apple-apps-and-services/mail/delete_mailbox` | Delete a mailbox from a mail account. Params: `name` (string, required), `account` (string) |
| `apple-apps-and-services/mail/delete_message` | Delete one or more messages (moves to Trash). Params: `ids` (array, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/mail/disable_rule` | Disable a mail rule by name. Params: `name` (string, required) |
| `apple-apps-and-services/mail/enable_rule` | Enable a mail rule by name. Params: `name` (string, required) |
| `apple-apps-and-services/mail/flag_message` | Flag one or more messages. Params: `ids` (array, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/mail/forward_message` | Forward a message to recipients with optional body prepend. _6 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/get_mail_stats` | Get per-account inbox statistics including total and unread message counts. _No params_ |
| `apple-apps-and-services/mail/get_message` | Get full message content including recipients and CC. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/get_selected` | Get the currently selected messages in the Mail app. _No params_ |
| `apple-apps-and-services/mail/get_unread_count` | Get unread message count for a mailbox, summing across accounts if no account specified. Params: `mailbox` (string), `account` (string) |
| `apple-apps-and-services/mail/list_accounts` | List all mail accounts with name, email, and full name. _No params_ |
| `apple-apps-and-services/mail/list_attachments` | List attachments of a specific email message. Params: `id` (string, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/mail/list_mailboxes` | List mailboxes with unread counts, optionally filtered by account. Params: `account` (string) |
| `apple-apps-and-services/mail/list_messages` | List messages in a mailbox with pagination and filters. _6 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/list_rules` | List all mail rules with enabled status. _No params_ |
| `apple-apps-and-services/mail/mark_as_read` | Mark one or more messages as read. Params: `ids` (array, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/mail/mark_as_unread` | Mark one or more messages as unread. Params: `ids` (array, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/mail/move_message` | Move one or more messages to a different mailbox. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/rename_mailbox` | Rename an existing mailbox. Params: `old_name` (string, required), `new_name` (string, required), `account` (string) |
| `apple-apps-and-services/mail/reply_to_message` | Reply to a message with optional reply-all and send/draft options. _6 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/save_attachment` | Save an email attachment to disk. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/search_messages` | Search messages with query, sender, subject, date, and status filters. _10 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/send_email` | Send an email with optional CC, BCC, and attachments. _7 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/mail/unflag_message` | Remove flag from one or more messages. Params: `ids` (array, required), `account` (string, required), `mailbox` (string, required) |
| `apple-apps-and-services/maps/add_to_guide` | Add a location to an existing guide in Apple Maps. Params: `guide_name` (string, required), `location_query` (string, required) |
| `apple-apps-and-services/maps/create_guide` | Create a new guide in Apple Maps. Params: `name` (string, required) |
| `apple-apps-and-services/maps/drop_pin` | Drop a pin at a location in Apple Maps. Params: `address` (string, required), `label` (string) |
| `apple-apps-and-services/maps/get_directions` | Get directions between two locations in Apple Maps. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/maps/list_guides` | List all guides in Apple Maps. _No params_ |
| `apple-apps-and-services/maps/save_location` | Save a location as a favorite in Apple Maps. Params: `name` (string, required), `address` (string, required) |
| `apple-apps-and-services/maps/search_locations` | Search for locations in Apple Maps. Params: `query` (string, required) |
| `apple-apps-and-services/messages/get_unread_messages` | Get recent unread iMessages. Params: `limit` (number, default: 10) |
| `apple-apps-and-services/messages/read_messages` | Read message history from a specific phone number or chat ID. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/messages/schedule_message` | Schedule an iMessage to be sent at a future time. Params: `recipient` (string, required), `message` (string, required), `scheduled_time` (string, required) |
| `apple-apps-and-services/messages/send_message` | Send an iMessage to a recipient. Params: `recipient` (string, required), `message` (string, required) |
| `apple-apps-and-services/notes/add_note` | Create a new note in Apple Notes. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/append_to_note` | Append content to an existing note without replacing. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/create_folder` | Create a new folder in Apple Notes. Params: `name` (string, required), `account` (string) |
| `apple-apps-and-services/notes/delete_folder` | Delete a folder from Apple Notes. Params: `name` (string, required), `account` (string) |
| `apple-apps-and-services/notes/delete_note` | Delete one or more notes by id, name, or batch ids. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/get_note_content` | Get the full HTML body of a note by id or name. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/get_note_details` | Get note metadata without content (folder, dates, attachment count, length). Params: `id` (string), `note_name` (string), `account` (string) |
| `apple-apps-and-services/notes/get_note_markdown` | Convert a note's content to markdown format. Params: `id` (string), `note_name` (string), `account` (string) |
| `apple-apps-and-services/notes/get_notes_stats` | Get total notes/folders count and per-account breakdown. _No params_ |
| `apple-apps-and-services/notes/get_selected` | Get the currently selected note in the Notes app. _No params_ |
| `apple-apps-and-services/notes/list_accounts` | List all Notes accounts with note and folder counts. _No params_ |
| `apple-apps-and-services/notes/list_attachments` | List attachments of a specific note. Params: `id` (string), `note_name` (string), `account` (string) |
| `apple-apps-and-services/notes/list_folders` | List all folders in Apple Notes with note counts. Params: `account` (string) |
| `apple-apps-and-services/notes/list_notes` | List notes with optional folder, account, date, and limit filters. _4 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/list_shared_notes` | List all shared/collaborative notes. _No params_ |
| `apple-apps-and-services/notes/move_note` | Move one or more notes to a different folder. _5 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/search_notes` | Search notes by title and optionally content with filters. _6 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/notes/update_note_content` | Replace the content of a note and optionally rename it. _9 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/reminders/add` | Add a new reminder to Apple Reminders. _9 params — use `check_local_api_schemas` tool_ |
| `apple-apps-and-services/reminders/delete` | Delete a reminder by ID. Params: `reminderId` (string, required) |
| `apple-apps-and-services/reminders/get_events` | Get all incomplete reminder items from Apple Reminders. _No params_ |
| `apple-apps-and-services/reminders/get_lists` | Get all reminder lists from Apple Reminders. _No params_ |
| `apple-apps-and-services/reminders/toggle_completion` | Toggle a reminder's completion status between complete and incomplete. Params: `reminderId` (string, required) |
| `apple-apps-and-services/reminders/update` | Update an existing reminder's properties. _9 params — use `check_local_api_schemas` tool_ |


## References

- [Apple Contacts](references/contacts.md) — AppleScript patterns for querying Contacts.app (phone lookup gotchas, name search, output format).
- [Apple Mail](references/mail.md) — Email management workflows: send, search, organize, attachments, rules, and multi-account support.
- [Apple Notes](references/notes.md) — Note CRUD, folders, search, batch operations, markdown export, and multi-account support.
