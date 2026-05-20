# PIM — Personal Information Manager

A web application for managing personal and professional information in a single HTML file. No installation, no server — everything runs in the browser and is stored locally. Optional GitHub synchronization.

- **Online version**: <https://egdilna.github.io/nastroje/pim>
- **Source code (open source)**: <https://github.com/egdilna/nastroje/blob/main/pim>
- **Download and offline use**: download `pim.html` and open it in a modern browser (Chrome, Firefox, Safari, Edge). The app runs without an internet connection (except for some external services such as the PlantUML server or the Czech spell checker).

## Core concept

The app works with **entities**. An entity can be anything — a task, project, person, document, idea, meeting, diagram, plan. Instead of giving each entity a fixed type, you assign it one or more **aspects**. Aspects determine which **attributes** an entity has: a task has a deadline and status, a person has email and phone, a project has a dashboard. One entity can be a Task *and* a Document, or a Person *and* a Contact at the same time.

Entities are linked via **wiki links** (`[[Title]]`), **include links** (`{{include:Title}}`), **typed relationships** (part of, blocks, mentions, relates to…) and **attribute placeholders** (`((URL))`). Together they form a network you can browse, filter, search, and — for the most sensitive ones — encrypt.

## Getting started

**Main navigation** in the header:

- 🏠 **Dashboard** — work overview (overdue, today, this week, trackers, quick actions)
- **Inbox** — unprocessed entities (no aspects assigned)
- **All** — full list with sorting and advanced filtering
- **Tasks** — entities with the Task aspect
- 📅 **Calendar** — collapsible by month, today and the next 7 days expanded
- **Tags** — tag overview with counts
- 🏳️‍🌈 **Flags** — emoji flag overview (visible only if you have flags defined)
- **Tools** — import/export, link search, bulk operations, duplicate detection
- **Settings** — appearance, custom aspects, GitHub, static viewer

**In the header** (quick actions available from anywhere):

- 🔍 **Search** (key `/` or `h`) — full-text with arrow-key navigation in quick results
- ⚡ **Quick capture** (`q` or `Alt+Shift+Q`) — temporary dialog to capture an idea into the inbox (returns you to where you were)
- ✓ **Quick task** (`t` or `Alt+Shift+T`) — temporary dialog: title with natural-language deadline + project select
- ➕ **New entity** (`n`) — create an empty entity and open it for editing
- 📋 **From template** (`Shift+N`) — create from a predefined or custom template
- 📌 **Scratchpad** (`Alt+Shift+V`) — temporary text buffer for working between entities
- ❔ **Help** — complete overview of shortcuts, text syntax, and entity icons

## Dashboard — work center

The dashboard (`Alt+Shift+D`) is the first screen you should see in the morning. It contains:

1. **⚡ Quick actions** — two cards side by side:
   - **📥 Quick capture to Inbox** — a single textarea, first line = title, rest = note body
   - **✓ Quick task** — title (with natural-language deadline like "tomorrow at 3pm") + optional project select to which the task will be linked via `partOf`

2. **Statistics** — Inbox / Open tasks / Done (with percent) / Overdue (red)

3. **🚨 Overdue** (if any) — red box with 10 oldest overdue tasks and checkboxes for quick-done

4. **📌 Today — Wednesday, May 20, 2026** — yellow box with today's tasks, events, birthdays, reminders. Checkboxes next to tasks for quick-done.

5. **📅 This week** — tomorrow + 6 days, first 2 expanded, rest collapsed

6. **📊 Trackers** — cards with current value and progress bar for each entity with the Tracker aspect

7. **❓ Unanswered questions** — top 5

8. **🕐 Recently changed** — top 10 by `updated_at`

## Aspects, attributes, tags

### Aspects

An aspect is a "role" of an entity. You can assign any number:

| Aspect | What it adds |
|---|---|
| **Task** | Deadline, status, completion date, priority, energy |
| **Event** | Start, end, location, agenda — **plus a "Meeting tasks" section** |
| **Project** | Dashboard with sections for tasks, goals, documents, etc. |
| **Plan** | WBS task table with deadlines, predecessors, statuses, entity linking |
| **Tracker** | Value, unit, target, change history |
| **Diagram** | PlantUML source + preview, copy actions |
| **Presentation / Slide** | Slide-by-slide mode with timer (T/R keys, MM:SS / H:MM:SS) |
| **Goal, Question, Decision, Idea** | Specific fields |
| **Note, Document, Reference, Bookmark** | URL (with 📋 URL / 📋 Markdown buttons), author, date |
| **Person, Organization** | Contact details, relationships |
| **Communication** | Direction, channel (email, phone, meeting…), subject, outcome |
| **🔒 Secured** | AES-GCM 256 content encryption, per-entity password |

