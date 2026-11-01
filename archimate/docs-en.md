# ArchiMate Editor - User Guide

Web-based editor for creating and managing architectural models according to the ArchiMate 3.2 standard with extensions for Architecture Decision Records (ADR), notes, and tasks management.

## Online Version and Links

- **The tool:** https://nastroje.egdilna.cz/archimate
- **Tool page:** https://nastroje.egdilna.cz/#archimate
- **Source code:** https://github.com/egdilna/nastroje

In the repository you will find:
- The editor as a single HTML file (`archimate/index.html`) — downloadable and usable offline
- Application documentation in Czech and English
- JSON Schema for AJX format validation (`ajx-schema.json`)

---

## Table of Contents

1. [Introduction](#introduction)
2. [AJX Format](#ajx-format)
3. [Editor Interface](#editor-interface)
4. [Model Management](#model-management)
5. [Working with Elements](#working-with-elements)
6. [Working with Relationships](#working-with-relationships)
7. [Diagrams](#diagrams)
8. [Tasks](#tasks)
9. [Notes](#notes)
10. [Architecture Decision Records (ADR)](#architecture-decision-records-adr)
11. [Text Generator](#text-generator)
12. [Import and Export](#import-and-export)
13. [Model Merging](#model-merging)
14. [Tag Management](#tag-management)
15. [Change Log](#change-log)
16. [GitHub Integration](#github-integration)
17. [Tips and Tricks](#tips-and-tricks)
18. [Keyboard Shortcuts](#keyboard-shortcuts)
19. [ArchiMate Reference Guide](#archimate-reference-guide)

---

## Introduction

ArchiMate Editor is a complete tool for enterprise architecture modeling according to the ArchiMate 3.2 specification by The Open Group. The editor runs directly in the browser without installation and stores data locally in the browser.

### Main Features

- **ArchiMate 3.2** - support for all 60 element types and 11 relationship types with validity checking
- **Multilingual interface** - Czech and English
- **Auto-save** - data is saved to the browser
- **Import/export** - AJX (JSON) and ArchiMate Open Exchange XML formats
- **Model merging** - import selected parts from another model
- **Tasks** - tracking and management of architecture development tasks
- **Notes** - Markdown notes with versioning
- **ADR (Architecture Decision Records)** - architecture decision management
- **Text generator** - documentation creation from model using templates
- **Diagrams** - visual editor with drag & drop and SVG/PNG export
- **Bulk operations** - working with tags and bulk edits of elements and relationships
- **Markdown and Word export** - tasks, ADR and diagrams as `.md` or `.docx`
- **CSV/TSV import** - bulk element loading from a table with column mapping
- **Change log** - overview of all changes made in the current session
- **Accessibility** - fully accessible interface for screen readers
- **GitHub and Git integration** - load and store models in a Git repository through an
  API token, so private repositories work too

---

## AJX Format

**AJX (ArchiMate JSON eXchange)** is a standard format for ArchiMate model exchange based on JSON. Files have the `.ajx` extension.

### AJX File Structure

```json
{
  "exportDate": "2025-01-15T10:30:00.000Z",
  "archimateVersion": "3.2",
  "model": {
    "id": "id-model-001",
    "name": "Model Name",
    "version": "1.0",
    "documentation": "Model description",
    "dublinCore": { ... },
    "properties": []
  },
  "elements": [...],
  "relationships": [...],
  "diagrams": [...],
  "adr": [...],
  "notes": [...],
  "tasks": [...]
}
```

### AJX Format Extensions

The editor uses the standard AJX format for ArchiMate models and adds three extensions:

- **adr** - Architecture Decision Records
- **notes** - Notes with Markdown support and versioning
- **tasks** - Tasks for architecture development management

Detailed specification of all fields is in the `ajx-schema.json` file (JSON Schema).

### AJX Format Benefits

- Human and machine readable
- Easy to version in Git
- Simple integration with other tools
- Validatable using JSON Schema
- More compact than XML

---

## Editor Interface

### Header

In the header you will find:
- **Model name** - click to go to the Model tab
- **Model version** - displays the current version
- **Statistics** - number of elements, relationships, diagrams, and layers
- **Language switcher** - CZ/EN
- **Quick actions** - 📄 **New** (Alt+N), 📂 **Open** (Alt+O) and 💾 **Save** (Alt+S or Ctrl+S)

The **Save** button decides by itself: when a GitHub path and a stored token are present,
it saves the model to GitHub, otherwise it downloads an AJX file.

### Tabs

The editor is divided into ten main tabs:

1. **Model** - metadata and model settings
2. **Elements** - architectural elements management
3. **Relationships** - relationship management between elements
4. **Diagrams** - view creation and management
5. **Tasks** - task tracking and management
6. **Notes** - text notes with Markdown
7. **ADR** - architecture decisions
8. **Tools** - change log, tag management and text generator
9. **Export/Import** - data exchange with other systems
10. **Reference** - ArchiMate specification overview

---

## Model Management

### Basic Information

- **Model ID** - unique identifier (auto-generated)
- **Model name** - displayed in the header
- **Version** - model versioning
- **Documentation** - detailed model description (supports Markdown)

### Dublin Core Metadata

Standardized metadata according to ISO 15836:

| Field | Description |
|-------|-------------|
| Creator | Author or responsible person |
| Publisher | Organization responsible for publication |
| Date | Creation or publication date |
| Language | Content language (cs, en, de...) |
| Rights | License information |
| Subject | Topic or keywords |
| Description | Brief content description |

### Custom Properties

You can add any number of custom properties in key-value format. Use the **Add Property** button and fill in the name and value.

---

## Working with Elements

### Creating a New Element

1. Select **layer** (Strategy, Business, Application...)
2. Select **element type** - the list is filtered by layer
3. Fill in the element **name**
4. Optionally add:
   - **Stereotype** - type extension (e.g., "microservice")
   - **Defines** - reference to law, standard, or governing document
   - **Tags** - comma-separated tags for categorization
   - **Description** - detailed documentation (supports Markdown)
5. Click **Save Element**

### Automatic ID Generation

Element ID is automatically generated from type and name:
- `BusinessProcess` + "Order Processing" → `bp-order-processing`

### Element Operations

| Action | Description |
|--------|-------------|
| **Edit** | Opens the element in the form below the table |
| 📋 | Duplicates the element (copy with a new ID) |
| **Delete** | Deletes the element and its relationships |

The element name in the table is a link to its relationships — clicking it switches to the
Relationships tab filtered to that element. The **Diagrams** column shows which diagrams
the element appears on.

Next to the element name there are also small **Z:** (from) and **Do:** (to) buttons with
the number of outgoing and incoming relationships. Clicking one opens a popup listing those
relationships, so there is no need to switch to the Relationships tab and filter.

### Bulk Element Operations

Checking elements in the first column (or the toggle in the table header) reveals a bulk
action panel above the table:

| Action | Description |
|--------|-------------|
| Change type | Overwrites the type of all selected elements |
| Change stereotype | Sets the same stereotype |
| Change defines | Sets the same value of the Defines field |
| Change description | Sets the same description |
| Add tags | Adds tags (comma-separated) to the selected elements |
| Delete selected | Deletes the selected elements and their relationships |

### Filtering Elements

Above the table are filters:
- **Layer** - filter by layer
- **Type** - filter by element type
- **Stereotype** - filter by stereotype
- **Tags** - filter by tags (including "no tags")
- **Diagram** - filter by diagram membership
- **Search** - full-text search

The **Clear Filters** button clears all filters.

### Sorting and Columns

- **Sorting** - click on column header
- **Column hiding** - "Columns" button to select visible columns

---

## Working with Relationships

### Cascading Selection

The relationship form uses intelligent cascading selection:

1. **Source layer** → filters source element types
2. **Source type** → filters specific source elements
3. **Source element** → select specific element
4. **Target layer** → filters target element types
5. **Target type** → filters specific target elements
6. **Target element** → select specific element
7. **Relationship type** → shows only allowed types per specification

### Relationship Validity Check

The editor automatically checks if the relationship is allowed according to ArchiMate 3.2. Invalid combinations are not in the menu.

### Statement Preview

After selecting source, target, and relationship type, a preview is displayed as a sentence:
> "Source element **serves** Target element"

### Filtering Relationships

- **Source element** - filter by source
- **Target element** - filter by target
- **Relationship type** - filter by type
- **Tags** - filter by tags
- **Diagram** - filter by diagram membership
- **Search** - full-text search

### Quick Filter from Elements Table

In the elements table, you can click on the relationship count to go to a filtered list of relationships for that element.

### Bulk Relationship Operations

Relationships can be checked and edited in bulk the same way as elements:

| Action | Description |
|--------|-------------|
| Change relationship type | Overwrites the type of all selected relationships |
| Change source / Change target | Repoints the selected relationships to another element |
| Change name | Sets the same name |
| Change description | Sets the same description |
| Add tags | Adds tags to the selected relationships |
| Delete selected | Deletes the selected relationships |

---

## Diagrams

Diagrams (views) allow organizing elements into logical groups and visualizing their relationships.

### Creating a Diagram

1. Enter **diagram name**
2. Optionally add **description**
3. Click **Create Diagram**

### Diagram List

- The diagram name is a link that opens the diagram editor
- The **↑** and **↓** buttons change the diagram order in the model
- **✏️ Visually** opens the visual editor, **Edit** the catalog editor
- Check diagrams and use **📝 Export MD**, **📋 Copy MD** and **📄 Export DOCX** to export
  the selected diagrams into one document (**☑️ Select All** checks them all)

### Diagram Editor

The editor has four sub-tabs:

#### Settings

- **Diagram name** and **description**
- **Element layout** - By layers (layered) or Grid; used when the preview is laid out
  automatically

#### Elements

- Adding elements using cascading selection (layer → type → element) with a filter in the
  element list
- Table of elements on the diagram with a removal option

#### Relationships

- The table shows relationships whose source and target are both on the diagram
- Another relationship can be added by searching its source, target, name or description

#### Preview

Visual diagram preview:
- Elements are displayed as ArchiMate notation shapes colored by layer
- Relationships are displayed as lines with appropriate markers
- Automatic layout by layers (layered) or grid
- The **Redraw** button recalculates the preview

### Visual Diagram Editor

The editor includes an advanced visual editor for interactive diagram editing.

#### Opening the Visual Editor

- In the diagrams table, click the **✏️ Visually** button
- In the diagram preview, click **✏️ Edit Visually**

#### Visual Editor Interface

The editor opens in a fullscreen modal window with these parts:

- **Left panel (Palette)** - list of available elements grouped by layer
- **Center (Canvas)** - workspace with grid for editing
- **Right panel (Properties)** - properties of selected element or relationship

#### Working with Elements

- **Adding element** - drag element from palette to canvas or double-click
- **Moving** - click and drag element to new position
- **Resizing** - use corner handles of selected element
- **Removing** - select element and click "Remove from diagram" in properties panel

#### Working with Relationships

- Relationships are automatically created between elements that have a relationship in the model
- **Hiding relationship** - in the properties panel you can hide a relationship
- Relationships are redrawn automatically when elements are moved

#### Canvas Controls

- **Zoom** - +/- buttons in toolbar or mouse wheel
- **Zoom 1:1** - resets zoom to 100%
- **Fit Content** - adjusts zoom to show entire diagram
- **Panning** - middle mouse button or drag on empty canvas

#### Saving

- Click **Save** to save element positions and styles
- Element positions and sizes are saved to the diagram

### Diagram Export

In the diagram preview, export buttons are available:

| Button | Description |
|--------|-------------|
| **Download SVG** | Export diagram as vector SVG file |
| **Download PNG** | Export diagram as raster PNG image (2x resolution) |
| **📄 Export DOCX** | The diagram with its element and relationship lists as a Word document |
| **📝 Export MD** | The same as a Markdown file |
| **📋 Copy MD** | The Markdown form of the diagram to the clipboard |

Several diagrams at once are exported from the diagram list (see above).

---

## Tasks

Tasks are used for tracking and managing architecture work.

### Creating a Task

1. Click **+ New Task** to open the editor
2. The **number** is filled in automatically and can be overwritten
3. Enter task **name**
4. Select **status** and **priority** (Low, Medium, High, Critical)
5. Enter **assignee** and **reporter**
6. Set **due date**
7. Optionally add **tags** (comma-separated)
8. Add **description** and **current state / resolution notes** (both support Markdown)
9. Optionally link to model **elements** or **relationships**

### Task States

| State | Icon | Description |
|-------|------|-------------|
| New | ⚪ | Newly created task |
| In Progress | 🔵 | Task is being worked on |
| Blocked | 🔴 | Task cannot proceed |
| In Review | 🟡 | Task awaits verification |
| Done | 🟢 | Task is completed |
| Cancelled | ⚫ | Task was cancelled |

Priorities have their own icons: 🟢 Low, 🟡 Medium, 🟠 High, 🔴 Critical.

### Filtering Tasks

Above the table are filters by **status**, **priority** and **assignee**, plus a full-text
search (name, assignee, reporter, description, current state, tags).

### Current State

You can add notes about current state to each task (supports Markdown).

### Task Preview and Export

Clicking a task name opens a preview; from the preview and the editor a task can be saved
as **📄 Markdown** or **📝 DOCX**, and **📋 Copy Markdown** puts it on the clipboard.
The **📦 Export All Tasks** button saves all tasks into a single Markdown file.

---

## Notes

Notes are used for recording information related to architecture.

### Creating a Note

1. Click **+ New Note** to open the editor
2. Enter note **title**
3. Enter **author**
4. Write **content** (supports Markdown)
5. Optionally add **tags** (comma-separated) and link to elements/relationships

Above the notes table is a full-text search (title, author, content, tags).

### Note Preview

Clicking the title opens a preview with rendered Markdown, links to the linked items, a
**📋 Copy** button (content to the clipboard) and **📜 Version History**.

### Versioning

Notes have automatic versioning:
- Each change creates a new version
- Version history is available in the note preview
- An older version can be viewed and brought back with **Restore This Version**

---

## Architecture Decision Records (ADR)

ADR (Architecture Decision Records) document important architecture decisions.

### ADR Structure

The ADR editor is split into sections:

- **Basic information** - number (generated automatically), title, status, author,
  approver, deciders, tags
- **Context** - situation leading to the decision
- **Decision** - what was decided
- **Consequences** - decision impacts
- **Considered alternatives** - list of options, the selected one and the selection rationale
- **Implementation** - implementation status (Not started / In progress / Completed),
  start date, target date and notes
- **Related ADR** - Supersedes, Superseded by, Related to
- **Links** - external links with a description
- **Linked items** - model elements and relationships
- **Status history** - automatic record of status changes

### ADR States

| State | Icon | Description |
|-------|------|-------------|
| Draft | ⚪ | Decision is being prepared |
| Proposed | 🔵 | Proposal submitted |
| Under Discussion | 💬 | Under discussion |
| Returned | 🔙 | Returned for rework |
| Accepted | 🟢 | Accepted decision |
| Rejected | 🔴 | Rejected decision |
| Updated | 🔄 | Decision was updated |
| Implemented | 🟣 | Decision is implemented |
| Monitored | 👁️ | Decision is being monitored |
| Deprecated | 🟠 | Decision is deprecated |
| Superseded | ⚫ | Superseded by another ADR |
| Closed | 🔒 | Closed decision |

Above the ADR table is a status filter and a full-text search (title, author, context,
decision, tags).

### Alternatives and Selection

- Add alternatives with title and description
- Select the chosen alternative from dropdown
- Describe the reason for selection

### Status History

Every status change is automatically recorded including date and author.

### ADR Export

- **📄 Save as Markdown** - downloads individual ADR
- **📝 Save as DOCX** - downloads the ADR as a Word document
- **📋 Copy Markdown** - copies to clipboard
- **📦 Export All ADR** - downloads all ADR as one file

The buttons are in the ADR editor as well as in the preview opened by clicking the title.

---

## Text Generator

The generator creates text outputs from the model using templates with placeholders.

### Data Sources

The generator can create text from:
- **Elements** - current elements list (respects filters)
- **Relationships** - current relationships list (respects filters)
- **Tasks** - all tasks
- **Notes** - all notes
- **ADR** - all architecture decision records

### Templates

Enter a template with placeholders in curly brackets:
```
{Name} is a {Type} in the {Layer} layer.
```

### Available Placeholders

#### For Elements
- `{ID}`, `{Název}`, `{Typ}`, `{Vrstva}`
- `{Stereotyp}`, `{Určuje}`, `{Příznaky}`, `{Popis}`

#### For Relationships
- `{ID}`, `{Typ}`, `{Název}`, `{Popis}`, `{Příznaky}`, `{Statement}`
- Source: `{Zdroj}`, `{ZdrojID}`, `{ZdrojVrstva}`, `{ZdrojTyp}`, `{ZdrojStereotyp}`, `{ZdrojUrčuje}`, `{ZdrojPříznaky}`, `{ZdrojPopis}`
- Target: `{Cíl}`, `{CílID}`, `{CílVrstva}`, `{CílTyp}`, `{CílStereotyp}`, `{CílUrčuje}`, `{CílPříznaky}`, `{CílPopis}`

#### For Tasks
- `{ID}`, `{Číslo}`, `{Název}`, `{Stav}`, `{Priorita}`
- `{Řešitel}`, `{Zadavatel}`, `{Termín}`, `{Příznaky}`
- `{Popis}`, `{AktuálníStav}`, `{Vytvořeno}`, `{Aktualizováno}`

#### For Notes
- `{ID}`, `{Název}`, `{Autor}`, `{Příznaky}`
- `{Obsah}`, `{Vytvořeno}`, `{Aktualizováno}`, `{PočetVerzí}`

#### For ADR
- `{ID}`, `{Číslo}`, `{Název}`, `{Stav}`
- `{Autor}`, `{Schvalovatel}`, `{Datum}`, `{Příznaky}`
- `{Kontext}`, `{Rozhodnutí}`, `{Důsledky}`
- `{PočetAlternativ}`, `{VybranáAlternativa}`

### Options

- **Skip empty** - omits items where placeholder would be empty

---

## Import and Export

### Export

| Format | Description |
|--------|-------------|
| **Export AJX** | Download model in AJX (JSON) format |
| **Copy AJX** | Copies AJX data to clipboard |
| **Export XML** | ArchiMate Open Exchange format (including visual data) |
| **Export CSV** | Elements and relationships in one CSV file (two blocks: Elements, Relationships) |

### Export by Tag

A selected tag can be used to export just that part of the model:

1. In the **Export by tag** section pick a tag (the count of matching elements and
   relationships appears below the list)
2. Click **Export AJX** or **Export XML**

The output contains elements carrying the tag, relationships carrying the tag, and also
relationships whose source and target are both in the selection.

### XML Export with Visual Data

When exporting to ArchiMate Open Exchange XML, visual information from diagrams is also saved:
- Element positions (x, y)
- Element sizes (width, height)
- Fill and border colors
- Relationship bendpoints

This information is compatible with Archi tool and other tools supporting ArchiMate Open Exchange format.

### Import

Supported formats:
- **AJX** - ArchiMate JSON eXchange (.ajx)
- **XML** - ArchiMate Open Exchange (.xml)

When importing XML, visual diagram data is also loaded if present in the file.

#### Import Options

1. **From file** - "Select File" button
2. **By pasting** - paste data into text field
3. **From clipboard** - "Paste from Clipboard" button
4. **Drag & Drop** - drag file onto the page

An import replaces the whole content of the editor. The **Delete All** button empties the
model and the data stored in the browser.

### Element Import from CSV/TSV

The **CSV Import** sub-tab loads elements from a table:

1. Select a CSV/TSV file, or paste the data manually or with **📋 Paste from Clipboard**
   (the delimiter is detected automatically)
2. In **Column Mapping** assign columns to the ID, Name, Type, Documentation, Stereotype,
   Tags and Defines fields — unassigned columns are not imported
3. Choose the behaviour **on ID conflict** (skip / overwrite existing)
4. Check the preview and click **Import Elements**

Element type spelling is tolerant (`business actor`, `BusinessActor`, `Business Actor`) and
the layer is derived from the type. Rows with an unknown type are listed as not imported.

---

## Model Merging

Merging allows importing selected parts from another model.

### Merge Strategies

| Strategy | Description |
|----------|-------------|
| Keep existing | On ID conflict, keeps original |
| Overwrite with new | On ID conflict, replaces with new |
| Manual selection | Allows selecting specific items |

### Manual Selection

When choosing "Manual selection":
1. Load the file to merge
2. Switch between **Elements**, **Relationships**, and **Diagrams** tabs
3. Check items to import
4. Click **Merge Models**

### Imported Items Marking

Imported items automatically get the tag `Imported from [source model name]`.

---

## Tag Management

Tags are managed on the **Tools** tab.

### Managing a Single Tag

In the **Tag Management** section pick a tag from the list (collected from the whole model)
and then:

| Operation | Description |
|-----------|-------------|
| Remove from elements / from relationships / Delete everywhere | Removes the tag from that part of the model |
| Replace in elements / in relationships / everywhere | Rewrites the tag to the new spelling from the **Replace with tag** field |
| Unify spelling | Rewrites variants differing only in letter case to the most frequent spelling (in elements, relationships, tasks, notes and ADR) |

The result is printed below the form (how many elements and relationships changed).

### Bulk Tag Management

The **Open Bulk Management** button opens a window for adding or removing one tag on
selected items:

1. Pick the **source** (elements or relationships) and the **action** (add / remove tag)
2. Enter the tag — the list then shows only the items the action makes sense for
3. Check the items: **☑ Select All**, **☐ Deselect All**, or **🔍 Select Filtered**
   (items matching the active filters in the tables)
4. Click **Execute Action**

Tags can also be added straight from the element and relationship tables with the
**Add tags** bulk action.

---

## Change Log

While you work, the editor records every significant change (creating, editing and deleting
elements, relationships, diagrams, tasks, notes and ADR, imports, merges, bulk operations).

On the **Tools** tab, the **📋 Show Change Log** button opens a window listing the changes
since you started working in the browser; the content can be copied to the clipboard and
used as a basis for a commit message or a meeting recap.

The log belongs to the current browser session — closing and reopening the editor starts it
anew.

---

## GitHub Integration

The editor allows saving and loading models directly from a GitHub repository. Each save creates a commit with history.

### Setup

1. Create a **Personal Access Token** at https://github.com/settings/tokens?type=beta
   - Select the repository where you want to save
   - Permissions: Contents → Read and write
2. In the **Export/Import** tab, find the **GitHub Integration** section
3. Paste the token and click **Save token**
4. Enter the file path in format `owner/repo/path/file.ajx`

### Usage

| Button | Description |
|--------|-------------|
| **📥 Load from GitHub** | Loads model from the specified path |
| **📤 Save to GitHub** | Saves model to the specified path (creates commit) |
| **🔗 Copy link** | Copies direct link to the model |

### Direct Links

The file path is encoded in the URL parameter `?gh=...`, so you can share a direct link to a specific model. When opening the link, the model is automatically loaded from GitHub.

### Security

- Token is stored only in browser localStorage
- Token is never saved to the data file or URL
- For public repositories, token is only needed for writing
- For private repositories, token is needed for reading too

---

## Tips and Tricks

### Auto-save

Model is automatically saved to browser after each change.

### Several Models at Once

The browser window title contains the name of the open model (`Model name - ArchiMate
Editor`), so several tabs with different models can be told apart.

### Suggestions

- **Stereotypes** - offers previously used stereotypes
- **Tags** - offers existing tags from elements and relationships; the filters offer tags
  from the whole model including ADR, notes and tasks
- **Relationship names** - offers previously used names

### Linking Items

Tasks, notes, and ADR can be linked to model elements and relationships. Linked items are clickable in previews.

### Shared Tags

Tags are shared between elements, relationships, tasks, notes, and ADR. This enables easy linking of related items.

**Tags are case-insensitive.** "Shared elements", "shared elements" and "SHARED ELEMENTS" are one and the same tag — in filters, tag suggestions, search, bulk operations and export by tag. When you enter a tag, the spelling already established in the model is reused; the **Unify spelling** button in Tools → Tag Management rewrites older variants to the most frequent spelling.

### Markdown Support

Markdown is supported in:
- Model documentation
- Element and relationship descriptions
- ADR (context, decision, consequences, alternatives)
- Notes
- Task description and state

### Backup

Regularly export the model to an AJX file. Browser data may be deleted when clearing history.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S / Cmd+S | Save the model (to GitHub, otherwise to a file) |
| Alt+N | New model |
| Alt+O | Open file |
| Alt+S | Save model |
| Alt+E | Elements tab |
| Alt+R | Relationships tab |
| Alt+D | Diagrams tab |
| Alt+M | Notes tab |
| Alt+T | Tools tab |
| Alt+U | Save relationship (in the relationship form) |
| Tab | Move between form fields |
| Enter | Confirm form |

The Alt shortcuts are `accesskey` values — depending on the browser they are pressed as
Alt, Alt+Shift (Firefox) or Ctrl+Option (Safari). Modal windows are closed with the **×**
button, the **Close** button, or by clicking outside the window.

---

## ArchiMate Reference Guide

### Layers

| Layer | Color | Description |
|-------|-------|-------------|
| Strategy | Brown | Strategic elements - resources, capabilities |
| Business | Gold | Business elements - actors, processes, services |
| Application | Blue | Application elements - components, services, data |
| Technology | Green | Technology elements - nodes, devices |
| Physical | Dark Green | Physical elements - equipment, facilities |
| Implementation | Purple | Implementation elements - packages, deliverables |
| Motivation | Red | Motivation elements - stakeholders, goals |
| Composite | Gray | Composite elements - locations, groupings |

### Relationship Types

| Type | Category | Description |
|------|----------|-------------|
| Composition | Structural | Element consists of other elements |
| Aggregation | Structural | Element groups other elements |
| Assignment | Structural | Assignment of active element to behavior |
| Realization | Structural | Element realizes another element |
| Serving | Dependency | Element provides functionality |
| Access | Dependency | Element accesses data |
| Influence | Dependency | Element influences another element |
| Triggering | Dynamic | Element triggers another element |
| Flow | Dynamic | Information or material flow |
| Specialization | Other | Element is specialization of another |
| Association | Other | Unspecified relationship |

---

## Support

The editor is an open-source tool available on GitHub.

- **The tool:** https://nastroje.egdilna.cz/archimate
- **Tool page:** https://nastroje.egdilna.cz/#archimate
- **Source code:** https://github.com/egdilna/nastroje
- **Bug reports:** https://github.com/egdilna/nastroje/issues

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- localStorage required for saving

### Known Limitations

- Data is stored locally in the browser
- Model may be deleted when clearing browser data
- Regular backup exports recommended

---

*Documentation version: 3.1 (1 November 2026)*
*ArchiMate® is a registered trademark of The Open Group.*
