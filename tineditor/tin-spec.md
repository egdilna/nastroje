# TIN — Target Instruction Notation

**Schema:** `tin-schema.json` (JSON Schema draft 2020-12)

## What is TIN?

TIN (Target Instruction Notation) is a JSON format for specifying what an AI model should and should not do for a given role or task. It bundles together:

- **What the model should do** (instructions, guidelines)
- **What the model should not do** (prohibitions, out-of-scope areas)
- **What materials it should use** and how to interpret each one
- **What the output should look like**
- **Metadata** (identity, version, language, purpose)
- **Links to related TINs** for composition

TIN is designed to be:

- **Simple** — minimal required structure, everything optional is truly optional
- **Language-neutral for content** — one TIN is in one language; translations are separate TINs
- **English for schema** — keys, enum values, and type names are English regardless of content language
- **Extensible** — a free-form `extensions` object captures anything not in the core spec

## Top-level structure

```
{
  "tin": "1.0",
  "metadata": { ... },
  "context": { ... },        // optional
  "sections": [ ... ],
  "files": [ ... ],          // optional
  "output": { ... },         // optional
  "related": [ ... ],        // optional
  "extensions": { ... }      // optional
}
```

Required fields: `tin`, `metadata`, `sections`.

## Fields

### `tin` (required)

Version of the TIN format this document conforms to. Currently `"1.0"`.

### `metadata` (required)

Identification and descriptive information about the TIN itself.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Stable identifier. Reverse-DNS (`cz.egdilna.nsesss-auditor`) or UUID recommended. |
| `name` | yes | Short human-readable name. |
| `lang` | yes | Language of the content (ISO 639-1, e.g. `cs`, `en`, `en-US`). |
| `version` | yes | Semver of the TIN content (e.g. `1.0.0`). |
| `description` | no | One-line summary. |
| `purpose` | no | Longer explanation of why the TIN exists and when to use it. |
| `type` | no | Kind of TIN. Recommended values: `role`, `task`, `guideline`, `workflow`, `evaluation`. Custom values allowed. |
| `created` | no | ISO 8601 date or date-time. |
| `modified` | no | ISO 8601 date or date-time. |
| `author` | no | Name, email, or organization. |
| `tags` | no | Array of strings for categorization. |
| `license` | no | SPDX identifier recommended (e.g. `CC-BY-4.0`). |

### `context` (optional)

Describes the overall context in which the TIN applies. Useful for setting expectations before diving into individual rules.

| Field | Description |
|---|---|
| `scope` | What the TIN applies to. |
| `assumptions` | What is assumed about the user, environment, or inputs. |
| `out_of_scope` | What is explicitly NOT covered. |

### `sections` (required)

Ordered list of instruction sections. Each section has:

| Field | Required | Description |
|---|---|---|
| `id` | yes | Identifier unique within the TIN. |
| `title` | yes | Short section title. |
| `instructions` | * | List of instructions (see below). |
| `areas` | * | Nested sub-sections, same shape as Section (recursive). |

\* Either `instructions`, `areas`, or both must be present.

#### Instructions

Each instruction has a `type` and a `text`:

| `type` | Meaning |
|---|---|
| `do` | The model MUST do this. |
| `dont` | The model MUST NOT do this. |
| `note` | Context, remark, or clarification — neither a command nor a prohibition. |

The `text` can contain Markdown; consumers can render it as-is or pass it to the model verbatim.

### `files` (optional)

Referenced materials the model should consult. Each file has:

| Field | Required | Description |
|---|---|---|
| `id` | yes | Identifier unique within the TIN. |
| `uri` | yes | Relative path or absolute URL. |
| `understand` | yes | How to understand this file — what it is and its authority. |
| `use` | yes | What to take from this file and how to use it. |
| `ignore` | no | What to ignore or skip in this file. |
| `scope` | no | Free-text description of the relevant part (e.g. "Chapter 3", "Lines 40-120"). |

### `output` (optional)

Describes the expected output.

| Field | Description |
|---|---|
| `description` | Free-text description of what the output should look like. |
| `language` | MIME-like specifier: `text/czech`, `code/javascript`, `application/json`, `text/markdown`, etc. |

### `related` (optional)

Array of TIN identifiers this TIN relates to. Plain list of IDs; relationship kind is not encoded — if needed, describe it in `context` or an instruction.

### `extensions` (optional)

Free-form object for domain-specific fields. Consumers MUST ignore unknown keys here. Convention: prefix custom keys with `x-` (e.g. `x-my-org-field`).

## Design principles

1. **One TIN, one language.** Translations are separate TINs with the same `id` pattern but different `lang`.
2. **English schema, localized content.** The shape is in English; content inside string values is in whatever language `metadata.lang` declares.
3. **Markdown is auto-detected.** Don't specify content format — models recognize Markdown.
4. **Flat where possible, nested where needed.** `sections` is flat by default; `areas` provides optional recursion.
5. **Composition via `related`, not inheritance.** TIN doesn't have inheritance; keep each TIN self-contained and use `related` to point at companions.

## Validation

Validate a TIN file against `tin-schema.json` using any JSON Schema draft 2020-12 validator. Example in Python:

```python
import json
from jsonschema import Draft202012Validator

with open('tin-schema.json') as f:
    schema = json.load(f)
with open('my-tin.json') as f:
    tin = json.load(f)

Draft202012Validator(schema).validate(tin)
```

## Example

See `tin-example.json` for a complete TIN describing an NSESSS audit assistant role.

## Versioning

- `tin` field in the document tracks TIN format version.
- `metadata.version` tracks the TIN content version (semver).
- Breaking changes to the format bump the major version (`2.0`); additive changes bump the minor version (`1.1`).
