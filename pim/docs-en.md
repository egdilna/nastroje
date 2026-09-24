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
  - The annotation text may contain parentheses, typically references to paragraphs: `(>see paragraph (2) of the act)`. They must be **balanced** — a lone `(` or `)` means the construct is not treated as an annotation and stays in the text as written.

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

## Section editor and its tools

In **section-edit mode** (toggle `d` in read mode or the "Edit sections" button), the ✏️
button at a heading opens the source editor for that one section. Below the text field are
the same tools as for editing the whole entity — **Vložit…** (Insert), **Smazat hotové úkoly**
(Delete done tasks), **📝 Revize** (Revisions), **Korektor** (Spell check) and **Lint**.

**Lint is not offered in the section editor.** It checks the structure of the whole
markdown document — heading levels, list numbering, links — and over a slice of one section
it reports nonsense, because it cannot see the rest of the body. It still works over the
entity's whole content.

Revisions and spell check are full-screen modes: the detail is re-rendered and the
section editor, which only lives in the open page, is destroyed with it. The app therefore
remembers which section you came from and, after **← Zpět na úpravy** (Back to editing),
**reopens the section editor with the text you ended up with in the tool**. You then write it
into the entity with **💾 Uložit sekci** (Save section) — only that writes to the body, so
**✕ Zrušit** (Cancel) still changes nothing.

**Delete done tasks** in the section editor removes ticked tasks from that section only. It
asks for confirmation first (same as over the whole content) and the number in brackets is
recomputed as you type, so it always shows how many tasks will go.

## Ordering of search results

Search still covers everything — title, tags, aspect, attributes, body and comments — but
**results are ordered by where the term was found**:

| Rank | Where the term was found |
|---|---|
| 1. | at the **start of the title** |
| 2. | at the **start of a word in the title** |
| 3. | anywhere in the title |
| 4. | in a tag or an aspect label |
| 5. | in an attribute |
| 6. | in the body or a comment |

For a multi-word query the best hit per word is summed, so an entity with the whole query in
its title ranks above one that has it scattered through the text. Equal scores are broken by
last change (newer first).

This applies to the **header quick search**, the **Search** view, the **All** view, searching
inside a saved view, and the **command palette** (where a title match also outranks a tag or
aspect match).

In lists with column sorting (All, saved views) relevance applies only **until you choose a
sort yourself** — clicking a column header wins. Changing the search text returns to relevance.
With no search text nothing changes; sorting works as before.

## Badges next to an entity's title

Wherever an entity is shown as a link, up to two small badges may follow its title:

| Badge | Meaning |
|---|---|
| `☐N` | number of **unfinished markdown tasks** (`- [ ] …`) |
| `💬N` | number of comments |

Tasks always come first. They are counted from the entity body and from text attributes —
the same as the *Má nedokončený MD úkol* filter, so the badge and the filter never disagree.
When everything is done, the badge disappears.

## List editor

In **section-edit mode** a button appears below every markdown list to edit it. The editor
shows the list with its nesting and offers moving, indenting, inserting, splitting, merging
and deleting for each item.

- **▾ / ▸** on an item that has children collapses or expands them. It is only a display
  state in the editor — it does not reach the saved markdown and collapsed items are saved too.
- **☐ úkol** (make task) turns the item into a markdown task — it only adds `[ ] ` at the
  start of the text. The bullet and indentation are handled by the editor itself. On an item
  that is already a task (`[ ]` or `[x]`) the button is not offered.

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

### Má vazbu z / Má vazbu na (linked from / linked to)

Two filters that ask about a link to a **specific entity**. You pick it with a button (the usual
*Select entity* dialog opens) and clear the filter with the ✕ next to it.

| Filter | Finds |
|---|---|
| **Má vazbu na** (linked to) | entities that link to the chosen entity — typically *everything belonging to a project* |
| **Má vazbu z** (linked from) | entities the chosen entity links to |

Links from the **Vazby** section and attributes of type *relation* count. Text mentions (wiki
links, includes) do not — the app tracks those separately as *Odkazy*.

The main reason this exists: filter everything belonging to one project and run **bulk
operations** on it (archive, export, send to the AI). The filter can be saved as a view and
works in the static viewer too.

### No tags at all, not in any project

Two tidy-up filters — they find what does not belong anywhere.

- **— nemá žádný tag —** (no tag at all) is an option in the *Nemá tag* select, right below
  "no restriction". It finds entities with not a single tag. Excluding one specific tag still
  works in the same select.