**Custom aspects**: in Settings you can define your own aspects with any number of fields of these types: text, textarea (markdown), number, date, date+time, URL, email, phone, checkbox, select, link to another entity, **composite text/markdown** (computed from a template), **source code** (collapsible block with 📋 Copy).

### "Source code" attribute type

A special attribute without markdown toolbar — stores exactly what you put in (JSON data, code snippet, template, any text). In read mode it appears in a collapsible `<details>` with a 📋 **Copy** button.

### Placeholders `((Attribute))` in text

Anywhere in markdown content or a textarea attribute you can use `((Attribute))` or `((Aspect/Attribute))` — at display time it gets replaced with the value. Works recursively: when `{{include:B}}` from entity A is rendered, placeholders in B's body are evaluated against B (its own attributes).

Special placeholders:
- `((Title))` — entity title
- `((Aspects))` — list of aspects
- `((Tags))` — list of tags

Below every markdown textarea is a **📎 Insert…** button that opens a dialog with all available placeholders from the entity, so you don't have to type them manually.

### Inline select `(!a/b/|c!)`

The template `(!yes/|no/maybe!)` renders in read mode as a `<select>` with a yellow chip. Click changes the value → debounced save (rewrites `|` to the new position). Next to the select is a **🔒 Fix selection** button that inserts the selected text as plain text (replacing the whole `(!...!)`).

In export / include / print / copy, inline-select is converted to `(!c!)` (just the selected value between exclamation brackets). In JSON export the full format is preserved for transfer.

### Tags

Free labels that an entity can belong to. In Inbox, Dashboard, and All you can filter by them. In "Advanced attribute filters" you can build complex conditions with 15 operators.

## Markdown content

The entity body uses markdown with extensions:

- **CommonMark + GFM** — headings H1–H6, bold, italic, ~~strikethrough~~, ==highlight==, code, blockquotes, lists, tables, images
- **Wiki links**: `[[Entity title]]` or `[[id:abc-123|label]]`
- **Include (transclusion)**: `{{include:Entity title}}` — embeds the content of another entity (with recursive placeholder evaluation)
- **Markdown tasks**: `- [ ] task`, `- [x] done` (with **→ Entity** button in annotation mode to convert to a standalone Task with `partOf` link)
- **CriticMarkup**: `{++add++}`, `{--delete--}`, `{>>note<<}` — revision editor with step-by-step accept/reject
- **Private blocks**: `~~~private … ~~~` — visible only in-app, not in export/include
- **Footnotes**: `[^1]` + `[^1]: text`
- **Placeholders**: `((Attribute))` — see above
- **Inline select**: `(!a/b/|c!)` — see above
- **Quick annotation**: `(>text)` — when saving edit mode, it gets converted to a regular annotation on the line where it was, and disappears from the body

## Annotations

Annotations are "post-it" notes attached to individual lines or paragraphs of content. They don't modify the text — they live alongside it in the "Annotations" section below the body.

**Annotation unit = one line**. For a normal paragraph this means the entire paragraph; for a **bullet/ordered list** it's a **single `<li>`**; for a **table** it's a **single `<tr>`**. So you can annotate a specific list item or table row.

**Enable**: key `a` in detail read mode, or the **📝 Annotations** button. In the mode, each line shows a **+ Annotation** button.

**Quick annotation** directly in text: type `(>note for later)` anywhere in the body. When you save edit mode, the text is removed and a regular annotation appears below that line. Purpose: quickly leave yourself an "IOU" while writing, without having to enable the mode, click buttons, etc.

## Table editor

In **section-edit mode** (toggle `d` in read mode or the "Edit sections" button), below each markdown table a **📊 Edit table** button appears. It opens an accessible dialog with a grid:

- Editable column headers + alignment (auto/left/center/right)
- Editable cells
- Row movement ▲ ▼ and column movement ◀ ▶
- Row and column deletion
- Row and column addition

After saving, the markdown in the source text is replaced with the new table. Accessible for screen readers (every input has a `<label>` with position, buttons have `aria-label`).

## Flags 🏳️‍🌈

Flags are **emoji inside text** that act as visual markers. They're not part of markdown — they're regular characters the app can find and show an overview for.

**Usage**: in body or in a textarea attribute, type an emoji from the flags list (defined in Settings → Flags). A **🏳️‍🌈 Flags** card appears in the navigation with an overview of all occurrences: where the emoji appears, in what kind of line (heading, bullet, task…), with context.

