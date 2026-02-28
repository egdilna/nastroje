# JSONDB File Format Specification

JSONDB is a JSON-based database format designed for simplicity, portability, and human readability. This document describes the format as implemented in JSONDB Editor, including standard features and JSONDB Editor-specific extensions.

## Overview

A JSONDB file is a valid JSON document with the `.jsondb` extension. It contains:
- Database metadata
- Table definitions with field schemas
- Records (data rows)
- Optional: Collections, tags, notes, views, and record history (JSONDB Editor extensions)

## Basic Structure

```json
{
  "meta": {
    "name": "Database Name",
    "columnVisibility": {},
    "groupStates": {},
    "collections": [],
    "tags": [],
    "views": {},
    "notes": [],
    "recordHistory": {}
  },
  "tables": []
}
```

## Meta Object

The `meta` object contains database-level settings:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Database display name |
| `columnVisibility` | object | No | Per-table column visibility settings |
| `groupStates` | object | No | Per-table group expansion states |
| `collections` | array | No | JSONDB Editor extension: Collections |
| `tags` | array | No | JSONDB Editor extension: Tags |
| `views` | object | No | JSONDB Editor extension: Saved views |
| `notes` | array | No | JSONDB Editor extension: Record notes |
| `recordHistory` | object | No | JSONDB Editor extension: Change history |

## Tables

Each table is an object with the following structure:

```json
{
  "id": "id_abc123",
  "name": "Contacts",
  "showInSimpleMode": true,
  "fields": [],
  "records": []
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (format: `id_[a-z0-9]+`) |
| `name` | string | Yes | Table display name |
| `showInSimpleMode` | boolean | No | JSONDB Editor extension: Visibility in simple mode |
| `fields` | array | Yes | Field definitions |
| `records` | array | Yes | Data records |

## Fields

Fields define the schema for table records:

```json
{
  "id": "id_f1",
  "name": "Full Name",
  "type": "text",
  "primary": true,
  "filter": false,
  "group": false
}
```

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Field display name |
| `type` | string | Yes | Field data type (see below) |
| `primary` | boolean | No | Whether this is the primary display field |
| `filter` | boolean | No | Enable filtering by this field |
| `group` | boolean | No | Enable grouping by this field |
| `options` | string | No | Comma-separated options (for `select` type) |
| `dateFormat` | string | No | PHP-style date format (for `date` type) |
| `template` | string | No | Template string (for `composite` type) |
| `targetTableId` | string | No | Target table ID (for `parent`/`children` types) |
| `parentFieldId` | string | No | Parent field ID (for `children` type) |

### Date Format Placeholders

For `date` type fields, you can specify a custom display format using PHP-style placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `d` | Day with leading zero | 01-31 |
| `j` | Day without leading zero | 1-31 |
| `D` | Short weekday name | Mon, Tue |
| `l` | Full weekday name | Monday |
| `N` | ISO weekday number | 1 (Mon) - 7 (Sun) |
| `m` | Month with leading zero | 01-12 |
| `n` | Month without leading zero | 1-12 |
| `M` | Short month name | Jan, Feb |
| `F` | Full month name | January |
| `Y` | Four-digit year | 2024 |
| `y` | Two-digit year | 24 |

**Examples:**
- `j. n. Y` → 5. 1. 2024
- `m/d/Y` → 01/05/2024
- `D, M j, Y` → Fri, Jan 5, 2024

### Field Types

| Type | Description | Value Format |
|------|-------------|--------------|
| `text` | Single-line text | String |
| `textarea` | Multi-line text with Markdown support | String |
| `number` | Numeric value | Number or numeric string |
| `date` | Date | ISO date string (YYYY-MM-DD) |
| `url` | Web URL | String (URL format) |
| `boolean` | True/false value | "true" or "false" string |
| `select` | Selection from predefined options | String (one of options) |
| `composite` | Auto-generated from template | String (read-only) |
| `parent` | Reference to parent record | Record ID string |
| `children` | List of child records | Read-only, auto-generated |

### Composite Field Template

Composite fields use a template with placeholders:
```
{First Name} {Last Name} ({Department})
```

Placeholders reference field names and are replaced with actual values.

## Records

Records contain the actual data:

```json
{
  "id": "id_r1",
  "values": {
    "id_f1": "John Doe",
    "id_f2": "john@example.com",
    "id_f3": "2024-01-15"
  },
  "locked": false
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique record identifier |
| `values` | object | Yes | Field values keyed by field ID |
| `locked` | boolean | No | JSONDB Editor extension: Record lock status |

---

## JSONDB Editor Extensions

The following features are JSONDB Editor-specific extensions to the JSONDB format. They are fully backward-compatible – databases without these features will work correctly, and other JSONDB-compatible tools can safely ignore them.

### Collections

Collections group records from multiple tables:

```json
{
  "id": "id_col1",
  "name": "Important Contacts",
  "description": "Key business contacts",
  "color": "#4a90d9",
  "members": [
    { "tableId": "id_t1", "recordId": "id_r1" },
    { "tableId": "id_t2", "recordId": "id_r5" }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique collection identifier |
| `name` | string | Yes | Collection display name |
| `description` | string | No | Collection description |
| `color` | string | No | Hex color code (#RRGGBB) |
| `members` | array | No | Array of record references |

### Tags

Tags provide labeling functionality:

```json
{
  "id": "id_tag1",
  "name": "Urgent",
  "color": "#e74c3c",
  "records": [
    { "tableId": "id_t1", "recordId": "id_r1" }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique tag identifier |
| `name` | string | Yes | Tag display name |
| `color` | string | No | Hex color code (#RRGGBB) |
| `records` | array | No | Array of record references |

### Notes

Notes attach comments to records with resolution tracking:

```json
{
  "id": "id_note1",
  "tableId": "id_t1",
  "recordId": "id_r1",
  "text": "Follow up next week",
  "resolved": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique note identifier |
| `tableId` | string | Yes | Table ID of attached record |
| `recordId` | string | Yes | Record ID note is attached to |
| `text` | string | Yes | Note content |
| `resolved` | boolean | No | Resolution status |
| `createdAt` | string | No | ISO timestamp |

### Views (Saved Filters)

Views save filter configurations:

```json
{
  "id_t1": [
    {
      "id": "id_view1",
      "name": "Active Only",
      "filters": {
        "id_f5": "active"
      },
      "collectionFilter": "",
      "tagFilter": "id_tag1"
    }
  ]
}
```

Views are stored in `meta.views` object, keyed by table ID.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique view identifier |
| `name` | string | Yes | View display name |
| `filters` | object | No | Field filters (field ID → value) |
| `collectionFilter` | string | No | Collection ID filter |
| `tagFilter` | string | No | Tag ID filter |

### Record Locking

Records can be locked to prevent editing:

```json
{
  "id": "id_r1",
  "values": { ... },
  "locked": true
}
```

When `locked` is `true`, the record cannot be edited or deleted until unlocked.

### Record History

Record history tracks all changes made to records:

```json
{
  "id_t1_id_r1": [
    {
      "id": "id_h1",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "create",
      "fields": {
        "id_f1": "John Doe",
        "id_f2": "john@example.com"
      }
    },
    {
      "id": "id_h2",
      "timestamp": "2024-01-16T14:20:00Z",
      "type": "edit",
      "fields": {
        "id_f2": "johndoe@example.com"
      }
    }
  ]
}
```

History is stored in `meta.recordHistory` object, keyed by `{tableId}_{recordId}`.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique history entry identifier |
| `timestamp` | string | Yes | ISO timestamp of the change |
| `type` | string | Yes | Type of operation: `create`, `edit`, or `bulk` |
| `fields` | object | Yes | Changed fields with their new values |

**History entry types:**
- `create` – Record was created (all initial field values)
- `edit` – Record was edited (only changed fields)
- `bulk` – Record was modified via bulk operation (only changed fields)

**Notes:**
- For `create` entries, `fields` contains all non-empty field values at creation time
- For `edit` and `bulk` entries, `fields` contains only the fields that changed
- Empty values are not stored in history
- History entries can be deleted by users in advanced mode

---

## ID Format

All identifiers follow the pattern `id_[a-z0-9]+`:
- Prefix: `id_`
- Suffix: Lowercase alphanumeric characters
- Example: `id_abc123`, `id_k7m2p9x`

IDs are generated automatically and should be treated as opaque strings.

## Compatibility

### Backward Compatibility
- Databases created with older versions will work correctly
- Missing optional properties use default values
- Unknown properties are preserved but ignored

### Extension Compatibility
- JSONDB Editor extensions are stored in standard JSON format
- Other JSONDB tools can safely ignore extension properties
- Extensions don't affect core table/record functionality

## Example Database

```json
{
  "meta": {
    "name": "Project Tracker",
    "columnVisibility": {},
    "groupStates": {},
    "collections": [
      {
        "id": "id_col1",
        "name": "Priority Items",
        "color": "#e74c3c",
        "members": []
      }
    ],
    "tags": [
      {
        "id": "id_tag1",
        "name": "Urgent",
        "color": "#f39c12",
        "records": []
      }
    ],
    "views": {},
    "notes": [],
    "recordHistory": {
      "id_t1_id_r1": [
        {
          "id": "id_h1",
          "timestamp": "2024-01-15T10:30:00Z",
          "type": "create",
          "fields": {
            "id_f1": "Write documentation",
            "id_f2": "In Progress",
            "id_f3": "2024-01-20"
          }
        }
      ]
    }
  },
  "tables": [
    {
      "id": "id_t1",
      "name": "Tasks",
      "fields": [
        {
          "id": "id_f1",
          "name": "Task Name",
          "type": "text",
          "primary": true
        },
        {
          "id": "id_f2",
          "name": "Status",
          "type": "select",
          "options": "New,In Progress,Done",
          "filter": true,
          "group": true
        },
        {
          "id": "id_f3",
          "name": "Due Date",
          "type": "date"
        }
      ],
      "records": [
        {
          "id": "id_r1",
          "values": {
            "id_f1": "Write documentation",
            "id_f2": "In Progress",
            "id_f3": "2024-01-20"
          }
        }
      ]
    }
  ]
}
```

## JSON Schema

A complete JSON Schema for validation is available at:
[jsondb-schema.json](https://github.com/michalradacz/database-editor/blob/main/jsondb-schema.json)
