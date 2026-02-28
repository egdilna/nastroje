# Visual JSON Editor

An intuitive web-based editor for viewing and editing JSON data without writing brackets and quotes. Ideal for working with configuration files, API responses, and data structures.

**[Open editor online](https://mrt.site44.com/json-editor.html)** | [Download for offline use](https://mrt.site44.com/json-editor.html)

> The editor is a single HTML file. Download it and use offline for working with sensitive data.

---

## Why this editor?

- **Visual editing** – No manual JSON syntax writing
- **Tree structure** – Clear navigation through complex data
- **Validation** – Automatic data type checking
- **No installation** – Works directly in browser
- **Fully accessible** – Screen reader support

---

## Basic Usage

### Loading Data

- **Load file** – Import .json file from disk
- **Paste JSON** – Paste JSON from clipboard
- **Load from URL** – Compressed data in URL (for sharing)

### Working with Values

The editor recognizes and properly displays all JSON types:

| Type | Display | Example |
|------|---------|---------|
| Object | 📁 folder | `{"key": "value"}` |
| Array | 📋 list | `[1, 2, 3]` |
| String | 📝 text | `"hello"` |
| Number | 🔢 number | `42`, `3.14` |
| Boolean | ✓/✗ | `true`, `false` |
| Null | ∅ empty | `null` |

### Editing Values

1. Click on a value to edit it
2. Change type using dropdown menu
3. Edit value in appropriate field
4. Click outside to save

### Adding and Deleting

- **➕** on object – Add new key
- **➕** on array – Add new item
- **🗑️** – Delete item

---

## Advanced Features

### 🔄 Type Conversion

You can change the type of any value. The editor automatically converts:
- String → Number (if it's a valid number)
- Anything → Array (wraps in array)
- Anything → Object (creates object with "value" key)

### 📑 Collapsing

Click the arrow on objects and arrays to collapse/expand. Collapsed branches show content preview.

### 🔍 Clear Navigation

- Objects show key count: `{3 keys}`
- Arrays show item count: `[5 items]`
- Deeply nested structures have visual indentation

### 📋 Copying

- **Copy JSON** – Copies entire document to clipboard
- **Copy URL** – Creates shareable link with data

### 🔗 Integration with Other Editors

The toolbar has links to open data in:
- OPML editor (for hierarchical data)
- Markdown editor (for text content)

---

## Accessibility

The editor is designed for all users:

- **Keyboard navigation** – Tab to move between elements
- **ARIA attributes** – Proper roles for tree and items
- **High contrast** – Readable colors meeting WCAG 2.1 AA
- **Visible focus** – Clearly marked active element
- **Labels** – All buttons have text alternatives

---

## Format

The editor works with standard JSON:

```json
{
  "name": "Project",
  "version": 1.0,
  "active": true,
  "tags": ["web", "tool"],
  "config": {
    "theme": "dark",
    "language": "en"
  }
}
```

Output is valid JSON formatted with indentation for readability.

---

## Tips

### Working with Large Files

1. Collapse unnecessary branches for better overview
2. Use browser search (Ctrl+F) to find in rendered content

### Validation Before Saving

The editor automatically validates:
- Numbers must be valid numbers
- Boolean can only be true/false
- Object keys must be unique

### Security

The editor runs completely in browser. Your JSON data:
- Is not sent to any server
- Stays in your memory
- Can safely be used for sensitive configurations

---

## Offline Usage

1. Download the editor HTML file
2. Open locally in browser
3. Work with JSON files without internet
4. Save results to disk

Ideal for working with configuration files on secured systems.