**Per-occurrence actions**:
- **✕** — remove emoji from text (saves the entity)
- **🔄** — change emoji to another from the flag list (grid with alternatives)

Flags are ideal for **your own tagging system**: 🔴 urgent, 🤔 think about, 💡 idea, ⏳ waiting, etc. You can mass-search and browse them across all entities.

## Meeting Attendees section 👥

A sibling section to "Meeting tasks" for entities with the **Event** aspect. Also always editable in read and edit mode.

**The attendees list** shows:
- 👤 Persons / 🏢 Organizations with link to detail
- ↗ button to open in a new panel
- ✕ button to remove from attendees

**Below the list** is an expandable **+ Add attendees** with a **multi-select** of all persons and organizations in the database that aren't yet attendees. Hold Ctrl/Cmd for multi-selection, and the **+ Add selected as attendees** button links them all at once via the `attendedBy` relationship (label "has attendee" / "attends").

Compared to the regular `r` (add link) shortcut, this is significantly faster for meetings with many people — you select them all at once and link with a single click.

The links also appear in the standard **Links** section (inverse: on a person, you see "is attendee of meeting X").

## Meeting Tasks section 📋

This is a flagship feature for **secretaries and project leads**. If an entity has the **Event** aspect, a "📋 Meeting tasks" section automatically appears for it — in read and edit mode, always editable.

**The tasks table** shows:
- **Link**: 🔗 part of meeting (`partOf`) · 📎 mentioned at meeting (`mentions`) · 🔸 historical link
- **Task** with a checkbox for quick-done + **↗** button to open in a new panel
- **Deadline** (red if overdue)
- **Status**
- **Last comment** (truncated)
- **Action**: 🔗✕ unlink task from meeting

**Below the table** is an expandable **+ Add task** with two variants:

### ✓ New task
Creates a task from natural-language text (title + optional "tomorrow at 3pm", "Friday 2pm", "6/30").
Links:
- Task → meeting projects: **partOf** (the task is genuinely part of the project)
- Meeting → task: **mentions** (the task was mentioned at the meeting)

A meeting can be in **multiple projects at once** — the task becomes part of all of them.

### 📎 Existing task from project
A select with all tasks from the meeting's projects that aren't yet linked. Adds a `mentions` link from the meeting → task (the task stays part of its project, just is now mentioned at this meeting).

So the link logic is:
- Task "belongs to" the project (via `partOf`)
- Task is "mentioned at" the meeting (via `mentions` from the meeting)

Links also show up in the standard **Links** section of the entity (bidirectionally — `mentions` / `is mentioned in`).

## Secured aspect 🔒

For sensitive content you want to encrypt before it's saved to disk (and therefore before sync to GitHub).

**How it works**:
- Add the **Secured** aspect to an entity
- When you save edit mode, a dialog appears: enter a password (with confirmation the first time)
- **Encrypted**: body + all `textarea` and `code` attributes
- **Not encrypted**: title, other attributes (text, number, date, URL, email, phone, select, checkbox, links, tags, aspects)
- Plain text is wiped, only the encrypted version stays on disk
- **Algorithm**: PBKDF2-SHA256 (100,000 iterations) → AES-GCM 256-bit via Web Crypto API

**Icons next to title**: 🔒 (locked) / 🔓 (unlocked in this session)

**When reading**: if the entity is locked, instead of content you see a prompt with a **🔓 Unlock** button. After entering the correct password, plain text is kept **only in memory** (`_unlockedSecured[id]`) — never written. On page refresh it auto-locks again.

**Search** in Secured entities: only searches the title, tags, aspects, and public attributes.

**Include** of a Secured entity:
- Locked → placeholder "🔒 Content is locked and cannot be embedded"
- Unlocked → embeds plain body with 🔓 header

