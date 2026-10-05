# TIN Editor — User Guide

A web editor for **TIN** (Target Instruction Notation) files — a JSON format describing what an AI model should do for a given role or task, what it must not do, which materials it should work with, and what the output should look like. The editor can turn a TIN into a ready-made Markdown system prompt.

- **Online version**: <https://nastroje.egdilna.cz/tineditor>
- **Source code (open source)**: <https://github.com/egdilna/nastroje/blob/main/tineditor>
- **TIN format specification**: [English](tin-spec.md) · [Czech](tin-spec-cs.md) · [JSON Schema](tin-schema.json)
- **Česká příručka**: [docs-cs.md](docs-cs.md)

The editor is a single `index.html` file — nothing to install, and no data leaves your browser. An internet connection is required to start it (Tailwind, Alpine.js and Lucide icons are loaded from a CDN).

> **Important:** the editor **does not save** your work automatically. After closing or reloading the page you start with an empty document. Save regularly with **Export JSON** (or **Copy**).

## Interface language

The header contains a **CS / EN** switch. It changes all interface texts — labels, buttons, tooltips, messages and confirmation dialogs. The choice is remembered in the browser; on the first visit the language follows your browser settings (Czech and Slovak → CS, otherwise EN).

The interface language **does not change the data**. JSON keys and values (such as instruction types `do`, `dont`, `note`) stay in English as the specification requires.

## Header — buttons

| Button | What it does |
|---|---|
| **CS / EN** | Switches the interface language. |
| **Minify** | When checked, *Copy* and *Export JSON* produce JSON without indentation (smaller file). Otherwise JSON is formatted with 2-space indentation. |
| **Import** | Loads a TIN from a `.json` file on disk. |
| **Paste** | Loads TIN JSON from the clipboard. The browser may ask for clipboard permission. |
| **Copy** | Copies the current TIN JSON to the clipboard. |
| **Export JSON** | Downloads the TIN as `<id>.tin.json` (`instruction.tin.json` when the ID is empty). |
| **Prompt (MD)** | Generates a Markdown system prompt and shows it in a dialog. |
| **Help** (question-mark icon) | Opens this guide in the interface language. |

## Workflow

1. Fill in **Metadata** (at least ID, name, language and version).
2. Describe the **Context** — what the TIN covers and what it does not.
3. Write the **Instruction Sections**: what to do, what not to do, notes.
4. Add **Referenced Files** and describe the **Expected Output** as needed.
5. Save the JSON (**Export JSON**) and optionally generate the **Prompt (MD)**.

## Metadata

| Field | Meaning | JSON field |
|---|---|---|
| **ID (Reverse-DNS or UUID)** * | Stable identifier, e.g. `com.example.contract-auditor`. Also used for downloaded file names. | `metadata.id` |
| **Human Name** * | Short name of the role or task. Becomes the main heading of the prompt. | `metadata.name` |
| **Language (ISO 639-1)** * | Language of the TIN **content**, e.g. `cs`, `en`, `en-US`. Also controls the language of prompt headings. A new document gets it prefilled from the interface language. | `metadata.lang` |
| **Version (Semver)** * | Content version in the form `1.0.0`. | `metadata.version` |
| **Purpose** | Longer explanation of what the TIN is for. Placed right under the prompt heading. | `metadata.purpose` |

