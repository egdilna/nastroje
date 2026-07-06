# DKM — Dynamic Knowledge Manager

User guide

- **Online tool:** <https://nastroje.egdilna.cz/dkm>
- **EGdílna tools directory:** <https://nastroje.egdilna.cz/#dkm>
- **Source code:** <https://github.com/egdilna/nastroje> (folder `dkm`)

---

## Contents

1. [What DKM is and what it's for](#1-what-dkm-is-and-what-its-for)
2. [Getting started in five minutes](#2-getting-started-in-five-minutes)
3. [Key concepts](#3-key-concepts)
4. [Interface orientation](#4-interface-orientation)
5. [Working with entities](#5-working-with-entities)
6. [Entity types](#6-entity-types)
7. [Attributes](#7-attributes)
8. [Aspects](#8-aspects)
9. [Relations and backlinks](#9-relations-and-backlinks)
10. [Search and basic filters](#10-search-and-basic-filters)
11. [Advanced filters and saved views](#11-advanced-filters-and-saved-views)
12. [Display modes: list, Kanban, timeline](#12-display-modes-list-kanban-timeline)
13. [Bulk operations](#13-bulk-operations)
14. [Inbox and archive](#14-inbox-and-archive)
15. [Markdown, CriticMarkup, wiki-links](#15-markdown-criticmarkup-wiki-links)
16. [Comments](#16-comments)
17. [Objects](#17-objects)
18. [Panels](#18-panels)
19. [Command palette (Ctrl+P)](#19-command-palette-ctrlp)
20. [Standalone windows](#20-standalone-windows)
21. [Data storage](#21-data-storage)
22. [Diff since last save](#22-diff-since-last-save)
23. [Export and print entity](#23-export-and-print-entity)
24. [Export to XLSX, TSV, PlantUML](#24-export-to-xlsx-tsv-plantuml)
25. [Static viewer](#25-static-viewer)
26. [Moving parts between projects (packages)](#26-moving-parts-between-projects-packages)
27. [Settings](#27-settings)
28. [Keyboard shortcuts](#28-keyboard-shortcuts)
29. [Accessibility](#29-accessibility)
30. [Tips and tricks](#30-tips-and-tricks)
31. [Common problems](#31-common-problems)
32. [Technical background](#32-technical-background)

---

## 1. What DKM is and what it's for

**DKM (Dynamic Knowledge Manager)** is a tool for managing structured knowledge — things, people, documents, requirements, contracts, anything that can be described by attributes and connected by relations. Instead of filling forms in a rigid database, you define **entity types** and **relations** that make sense to you, and gradually add content.

DKM works well for:

- **Personal information manager** — contacts, projects, tasks, books, films, personal knowledge graph
- **Software system data model** — entities, their attributes, relations between tables, audit
- **Legislative norms and requirements** — paragraphs, obligations, dependencies, supporting documentation
- **Lightweight CRM** — clients, projects, contracts, people on the other side
- **Library catalog, card file** — anything traditionally stored in card boxes
- **Wiki with typed pages** — when plain Markdown isn't enough

The tool is **a single HTML file** running in the browser. No server, no installation, no account. Data is yours and lives in the browser or in a GitHub repository under your control.

---

## 2. Getting started in five minutes

1. Open the tool at <https://nastroje.egdilna.cz/dkm> or download `dkm.html` from GitHub and open locally.
2. On first open, DKM greets you with an empty project. Click **Settings** in the header.
3. In **Project** enter a name and description.
4. In **Types** create at least one entity type (e.g. "Person"). Add an attribute, e.g. "Email" (text).
5. Back in the main view, click **+ New entity** and fill in something concrete.
6. **Save** the project — DKM downloads a `.dkmdata` file. Store it somewhere findable.
7. Next time you open DKM, click **Load** and pick your file. The project will be where you left it.

DKM lives only in the current browser tab. Refresh (F5) survives, closing the tab does not — save regularly to file or to GitHub.

---

## 3. Key concepts

DKM rests on a few concepts. Let's go through them with concrete examples.

### 3.1 Entity

An **entity** is one specific thing you're keeping track of — *Paul Newman*, *Contract 2026/001*, *iPhone 14 Pro*, *Meeting with director on June 4, 2026*. Each entity has a **name** and usually a **type**.

### 3.2 Entity type

A **type** defines the structure of an entity — what attributes it has. A type has a **name** (e.g. "Person", "Contract", "Device") and optionally an **icon** (emoji that helps distinguish types at a glance).

Key point: type doesn't dictate content, just a template of attributes. Entities of the same type don't have to fill in all attributes.

### 3.3 Attribute

An **attribute** is a property of an entity. Defined at type level (and aspect level, see below) — all entities of the same type share the same attributes.

Attribute data types:

- **text** — short string, one line
- **textarea** — multiline text with Markdown, CriticMarkup and wiki-link support
- **date** — date
- **url** — link (rendered clickable)
- **select** — pick from a predefined list of values
- **yesno** — yes/no
- **number** — number
- **relation** — link to another entity (optionally restricted to a specific type, single or multi-value)

For each attribute you can set:

- **Required** — DKM won't save an entity without a value
- **Show in list** — value appears directly in the entity card in lists

### 3.4 Aspect

An **aspect** is like a tag with an extension. An aspect adds **more attributes** to an entity, **independently of its type**.

Example: you have types "Person", "Contract", "Device". You define an aspect "Approval" with two attributes: *Approved by* (relation to Person) and *When* (date). The "Approval" aspect can be attached to any entity — person, contract, device — and each will gain those two extra attributes.

Aspects are also used as:

- **Filter** in lists (a tab "Aspect: Approval" shows all entities with that aspect)
- **Semantic tag** (entity "is VIP", "is archived logic", "passed audit")
- **State modifier** with attributes describing that state

An entity can carry any number of aspects simultaneously.

### 3.5 Relation

A **relation** connects two entities. A relation has its own **type** with a name (e.g. "collaborates with") and usually an **inverse name** (e.g. "collaborates with" for symmetric, or "supervises / reports to" for asymmetric).

A relation has a **scope**:

- **universal** — works between entities of any types
- **from / to / specific** — restricts between which types the relation can form

Relations are one-way in data, but DKM shows both sides: at an entity you see its **relations** (where they go) and **linked from** (who points to it). "Linked from" also counts attributes of type relation and wiki-links in textareas — a link is formed even without formally creating a relation (see chapter 9).

### 3.6 Custom attribute

Sometimes you need to note something on **one specific entity** that doesn't belong to type or aspect. A custom attribute is an ad hoc attribute valid only for that entity. Same data types as a standard attribute, but not shared with anything else.

Example: type "Person" doesn't have "Favorite coffee" attribute. But Paul loves espresso. Add him a custom attribute "Coffee: espresso" just for him.

### 3.7 Comments

Any number of comments can be attached to each entity. Each comment has an author (from user settings), date and Markdown content. Details in chapter 16.

### 3.8 Objects

An object is a **named text storage** attached to an entity — e.g. `data.json`, `outline.mroutline`. It's never rendered as entity content, but has buttons for clipboard copy, save-as-file and load-new-version. Objects are never exported to print / DOCX / PDF. Details in chapter 17.

---

## 4. Interface orientation

DKM has main views: **List** (default), **Entity detail**, **Entity editor**, **Settings**, **All comments**.

### 4.1 Header

Always on top. Contains:

- **Logo / project name**
- **Load** (Alt+L) — opens a `.dkmdata` file as the current project
- **Save** (Ctrl+S) — saves the current project (to disk or GitHub, per configuration)
- **📋⬇ Load from clipboard** (Ctrl+Shift+O) — replaces the project with data from clipboard (with confirmation)
- **📋⬆ Copy to clipboard** (Ctrl+Shift+S) — copies the whole project as JSON to clipboard
- **Export** — XLSX export of currently filtered entities
- **Import TSV** — loads entities from TSV / CSV / pasted clipboard
- **Settings** — project, types, aspects, relations, lists, views, general
- **● Unsaved changes** — clicking opens diff against last save

### 4.2 Toolbar above the list

- **Tabs**: Inbox, All, individual entity types, individual aspects, pinned saved views, Archive.
- **Search** — fulltext across name and text attributes
- **Filter** — type, aspect, update date
- **Sort** — by update date / name / creation date
- **⚙ Advanced filters (N)** — panel to filter by any attribute (see chapter 11)
- **📋 / 📊 / 📅** — display mode switcher: list / Kanban / timeline (see chapter 12)
- **+ New entity**
- **☑ Select** — enable bulk actions

### 4.3 Entity card in list

- **Type icon** + **entity name** (e.g. 👤 *Paul Newman*)
- **Badge** with type name, 📥 Inbox, 📦 Archive, and aspects (◎ *VIP*)
- **Snippet** — brief excerpt from the first textarea attribute
- **Values of "Show in list" attributes** — if any are enabled
- **Update date** and relation count

Clicking a card opens the detail.

### 4.4 Entity detail

- **← Back** (Alt+B) — returns to previously shown page. Never returns into editing — skips edit states.
- **▾ Navigation history** — dropdown next to Back with recently visited entities and views in this session. For entities you see type icon, name and type.
- **Heading** — type icon + entity name + type badge, aspect badges, status badges
- **Actions**: Edit (E), Duplicate, Change type, 🖨 Export / print, 🪟 Standalone window, Archive, Delete
- **Attributes** — filled attributes (type, aspects, custom)
- **Relations** — entities relations point to, grouped by relation type
- **Linked from** — entities that reference this one (classic relations, attribute-relations, wiki-links). Groups have different labels:
  - `relation name ←` (classic relations)
  - `Type / AttrName ←` (attribute-of-type-relation references)
  - `◎ Aspect / AttrName ←` (aspect attribute references)
  - `[[AttrName]] (Context) ←` (wiki-links)
- **Objects** — section with entity's objects (see chapter 17)
- **Comments** — section with comments and new-comment form (see chapter 16)
- **Structural view** — 🌳 hierarchical tree by relations
- **Metadata** — ID, created, updated

### 4.5 Entity editor

- **Name** — required
- **Type** — changeable via Change type
- **Inbox** — checkbox "in Inbox"
- **Type attributes** — fields per data type
- **Aspects** — section with checkboxes. Checking adds an aspect and immediately shows its attributes.
- **Custom attributes** — section with + Add custom attribute and + Add object
- **Relations** — current relations, + Add relation
- **Save / Cancel** at the bottom (U key also saves)

### 4.6 Settings

Left panel with sections:

- **Project** — name, description, GitHub path, static viewer, package transfer, project storage
- **Types** — list of entity types, attributes, icons
- **Aspects** — analogous to types
- **Relations** — relation types, names, scope, allowed types
- **Lists** — select lists with value enumerations
- **Saved views** — management of saved filters
- **Tabs** — which types and aspects show in the toolbar
- **GitHub** — token, synchronization
- **General** — language, user name for comments, autosave, debug
- **Statistics** — counts of entities, attributes, relations
- **Help** — documentation links

### 4.7 Panels

Above main content appears a **panel bar** when you have multiple panels open. Each panel is an independent working context with its own view, filters, opened entity. Details in chapter 18.

---

## 5. Working with entities

### 5.1 Creating an entity

Several ways:

- **+ New entity** in the header or toolbar
- **Quick add** from Inbox view — the "New entity" field at the top of Inbox, type text and press Enter → creates an entity without type in Inbox
- **Duplicate** in detail — creates a copy of current entity (name suffixed with "(copy)")
- Via **Command palette (Ctrl+P)** → action "New entity"

Entities created via quick add are in Inbox without a type. In Detail click **Change type** to assign.

### 5.2 Editing an entity

Click **Edit** (or E key). The form shows:

- Basic fields (Name, Type, In Inbox)
- Type attributes
- Aspects (checkboxes — checking immediately adds a section of attributes)
- Custom attributes
- Objects
- Relations

Save via Save button or U key.

### 5.3 Duplicating

In Detail, **⎘ Duplicate** button. Creates a copy with all attributes, aspects and custom attributes. Relations are not copied (create them manually). Comments and objects are not copied either.

### 5.4 Changing type

When you create an entity in Inbox without a type, assign it later via **Change type** in detail. DKM preserves all attribute values with matching IDs. The rest you fill in manually.

### 5.5 Archive and delete

- **Archive** — entity disappears from all lists (except Archive tab), but stays in data. Relations to it still work.
- **Restore** — brings entity back from archive.
- **Delete** — permanently removes the entity and its relations.

### 5.6 Navigation history

In detail / in settings there is a **← Back** button (Alt+B) and next to it a **▾** dropdown with recently visited entities / views. History is session-only — disappears when tab closes. Back never returns into editing (skips it).

---

## 6. Entity types

Defined in **Settings → Types**. Each type has:

- **Name** (e.g. "Person")
- **Icon** — emoji shown at entities of this type
- **Set of attributes** — any count, each with its own data type

### 6.1 Creating a type

Click **+ New type**. Enter name, optionally an icon. Type editor opens.

### 6.2 Type editor

- Rename / change icon
- Add / remove attributes, rename, move (up / down)
- **Required** toggle per attribute
- **Show in list** toggle (value shows in entity card)

### 6.3 Deleting a type

You can delete a type only when no entity uses it. Otherwise DKM warns you.

### 6.4 Show type as a tab

In **Settings → Tabs** you check which types should appear in the main toolbar as tabs (e.g. only the most frequent). Others are accessible via advanced filtering or command palette.

---

## 7. Attributes

### 7.1 Standard attribute (at type level)

Added in type editor. Enter:

- **Name** (e.g. "Email")
- **Data type** (see 3.3)
- **Required** (checkbox)
- **Show in list** (checkbox)
- Optionally: **Value list** (for select), **Target type** (for relation)

### 7.2 Aspect attribute

Defined in aspect editor. Same rules. An aspect can bring attributes of any type (including relation).

### 7.3 Custom attribute

In entity editor click **+ Add custom attribute**. Enter name, pick data type, fill value. Custom attribute is per-entity only.

### 7.4 Attribute of type relation

Special attribute type — value is target entity's ID. You can configure:

- **Target type** — only entities of this type are offered
- **Multi-value** — array of IDs instead of one

This attribute is **automatically counted in "Linked from"** at the target entity, even without a formal relation.

---

## 8. Aspects

An aspect is like a type, but for supplementary sets of attributes. Defined in **Settings → Aspects**.

Differences from type:

- Aspect has no icon (just ◎ as common symbol)
- An entity can carry multiple aspects at once (only one type)
- An aspect can be added / removed at any time — attributes remain in the data even after removing the aspect, but aren't shown

### 8.1 When to use aspect vs. type

- **Type** = base classification, what kind of thing it is (Person, Contract)
- **Aspect** = supplementary property that comes and goes independently (VIP, In approval, Archive-candidate)

---

## 9. Relations and backlinks

### 9.1 Relation type definition

In **Settings → Relations** you create a relation type:

- **Name** (e.g. "collaborates with")
- **Inverse name** (e.g. "collaborates with" or "supervises / reports to")
- **Scope**: universal, from-to, specific
- **Allowed source / target types**

### 9.2 Creating a relation

In entity detail → **+ Add relation** → dialog:

- Relation type
- Target entity (autocomplete or picker)

The relation appears immediately in the Relations section.

### 9.3 Backlinks ("Linked from")

The **Linked from** section at an entity **automatically includes three kinds of links**:

1. **Classic relations** — other entities that have a relation pointing here (group labeled by inverse name)
2. **Attribute-of-type-relation** — other entities that have an attribute referencing here (group labeled `Type / AttrName ←` or `◎ Aspect / AttrName ←`)
3. **Wiki-links** — other entities whose textareas contain `[[This entity name]]` (group labeled `[[AttrName]] (Context) ←`)

Each group contains links to source entities with type icons.

This means you can **build a link network naturally** without formally creating relations — just use a relation-type attribute or write a wiki-link in text.

### 9.4 System filter by relations

In advanced filters (chapter 11) you can filter entities by:

- **Relation count / backlink count**
- **Has relation of type X**
- **Linked from entity X**

All this counts attribute-relations and wiki-links, consistently across the app.

---

## 10. Search and basic filters

### 10.1 Fulltext

The **Search** field in the toolbar searches through:

- Entity name
- Text and textarea attributes
- Custom attributes of type text and textarea

Returns entities containing the query string.

### 10.2 Type filter

Dropdown in toolbar — narrows list to one selected type.

### 10.3 Aspect filter

Dropdown — narrows list to entities carrying the aspect.

### 10.4 Update date filter

Dropdown with four choices: today, last 7 days, last 30 days, older than a month.

### 10.5 Sort

By update date (default), name, creation date.

For more complex filtering → chapter 11.

---

## 11. Advanced filters and saved views

### 11.1 Advanced filters panel

The **⚙ Advanced filters (N)** button in the toolbar (Ctrl+F). Opens a panel where you add rules. Each rule has:

- **Attribute** — dropdown with all attributes: system properties, type attributes, aspect attributes
- **Operator** — dropdown based on data type
- **Value** — input field matching the data type

Rules are combined with **AND** — all must be true.

### 11.2 System properties

- **Name** — text operators
- **Entity type** — equals / notEquals / in / notIn / empty
- **Aspects** — hasAspect / hasNoAspect / hasAllAspects / hasAnyOfAspects / hasNoAspects
- **In Inbox** / **Archived** — yes/no
- **Created** / **Updated** — date operators
- **Relation count** — number operators
- **Backlink count** — number operators (counts attribute-relations and wiki-links too)
- **Has relation of type**

### 11.3 Operators by data type

**Text / URL:** contains, notContains, equals, notEquals, startsWith, endsWith, regex, empty, notEmpty

**Select:** equals, notEquals, in, notIn, empty, notEmpty

**Number:** equals, notEquals, greaterThan, greaterOrEqual, lessThan, lessOrEqual, between, empty, notEmpty

**Date:** equals, before, after, between, isToday, isYesterday, isTomorrow, isThisWeek, isThisMonth, isThisYear, isPast, isFuture, inLastDays N, inNextDays N, olderThanDays N, newerThanDays N, empty, notEmpty

**Yes/No:** isTrue, isFalse, empty

**Relation attribute:** hasAnyTarget, hasNoTarget, targetIs (specific entity), targetIsType, targetHasAspect

### 11.4 Active filter summary

When you close the panel and rules are active, a strip appears above the list: `Filter: Person / Email contains "firma" · aspects has aspect VIP  [Clear]`. Click Clear to discard all advanced rules.

### 11.5 Saved views

The **⭐ Save as view** button in the filter panel. Dialog: name, icon (emoji), checkbox **Pin as tab**.

A saved view stores: search, type / aspect / date filter, advanced rules (attrFilters), sort, active tab, and display mode (list / Kanban / timeline) with its parameters.

**Pinned view** appears as a tab in the main toolbar (e.g. `🔥 Urgent`). Click to apply the filter.

### 11.6 View management

**Settings → Saved views**: edit name / icon, toggle pinning, **Overwrite with current** (saves current filter into the view), Delete. Preview of view content.

Views are stored in project data (`state.data.savedViews`), travel with the project.

### 11.7 Invalid rules

When you delete an attribute referenced by a rule, the rule is marked red as `⚠ Invalid` in the panel. When applied, it returns an empty result — signal to delete or remap it.

---

## 12. Display modes: list, Kanban, timeline

In the list view toolbar there are three switches **📋 List · 📊 Kanban · 📅 Timeline**.

### 12.1 List (📋)

Default. Entity cards below each other. Sorting, filters and views work normally.

### 12.2 Kanban (📊)

Above the board a **Columns by** selector. Offers select / yesno attributes plus the system property "Entity type". Columns are values of the attribute (+ a "no value" column for entities without a value).

Card has icon, name, snippet and a **Move to dropdown** — screen reader-compatible alternative to drag-and-drop. Changing column = editing attribute value, entity is re-saved.

### 12.3 Timeline (📅)

**Timeline by** selector — all date attributes (type, aspect) plus system Created / Updated.

**⇧ Ascending / ⇩ Descending** button.

Entities grouped by year and month with date before the name. Entities without a date in a separate **No date** section.

### 12.4 Display mode in saved views

When you save a view, display mode and its parameters are saved too. Clicking a pinned view tab returns you to the same display. Changeable via **Overwrite with current** in Settings → Saved views.

---

## 13. Bulk operations

Click **☑ Select** in toolbar (V key). Entity cards get a checkbox. Pick which entities to process.

Bulk toolbar shows count selected + action dropdown:

- **📥 To Inbox** — move to Inbox
- **📤 From Inbox** — remove from Inbox
- **📦 Archive / Restore**
- **🗑 Delete**
- **🏷 Assign type**
- **◎ Add aspect / Remove aspect**
- **↔ Add relation** — bulk-adds relation to all
- **⇢ Merge entities** — merges selected into one target (see 13.1)
- **🎨 PlantUML diagram** — generates PlantUML from selected (see chapter 24)
- **📦 Export package** — bundles selected into a `.dkmpkg` (see chapter 26)

### 13.1 Merging entities

Select 2+ entities, action **⇢ Merge entities**. Dialog:

- **Target entity** (others merge into it)
- **Conflict strategy**: Keep target / Overwrite from source / Concat both
- **Preview** — how many relations move, attributes, backlinks

Clicking **Merge**:

- Transfers attributes per strategy
- Unions aspects and custom attributes
- Moves outgoing relations (deduplicated)
- Redirects **all incoming relations** from other entities to the target (classic and attribute-relations)
- Deletes source entities
- Jumps to the target

Ideal for duplicates ("two Paul Newmans", "same table under different names").

---

## 14. Inbox and archive

### 14.1 Inbox

**Inbox** is a tab for entities you create quickly without thinking (e.g. an idea for later) or without knowing the type. A new entity can be in Inbox — "In Inbox" checkbox in the editor.

At the top of Inbox is the **Quick add** field — type text, press Enter, entity without type appears in Inbox. Optionally a large textarea for a longer note.

Goal: gradually process Inbox entities — assign type (Change type in detail), fill attributes, move out of Inbox (uncheck checkbox).

### 14.2 Archive

**Archive** = entity vanishes from all normal views (except Archive tab). Data remains, relations work. Good for completed items you don't want to see daily but not delete.

Archive tab appears only when something is in it.

---

## 15. Markdown, CriticMarkup, wiki-links

### 15.1 Markdown in textarea attributes

Supported features:

- **# Headings** (# through ####)
- **Paragraphs** separated by blank line
- **`inline code`** and ``` ``` ``` blocks
- **`*italic*`, `**bold**`, `~~strikethrough~~`**
- **Setext headings** (=== / ---)
- **Lists** `- ` and `1. `
- **Links** `[text](url)`
- **Images** `![alt](url)`
- **Blockquote** `>`
- **Tables** GFM style

Renders below the editor as preview and in Detail as final content.

### 15.2 CriticMarkup

For marking text changes (useful in approval workflows):

- `{++ added text ++}` — inserted
- `{-- deleted text --}` — deleted
- `{~~ old ~> new ~~}` — replacement
- `{== highlighted ==}` — highlight
- `{>> comment <<}` — sidenote

In display renders in colors (added green, deleted red, etc.). In DOCX export becomes tracked changes.

### 15.3 Wiki-links

Inside a textarea (or custom text) you can write `[[Entity name]]`. If an entity with that name exists, the wiki-link renders as a clickable link. If it doesn't, it shows red with a tooltip "No entity with this name exists".

**The strongest effect is the backward action**: the target entity's **Linked from** section automatically sees all source entities linking here via wiki-link. You don't need to formally create a relation.

Example: in a note on one entity you write "Follow-up on [[Regulation 409/2025]]." When you open that regulation, you see this link in the Linked from section, group `[[Note]] (Person) ←`.

Match is case-insensitive on full entity name.

---

## 16. Comments

### 16.1 On an entity

In entity detail, the **💬 Comments** section. Form on top:

- Textarea (Markdown)
- Author is automatically taken from **Settings → General → Your name for comments**
- **Add comment** button (or Ctrl+Enter in textarea)

Comment list: each has author, date, Markdown content, "edited" label if edited, **✎ Edit** (inline editing) and **× Delete** buttons. Sorted newest-first.

**Key `c` in detail** focuses the comment input.

### 16.2 All comments view

Access via Command palette (Ctrl+P → "All comments") or URL `#comments`.

- Search field — searches content, author, entity name
- Sorted newest-first across all entities
- Each row has a link to the entity (with type icon), author, date, and Markdown preview of the comment

Great for quickly browsing discussions across the project.

---

## 17. Objects

### 17.1 What an object is

An **object** is a named text storage attached to an entity — e.g. `data.json`, `outline.mroutline`, `graph.puml`. An object is just text — DKM **never renders it**, just holds it. It never appears in print outputs (MD, DOCX, PDF, formatted copy).

Purpose: safely store machine data (outputs from external tools) right at the entity, without cluttering the detail.

### 17.2 Adding an object

In entity editor next to **+ Add custom attribute** is **+ Add object**. Enter a name with extension. An empty object is created.

### 17.3 Working with an object

In detail, the **📦 Objects** section. Each object shows:

- Icon 📦 + name in monospace
- Size (B / kB / MB)
- Buttons:
  - **📋⬆ Copy to clipboard**
  - **📋⬇ Paste from clipboard** (only when browser supports `readText`)
  - **💾 Save as file** — downloads with exact name
  - **📥 Load new version** — file input, replaces content with chosen file
- In header: **✎ Rename** and **× Delete**

Content overwriting (Paste / Load new version) **does not ask for confirmation** — behaves as in PIM.

### 17.4 When to use object vs. textarea attribute

- **Textarea attribute** = structured text you want to see in detail, export, print
- **Object** = machine data, JSON, XML, tool output that you want at the entity but not in detail or exports

Objects are part of project data (saved to file, GitHub, package).

---

## 18. Panels

### 18.1 What a panel is

A **panel** is an independent working context within one browser tab. Each panel has its own view (entity detail, list, settings), filters, position in navigation history.

You can have simultaneously:

- Panel 1 with the list "All"
- Panel 2 with detail of a specific entity
- Panel 3 with the saved view "Urgent"

You switch between them with one click, each panel keeps its state.

### 18.2 Panel bar

Appears above main content when you have more than 1 panel. Each panel = a tab with an icon (per content), label and × to close. On the right a **＋** button for a new panel.

Tab label updates automatically:

- Entity detail → type icon + name
- Editor → `✎ Name`
- New entity → `＋ New entity`
- List → icon + tab name
- Saved view → icon + view name
- Settings → `⚙ Settings`
- All comments → `💬 All comments`

### 18.3 Keyboard shortcuts

- **Ctrl+T** — new panel (opens in Inbox)
- **Ctrl+W** — close active panel (can't close the last one)
- Click on tab — switch
- **× on tab** — close specific

### 18.4 When to use panels

- **Comparing two entities** — one in each panel, switch between them
- **Working on entity + context** — main panel with project list, second with the entity being edited
- **Quick reference** — third panel with Statistics or Settings, no need to leave work

Panels are **in-memory only** — disappear when the browser tab closes.

---

## 19. Command palette (Ctrl+P)

### 19.1 Opening

Press **Ctrl+P** (Cmd+P on Mac) → a modal with a text field.

### 19.2 What you can find

- **Entities** (top 60 or fuzzy match) — click opens detail
- **Saved views**
- **Aspects** (click → aspect tab)
- **Entity types** (click → type tab)
- **Actions**: New entity, Settings, Save, Load, Advanced filters, Clipboard IO, PlantUML export, New panel, All comments, Inbox / All / Archive

### 19.3 Fuzzy match

Type keywords. Condition: each word must be a substring in label or sublabel (case-insensitive). Bonuses: exact match, startsWith. Shorter label wins ties.

Empty query offers recently visited entities from navigation history.

### 19.4 Keyboard control

- **↑↓** — move in list
- **Home / End** — first / last
- **Enter** — run action
- **Esc** — close

Screen reader-compatible (ARIA combobox + listbox + aria-activedescendant).

---

## 20. Standalone windows

### 20.1 What it's for

Sometimes you want to separate work on a single entity into a **standalone browser window** — for side-by-side with the main window, dedicated focus, parallel editing.

### 20.2 Opening

In entity detail, click the **🪟 Standalone window** button. A new DKM instance opens in a separate browser window.

### 20.3 Standalone mode

The standalone window has **minimized chrome**: hidden tab bar, panel bar, quick-add form, Export / Import buttons. Save, Load, Settings and entity controls remain. App title is shrunk.

### 20.4 Data handoff and live sync

Current data is passed to the new window via localStorage handoff (short-lived, one-shot). The new window loads it and clears the handoff key.

Between open windows a **live sync via BroadcastChannel** works:

- When you edit data in one window, others auto-update
- When another window is in editing mode, a banner shows "Data changed in another window" with a **Load current** button — prevents overwriting the in-progress edit

You can have **any number of standalone windows** open at once.

### 20.5 Limitations

- Popup blocker: browser must allow popups for DKM
- Data must be loaded in the main window before opening

---

## 21. Data storage

### 21.1 Where data lives

**The project exists only in the current browser tab.** Refresh (F5) won't lose it (data is in sessionStorage), closing the tab will.

**One project per tab** — if you want multiple projects open at once, open the app in multiple tabs. Each tab is independent.

### 21.2 Save to file

Click **Save** (Ctrl+S). Without a GitHub path set, a `.dkmdata` file is downloaded with the whole project.

Everything goes to the file: types, aspects, relations, lists, saved views, entities (with attributes, aspects, relations, custom attributes, objects, comments).

### 21.3 Load from file

Click **Load** (Alt+L) → file picker → `.dkmdata` or `.json`.

If the current project has unsaved changes, DKM asks "Unsaved changes will be lost. Continue?".

### 21.4 GitHub sync

In **Settings → GitHub** enter a **token** (personal access token) and in **Settings → Project** the file path on GitHub as `owner/repo/branch/path/file.dkmdata`.

Then **Save** (Ctrl+S) saves directly to GitHub.

**Load from GitHub** — button in Settings → Project.

### 21.5 URL parameter for autoload

`?id={base64ghPath}` in the URL → DKM auto-loads the project from GitHub on startup. Handy for sharing a link or pinning to browser bookmarks.

### 21.6 Copy to clipboard

**📋⬆ Copy to clipboard** in header (Ctrl+Shift+S). Copies the whole project as JSON. Useful for quick transfer to another tab or another app.

### 21.7 Load from clipboard

**📋⬇ Load from clipboard** (Ctrl+Shift+O). Reads project from clipboard, replaces current (with confirmation if unsaved changes). When the browser denies direct access, a textarea dialog opens for manual paste.

### 21.8 Autosave

**Settings → General → Autosave** — every change auto-saves to sessionStorage (current tab). Refresh survives, tab close doesn't.

This does NOT include file or GitHub saves — save manually via Ctrl+S regularly.

### 21.9 Start empty project

**Settings → Project → 📄 Start empty project**. Discards current project (with confirmation if unsaved changes) and starts fresh.

---

## 22. Diff since last save

### 22.1 What it is

After every successful save or load DKM takes a **snapshot** of the data. Then it compares the current state to that snapshot to show clearly **what changed since the last save**.

### 22.2 Opening

Click the **● Unsaved changes** indicator in the header (visible when the project is "dirty").

### 22.3 What you see

Color-coded three sections:

- 🟢 **Added** — new entities since baseline
- 🟡 **Modified** — entities with per-field change list (Email, Date, Aspects, etc., before → after)
- 🔴 **Deleted** — entities that disappeared

Click on entities → closes dialog and jumps to detail.

### 22.4 When to use

- **Before saving** — check no edit is accidental
- **Before pushing to GitHub** — overview of "commit" changes
- **After an hour of work** — what you did today
- **Recovery** — if unsure what the last changes did, open diff to orient yourself

---

## 23. Export and print entity

In entity detail the **🖨 Export / print** button. Opens a dialog with section checkboxes:

### 23.1 Optional sections

- **Header** — name, type icon, type badge, aspect badges, status badges
- **Type attributes** — individual (checkbox), All / None buttons
- **Aspect attributes** — separate section per aspect
- **Custom attributes**
- **Relations** — outgoing, linked from
- **Metadata** — Entity type, Created, Updated, ID

### 23.2 Output formats

- **📋 Copy MD** — raw Markdown to clipboard
- **✨ Copy formatted** — via ClipboardItem with HTML + plain text. Pasting into Word, Outlook, Gmail keeps headings, bold, italic, lists.
- **📥 Download MD** — file `EntityName.md`
- **📄 Download DOCX** — Word file via docx.js (lazy-loaded from CDN), Calibri font, heading hierarchy, bullet lists for relations
- **🖨 Print / PDF** — new window with rendered HTML + auto `window.print()`. Through browser you print on paper or save as PDF.

### 23.3 Rules

- Empty values are skipped (even if attribute is checked)
- Archived relation targets are excluded
- Entity's objects are **never exported** (not to MD, DOCX, PDF, formatted copy)
- Textarea attributes render as Markdown in HTML / DOCX (bold, lists, CriticMarkup)

---

## 24. Export to XLSX, TSV, PlantUML

### 24.1 XLSX

**Export** button in header. Creates an `.xlsx` with currently filtered entities. Columns: name, type, type attributes, main data. Useful for sharing outside DKM.

### 24.2 TSV import

**Import TSV** button. Loads a table from Excel / TSV / clipboard paste. You can map columns to attributes and create entities in bulk.

### 24.3 PlantUML export of relations

Accessible via:

- **Command palette (Ctrl+P)** → "PlantUML export" action
- **Bulk action** → "🎨 PlantUML diagram" (in selection mode)

Dialog:

- **Scope**: current list, selection (bulk mode), all, type, aspect
- **Style**: Class diagram (classes with attributes), Component, Use case
- **Options**: include attributes as class fields, include attribute-based relations (dashed lines), include external targets outside scope (gray)
- **Live preview** of PlantUML code

Output:

- **📋 Copy** — to clipboard
- **📥 Download .puml** — file for external PlantUML tool

Name escaping, ID aliasing to E0/E1/…, stereotypes by type (`<<Person>>`), attribute-relations as dashed `..>`.

Ideal for data model documentation, ER diagrams, architecture.

---

## 25. Static viewer

DKM can generate a **static HTML viewer** of project data — a single file you open for read-only access to all entities.

### 25.1 Generating

**Settings → Project → Static viewer**. Click → downloads a file with embedded project data.

The static viewer has:

- Entity list
- Entity detail
- Search
- Basic filters
- Read-only mode (no edits)

Useful for:

- **Sharing data** with someone without DKM
- **Archive snapshot** of project state at a given date
- **Publishing** on the web (e.g. GitHub Pages)

### 25.2 Default entity

In the generation dialog you can select the entity on which the viewer opens.

---

## 26. Moving parts between projects (packages)

### 26.1 Package format

`.dkmpkg` is a JSON containing **a selection of entities + their data model** (only types, aspects, lists and relation types the selected entities need). Enables moving a slice of one project to another without extra.

### 26.2 Package export

In bulk mode select entities, action **📦 Export package**. Wizard:

1. **Scope**: only selected / selected + neighbors (via relations) / whole component (graph neighborhood)
2. **Model**: types, aspects, lists and relations to transfer
3. **Preview**: overview of what will be in the package

Downloads a `.dkmpkg`.

### 26.3 Package import

**Settings → Project → Move between projects → Import package**. Upload `.dkmpkg`. Wizard:

- Content summary
- Conflict check (existing types, attributes)
- Automap: attribute matching by name + type
- Change preview
- Backup before import (checkbox on by default — downloads current project as `.dkmdata` before import)

Clicking Import performs a two-pass:

1. Entities are created with new IDs
2. Relations and relation attributes are remapped to new IDs

---

## 27. Settings

### 27.1 Project

- Name, description
- GitHub path
- Static viewer (generation)
- Package transfer (import)
- Project storage (info about session storage + Start empty project)

### 27.2 Types

List of types, click to open editor with attributes, icon, name.

### 27.3 Aspects

Analogous for aspects.

### 27.4 Relations

Relation type definitions: name, inverse name, scope, allowed source / target types.

### 27.5 Lists

Select lists with value enumerations. Used in attributes of type select.

### 27.6 Saved views

Manage all saved views: rename, change icon, toggle pin, overwrite with current filter, delete.

### 27.7 Tabs

Which types and aspects appear as tabs in the main toolbar.

### 27.8 GitHub

Personal access token for GitHub API. Stored in the browser's localStorage (per origin).

### 27.9 General

- **Language** (Čeština / English)
- **Your name for comments** — used as author of new comments, saved with project data
- **Autosave** — automatic saving to sessionStorage (per tab)
- **Debug** — enables a bottom panel with debug logs

### 27.10 Statistics

Counts overview: entities, types, attributes, aspects, relations, comments.

### 27.11 Help

Links to online documentation and repository.

---

## 28. Keyboard shortcuts

### Global

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save (file / GitHub) |
| Ctrl+F | Open advanced filters |
| Ctrl+Shift+F | Close advanced filters and clear |
| Ctrl+P | Command palette |
| Ctrl+T | New panel |
| Ctrl+W | Close active panel |
| Ctrl+Shift+O | Load project from clipboard |
| Ctrl+Shift+S | Copy project to clipboard |
| Ctrl+K | Focus search |
| Esc | Close dialog / exit mode |

### Navigation

| Shortcut | Action |
|----------|--------|
| Alt+B | Back (in detail, editor, settings) |
| Alt+L | Load |
| i | Go to Inbox |
| a | Go to All |
| n | New entity (with type picker) |

### List

| Shortcut | Action |
|----------|--------|
| f | Focus search |
| / | Focus search |
| v | Toggle selection mode |

### Detail

| Shortcut | Action |
|----------|--------|
| e | Edit |
| r | Add relation |
| c | Focus comment input |

### Editor

| Shortcut | Action |
|----------|--------|
| u | Save edit |
| Esc | Cancel edit |

### Comments

| Shortcut | Action |
|----------|--------|
| Ctrl+Enter in textarea | Submit comment |

---

## 29. Accessibility

DKM is designed to work with screen readers.

- **Semantic headings**: page's main heading (H1) is always the content name (entity, view, settings section), never the application
- **No treeview** (`role=tree/treeitem`) — hierarchies are nested `<ul>/<li>`
- **No position: sticky / fixed** on large areas
- **ARIA labels** on non-obvious interactive elements
- **Keyboard navigation** (see chapter 28)
- **Screen reader announcements** minimized — only brief action confirmations (Saved, Added), not re-render of fields

### 29.1 Command palette

Screen reader-compatible: ARIA combobox, listbox, aria-activedescendant, aria-selected on active item.

### 29.2 Kanban

Cards aren't drag-and-drop (inaccessible to screen readers). Instead a **Move to dropdown** per card.

---

## 30. Tips and tricks

### 30.1 Quick workflow

1. Open the app daily with `?id={ghPath}` (bookmark) — project auto-loads from GitHub
2. Ctrl+P → type few letters of entity name → Enter — you're in the detail
3. Key `e` — edit
4. Key `u` — save edit
5. Ctrl+S → push to GitHub

### 30.2 Using panels

- Panel 1 = project list (context)
- Panel 2 = detail of in-progress entity
- Panel 3 = detail of entity being compared

Ctrl+T for new, click on tab to switch.

### 30.3 Wiki-links instead of formal relations

If you don't want to bother creating a formal relation, just write `[[Entity name]]` in a textarea. In the Linked from section, the link automatically appears.

### 30.4 Kanban for approval workflow

Create an aspect "Approval" with attribute "Status" (select: New / In progress / Approved / Rejected). Assign the aspect to entities. Switch list to Kanban by "Status". Move cards via dropdown = change status. Save as pinned view 🔥 Approvals and have it in the toolbar with one click.

### 30.5 PlantUML model documentation

For external data model documentation:

1. Select entities (or use an aspect)
2. Ctrl+P → "PlantUML export"
3. Class diagram + include attributes
4. Download .puml
5. Paste into PlantUML editor → image

### 30.6 Diff before save

Before pressing Ctrl+S:

1. Click ● Unsaved changes indicator
2. Review the diff
3. Verify the changes are what you intended

### 30.7 Duplicate merge

When you find two entities that are actually the same thing:

1. Key V — bulk mode
2. Check both
3. Action ⇢ Merge entities
4. Pick target, conflict strategy
5. Merge — all relations and attributes redirect automatically

### 30.8 Quick project switching

- In main window open project A
- **Ctrl+Shift+S** — copy to clipboard
- New tab → **Ctrl+Shift+O** → project A opens in the second tab too
- In second tab load project B from file

You have both projects at once, each in a different tab.

---

## 31. Common problems

### 31.1 "I don't see my entities"

- Check toolbar filters — you may have an active filter hiding everything. Click Clear filters.
- Check the Archive tab — they may be archived
- Check advanced filters (⚙ Advanced filters) — you may have an invalid rule

### 31.2 "I closed the tab and the project is gone"

The project lives only in sessionStorage. For persistent storage:

- Ctrl+S — save to file
- Set a GitHub path and Ctrl+S — save to GitHub
- Bookmark the URL `?id={base64ghPath}` for fast autoload

### 31.3 "Browser did not allow clipboard access"

- Try again, focus may have been the issue
- Or use the dialog fallback (DKM shows it automatically)

### 31.4 "PlantUML export doesn't look good"

- Check scope — you may have too many entities
- Try a different style (Component / Use case are simpler)
- Turn off attributes when there are many

### 31.5 "Diff is empty but I have unsaved changes"

- Baseline is set only on save or load. If you haven't saved yet, diff has nothing to compare.
- Save → from that moment changes are tracked against that point.

### 31.6 "Standalone window won't open"

- Browser is blocking popups — allow popups for DKM
- Check the browser notification panel (usually right of the address bar)

---

## 32. Technical background

### 32.1 Data structure

The project is one JSON document (see `dkmdata.json`):

```
{
  version, projectName, projectDescription, ghPath,
  settings: { visibleTypeTabs, visibleAspectTabs, userName },
  entityTypes: [{ id, name, icon, attributes: [{ id, name, type, required, showInList, ... }] }],
  aspects: [{ id, name, attributes: [...] }],
  relationTypes: [{ id, name, inverseName, scope, fromTypes, toTypes }],
  selectLists: [{ id, name, options }],
  savedViews: [{ id, name, icon, pinned, filter, sort, tab, displayMode, ... }],
  entities: [{
    id, name, typeId, inInbox, archived,
    attributes: { attrId: value },
    customAttributes: [{ id, name, type, value }],
    aspects: [aspectId],
    relations: [{ id, relationTypeId, targetId }],
    objects: [{ id, name, content }],
    comments: [{ id, content, author, createdAt, editedAt? }],
    createdAt, updatedAt
  }]
}
```

### 32.2 Browser storage

- **sessionStorage['dkm-session-data']** — current project, per tab. Refresh survives, tab close doesn't.
- **localStorage** — preferences (language, autosave, debug, GitHub token). Never holds project data.
- **BroadcastChannel 'dkm-sync'** — live sync between open windows.

### 32.3 GitHub API

DKM uses Contents API for reading + Git Data API (blobs) for writing large files. The token is stored in `localStorage['dkm-github-token']` (per origin).

### 32.4 Rendering

Vanilla JavaScript, no framework. Templates as direct DOM manipulation. Full re-render on every state change (fast even for thousands of entities).

### 32.5 Testing

Regression tests via jsdom (see `smoke_*.js` in the repository). Cover: advanced filters, saved views, export, backlinks, navigation history, clipboard, sessionStorage, load/save, wiki-links, diff, merge, PlantUML, mode switchers, comments, objects, panels, standalone window.