- **Projekt** is its own select with *Není v žádném projektu* (not in any project) and
  *Je v nějakém projektu* (in some project). It counts the **"is part of"** link to an entity
  with the *Project* aspect — the same reasoning the project dashboard uses. A "related to"
  link to a project is not enough.

Filters combine with **AND** logic.

**Saved views** keep the complete filter — aspect, tags (including "doesn't have tag"), task status, priority, deadline and advanced attribute filters. The filter survives toggling selection mode. Tag comparison is case-insensitive.

Above the results there is a **Search text** field that filters them as you type — the same as in the All view and with the same reach (title, body, attributes, tags). It does not change the view's saved filter, it only narrows it temporarily; the text is remembered for the session, so it is still there when you come back to the view.

Next to it is a **Show** select with 100, 300, 500, 1000, 2000 and *all*; the default is **100**. The same select is in the **All** view too (next to the Search text field), so plain filtering behaves the same way. It is a plain cap on the number of rendered rows, not pagination — the rest appears when you raise the limit. The count above the table always reports how many entities were found in total, and when truncated, how many are rendered. Sorting and filtering are computed over the whole result and only then truncated, so sorting descending really does show the first 100 — and above all, the page never renders more rows than the chosen number. The choice is remembered for the session (for the All view as well); the filter Reset button does not change it.

Note: bulk selection (and therefore export or chat over the selection) only works with what is rendered — at a limit of 100 you cannot tick an entity that was not shown.

## ⌘ Command palette

One place to run anything — views, actions on the open entity, tools, settings toggles, and
jumping to a specific entity or tag. The point is that you don't have to remember shortcuts
or know which menu something lives in: you just start typing.

**Opening:** `F1`, `Ctrl+Shift+P`, the **⌘ Příkazy** button in the header (`Alt+Shift+K`),
or *Paleta příkazů…* in the View and Help menus. Help moved to `Shift+F1` (the `?` key still works).

> Firefox claims `Ctrl+Shift+P` for private windows. That is why the palette is also on `F1`
> and on a button — one of the routes always gets through.

**Controls:** `↑` `↓` to move, `PageUp`/`PageDown` by eight, `Home`/`End` to the ends,
`Enter` runs, `Esc` closes. The mouse just clicks. On close, focus returns to wherever you
opened the palette from.

**An empty palette** offers the most recently used commands, context actions (actions on the
entity when one is open, actions on the list when you are in one), the main views, the
**most used tags**, and the **last 100 changed entities**.

**Typing** searches commands, entities and tags at once. Diacritics and case do not matter —
`ukoly` finds *Úkoly*. Several words behave as AND (`zah ukol` finds *Úkoly na zahradě*).
A leading character narrows the search:

| Prefix | Searches only |
|---|---|
| `>` | commands (without a prefix only the essential ones are listed; `>` shows the full catalogue) |
| `@` | entities |
| `#` | tags (`#` alone lists them all) |

**What is in the palette:**

- **Přejít (Go to)** — every view: Dashboard, Inbox, All, Tasks, Calendar, Tags, Reminders,
  Flags, Time tracking, Topics, Saved views, Templates, Links, Comments, Find and replace,
  Related, Trash, Data, Settings, Back — plus **Last 100 changed**.
- **Pohledy (Views)** — each saved view separately.
- **Vytvořit (Create)** — new entity, from template, quick capture, quick task, scratchpad.
- **Entita (Entity)** (only when one is open) — edit, rename, content, advanced editor,
  annotation mode, section editing, link, related entity, comment, export/print, outline,
  AI over the content, timer, duplicate, Inbox, archive, delete.
- **Seznam (List)** (in the All view and saved views) — selection mode, save filter as a view,
  number of rendered rows, sort by change time / creation time / title.
- **Nástroje (Tools)** — aspect diagnostics, orphan attributes, migrations, static viewer.
- **Data a GitHub** — import/export, save, load, autosave.
- **Nastavení (Settings)** — theme, navigation style, open settings.
- **Nápověda (Help)** — keyboard shortcuts.
- **Tags** — jump to the entities of a tag: opens the **All** view filtered by it and clears the
  other filters. Each tag shows how many entities it has; with no query the most used ones are
  offered, with the `#` prefix all of them. Archived entities are not counted.
- **Entities** — jump to a specific entity (opens its detail).

The offering is **context-aware**: whatever does not currently apply is not shown. Entity
actions only in a detail, list actions only in a list, GitHub only when configured, AI only
when the key is filled in.

At most 50 items are rendered, with a note below saying how many more results there are —
over a database of thousands of entities, typing in the palette would otherwise stutter.

