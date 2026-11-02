# DKM — the `.dkmdata` and `.dkmpkg` file formats

The normative description of both file formats, **for programmers**: for anyone who wants
to work with DKM data from the outside with their own script, another tool, or through an
AI. It describes what is in the files, what has to be in them, and what a reader may expect.

The user manual (`docs-en.md`) does not describe the formats — it is for users and for
people designing a data model in DKM, not for implementers.

The Czech version of this document is `dkm-formats-cs.md`; the content is the same.

**What counts as authoritative when sources disagree** (the one higher up wins):

1. **`dkm/index.html`**, specifically the `mergeEmpty` function — whatever passes through it is valid `.dkmdata`.
2. **`dkm/dkmdata-scheme.json`** and **`dkm/dkmpkg-scheme.json`** — JSON Schema 2020-12.
3. **this document** — the prose, including what a schema cannot capture.

**Multi-user synchronisation over a single file** (the three-way merge, the optimistic
write, pseudocode and a brief for an AI) is described in `dkm-sync-en.md` / `dkm-sync-cs.md`.

---

## 1. Two formats and the difference between them

| | `.dkmdata` | `.dkmpkg` |
|---|---|---|
| What it holds | **the whole project** — model, all entities, saved views and settings | **a slice** — selected entities plus only the part of the model they need |
| What it is for | saving and backing up a project, moving it between devices, GitHub | moving data between two projects |
| How it is produced | Save (Ctrl+S), clipboard, GitHub | Settings → Packages, or a bulk action on a selection (the manual, ch. 28) |
| Marker | none — recognised by extension and content | mandatory key `"format": "dkmpkg"` |
| How it is read | replaces the whole project | goes through the import wizard, which maps the model onto the target project |

Both are plain UTF‑8 JSON, uncompressed and unwrapped. `.dkmdata` is literally
`JSON.stringify` of the application's internal state — nothing is added or removed.

---

## 2. Machine-readable schemas

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

---

## 3. The `.dkmdata` project — top level

```json
{
  "version": 1,
  "projectName": "Data management",
  "projectDescription": "",
  "ghPath": "owner/repo/path/file.dkmdata",
  "settings": { "tabs": [], "modules": [] },
  "entityTypes": [],
  "aspects": [],
  "relationTypes": [],
  "selectLists": [],
  "tagSets": [],
  "savedViews": [],
  "jsonExports": [],
  "entities": []
}
```

Only **`entities`** is required; everything else is filled in empty by `mergeEmpty`, so
`{"entities":[]}` is a valid project. A missing `version` means 1.

`additionalProperties` is **`false`** at this level, deliberately: the reader really does
drop unknown keys, so the schema describes actual behaviour rather than a wish. Inside
entities it is `true` — see § 10.

`ghPath` is the triple `owner/repo/path` and is **the only thing about synchronisation that
belongs in the data**. The token, the comment author's name, the theme, the language and the
autosave switch are not in the file (§ 11).

---

## 4. The model

| Collection | What it is | Key fields |
|---|---|---|
| `entityTypes` | entity type — a named set of attributes | `id`, `name`, `icon`, `attributes[]`, `sablonaDetailu`, `nazevZe`, `jsonKey` |
| `aspects` | a **cross-cutting** set of attributes, addable to an entity independently of its type | the same plus `pinned` |
| `relationTypes` | relation type | `id`, `name`, `reverseName`, `scope`, `fromTypes[]`, `toTypes[]` |
| `selectLists` | select list | `id`, `name`, `values[]` |
| `tagSets` | tag set | `id`, `name`, `tags[]`, `uzavrena` (closed) |
| `savedViews` | saved view (filter + display) | `id`, `name`, `filter`, `attrFilters[]` |
| `jsonExports` | JSON/XML export profile | `id`, `name`, `keyOverrides`, `vynechane` |
| `settings` | `tabs[]` (the tab bar) and `modules[]` (folders of tabs) | |

An attribute definition (`attributes[]` on a type or an aspect) carries `id`, `name`, `type`
and, depending on the type, more: `listId` (select list), `tagSetId` (tag set), `targetType`
and `multi` (relation), `template` (composed attribute), `min` / `max` / `krok` / `jednotka`
(slider), `autoInc` / `posledni` (auto-numbering), `filtrCile[]` (restricting a relation
target by conditions) and four display switches (`hidden`, `copyable`, `highlight`,
`hideEmpty`).

