# PIM — Personal Information Manager


A web application for managing personal and professional information in a single HTML file. No installation, no server — everything runs in the browser and is stored locally. Optional GitHub synchronization.

- **Online version**: <https://egdilna.github.io/nastroje/pim>
- **Source code (open source)**: <https://github.com/egdilna/nastroje/blob/main/pim>
- **Changelog (version history)**: <https://nastroje.egdilna.cz/#pim>
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
| **Structured document** | Outline editor with custom styles, numbering (arabic/letters/roman, multi-level), H1–H6 headings, collapsible sections and Markdown blocks; export to MD and DOCX (tracked changes from CriticMarkup) |
| **Presentation / Slide** | Slide-by-slide mode with timer (T/R keys, MM:SS / H:MM:SS) |
| **Goal, Question, Decision, Idea** | Specific fields |
| **Note, Document, Reference, Bookmark** | URL (with 📋 URL / 📋 Markdown buttons), author, date |
| **Person, Organization** | Contact details, relationships |
| **Communication** | Direction, channel (email, phone, meeting…), subject, outcome |
| **🔒 Secured** | AES-GCM 256 content encryption, per-entity password |

**Custom aspects**: in Settings you can define your own aspects with any number of fields of these types: text, textarea (markdown), number, date, date+time, URL, email, phone, checkbox, select, link to another entity, **composite text/markdown** (computed from a template), **source code** (collapsible block with 📋 Copy). A custom aspect can be given an **icon (emoji)**, which then shows next to the entity and in lists.

In Settings, both built-in and custom aspects show their **icon** in the lists — built-in ones in the checkbox list, custom ones in a dedicated table column.

### "Source code" attribute type

A special attribute without markdown toolbar — stores exactly what you put in (JSON data, code snippet, template, any text). In read mode it appears in a collapsible `<details>` with a 📋 **Copy** button.

### Placeholders `((Attribute))` in text

Anywhere in markdown content or a textarea attribute you can use `((Attribute))` or `((Aspect/Attribute))` — at display time it gets replaced with the value. Works recursively: when `{{include:B}}` from entity A is rendered, placeholders in B's body are evaluated against B (its own attributes).

Special placeholders:
- `((Title))` — entity title
- `((Aspects))` — list of aspects
- `((Tags))` — list of tags

Below every markdown textarea is a **📎 Insert…** button that opens a dialog with all available placeholders from the entity, so you don't have to type them manually.

A placeholder's value is treated as **data, not markup**: when a date like `15. 3. 2026`, or a value starting with `- `, `# `, `>` or `|`, sits at the start of a line, it does not start a list, heading or quote. Inline formatting (for example `**bold**`) still works, and multi-line values of computed fields are still rendered as full Markdown.

A placeholder PIM does not recognise is left in the text exactly as written — so a typo in a field name is immediately visible. The same goes for `((deník))` and `((document))` on an entity without the matching aspect.

### Inline select `(!a/b/|c!)`

The template `(!yes/|no/maybe!)` renders in read mode as a `<select>` with a yellow chip. Click changes the value → debounced save (rewrites `|` to the new position). Next to the select is a **🔒 Fix selection** button that inserts the selected text as plain text (replacing the whole `(!...!)`).

In export / include / print / copy, inline-select is converted to `(!c!)` (just the selected value between exclamation brackets). In JSON export the full format is preserved for transfer.

### Tags

Free labels that an entity can belong to. In Inbox, Dashboard, and All you can filter by them. In "Advanced attribute filters" you can build complex conditions with 15 operators.

## Markdown content

The entity body uses markdown with extensions:

- **CommonMark + GFM** — headings H1–H6, bold, italic, ~~strikethrough~~, ==highlight==, code, blockquotes, lists, tables, images
- **Wiki links**: `[[Entity title]]` or `[[id:abc-123|label]]`
- **Link by entity number**: `#42` — the number is in the Meta section of the entity detail
- **Include (transclusion)**: `{{include:Entity title}}` — embeds the content of another entity (with recursive placeholder evaluation)
  - By internal ID: `{{include:id:<entity id>}}` — does not break when the target entity is renamed
