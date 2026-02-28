# JSONDB Editor – Database Editor

**JSONDB Editor** is a powerful database editor that runs entirely in your browser. It requires no server, installation, or internet connection. Your data stays on your computer.

🌐 **Online version:** [mrt.site44.com/database-editor](https://mrt.site44.com/database-editor)  
📦 **GitHub:** [github.com/michalradacz/database-editor](https://github.com/michalradacz/database-editor)

## Ways to Use

### Online Version
Simply open the [online version](https://mrt.site44.com/database-editor) in your browser and start working. Data is stored within the browser session – you can have multiple databases open in different tabs simultaneously.

### Offline Version
1. Download the `database-editor.html` file from [GitHub](https://github.com/michalradacz/database-editor)
2. Open the file in any modern browser
3. Work offline without an internet connection

### DokuWiki Integration
The editor can be integrated as a plugin into DokuWiki. Find the plugin in the `jsondbeditor` folder on GitHub.

---

## Basic Concepts

### Database
A database is a `.jsondb` file containing all your tables, records, collections, tags, and settings. You can:
- Save the database as a file
- Load from a file
- Copy/paste as JSON text

### Tables
Tables are the basic building blocks of a database. Each table has:
- A unique name
- Defined fields (columns)
- Records (rows)

### Records
Records are individual rows in a table. Each record contains values for the table's defined fields.

### Fields
Fields define the structure of a table. Each field has a name, type, and optional settings.

---

## Field Types

### Text
Single-line text input. Ideal for short texts like names, titles, codes.

### Multi-line Text / Markdown
Multi-line text field with Markdown formatting support. When viewing a record, Markdown is automatically converted to formatted text.

**Supported formatting:**
- `**bold text**` → **bold text**
- `*italics*` → *italics*
- `# Heading` → heading
- `- item` → bullet list
- `1. item` → numbered list
- `` `code` `` → inline code
- `[link](url)` → hyperlink

### Number
Numeric value. Allows sorting by numerical value.

### Date
Date field. A calendar picker is displayed when editing. Today's date is automatically filled in when creating a new record.

**Custom Display Format:** In field settings, you can define a custom date format using PHP-style placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `d` | Day with zero | 01-31 |
| `j` | Day without zero | 1-31 |
| `D` | Short weekday | Mon, Tue |
| `l` | Full weekday | Monday |
| `N` | ISO weekday | 1-7 |
| `m` | Month with zero | 01-12 |
| `n` | Month without zero | 1-12 |
| `M` | Short month | Jan, Feb |
| `F` | Full month | January |
| `Y` | Four-digit year | 2024 |
| `y` | Two-digit year | 24 |

**Format Examples:**
- `j. n. Y` → 5. 1. 2024
- `m/d/Y` → 01/05/2024
- `D, M j, Y` → Fri, Jan 5, 2024
- `l, F j, Y` → Friday, January 5, 2024

### URL Link
Web address. Automatically displayed as a clickable link when viewing the record.

### Yes/No
Checkbox field for boolean values (true/false).

### Select from List
Dropdown menu with predefined values. Enter values separated by commas when creating the field.

### Composite
Automatically generated field combining values from other fields according to a template. Use `{Field Name}` to insert values.

**Example template:** `{First Name} {Last Name} ({Birth Year})`

### Parent Record
Creates a hierarchical relationship to a record in another (or the same) table. Allows building tree structures of data.

### Child Records
Displays a list of records from another table that have the current record as their parent. This field is automatically updated.

---

## Field Settings

### Primary Field
One field in each table can be marked as primary. This field is used as the main record identifier in links, hierarchical structures, and searches.

### Filter
Fields with filtering enabled are displayed as dropdown menus above the table (in advanced mode), allowing quick filtering of records by value.

### Grouping
Records can be grouped by the value of this field. Grouped records are displayed under common headers that can be expanded and collapsed.

---

## Working with Records

### Creating a Record
1. Click the **➕ Add Record** button in the table header or footer
2. Fill in the field values
3. Click **Save**

**Tip:** Check **Open after save** to automatically open the record detail after saving.

### Quick Create
Use the **➕ New record...** dropdown in the application header to quickly create a record in any table.

### Viewing a Record
Click the **👁️** button next to a record to open the detailed view. In the detail, you'll see:
- All field values with formatting
- Related records (parent and children)
- Collections and tags assigned to the record
- Notes
- Change history

### Editing a Record
Click the **✏️** button next to a record or in the record detail.

### Duplicating a Record
In the record detail, click **Duplicate** to create a copy of the record.

### Locking a Record
In the record detail, you can lock the record using the **🔒 Lock** button. A locked record cannot be edited or deleted until unlocked.

### Deleting a Record
Click the **🗑️** button next to a record. You will be asked to confirm before deletion.

---

## Change History

JSONDB Editor automatically records the history of all changes made to records. History is available in both simple and advanced modes.

### Tracked Operations

History records:
- **Creation** – all field values when creating a record
- **Edit** – only changed fields (difference from previous state)
- **Bulk edit** – changes made through bulk operations

### Viewing History
1. Open the record detail by clicking **👁️**
2. Click the **📜 History** button
3. A modal window will appear with a chronological list of changes (newest first)

### Information in History
Each history entry contains:
- **Date and time** of the change
- **Operation type** (Created / Edited / Bulk edit)
- **List of changed fields** with their values

### Managing History (Advanced Mode)
In advanced mode, you can modify history:
- **🗑️ Delete entry** – Deletes the entire history entry (button in the entry header)
- **✕ Delete field** – Deletes a single field from a history entry (button next to the field)

If you delete all fields from a history entry, the entire entry is automatically removed.

**Note:** Deleting history is irreversible. Use with caution.

---

## Hierarchical Structure

JSONDB Editor supports hierarchical relationships between records using **Parent Record** and **Child Records** field types.

### Viewing Structure
In the record detail, click **🌳 Show Structure** to open a tree view of all the record's descendants.

**Text View** displays:
- Ancestor path (breadcrumb navigation)
- Tree structure of descendants with expand/collapse capability
- Descendant count for each branch
- Buttons to show notes for records

**Graph View** displays:
- Visual relationship diagram
- Click a node to open the record detail

---

## Collections

Collections allow you to organize records from different tables into logical groups.

### Creating a Collection
1. Go to **Classification → Collections**
2. Click **➕ Add Collection**
3. Enter name, optionally description and color
4. Click **Save**

### Adding a Record to a Collection
- In the record detail, click **Add to Collection**
- When bulk selecting records, use **📁 To Collection**

### Viewing Collection Contents
In the Collections section, click on a collection to view all records it contains.

---

## Tags

Tags allow you to assign labels to records for easier categorization and filtering.

### Creating a Tag
1. Go to **Classification → Tags**
2. Click **➕ Add Tag**
3. Enter name and color
4. Click **Save**

### Assigning a Tag to a Record
- In the record detail, click **Assign Tag**
- When bulk selecting records, use **🏷️ Add Tag**

---

## Notes

You can add notes to any record – short text entries with the ability to mark as resolved/unresolved.

### Adding a Note
1. Open the record detail
2. In the **📝 Notes** section, write the note text
3. Click **Add**

### Managing Notes
- **✓/○** – Toggle resolved/unresolved status
- **✏️** – Edit note text
- **🗑️** – Delete note

### Global Notes Overview
In the **Classification → Notes** section, you'll find a list of all notes in the database with filtering options by status (all/unresolved/resolved).

The Classification tab displays a red badge with the count of unresolved notes.

---

## Views (Saved Filters)

Views allow you to save current filter settings and quickly return to them.

### Saving a View
1. Set the desired filters in the table
2. Click **➕ Save View** (in advanced mode)
3. Enter the view name

### Using a View
Click the tab with the view name above the table. The **All Records** tab shows unfiltered data.

### Managing Views (Advanced Mode)
- **💾 Update** – Saves current filters to the selected view
- **✏️ Rename** – Changes the view name
- **🗑️ Delete** – Removes the view

---

## Searching and Filtering

### Global Search
Use the **🔍 Search...** field in the application header to search all tables. Results are displayed in a modal window with the option to open a record.

### Table Search
Each table has its own search field that searches all text fields of records.

### Filters (Advanced Mode)
- **Field Filters** – Dropdown menus for fields with filtering enabled
- **Collection Filter** – Shows only records in a specific collection
- **Tag Filter** – Shows only records with a specific tag

---

## Bulk Operations

### Selecting Records
- Check the checkbox next to individual records
- Use **Select All** to select all (filtered) records
- Use **Clear Selection** to deselect

### Available Bulk Operations
- **✏️ Edit Field** – Change the value of one or more fields for all selected records
- **📁 To Collection** – Add all selected records to a collection
- **🏷️ Add Tag** – Assign a tag to all selected records
- **🗑️ Delete** – Delete all selected records (with confirmation)

---

## Import and Export

### Exporting a Table (Advanced Mode)
1. Click **📤 Export** for the table
2. Choose format (CSV or JSON)
3. For CSV, you can choose delimiter and encoding
4. Click **Export**

### Importing Data (Advanced Mode)
1. Click **📥 Import** for the table
2. Choose format (CSV or JSON)
3. Paste data into the text field
4. Click **Preview Mapping**
5. Review column-to-field mapping
6. Click **Import**

### Exporting/Importing Entire Database
- **💾 Save** – Downloads the entire database as a `.jsondb` file
- **📂 Load** – Loads database from file
- **📋 Copy JSON** – Copies database as JSON to clipboard
- **📥 Paste JSON** – Loads database from JSON text

---

## Text Generator

The text generator allows you to create text outputs from records based on a template.

### Usage
1. Go to **Management → Tools**
2. Select a table
3. Insert placeholders `{Field Name}` into the template
4. Choose whether to generate from all or filtered records
5. Click **⚡ Generate**

**Example template:**
```
Name: {Name}
Email: {Email}
---
```

---

## Simple and Advanced Mode

JSONDB Editor offers two display modes:

### Simple Mode (Default)
Designed for basic users. Hides advanced features:
- Database management buttons (New, Load, Copy JSON, Paste JSON)
- Language selection
- Field filters (only search remains)
- View management buttons
- Management tab
- History entry deletion

### Advanced Mode
Activate by checking **All Features** in the header. Enables all application features.

### Table Visibility
In advanced mode, you can set in **Management → Tables** which tables will be visible in simple mode.

---

## Keyboard Shortcuts

Keyboard shortcuts use the browser modifier:
- **Windows/Linux:** Alt or Alt+Shift
- **macOS:** Ctrl+Option

### Shortcuts with Modifier
| Shortcut | Action |
|----------|--------|
| Mod+S | Save database |
| Mod+X | Toggle simple/advanced mode |
| Mod+N | New record in current table |
| Mod+Q | Quick create record |
| Mod+U | Save record (in modal) |
| Mod+Z | Go to Classification |
| Mod+C | Go to Collections |
| Mod+T | Go to Tags |
| Mod+M | Go to Notes |

### Direct Shortcuts (No Modifier)
| Shortcut | Action |
|----------|--------|
| ↑ ↓ | Navigate in record table |
| E | Edit selected record |
| V | View selected record |

---

## DokuWiki Integration

JSONDB Editor can be integrated into DokuWiki as a plugin.

### Installation
1. Download the `jsondbeditor` folder from GitHub
2. Upload it to `lib/plugins/` in your DokuWiki installation
3. Activate the plugin in DokuWiki administration

### Usage
On a DokuWiki page, use the syntax:
```
<jsondb>
... base64 encoded database ...
</jsondb>
```

The editor opens in a new window and changes are automatically reflected back to the wiki page when saved.

---

## Accessibility

JSONDB Editor is designed with accessibility in mind:
- Full keyboard navigation support
- ARIA attributes for screen readers
- Semantic HTML5 elements
- Sufficient color contrast
- Responsive design for various screen sizes

---

## Unsaved Changes Protection

JSONDB Editor protects your work from being lost:

### Unsaved Changes Warning
If you make any changes to the database (adding/editing/deleting records, modifying structure, etc.), a yellow banner will appear at the top of the window with a warning: **"⚠️ You have made changes to the database. Don't forget to save."**

### Close Window Warning
If you try to close the browser window or tab with unsaved changes, the browser will display a confirmation dialog asking if you really want to leave the page.

### When the Warning Disappears
The warning automatically disappears after:
- Saving the database to a file (**💾 Save** button)
- Saving to wiki (**📤 Save to Wiki** button in DokuWiki version)

---

## Technical Information

### File Format
The database is saved in JSON format with a `.jsondb` extension. The file contains:
- Database metadata (name, settings)
- Table and field definitions
- All records
- Collections, tags, and notes
- Saved views
- Record change history

### Data Storage
- **Standalone version:** Data is automatically saved to browser sessionStorage (isolated for each tab)
- **DokuWiki version:** Data is saved to the wiki page

### Compatibility
The application works in all modern browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

---

## License

JSONDB Editor is open source software. Source code is available on [GitHub](https://github.com/michalradacz/database-editor).

---

## Support

If you have questions, suggestions, or found a bug, please create an issue on [GitHub](https://github.com/michalradacz/database-editor/issues).