### 🕒 Last 100 changed

Its own command (and an item in the View menu): opens the **All** view with no filters, sorted
by last change descending and capped at **100 rows**. It is a shortcut to "what was I just
doing"; you can search and filter in it as usual.

## ⏰ Task deadline

In the **Tasks** view every task has an **⏰ Termín** (Deadline) button. It opens the same dialog
as rescheduling in Reminders — including the field for typing the date in words. A task that
already has a deadline also gets **Vymazat termín** (Clear deadline); a task without one does
not. After saving, the list is re-rendered (it is sorted by deadline, so the task may move) and
focus returns to the button on the same task.

## 🔔 Reminders

A view of every entity with the **Reminder (date)** attribute filled in, sorted by date. Each
row shows the entity, the date, a status (*overdue* / *today* / *future*) and actions.

The date is only printed in the table. To change it use **📅 Přeplánovat** (Reschedule), which
opens a dialog with a date picker — confirm with *Změnit* or Enter; `Esc` and *Zrušit* change
nothing. **Odstranit** (Remove) clears the reminder on that entity (the entity itself stays).

The dialog offers two ways in. At the top is **Termín slovy** (date in words), where you type
naturally — `zítra`, `pondělí`, `za 3 dny`, `za 2 týdny`, `15.6.`, `2026-07-01`. As you type it
is evaluated, fills the date field below it and shows a preview (`→ 15. 6. 2026`), so you can
see how it was understood; input it cannot parse is reported and nothing is saved. Below is the
ordinary **Nebo datum z kalendáře** (or a date from the calendar) field.

It is the same parser the Calendar's reschedule uses, so both understand the same wording.

After either action the list is re-rendered and focus returns to the button on the same entity,
so you can carry on with the keyboard. A rescheduled row moves according to its new date.

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
| `F1` / `Ctrl+Shift+P` / `Alt+Shift+K` | **Command palette** (works in editing fields too) |
| `Shift+F1` / `?` | Help |
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
| `o` | Open the single filled **URL** attribute (same as clicking the link) |
| `x` / `Alt+Shift+X` | (read) Open Export / print |
| `Alt+Shift+G` | (read) Send the entity body to the artificial intelligence (only with a key set) |
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

The **Vybrat entitu** (Select entity) dialog — used for link targets, for inserting a wiki link
with `Ctrl+Shift+K`, and for includes and status chips — searches the entity's **title, tags and
type (aspect)** at once.

Every list item **starts with the entity's title**. The selection marker (`○` / `●`, or `☐` / `☑`
in multi-select) is visual only and screen readers do not read it, so first-letter navigation
works in the list. Selection state is carried by `aria-selected`, and arrow-key highlighting by
`aria-activedescendant` — so moving through the list does not announce "selected".
 For the type it matches both the label and the aspect key, so "Činnost"
finds not only entities with that word in the title but every entity of that type. Case and
**diacritics** do not matter — `cinnost` finds the same as `Činnost`. Several words behave as AND.

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

In an entity's detail the **`o`** key opens the single filled URL attribute — exactly as if
you clicked its link (new window, `noopener`). If the entity has no such attribute or has
several, nothing opens and the app just says why; it deliberately does not guess between
several addresses. Only URL attributes count, not links in the body.

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

### Task kanban

Project tasks sit above the sections in four columns — *To do*, *In progress*, *Waiting*, *Done*.
Above the columns is a **Skrýt prázdné sloupce** (Hide empty columns) checkbox, on by default:
a column with nothing in it is not rendered. The number in brackets after the label shows how
many columns are currently hidden. Unticking it shows all four; the choice is remembered in settings.

An empty column is also no longer a tall grey block — the grid no longer stretches columns to
the height of the tallest one, so when shown it is just a strip with its heading.

In the **static viewer**, empty columns are always omitted; there would be nowhere to put a
toggle in a single generated file.

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

## Bulk operations

In lists, the `x` key turns on **bulk-selection mode** — checkboxes appear next to the entities and a toolbar shows up with actions: add aspect, add/remove tag, add link, change attribute, archive, delete, 💬 chat with selected and **📤 Export**.

**📤 Export** opens the usual export dialog with the **selection pre-filled** — exactly the entities you ticked. The format (a JSON package for transfer between bases, or Excel) and the other options are still yours to choose, you just skip picking the entities by hand. The **Include linked entities** option works as usual.

Inside the dialog the selection is kept independently of the list, so it survives filtering and the fact that the list is capped at two hundred items; a counter below shows how many are selected and **Clear selection** empties it.

