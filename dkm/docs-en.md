# DKM — Dynamic Knowledge Manager

User Guide

- **Online tool:** <https://nastroje.egdilna.cz/dkm>
- **EGdílna tools index:** <https://nastroje.egdilna.cz/#dkm>
- **Source code:** <https://github.com/egdilna/nastroje> (folder `dkm`)

---

## Table of Contents

1. [What DKM is and what it's good for](#1-what-dkm-is-and-what-its-good-for)
2. [Getting started in five minutes](#2-getting-started-in-five-minutes)
3. [Key concepts](#3-key-concepts)
4. [User interface tour](#4-user-interface-tour)
5. [Working with entities](#5-working-with-entities)
6. [Entity types](#6-entity-types)
7. [Attributes](#7-attributes)
8. [Aspects](#8-aspects)
9. [Relations](#9-relations)
10. [Search, filters, sorting](#10-search-filters-sorting)
11. [Bulk operations](#11-bulk-operations)
12. [Inbox and Archive](#12-inbox-and-archive)
13. [Markdown and CriticMarkup](#13-markdown-and-criticmarkup)
14. [Multiple projects](#14-multiple-projects)
15. [Storage: local and GitHub](#15-storage-local-and-github)
16. [Import and export](#16-import-and-export)
17. [Static viewer](#17-static-viewer)
18. [Transferring parts between projects (packages)](#18-transferring-parts-between-projects-packages)
19. [Settings](#19-settings)
20. [Keyboard shortcuts](#20-keyboard-shortcuts)
21. [Accessibility](#21-accessibility)
22. [Tips and tricks](#22-tips-and-tricks)
23. [Frequent issues](#23-frequent-issues)
24. [Technical background](#24-technical-background)

---

## 1. What DKM is and what it's good for

**DKM (Dynamic Knowledge Manager)** is a tool for managing structured knowledge — things, people, documents, requirements, contracts, anything that can be described by attributes and linked by relations. Instead of filling out forms in a rigid database, you define your own **entity types** and **relations** the way that makes sense to you, and gradually populate them with content.

DKM is useful for:

- **Personal information manager** — contacts, projects, tasks, books, movies, knowledge graph of personal stuff
- **Software data model** — entities, their attributes, relations between tables, audit
- **Legislation and requirements** — paragraphs, obligations, references, supporting documentation
- **Lightweight CRM** — clients, projects, contracts, people on the other side
- **Library catalog, card files** — anything that was traditionally in index card boxes
- **Wiki with typed pages** — when plain Markdown isn't enough

The tool is **a single HTML file** running in a browser. No server, no installation, no account. Your data is yours and lives in the browser, or optionally in a GitHub repository under your control.

---

## 2. Getting started in five minutes

1. Open the tool at <https://nastroje.egdilna.cz/dkm> or download `dkm.html` from GitHub and open locally.
2. On first open DKM welcomes you with an empty project. Click **Settings** in the header.
3. Go to **Entity types** and click **+ Add entity type**. Fill in the name (e.g. „Person") and an icon (say 👤).
4. Click that type in the list and add attributes (e.g. „Email" of type URL, „Phone" of type text, „Description" of type textarea).
5. Return to the main view via the **Esc** key or by clicking the logo at the top.
6. Click **+ New entity** in the All tab and create your first entity of type Person.
7. After saving, you'll see the entity in the list. Click it to open the detail.

That's it. The rest of this guide is about turning this into a genuinely useful system.

---

## 3. Key concepts

DKM rests on six terms. Let's go through them with concrete examples.

### 3.1 Entity

An **entity** is one specific thing you want to remember — *John Smith*, *Contract 2026/001*, *iPhone 14 Pro*, *Meeting with the director June 4, 2026*. Each entity has a **name** and usually a **type**.

### 3.2 Entity type

The **type** determines an entity's structure — what attributes it has. A type has a **name** (e.g. „Person", „Contract", „Asset") and optionally an **icon** (emoji that helps differentiate types at a glance).

The key point: a type doesn't dictate content, only the template for attributes. Entities of the same type don't have to fill in all attributes.

### 3.3 Attribute

An **attribute** is a property of an entity. It's defined at the type level (and aspect level, see below) — all entities of the same type share the same attributes.

Attribute data types:

- **text** — short single-line string
- **textarea** — multi-line text with Markdown and CriticMarkup support
- **date** — date
- **url** — link (rendered as clickable)
- **select** — choice from a predefined list of values
- **yesno** — yes/no
- **number** — number
- **relation** — pointer to another entity (optionally constrained to a specific type)

For each attribute you can set:

- **Required** — DKM won't save the entity without it being filled
- **Show in list** — the value appears directly in the entity card in lists

### 3.4 Aspect

An **aspect** is something like a tag with an extension. An aspect adds **further attributes** to an entity, **independent of its type**.

Example: you have types „Person", „Contract", „Asset". You define an aspect „Approval" with two attributes: *Approver* (relation to Person) and *Approved on* (date). The aspect „Approval" can then be assigned to any entity — a person, a contract, an asset — and each will have access to those two additional attributes.

Aspects are also used as:

- **Filter** in lists (the „Aspect: Approval" tab shows all entities with that aspect)
- **Semantic tag** (entity „is VIP", „is archived legacy logic", „passed audit")
- **State modifier** with attributes about that state

An entity can have any number of aspects at the same time.

### 3.5 Relation

A **relation** connects two entities. A relation has its own **type** with a name (e.g. „collaborates with") and usually an **inverse name** (e.g. „collaborates with" for symmetric, or „is supervisor of / is subordinate of" for asymmetric).

A relation has a **scope** (validity range):

- **universal** — works between entities of any types
- **from / to / specific** — restricts which entity types the relation may connect

Relations are unidirectional in data, but DKM displays both sides: in an entity you see its **Relations** (outgoing) and **Referenced by** (incoming), so it appears as a bidirectional connection.

### 3.6 Custom attribute

Sometimes you need to record something on a **single specific entity** that doesn't belong to its type or aspect. A custom attribute is an ad hoc attribute that applies only to that entity. It has the same data types as a standard attribute but isn't shared with anything else.

Example: type „Person" has no attribute „Favorite coffee". John, however, loves espresso. You add him a custom attribute „Coffee: espresso" just for John.

---

## 4. User interface tour

DKM has three main views: **List** (default), **Entity detail**, **Entity editor**. Plus **Settings**.

### 4.1 Header

Always at the top. Contains:

- **Logo / project name** — clicking returns to the main list
- **Load** — opens a `.dkmdata` file as a new project
- **Save** — saves the current project (locally or to GitHub, see [Storage](#15-storage-local-and-github))
- **Export** — XLSX export of the current view (filtered entities)
- **Import TSV** — imports entities from a table (Excel TSV / CSV / clipboard paste)
- **Settings** — project, types, aspects, relations, lists, language
- **Unsaved changes indicator** (dot if the project is dirty)

### 4.2 Toolbar above the list

- **Tabs**: Inbox, All, individual entity types, individual aspects, Archive. Click to switch to the view showing only entities of that category. (What appears in tabs is controlled by **Settings → Types / Aspects → Show as tab**.)
- **Search** — full-text across name and text attributes
- **Filter** — type, aspect, last-update date
- **Sort** — by update date / name / created date
- **+ New entity** — creates an entity (opens a type picker dialog or the editor)
- **☑ Select** — turns on bulk action mode (see [Bulk operations](#11-bulk-operations))

### 4.3 Entity card

In the list each entity displays as a card with:

- **Type icon** + **entity name** in the heading (e.g. 👤 *John Smith*)
- **Badges** with the type name, optionally 📥 Inbox, 📦 Archive, and aspects (◎ *VIP*)
- **Snippet** — short excerpt from the first textarea attribute
- **Attribute values marked „Show in list"** — if any are enabled
- **Update date** and relation count

Clicking the card opens the detail.

### 4.4 Entity detail

- **Heading** — name with type icon, type badge, aspect badges
- **Actions**: Edit, Duplicate, Change type, Archive, Delete
- **Attributes** — all filled attributes (from type, aspects, custom)
- **Relations** — entities the relations lead to from this entity, grouped by relation type
- **Referenced by** — entities that have a relation pointing to this one
- **Structural view** — 🌳 hierarchical tree following relations (uncovers the network of dependencies)

### 4.5 Entity editor

- **Name** — required
- **Type** — changeable via Change type
- **Inbox** — checkbox „in Inbox"
- **Type attributes** — fields per data type (text input, textarea with preview, date, select, etc.)
- **Aspects** — section „Aspects" with checkboxes. Checking adds the aspect and immediately shows its attributes in the form.
- **Custom attributes** — section where you can add ad hoc attributes to this entity
- **Relations** — section with current relations, button + Add relation
- **Save / Cancel** in the footer (keyboard **U** also saves)

### 4.6 Settings

Left panel with sections:

- **Project** — name, description, GitHub path, static viewer, package import, project list
- **Types** — list of entity types, click to switch to type editor (attributes, icon, name)
- **Aspects** — analogous to types but for aspects
- **Relations** — relation types, their names, scope, allowed types
- **Lists** — select lists with value enumerations
- **Language** — Czech / English

---

## 5. Working with entities

### 5.1 Creating an entity

Three ways:

**A) Button + New entity** in the tab of a given type creates an entity directly of that type. The editor opens.

**B) Button + New entity** in the All tab or in an aspect opens a chooser dialog — pick a type, or „📥 Add to Inbox" (entity without a type, you'll classify it later).

**C) Quick-add** in the Inbox tab: enter name and short description, the Enter key creates an entity in the Inbox.

### 5.2 Editing

Click the entity in the list, then **Edit**. Keyboard shortcut **E** in the detail opens the editor.

Changes are saved only when you click **Save** (shortcut **U**). If you leave the editor (Esc or Cancel), changes are discarded.

### 5.3 Duplicating

In the detail **Duplicate** creates a copy of the entity (including type, attributes, custom attributes, relations, and aspects). The name gets the „(copy)" suffix and the editor opens for fine-tuning.

### 5.4 Change type

In the detail **Change type** shows the type picker. If you change the type, attributes with the same name and a compatible data type in the new type keep their values. Other attributes lose their values.

### 5.5 Archive

**Archive** moves the entity to the Archive tab. It disappears from normal lists, but data, relations, and aspects are preserved. You can restore it from the Archive.

### 5.6 Deletion

**Delete** requires confirmation and is irreversible (except via backups). After deletion, relations from other entities pointing to the deleted one are automatically removed.

---

## 6. Entity types

### 6.1 Defining a type

In **Settings → Types → + Add entity type**. The type editor opens:

- **Icon** — emoji or short string displayed as a prefix in cards (e.g. 👤, 📄, 🛡)
- **Name** — human-readable (e.g. „Person", „Contract", „Asset")
- **Attributes** — the list that determines entity structure. Order can be changed with the arrow buttons.

### 6.2 Attributes within a type

For each attribute:

- **Name** — what the attribute is called (e.g. „Email", „Date of birth")
- **Type** — data type (see [3.3](#33-attribute))
- **Required** — checkbox, enforces a value when saving the entity
- **Show in list** — checkbox, value appears in cards
- For **select**, the connected **List** (defined in Settings → Lists) is set
- For **relation**, the **Target type** (constraint) and **multi** (multiple targets) is set

### 6.3 Tab for the type

In Settings → Types each type has **„Show as tab"** — if you check it, a separate tab appears in the main toolbar for entities of this type.

### 6.4 Deleting a type

Deleting a type doesn't delete entities — they just lose their type (they remain as entities without a type, in the Inbox, visible in the All tab). Relations and aspects are preserved. Type deletion is confirmed by a dialog.

---

## 7. Attributes

### 7.1 Data types

| Type | Use | Input |
|---|---|---|
| text | short string | single-line field |
| textarea | long text, description | multi-line, supports Markdown and CriticMarkup |
| date | date | datepicker |
| url | link | URL, rendered as clickable |
| select | pick from a list | dropdown |
| yesno | yes/no | checkbox |
| number | number | numeric input |
| relation | pointer to entity | entity picker, optionally constrained by type |

### 7.2 „Required" attribute

When saving an entity DKM checks required attributes. If any are empty, focus jumps to the first empty one and saving fails.

### 7.3 „Show in list" attribute

Practical for key properties you need to see without opening the detail. The card shows them as `Name: Value`. Works for all data types including Markdown (rendered), URL (clickable), relation (link to target entity).

### 7.4 Custom attributes

An ad hoc attribute added to a single entity only, in the editor's Custom attributes section. It has a name, data type, and value. Useful when you don't want to change the whole type for one exception.

---

## 8. Aspects

### 8.1 Defining an aspect

In **Settings → Aspects → + Add aspect**. You define:

- **Name** — e.g. „VIP", „Approved", „Under audit"
- **Attributes** — list of attributes that get added to an entity as soon as it gets this aspect

### 8.2 Assigning an aspect

In the entity editor there's an **Aspects** section with checkboxes. Checking adds the aspect — aspect attributes appear immediately in the form below the type attributes. Unchecking removes the aspect (DKM confirms whether you want to, and clears the aspect attribute values).

### 8.3 Aspect as a filter

Just like with types, in Settings → Aspects each aspect has „Show as tab". If you check it, a tab appears in the toolbar and you see all entities with that aspect.

### 8.4 Aspect vs. type attribute — when which

- **Type** = what the entity **is** (Person, Contract). Strict template.
- **Aspect** = what **state** or **additional property** the entity has (VIP, approved, under audit). Optional and combinable.

An aspect holds data about a state (who, when, how). When the state changes, you simply remove the aspect and the aspect attributes disappear.

---

## 9. Relations

### 9.1 Defining a relation type

In **Settings → Relations → + Add relation type**:

- **Name** — how the relation reads in the creation direction (e.g. „is supervisor of")
- **Inverse name** — how it reads backwards (e.g. „is subordinate of"); for a symmetric relation, set them to the same
- **Scope**:
  - **universal** — between any types
  - **from** — restricts only the source type
  - **to** — restricts only the target type
  - **specific** — restricts both (e.g. Contract → Person)
- **From types / To types** — lists of types (depend on scope)

### 9.2 Adding a relation to an entity

In the detail or editor of an entity, the **↔ Add relation** button (shortcut **R** in detail):

1. Pick a relation type from the dropdown
2. Pick the target entity (with type and text filter)
3. Click **+ Add / ✓ Select** adds the relation

In the editor, existing relations are shown in the Relations section. The × button removes them.

### 9.3 Relations in detail

In the detail, relations are grouped by type:

- **Relations**: list of where relations lead **from** this entity
- **Referenced by**: relations that lead **to** this entity from others (backlinks)

Click a relation to open the target entity's detail.

### 9.4 Structural view

In the detail **🌳 Structural view** expands a hierarchical tree: this entity, its relations, relations of those, etc. — up to depth 3 or until the tree ends. Cyclic dependencies are detected and labeled.

### 9.5 Attribute of type „relation"

Alternative to standalone relations: an attribute of data type „relation" holds a pointer (or list of pointers) to other entities directly in the entity's data, not as a standalone relation. Useful for key structural relationships (for example „Contract has a client — always one person"). A standalone relation is more universal (many relations, various types), an attribute of type relation is stricter (exact count, always the same position).

---

## 10. Search, filters, sorting

### 10.1 Full-text search

In the toolbar, the **Search** field. Searches in:

- Entity name
- Text attributes (text, textarea, url, select)
- Custom attributes

Search is case-insensitive, substring-based. Key **F** or **/** focuses the search.

### 10.2 Filters

- **Type filter** — only entities of the given type (if you're not in a type tab)
- **Aspect filter** — only entities with the given aspect (if you're not in an aspect tab)
- **Date filter** — when last updated (today, week, month, year)

### 10.3 Sorting

- **Last updated** (default, descending)
- **Name** (ascending)
- **Created** (descending)

---

## 11. Bulk operations

### 11.1 Activating the mode

In the list view toolbar, the **☑ Select** button (key **V**). After activation:

- A checkbox appears on the left of each entity card
- Clicking the card toggles the checkbox (doesn't navigate to detail)
- Selected cards have a colored highlight
- The toolbar expands with a **bulk action panel**

To turn off selection: the **☐ Cancel selection** button, key **V**, key **Esc**.

### 11.2 Action panel

Contains:

- **Selected count**
- **Select all visible** — selects all entities matching the current filter
- **Deselect all**
- **Action** — dropdown with the list
- **Run** — executes the selected action

### 11.3 Available actions

1. **⇄ Change type** — changes the type of selected entities. Attributes with the same name and a compatible data type in the new type keep their values.
2. **+ Add aspect** — picks an aspect from the dropdown (with a „missing in N entities" counter) and adds it where missing.
3. **− Remove aspect** — removes an aspect from entities that have it. Also clears aspect attribute values.
4. **✎ Set attribute** — the dropdown unions attributes across selected (from types and aspects, labeled „TypeName / AttrName (N×)"). After picking an attribute you enter the new value. Applies only to entities that have the attribute.
5. **⌫ Clear attribute** — same but without a value (clears).
6. **↔ Add relation** — relation type + target entity. Adds a relation from each selected entity to the target. Skips self, duplicates, and entities to which the relation doesn't fit by scope.
7. **📦 Export selection to package** — see [Transferring parts between projects](#18-transferring-parts-between-projects-packages).
8. **📥 Move to Inbox** — `inInbox=true`
9. **📤 Remove from Inbox** — `inInbox=false`
10. **📦 Archive** — with a confirmation dialog
11. **♻ Restore from archive** — visible only in the Archive tab
12. **🗑 Delete** — with strong confirmation, irreversible

### 11.4 Behavior after an action

After completion the selection is **cleared**, but selection mode **stays active**. You can immediately select a different set and run another action. Or, if you keep the same selection, the chain „add aspect" then „set attribute of the aspect" works fluidly (you redo the selection after each action).

---

## 12. Inbox and Archive

### 12.1 Inbox

The **📥 Inbox** tab holds entities without a type, or entities you've put there manually (e.g. „quick note, I'll sort it later"). The Inbox is a buffer for unclassified items.

**Quick-add** in the Inbox: enter name + short description, **Enter** creates an entity in the Inbox.

In the detail of an Inbox entity you see the **Convert to type** button — pick a type and the entity gets assigned, leaves the Inbox.

### 12.2 Archive

The **📦 Archive** tab holds entities you no longer actively need but want to preserve. Archived entities:

- Are not in lists (All, by type, by aspect, search)
- Are not in entity selectors when creating relations
- Stay in data and relations (entity A in archive, but a relation from B points to it — the relation in B stays)
- Can be restored with a single click

The Archive serves more as „inactive" than as a trash bin. For permanent deletion use Delete.

---

## 13. Markdown and CriticMarkup

In attributes of data type **textarea** you can use Markdown and CriticMarkup. In the detail the text is rendered, in the editor it's source.

### 13.1 Markdown — what works

| Syntax | Result |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | `code` |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `[link](https://...)` | [link](https://...) |
| `# Heading` | Large heading |
| `## Subheading` | Smaller heading |
| `- item` | bullet list |
| `1. number` | numbered list |
| `> quote` | quote |
| ` ``` block ``` ` | code block |

### 13.2 CriticMarkup

For marking editorial changes in text:

| Syntax | Meaning |
|---|---|
| `{++added++}` | new text (rendered green, underlined) |
| `{--deleted--}` | deleted text (rendered red, strikethrough) |
| `{~~original~>new~~}` | replacement (original strikethrough, new bold) |
| `{==highlight==}` | yellow highlight |
| `{>>comment<<}` | margin comment |

CriticMarkup renders as proper HTML (`<ins>`, `<del>`, `<mark>`) and exports (XLSX) preserve it as readable text.

---

## 14. Multiple projects

DKM supports any number of projects side by side in one browser.

### 14.1 Project list

In **Settings → Project → All projects** you see the list of all projects stored locally. Each project has buttons:

- **Switch** — opens the project in this tab (replaces the current one)
- **In new tab** — opens the project in a new browser tab (parallel work)
- **×** — deletes the project (with confirmation)

### 14.2 New project

The **+ New project** button creates an empty project and opens it.

### 14.3 URL parameter `?p={id}`

Each project has its id (e.g. `p_abc123`). When you add `?p=p_abc123` to the URL, that specific project opens. This allows multiple projects in different browser tabs simultaneously, each with its own data.

---

## 15. Storage: local and GitHub

### 15.1 Local (browser localStorage)

DKM stores data in browser localStorage under the keys:

- `dkm-projects-v1` — list of projects with metadata
- `dkm-pdata-{id}` — data of a specific project
- `dkm-active-project` — id of the currently open one

**Autosave** is on by default (Settings → Language → Autosave). On change the project saves locally after a short delay.

Manually **Save** (key **S**) saves immediately.

### 15.2 GitHub

DKM can save a project to a GitHub repository as a `.dkmdata` file. Configuration:

1. In GitHub generate a **Personal Access Token** with `repo` scope (Fine-grained or Classic). Keep the token secure.
2. In DKM in the header you'll see a lock icon — click and paste the token. The token is stored per-device in localStorage (`dkm-gh-token`). It is **not** part of project data.
3. In Settings → Project fill in **GitHub path** in the format `username/repository/path/file.dkmdata`. Example: `egdilna/data/dkm/my-project.dkmdata`.
4. Click **Save** (S). DKM reads the current file content from GitHub (for SHA), writes the new content, and commits.

**Loading from GitHub** happens automatically: if the project has a GitHub path, on open DKM downloads the latest version and compares with local.

### 15.3 Conflicts

If you save locally something that has changed on GitHub in the meantime, DKM notifies you and offers options (keep local, take from GitHub, or open a diff). Conflicts are rare in practice but happen when working from multiple devices.

### 15.4 No server, no telemetry

DKM **sends data nowhere** except GitHub (where you yourself send it with the token). No telemetry, no cloud, no accounts.

---

## 16. Import and export

### 16.1 Load `.dkmdata`

The **Load** button in the header (key **L**) opens a file dialog. A `.dkmdata` file is a project JSON — DKM opens it as a new project next to existing ones.

### 16.2 Save `.dkmdata` manually

Aside from automatic saving, a project can be **exported** as a `.dkmdata` file for backup or transfer. In Settings → Project → **Download project backup**. The file contains everything: data, types, aspects, relations, lists, settings.

### 16.3 XLSX export

The **Export** button in the header. Generates an XLSX (Excel) table of the current filtered entities. Columns:

- ID, Name, Type, Inbox, Archive, Aspects
- Type attributes (`TypeName / AttrName`)
- Aspect attributes (`AspectName / AttrName`)
- Custom attributes (`* name`)
- Relations (as string `type → target; type → target`)
- Created, Updated

Markdown/textarea values have Excel's wrap text enabled. Dates are real dates (not text). Numbers are numbers. The first row is bold with autofilter and freeze.

DKM lazy-loads the SheetJS library from a CDN on first click.

### 16.4 TSV import

The **Import TSV** button in the header. Dialog with two tabs:

- **File** — pick `.tsv`, `.txt`, `.csv`
- **Paste from clipboard** — paste a table from Excel / Google Sheets

DKM detects the delimiter (TAB, semicolon, comma). The first row is the header. Column mapping:

- **Name** (also „Title", „Jméno") — required column
- **Type** — maps the entity type by name
- **Aspects** — semicolon-separated aspect names
- **Inbox**, **Archive** — 1/0/yes/no/x
- Other columns are matched to attributes by name. Format `Type / Attribute` refines mapping for cases where the same attribute name exists in multiple types.

Unknown columns are ignored. Entities with the same name and type are updated (not duplicated). After import you see a toast „Import: added X, updated Y, skipped Z".

---

## 17. Static viewer

In **Settings → Project → Static viewer** there's the **⬇ Download HTML viewer** button. Generates a standalone HTML file with data embedded inside. The file:

- Works offline and without a server
- Opens in any browser
- **Read-only** — no editing, only browsing
- Has everything: tabs, search, filters, detail, attributes, aspects, relations, backlinks, Markdown
- Can be shared (email, upload to server, on a USB drive)
- Size = project JSON size + ~35 KB UI code

Use case: you deliver someone the result of your work so they can look through it without installing DKM, without GitHub access, without anything — they just open the HTML.

---

## 18. Transferring parts between projects (packages)

When you have multiple projects and want to transfer parts between them (types, entities, relations), use **`.dkmpkg` packages**.

### 18.1 Export to a package

In bulk operations the action **📦 Export selection to package**:

- **What to include** option: only selected / + 1st-level neighbors / + entire connected component
- Optional **package description**
- The downloaded `.dkmpkg` contains the used part of the model (types, aspects, relation types, lists) + entities themselves

### 18.2 Importing a package

In **Settings → Project → Import package (.dkmpkg)**. The wizard has 8 steps:

1. **Summary** — what the package contains, choice of **Easy** mode (automatic mapping) or **Detailed** (step by step)
2. **Type mapping** (Detailed) — for each type from the package: Create new / Use existing / Skip. With existing, attribute mapping expands.
3. **Aspect mapping** (Detailed) — same.
4. **Relation mapping** (Detailed) — same.
5. **List mapping** (Detailed) — Create new / Merge with existing / Skip.
6. **Entity ID conflicts** (Detailed) — for entities with the same ID: Import as new / Overwrite / Skip.
7. **Preview** — what will be added / overwritten / dropped, possible warnings.
8. **Done** — resulting log.

Before import there's an option to download a **backup of the target project** (`.dkmdata` with date in the name). Recommended to keep on.

### 18.3 Safety

- Custom entity attributes transfer 1:1 (they're per-entity)
- An attribute that can't be matched in the target type imports as a new attribute
- Relations within the package are kept, relations going out are dropped with a counter
- Values of attributes of type „relation" are remapped to new entity IDs
- Datatype compatibility: text ⇔ textarea ⇔ url, other types only with themselves

---

## 19. Settings

### 19.1 Project

- Project **name** and **description**
- **GitHub path** (per-project)
- **All projects** — list, switching, new project, deletion
- **Static viewer** — generating offline HTML
- **Transfer between projects** — package import
- **Download project backup** — XLSX, .dkmdata

### 19.2 Types

- List of types
- Type editor: icon, name, attributes
- For each type: show as tab

### 19.3 Aspects

Same as types but without an icon.

### 19.4 Relations

Relation types: name, inverse name, scope, type restrictions.

### 19.5 Lists

Select lists: name + value enumeration. Used in attributes of type select.

### 19.6 Language and general

- **Language** — Czech / English, switches UI immediately
- **Autosave** — on / off
- **Debug output** — turns on a diagnostic panel on the page (no browser console — everything outputs into DKM)

---

## 20. Keyboard shortcuts

Outside input fields and dialogs:

| Key | Action |
|---|---|
| **S** | Save (smart routing — local or GitHub) |
| **L** | Load file |
| **I** | Inbox tab |
| **Q** | Quick add in Inbox |
| **N** | New entity |
| **A** | All tab |
| **E** | Edit (in detail) |
| **R** | Add relation (in detail) |
| **U** | Save changes (in editor) |
| **V** | Toggle bulk select |
| **F** or **/** | Focus search |
| **Esc** | Back / close dialog / cancel selection |
| **Alt+L** | (alias for L on macOS / various keyboards) |
| **Alt+S** | (alias for S) |
| **Alt+U** | (alias for U) |
| **Alt+R** | (alias for R) |

In dialogs:

- **Enter** — primary action
- **Esc** — close

---

## 21. Accessibility

DKM is designed to work with screen readers (VoiceOver, NVDA, JAWS):

- All buttons have `aria-label`
- Entity cards use `role="listitem"` in `role="list"`
- The entity detail has structured sections with headings
- No `position: sticky` or `fixed` that confuse screen readers
- `aria-live` only for short action confirmations, never for long re-rendered areas
- Tab sequences respect DOM order
- States `aria-current`, `aria-selected`, `aria-pressed` are set
- Visual states (focus, hover, selected) always have a text or aria counterpart

Keyboard shortcuts enable full operation without a mouse.

---

## 22. Tips and tricks

### 22.1 Start simple

When you're unsure of the structure, start with one type and one aspect. You can add new types / aspects / relations at any time later. Better minimal structure that you actually use than perfect unused one.

### 22.2 Aspect instead of another type

When you're thinking „this is type Person but should behave a bit differently" — add an aspect to Person instead of creating a new type. Aspects combine, types don't.

### 22.3 „Show in list" for key attributes

For a type, mark a couple of key attributes with `showInList`. While scrolling the list you see the essence without opening the detail.

### 22.4 GitHub as backup + sync

Even if you work from one device, GitHub functions as an automatic backup. On localStorage loss simply load the file from GitHub.

### 22.5 Structural view for complex relationships

🌳 in the detail uncovers the hierarchy. Useful for the audit „who all depends on this entity" or „what does this entity control".

### 22.6 Static viewer for sharing

When you need to show the result to someone who doesn't have DKM installed, generate a static HTML. Works on a USB stick, on the web, in an email.

### 22.7 TSV import for bulk data ingest

An existing Excel table of people, contracts, anything with types in one column and attributes in others — Import TSV gets it into DKM in seconds.

### 22.8 Bulk actions after import

After a TSV import you typically want to add an aspect „Imported 2026-06" to all imported entities or set some attribute. ☑ Select → Select all visible → Action.

### 22.9 Pattern search

Search looks for substrings. If you want to find all entities with an attribute starting with „DOKUM_", type „DOKUM_" in the search box — it finds everything in names and text attributes.

### 22.10 Custom attribute as a note

When an attribute is needed for one entity only (specific note, exceptional status), add a custom attribute instead of changing the type.

---

## 23. Frequent issues

### 23.1 „File is not a valid DKM JSON"

The file must be JSON with an `entities` field as an array. If you're loading a `.dkmpkg` through Load, use Settings → Project → Import package instead. If the file is actually DKM data and this error appears, check the debug panel (Settings → Debug output), the reason is there.

### 23.2 Changes don't save

Check that autosave is on (Settings). If you use GitHub, make sure you have the token entered (lock icon in header) and a valid path. Manually save with key S.

### 23.3 GitHub returns 401 / 403

- 401: token missing or invalid — check the token in the lock icon
- 403: token doesn't have rights to the repository — generate a new token with `repo` scope

### 23.4 After package import entities don't have attributes

In Easy mode attributes map automatically by name and data type. If names don't match, use Detailed mode and map attributes manually.

### 23.5 I tick an aspect but I don't see the attributes

Aspect attributes appear **in the editor** (after checking the box in the Aspects section). In the detail you see only those aspect attributes that have values filled. To see empty ones, open Edit.

### 23.6 Slow scrolling in lists with thousands of entities

DKM renders all entities at once (no virtual scrolling). For projects with more than 5,000 entities:

- Hide tabs for types you don't use daily (Settings → Types → Show as tab)
- Use filter or search to narrow the list
- For a type with many entities, consider splitting into multiple projects

### 23.7 localStorage is full

Browsers have a limit (typically 5–10 MB per origin). When DKM reports it can't save:

- Delete unused projects
- Move large project to GitHub (path in Settings → Project) — only working copy stays local

### 23.8 After deleting a type, relations disappeared

Deleting a relation type yes — removes all relations of this type from entities. Deleting an entity type no (entities stay without a type).

---

## 24. Technical background

DKM is **a single HTML file** with vanilla JavaScript. No build tools, no dependencies (except SheetJS, lazy-loaded from a CDN for XLSX export).

- **Size**: ~300 KB HTML + JS + CSS + i18n
- **Browsers**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+
- **Mobile**: works on mobile but the UI is primarily designed for desktop
- **Data format**: JSON with entities, types, aspects, relations, lists

Source code: <https://github.com/egdilna/nastroje> in the `dkm` folder.

The application was created within EGdílna, a project for public administration tools. No telemetry, no server, no accounts.

---

*Questions, suggestions, bugs? GitHub issues in the repository above.*
