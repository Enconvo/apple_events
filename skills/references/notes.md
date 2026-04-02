# Apple Notes Management Guide

Expert note-taking assistant for Apple Notes. Use when the user mentions notes management, creating notes, organizing notes, searching notes, note folders, or note productivity.

## Core Principles

1. **Use IDs when available**: Note IDs are more reliable than names (names can change when body is updated)
2. **Account scoping**: All operations support optional `account` parameter for multi-account setups
3. **Batch operations**: `delete_note` and `move_note` accept `ids` arrays for bulk operations
4. **Append over replace**: Use `append_to_note` to add content without overwriting

## Available API Tools

### Note Operations
- `add_note` — Create new note with name, content, folder, account
- `get_note_content` — Get full HTML body (by id or name)
- `get_note_details` — Get metadata without content (folder, dates, attachment count, length)
- `get_note_markdown` — Convert note to markdown format
- `update_note_content` — Replace content + optional rename (by id or name)
- `append_to_note` — Append content without replacing (supports \\n → `<br>`)
- `delete_note` — Delete single or batch (by id, name, or ids array)
- `move_note` — Move single or batch to folder (by id, name, or ids array)
- `search_notes` — Search by query with filters (folder, account, modified_since, limit)

### Listing & Discovery
- `list_notes` — List notes with optional folder/account/date/limit filters
- `list_accounts` — Show all Notes accounts (iCloud, Gmail, etc.)
- `list_folders` — List all folders with note counts
- `list_attachments` — List attachments of a specific note
- `list_shared_notes` — Show notes shared with collaborators

### Folder Management
- `create_folder` — Create new folder in an account
- `delete_folder` — Remove a folder

### Statistics
- `get_notes_stats` — Total notes/folders and per-account breakdown

## Common Workflows

### 1. Quick Note Capture
```
add_note(name="Meeting Notes 2026-04-02", content="...", folder="Work")
```

### 2. Find and Read a Note
```
search_notes(query="project plan") → get id
get_note_content(id="x-coredata://...")
```

### 3. Organize Notes into Folders
```
list_notes(limit=50)                     → review what exists
create_folder(name="Archive")            → create target
move_note(ids=[...], folder="Archive")   → batch move
```

### 4. Update an Existing Note
```
get_note_details(note_name="Shopping List")   → check metadata
append_to_note(id="...", content="New items") → add content
```
Or replace entirely:
```
update_note_content(id="...", new_content="...", new_title="Updated Title")
```

### 5. Cleanup Old Notes
```
list_notes(modified_since="2025-01-01")  → find old notes
delete_note(ids=[...])                   → batch delete
```

### 6. Export Note as Markdown
```
get_note_markdown(note_name="My Note")   → get markdown text
```

### 7. Multi-Account Management
```
list_accounts()                           → see all accounts
list_notes(account="iCloud", limit=10)    → browse specific account
list_folders(account="Gmail")             → see folder structure
```

## Tool Selection Guide

| Goal | Primary Tool | Alternative |
|------|-------------|-------------|
| Create note | `add_note` | - |
| Find note | `search_notes` | `list_notes` + browse |
| Read content | `get_note_content` | `get_note_markdown` |
| Check metadata | `get_note_details` | `list_notes` |
| Add to note | `append_to_note` | `update_note_content` |
| Replace content | `update_note_content` | - |
| Organize | `move_note` | `create_folder` + `move_note` |
| Bulk cleanup | `delete_note(ids=[...])` | `move_note` to trash folder |
| Overview | `get_notes_stats` | `list_accounts` |

## Important Notes

- **Note names derive from body**: In Apple Notes, the note "name" is the first line of the body. Updating the body may change the name. Always prefer ID-based lookups after creation.
- **Folders**: The default folder is "Notes". Use `list_folders` to discover available folders.
- **Recently Deleted**: Deleted notes go to "Recently Deleted" and can be recovered from there.
- **HTML content**: Note bodies are HTML. Use `get_note_markdown` for plain text/markdown.
- **Shared notes**: Use `list_shared_notes` to find collaborative notes. Be careful editing shared notes.
