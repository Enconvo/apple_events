# Email Management Expert Guide

Expert email management assistant for Apple Mail. Use when the user mentions inbox management, email organization, email triage, inbox zero, organizing emails, managing mail folders, email productivity, checking emails, or email workflow optimization.

## Core Principles

1. **Start with Overview**: Always begin with `list_accounts` + `get_unread_count` to understand current state
2. **Batch Operations**: Use batch IDs (pass arrays) when possible for efficiency
3. **Safety First**: Confirm destructive actions (delete, empty) before executing
4. **Progressive Actions**: Start with reversible actions (move, flag) before permanent ones (delete)

## Available API Tools

### Overview & Discovery
- `list_accounts` — List all configured mail accounts
- `list_mailboxes` — List all mailboxes (optionally filtered by account)
- `get_unread_count` — Get unread count for a mailbox
- `get_mail_stats` — Get per-account inbox stats (total + unread)

### Reading & Searching
- `list_messages` — List messages from a mailbox with pagination, sender filter, unread filter
- `search_messages` — Find emails by query, sender, subject, read/flagged status, date range
- `get_message` — Get full message content, recipients, attachments by ID

### Composing & Responding
- `send_email` — Compose and send email with to/cc/bcc/attachments
- `create_draft` — Create an unsent draft
- `reply_to_message` — Reply (or reply-all) to a message
- `forward_message` — Forward a message to new recipients

### Organization
- `move_message` — Move message(s) to a different mailbox (supports batch via ids array)
- `mark_as_read` / `mark_as_unread` — Toggle read status (supports batch)
- `flag_message` / `unflag_message` — Toggle flag status (supports batch)
- `delete_message` — Delete message(s) permanently (supports batch)

### Mailbox Management
- `create_mailbox` — Create a new mailbox/folder
- `delete_mailbox` — Remove a mailbox
- `rename_mailbox` — Rename an existing mailbox

### Attachments
- `list_attachments` — List all attachments in a message
- `save_attachment` — Download and save an attachment to disk

### Rules
- `list_rules` — List all mail rules with enabled status
- `enable_rule` / `disable_rule` — Toggle mail rules

## Common Workflows

### 1. Daily Inbox Triage (10-15 min)

1. `list_accounts` → See all accounts
2. `get_unread_count(mailbox="INBOX")` → See scope
3. `list_messages(unread_only=true, limit=20)` → Review unread
4. `search_messages(subject="urgent")` → Find priorities
5. Quick replies: `reply_to_message`
6. Organize: `move_message(to_mailbox="Projects/X")`
7. Mark processed: `mark_as_read(ids=[...])`
8. Flag follow-ups: `flag_message(ids=[...])`

### 2. Achieving Inbox Zero

Process each email with the **4D method**:
- **Delete**: Spam/unwanted → `delete_message`
- **Delegate**: Forward → `forward_message`
- **Do**: Quick reply → `reply_to_message`
- **Defer**: Save draft → `create_draft` or `flag_message`
- **File**: Archive → `move_message(to_mailbox="Archive")`

### 3. Finding Specific Emails

- By subject: `search_messages(subject="keyword")`
- By sender: `search_messages(from="name@example.com")`
- By date: `search_messages(date_from="2026-01-01", date_to="2026-01-31")`
- Unread only: `search_messages(is_read=false)`
- Flagged: `search_messages(is_flagged=true)`

### 4. Bulk Cleanup

1. `search_messages(from="newsletter@spam.com")` → Find targets
2. Review results
3. `delete_message(ids=[...])` → Batch delete
4. Or `move_message(ids=[...], to_mailbox="Archive")` → Safer alternative

### 5. Email Analytics

1. `get_mail_stats` → Per-account overview
2. `list_mailboxes(account="Google")` → Folder breakdown
3. `search_messages(from="frequent@sender.com")` → Sender analysis

## Tool Selection Guide

| Goal | Primary Tool | Alternative |
|------|-------------|-------------|
| See inbox state | `get_unread_count` | `get_mail_stats` |
| Find specific email | `search_messages` | `list_messages` + filter |
| Recent emails | `list_messages` | `search_messages` |
| Reply/Compose | `reply_to_message` | `send_email` |
| Organize | `move_message` | `flag_message` |
| Bulk status update | `mark_as_read(ids=[...])` | - |
| Analytics | `get_mail_stats` | `list_mailboxes` |
| Backup attachment | `list_attachments` → `save_attachment` | - |

## Best Practices

- **Batch Processing**: Process emails in dedicated time blocks, not continuously
- **2-Minute Rule**: If reply takes <2 min, do it immediately
- **Search > Sort**: Good search beats complex folder hierarchies
- **Folder Hierarchy**: Keep simple (max 2-3 levels deep)
- **Safety Limits**: For batch deletes, review the list before confirming
- **Reversible First**: Move to trash before permanent delete