- **Markdown tasks**: `- [ ] task`, `- [x] done` (with **→ Entity** button in annotation mode to convert to a standalone Task with `partOf` link)
- **CriticMarkup**: `{++add++}`, `{--delete--}`, `{==highlight==}`, `{>>note<<}`, `{~~old~>new~~}` (substitution) — revision editor with step-by-step accept/reject
- **Private blocks**: `~~~private … ~~~` — visible only in-app, not in export/include
- **Footnotes**: `[^1]` + `[^1]: text`
- **Placeholders**: `((Attribute))` — see above
- **Automatic counters**: `((#))` = level 1, `((##))` = level 2, etc.; `((#.##))` prints a multi-level number (e.g. `1.2`) — the deepest level increments, higher ones are read-only, deeper ones reset when a higher one increments. `((#name))` = a named running counter for the whole entity (each name runs independently)
- **Insert structured document**: `((document))` inserts the content of this entity's "Structured document" aspect at that point in the body (as Markdown)
- **Insert journal**: `((deník))` (or `((denik))` — this one has no English spelling) inserts this entity's journal at that point in the body, oldest entry first (only on entities with the "Journal" aspect)
- **Inline select**: `(!a/b/|c!)` — see above
- **Inline annotation**: `(>text)` — stays in the source, renders as an annotation bubble; never reaches export/print/copy (see Annotations section)

## Tools above a text field

Below every Markdown field (entity body, text attributes) there is a toolbar:

- **📎 Insert…** — inserts a dynamic element: wiki link, include (transclusion), status chip, flag, or (inside an entity) an attribute placeholder
- **📥 Paste from HTML** — takes formatted text from the clipboard (e.g. copied from a web page) and **converts it to Markdown** inserted at the cursor. Handles headings, bold/italic/strikethrough, links, images, lists (including nested and tasks), tables, blockquotes, and code. If there's no HTML in the clipboard, it pastes plain text
- **📝 Review** — CriticMarkup revision manager (accept/reject step by step)
- **🔍 Spellcheck** — spelling check (ÚFAL Korektor). Suggestions can be accepted with a single click; corrections are written directly into the text and work reliably even in text with diacritics and emoji
- **🧹 Lint** — Markdown syntax check

When you **select text** in a field, a "From selected text" toolbar appears with more actions:

- **📤 To new entity…** — moves the selection into a new entity (as its content) and inserts a **wiki link**, **include**, or **status** in its place. In the dialog you can immediately check which **projects** (taken from the source entity) the new entity should belong to
- **➕ Critic insert / ➖ Critic delete / 🔄 Critic replace** — wraps the selection in CriticMarkup
- **🖍 Highlight** — wraps the selection in `{==…==}`
- **💬 Comment** — adds a `{>>…<<}` comment after the selection (cursor lands inside the comment)
- **🔗 As link** — turns the selection into the text of a Markdown link and uses the **clipboard** contents as the URL. Workflow: copy a URL somewhere (Ctrl+C), then select the text and click — you get `[text](URL from clipboard)`

Every selection action is also **announced to the screen reader** (via aria-live), so you know what happened even without sight.

### Markdown editing keyboard shortcuts

When typing in a Markdown field (entity body, sections, scratchpad), these shortcuts work (⌘ instead of Ctrl on Mac):

| Key | Action |
|---|---|
| `Ctrl+B` | Bold `**text**` |
| `Ctrl+I` | Italic `*text*` |
| `Ctrl+K` | Link — if the clipboard holds a URL, inserts `[text](url)` with the cursor on the name; otherwise `[text]()` with the cursor between the parentheses |
| `Ctrl+H` | Heading at the same level as the last heading above the cursor (otherwise H2) |
| `Ctrl++` | Selection as Critic insert `{++…++}` |
| `Ctrl+-` | Selection as Critic delete `{--…--}` |
| `Ctrl+.` | Selection as Critic replace `{~~…~>…~~}` |
| `Ctrl+=` | Selection as highlight `{==…==}` |
| `Ctrl+Shift+K` | Insert wiki link to an entity |
| `Ctrl+Shift+E` | Insert include `{{include:…}}` |
| `Ctrl+Shift+S` | Insert status `{{status:…}}` |
| `Ctrl+Shift+I` | Insert flag (emoji picker) |
| `Ctrl+Shift+M` | Create a new entity from the selected text |
| `Ctrl+Shift+A` | Jump to the action toolbar for the selected text |
| `Ctrl+Shift+G` | Send the selected text to the artificial intelligence with your own instruction |