An asterisk marks fields required by the specification. The editor does not enforce them — see [Schema validity](#schema-validity).

`metadata.type` is set to `role` in a new document; it is not shown in the editor, but an imported value is preserved.

## Context

- **Scope** (`context.scope`) — what the TIN applies to.
- **Out of Scope** (`context.out_of_scope`) — what it explicitly does not cover.

## Instruction sections

The heart of a TIN. A new document starts with one empty section; add more with **+ Add Top-Level Section**.

Each section has:

- a **Section Title** (bold field at the top left),
- a **section ID** (grey field next to the title) — generated automatically (`sec-xxxxx`); you can change it to something readable (`tone`, `sources`…). It must be unique within the TIN.
- a **trash** icon — deletes the section with all its instructions and sub-areas (the editor asks for confirmation first).

### Instructions

**+ Instruction** adds a row with a type selector and a text:

| Type in UI | JSON value | Meaning | Border colour |
|---|---|---|---|
| **DO** / DĚLEJ | `do` | What the model must do. | green |
| **DON'T** / NEDĚLEJ | `dont` | What the model must not do. | red |
| **NOTE** / POZNÁMKA | `note` | Context, explanation, remark. | blue |

The text may contain Markdown. The cross on the right removes the instruction (no confirmation).

### Sub-areas

**+ Sub-area** adds a nested sub-section (`areas`). A sub-area has a title and **steps**, added with **+ Add Step**.

Limitations of sub-areas in the editor:

- a new step is always of type **DO** (`do`); the type is shown by the coloured bar on the left but cannot be changed in the editor — a different type can only be set by editing the JSON and importing it,
- a single step cannot be deleted (only its text cleared); the trash icon deletes the whole sub-area — **without confirmation**,
- sub-areas are displayed only down to the second level. Deeper nesting (allowed by the format) is preserved on import and included in the prompt, it just is not visible in the editor.

## Referenced files

Materials the model should work with. **+ Add File** adds a card with these fields:

| Field | Meaning | JSON field |
|---|---|---|
| **File ID** | Identifier, prefilled as `file-1`, `file-2`… | `id` |
| **URI / Path** | Relative path or URL, e.g. `./docs/policy.md`. | `uri` |
| **Understand (Authority)** | How to understand the file — what it is and how authoritative. | `understand` |
| **Usage Instructions** | What to take from it and how to use it. | `use` |

The trash icon removes the card (no confirmation). The optional fields `scope` (which part of the file matters) and `ignore` (what to skip) are not editable, but when present in an imported file they are preserved and written to the prompt.

## Expected output

- **Description** (`output.description`) — format, tone, length of the answer.
- **MIME Language** (`output.language`) — MIME-like specifier, e.g. `text/markdown`, `text/czech`, `application/json`.

## Generated system prompt

**Prompt (MD)** opens a dialog with a prompt built from the TIN. Close it with **Close**, the cross, or the **Esc** key. You can **Copy to Clipboard** or **Download .md** (file `<id>.prompt.md`).

Prompt structure:

1. `# Role: <name>`, followed by the purpose and a line with ID, version and language.
2. **Scope & Boundaries** — scope, out of scope, and every **DON'T** instruction listed as *explicit prohibitions*.
3. **Active Rules** — every **DO** instruction.
4. **Context & Notes** — assumptions, if any (`context.assumptions`, import only), and every **NOTE** instruction.
5. **Referenced Materials** — for each file its ID, path, "what it is", "how to use", and optionally "where to look" and "what to ignore".
6. **Output Format** — description and output language.
7. A footer with the TIN format version, ID and version.

Instructions are collected **from all sections and sub-areas in document order** and grouped by type only — **section titles are not carried into the prompt**. Empty instructions are skipped, as are parts with no data (except the output format).

**The language of prompt headings** follows the *Language* field in Metadata, not the interface language: `cs…` → Czech, `en…` → English, anything else → interface language. Your own texts are not translated.

## Import and paste behaviour

**Import** and **Paste** load JSON and merge it with the current document **at the top level**: every key present in the loaded JSON (`metadata`, `context`, `sections`, `files`, `output`…) **replaces** the current one entirely; keys missing from the file are kept from the current document. If you want to load someone else's TIN "from scratch", reload the page first.

If the file or clipboard does not contain valid JSON, the editor says so and leaves the document unchanged. The content is not checked against the schema.

## Schema validity

The editor lets you save an incomplete TIN. To pass validation against [`tin-schema.json`](tin-schema.json), in particular:

- `metadata.id`, `name`, `lang`, `version` must be filled in,
- `lang` must look like `cs` or `en-US` (lower case, optionally a hyphen and an upper-case region),
- `version` must be SemVer (`1.0.0`, `2.1.0-beta.1`),
- there must be at least one section; every section and sub-area needs a non-empty title,
- no instruction may have empty text,
- every referenced file needs all four fields (`id`, `uri`, `understand`, `use`).

See the [specification](tin-spec.md#validation) for how to validate (Python example).

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Esc` | Closes the prompt dialog. |

## FAQ

**Where is my data?** Only in the open page. The editor stores nothing in the browser or on a server — your work persists only in the exported `.tin.json` file.

**Why did nothing happen after clicking Paste?** The browser denied clipboard access. Allow it in the site settings, or use **Import** with a file.

**How do I make a language version of a TIN?** Per the specification, one TIN is in one language. Save a copy with the same ID pattern, change *Language* and translate the texts.

**Why are prompt headings in Czech although my interface is English?** Headings follow the *Language* field in Metadata. Set it to `en`.