**Security note**: The password is stored **nowhere** — not in memory, not in localStorage, not on disk. If you forget it, the content is unrecoverable (not even by Anthropic or the app's author).

## Advanced attribute filters

In the **All** view, under "Filters", is a collapsible **Advanced attribute filters** subsection. Click **+ Add attribute filter** to open a dialog:

1. **Attribute** — pick from global fields + attributes of active aspects (grouped select)
2. **Operator** — 15 types (automatically filtered by field type):
   - `=`, `≠`, `contains`, `does not contain`, `starts with`, `ends with`
   - `>`, `<`, `≥`, `≤`, `between` (with two inputs)
   - `is empty`, `is not empty`, `is checked`, `is unchecked`
3. **Value** — adaptive by type (text, number, date, select with options, checkbox)

Filters combine with **AND** logic. They're saved in Saved Views.

## Keyboard shortcuts

### Global (anywhere except editing fields)

| Key | Action |
|---|---|
| `q` / `Alt+Shift+Q` | Quick capture to Inbox |
| `t` / `Alt+Shift+T` | Quick task |
| `n` | New empty entity |
| `Shift+N` | New from template |
| `Alt+Shift+D` | Dashboard |
| `Alt+Shift+H` | Search in header |
| `Alt+Shift+V` | Scratchpad |
| `Alt+Shift+S` | Save to GitHub |
| `/` | Jump to search field |
| `?` | Help |
| `p` / `Alt+Shift+P` | Jump to first open panel |
| `Esc` | Close dialog / leave edit / back |

### In entity detail

| Key | Action |
|---|---|
| `e` | Toggle edit ↔ read |
| `u` | In edit mode: save and return to read |
| `r` | Add a link to an existing entity |
| `Shift+R` | Create a new related entity |
| `c` | Add a comment |
| `d` | (read, if it has headings) Toggle section-edit mode |
| `a` | (read) Toggle annotation mode |
| `Esc` | Back to read mode (saves quick annotations and changes) |

### Navigation

| Key | Action |
|---|---|
| Arrows ↑↓ in quick search results | Step through results |
| Arrows ↑↓ in entity table | Move between rows |
| Arrows ↑↓ in search results | Step through results |

## Links between entities

Links are typed references between entities. Defined types:

| Type | Inverse label |
|---|---|
| `partOf` | contains |
| `blocks` | is blocked by |
| `relatedTo` | relates to |
| `references` | is referenced by |
| `mentions` | is mentioned in |
| `dependsOn` | is dependency for |
| `dueTo` | is reason for |
| `answeredBy` | is answer to |
| `attendedBy` | was attendee of |

**Links show in both directions**: on the entity you see your outgoing links in Links section and incoming in Inverse Links.

## URL attributes — copy buttons

For every URL attribute (e.g. `url` on a Bookmark), in read mode there are two buttons next to the URL itself:
- **📋 URL** — copies the raw URL
- **📋 Markdown** — copies the format `[Entity title](URL)` usable in markdown

Brackets in the title are properly escaped in the markdown link.

## Calendar

The calendar was redesigned into clear sections:

- **Statistics** at the top: total / today / overdue
- **📌 Today and next 7 days** — expanded details
- **⏪ Last 3 days** — expanded details
- **🔮 Next months** — collapsed by month, click to expand individual days
- **🗄 Past** — collapsed by month, newer first

Icons by item type: ⏰ deadline, ▶ start, ⏹ end, 🎯 target, 🔍 review, 🎂 birthday, 📌 decided.

## Project dashboard

For an entity with the **Project** aspect, a dashboard is automatically generated with sections:
- 🎯 Goals (with manual progress bar and relative date)
- ✓ Tasks (with quick checkbox)
- 📅 Meetings
- 📄 Documents
- 📚 References
- etc.

Below each section is a quick-add action for a new project child.

## Print / Export / Copy

From the entity detail, the **🖨 Export / print…** button opens a dialog with checkboxes for each section and a format choice:

- **MD** — markdown (with include expansion, placeholder evaluation, inline-select simplification to `(!c!)`)
- **HTML** — for printing directly from the browser (Ctrl+P)
- **DOCX** — for Word, Outlook, email clients
- **PDF** — via system print

The **Meeting tasks** section renders into MD/HTML/DOCX/PDF, but **not** into include (so a meeting embedded in another entity doesn't drag its whole task table along).

## Data sync with GitHub

In Settings, set a GitHub Personal Access Token (fine-grained) and the target repository. The **☁ Sync** button (`Alt+Shift+S`) saves the current state (JSON) as a commit via the Contents API. For large files (>900 KB) the Git Blob API is used.

There's also a **static viewer** — generates a standalone HTML file with your entities in read-only mode, suitable for sharing.

## FAQ

**Where is my data?** In the browser's `localStorage` under the key `pim_db_v1::DEFAULT` (or `pim_db_v1::ID` for project pages).

**Can I have multiple separate databases?** Yes, via the URL parameter `?id=NAME`. Each ID has its own storage.

**How do I back up?** Tools → Export → JSON. Or enable GitHub sync.

**Can others see my Secured notes?** No. Their content is AES-GCM encrypted with a password that's stored nowhere. Without the password, no one can recover the plain text.