### Hiding completed tasks

If the content (or a Markdown attribute) contains checked tasks `- [x]`, a button appears to **hide them in the preview** — the text is unchanged, completed items are just tidied away.

## Scratchpad

Quick notes, snippets, and temporary ideas outside the database. Open it with the **📌 Scratchpad** button or the `Alt+Shift+V` shortcut. Content is saved automatically in the browser and persists between sessions (it is not part of the database or exports).

It has its own toolbar: **📎 Insert…**, **📥 Paste from HTML** (convert formatted clipboard text to Markdown), clearing completed tasks, and — after selecting text — actions over the selection including CriticMarkup, highlight, comment, and **🔗 As link** (URL from clipboard). The Markdown editing keyboard shortcuts work here too. Spellcheck, Review, and Lint are full-screen modes available directly on entities; they are not in the scratchpad.

## Annotations

Annotations are short notes attached to individual lines or paragraphs of content. They **live directly in the source text** as `(>annotation text)` at the end of the relevant line — the text is the single source of truth, so an annotation is always firmly bound to its paragraph (it can never "detach" or get remapped).

**Writing directly in text**: type `(>note)` anywhere on a line. On display and in `{{include:…}}` it renders as a yellow annotation bubble. An annotation is **plain text** (not markdown).

**Annotations panel** below the entity body lists every annotation, shows which paragraph it belongs to, and lets you manage it: **Edit** (a simple single-line field, Enter saves) and **Delete** — both directly modify the `(>text)` in the source.

**Enable annotation mode**: key `a` in detail read mode, or the **📝 Annotations** button. In the mode, each line shows a **+ Annotation** button that appends `(>…)` to the end of that line.

**Annotation unit = one line**. For a normal paragraph this means the entire paragraph; for a **bullet/ordered list** it's a **single `<li>`**; for a **table** it's a **single `<tr>`**.

**Where annotations show and where they don't**:
- **Display and include** (`{{include:…}}`) — the annotation renders as a bubble
- **Export, print, copy source and copy formatted** — the annotation is **omitted** (never reaches the output)

**Migration**: if you still have old annotations stored separately (from an earlier version), they are automatically converted into text as `(>text)` next to their paragraph the first time you save the entity.

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

## Topic 🌳

The **Topic** aspect is a "virtual entity" that automatically collects content into a single hub. Entities belong to a topic in three ways:

- **by tag** — set the topic's `topic_tag` and every entity with that tag appears in the topic
- **manually pinned** — pick specific entities into the key-entities field
- **via the "part of" link** — any entity with a `partOf` link to the topic appears in it (from the topic's perspective, as "contains")

An entity that qualifies in more than one way shows only once. Archived entities are ignored.

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

### ➕ New entity (other aspect)
Next to the new task you can directly create an entity of **any aspect** (note, document, person…): enter a title, pick an aspect and optionally tick which of the meeting's projects the entity should belong to. The entity gets a `mentions` link from the meeting and `partOf` links to the chosen projects — no manual creating and linking.

The same is available in the **project detail**: below the quick task there is a "+ New entity in this project" field (title + aspect choice) that creates an entity with a `partOf` link to the project.

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

Filters combine with **AND** logic.

**Saved views** keep the complete filter — aspect, tags (including "doesn't have tag"), task status, priority, deadline and advanced attribute filters. The filter survives toggling selection mode. Tag comparison is case-insensitive.

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
| `F10` | Main menu (in classic menu mode) — then arrows, Enter opens, Esc closes |
| `p` / `Alt+Shift+P` | Jump to first open panel |
| `Esc` | Close dialog / leave edit / back |

### In entity detail

| Key | Action |
|---|---|
| `e` | Toggle edit ↔ read |
| `Shift+E` | Toggle the advanced editor ↔ read (only on entities that have it enabled) |
| `u` | In edit mode: save and return to read |
| `r` | Add a link to an existing entity |
| `Shift+R` | Create a new related entity (you can check the source entity's projects right away) |
| `c` | Add a comment |
| `d` | (read, if it has headings) Toggle section-edit mode |
| `a` | (read) Toggle annotation mode |
| `z` | (entity with "Time tracking" aspect) Start/stop timer |
| `Shift+Z` | Add "Time tracking" aspect (if missing) and start the timer right away |
| `Esc` | Back to read mode (saves quick annotations and changes) |

### Navigation

| Key | Action |
|---|---|
| Arrows ↑↓ in quick search results | Step through results |
| Arrows ↑↓ in entity table | Move between rows |
| `e` on a table row | Edit entity directly |
| `o` on a table row | Open in a new panel |
| `l` on a table row | Quick-edit tags |
| `r` on a table row | Edit reminder date |
| `a` on a table row | Edit aspects |
| `Enter` on a table row | Open entity |
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

**Unified entity picker**: when adding a link (and elsewhere where an entity is selected — meeting attendees and tasks, etc.) a single shared dialog is used, with search and an **aspect filter**. For people, the organization they work at is shown in parentheses; for tasks, their status — to make selection easier.

## Adding a new entity straight into projects

When you create a new entity **from an existing one** — via a wiki link to a non-existent entity, via `Shift+R` (new related entity), or via "📤 To new entity…" from selected text — you're offered the **source entity's projects** as pre-checked boxes. Whichever you leave checked, the new entity immediately gets a `partOf` link into those projects. If the source entity isn't in any project, the boxes don't appear.

## Database directives `{{database:…}}` and `{{databasetext:…}}`

For an entity with the **Database** aspect, its records can be inserted into the text of another (or the same) entity:

- `{{database:Name}}` — inserts records as a **Markdown table**
- `{{databasetext:Name?format=…}}` — inserts records as **text** using a custom template (`format` with `<<Column>>` placeholders)

After the name you can add parameters separated by `&`: `columns` (column selection), `filter` (conditions), `sort` (sorting).

**Filter** supports the operators `=`, `*` (contains), `!=`, `<`, `>`, `<=`, `>=`, and an empty value (not filled). Multiple comma-separated conditions combine with **AND**.

**OR list via `|`**: for `=`, `*`, and `!=` you can give several values separated by a pipe — `filter=Code=A|B|C` means "Code is A **or** B **or** C". It also works on **computed (composed) fields**. (Note: `Code=A, Code=B` is AND and returns nothing, since a cell can't hold two values at once — use `|` for "one of these values".)

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

The **📋 Copy source** and **✨ Copy formatted** buttons (below the entity body), as well as export and print, render the `{{include:…}}`, `{{database:…}}`, `{{status:…}}` directives, placeholders and counters — so the clipboard/export never gets a raw directive, but its result. **Inline annotations `(>text)` never reach export, print, or copy** (they stay only in the source and in includes). Copying to the clipboard and downloading files also work in environments without a secure context (there's a reliable fallback path).

From the entity detail, the **🖨 Export / print…** button opens a dialog with checkboxes for each section and a format choice:

- **MD** — markdown (with expansion of include as well as `{{database:…}}` to a table and `{{status:…}}` to a text summary, placeholder and counter `((#))` evaluation, inline-select simplification to `(!c!)`)
- **HTML** — for printing directly from the browser (Ctrl+P)
- **DOCX** — for Word, Outlook, email clients
- **PDF** — via system print

The **Meeting tasks** section renders into MD/HTML/DOCX/PDF, but **not** into include (so a meeting embedded in another entity doesn't drag its whole task table along).

For entities with the **Project** aspect, the dialog also offers a **Tasks by category** option — the project's tasks are added to the export (MD/HTML/DOCX) grouped into kanban categories (To do, In progress, Waiting, Done) as headings with a task list. Handy as a project status report.

### Link to a specific entity

In the entity detail there is a **🔗 Copy link** button that copies a link pointing directly to this entity to the clipboard (it carries both the database and the specific entity via the `?id=…&e=…` parameters). Opening the link loads the database from GitHub and jumps straight to that entity. The address bar also keeps this link up to date as you open entities, so it can be copied straight from there.

## Archived items in the detail view

Archiving exists so that finished and outdated things disappear from everyday work while staying findable. In the entity detail, archived items are therefore **not shown in the regular sections**:

- **Links** show only outgoing and incoming links to active entities,
- the **project dashboard** (including the task kanban, goals, people and organizations) contains only active child entities,
- **Meeting tasks** and **Meeting attendees** show only active items.

Everything archived is collected instead into a single collapsed **🗄 Archive** section at the very bottom of the detail (above the technical Meta section). The count is in brackets; the section is split into **archived outgoing links** and **archived incoming links**, so you can see how each item relates to the entity — an archived project task shows as "is part of", an archived meeting attendee as "attends", and so on.

You can archive and restore from here as anywhere else, and the remove-link button (×) works in the Archive section too.

## Artificial intelligence

An optional feature: it lets you send text to a language model with your own instruction. You enter the key in **Settings → Artificial intelligence** and it is stored only in your browser (`localStorage`, key `pim_ai_key`). Until a key is set, none of the buttons appear.

**Two ways to send text:**

- **Selected text** — while editing content, select text and press `Ctrl+Shift+G`, or use the **✨ Artificial intelligence…** button in the toolbar above the selection.
- **The whole entity body** — the **✨ Artificial intelligence…** button below the entity body. It sends the rendered content: `{{include:…}}` expanded, placeholders and counters evaluated, annotations removed — exactly the text that goes into an export and to GitHub via `ghpath`.

**The dialog** has a field for your instruction, a collapsible **What will be sent** preview, and after sending a text area with the answer. You can still edit the answer there and then choose:

- **📋 Copy** — to the clipboard,
- **📤 As a new entity** — creates a new entity, the title is derived from the first line of the answer,
- **↩ Replace the selected text** — only for the selection variant; the field is rewritten only by this button, nothing changes on its own.

You can also send with `Ctrl+Enter` from the instruction field.

**What is never sent:** entities with the **Secured** aspect (not even unlocked ones) and `~~~private` blocks, which are cut out of the input — the dialog then reports how many. Before every send you can check in the preview exactly what is going out.

The model has a default; the **Model** field in settings can override it when needed. The **Verify connection** button tests the setup. The feature lives in the application only — the generated offline viewer does not contain it, and the key never reaches an export, the GitHub sync or the static viewer.

## Data sync with GitHub

In Settings, set a GitHub Personal Access Token (fine-grained) and the target repository. The **☁ Sync** button (`Alt+Shift+S`) saves the current state (JSON) as a commit via the Contents API. For large files (>900 KB) the Git Blob API is used.

There's also a **static viewer** — generates a standalone HTML file with your entities in read-only mode, suitable for sharing.

### Saving individual files to a repository — `ghpath` and `ghpngpath`

Besides syncing the whole database, PIM can save **a specific file to a specific location** in any repository. Two custom entity attributes do this:

| Attribute | What it saves | Where the button is |
|---|---|---|
| `ghpath` | the expanded entity body (directives, placeholders and counters are evaluated just like in export) | **☁ Save to GitHub** below the entity body |
| `ghpngpath` | the rendered **diagram PNG** (entities with the Diagram aspect only) | **☁ Save PNG to GitHub** in the diagram toolbar |

The value is a path of the form `owner/repo/path/file.ext` — the first two segments are the owner and the repository, the rest is the path within it. For example `egdilna/uilab/website.md` or `egdilna/uilab/img/architecture.png`.

Files are written to the `main` branch and an **existing file is overwritten** (PIM looks up its SHA itself); if the file does not exist yet, it is created. The same GitHub token as for sync is used.

The two attributes are independent: an entity can have just one of them, or both — each button then saves a different file to a different location.

## FAQ

**Where is my data?** In the browser's `localStorage` under the key `pim_db_v1::DEFAULT` (or `pim_db_v1::ID` for project pages).

**Can I have multiple separate databases?** Yes, via the URL parameter `?id=NAME`. Each ID has its own storage.

**How do I back up?** Tools → Export → JSON. Or enable GitHub sync.

**Can others see my Secured notes?** No. Their content is AES-GCM encrypted with a password that's stored nowhere. Without the password, no one can recover the plain text.
