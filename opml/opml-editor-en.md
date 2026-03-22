# Hierarchical OPML Editor

A powerful web-based editor for creating hierarchical lists, tasks, and projects in OPML format. Ideal for outlining, GTD, project planning, and organizing thoughts.

**[Open editor online](https://mrt.site44.com/opml-editor.html)** | [Download for offline use](https://mrt.site44.com/opml-editor.html)

> The editor is a single HTML file with no dependencies. Download it and run it locally or on your own server.

---

## Why this editor?

- **Unlimited hierarchy** – Nest items to any depth
- **OPML format** – Standard format compatible with many applications
- **Project management** – Track deadlines, completion percentages, and Gantt charts
- **No registration** – Everything runs locally, data stays with you
- **Fully accessible** – Designed for screen readers and keyboard navigation

---

## Basic Usage

### Working with Items

- **➕ Add Item** – Creates a new top-level item
- For each item you can:
  - ☑️ Mark as completed (checkbox)
  - Add notes (multi-line text)
  - Create child items
  - Move up/down or change level

### Two Display Modes

- **Edit mode** – Compact view with inline editing
- **View mode** – Clean display with visual change indicators

### Saving

- **Save OPML** – Downloads file (modern browsers open a location picker dialog)
- **Copy URL** – Creates a link containing the entire document
- **Copy as Markdown** – For pasting into other tools

---

## Advanced Features

### 📊 Project Management

Add project attributes to item notes:

```
Type: Project
Status: In Progress
Start: 2025-01-01
End: 2025-03-31
Completion: 45
```

The editor automatically:
- Displays a project table with subtask overview
- Calculates completion percentage from child items
- Determines earliest Start and latest End from descendants
- Shows remaining time until deadline
- Warns about overdue items 🚨

### 📈 Gantt Chart

Items with project data show a **📊** button. Click to open an interactive Gantt chart:

- Timeline with days and months
- Color-coded bars by status (not started / in progress / completed / overdue)
- Completion percentage display
- Today highlighted
- Fully accessible for screen readers

### 🧹 Delete Completed

Items with completed children show a **🧹** button that removes all completed descendants with one click.

### 📥 Import OPML into Section

The **📥** button allows importing another OPML file as a subtree of the selected item. Ideal for:
- Inserting templates (meeting notes, project structure)
- Combining multiple documents
- Reusing structures

### 📋 Copy to Clipboard

The **📋** button copies the item name and notes to clipboard.

### 🎯 Focus (Hoist)

Click **🎯** to show only the selected branch. Breadcrumb navigation allows quick return or navigation to parent items.

### 🔍 Search and Filtering

- **Full-text search** – Searches names and notes
- **Hide completed** – Shows only incomplete items
- **Filter by tags** – Tags in notes like `#urgent` or `#waiting`
- **Alphabetical tag sorting** – Easy navigation through many tags

### 📊 Statistics

The toolbar shows current statistics:
- Total item count
- Completed count
- Completion percentage

---

## Accessibility

The editor is fully accessible:

- **Keyboard navigation** – All actions without mouse
- **ARIA attributes** – Semantic markup for screen readers
- **High contrast** – WCAG 2.1 AA compliant colors
- **Visible focus** – Clearly highlighted active element
- **Gantt chart** – ARIA roles and labels, screen reader friendly
- **Modal dialogs** – Proper focus management and Escape to close

---

## OPML Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>My Document</title>
  </head>
  <body>
    <outline text="Item 1" _checked="false">
      <_note>Item notes</_note>
      <outline text="Child item" _checked="true"/>
    </outline>
  </body>
</opml>
```

Files are compatible with OmniOutliner, Dynalist, WorkFlowy, and other OPML editors.

---

## Tips and Tricks

### Project Templates

Create OPML files with typical structures:
- Meeting notes (attendees, agenda, notes, action items)
- Sprint planning (backlog, in progress, review, done)
- Weekly review (Monday–Friday, goals, reflection)

Then import them using 📥 wherever needed.

### WBS Numbering

Items automatically get WBS numbers (1, 1.1, 1.1.1...) for easy reference in project documentation.

### Quick Completion

In view mode, just click the checkbox to mark an item complete – no need to open the editor.

---

## Offline Usage

The editor works completely offline:

1. Download the HTML file
2. Open in browser
3. Work without internet connection
4. Save locally to disk

No data is sent to any server.
