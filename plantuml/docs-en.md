# PlantUML editor — A structured multilingual UML diagram editor with preview, versions and shared elements

*Czech version: [docs-cs](docs-cs)*

**Online version of the tool:** [https://egdilna.github.io/nastroje/plantuml](https://egdilna.github.io/nastroje/plantuml)  
**Tool page:** [https://egdilna.github.io/nastroje/#plantuml](https://egdilna.github.io/nastroje/#plantuml)

The tool is also available as a standalone HTML file that you can download and run locally without installing anything.

---

## Feature overview

**PlantUML editor** is an accessible web application for building PlantUML diagrams visually. Diagrams are assembled with forms — the application continuously generates valid PlantUML source and renders it through the official `plantuml.com` server. Everything runs in a single HTML file with no installation, no dependencies and no data sent outside the browser (apart from rendering the diagram itself).

### Key features

- **Fourteen diagram types** — activity, class, sequence, use case, state, component, deployment, network (nwdiag), Gantt chart, timeline, timing, EBNF grammar, mindmap, WBS (work breakdown structure)
- **Projects with multiple diagrams** — a project groups any number of diagrams; they can be organized into a hierarchy of folders, with icons for moving and exporting
- **Project-wide shared elements** — classes, actors, use cases, components, interfaces, participants, tasks and milestones can be promoted to be shared across the whole project; their definition lives in the project and a change propagates everywhere
- **Two languages** — Czech and English, switchable in the header; the choice is remembered in `localStorage`
- **Preview inline and in a window** — the rendered PNG diagram directly on the Output tab or in a separate window; a projection mode for a second screen
- **Side preview** — while authoring, a split screen with a live SVG preview, zoom, highlighting of the selected element and selecting an element by clicking into the image (also in the projection)
- **Contextual header** — in the project view the full project toolbar, in the diagram view only the buttons for going back and saving
- **Diagram versions** — manual snapshots with your own labels; before a restore, the current state is backed up automatically
- **Diagram status (workflow)** — 9 statuses (draft, proposal, for review, approved, being edited, rejected, updated, done, cancelled)
- **Hiding elements** — individual elements can be hidden from the resulting diagram (a cut-out), the model stays intact
- **“Done” marking** — a checkbox on every element in the tree + an All / Done / Not done filter
- **Command palette** — F1 or Ctrl+Shift+P opens a search over all editor functions, including opening diagrams and inserting elements; searching ignores diacritics
- **GitHub and GitLab as storage** — the project is saved to and loaded from a GitHub or GitLab repository directly (gitlab.com and your own server), and diagram images in PNG are saved to the same folder; every project has a static address `?gh=…` that opens it right away
- **Export and import** — project `.pup`, transfer package `.pupe` (a diagram or a folder), PlantUML source `.puml`; PUML import with automatic detection of the diagram type; loading and saving through the clipboard (Ctrl+Shift+O/S)
- **Text description and document** — an automatically generated readable description of the diagram; export to Markdown and Word (DOCX) including the image
- **Validation** — continuous model checking (missing texts, invalid references, duplicate aliases)
- **Themes and skinparam** — a choice of 32 official PlantUML themes + custom `skinparam`
- **Title, header, footer, caption** — four text fields around the diagram with a project → diagram cascade
- **Swimlanes** — automatic registration of lanes from actions in activity diagrams
- **Colored elements and arrows** — a palette of 40 named colors with descriptive labels
- **Cross-references** — the element detail automatically lists relationships, the parent element, nested elements and attached notes

### Accessibility

The application is designed with an emphasis on accessibility — semantic HTML, ARIA attributes (`role="toolbar"`, `role="tablist"`, `aria-labelledby`, `aria-live`), full keyboard control including arrow-key navigation in trees and between tabs, native `<dialog>` elements for modal windows, and a debug output available right on the page (not in the console).

### Data storage

A project is saved as a single file with the extension `.pup` (PlantUML Project) — it contains all diagrams, folders, versions, shared elements and settings in JSON format. When loading, the application automatically recognizes whether it is a project (`.pup`), a transfer package (`.pupe`) or PUML source, so it also works with renamed files or files without an extension. No data is sent anywhere; rendering through `plantuml.com` sends only the encoded source code of the current diagram in the URL.

The same `.pup` file can be saved to a **GitHub or GitLab repository** instead of to disk — see [GitHub and GitLab as storage](#github-and-gitlab-as-storage). In that case the only communication is with `api.github.com` or with the GitLab server you specify, and the tokens stay in this browser.

---

## Application layout

The application has **two views** and, in the diagram view, **three tabs**. You switch tabs with the mouse or with the left/right arrows (Home/End jump to the first/last tab).

### View 1 — Project

It appears after startup, after the “← Back to project” button and after creating a new project. It contains two sections:

- **Diagrams in the project** — a tree of folders and diagrams with the type distinguished by color, and buttons for a new diagram and a new folder
- **Project-wide shared elements** — a list of all shared entities across diagrams (classes, actors, use cases, components, interfaces, participants, tasks, milestones) with the number of uses; clicking jumps to the first diagram where the element is used

### View 2 — Diagram

It opens after you click a specific diagram. At the top there are three tabs:

| Tab | Content |
|-----|---------|
| **Diagram** | Diagram actions (Rename, Move, Duplicate, Export, Delete, Diagram settings), Diagram status (workflow + apply hiding + “Hide elements…”), Diagram versions, Validation |
| **Authoring** | Left column: a toolbar for inserting elements + the element tree with a done/not done filter. Right column: the detail of the selected element (form) + cross-references to related elements |
| **Output** | Diagram preview (Load / update, Preview window, Project, Download PNG), Source code (Download .puml, Copy source), Text description (Generate description, Copy description), Document (Copy MD, Save MD, Save DOCX) |

### Contextual header

The blue header adapts dynamically to the view:

**In the project view** — the project name in H1 and the full project toolbar:

| Button | Shortcut | Action |
|--------|----------|--------|
| New project | Alt+N | Creates an empty project (with confirmation) |
| Load project | Alt+O | Opens any file — type auto-detection (.pup, .pupe, .puml) |
| Load from clipboard | Ctrl+Shift+O | Loads a project from the clipboard contents (or from a dialog as a fallback) |
| Save project | Alt+S | Downloads the project as a `.pup` JSON file |
| Copy to clipboard | Ctrl+Shift+S | Copies the project JSON to the clipboard |
| Import .puml | Alt+M | Imports a PlantUML file as a new diagram |
| Import .pupe | — | Imports diagrams/folders from a transfer package |
| Project settings | — | Opens a dialog with the name, theme, header, footer, etc. |
| Help | Alt+H | Shows the built-in help; at the top there is a link to this full guide (in the interface language: `docs-cs` / `docs-en`) |
| Language | — | Czech / English switch |

**In the diagram view** — the diagram name in H1 and only two buttons (back, save), plus “Copy to clipboard” and the language switch, which are always there.

---

## Working with a project

### Creating and loading

When the application starts, an empty project “New project” is available. With the **Load project** button you can pick any file. The application recognizes the type from its content:

- Starts with `{` → JSON, then:
  - Contains `pupeVersion` or `kind: "diagram"/"folder"` → a `.pupe` package (import of diagrams/folders)
  - Otherwise → a full `.pup` project
- Contains `@startuml` or diagram keywords → PUML source, imported as a new diagram

**Loading from the clipboard** (Ctrl+Shift+O) first tries to read the clipboard directly; when the browser does not allow access, a dialog with a textarea opens, into which the user pastes the content manually.

### Project settings

The **Project settings** dialog contains fields that apply to all diagrams in the project:

| Field | Description |
|-------|-------------|
| Project name | Shown in the header and in the browser window title |
| Theme | A choice of 32 official PlantUML themes (see below) |
| Custom skinparam | Multiple lines of skinparam parameters; the keyword `skinparam` is added automatically |
| Title | Shown at the top above the diagram, may be multi-line |
| Header | Text at the very top (above the title), multi-line |
| Footer | Text at the very bottom, multi-line |
| Caption | A short single-line caption below the diagram |

### Project → diagram cascade

Values from the project settings are used for all diagrams. If a specific diagram has its own value in its **Diagram settings** dialog, that value takes precedence. The skinparam parameters of the project and of the diagram are concatenated.

### Diagram settings

Besides the four text fields (theme, skinparam, title/header/footer/caption), the **Diagram settings** dialog contains further groups of fields depending on the diagram type:

- **Layout direction** (activity, class, usecase, component, deployment, state) — top-bottom or left-right
- **Visual directives for the class diagram** — Hide empty members / attributes / methods / circle / stereotypes
- **Gantt chart settings** — project start date, timeline scale, highlighting today, regular days off in the week, one-off holidays
- **Timing diagram settings** — hide the time axis, date format

### Folders and organizing diagrams

With the **New folder** button you create a folder (optionally nested in a parent). A diagram is put into a folder either when it is created or later with the **Move to folder** button. In the tree every folder also has action buttons for export to `.pupe` and for deletion.

### Diagram actions (Diagram tab)

- **Rename** — change the name
- **Move to folder** — choose the target folder from a dialog
- **Duplicate** — creates a copy (without version history) with the suffix “(copy)”
- **Export (.pupe)** — creates a transfer package with this diagram, which can be imported into another project
- **Delete diagram** — irreversible, with confirmation; also deletes all versions
- **Diagram settings** — own theme, skinparam, title, etc. + type-specific settings

### Diagram status (workflow)

A diagram can have a status in the workflow. It is stored as a code (language-independent) and shown in the project list after the name in parentheses.

| Code | Czech | English |
|------|-------|---------|
| draft | Rozpracovaný | Draft |
| proposal | Návrh | Proposal |
| for_review | Ke schválení | For review |
| approved | Schválený | Approved |
| editing | Upravovaný | Being edited |
| rejected | Neschválený | Rejected |
| updated | Aktualizovaný | Updated |
| done | Hotový | Done |
| cancelled | Zrušený | Cancelled |

### Hiding diagram elements

In the **Diagram status** section you can turn on the switch **Apply element hiding when rendering** — when it is checked, the preview and the export generate only the visible elements (a cut-out). Hidden elements stay in the model; they are just temporarily not rendered.

The **Hide elements…** button opens a dialog with bulk checking of all elements in the diagram (Show all / Hide all / individually) in a hierarchical list with filtering.

### Transfer between projects (.pupe)

A diagram or a whole folder (including nested subfolders and their diagrams) can be exported as a `.pupe` transfer package (PlantUML Editor Export):

- **Export a diagram** — the “Export (.pupe)” button on the Diagram tab
- **Export a folder** — the button with a down arrow (⤓) in the tree on the left
- **Import** — the “Import .pupe” button in the project header

The package carries the complete content including version history and settings; shared elements are bundled with it. On import all identifiers are regenerated automatically (to prevent collisions) and the folder hierarchy is preserved. If the target project already has a shared element with the same alias, the target one wins (it is assumed to be an adapted version).

The package bundles all shared elements that the diagram refers to — components, interfaces, relationships (including their ends), use cases, Gantt tasks and milestones, nodes, classes, participants and actors, also from the saved versions. Older packages (created before the fix of November 2026) did not contain the definitions of shared components, interfaces and relationships; when such a package is imported into a project where these shared elements do not exist, they are converted to local elements named after the alias and the status line points this out. The relationship type is derived from the alias; the relationship label cannot be recovered. Into the original project even an old package imports without loss.

---

## Project-wide shared elements

Elements used in multiple diagrams can be promoted to be **shared across the whole project** — their definition lives in the project and changes propagate everywhere. The following can be shared:

| Diagram type | Shared entities |
|--------------|-----------------|
| Class | Classes, interfaces, enums, abstract classes, structs, annotations, entities |
| Sequence | Participants (all types) |
| Use case | Actors and use cases |
| Component | Components, interfaces, relationships |
| Deployment | Nodes / elements |
| Gantt | Tasks (name, alias, duration) and milestones (name, alias) |

You promote an element by checking **Shared across the project** in its detail. From then on the shared definition is what you edit; only things like color, package, system, `groupId`, placement in the Gantt chart and `startMode`/`startDate`/`refTaskId` stay local.

Inserting an existing shared element into another diagram is done with the **“Insert shared…”** button in the toolbar of the given type (in the use case diagram there are two separate buttons for an actor and a use case; in the component diagram three — component, interface, relationship).

Changing the alias of a shared element is automatically rewritten in all diagrams where it is used. In the tree, shared elements are recognized by the **🔗** icon.

---

**Renaming the alias of a shared element** is automatically reflected everywhere: in all diagrams, their saved versions and also in the shared relationships that lead to the element. The alias field can be cleared and typed again — while it is empty, the previous alias applies. An alias that another shared element already has is not accepted.

In the **Project-wide shared elements** list, below each element there is a list of links to the diagrams where it occurs; a link opens the diagram with the element selected.

## Diagram types

| Type | ID | Description |
|------|----|-------------|
| Activity diagram | `activity` | Control flow with actions, decisions, loops and parallel processing |
| Class diagram | `class` | Classes, interfaces, enums, packages and the relationships between them |
| Sequence diagram | `sequence` | A sequence of messages between participants |
| Use Case diagram | `usecase` | Actors, use cases and the system boundary |
| State diagram | `state` | States, composite states, transitions |
| Component diagram | `component` | Components, interfaces, groups and relationships |
| Deployment diagram | `deployment` | Infrastructure nodes, artifacts, links |
| Network diagram | `network` | Networks (nwdiag) with nodes, addresses and groups |
| Gantt chart | `gantt` | Project tasks on a timeline, milestones, dependencies |
| Timeline | `timeline` | A chronology of events with dates |
| Timing | `timing` | Timing diagram — signal states over time |
| EBNF grammar | `ebnf` | A formal grammar (Extended Backus-Naur Form) |
| Mind map | `mindmap` | A tree diagram with the root in the middle |
| WBS — work breakdown | `wbs` | Work Breakdown Structure — a hierarchical breakdown of a project |

### Activity diagram

Models the flow of a process — from the start through actions and decisions to the end. It is generated in modern PlantUML notation (activity beta).

**Toolbar elements:**

| Element | Description |
|---------|-------------|
| Action | A standard process action (`:text;`) |
| SDL task | An action with the stereotype `<<task>>` (SDL task) |
| SDL input | An action with the stereotype `<<input>>` (receiving a signal) |
| SDL output | An action with the stereotype `<<output>>` (sending a signal) |
| SDL procedure | An action with the stereotype `<<procedure>>` (calling a procedure) |
| SDL save | An action with the stereotype `<<save>>` (saving a state) |
| SDL load | An action with the stereotype `<<load>>` (loading a state) |
| Relationship (arrow) | A named/styled arrow between elements |
| Decision (if) | Branching with a condition (“yes” and “no” branches, elseif can be added) |
| While loop | A loop with the condition at the beginning (labels “continue” and “exit”) |
| Repeat loop | A loop with the condition at the end |
| Fork (parallel) | Parallel branching with `end fork` or `end merge` |
| Split (branching) | Branching (`split` / `split again` / `end split`) |
| Note | A freely placed note (left/right/above/below) |
| Start, Stop, End | Nodes for the beginning and end of the process |
| Detach, Kill, Break | Special terminating nodes |
| Partition | A titled area containing several actions |
| Connector (reference) | A short label (typically a letter); the same label in two places connects them visually |
| Swimlanes… | Management of the list of lanes (one name per line) |

**Action detail:**

| Property | Description |
|----------|-------------|
| Action text | The main description (`:text;`) |
| SDL stereotype | A choice of 8 stereotypes (standard + 7 SDL: task, input, output, procedure, save, load, continuous) |
| Swimlane | Optional assignment to a lane |
| Action background color | A choice of 40 named colors or a custom hex |
| Action note | An optional `note left/right` with a position (left/right) |

**Arrow (relationship) detail:** text, style (solid / dashed / dotted / bold), color.

**While / repeat loop detail:** a condition + optional labels for “continue” and “exit”.

**Swimlanes** are registered **automatically** — if you fill in a lane in an action that does not exist yet, it is added by itself. Alternatively you can open the list with the “Swimlanes…” button. The generator correctly handles switching the lane inside `if` / `while` groups.

### Class diagram

Models the class structure — classes, interfaces, enums, packages and their relationships.

**Element types in the toolbar:**

| Stereotype | PlantUML keyword |
|------------|------------------|
| Class | `class` |
| Interface | `interface` (with the **lollipop** option — rendered as a circle ○) |
| Abstract | `abstract class` |
| Enum | `enum` (with support for a list of values) |
| Struct | `struct` |
| Annotation | `annotation` |
| Entity | `entity` |
| Protocol | `protocol` |

The toolbar further has the buttons **Relationship**, **Package**, **Note** and **Insert shared…**.

**Class detail:** name, alias (generated automatically from the name without diacritics), stereotype, additional stereotype (e.g. `<<service>>`), URL link (generated as clickable in SVG/PNG), package, attributes and methods, a note with a position.

**Attributes:** visibility (`+` public, `-` private, `#` protected, `~` package), name, type, default value, the flags `static` / `abstract`, buttons for reordering and deleting.

**Methods:** visibility, name, return type, a list of parameters (name + type), the flags `static` / `abstract`.

**Package / container types:**

| Type | PlantUML |
|------|----------|
| Package | `package` |
| Namespace | `namespace` |
| Node | `node` |
| Rectangle | `rectangle` |
| Folder | `folder` |
| Frame | `frame` |
| Cloud | `cloud` |
| Database | `database` |

Packages can be nested. The option **Arrange contents vertically (hidden relationships)** adds hidden relationships `-[hidden]-` between the direct children of a package, which force GraphViz to put them one below another.

**Relationship types:**

| Relationship type | PlantUML symbol |
|-------------------|-----------------|
| Inheritance (extends) | `<|--` |
| Realization (implements) | `<|..` |
| Composition | `*--` |
| Aggregation | `o--` |
| Association | `--` |
| Dependency | `..>` |

For a relationship you can set the **cardinality** on both ends (a palette of 9 values + custom), a label, the direction (source → target or the opposite) and a color.

**Cardinalities (multiplicity):**

| Value | Meaning |
|-------|---------|
| (not specified) | No cardinality |
| `1` | Exactly one |
| `0..1` | Zero or one (optional) |
| `*` | Any number |
| `1..*` | At least one |
| `0..*` | Any number (including zero) |
| `2`, `2..*`, `n`, `1..n` | Predefined values |
| Custom value… | Manual entry (e.g. `3..7`) |

### Sequence diagram

Models the sequence of messages between participants.

**Participant types:**

| Type | Keyword |
|------|---------|
| actor | a person |
| participant | a generic participant (default) |
| boundary | system boundary |
| control | a control component |
| entity | an entity component |
| database | a database |
| collections | a collection |
| queue | a queue |

A **message** has a sender, a recipient, text, an arrow type and optionally a note and a color:

| Arrow type | Symbol |
|------------|--------|
| synchronous | `->` |
| asynchronous | `->>` |
| return | `-->` |
| lost | `->x` |

A message can activate/deactivate the recipient (lifeline).

**Groups:**

| Group | Meaning |
|-------|---------|
| `alt` | Alternatives (with `else` branches) |
| `opt` | An optional part |
| `loop` | A loop |
| `par` | Parallel (with `else` branches) |
| `critical` | A critical section |
| `break` | A break |
| `group` | A generic grouping |

**Other elements:**

| Element | Meaning |
|---------|---------|
| Note | `note left/right/over`, can be bound to one or several participants |
| Divider | `== text ==` |
| Autonumber | Automatic numbering of messages (with a start and a step) |
| Delay | `...text...` (a visual gap) |
| Reference (ref) | `ref over` across the selected participants |
| Create | `create` — dynamic creation of a participant |
| Destroy | `destroy` — destruction of a participant |
| Box | A visual grouping of several participants (with a background color and a title) |

### Use Case diagram

Models actors, use cases and system boundaries.

**Actor types (5 stereotypes):**

| Type | Description |
|------|-------------|
| Actor (person) | The classic stick figure |
| Actor (business) | A business actor — a stick figure with a diagonal |
| Actor (system) | An external system as a box |
| Actor (external) | An external actor / service outside the modeled area |
| Actor (device) | Hardware, a robot, a sensor |

Every actor has a name, an alias, a type and an optional **additional stereotype** (appended after the automatic stereotype of the type).

A **use case** has a name, an alias and an optional description (generated as a `note right of` block). It can be placed into a system (a local setting, even when the use case is shared).

A **system (rectangle)** is a visual boundary with a name and an alias into which use cases fall; it supports the option “Arrange contents vertically (hidden relationships)”.

**Relationships:**

| Relationship type | Generated as |
|-------------------|--------------|
| Association | `-->` |
| Include | `..>` with the label `<<include>>` |
| Extend | `..>` with the label `<<extend>>` |
| Generalization | `<|--` |

A relationship connects an actor or a use case with another actor or use case; both ends have an optional type (actor / use case), a label and a color.

**Free-floating notes** attached to an actor / use case with an optional position are also supported.

### State diagram (state)

Models states and the transitions between them.

**State detail:** name, **stereotype** (choice, fork, join, history, sdlreceive or none), parent (composite) state, state description, **entry / exit actions** (`entry / action`, `exit / action`), the **parallel region** flag (orthogonal) — makes sense only for a substate in a composite state, color.

**Transition:** from (`__start__` = initial, `__end__` = final, or one of the states), to, an event/condition label, direction (down / up / left / right), color.

Free-floating notes attached to a state are supported.

### Component diagram (component)

Models components and interfaces with their mutual relationships.

**Component detail:** name, alias, **stereotype** (component, database, queue, cloud, node, folder, frame, file), group (see below), color.

**Interface detail:** name, alias, group.

**Groups (containers)** — 6 types: package, node, folder, frame, cloud, database. A group has a name, a type and the option to arrange its contents vertically.

**Relationship types:**

| Type | Meaning |
|------|---------|
| use | uses |
| provide | provides |
| dependency | depends on |
| association | association |
| realization | realizes |
| inheritance | inherits from |
| composition | contains |
| aggregation | aggregates |
| line | connected |

Relationships can be **shared across diagrams** (missing end elements are filled in automatically on insertion).

### Deployment diagram (deployment)

Models infrastructure nodes and their mutual links. It supports **22 node types**:

- Main: node, artifact, database, cloud, component, folder, queue, storage (separate buttons in the toolbar)
- Others: rectangle, frame, card, stack, actor, agent, boundary, collections, control, entity, file, interface, package, usecase (under the “More node…” button)

**Node detail:** name, alias, element type, **stereotype** (optional `<<...>>` text), parent element (for nesting), color, the option “Arrange contents vertically (hidden relationships)”.

**Link:** from, to, line style (solid `--`, arrow `-->`, dashed `..`, thick `==`, dotted `~~`), label, color.

Free-floating notes are supported.

### Network diagram (network / nwdiag)

Models networks, the nodes in them and direct links.

**Diagram settings (click on empty space in the tree):** default colors for the node, network, group, lines and text.

**Network:** name (without spaces — an identifier in nwdiag), address range (e.g. `192.168.10.0/24`), color. Nodes are added with the `+` button on a network in the tree.

**Node in a network:** name (the same name in another network = an automatic connection between the networks), address (e.g. `.1`), shape (node, database, cloud, storage, queue, actor).

**Group:** name, description, color and checkboxes for choosing the nodes in the group.

**Direct link (peer link):** from node, to node, shapes of the ends.

### Gantt chart (project)

Shows project tasks on a timeline with milestones, dependencies, completion and a mark for today.

**Diagram settings (in Diagram settings):**

- **Project start date** (YYYY-MM-DD) — if empty, the axis is numbered (Day 1, Day 2, …), suitable for generic processes without a calendar (e.g. “within 15 days of submitting the application”)
- **Timeline scale** — daily / weekly / monthly / quarterly / yearly
- **Highlight today's date** + the line color (default salmon)
- **Regular days off** — checkboxes Mon to Sun
- **Specific holidays** — lines `YYYY-MM-DD` or `YYYY-MM-DD | label`

**Task:** name, alias, **duration** (days), start mode, percentage complete (0–100), color.

**Start modes:**

| Option | Behavior |
|--------|----------|
| at project start | The task starts on the first day (or Day 1) |
| absolute date | A specific YYYY-MM-DD |
| after another task / by relationship | A reference to another task + a point (`end` / `start`) + an offset (positive = after, negative = before) |

In addition, the task detail automatically shows the **resolved date** (the computed absolute date), which is recalculated on every change.

**Milestone:** name, alias, date type (absolute date / link to a task). For a link to a task you also enter the point (end/start) and the offset.

Both tasks and milestones can be **shared across Gantt charts** — the name, alias and duration are shared (for a milestone only the name and alias); the placement in a specific diagram (start, link, offset, color) stays local.

### Timeline (timeline / chronology)

A simple visualization of events in time. **Diagram settings:** maximum size (px) and the constrained axis (width / height).

**Event:** name, date, optional description.

### Timing

A timing diagram shows changes of states of several signals over time.

**Settings:** hide the time axis (`hide time-axis`), date format (`use date format`).

**Signal types:**

| Type | Description |
|------|-------------|
| concise | A simple data signal (default) |
| robust | Multiple named states |
| binary | High/low (accepts the aliases on/off, true/false, 1/0, active/inactive) |
| clock | A clock signal (period, pulse, offset) |
| analog | Continuous with a from–to range |
| rectangle | Rectangular |

**Time frame:** time (a linear number, relative `+50`, or a date). In each frame you edit:

- **States** — for each participant: a value / state + an optional color (texts with spaces are wrapped in quotes)
- **Messages** — from / to a participant + a label + an optional offset of the target (e.g. `+50`)

**Note:** attached to a participant, with a position (above / below the signal), text.

**Highlighted interval (highlight):** from time, to time, color, label.

**Time annotation (constraint):** from time, to time, direction (bidirectional ↔ / unidirectional →), label (e.g. `10 tu`, `setup time`).

### EBNF grammar

A syntax diagram of a formal language. The rule detail contains two complementary UIs:

1. **Click-together builder** (token builder) — you compose the right-hand side of a rule from blocks: terminal `"text"`, nonterminal (reference), group `( )`, optional `[ ]`, repetition `{ }`, special `? ?`, alternative `|`, concatenation `,`, raw text.
2. **Text expression** (textarea) — an alternative view; when it changes, the builder is re-rendered (parser). If the text cannot be parsed, it is kept as a single “raw” token.

Every rule has an identifier (without spaces), an expression and an optional comment.

### Mind map (mindmap) and WBS

Tree diagrams with a root. The toolbar contains the buttons: **+ child**, **+ sibling**, ↑ ↓ (among siblings), → (indent — becomes a child of the previous sibling), ← (one level up), **Stereotypes…** (definitions of visual styles).

**Node detail:** text (multi-line via `:text;`), **side** (mindmap: auto/right/left; WBS: to the opposite side), the **boxless** option (adds an underscore `_`), color, a stereotype from the diagram's definitions.

**Stereotype editor** (`Stereotypes…`) — for each stereotype you can set: name, description, background color (BackgroundColor), line color (LineColor), line thickness and style, font color and size and style and name, corner rounding (RoundCorner), shadow. The definitions are generated into a PlantUML `<style>` block.

---

## Editor — structure and detail

### Element tree and filter

The tree in the middle of the screen (Authoring tab) shows the hierarchy of the model. Clicking an element renders a form in the right column in the **Selected element detail** section. Every element has the buttons **↑**, **↓**, **×**.

Above the tree there is a **filter:**

- **All** — shows all elements
- **Done** — only elements checked as done (not-done ones are shown only if they have done descendants)
- **Not done** — only unchecked ones (analogously)

Elements have a **Done** checkbox (informative — it is not generated into PlantUML).

### Insertion rules

The toolbar buttons add a new element according to the current selection:

- If nothing is selected → to the end of the main list
- If a **branch** is selected (in an `if` or `fork`) → into the branch
- If a node of type `while` / `repeat` is selected → into the loop
- If a specific element is selected → it is inserted **after it** at the same level

For `if` / `fork` / `split` groups the tree shows a button **+ elseif branch** / **+ another branch** for adding another alternative.

### Cross-references in the detail

The detail of a shared element (class, component, node, state, actor, use case) contains sections with automatically computed **cross-references**:

- **Relationships of this element** — all relations/relationships where it appears
- **Parent element** — if it is nested (package, system, composite state, node in a node…)
- **Nested elements** / **Use cases in this system** / **Components in the group** — the children of the element
- **Attached notes** — standalone notes referring to the element

Clicking any cross-reference switches the selection in the editor to that element.

### Colors

The palette contains **40 named colors**:

- **Basic** (13): White, Black, Red, Green, Blue, Yellow, Orange, Purple, Pink, Brown, Gray, Cyan, Magenta
- **Light variants** (9): Light blue, Light green, Light yellow, Light pink, Light cyan, Light gray, Light salmon, Light coral, Light steel blue
- **Dark variants** (8): Dark red, Dark blue, Dark green, Dark orange, Dark purple, Dark gray, Dark slate gray, Dark olive
- **Special** (10): Gold, Silver, Navy, Teal, Olive, Maroon, Coral, Salmon, Khaki, Lime

The values are valid CSS and PlantUML names (no conversion). If you load PUML with a color that the palette does not contain, it is added automatically as “Custom: …”.

### Aliases

For classes, packages, sequence participants, actors, use cases, systems, components, interfaces, nodes, tasks, milestones, networks, EBNF rules, timing participants, mindmap/WBS nodes an **alias** is used — a short identifier without diacritics and spaces. It is derived from the name using NFKD normalization (Žadatel → Zadatel), then restricted to `A-Z`, `a-z`, `0-9`, `_`. On a collision a numeric suffix is added (`Zadatel2`).

If you rename the alias of a shared element, it is **automatically rewritten in all diagrams** where it is used.

---

## Preview and projection

### Side preview — live preview while authoring (Alt+L)

A mode mainly for sighted users. On the **Authoring** tab, at the top right, there is the **Side preview** switch (Alt+L, or in the command palette). It is always turned on manually and the editor remembers whether it was on. For those who do not use it, nothing changes.

- **Split screen:** on the left the tree and the element detail as before, on the right the rendered diagram, which stays visible even when the page scrolls. The width of the halves is changed by the **splitter** — by dragging with the mouse, or with the keyboard (left/right arrows in 5% steps, Home/End). The ratio is remembered. On a narrow screen the preview moves below the editor.
- **Redrawing:** automatic after every change, with a short delay — about 0.7 s after the last keystroke while typing, immediately after adding, deleting or moving an element. When the generated source has not changed (for example you just select another element), nothing is downloaded again. The old image stays visible until the new one arrives, so nothing flickers.
- **Pause / Resume** stops the automatic redrawing, **Redraw** redraws immediately.
- **Without network:** the last image stays with a notice that it is not up to date, and a **Try again** button. An error in a PlantUML diagram is rendered right into the image and a notice appears above it.
- **SVG and zoom:** the diagram is in vectors, so it is sharp at any magnification. Buttons −, +, 100%, **Fit width** and **Whole**; Ctrl+wheel zooms at the cursor, dragging with the mouse pans the image. When the preview is focused: + and − zoom, 0 actual size, 1 fit width, 2 whole. The “Fit width” and “Whole” modes also apply after redrawing; a manual zoom is kept on redrawing together with the position, so the image does not jump. The zoom is remembered for each diagram separately.
- **Highlighting the selected element:** the element selected in the tree is framed in orange in the image (a relationship is traced along its line) and the preview scrolls to it by itself if it is not visible.
- **A click into the image selects the element in the tree** — the detail opens on the left, the focus stays where it is.

The highlighting works for all diagram types: for class, component, use case, state and deployment diagrams exactly according to the structure of the image (elements, groups and relationships), for the others (activity, sequence, mind maps, Gantt…) according to the text of the element — elements with the same label are all highlighted.

Redrawing never takes focus and the screen reader does not announce it; the text description of the diagram remains the main accessible path.

### Inline preview (Output tab)

The **Load / refresh preview** button calls the `plantuml.com` server, downloads the PNG image and inserts it into the page. The **dimensions in pixels** are shown as well. If the server refuses (typically a syntax error), a diagnostic box is shown with links to the SVG/PNG URL and the source.

### Preview in a window (Alt+V)

Opens the rendered SVG from `plantuml.com` in a new window. To save the SVG, use the right mouse button in the browser.

### Projection mode (Alt+I)

The **Project** button opens the rendered SVG diagram in a separate window. It is useful for a second screen or a projector.

| State | Button action |
|-------|---------------|
| The window is not open | “Project (window)” — opens a new window |
| The window is open | “Redraw projection” — redraws immediately |
| The user closes the window | Returns to “Project (window)” (checked every second) |

The projection window **redraws itself** after every change of the diagram (just like the side preview), including the title, the caption and the text description. **The element selected in the tree is highlighted in the projection** and the window scrolls to it — useful when explaining over the diagram. A click on an element in the projection window selects it in the editor.

The projection window has a **Full screen** button using the Fullscreen API (alternatively F11) and zoom controls.

---

## Diagram versions

Versions are saved with the **Save version** button (Alt+W) with your own label. The snapshot contains the complete model and the diagram settings (not the global project settings).

### Actions on versions

| Action | Description |
|--------|-------------|
| Restore this version | Before restoring, the current state is automatically saved as the version “Before restoring from: …”, so you never lose data |
| Delete version | Irreversible, with confirmation |
| Preview (SVG) | Opens the rendered diagram from the snapshot in a new window without restoring |

---

## Validation

The **Diagram validation** section (Diagram tab) shows a continuously updated list of warnings and errors. Errors are red, warnings yellow.

### Rules by type

**Activity diagram:**
- Warnings: an action without text, a decision/loop without a condition, a diagram without `start`

**Class diagram:**
- Errors: a class without a name, a duplicate alias, a duplicate package alias, a relationship to a non-existent class
- Warnings: a duplicate class name

**Sequence diagram:**
- Errors: a participant without an alias, a message to a non-existent sender/recipient
- Warnings: a duplicate alias, a message without text

**Use Case diagram:**
- Errors: an actor/use case without a name, a duplicate alias, a duplicate system alias, a relationship to a non-existent element

---

## Text description and document

### Generated text description

The **Generate description** button (Alt+T) on the Output tab creates a readable text description of the diagram:

- **Activity**: continuous text divided into paragraphs — who does what, how the process branches, notes and action types
- **Sequence**: a list of messages “From → To: text (note)” with paragraphs for alternatives, loops, parallel branches
- **Class**: elements (attributes, methods), packages, relationships
- **Use Case**: actors, their activities, relationships
- **State**: the initial state, transitions, state descriptions
- **Component**: components, interfaces, what each provides/uses
- **Deployment**: nodes and their content, links
- **Network**: networks, nodes with addresses, nodes shared between networks
- **Gantt**: tasks with absolute dates (also for those defined relatively)

The description is shown in the field below the source code and can be copied with the **Copy description** button.

### Document (MD, DOCX)

Three buttons: **Copy MD**, **Save MD**, **Save DOCX**. The document contains:

- Header in italics (from the settings, cascade)
- Diagram name in bold
- Summary of the number of elements
- Version, date
- Diagram image (PNG from plantuml.com)
- Caption in italics below the image
- Text description
- Footer in italics at the bottom

Empty values are omitted. DOCX is generated in the browser with the image embedded; the library for creating DOCX is downloaded from a CDN on first use (requires the internet).

---

## Command palette

The command palette is a single place from which you can run anything the editor can do — everything that has a button, a tab or an item in a list.

| Opening | |
|---------|---|
| **F1** | The main shortcut, works in all browsers |
| **Ctrl+Shift+P** | Familiar from code editors. In Firefox a private window takes it — use F1 there |
| **⌘ Command palette** | A button in the header, next to the language switch (so the palette is available without a keyboard too) |
| **Shift+F1** | Help for the palette |

### Searching

Just type a part of the command name:

- **Diacritics and letter case do not matter** — `nahled` finds “Náhled”.
- **Multiple words apply at the same time** — `ulozit png` finds “Uložit PNG do repozitáře”.
- **Letters that are not consecutive also work** — `ulpng` finds “Uložit PNG”.
- **The description, the category and the keyboard shortcut are searched too** — `alt+e` finds “Download PNG”.
- **Czech synonyms of PlantUML keywords** — `účastník` finds “Insert: participant”, `fronta` finds “queue”, `výčet` finds “Enum”.

The match is highlighted in the list. With an empty field the palette first offers the **most recently used** commands (remembered in the browser), then all the others by category. Delete commands are ranked after the others on an equal score, so that Enter does not hit “Delete version” when you were searching for “version”.

### Controls

| Key | Action |
|-----|--------|
| ↑ / ↓ | Move the selection (cyclically) |
| Page Up / Page Down | Move by eight |
| Home / End | First / last item |
| Enter | Run the highlighted command |
| Esc | Close the palette |

Everything also works with the mouse — by clicking an item. The palette is built as a `combobox` + `listbox` with `aria-activedescendant`, so screen readers read it correctly as well.

### What the palette contains

| Category | Commands |
|----------|----------|
| **Project** | New, load from a file and from the clipboard, save, save as `.pup`, paste to clipboard, rename, import `.puml` and `.pupe`, project settings |
| **GitHub / GitLab** | Settings, load, save, save PNG, copy link |
| **Diagrams** | New diagram (also a separate command for each of the 14 types), new folder, **opening any diagram by name**, next/previous diagram, renaming, export and deletion of a folder |
| **Diagram** | Rename, move, duplicate, export, delete, settings, save version, **restore / show / delete a specific version**, **set the workflow status**, hiding elements and toggling its application |
| **Authoring** | **Inserting every element of the open diagram** (read directly from the toolbar, so the palette knows exactly the same elements), the done/not done filter, jumping to the tree and to the element detail |
| **Output** | Preview inline and in a window, projection, PNG, PNG to the repository, `.puml`, copying the source, text description, MD and DOCX document, jumping to the source and to the description |
| **View** | The tabs Diagram / Authoring / Output, the project view, interface language, filtering diagrams by status, closing the debug output |
| **Shared elements** | Jump to the first use, deletion from the project catalog |
| **Help** | Help for the application, help for the palette |

The palette offers **only what can be run right now** — commands over an open diagram do not appear at all in the project view, so there are no dead ends.

---

## GitHub and GitLab as storage

The project (the `.pup` file) and the rendered images of diagrams can be saved straight to a repository on **GitHub** or on **GitLab** — on gitlab.com and on your own (on-prem) server. Every save is an ordinary commit, so the version history arises by itself and there is nothing to transfer by hand.

The settings are opened by the **GitHub / GitLab** button in the header (Alt+G) — it is available in both views, so also while a diagram is open.

### File path

The path is entered in a single field and **the provider is recognized from its shape**:

| Provider | Shape | Example |
|----------|-------|---------|
| GitHub | `owner/repo/path/project.pup` | `egdilna/diagramy/architektura/model.pup` |
| GitLab (gitlab.com) | `group/project/-/path/project.pup` | `egdilna/diagramy/-/architektura/model.pup` |
| GitLab (own server) | `server/group/…/project/-/path/project.pup` | `git.firma.cz/archi/diagramy/-/model.pup` |

The separator `/-/` is used by GitLab in its web addresses, so you can **paste the address of a file straight from the browser**, even with `…/-/blob/branch/…` — in that case that branch is used, otherwise the default branch of the project. Groups may be nested. For a server on plain http, write `http://` at the beginning (a page on https will, however, block such a request). Below the field it immediately shows how the editor understood the path (provider, server, project, branch).

The path is remembered in the project (key `ghPath`) and in the browser, so you only need to enter it once. **A new project deliberately forgets the path**, so that saving does not overwrite an existing file in the repository with an empty project.

### Tokens

| Situation | Token |
|-----------|-------|
| Reading a public repository | not needed |
| Reading a private repository | needed |
| Writing (project and PNG) | always needed |

- **GitHub** — a Personal Access Token with the permission *Contents → Read and write*. It is stored only in this browser (`localStorage`, key `plantuml.editor.github.token`) and sent exclusively to `api.github.com`.
- **GitLab** — a Personal Access Token **for each server separately** (`localStorage`, key `plantuml.editor.gitlab.tokens`, a server → token map), sent only to that server. Scope `api` (or `read_api` + `write_repository`), role in the project at least Developer. After you enter a GitLab path, the **GitLab server** field is filled in by itself and the link “Create a token on the server” leads to the right server.

The **Save tokens** button saves the GitHub token and the GitLab token for the filled-in server; an empty field removes the token. For a private project GitLab returns 404, the same as for a non-existent file — when loading without a token fails, the editor opens the settings and says for which server the token is missing.

### Own GitLab server and Chrome “Local network”

Chrome (since version 142) wants the **Local network** permission (Local network access) for requests from a public page to an internal network. Whoever dismisses its single prompt has a dead connection, and it looks like an unavailable server even though everything works for colleagues on the same network. That is why, for your own server (not gitlab.com), the settings show a **prominent box** with the live state of the permission, instructions and a **Test connection** button (a real request to `/api/v4/version`, which triggers the Chrome prompt). When the request fails, the message distinguishes a denied permission, http instead of https and other cases (network, a corporate CA certificate) — for those it advises opening the API address directly.

### Loading and saving

| Button | What it does |
|--------|--------------|
| Load from repository | Reads the file from the repository and opens it as the current project |
| Save to repository | Writes the current project to the file (creates it, or overwrites it) |
| Save diagram PNG | Renders the current diagram and saves the image next to the project file |
| Copy link | Copies the static address that opens the project right away |

**Protection against overwriting:** the editor remembers in which version it loaded the file. If someone else has saved it in the repository in the meantime — or you never loaded it into the editor and the file already exists — nothing is written and the editor asks whether to overwrite the file. The older version stays in the repository history. PNG images are always overwritten (that is intentional).

Large projects work in both directions: on GitHub, files over 1 MB are read through the Git Blob API and written through the Git Data API (blob → tree → commit → moving the branch without overwriting other people's commits), on GitLab writing always goes through the Commits API and reading through the Files API, with `/raw` as a fallback.

### Saving images (PNG)

The **Save PNG to repository** button on the Output tab (Alt+P) — and the same button in the settings dialog — renders the current diagram through `plantuml.com` and saves the resulting PNG **to the same folder as the project file**.

The file name is built from the diagram name **without diacritics and without spaces** — spaces and special characters are replaced by a hyphen, so that the address stays readable and does not have to be percent-encoded:

| Diagram | File |
|---------|------|
| Průběh procesů vyřazování | `Prubeh-procesu-vyrazovani.png` |
| Přihlášení uživatele | `Prihlaseni-uzivatele.png` |
| Diagram #1 (v2.0) | `Diagram-1-v2-0.png` |

Files downloaded to disk (Download PNG, `.puml`, project) **keep** the original Czech name — only names that end up in an address are simplified.

The same name means that the **older version of the image is overwritten**. That is intentional: links to the image (for example from a wiki or documentation) stay valid and always point to the current form of the diagram.

### Image address and Markdown

Right above the preview on the Output tab there is the address of the image in the repository — on GitHub `raw.githubusercontent.com/…`, on GitLab `server/group/project/-/raw/branch/…` — and three buttons:

| Button | What it does |
|--------|--------------|
| Copy URL | Copies the image address to the clipboard |
| Copy Markdown | Copies `![diagram name](address)` — ready to paste into a wiki or a README |
| Open image | Opens the address in a new tab |

```
https://raw.githubusercontent.com/egdilna/diagramy/main/architektura/Prihlaseni-uzivatele.png
https://git.firma.cz/archi/diagramy/-/raw/main/Prihlaseni-uzivatele.png
```

The address is composed of the path in the repository and the diagram name, so it is visible **even before the first save** — it is clear where the image will go. The image name is without diacritics and spaces (see above); the rest of the path, which you entered in the settings, is percent-encoded to be safe, so that the link in Markdown holds as a whole. The branch is determined from the repository (`default_branch`), with GitLab it can also be given by the path (`…/-/blob/branch/…`); until it responds, `main` is shown and the address then corrects itself. After saving, a confirmation “✔ Saved at HH:MM” appears next to the buttons — after the diagram is renamed it disappears, because the address now points to a different file.

For a **private repository** the raw address does not work without signing in; for a public repository it is a permanent link that after every save points to the current form of the diagram.

### Static project address

The **Copy link** button gives an address of the form:

```
https://egdilna.github.io/nastroje/plantuml/?gh=ZWdkaWxuYS9kaWFncmFteS9hcmNoaXRla3R1cmEvbW9kZWwucHVw
```

The `gh` parameter is the file path encoded in base64 — it works for both GitHub and GitLab. After opening such an address the project is loaded straight from the repository; if the token for the given GitLab server is missing, the settings open with the server filled in — useful for bookmarks and for sharing with colleagues (who need their own token for a private repository). The same address is also filled into the browser's address bar after every load and save.

### Saving with the Alt+S shortcut

When a repository path is set, the **Save project** button and the **Alt+S** shortcut save to the repository — not to disk. If the token is missing, the application announces it and opens the settings dialog. Without a set path the original behavior remains, that is, downloading a `.pup` file.

---

## Export, import and sharing

| Action | Shortcut | Description |
|--------|----------|-------------|
| Download PNG | Alt+E | Calls `plantuml.com` and downloads the PNG. On a CORS error it opens a window for manual saving |
| Preview (SVG) | Alt+V | Opens the SVG on plantuml.com in a new window |
| Download .puml | Alt+U | Saves the source code as a `.puml` file |
| Copy source | Alt+C | Puts the PlantUML code into the clipboard (fallback: selection in the textarea + Ctrl+C) |
| Save project | Alt+S | Saves the project to the repository (GitHub / GitLab), or (without a set path) downloads the `.pup` JSON |
| Save PNG to repository | Alt+P | Saves the diagram image next to the project file in the repository |
| Copy image URL / Markdown | — | The raw address of the image in the repository, alone or as `![name](address)` |
| Load from repository / Save to repository | Alt+G | The GitHub / GitLab settings dialog (path, tokens, link) |
| Copy to clipboard | Ctrl+Shift+S | Copies the project JSON to the clipboard |
| Load project | Alt+O | Opens any file with auto-detection (.pup / .pupe / .puml) |
| Load from clipboard | Ctrl+Shift+O | Loads a project from the clipboard contents |
| Import .puml | Alt+M | Adds an existing PUML as a new diagram |
| Import .pupe | — | Imports diagrams / folders from a transfer package |
| Export (.pupe) | — | Exports the current diagram as a transfer package |

### Reliability of .puml import

The diagram type is recognized in three steps, from the most reliable:

1. **The `@start<type>` wrapper** — `@startebnf`, `@startmindmap`, `@startwbs`, `@startgantt`, `@startchronology`. An unambiguous determination, it always takes precedence.
2. **The editor marker** — into every own output inside `@startuml` a comment line `' puml-editor:type=<type>` is written. PlantUML ignores lines starting with an apostrophe, so it does not show up in the image, but the import uses it to recognize the type with certainty.
3. **Markers in the content** — for foreign files. They are tried from the most specific (`nwdiag {`, `robust "…"`, `[*] -->`) to the most general.

Accordingly:

- **Own output**: a round-trip for **all fourteen types** — an exported `.puml` imports as the same type and generates an identical source again.
- **Foreign PUML**: best-effort, more complex constructs may be omitted. A type that the editor does not know (`@startjson`, `@startsalt`, …) is rejected by the import with a message that names it — instead of producing a half-empty diagram of a different type.

Actions in activity diagrams support three syntactic variants (modern `:text; <<stereo>>`, the old prefix `<<stereo>>#color:text;` and the very old suffix `:text<`). After the import we recommend checking Validation and refining the data in the forms.

---

## Keyboard shortcuts

### Global (Alt+letter)

| Shortcut | Action |
|----------|--------|
| Alt+N | New project |
| Alt+O | Load project |
| F1 | **Command palette** (Shift+F1 = help for it) |
| Alt+S | Save project (when a repository path is set) |
| Alt+M | Import .puml |
| Alt+G | GitHub / GitLab settings |
| Alt+H | Help (with a link to the full guide) |
| Alt+B | ← Back to project (in the diagram view) |
| Alt+D | New diagram |
| Alt+F | New folder |
| Alt+W | Save diagram version |

### Ctrl+Shift combinations

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+P | Command palette (in Firefox use F1) |
| Ctrl+Shift+O | Load project from the clipboard |
| Ctrl+Shift+S | Paste project to the clipboard |

### Preview, projection, export (Output tab)

| Shortcut | Action |
|----------|--------|
| Alt+L | Side preview (live preview on the Authoring tab) |
| Alt+V | Preview (SVG) in a window |
| Alt+I | Project / Redraw projection |
| Alt+E | Download PNG |
| Alt+P | Save PNG to repository |
| Alt+U | Download .puml |
| Alt+C | Copy source to the clipboard |
| Alt+T | Generate text description |

### Navigation in trees (diagrams and elements)

| Key | Action |
|-----|--------|
| Up/Down arrow | Switch between items |
| Left/Right arrow | Switch between the link and the action buttons (↑ ↓ ×) |
| Home | Jump to the first item |
| End | Jump to the last item |
| Tab | Standard tab navigation |

### Tabs in the diagram view

| Key | Action |
|-----|--------|
| Left/Right arrow | Switch between tabs (Diagram / Authoring / Output) |
| Home / End | First / last tab |

### Dialogs

| Key | Action |
|-----|--------|
| Enter | Confirm (in a single-line input) |
| Ctrl+Enter | Confirm in a textarea (Enter in a textarea makes a new line) |
| Esc | Cancel the dialog |

---

## Themes

The application offers a choice of 32 official PlantUML themes:

`amiga`, `aws-orange`, `black-knight`, `bluegray`, `blueprint`, `cerulean`, `cerulean-outline`, `crt-amber`, `crt-green`, `cyborg`, `hacker`, `lightgray`, `mars`, `materia`, `materia-outline`, `metal`, `mimeograph`, `minty`, `mono`, `plain`, `reddress-darkblue`, `reddress-darkgreen`, `reddress-lightblue`, `sandstone`, `silver`, `sketchy`, `sketchy-outline`, `spacelab`, `superhero`, `toy`, `united`, `vibrant`.

A theme is set in the **Project settings** or **Diagram settings** dialog and is inserted into PlantUML as the directive `!theme name`.

### Custom skinparam

The **Custom skinparam** field accepts one parameter per line, without the keyword `skinparam` (it is added automatically):

```
backgroundColor #fefefe
defaultFontName Verdana
```

### Visual directives for the class diagram

In the diagram settings (only for `class`) you can check:

- Hide empty members (`hide empty members`)
- Hide empty attributes (`hide empty attributes`)
- Hide empty methods (`hide empty methods`)
- Hide the circle symbol (`hide circle`)
- Hide stereotypes (`hide stereotype`)

---

## Multilingual support

The language switch is in the right part of the header (**Czech** / **English**). The choice is saved to `localStorage` under the key `plantuml.editor.lang` and is kept between sessions. The language affects:

- UI texts (buttons, field labels, status messages)
- Dialog titles and the help
- Generated text descriptions of diagrams (Czech / English wording)

Internal values (element types, stereotypes, status codes) remain language-independent.

---

## Technical information

### Architecture

- A single HTML file contains everything — markup, CSS, JavaScript
- No external libraries (except `docx.min.js` from a CDN, which is downloaded only at the first DOCX export)
- Vanilla JavaScript, semantic HTML and ARIA for accessibility
- No build process

### URL format for plantuml.com

The application encodes the source code into the hexadecimal format (`~h{hex}`) and builds the URL:

```
https://www.plantuml.com/plantuml/svg/~h{hex}
https://www.plantuml.com/plantuml/png/~h{hex}
```

Only the content of the current diagram is sent to the server — no data about the project, the author or other diagrams.

### Project format (.pup)

A project is a JSON file with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | number | Schema version (currently 1) |
| `projectName` | string | Project name |
| `created`, `modified` | ISO date | Timestamps |
| `settings` | object | Project settings (theme, skinparam, header, footer, title, caption) |
| `folders` | array | Folders `{id, name, parentId}` |
| `diagrams` | array | Diagrams `{id, name, type, folderId, status, settings, model, done, hidden, versions}` |
| `sharedElements` | array | Shared entities `{alias, kind, name, ...}` |

### Transfer package format (.pupe)

JSON with the fields `pupeVersion`, `kind` (`diagram` or `folder`), the content of the exported item (including versions, settings and the shared elements used) and a map of the `sharedElements` used.

### Format migration

When a project is loaded, older formats are migrated automatically. For example, the old property `shape` of actions in activity diagrams is converted to the new `stereotype` according to the mapping of legacy characters:

| Legacy character | New stereotype |
|------------------|----------------|
| `]` | `task` |
| `<` | `input` |
| `>` | `output` |
| `|` | `procedure` |

### Generated PlantUML syntax

- Activity diagrams — the modern “beta” variant (`:text; <<stereotype>> <<#color>>`)
- Class diagrams — the color in a relationship as `[#color]` placed into the arrow
- Timing — `robust`/`concise`/`binary`/`clock`/`analog`/`rectangle` with parameters (`with period`, `pulse`, `offset`, `between … and …`)
- Mindmap / WBS — a `<style>` block with stereotypes generated from the definitions
- Gantt — `Project starts YYYY-MM-DD`, `printscale`, `saturday/sunday are closed`, specific dates for holidays, `today is …`, completion percentages as `[alias] is N% completed`
- nwdiag — inside `@startuml` as a `nwdiag { … }` block (so that title/header/footer work)

On import, older variants of the notation are recognized as well.

### Debug

If an error occurs while generating PlantUML code or on import, a debug output is shown in a box at the bottom right (`#debug`). The box can be closed with the **Close** button. Debug messages are **not written to the browser console** — they are right in the UI, so that they are available to screen readers too.

### Compatibility

The application works in modern browsers (Chrome, Firefox, Edge, Safari). It requires an internet connection only for:

- Rendering the diagram (access to `plantuml.com`)
- DOCX export (downloading the library from a CDN on first use)

The editor, the model, saving the project, PUML generation, MD export, file preview — everything else works offline.

---

## Glossary

| Term | Explanation |
|------|-------------|
| PlantUML | A text language for describing UML diagrams, with a rendering server |
| `.pup` | PlantUML Project — the storage format of a project of this application (JSON) |
| `.pupe` | PlantUML Editor Export — a transfer package with a diagram or a folder |
| `.puml` | The standard extension of a file with PlantUML source code |
| Alias | A short identifier of an entity without diacritics and spaces for use in PlantUML code |
| Stereotype | A classification of an element in UML, written as `<<stereotype>>` |
| Cardinality | The multiplicity of a relationship — how many instances of one side correspond to one instance of the other |
| Swimlane | A vertical area in an activity diagram representing responsibility (a role, a department) |
| Skinparam | A PlantUML directive for graphical settings (colors, fonts, etc.) |
| Theme | A predefined set of visual settings (skinparam parameters) |
| Snapshot | A recorded state of the model and diagram settings for versioning purposes |
| Round-trip | The export → import process without loss of information |
| Shared element | An entity common to the whole project; one definition, used in many diagrams |
| Lollipop notation | Rendering an interface as a circle `()` instead of a rectangle |
| Cross-references | Automatically computed relationships, parent and nested elements in the detail |
| Cascade | A value from the project is used if the diagram has none of its own; the diagram takes precedence |
| nwdiag | A PlantUML extension for network diagrams |
| EBNF | Extended Backus-Naur Form — a formal notation of grammars |
| WBS | Work Breakdown Structure — a hierarchical breakdown of a project |

---

*The documentation corresponds to the state of the PlantUML editor application at the date of release. The tool is developed as part of the eGdilna initiative.*