Attribute types: `text`, `textarea`, `date`, `url`, `select`, `yesno`, `relation`, `number`,
`range`, `checklist`, `tags`, `composed`.

**Relation scope** (`relationTypes[].scope`) is `universal`, `from`, `to` or `specific`.
Empty `fromTypes` / `toTypes` means **"anything"**, not "nothing" — see § 7.

---

## 5. An entity

```json
{
  "id": "e_lz3k9a1b2c",
  "name": "Alice Novakova",
  "typeId": "ty_person",
  "aspects": ["asp_contact"],
  "attributes": { "at_email": "a@b.cz", "at_state": "Active" },
  "relations": [{ "id": "r_1", "relationTypeId": "rt_belongs", "targetId": "e_2" }],
  "customAttributes": [{ "id": "ca_1", "name": "Internal no.", "type": "text", "value": "7" }],
  "comments": [{ "id": "c_1", "content": "verified", "author": "mr", "createdAt": "2026-09-08T14:03:22.184Z" }],
  "objects": [{ "id": "o_1", "name": "Minutes", "content": "…" }],
  "inInbox": false,
  "archived": false,
  "locked": false,
  "pinned": false,
  "createdAt": "2026-09-01T07:00:00.000Z",
  "updatedAt": "2026-09-08T14:03:22.184Z"
}
```

Only `id` is required. What the JSON does not show:

- **An identifier is never renumbered.** All referencing, and the recognition of entities on
  a repeated package import (§ 9), rests on it.
- **A relation's `id` means nothing** — it is there so the relation can be removed in the UI.
  A relation's identity is the pair `(relationTypeId, targetId)`; that matters for merging
  (see `dkm-sync-en.md`).
- **A relation can also come from an attribute** of type `relation`. For the model that is a
  fully-fledged relation, just written elsewhere than in `relations`.
- **`nazevZe`** is the id of the composed attribute the name is built from; DKM copies the
  evaluated template into `name` on save. An empty string means "I write the name myself";
  a missing key means "inherited from the type or an aspect".
- **`updatedAt` is the time the content changed.** Locking, pinning and wiki-link fixes do
  not move it.
- Timestamps are ISO 8601 in UTC with a trailing `Z` (`new Date().toISOString()`).

---

## 6. Attribute values by type

An entity's values live in `attributes` under the **identifier** of the attribute
definition, not under its name. The shape of the value follows that definition's type:

| Attribute type | Value shape | Note |
|---|---|---|
| `text`, `url` | string | |
| `textarea` | string | rendered as Markdown with CriticMarkup |
| `date` | string `YYYY-MM-DD` | not a full ISO timestamp — it is the value of an HTML date field |
| `number` | number | a real number, not a string of digits; with `autoInc: true` DKM assigns it from `posledni` (7.1b), but in the data it is still an ordinary number |
| `range` | number | a slider (7.1c); the range and the step live in the definition (`min`, `max`, `krok`), the unit is a display label only. A value outside the range is valid — DKM does not rewrite it |
| `checklist` | array of `{text, hotovo}` objects | the rows belong to the **entity**, not to the attribute definition (7.1d); the order in the array is the order on screen; `hotovo` may be missing and means a row that is not done |
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

---

## 7. What the schema cannot check: references inside the file

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
| `…attributes[].filtrCile[].scopeId` | `entityTypes[].id` or `aspects[].id` (per `scope`); `null` for `scope: "system"` |
| `…attributes[].filtrCile[].attrId` | `id` of an attribute definition **on that** type or aspect; the key `name` for `scope: "system"` |
| `…attributes[].filtrCile[].value` with `op: "targetIs"` | `entities[].id` |
| `relationTypes[].fromTypes[]`, `toTypes[]` | `entityTypes[].id` |
| `settings.tabs[].typeIds[]`, `aspectId`, `tagSetId`, `viewId`, `entityId`, `typeId` | `entityTypes[].id`, `aspects[].id`, `tagSets[].id`, `savedViews[].id`, `entities[].id` — depending on the tab kind |
| `settings.tabs[].modulId` | `settings.modules[].id`. An invalid reference is **dropped** by the reader and the tab becomes shared — it must never disappear |

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

