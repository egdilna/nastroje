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
12. [Data views](#12-data-views)
13. [Bulk operations](#13-bulk-operations)
14. [Inbox and archive](#14-inbox-and-archive)
15. [Markdown, CriticMarkup, wiki-links](#15-markdown-criticmarkup-wiki-links)
16. [Comments](#16-comments)
17. [Objects](#17-objects)
18. [Panels](#18-panels)
19. [Command palette](#19-command-palette)
20. [Standalone windows](#20-standalone-windows)
21. [Data storage](#21-data-storage)
22. [Diff since last save](#22-diff-since-last-save)
23. [Everything you can get out of DKM](#23-everything-you-can-get-out-of-dkm)
24. [Export and print entities](#24-export-and-print-entities)
25. [Export to a table, PlantUML and GraphML](#25-export-to-a-table-plantuml-and-graphml)
26. [Data JSON export with a schema](#26-data-json-export-with-a-schema)
27. [Static viewer](#27-static-viewer)
28. [Moving parts between projects (packages)](#28-moving-parts-between-projects-packages)
29. [Settings](#29-settings)
30. [Keyboard shortcuts](#30-keyboard-shortcuts)
31. [Accessibility](#31-accessibility)
32. [Tips and tricks](#32-tips-and-tricks)
33. [Common problems](#33-common-problems)
34. [Technical background](#34-technical-background)
35. [AI assistant](#35-ai-assistant)
36. [The data model and its export](#36-the-data-model-and-its-export)
37. [The `.dkmdata` and `.dkmpkg` file formats](#37-the-dkmdata-and-dkmpkg-file-formats)
38. [The screen identifier in the footer](#38-the-screen-identifier-in-the-footer)

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
- **tags** — a set of labels from one **tag set**; the value is several tags at once (see 7.5)

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
- **📋⬆ Copy to clipboard** (Ctrl+Shift+S) — copies the whole project as JSON to the clipboard
- **📤 Export** — opens the Export data dialog: scope, target and format in one place (ch. 23)
- **Export** — XLSX export of currently filtered entities
- **Import TSV** — loads entities from TSV / CSV / pasted clipboard
- **⌘ Commands** — the command palette: everything the app can do, in one place (Ctrl+Shift+P or F1, see ch. 19)
- **Settings** — project, types, aspects, relations, lists, views, general
- **⚙ Customize** — a dropdown with two sections: **Language** (Čeština / English) and **Theme** (see 4.2)
- **● Unsaved changes** — clicking opens diff against last save

### 4.2 Visual themes

In the **⚙ Customize → Theme** menu (or Settings → General, or from the command palette):

| Theme | What it looks like |
|---|---|
| **Light** | default, light background, blue accent |
| **Dark** | dark grey background, light text |
| **Paper** | warm sepia sheet, brown ink, **serif type** |
| **Matrix** | green on black, **monospace type**, a subtle glow |

The choice is stored **in this browser only** (key `dkm-theme`), just like the language — it
does not travel in the project data, so everyone can set their own.

The theme is applied before the page renders, so the default look never flashes on load.
If you have never picked a theme, the first run follows your system setting (OS dark mode =
Dark); after that only your own choice counts.

The theme applies to the app. **Print, DOCX/PDF export and the static viewer stay light** —
those are outputs for someone else, not your working environment.

### 4.3 Toolbar above the list

- **Tabs**: the whole bar is yours — you compose it in Settings → Tabs (29.8) out of anything: Inbox, All, Archive, entity types (several types in one tab if you like), aspects, tags, saved views, one specific entity, comments, creating a new entity of a given type, and plain separators. Nothing is fixed; you can reorder by dragging in the bar itself and **Alt+1 … Alt+9** jump to the first nine tabs.
- **Search** — fulltext across name and text attributes
- **Filter** — type, aspect, update date
- **Sort** — by update date / name / creation date
- **⚙ Advanced filters (N)** — panel to filter by any attribute (see chapter 11)
- **📋 / 📊 / 📅** — display mode switcher: list / Kanban / timeline (see chapter 12)
- **`{ }`** — export the displayed list to data JSON with a schema (see chapter 25)
- **+ New entity**
- **☑ Select** — enable bulk actions

### 4.4 Entity card in list

- **Type icon** + **entity name** (e.g. 👤 *Paul Newman*)
- **Badge** with type name, 📥 Inbox, 📦 Archive, and aspects (◎ *VIP*)
- **Snippet** — brief excerpt from the first textarea attribute
- **Values of "Show in list" attributes** — if any are enabled
- **Update date** and relation count
- **🪟** on the right of the card header — opens the entity directly in a standalone window (see ch. 20), without going through the detail

Clicking a card anywhere outside links and buttons opens the detail. The name itself is
a real link, so middle-click or Ctrl+click opens it in a new tab.

### 4.5 Entity detail

- **← Back** (Alt+B) — returns to previously shown page. Never returns into editing — skips edit states.
- **▾ Navigation history** — dropdown next to Back with recently visited entities and views in this session. For entities you see type icon, name and type.
- **Heading** — type icon + entity name + type badge, aspect badges, status badges
- **Actions**: Edit (E), Duplicate, Change type, 🖨 Export / print, 🪟 Standalone window, Archive, Delete
- **Attributes** — filled attributes (type, aspects, custom)

The detail is split in two. **On the left is what the entity is** — attributes and objects;
those stay visible. **On the right is its surroundings and what is known about it**, switched
by tabs:

| Tab | What is on it |
|---|---|
| **Relations** `3→ 4←` | outgoing relations, and below them **Linked from**, the incoming ones. It is the same thing read from the other side, hence one tab. |
| **🌳 Structural view** | a tree for walking the relations. The tab is only there for an entity that has some relation. |
| **🏷 Tags** `3` | this entity's tags; each expands to the entities carrying the same tag from the same set. The tab is only there for an entity that has some tag. |
| **💬 Comments** `2` | the comments and the box for a new one |

**The numbers next to a tab name are deliberate** — you do not have to click to find out
whether there is anything. Left and right arrows move between tabs, Home jumps to the first,
End to the last.

**Every list of entities and tags in the detail is sorted alphabetically**, case-insensitively
and with a feel for numbers ("item 2" before "item 10"). That covers relations, Linked from, the
values of relation attributes, the structural view and the tag chips — the order does not depend
on what was written first. The tag picker in the editor is alphabetical too. For relations the
stored order is untouched and sorting happens on display; tags are stored alphabetically right
away, because there the order never meant anything.

At the very bottom there is a discreet line with the **ID, when the entity was created and
when it last changed**.

In a narrow window, in the preview beside the list and in the standalone window the columns
stack: attributes first, then the tabs, and that line last.
- **Relations** — where the entity points: classic relations grouped by relation type, but
  also the targets of relation attributes and wiki links `[[Name]]` from texts. It mirrors
  the **Linked from** section exactly — whatever counts as an incoming link counts as an
  outgoing one too
- **Linked from** — entities that reference this one (classic relations, attribute-relations, wiki-links). Groups have different labels:
  - `relation name ←` (classic relations)
  - `Type / AttrName ←` (attribute-of-type-relation references)
  - `◎ Aspect / AttrName ←` (aspect attribute references)
  - `[[AttrName]] (Context) ←` (wiki-links)
- **Objects** — section with entity's objects (see chapter 17)
- **Comments** — section with comments and new-comment form (see chapter 16)
- **Structural view** — 🌳 hierarchical tree by relations. It starts **collapsed, root
  included** — not everyone opening a detail wants to see it. Expand it with the triangle.
- **Metadata** — ID, created, updated

### 4.6 Entity editor

- **Name** — required
- **Type** — changeable via Change type
- **Inbox** — checkbox "in Inbox"
- **Type attributes** — fields per data type
- **Aspects** — section with checkboxes. Checking adds an aspect and immediately shows its attributes.
- **Custom attributes** — section with + Add custom attribute and + Add object
- **Relations** — current relations, + Add relation
- **Save / Cancel** at the bottom (U key also saves)

### 4.7 Settings

Left panel with sections:

- **Project** — name, description, GitHub path, static viewer, package transfer, project storage
- **Types** — list of entity types, attributes, icons
- **Aspects** — analogous to types
- **Relations** — relation types, names, scope, allowed types
- **Lists** — select lists with value enumerations
- **Saved views** — management of saved filters
- **Tabs** — what the bar at the top is made of
- **GitHub** — token, synchronization
- **General** — language, user name for comments, autosave, debug
- **Statistics** — counts of entities, attributes, relations
- **Help** — documentation links

### 4.8 Panels

Above main content appears a **panel bar** when you have multiple panels open. Each panel is an independent working context with its own view, filters, opened entity. Details in chapter 18.

---

## 5. Working with entities

### 5.1 Creating an entity

Several ways:

- **+ New entity** in the header or toolbar
- **Quick add** from Inbox view — the "New entity" field at the top of Inbox, type text and press Enter → creates an entity without type in Inbox
- **Duplicate** in detail — creates a copy of current entity (name suffixed with "(copy)")
- From the **command palette** (Ctrl+Shift+P or F1) → "New entity", "New into Inbox" or "New: <type>"

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

In **Settings → Tabs** add a tab of kind *Entity types* and tick the types it should show —
several at once is fine ("Objects and subjects"). The **＋ Tabs for all types** button does it
for every type in one go. Types without a tab stay reachable from the command palette (Ctrl+Shift+P, F1)
and from advanced filters.

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

### 7.5 Attribute of type tags

A tags attribute is a universal labeller. It does not hold one value but **as many tags as
you want at once** — all of them from a single **tag set** (Settings → Tags, see 29.6).
A tag set is a named supply of labels: "Colours", "Priority", "Agenda area".

When you add an attribute of type **tags** in a type or aspect editor, you pick a tag set
for it — much like picking a value list for a select attribute. Any number of attributes can
share one set, across different entity types; a tag is a label **across attributes**, so
"Green" from the "Colours" set means the same on a Person and on a System.

**Entering tags.** In the entity editor the attribute is collapsed and its summary shows what
is selected — `Colours: Red, Green`, or "nothing selected". Expanded, there are checkboxes for
the whole set **in alphabetical order** and below them an **＋ Add tag** field: whatever you
type there is added to the set (so every other attribute offers it right away) and selected
for this entity at the same time — and it lands in its alphabetical place, not at the end.
Enter is enough, you need not click the button. The order of the selected tags follows the
alphabet, not the order you clicked.

A tag someone has meanwhile removed from the set is **not lost** on the entity — it stays
selected and is marked `⚠` so you can see it no longer belongs to the set.

**Showing tags.** The chips are ordered **alphabetically**, case-insensitively — and so is
the picker in the editor and the stored value. The order of the lines in the set therefore
governs nothing: tags also come into being through quick add from inside an entity, so the
picker would otherwise look different every time. In the entity detail every tag is a chip and a **link to the list of all entities carrying that tag**. Next to it, on the right, is the **🏷 Tags** tab: one collapsible
item per tag, expanding to links to the other entities with the same label (fifteen at most)
and a link to the full list.

**Filtering by tags.** The list toolbar has a **Tag** dropdown with every tag actually in use
and the number of entities for each; picking one narrows the list immediately. The address
`#tag/<set>/<tag>` does the same — a tag link can be sent to a colleague and opens the
filtered list for them. The list can also be **split into sections** by tag (12.1), where an
entity with several tags shows up in each of them. Advanced filters (chapter 11) gained the operators **has tag**,
**does not have tag**, **has any tag** and **has no tag**.

Full-text search looks into tags as well.

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

**Deleting a relation:** in edit mode there is an **×** pill after the name of the linked
entity. Clicking it removes the relation from the form; it reaches the data **only when you
save the entity**. You cannot delete from the *Backlinks* section — the relation belongs to the
entity it leads from, so delete it there.

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
- Tags (values of tag attributes)

Returns entities containing the query string.

### 10.2 Type filter

Dropdown in toolbar — narrows list to one selected type.

### 10.3 Aspect filter

Dropdown — narrows list to entities carrying the aspect.

### 10.4 Tag filter

The **Tag** dropdown offers every tag actually used in the project — grouped by set and with
the number of entities for each. Picking one narrows the list to entities carrying that tag,
no matter which attribute holds it. The address `#tag/<set>/<tag>` does the same; that is
where the tag chips in an entity detail lead.

### 10.5 Update date filter

Dropdown with four choices: today, last 7 days, last 30 days, older than a month.

### 10.6 Sort

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

**Tags:** hasTag, hasNotTag, hasAnyTag, hasNoTags — the value is picked from the attached tag set

### 11.4 Active filter summary

When you close the panel and rules are active, a strip appears above the list: `Filter: Person / Email contains "firma" · aspects has aspect VIP  [Clear]`. Click Clear to discard all advanced rules.

### 11.5 Saved views

The **⭐** button sits in the toolbar above the list, next to the display and preview switches —
always, even with no advanced filter set. The command palette does the same (**Ctrl+Shift+P** →
*Save as view*). Dialog: name, icon (emoji), checkbox **Pin as tab**.
That checkbox — and the one next to a view in Settings → Saved views — is the same thing as adding
or removing a *Saved view* tab in Settings → Tabs; two ways to one thing. There is no pinning
anywhere else (not on an entity, not on a tag); tabs are otherwise composed in Settings.

A saved view stores: search, type / aspect / date filter, advanced rules (attrFilters), sort, active tab, and the whole display with its details (see 12.7).

**Pinned view** appears as a tab in the main toolbar (e.g. `🔥 Urgent`). Click to apply the filter.

### 11.6 View management

**Settings → Saved views**: edit name / icon, toggle pinning, **Overwrite with current** (saves current filter into the view), Delete. Preview of view content.

Views are stored in project data (`state.data.savedViews`), travel with the project.

### 11.7 Invalid rules

When you delete an attribute referenced by a rule, the rule is marked red as `⚠ Invalid` in the panel. When applied, it returns an empty result — signal to delete or remap it.

---

## 12. Data views

The toolbar above the list has five switches: **📋 List · ▦ Table · 📊 Kanban · 🗓 Calendar ·
📅 Timeline**. Next to them the **⫸ Preview** toggle, and for the list also **Sections by**.

Only the way of showing changes — filters, search and sorting apply the same in all of them.

### 12.1 List (📋)

The default, and it stays the default. Entity cards below each other.

**Sections by** splits the list into collapsible groups by a select or yes/no attribute, by
entity type, **by date** — either a date attribute or the system **Updated** and **Created** —
or **by tag**. Each section shows how many entities it holds; entities without a value get a
"(no value)" section at the end. The view remembers what you collapsed.

For dates the toolbar adds a **Sections by** granularity: day, week, month or year. Sections run
newest first and the headings are human — *Today*, *Yesterday*, *Wednesday 9 September 2026*,
*September 2026*.

**Sections by tag** are offered per whole set (`🏷 Colours`), not per attribute — a tag is a
label across attributes, so what sits in "Colours" on one type and in "Labels" on another comes
together, and an entity's custom attribute counts too. **An entity with several tags appears in
every matching section** — something that is both Red and Green shows under both. The sections
therefore add up to more than the number of entities, and a note above the list says so, so it
does not read as a bug. Sections are alphabetical, "(no tag)" last. In selection mode one
entity is ticked in all of its sections at once and counts once in the selection.

Neither dates nor tags are offered as Kanban columns: dragging a card between columns means
"overwrite the value", which makes no sense for a change date and gives no way to tell which
tag should be overwritten.

### 12.2 Table (▦)

The familiar grid: rows are entities, columns are attributes. **There is no editing in it** —
it is a view, not a form; edit in the entity detail.

- **⚙ Columns** — pick what shows. The list is grouped into basics, each type and aspect
  separately, custom attributes and metadata, and each column shows how many entities have it
  filled in. The default set is the name, the type, the attributes something has filled in, and
  the update date.
- **Sorting by clicking a header** — first click ascending, second descending, third clears it
  and returns to the toolbar's sorting.
- **The first column and the header stay put** while you scroll.
- In selection mode a checkbox column appears, so bulk operations work here too.

The columns come from the same source as the table export — what you see is what you export.

### 12.3 Calendar (🗓)

A month grid by a chosen date attribute. At the top the attribute picker, month navigation and
a **Today** button; today is highlighted. Entities appear in their day as chips; clicking one
opens the detail (or the preview, when it is on). Below the calendar it says how many entities
have no date and are therefore not in it.

### 12.4 Preview beside the list (⫸)

**A mode, not a one-off action.** Turn it on in the toolbar and from then on clicking an entity
does not open it full-page but **to the right of the list**. You can go through ten entities in
a row without jumping back and forth every time. The selected entity is highlighted in the list.

It works in the list, the table and the calendar. The preview has all the detail's actions
(Edit, Duplicate, Export…), only the back navigation is missing — there is nowhere to go back
from. On a narrow screen the panel moves below the list. Turning it off restores normal
behaviour.

### 12.5 Kanban (📊)

Above the board a **Columns by** selector. Offers select / yesno attributes plus the system property "Entity type". Columns are values of the attribute (+ a "no value" column for entities without a value).

Card has icon, name, snippet and a **Move to dropdown** — screen reader-compatible alternative to drag-and-drop. Changing column = editing attribute value, entity is re-saved.

### 12.6 Timeline (📅)

**Timeline by** selector — all date attributes (type, aspect) plus system Created / Updated.

**⇧ Ascending / ⇩ Descending** button.

Entities grouped by year and month with date before the name. Entities without a date in a separate **No date** section.

### 12.7 Display mode in saved views

When you save a view, the display mode and its settings are saved too — **the sections including
the date granularity**, the chosen table columns **and the sort you clicked into the header**, the
Kanban attribute, the calendar attribute, the timeline attribute and direction, and whether the
preview was on. So "Documents grouped by Status" or "Tasks by due day" is one click on the **⭐**
button in the toolbar and one tab on the bar.

Clicking a view tab returns you to the same display. To change it use **Overwrite with current**
in Settings → Saved views. It takes **the last list you had open** — you reach Settings from
somewhere else, and the current display does not travel there on its own. If you have not opened
a list since loading the project, the display is left alone and only the filter is carried over,
so the view is not reduced to an empty list.

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
- **📦 Export package** — bundles selected into a `.dkmpkg` (see chapter 27)
- **`{ }` Export to data JSON** — data + JSON Schema in a ZIP (see chapter 25)
- **🖨 Export / print selection** — selected entities into one document (MD, DOCX, print; see ch. 24.4)
- **🤖 Ask AI** — send the selection to a language model (see ch. 35)

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

### 15.4 Link suggestions on save

Typing `[[…]]` by hand is tedious, so **when you save an entity DKM scans its multi-line
(Markdown) attributes** for names of other entities written as plain text. Whatever it finds is
listed in a dialog with checkboxes — you pick what should become a link and confirm. **Nothing
changes on its own**, the decision is always yours.

Each suggestion shows the target entity name with its type icon, the number of occurrences and a
snippet of the text with the spot highlighted, so you know which occurrence it is. The
**Select all** / **Select none** buttons speed up bulk decisions, and at the bottom there are three:

- **🔗 Create links and save** — wraps the ticked occurrences in `[[…]]` and saves
- **Save without links** — saves the text as it is
- **Back to editing** — closes the dialog and leaves you in the editor

The rules it searches by:

- only **multi-line** attributes (of the type, of aspects, and custom ones); single-line text is not scanned
- the name must stand as a **whole word** — "Rodné číslostí" is not a hit
- matching is **case-insensitive** and the original spelling is kept (`[[rodné číslo]]` resolves
  just as well as `[[Rodné číslo]]`)
- **the longer name wins** — in the text "Rodné číslo" it offers *Rodné číslo*, not *Číslo*
- it never touches **existing `[[…]]` links, code (inline and fenced), markdown links `[text](url)`,
  HTML tags and URLs** — which is why saving the same entity a second time offers nothing
- names shorter than three characters are skipped, otherwise half the text would match
- archived entities and the entity itself are not offered

You can switch it off in **Settings → General → Suggest wiki links when saving an entity**.

---

## 16. Comments

### 16.1 On an entity

In entity detail, the **💬 Comments** section. Form on top:

- Textarea (Markdown)
- Author is automatically taken from **Settings → General → Your name for comments** (a browser setting, not project data)
- **Add comment** button (or Ctrl+Enter in textarea)

Comment list: each has author, date, Markdown content, "edited" label if edited, **✎ Edit** (inline editing) and **× Delete** buttons. Sorted newest-first.

**Key `c` in detail** focuses the comment input.

### 16.2 All comments view

Access from the command palette (→ "All comments") or URL `#comments`.

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

The type icon is shown at **every** occurrence of an entity name: in the list, on kanban cards,
in the timeline, in the detail heading, on relations and backlinks, on values of "relation"
attributes, in the entity picker, in the outline, in the comments overview and in the diff dialog.

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

## 19. Command palette

**Everything the app can do, in one place.** The palette is not just an entity finder — it is
a universal list of commands: whatever is visible as a button somewhere is in here too, plus
jumps to entities, tabs, types, aspects, tags, saved views and every settings section.

### 19.1 Opening

- **Ctrl+Shift+P** (Cmd+Shift+P on Mac)
- **F1**
- the **⌘ Commands** button in the header, next to Settings

**Ctrl+P is left to the browser for printing** — hence the Shift.
**Shift+F1** opens Help directly (Settings → Help).

The palette does not open on top of a dialog — the app has a single dialog window and a
command from the palette would break it. Close it with Esc first.

### 19.2 What is in it

Listing every command would be pointless; the list grows with the app. It keeps to these
groups:

| Group | What is in it |
|---|---|
| **Create** | New entity, **New into Inbox**, Quick add to Inbox, and **New entity of each type** separately ("New: Contract") |
| **Entity** | commands for the entity currently open — exactly the ones it has as buttons in the detail: Edit, Duplicate, Add relation, Comments, Export / print, Ask AI, Standalone window, To / From Inbox, Change type, Archive or Restore, Delete |
| **List** | search, advanced filters, clear filters, save view, selection mode, preview beside the list and the display switch (list, table, Kanban, calendar, timeline) |
| **Action** | save, load, export data, **import TSV**, **import a .dkmpkg package**, clipboard, load from URL, panels, AI, theme and language |
| **Navigation** | the tabs from the bar, Inbox / All / Archive, All comments and **every settings section** |
| **Jumps** | entity types, aspects, tags, saved views |
| **Entities** | every non-archived entity — Enter opens its detail |

Commands that have a keyboard shortcut show it on the right. The **Entity** and **List**
groups are offered only where they make sense — in a detail and above a list respectively.

### 19.3 Matching

Type keywords. Condition: each word must be a substring of the name or of the group label
(case-insensitive). Bonuses: exact match, starts-with. Shorter names win ties.

An empty query offers recently visited entities from the navigation history.

### 19.4 Keyboard control

- **↑↓** — move in the list
- **Home / End** — first / last
- **Enter** — run the command
- **Esc** — close

Screen reader-compatible (ARIA combobox + listbox + aria-activedescendant).

---

## 20. Standalone windows

### 20.1 What it's for

Sometimes you want to separate work on a single entity into a **standalone browser window** — for side-by-side with the main window, dedicated focus, parallel editing.

### 20.2 Opening

Either from the entity detail with the **🪟 Standalone window** button, or straight from the list
with the **🪟** button on the right of the card header. A new DKM instance opens in a separate browser window.

### 20.3 Standalone mode

The standalone window has **minimized chrome**: hidden tab bar, panel bar, quick-add form, Export / Import buttons. Save, Load, Settings and entity controls remain. App title is shrunk.

### 20.4 Data handoff and live sync

Current data is passed to the new window via localStorage handoff (short-lived, one-shot). The new window loads it and clears the handoff key. A handoff nobody consumed (the popup blocker got in the way) is cleaned up on the next start.

**Only a workspace syncs.** A workspace is one main window plus the standalone windows
that came out of it. Within it:

- When you edit data in one window, the other windows of that workspace auto-update
- When another window is in editing mode **or has unsaved changes**, a banner shows
  "Data changed in another window" with a **Load current** button — work in progress is
  never overwritten, it loads only when you explicitly click

**Two projects open in two windows do not see each other.** Every newly opened DKM window
is its own workspace, so you can keep as many projects side by side as you like and nothing
leaks between them. The same holds for the same project opened a second time — those are two
independent workspaces. A workspace belongs to the browser tab, so F5 does not break it.

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

Saving comes with **sound feedback** — a short rising tone on success, a darker falling one on failure (missing path, missing token, a GitHub rejection or a network error). It can be switched off in Settings → General.

### 21.5 URL parameter for GitHub autoload

`?id={base64ghPath}` in the URL → DKM auto-loads the project from GitHub via the API on
startup. **Settings → GitHub → Link** generates the link. Handy for sharing or for a browser
bookmark. A private repo needs a token stored in the browser.

### 21.6 URL parameter for loading from any address

`?open={url}` in the URL → on startup DKM downloads the project from that address. Unlike
`?id=` it does **not go through the GitHub API**, so it works anywhere: static hosting,
intranet, GitHub Pages, `raw.githubusercontent.com`, a network share exposed over HTTP.

The address **must be encoded** (because of `?` and `&` inside it) — so don't write it by
hand, have the link built in **Settings → Project → Load project from a URL**. The same place
has a button that loads the project right away, without a link. The command palette
offers loading too.

Rules:

- only `https://` is allowed, and `http://` only when DKM itself is not on https
  (otherwise the browser blocks it as mixed content); `javascript:` and `data:` are rejected
- a **relative path** works too — `?open=data/model.dkmdata` takes the file next to `index.html`
- the target server must allow **cross-origin reads (CORS)**. If it doesn't, the browser
  discards the response and DKM reports that the file could not be downloaded.
  `raw.githubusercontent.com` and GitHub Pages do allow CORS, a typical corporate site often doesn't.
- when both `?id=` and `?open=` are present, `?id=` wins
- with unsaved changes DKM asks before overwriting them

A project loaded this way has **no GitHub path set** unless the file itself carries one — so
Save writes to a file, not to GitHub.

### 21.7 Copy to clipboard

The **📋⬆** button in the header (Ctrl+Shift+S), or the **Project to the clipboard** target in the **📤 Export data** dialog. Copies the whole project as JSON. Useful for quick transfer to another tab or another app.

### 21.8 Load from clipboard

**📋⬇ Load from clipboard** (Ctrl+Shift+O). Reads project from clipboard, replaces current (with confirmation if unsaved changes). When the browser denies direct access, a textarea dialog opens for manual paste.

### 21.9 Autosave

**Settings → General → Autosave** — every change auto-saves to sessionStorage (current tab). Refresh survives, tab close doesn't.

This does NOT include file or GitHub saves — save manually via Ctrl+S regularly.

### 21.10 Start empty project

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

## 23. Everything you can get out of DKM

### 23.1 Two levels: data and model

DKM exports at two levels, and it pays not to mix them up:

- **Data** — the actual entities, their values, relations and comments. The content.
- **Model** — types, aspects, attributes, lists and relations. The description of how the
  project is built, without a single entity.

Most of the exports below are data exports. The model is exported from one place —
**Settings → Model** (ch. 36) — and it goes elsewhere: to a developer, an architect or a
database.

### 23.2 Data exports

**Everything except saving the project goes through one button: 📤 Export data.** Open it with
**Export** in the header, with the **📤 Export data** bulk action over a selection, or from the
quick palette. In the dialog you pick a **scope** (selected entities / the displayed list / the
whole project) and a **target**:

**The default scope follows where you opened Export from.** If something is selected in
selection mode, the selection wins. If you are in an entity detail or editor, the default is
**that entity** ("Open entity: Service contract") — not the last list filter. Otherwise it is
the displayed list, and when that is empty, the whole project. Every scope shows how many
entities it yields, and "the displayed list" is offered only when you are actually over a list.

| Target | Formats | What for |
|---|---|---|
| **Document** | Markdown, DOCX, print / PDF, formatted text to the clipboard | a report, an overview, something to read (ch. 24) |
| **Table** | XLSX, CSV, TSV — with a column picker | Excel, edit and import back (ch. 25.1) |
| **Data with a schema** | JSON + JSON Schema, XML + XSD | machine processing, integration (ch. 26) |
| **Diagram or graph** | PlantUML, GraphML | a picture of the relations, or a graph for Gephi and yEd (ch. 25.3) |
| **Package** | `.dkmpkg` | moving a slice into another DKM project (ch. 28) |
| **Static viewer** | a single HTML file | sending it to someone without DKM (ch. 27) |
| **Project to the clipboard** | JSON | a quick move between tabs (Ctrl+Shift+S) |

Beyond picking a scope, the **📤 Export data** dialog has two further refinements, which
apply to every target except moving the whole project to the clipboard:

- **⊘ Exclude individual entities** unfolds a list of everything currently in scope, and you
  untick individual items. Useful when the scope is almost right and you want two or three
  things out of it. The dialog remembers the exclusions across a change of scope.
- **Include aspects** — an unticked aspect stays out of the export entirely: neither its
  values on entities nor its definition in the model. With an "Internal notes" aspect you
  export the data without it and the file keeps no trace of it.

The package has its own scope extension (to neighbours or the whole connected component,
ch. 28.1), and individual entities can be excluded there too — on top of that extended list.

Three things stay outside that dialog, deliberately:

| What | Where | Why separate |
|---|---|---|
| The whole project as `.dkmdata` | header **Save** (Ctrl+S) | it is not an export but saving the project — it has GitHub, the sound feedback and its own key (ch. 21) |
| A single entity | entity detail → **🖨 Export / print** | it is about one particular thing you have open (ch. 24) |
| Context for a language model | **🤖 Ask AI** → Show what will be sent | not a file, but the brief for the AI (ch. 35.3) |

### 23.3 Model exports

All seven live in one place — **Settings → Model** (ch. 36), individually or in a ZIP:

| File | Format | What for |
|---|---|---|
| `model.md` | Markdown | readable documentation of the model for people |
| `openapi.yaml` | OpenAPI 3.1 | the brief for a REST API over the model |
| `schema.json` | JSON Schema 2020-12 | data validation, code generation |
| `schema.xsd` | XSD (XML Schema) | XML validation, integration, class generation |
| `model.sql` | SQL DDL (PostgreSQL) | creating the database |
| `model.ttl` | RDFS/OWL + SKOS | an ontology, linked data |
| `shapes.ttl` | SHACL | validating RDF data against the model |
| `model.xmi` | XMI 2.1 (UML) | Enterprise Architect and other CASE tools |

### 23.4 Which export to pick

- **I just want to keep it or move it to another computer** → **Save** (ch. 21)
- **I want to send it to someone to read** → Static viewer (ch. 27) or Document (ch. 24)
- **I want to do arithmetic in Excel** → Table (ch. 25.1)
- **I want to measure the graph, not draw it** → Diagram or graph → GraphML (ch. 25.3)
- **A colleague or a script needs to process it** → Data with a schema (ch. 26)
- **I want to hand a part over to another DKM project** → Package (ch. 28)
- **I want to hand over how it is built, not what is in it** → the model export (ch. 36)

### 23.5 What never leaves

- **Entity objects** (attachments) never go into document exports — not into MD, DOCX, PDF,
  nor the formatted text on the clipboard (ch. 24.3)
- The **GitHub token**, the **AI API key** and **your name for comments** live in the browser
  only. They are not in the project data, and therefore not in any export.
- Only **what you tick** goes to the AI — never the whole project (ch. 35.3)

---

## 24. Export and print entities

In entity detail the **🖨 Export / print** button. Opens a dialog with section checkboxes:

### 24.1 Optional sections

- **Header** — name, type icon, type badge, aspect badges, status badges
- **Type attributes** — individual (checkbox), All / None buttons
- **Aspect attributes** — separate section per aspect
- **Custom attributes**
- **Relations** — outgoing, linked from
- **Metadata** — Entity type, Created, Updated, ID

### 24.2 Output formats

- **📋 Copy MD** — raw Markdown to clipboard
- **✨ Copy formatted** — via ClipboardItem with HTML + plain text. Pasting into Word, Outlook, Gmail keeps headings, bold, italic, lists.
- **📥 Download MD** — file `EntityName.md`
- **📄 Download DOCX** — a Word file. DKM builds it itself, nothing is downloaded, so the export works offline too. Calibri, heading hierarchy, bullets for relations, CriticMarkup as Word revisions.
- **🖨 Print / PDF** — new window with rendered HTML + auto `window.print()`. Through browser you print on paper or save as PDF.

### 24.3 Rules

- Empty values are skipped (even if attribute is checked)
- Archived relation targets are excluded
- Entity's objects are **never exported** (not to MD, DOCX, PDF, formatted copy)
- Textarea attributes render as Markdown in HTML / DOCX (bold, lists, CriticMarkup)

### 24.4 Exporting a selection of entities into one document

The same for several entities at once: in the list switch to **selection mode** (V key), tick
the entities and choose the bulk action **🖨 Export / print selection**. The result is **one
document** in the same formats as for a single entity.

**The order is the one the entities have in the list** — not the order you clicked them. So it
follows the active sorting and filters. If the selection still holds an entity that is not in
the current list (you switched tabs meanwhile), it is appended at the end. The dialog prints
the order so you see it up front.

#### Document title

An optional field at the top, prefilled with the project name. When filled in it becomes the
main heading and **entity headings shift one level down** — the document then has a single H1
with entities as H2, which is what Word and its navigation pane expect. An empty title means
entities follow each other directly, each as an H1, separated by a rule (a page break in DOCX).

#### Choosing content for a mixed selection

When the selection spans several types, the dialog offers **a section for every type and every
aspect that actually occurs in it**. Each attribute also shows **on how many entities it is
filled at all** (`filled on 2 of 5`), so you can see what is worth including instead of
guessing. A tick applies to all entities of that type or aspect; an entity that does not have
the attribute simply skips it.

The rest (custom attributes, relations, backlinks, comments, metadata) is shared and each item
shows a total across the whole selection, so you know how much it adds.

The other rules from 23.3 apply unchanged — empty values are skipped, objects are never exported.

---

## 25. Export to a table, PlantUML and GraphML

### 25.1 Table export — XLSX, CSV, TSV

The **Export** button in the header opens a dialog where you pick the scope, the format and
the **columns** — so you get exactly what you need instead of everything.

**Scope** — see 23: the selection, the open entity when you come from its detail, the
currently displayed list, or the whole project without the archive.

**Format**

- **XLSX** — a workbook for Excel. Frozen header, auto filter, computed column widths,
  multi-line text wraps. Optionally **a sheet per entity type** — a type's sheet then keeps
  only the columns that belong to it.
- **CSV** — pick the separator: **semicolon** (suits a localized Excel) or **comma**
  (standard CSV). Plus a **decimal comma** option, again for Excel's sake.
- **TSV** — tab separated. Numbers always use a dot.

CSV and TSV start with a BOM, without which Excel mangles the diacritics. DKM's **TSV import**
skips it, so the round trip *export → edit in Excel → import back* holds; keep the **ID**
column in the output to match existing entities (see 25.2).

**Columns** are grouped — the basics, each type separately, each aspect separately, custom
attributes, and relations with metadata. Every column shows **how many entities have it
filled in**, and the **Only columns with data** checkbox hides the empty ones. All / None
apply to whatever is currently visible.

Custom attributes are grouped **by name** — three entities with a "Note" custom attribute
give you one column, not three.

### 25.2 TSV / CSV import

The **Import TSV** button in the header. Takes a file (Excel → *Save as* TSV/CSV) or rows
pasted from the clipboard. The delimiter is detected automatically — TAB, semicolon or comma,
whichever is most frequent in the first line.

**The first row is the header** and decides everything. Columns the import does not understand
are silently ignored.

#### System columns

| Column | What it does | Also accepts |
|---|---|---|
| **Název** | required, entity name | Name, Title, Jméno, Titul |
| **Typ** | entity type name | Type, Kategorie, Category |
| **Aspekty** | aspect names, several separated by `;` or `,` | Aspects, Aspekt, Aspect |
| **ID** | internal ID for matching an existing entity | Identifikátor |
| **Archiv** | `1` / `true` / `ano` / `yes` / `x` → archive | Archive, Archived, Archivováno |
| **Inbox** | the same for putting it in the Inbox | Schránka |

Without a **Typ** column the entity ends up in the Inbox with no type.

#### Attribute columns

The column name is the attribute name. To make clear which type or aspect the attribute
belongs to, write it as **`Type name / Attribute name`** or **`Aspect name / Attribute name`**.

Example — entities of type *Vlastnost* with the *Data* aspect and its *Concept type* and
*Data type* fields:

```
Název	Typ	Aspekty	Data / Concept type	Data / Data type
Rodné číslo	Vlastnost	Data	Identifikátor	string
Datum narození	Vlastnost	Data	Atribut	date
```

The prefix is optional but **worth writing**. Without it the import looks for the attribute on
the entity's type first and only then on its aspects — if the *Vlastnost* type also has a
*Concept type* attribute, an unprefixed value lands on the type, not the aspect. With
`Data / Concept type` it is unambiguous. The split happens at the **first** slash, so an
attribute with a slash in its name cannot be written this way.

> **Watch out for a missing Aspekty column.** Leave it out and the values are still stored in
> the data, but the entity does not get the aspect — and since the entity detail only shows
> attributes of its type and its **assigned** aspects, you will see nothing. The data would sit
> there unseen. So the `Aspekty` column with the aspect name on every row is not optional.

#### Values by attribute type

- **yes/no** — `1`, `true`, `ano`, `yes`, `x` = yes; `0`, `false`, `ne`, `no` = no
- **number** — decimal comma or dot; anything unparseable is skipped
- **relation** — target entity names separated by `;`; unmatched ones are skipped, a
  single-value relation takes the first match
- **everything else** — text as it is; an empty cell is skipped (it does not clear an existing value)

#### Creates or updates?

The entity is looked up by the **ID** column, and when that is missing, by the **Typ + Název**
pair. On a match the row **updates** it — importing the same table twice does not create
duplicates. Aspects are only **added** on update, never removed.

#### Round trip through the XLSX export

The XLSX export produces a header in exactly this shape (`ID`, `Název`, `Typ`, `Inbox`,
`Archiv`, `Aspekty`, then `Type / Attribute` and `Aspect / Attribute`), so you can export,
edit in Excel and import back. Two exceptions: the `Vazby`, `Vytvořeno` and `Upraveno` columns
are ignored on import, and **custom attributes** (marked `* Name` in the export) are not
recreated — the asterisk is stripped and the name is looked up among type and aspect
attributes; when it is not there, the column is dropped.

### 25.3 Diagram and graph — PlantUML and GraphML

In the **📤 Export data** dialog (ch. 23) pick the **Diagram or graph** target. A dialog follows with:

- **Scope**: current list, selection, all, type, aspect
- **Style**: Class diagram (classes with attributes), Component, Use case
- **Options**: include attributes as class fields, include attribute-based relations (dashed lines), include external targets outside scope (gray)
- **Format**: PlantUML, or **GraphML**
- **Live preview** of the generated code

Output:

- **📋 Copy** — to clipboard
- **📥 Download** — `.puml` for PlantUML, or `.graphml`

**PlantUML** is the source of a picture: escaped names, E0/E1/… aliases, stereotypes by type
(`<<Person>>`), attribute-based relations dashed. Good for documenting the model and the
architecture.

**GraphML** is the same graph, but for processing rather than for a picture. Open it in
**Gephi, yEd or Cytoscape** and you can compute on it — centrality, communities, clusters,
paths. Entities are nodes (carrying the name, type, aspects and optionally attribute values),
relations are edges (carrying the name, the inverse name and whether they come from a
relation or from an attribute). The diagram style selector hides for GraphML — it belongs to
PlantUML.

---

## 26. Data JSON export with a schema

### 26.1 What it's for

`.dkmdata` is the tool's own serialization — everything rests on internal IDs so it can be
loaded back. **Data JSON** is the opposite: a projection of the data outwards, with keys
derived from type and attribute names, meant for importing into dynamic JSON databases and
for handing to anyone who knows nothing about DKM.

An entity of type *Subjekt* ends up in the `subjekt` collection, the attribute *Příjmení* as
the key `prijmeni`. A **JSON Schema** is generated alongside, describing **exactly this
output** — not the whole project model. Everything downloads as a single ZIP.

The export is **one-way**. For moving data between DKM projects use packages (ch. 28).

### 26.2 Where to start it

- the **`{ }`** button in the list toolbar (exports the currently displayed list by filters)
In the **📤 Export data** dialog (ch. 23) pick the **Data with a schema** target. The scope was
already chosen there, so the wizard does not ask again and starts with the type selection.

### 26.3 The wizard

**Step 1 — Scope.** Selected entities / currently displayed list / whole project (without
archive), plus type checkboxes. Untyped entities (Inbox) can be added into the `_bez_typu`
collection. A saved **export profile** can be loaded at the top.

**Step 2 — Keys.** Key style (`snake_case` by default, or `camelCase`) and the language of
system fields (Czech `nazev`/`typ`/`vazby`, or English `name`/`type`/`relations`). Below that
a table of all derived keys for manual overriding. The **Save keys into the model** checkbox
writes them permanently (see 26.7).

**Step 3 — Content.** Relation mode, custom attributes, comments, objects, unfilled
attributes, empty values as `null`, one file per collection.

**Step 4 — Preview and check.** Summary, validation result, warnings and a preview of both
`data.json` and `schema.json`. The ZIP is downloaded — or a profile saved — from here.

### 26.4 Output shape

```json
{
  "$schema": "schema.json",
  "_meta": { "projekt": "Registr", "exportovano": "…", "verze_formatu": 1, "pocty": {...} },
  "subjekt": [
    {
      "id": "e_k3n1",
      "typ": "subjekt",
      "nazev": "Jan Novák",
      "prijmeni": "Novák",
      "datum_narozeni": "1980-04-12",
      "aspekty": ["gdpr"],
      "souhlas_platny_do": "2027-01-01",
      "vazby": { "pouziva": [ {"ref": "e_a91", "typ": "dokument", "nazev": "Smlouva"} ] }
    }
  ]
}
```

**Aspect** attributes are flattened into the object next to the type's own attributes; the
entity also carries an `aspekty` list. When an aspect attribute's key meets a type
attribute's key, it gets the aspect slug as a prefix (`gdpr_prijmeni`).

### 26.5 Relations

| Mode | Output |
|---|---|
| **Reference** (default) | `{"ref": "…", "typ": "…", "nazev": "…"}` — readable without a join |
| ID only | `["e_a91"]` |
| Embedded object | the whole target object, depth 1, without its own relations |

Attributes of type "relation" have the same shape as the `vazby` section. Relations to a
non-existent entity are skipped and reported. Backlinks are not exported — they are derived.

### 26.6 The schema — only what was used

The governing rule: **the schema must validate the data it ships with.** Therefore:

- only a type with at least one entity in the export enters the schema
- a property only when at least one entity has it filled (switchable)
- `required` only for an attribute filled on **every** exported entity of that type;
  otherwise it is optional and the wizard says so among the warnings
- `enum` for select attributes = the list's values; a value in the data outside the list
  extends the enum and is reported
- a tags attribute is an array of strings with `uniqueItems` and an `enum` from its tag set;
  a tag outside the set extends the enum and is reported the same way as for select
- `format: date` / `format: uri` is added only when **all** values match

Before packaging, a built-in validator runs and its result also goes into `README.md`.

### 26.7 Key stability

The key is derived from the name, so renaming an attribute would change the key and break a
downstream import. That is why every type, aspect, attribute and relation type has an
optional **JSON key** field (in settings, on the item itself). Empty = derived from the name.
Filled in = fixed. The checkbox in step 2 of the wizard fills these fields with the currently
derived keys.

### 26.8 XML and XSD

In the wizard's options step you pick the **file format**: JSON + JSON Schema, XML + XSD, or
both. XML is not a second serializer — it is built **from the same, already validated JSON
object** and walked according to the same schema the XSD is generated from, so the element
order and the constraints match by construction.

The conversion rules are simple:

| JSON | XML |
|---|---|
| object | an element with child elements |
| array | the element with that name repeats |
| scalar | text content |
| `null` (with "include empty") | `xsi:nil="true"` |
| custom attributes | always `<polozka klic="…">` — their names are written by you and need not be valid XML names |

The XSD is exact, not permissive: it rejects an unknown element, a missing `id`, a value
outside a code list, a number written as text, a malformed date, a foreign value for the
fixed `typ` and even a wrong element order.

The `schema.json` stays in the package either way — it describes the same content and is
handy for a cross-check.

### 26.9 ZIP contents

| File | What's inside |
|---|---|
| `data.json` | data, collections by type (or `data/<type>.json` with one file per collection) |
| `schema.json` | JSON Schema draft 2020-12 for this output |
| `data.xml` + `schema.xsd` | with the XML format — the same data and an XSD that validates it |
| `mapovani.json` | internal ID to key mapping — for debugging and downstream tools |
| `README.md` | human description: what's inside, mapping table, warnings, validation result |

### 26.10 Export profiles

The wizard's settings can be saved as a named **profile** (kept in the project data), so a
repeated export into the same database always comes out the same.

---

## 27. Static viewer

DKM can generate a **static HTML viewer** of project data — a single file you open for read-only access to all entities.

### 27.1 Generating

In the **📤 Export data** dialog (ch. 23) pick the **Static viewer** target. A file with the
embedded data is downloaded. **It takes the chosen scope** — so it need not be the whole
project. In a cut the model is narrowed to what the selected entities actually need,
relations pointing outside are dropped (as with a package, ch. 28.1), and tabs whose target is
not in the cut disappear. The viewer has **the same tab bar as the application** (29.8) — it
only leaves out the kinds it cannot do: saved views, comments and creating a new entity. **Settings → Project** has a shortcut to
the whole project.

The viewer has **the same detail layout as the application**: attributes on the left, the
**Relations** (with Linked from), **🌳 Structural view** and **🏷 Tags** tabs on the right, and
a line with the ID and timestamps at the bottom. Relations are counted the same way as in the
application — classic ones, through a relation attribute and through a wiki link — and
`[[Name]]` wiki links in texts are clickable. Tags are chips linking to the other entities with
the same label, and the list toolbar has a **Tag** dropdown too. The viewer does not show
comments.

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

### 27.2 Default entity

In the generation dialog you can select the entity on which the viewer opens.

### 27.3 Language and theme in the viewer

The generated viewer has the same **⚙ Customize** menu in the top right as the app, with the
same languages (Čeština / English) and themes (Light / Dark / Paper / Matrix).

The choice is stored in the browser of whoever opened the file (keys `dkm-viewer-lang` and
`dkm-viewer-theme`) — it is **not written into the generated file**. Every recipient sets
their own without changing what you sent out, and it sticks the next time they open the same
file. The language you generate the viewer in is only the default for someone who has not
chosen yet; with no stored choice the theme first follows the system setting.

---

## 28. Moving parts between projects (packages)

### 28.1 Package format

`.dkmpkg` is a JSON containing **a selection of entities + their data model** (only types, aspects, lists and relation types the selected entities need). Enables moving a slice of one project to another without extra.

### 28.2 Package export

In bulk mode select entities, action **📦 Export package**. Wizard:

1. **Scope**: only selected / selected + neighbors (via relations) / whole component (graph neighborhood)
2. **Model**: types, aspects, lists, tag sets and relations to transfer
3. **Preview**: overview of what will be in the package

Downloads a `.dkmpkg`.

### 28.3 Package import

**Settings → Project → Move between projects → Import package**, or straight from the command
palette (**Ctrl+Shift+P** → *Import package*). Upload `.dkmpkg`. Wizard:

- Content summary
- Conflict check (existing types, attributes)
- Automap: attribute matching by name + type; value lists and tag sets are matched by name and merged (new values are added, existing ones stay)
- Change preview
- Backup before import (checkbox on by default — downloads current project as `.dkmdata` before import)

**The import creates no tabs.** The bar is your arrangement (29.8) and somebody else's package
has no business touching it — you add new types and aspects to it in Settings → Tabs, if and
how you want.

#### When the entity is already in the project

Entities carry **their own IDs** in the package, so re-importing the same data recognises them.
The *Conflicts* step lists every such entity and **what differs** from what the project already
has — or that it is unchanged.

The action is pre-filled accordingly, and it **depends on the wizard mode**:

| Situation | Easy | Detailed |
|---|---|---|
| The project has the same | Skip | Skip |
| Something differs | **Overwrite** — the package wins | **Fill into the existing one** |

Easy never shows the conflicts step, so it does what people expect there: **the package data
wins**. The detailed mode lists them and lets you decide, which is why its default is the careful
one that does not overwrite your edits. Entities that are completely identical are skipped in
both modes — overwriting them with the same values would only churn the update date.

The available actions:

- **⊕ Fill into the existing one** — the entity stays as it is. Only **what is missing** gets
  filled in: empty attributes, missing aspects, relations that are not there yet. Your edits stay.
- **♻ Overwrite** — the package content replaces what the project has
- **❌ Skip** — the entity is not imported at all
- **🆕 Create a new one** — a copy with a new ID. Use it only when you really want two records.

There is also **Set all at once** at the top, so a large package does not mean clicking one by one.

#### A package from a foreign project

When the package does not come from this project, its entities have different IDs and matching by
ID finds nothing — everything would be imported as new. For that case the detailed mode has the
**Also match by name when the IDs differ** checkbox. It matches an entity with the same name
(ignoring case and diacritics) and says so for each such pair. **Ambiguous names are skipped** —
when the project has two entities called "Jan", the wizard has no way to tell which one is meant,
so it matches neither. Easy mode never matches by name.

Clicking Import performs a two-pass:

1. Entities are created, filled or overwritten according to the chosen action
2. Relations and relation attributes are remapped to the target IDs; when filling, **the same
   relation is not created twice**

---

## 29. Settings

### 29.1 Project

- Name, description
- **Load project from a URL** — loads a project from any address and builds an `?open=…` link (see 21.6)
- GitHub path
- Static viewer (generation)
- Package transfer (import)
- Project storage (info about session storage + Start empty project)

### 29.2 Types

List of types, click to open editor with attributes, icon, name and an optional
**JSON key** field (see ch. 26.7). Every attribute has the same field.

Reorder types with the **↑↓** buttons on each row, or grab a row with the mouse and
drag it elsewhere. Both do the same thing — dragging is there for those who find the
mouse quicker.

### 29.3 Aspects

Analogous for aspects, including the **JSON key** field, and including reordering with
the **↑↓** buttons or by dragging.

### 29.4 Relations

Relation type definitions: name, inverse name, scope, allowed source / target types
and **JSON key**.

### 29.5 Lists

Value lists with their enumerations. Used by "select" attributes — an attribute
references a list in its own editor.

### 29.6 Tags

Tag sets — named supplies of labels for attributes of type **tags** (see 7.5).
Each set has a name, its list of tags (one per line) and an overview of which tags are
actually used and on how many entities; every such chip is a link to the filtered list, so
before you drop a tag from the set you can see what you would lose. The **↑↓** buttons change
the order of the sets. The order of the lines inside a set does not matter — tags are offered
and displayed **alphabetically** everywhere, because new ones also arrive through quick add
from inside an entity.

A tag deleted from a set is not deleted from the entities that carry it — it stays there
marked `⚠`.

### 29.7 Saved views

Manage all saved views: rename, change icon, toggle pin, overwrite with current filter, delete.
The **↑↓** buttons change their order, and with it the order of their tabs at the top.

### 29.8 Tabs

The bar at the top is one list you compose yourself. **Inbox, All and Archive are no
exception** — they are ordinary tabs you can reorder, rename or throw away. What makes it safe
to open the bar up like this is the command palette (Ctrl+Shift+P, F1): it reaches every type, aspect,
view and entity regardless of the tabs, so nobody can lock themselves out.

What a tab can show:

| Kind | What opens |
|---|---|
| **Inbox**, **All**, **Archive** | today's list screens |
| **Recently changed** | entities sorted by change date and cut to a chosen count (30 by default), sectioned by day. The count is set on the tab — it is a property of the display, not of the project, so two tabs can each have their own. That it is a slice is stated by a "Showing 30 of 412" line. |
| **Entity types** | entities of the ticked types — **several at once if you like**; then you name the tab "Objects and subjects", say. The same type may appear in other tabs too. |
| **Aspect** | entities carrying that aspect |
| **Tag** | entities carrying that tag (7.5) |
| **Saved view** | applies the saved filter and display mode |
| **Entity** | the detail of one specific entity — handy as a landing page or overview |
| **Comments** | the All comments screen |
| **New entity** | creates a new entity of the chosen type straight away |
| **Separator** | just a vertical line that splits the bar into groups |

For every tab you can set:

- An **icon** and a **name on the bar** — both optional; empty means derived from the target. A
  filled-in name is used as the **heading above the list** as well, so "Tasks" shows up there too.
- **Show count** — the number next to the name. For a saved view it is off by default: computing
  it means running the whole filter, and with several views over a large project you feel it.
- **Hide when empty** — this is how Archive behaves in a new project.
- **Open on this one** — the app starts on this tab. With none marked it starts on the first.

A row expands on click for editing. Order is changed by the **↑↓** buttons or by dragging —
both here and in the bar itself, now **across all kinds** (it used to be within a group only).
Dragging does not work on touch devices; the **↑↓** buttons always do.

The **＋ Tabs for all types** and **＋ For all aspects** buttons create the missing tabs in bulk —
handy right after you set up the model.

When a tab's target disappears (someone deleted an entity in another project and the file came
from elsewhere), the tab is struck through and marked `⚠`; clicking it offers to delete it.
Deleting a type, aspect, view, tag set or entity **in the app itself** cleans up the tabs by
itself.

**Older projects** convert themselves: the bar is composed exactly as it looked — Inbox, All,
the enabled types, the enabled aspects, pinned views and Archive with "hide when empty".
Nothing is lost and nothing asks.

### 29.9 GitHub

Personal access token for GitHub API. Stored in the browser's localStorage (per origin).

### 29.10 AI

Provider, API key and model for the AI assistant — see ch. 35.2.

### 29.11 Model

The data model overview and its export into standard formats — see ch. 36.

### 29.12 Duplicates

Finds entities that share a **name**, shows them side by side and offers a resolution.

**Name match** — either loose (the default: case, diacritics and extra spaces do not matter, so
"Praha", "praha" and "Praha " are the same thing) or exact, character by character. Each group
says which case it is.

**Checkboxes** — search within one type only, include the archive, show rows that are empty
for all of them.

**The comparison** is a table: rows are fields, columns are the individual entities. It lists
the name, type, aspects, every attribute at least one of them has filled in, custom attributes,
relations, the number of backlinks and comments, the update date and the ID. **Rows where the
entities differ are highlighted** — so you see at a glance what is different.

**Resolving** — each entity has *Open* and *Rename*; below the table there is **Merge entities**.
Merging goes through the same path as the bulk operation (ch. 13.1): you pick which entity stays
and what to do with differing values, and relations pointing at the removed entities are
redirected. After a merge or a rename you stay on the Duplicates tab and the list is recomputed.

### 29.13 General

- **Language** (Čeština / English)
- **Theme** — Light / Dark / Paper / Matrix, same as in the ⚙ Customize menu
- **Your name for comments** — used as author of new comments. Stored **in this browser only** (key `dkm-username`, like the GitHub token), not in the project data — so several people can work on the same project and each signs their own comments. An older project that carried the name in its data adopts it into the browser once on load (if none is set there yet) and drops it from the data.
- **Suggest wiki links when saving an entity** — after saving it offers names of other entities found in multi-line attributes for conversion into a `[[link]]` (see 15.4). Stored in this browser only (key `dkm-wiki-suggest`).
- **Sound feedback for GitHub saves** — a short rising tone after a successful save, a darker falling one after a failure. The tones are generated in the browser via the Web Audio API, nothing is downloaded, so it works offline too. Next to the checkbox are buttons to hear both. Stored in this browser only (key `dkm-sound`).
- **Autosave** — automatic saving to sessionStorage (per tab)
- **Debug** — enables a bottom panel with debug logs

### 29.14 Statistics

Counts overview: entities, types, attributes, aspects, relations, comments.

### 29.15 Help

Links to online documentation and repository.

---

## 30. Keyboard shortcuts

### Global

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save — to GitHub when both path and token are set, otherwise to a file (same as Alt+S) |
| Ctrl+F | Open advanced filters |
| Ctrl+Shift+F | Close advanced filters and clear |
| Ctrl+Shift+P | Command palette |
| F1 | Command palette |
| Shift+F1 | Help |
| Ctrl+T | New panel |
| Ctrl+W | Close active panel |
| Ctrl+Shift+O | Load project from clipboard |
| Ctrl+Shift+S | Copy project to clipboard |
| Ctrl+K | Focus search |
| Esc | Close dialog / exit mode |

### Navigation

| Shortcut | Action |
|----------|--------|
| i | Go to Inbox |
| a | Go to All |
| n | New entity — of that type when on a single-type tab, otherwise with a picker |
| q | Quick add to Inbox |
| s | Save (file / GitHub) |

### Alt shortcuts

They work **on every screen** — they used to hang off buttons (`accesskey`), so they only
worked where that button happened to be. In Firefox it is **Alt+Shift+**, on macOS **Ctrl+Alt+**.

A shortcut is recognised by the **physical key**, not by the character produced. With Alt held
the keyboard layout changes what is sent: on a Czech layout Alt+U is "¨" and Alt+2 is "ě", and
macOS composes characters. So Alt+U commits the edit on any layout.

The same goes for the Ctrl shortcuts: they accept the character and the physical key, so Ctrl+S
saves even with Caps Lock on and on layouts where that key types a different letter.

| Key | Action |
|-----|--------|
| Alt+L | Load project from file |
| Alt+S | Save |
| Alt+N | New entity — of that type when on a single-type tab |
| Alt+A | The All list (even with no All tab on the bar) |
| Alt+B | Back |
| Alt+R | Add relation (in entity detail) |
| Alt+U | Commit edit (in editor) |
| Alt+1 … Alt+9 | Jump to the 1st–9th tab on the bar |

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
| r | Add relation (opens the dialog) |
| c | New comment — switches to the 💬 Comments tab and focuses the box |

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

## 31. Accessibility

DKM is designed to work with screen readers.

- **Semantic headings**: page's main heading (H1) is always the content name (entity, view, settings section), never the application
- **No treeview** (`role=tree/treeitem`) — hierarchies are nested `<ul>/<li>`
- **No position: sticky / fixed** on large areas
- **ARIA labels** on non-obvious interactive elements
- **Keyboard navigation** (see chapter 29)
- **Screen reader announcements** minimized — only brief action confirmations (Saved, Added), not re-render of fields

### 31.1 The relation field

A **relation** attribute is not one field but a group: the type filter, the text filter, the
list of choices and the confirm button. So that you always know which attribute you are filling
in while moving through the form, **every control in that group carries the attribute name** —
you hear "Uses systems — type filter", "Uses systems — choices" and so on, not just "type
filter". The group itself is a `role="group"` named after the attribute.

The same is handled for **yes/no** (a `role="radiogroup"` named after the attribute) and for a
**select attribute with no list assigned** — that one is now a disabled field with an
explanation instead of plain text, so it has a name and a state. An attribute with no name of
its own is announced as *Unnamed attribute* rather than nothing.

### 31.2 Where focus goes after a removal

When you remove a selected entity or a relation with the ×, the button you are standing on
disappears at that moment. Focus therefore **moves to the next × in the row**, and when none is
left, to the list of choices (for a relation, to the Add relation button). It never falls back
to the top of the page.

### 31.3 Command palette

Screen reader-compatible: ARIA combobox, listbox, aria-activedescendant, aria-selected on active item.

### 31.4 Kanban

Cards aren't drag-and-drop (inaccessible to screen readers). Instead a **Move to dropdown** per card.

---

## 32. Tips and tricks

### 32.1 Quick workflow

1. Open the app daily with `?id={ghPath}` (bookmark) — project auto-loads from GitHub
2. Ctrl+Shift+P (or F1) → type a few letters of the entity name → Enter — you're in the detail
3. Key `e` — edit
4. Key `u` — save edit
5. Ctrl+S → push to GitHub

### 32.2 Using panels

- Panel 1 = project list (context)
- Panel 2 = detail of in-progress entity
- Panel 3 = detail of entity being compared

Ctrl+T for new, click on tab to switch.

### 32.3 Wiki-links instead of formal relations

If you don't want to bother creating a formal relation, just write `[[Entity name]]` in a textarea. In the Linked from section, the link automatically appears.

### 32.4 Kanban for approval workflow

Create an aspect "Approval" with attribute "Status" (select: New / In progress / Approved / Rejected). Assign the aspect to entities. Switch list to Kanban by "Status". Move cards via dropdown = change status. Save as pinned view 🔥 Approvals and have it in the toolbar with one click.

### 32.5 PlantUML model documentation

For external data model documentation:

1. Select entities (or use an aspect)
2. Ctrl+Shift+P → "PlantUML export"
3. Class diagram + include attributes
4. Download .puml
5. Paste into PlantUML editor → image

### 32.6 Diff before save

Before pressing Ctrl+S:

1. Click ● Unsaved changes indicator
2. Review the diff
3. Verify the changes are what you intended

### 32.7 Duplicate merge

When you find two entities that are actually the same thing:

1. Key V — bulk mode
2. Check both
3. Action ⇢ Merge entities
4. Pick target, conflict strategy
5. Merge — all relations and attributes redirect automatically

### 32.8 Quick project switching

- In main window open project A
- **Ctrl+Shift+S** — copy to clipboard
- New tab → **Ctrl+Shift+O** → project A opens in the second tab too
- In second tab load project B from file

You have both projects at once, each in a different tab.

---

## 33. Common problems

### 33.1 "I don't see my entities"

- Check toolbar filters — you may have an active filter hiding everything. Click Clear filters.
- Check the Archive tab — they may be archived
- Check advanced filters (⚙ Advanced filters) — you may have an invalid rule

### 33.2 "I closed the tab and the project is gone"

The project lives only in sessionStorage. For persistent storage:

- Ctrl+S — save to file
- Set a GitHub path and Ctrl+S — save to GitHub
- Bookmark the URL `?id={base64ghPath}` for fast autoload

### 33.3 "Browser did not allow clipboard access"

- Try again, focus may have been the issue
- Or use the dialog fallback (DKM shows it automatically)

### 33.4 "PlantUML export doesn't look good"

- Check scope — you may have too many entities
- Try a different style (Component / Use case are simpler)
- Turn off attributes when there are many

### 33.5 "Diff is empty but I have unsaved changes"

- Baseline is set only on save or load. If you haven't saved yet, diff has nothing to compare.
- Save → from that moment changes are tracked against that point.

### 33.6 "Standalone window won't open"

- Browser is blocking popups — allow popups for DKM
- Check the browser notification panel (usually right of the address bar)

### 33.7 "I have several projects open at once"

That is fine and nothing gets mixed up — every DKM window is its own workspace (20.4). Only
standalone windows sync with their main window. To get changes from one window into another,
save and load — through a file, the clipboard or GitHub.

---

## 34. Technical background

### 34.1 Data structure

The project is one JSON document. Here is its outline; the normative description of
both formats, machine-readable schemas included, is in chapter 37:

```
{
  version, projectName, projectDescription, ghPath,
  settings: { tabs: [{ id, kind, name?, icon?, typeIds?, aspectId?, tagSetId?, tag?, viewId?, entityId?, typeId?, showCount?, hideEmpty?, isDefault? }] },
  entityTypes: [{ id, name, icon, jsonKey?, attributes: [{ id, name, type, required, showInList, listId?, jsonKey?, ... }] }],
  aspects: [{ id, name, jsonKey?, attributes: [...] }],
  relationTypes: [{ id, name, inverseName, scope, fromTypes, toTypes, jsonKey? }],
  selectLists: [{ id, name, values }],
  tagSets: [{ id, name, tags }],
  savedViews: [{ id, name, icon, pinned, filter, sort, tab, displayMode, ... }],
  jsonExports: [{ id, name, cfg }],
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

### 34.2 Browser storage

- **sessionStorage['dkm-session-data']** — current project, per tab. Refresh survives, tab close doesn't.
- **BroadcastChannel `dkm-sync-<workspace>`** — live sync within one workspace. The channel
  is named after the workspace on purpose: `BroadcastChannel` reaches the whole origin, so on
  one shared channel two projects open in two windows would overwrite each other.
- **sessionStorage `dkm-workspace`** — the workspace identity. It lives in the browser tab
  (survives F5, not a new window); a standalone window gets it in the address (`?ws=`).
- **localStorage** — preferences only, never project data:

| Key | What it holds |
|---|---|
| `dkm-lang` | interface language |
| `dkm-theme` | visual theme |
| `dkm-username` | comment author name |
| `dkm-autosave`, `dkm-debug`, `dkm-sound`, `dkm-wiki-suggest` | switches in Settings → General |
| `dkm-ai-provider`, `dkm-ai-key`, `dkm-ai-model` | AI connection (see ch. 35) |
| `dkm-github-token` | GitHub PAT (per origin) |
| `dkm-handoff-…` | short-lived data handoff to a standalone window; an unconsumed one is cleaned up after 10 minutes |
| `dkm-viewer-lang`, `dkm-viewer-theme` | choices in a generated static viewer |

### 34.3 GitHub API

DKM uses Contents API for reading + Git Data API (blobs) for writing large files. The token is stored in `localStorage['dkm-github-token']` (per origin).

### 34.4 Rendering

Vanilla JavaScript, no framework. Templates as direct DOM manipulation. Full re-render on every state change (fast even for thousands of entities).

### 34.5 Testing

There is no automated test suite in the repository — DKM is a single HTML file with no build
step. Changes are verified by walking the app through the checklist in `dkm/CLAUDE.md`: types,
aspects and attributes of every kind → entities, relations, comments, objects → rule filter and
saved view → kanban and timeline → bulk operations including merge → package export and its
import through the wizard → MD, DOCX, XLSX, PlantUML and data JSON export → static viewer →
GitHub → two tabs at once → standalone window → CS/EN switch and all themes.

---

## 35. AI assistant

### 35.1 What it's for

DKM can send the content of an entity (or a whole selection) to a language model and let you
talk about it — a summary, finding contradictions, proposing a structure, whatever. The result
is Markdown you can copy or turn straight into an entity in the Inbox.

### 35.2 Settings

**Settings → AI**:

- **Provider** — Google Gemini for now
- **API key** — stored **in this browser only** (key `dkm-ai-key`), just like the GitHub
  token. It does not travel in the project data and is never printed anywhere, not even in
  the debug log.
- **Model** — the model name. The **⟳ Load models** button lists the models your key can
  actually use and lets you pick one, so you don't have to guess the current naming.
- **Test connection** — sends one short message and shows what came back

### 35.3 What leaves the browser

Only **what you tick** and the text of your messages goes to the provider. The whole project
or the GitHub token is never sent. The **Show what will be sent** button shows you the payload
exactly as it will go out.

### 35.4 Asking about one entity

The **🤖 Ask AI** button in the entity detail. In the dialog:

- a collapsed **What is sent as context** section — the same checkboxes as the export, i.e.
  type attributes, aspect attributes, custom attributes, relations, backlinks and comments;
  next to it the context size in characters
- an instruction field at the bottom, **Ctrl+Enter sends**
- the conversation above it — your messages and the model's answers rendered as Markdown

**The ticks apply to every message sent.** Change them mid-conversation and the next message
goes with the new context — handy for adding something you did not send at first.

### 35.5 Asking about a selection

In the list switch to selection mode (V key) and choose the bulk action **🤖 Ask AI**. The
context is built from all selected entities in the order they appear in the list, and the
checkbox sections are offered per type and aspect occurring in the selection — just like the
selection export (ch. 24.4).

### 35.6 What to do with the answer

Under every answer there are two buttons:

- **📋 Copy MD** — the answer to the clipboard as Markdown
- **📥 Create in Inbox** — creates a new entity in the Inbox; the name is suggested from the
  answer's first heading and the text is stored as a custom attribute

The conversation **survives closing the dialog** within the loaded page, so closing it by
accident does not lose the conversation. It is not stored in the project data though, and a
page reload clears it. The **New conversation** button clears it sooner.

---

## 36. The data model and its export

### 36.1 What it is for

**Settings → Model** shows the whole project schema in one place — types, aspects,
attributes, lists and relations — and exports it into standard formats other tools can
read: OpenAPI, JSON Schema, SQL, RDF/OWL, SHACL, XMI.

Don't confuse it with chapter 25. That one exports **data** (entities) with a schema
attached so the data can be validated. This one exports **the schema only** — no entity
leaves, not even its name. What leaves is a description of how the project is built.

It comes in handy when you need to hand the model to a developer or an architect, load it
into Enterprise Architect, or have a database created from it.

### 36.2 Model overview

The upper part of the tab is a readable listing of the model:

- **Summary** — how many types, aspects, relations, lists and attributes there are
- **Types** — expand one and you see its attributes (name, key, data type, required flag,
  linked list) and the relations leading out of it. The type line also shows **how many
  entities** actually use it — a good way to spot a type you once created and never used.
- **Aspects** — the aspect's attributes and the number of entities carrying it
- **Relations** — from → to, the inverse name and how many times the relation is actually
  used in the data. Where there is no restriction to specific types, it says "any".
- **Lists** — the values and the number of attributes using the list
- **Tag sets** — the tags of the set; a tags attribute states which set it draws from
- **Warnings** — anything that could complicate the export: an attribute with no name, a
  select attribute with no list assigned, a tags attribute with no tag set assigned, an empty or unused list, a key collision between
  an aspect and a type, a project with no type at all

Warnings block nothing — the export runs anyway. They mark the spots where the model left
something unsaid and the generator had to fill in the blank.

### 36.3 Base IRI

The RDF outputs (OWL, SKOS, SHACL) need a namespace. The **Base IRI** field is stored
**in the project data** (unlike language or theme) so that everyone who exports the model
gets the same identifiers. Leave it empty and it is derived from the project name — fine
for a first pass, but set your own for anything meant to be published
(e.g. `https://company.com/model/`).

Below it sits the **OWL 2 DL compatibility** checkbox. A date is naturally written as
`xsd:date` in RDF — except that datatype lies outside the OWL 2 DL datatype map, so
reasoners like HermiT refuse to load such an ontology. Tick it and both OWL and SHACL use
`xsd:dateTime`, and the ontology passes a reasoner. Unticked is semantically more precise
and matches the data export and the JSON Schema, where a date is a date. The switch changes
**both** RDF outputs at once, so they can never contradict each other.

### 36.4 Keys

Keys (`like_this`) are derived **exactly as in the data export** (ch. 26.7): snake_case,
no diacritics, overridable through the optional **JSON key** field on a type, aspect,
attribute or relation type. Because of that the generated OpenAPI and JSON Schema fit what
actually comes out of the data export — one can be used to validate the other.

Rename an attribute and its key changes. That is exactly why it pays to pin the keys of a
model you have already sent somewhere.

### 36.5 Formats

Pick a format with the switcher; the preview right below shows the output.

| File | Format | What for |
|---|---|---|
| `model.md` | Documentation (MD) | A human-readable description of the model — types, attributes, aspects, relations, lists |
| `openapi.yaml` | OpenAPI 3.1 | A REST API over the model: schemas plus `list/create/get/update/delete` paths for every type |
| `schema.json` | JSON Schema 2020-12 | A validation schema; aspects are separate `$defs` composed through `allOf` |
| `schema.xsd` | XSD (XML Schema) | The same for XML; an aspect is an `xs:group`, which is how XSD composes it into a type |
| `model.sql` | SQL DDL | PostgreSQL: an `entita` table, one table per type and per aspect, list and tag-set tables, `typ_vazby` + `vazba` and junction tables for relation and tags attributes |
| `model.ttl` | RDFS/OWL + SKOS | An ontology in Turtle: classes, properties, plus the lists and tag sets as SKOS concepts |
| `shapes.ttl` | SHACL | Shapes matching the classes from the OWL output — validate RDF data against the model |
| `model.xmi` | XMI (UML) | A UML model for Enterprise Architect and other CASE tools: classes, attributes, associations, enumerations |

### 36.6 Downloading

- **📋 Copy** — the currently shown format to the clipboard
- **📥 Download file** — just that one file
- **📦 Download all (ZIP)** — all seven files plus a `README.md` with the overview, the
  generation date, the base IRI and any warnings

The on-screen preview is truncated for large models, but copying and downloading always
take the full content.

### 36.7 How the model is translated

A few things in the DKM data model have no direct counterpart in the target formats. It is
worth knowing how they are handled:

- **An aspect is cross-cutting** — it can be added to an entity of any type. In SQL it
  therefore becomes a separate table linked to `entita`, not columns in the type's table.
  In JSON Schema it becomes a `$defs` composed into the type through `allOf` +
  `unevaluatedProperties: false`. In OWL and UML it is a class of its own.
- **An identically named attribute on two types is a different property in RDF.** Merging
  them would put `rdfs:domain` on both classes, which in OWL means the *intersection* —
  "only an entity that is both" — and that is not what the model says. Properties therefore
  carry the owner's key (`:subjekt_stav`, `:system_stav`), and SHACL mirrors that in
  `sh:path`.
- **Restricting a relation to certain types** (scope) cannot be expressed in SQL — a
  junction table does foreign keys, not "only from these types". The restriction is written
  at the end of the DDL as a comment noting that the application or a trigger has to
  enforce it. In OpenAPI, OWL and SHACL it becomes a range / `sh:class`.
- **An empty list of allowed types means "any"**, not "none" — the overview and the outputs
  behave accordingly.
- **Custom attributes** (the ones you add on a single entity) are not part of the model —
  they are not schema, they are data.
- **The `Entita` class is the common ancestor.** In SQL it is the `entita` table, in OWL the
  `:entita` class the types are `rdfs:subClassOf`, in UML the class the types inherit from.
  It carries what every entity has regardless of type: `id`, `nazev`, `inbox`, `archiv`,
  `vytvoreno`, `zmeneno`.
- **A universal relation is drawn once** in UML, between `Entita` and `Entita`. Spelled out
  over every pair of types, eight types would give you 64 associations and an unreadable
  diagram.
- **List values are SKOS concepts in RDF**, not strings. SHACL says the same (`sh:in` with
  the concept IRIs), so OWL and SHACL describe the same data. If one talked about strings and
  the other about concepts, no dataset could satisfy both.
- **A tags attribute is multi-valued.** In SQL it therefore gets its own junction table
  (`type_attribute`) with a foreign key into the tag set's table, not a column; in JSON Schema
  and XSD it is an array with an enumeration; in OWL an object property into the set's SKOS
  concepts — with no `sh:maxCount`, because there can be several tags; in UML an attribute
  with multiplicity `0..*` and an enumeration type.
- **The XMI defines its own primitive types.** UML 2.1 only knows `String`, `Boolean`,
  `Integer` and `UnlimitedNatural` — a reference to `Date` or `Real` in the standard library
  would resolve in no tool. The file is therefore self-contained.
- **Association ends always spell out their multiplicity.** Without it UML reads `1..1`,
  which would mean every entity must have that relation — and the model does not say that.

### 36.8 How the outputs are verified

Every format goes through a real tool from its own world, not just a "looks reasonable" check:

| File | Verified by |
|---|---|
| `openapi.yaml` | the official OpenAPI 3.1 validator |
| `schema.json` | the draft 2020-12 meta-schema; on top of that a sample entity is validated against it and a missing required attribute, a value outside the list and an unknown key are all checked to **fail** |
| `schema.xsd` | an XML Schema validator (libxml2) |
| `model.sql` | a PostgreSQL parser |
| `model.ttl` | an RDF parser; plus a check that no property has two domains and that every range is a declared class or an XSD datatype |
| `shapes.ttl` | real SHACL validation: valid data passes, while a missing required attribute, a value outside the list, a number written as text and a relation to the wrong type are all rejected |
| both `.ttl` together | a cross-check that the shapes talk about the same classes, properties and concepts the ontology declares |
| `model.xmi` | a structural XMI 2.1 check: unique `xmi:id`s, every reference resolved, every association with two ends pointing back at it, and every end with a type and a multiplicity |

With **OWL 2 DL compatibility** ticked (ch. 36.3) the HermiT reasoner additionally loads the
ontology and pronounces it consistent.

**What has not been verified: the Enterprise Architect import.** The XMI follows
UML 2.1 / XMI 2.1 and structurally matches what CASE tools expect, but it has not been tried
in EA itself. If it insists on something, say so — it can be tuned.

---

## 37. The `.dkmdata` and `.dkmpkg` file formats

This chapter is for anyone who wants to work with DKM data from the outside: with
their own script, another tool, or through an AI. It describes both file formats
normatively — what is in them, what has to be in them, and what a reader may expect.

### 37.1 Two formats and the difference between them

| | `.dkmdata` | `.dkmpkg` |
|---|---|---|
| What it holds | **the whole project** — model, all entities, saved views and settings | **a slice** — selected entities plus only the part of the model they need |
| What it is for | saving and backing up a project, moving it between devices, GitHub | moving data between two projects |
| How it is produced | Save (Ctrl+S), clipboard, GitHub | Settings → Packages, or a bulk action on a selection (ch. 28) |
| Marker | none — recognised by extension and content | mandatory key `"format": "dkmpkg"` |
| How it is read | replaces the whole project | goes through the import wizard, which maps the model onto the target project |

Both are plain UTF‑8 JSON, uncompressed and unwrapped. `.dkmdata` is literally
`JSON.stringify` of the application's internal state — nothing is added or removed.

### 37.2 Machine-readable schemas

Two JSON Schema documents (draft 2020-12) sit next to the application:

- **<https://nastroje.egdilna.cz/dkm/dkmdata-scheme.json>** — the whole project
- **<https://nastroje.egdilna.cz/dkm/dkmpkg-scheme.json>** — the portable package

In the source they are `dkm/dkmdata-scheme.json` and `dkm/dkmpkg-scheme.json`.

Both schemas are **self-contained**: they reference neither each other nor anything on
the network, so one file can be copied whole and validated offline — or pasted into a
conversation with an AI. The shared definitions (entity, attribute definition, entity
type, aspect, relation type, select list, relation, comment, object, custom attribute,
attribute value) are deliberately identical in both files. Every property carries a
description that states not just its shape but its meaning.

Checking in Python:

```python
import json
from jsonschema import Draft202012Validator

schema = json.load(open('dkmdata-scheme.json'))
data   = json.load(open('project.dkmdata'))

v = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
for e in sorted(v.iter_errors(data), key=lambda e: list(e.path)):
    print('/' + '/'.join(map(str, e.path)), '→', e.message)
```

`format_checker` has to be passed explicitly — without it most validators merely record
the `format` keyword and never check the timestamps. In JavaScript the same needs
`ajv-formats` alongside `ajv`.

### 37.3 What the schema cannot check: references inside the file

JSON Schema can check shape, not that a reference leads anywhere. This is on the reader
and on whoever produces the file:

| Reference | Must point to |
|---|---|
| `entities[].typeId` | `entityTypes[].id`, or `null` |
| `entities[].aspects[]` | `aspects[].id` |
| a key in `entities[].attributes` | the `id` of an attribute definition on the entity's type or on one of its aspects |
| `entities[].relations[].relationTypeId` | `relationTypes[].id` |
| `entities[].relations[].targetId` | `entities[].id` |
| the value of a relation attribute | `entities[].id` (an array of ids when `multi`) |
| `…attributes[].listId` | `selectLists[].id` |
| `…attributes[].tagSetId` | `tagSets[].id` |
| `…attributes[].targetType` | `entityTypes[].id`, or `any` |
| `relationTypes[].fromTypes[]`, `toTypes[]` | `entityTypes[].id` |
| `settings.tabs[].typeIds[]`, `aspectId`, `tagSetId`, `viewId`, `entityId`, `typeId` | `entityTypes[].id`, `aspects[].id`, `tagSets[].id`, `savedViews[].id`, `entities[].id` — depending on the tab kind |

Identifiers are unique within the file. DKM builds them as `prefix_<time><random>`
(`e_lz3k9a1b2c`), but the format does not require that shape — the string only has to be
unique and stable.

A dangling reference will not break the application: a relation to a missing target is
simply not shown. The data is damaged all the same, and the loss spreads with the next
export.

**An empty list means "anything", not "nothing".** This holds for `fromTypes` and
`toTypes` on a relation type: a non-empty list restricts, while an empty list — and a
missing key — leaves the relation unrestricted. Read it the other way round and you
forbid everything. The restriction is also read according to `scope` only: `from` looks
at `fromTypes`, `to` at `toTypes`, `specific` at both, `universal` at neither.

### 37.4 Attribute values by type

An entity's values live in `attributes` under the **identifier** of the attribute
definition, not under its name. The shape of the value follows that definition's type:

| Attribute type | Value shape | Note |
|---|---|---|
| `text`, `url` | string | |
| `textarea` | string | rendered as Markdown with CriticMarkup |
| `date` | string `YYYY-MM-DD` | not a full ISO timestamp — it is the value of an HTML date field |
| `number` | number | a real number, not a string of digits |
| `yesno` | `true` / `false` | |
| `select` | string | must be one of the values of the linked select list |
| `tags` | array of strings | each is one tag from the linked set (`tagSetId`); DKM stores them alphabetically |
| `relation` | entity identifier | an array of identifiers when `multi: true` |

**An empty value is not stored.** DKM deletes the key from `attributes` outright, so
neither `null` nor `""` appears in freshly written data and a missing key is the normal
state. The schema tolerates both so that data from elsewhere still passes. The exception
is an entity's custom attributes (`customAttributes`), where the `value` key cannot be
deleted — there, empty is an empty string.

Relations in `relations` are recorded **on the source entity only**. The reverse
direction (the "Links here" section) is derived by DKM and is not duplicated in the
data. Record it on both sides and every relation appears twice.

### 37.5 Identity when importing a package

An entity is recognised by its `id`, not by its name. A package preserves identifiers,
so importing the same data twice is recognised as a conflict with existing entities and
offers overwrite or merge — it does not create a second set of records. Anyone producing
a package outside DKM must therefore keep identifiers **stable across releases**;
otherwise the data is duplicated on every import. Matching by name can be enabled only
in the wizard's detailed mode (ch. 28.3) and is a fallback for data that shares no
history of identifiers.

The model in a package is narrowed to what the selected entities need. That has two
consequences:

- **Relations pointing outside the package are dropped on export**, so that no reference
  to a missing entity is left in the file. Extending the selection to neighbours or to
  the whole connected component prevents this (ch. 28.1).
- **`fromTypes` and `toTypes` on the carried relation types may reference types that are
  not in the package.** The restriction then does not fit the target project and the
  wizard creates the relation type without it.

### 37.6 Canonical shape and older spellings

Select lists went through a clean-up and the reader still tolerates the older shape.
Whoever produces a file should write only the canonical column:

| Canonical | Deprecated | What DKM does with it |
|---|---|---|
| `selectLists[].values` | `selectLists[].options` | moves it into `values` on load and drops the old key |
| `…attributes[].listId` | `…attributes[].selectListId` | moves it into `listId` on load and drops the old key |
| a list in `selectLists` | values inline in `…attributes[].options` | read only as a safety net |
| author name in the browser | `settings.userName` | takes it over locally and removes it from the data |
| `settings.tabs` | `settings.visibleTypeTabs`, `visibleAspectTabs`, `savedViews[].pinned` | composes the bar from them and drops the deprecated keys |

`settings.userName` was removed so that several people can work on one project — the
comment author's name belongs to a particular browser, not to shared data.

### 37.7 What survives loading and what does not

- **An unknown key at the top level of `.dkmdata` is dropped on load.** The reader takes
  only the keys it knows, so custom metadata alongside `entities` will not survive the
  first save. The schema flags it as an error (`additionalProperties: false`).
- **An unknown key inside an entity is kept.** Entities pass through load and save
  untouched, so a custom flag on a record survives. The schema therefore allows it.
- **Missing collections are filled in as empty arrays.** The minimal valid file is
  `{"entities": []}`; a missing `version` means 1.

### 37.8 What is never in these files

**No secrets are stored in project data.** The GitHub token, the AI key and the comment
author's name are not in the file and never will be — the browser alone holds them
(ch. 34.2). `ghPath` carries only a path of the form `owner/repo/path/file.dkmdata`, not
access to it. A `.dkmdata` file can therefore be passed on or committed without taking
credentials with it — it does contain all of the project's data, though, so whatever
sensitivity applies to that data applies to the file.


---

## 38. The screen identifier in the footer

At the very bottom of every screen there is a short code in small type, for example
`#scrallview.table` or `#dlgimppkg.step3`. It is the **internal name of the screen** you
are currently looking at.

What it is good for:

- **Reporting a problem, or asking a question.** Instead of describing "that list screen,
  the one where I have the table switched on", write `#scrallview.table`.
- **Working with an AI over the application.** An assistant can tell which screen is meant
  without guessing from a description or a screenshot.
- **Tests and documentation.** A reference to a screen that survives translation and
  renaming.

The code is the same in Czech and in English and is never translated. What follows the dot
is a qualifier — the display mode (`.table`, `.cal`), the preview being on (`.preview`),
selection mode (`.select`), or a wizard step (`.step3`).

The generated static viewer carries the same kind of name, with the prefix `scrstat`.

The full list of identifiers is in `dkm/screens.md` in the source.