## Artificial intelligence

An optional feature: it lets you send text to a language model with your own instruction. You enter the key in **Settings → Artificial intelligence** and it is stored only in your browser (`localStorage`, key `pim_ai_key`). Until a key is set, none of the buttons appear.

**Three ways to send text:**

- **Selected text** — while editing content, select text and press `Ctrl+Shift+G`, or use the **✨ Artificial intelligence…** button in the toolbar above the selection.
- **The whole entity body** — the **✨ Artificial intelligence…** button below the entity body. It sends the rendered content: `{{include:…}}` expanded, placeholders and counters evaluated, annotations removed — exactly the text that goes into an export and to GitHub via `ghpath`.
- **A selected export** — the **✨ Artificial intelligence…** button in the **🖨 Export / print** dialog. You tick what the output should contain and exactly that Markdown is sent — the same one that would otherwise be copied or downloaded. This way attributes, links, comments or meeting tasks can be processed too, not just the body.

**The dialog** has a field for your instruction, a collapsible **What will be sent** preview, and after sending the answer — shown **rendered as Markdown**. The **✏ Edit** button switches to a text area and the same button switches back to the preview. Then you choose:

- **📋 Copy** — to the clipboard,
- **📤 As a new entity** — creates a new entity, the title is derived from the first line of the answer,
- **↻ Continue with the answer** — takes the answer (including your own edits) as the new input and waits for another instruction. You can refine text in several passes; replacing the selection stays available and still points at the same range.
- **⤵ Append to the content** — adds the answer after the existing text. If you started from a field being edited, it is appended to the end of that field (so an editing save can't overwrite it); elsewhere straight to the end of the entity body, and saved.
- **↩ Replace the selected text** — only for the selection variant; the field is rewritten only by this button, nothing changes on its own.

You can also send with `Ctrl+Enter` from the instruction field.

**What is never sent:** entities with the **Secured** aspect (not even unlocked ones) and `~~~private` blocks, which are cut out of the input — the dialog then reports how many. Before every send you can check in the preview exactly what is going out.

### Attribute suggestions

When the dialog is opened over an entity, it contains an **Entity attributes** disclosure with two columns of checkboxes:

- **Send** — the attribute's value is attached to the text as context. Only available for fields that have a value. Send only what is needed: every extra attribute makes the request longer (and pricier).
- **Suggest** — the artificial intelligence proposes a value for this attribute.

Nothing is pre-ticked — with a ten-field aspect the model would otherwise be asked about every empty one. You always choose yourself.

The **✨ Suggest attributes** button returns a table of *attribute – current value – suggestion* instead of the usual answer. A suggestion can be rewritten and ticked; only **Write selected** saves it into the entity. An empty suggestion cannot be written and nothing is overwritten on its own. You can add your own instruction in the prompt field ("summary in three sentences at most", "keep it formal").

A typical flow: select a paragraph in the body, attach for example Status and Deadline as context on the left, tick Subject, Summary and Author's notes on the right — and have them proposed.

Fields from all of the entity's aspects, global fields and the entity's own custom fields are offered, so it works for aspects you create yourself too. Computed fields (they have their own formula), hidden and technical fields and links to other entities are left out. For choice fields the service is given the list of allowed values, so it cannot return nonsense.

### Chat over selected entities

In any list, turn on bulk-selection mode (the `x` key), tick the entities and click **💬 Chat with selected**.

A conversation view opens. The content of the selected entities is attached as **background material to the first question** — later turns don't send it again and continue from the conversation history. The answer is **printed as it arrives** from the service, so you don't wait for the whole text.

- The background entities are listed at the top as links and can be removed one by one with the ✕; the **What will be sent as background** disclosure shows the exact text.
- **New conversation** discards the messages and keeps the background.
- **💾 Save as entity** opens a dialog: you enter a **title** (pre-filled from the first question) and tick the **projects** the conversation should belong to — the ones the background entities belong to are offered. An entity is created with a Markdown transcript of the conversation, `mentions` links to the background entities and `partOf` links to the ticked projects. Without that the conversation is **not stored anywhere** — it lives only until you close the page, so the database doesn't grow.

A saved conversation can be **picked as background material for another chat**. Its content (the transcript) is then attached to the first question of the new chat, so the model knows what you discussed. It is not a continuation of the same conversation, though: it is a new chat into which the transcript enters as background, and **the content of the original source entities is not sent with it** — tick them again if you want those too.

Secured entities never make it into the background material (the app says so when the chat opens) and `~~~private` blocks are cut out of the content.

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