**The target restriction (`filtrCile`) is deliberately stricter in the schema than in the
reader.** The field may only carry operators that are false for a **missing** value, so the
schema spells them out as an enum. The negative ones (`notEquals`, `notContains`, `empty`,
`isFalse`, `notIn`, `hasNotTag`, `hasNoTags`, `hasNoTarget`) are absent on purpose: an entity
that lacks the attribute entirely would pass them, so instead of narrowing, the restriction
would let through everything else as well. In a saved view
(`savedViews[].filter.attrFilters`) the same operators remain **allowed** — there you filter
a finished list, not an offer. `mergeEmpty` does not drop a different operator; a file with
one loads fine and merely behaves badly, which is why the schema catches it.

`filtrCile` is optional and only meaningful on an attribute of type `relation`. An empty
array and a missing key both mean "no restriction" — just like empty `fromTypes` on a
relation type. A value that stops meeting the restriction is **not deleted** from the
entity; it stays and the application merely marks it.

---

## 8. The `.dkmpkg` package — top level

```json
{ "format": "dkmpkg", "version": 1, "kind": "model",
  "exportedFrom": "…", "exportedAt": "2026-09-08T…", "description": "",
  "model": { "entityTypes": [], "aspects": [], "relationTypes": [], "selectLists": [], "tagSets": [] },
  "entities": [] }
```

`format` and `entities` are required. `kind: "model"` with empty `entities` is a **model
transfer**; otherwise it is a slice of entities plus the part of the model those entities
asked for. A package carries no settings, tabs, modules or saved views.

Entities and definitions in a package have **the same shape** as in `.dkmdata` — the shared
definitions are deliberately identical in both schemas (§ 2).

---

## 9. Identity when importing a package

An entity is recognised by its `id`, not by its name. A package preserves identifiers,
so importing the same data twice is recognised as a conflict with existing entities and
offers overwrite or merge — it does not create a second set of records. Anyone producing
a package outside DKM must therefore keep identifiers **stable across releases**;
otherwise the data is duplicated on every import. Matching by name can be enabled only
in the wizard's detailed mode (the manual, ch. 28.3) and is a fallback for data that shares no
history of identifiers.

The model in a package is narrowed to what the selected entities need. That has two
consequences:

- **Relations pointing outside the package are dropped on export**, so that no reference
  to a missing entity is left in the file. Extending the selection to neighbours or to
  the whole connected component prevents this (the manual, ch. 28.1).
- **`fromTypes` and `toTypes` on the carried relation types may reference types that are
  not in the package.** The restriction then does not fit the target project and the
  wizard creates the relation type without it.

---

## 10. Canonical shape and older spellings

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

---

## 11. What survives loading and what does not

- **An unknown key at the top level of `.dkmdata` is dropped on load.** The reader takes
  only the keys it knows, so custom metadata alongside `entities` will not survive the
  first save. The schema flags it as an error (`additionalProperties: false`).
- **An unknown key inside an entity is kept.** Entities pass through load and save
  untouched, so a custom flag on a record survives. The schema therefore allows it.
- **Missing collections are filled in as empty arrays.** The minimal valid file is
  `{"entities": []}`; a missing `version` means 1.

---

## 12. What is never in these files

**No secrets are stored in project data.** The GitHub token, the AI key and the comment
author's name are not in the file and never will be — the browser alone holds them
(the manual, ch. 34.2). `ghPath` carries only a path of the form `owner/repo/path/file.dkmdata`, not
access to it. A `.dkmdata` file can therefore be passed on or committed without taking
credentials with it — it does contain all of the project's data, though, so whatever
sensitivity applies to that data applies to the file.


---

---

## 13. How to verify a file

In this repository the schemas are checked with **two validators** — `python -m jsonschema`
and `ajv` in strict mode — against **real files out of the application** (`state.data` and
the output of `buildPackageObj`), and **always negatively as well**: that broken data really
does fail. "Zero errors" on its own proves nothing.

The negative checks worth having at a minimum:

- a missing required key (`entities`, or `format` in a package),
- an unknown key at the top level of `.dkmdata` (must fail, § 10),
- a value outside the select list for `select`,
- a `date` written as a full ISO timestamp (must fail, § 6),
- a number written as a string for `number` and `range`,
- a negative operator in `filtrCile` (must fail, § 7).

**When you change the shape of the data, update both schemas and this document.** The
canonical source of truth remains `mergeEmpty`.

---

## Related documents

- `dkm/dkmdata-scheme.json`, `dkm/dkmpkg-scheme.json` — the machine-readable schemas
- `dkm/dkm-sync-en.md` — multi-user synchronisation over a single file
- `dkm/docs-en.md` — the user manual (working with data, not its format)
- `dkm/dkm-formats-cs.md` — the Czech version of this document
