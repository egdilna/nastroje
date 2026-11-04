# DKM — the `dkmdata` format and multi-user synchronisation

This document has four parts:

1. **What matters about the format for merging** — the short version; the full description of the format is in `dkm-formats-en.md`.
2. **Synchronisation** — how several people work on one file in a repository.
3. **Programmer's description** — the function map, pseudocode and the invariants that must not be broken.
4. **Brief for an AI** — what to do so that the same synchronisation works in another application built on the `dkmdata` format.

The Czech twin is `dkm-sync-cs.md`; the content is the same, the prose is translated.

---

## 0. What counts as authoritative here

When sources disagree, the one higher up wins:

1. **`dkm/index.html`** — the actual behaviour of the application. For the format, the canonical function is `mergeEmpty`: whatever passes through it is valid `.dkmdata`.
2. **`dkm/dkmdata-scheme.json`** and **`dkm/dkmpkg-scheme.json`** — JSON Schema 2020-12. A machine-checkable description of both formats, and **self-contained**: neither references the network nor the other file, so one can be copied whole, validated offline, or pasted into a conversation with an AI. Shared definitions are therefore duplicated in both files and **must stay identical**.
3. **`dkm/dkm-formats-en.md`** (in Czech `dkm-formats-cs.md`) — the prose description of the format, including what a schema cannot capture: referential integrity, identity on import, the shape of a value according to the attribute type.
4. **This document** — synchronisation: the map, the reasoning and the how-to. Where it disagrees with the above, the above wins.

This document covers **synchronisation only**. Anyone writing a reader or a writer for the file needs `dkm-formats-en.md` alongside it; the two are handed over together.

---

# PART 1 — WHAT MATTERS ABOUT THE FORMAT FOR MERGING

**The full description of the format is in `dkm-formats-en.md`** (in Czech
`dkm-formats-cs.md`) and machine-readably in `dkmdata-scheme.json` /
`dkmpkg-scheme.json`. What follows is only what the merge rules rest on — anyone who needs
to read or write the file should go there.

The synchronisation described in part 2 applies **to `.dkmdata` only**, i.e. to the whole
project. A `.dkmpkg` package is a one-off transfer, not a shared file.

## 1.1 The shape of a project in brief

```json
{ "version": 1, "projectName": "…", "ghPath": "owner/repo/path/file.dkmdata",
  "settings": { "tabs": [], "modules": [] },
  "entityTypes": [], "aspects": [], "relationTypes": [], "selectLists": [], "tagSets": [],
  "savedViews": [], "jsonExports": [],
  "entities": [] }
```

Only **`entities`** is required. The seven model collections (`entityTypes`, `aspects`,
`relationTypes`, `selectLists`, `tagSets`, `savedViews`, `jsonExports`) merge by one rule,
`entities` by another, and `settings` travels as a scalar — see § 2.5.

`ghPath` is **the only thing about synchronisation that belongs in the data**. The token,
the comment author's name, the theme, the language and the autosave switch are not in the file.

## 1.2 The properties of the format without which a merge cannot be written

1. **Identifiers are stable and never renumbered.** The whole merge is a union by `id`;
   renumbering would turn every entity into a new one.
2. **A relation's identity is the pair `(relationTypeId, targetId)`, not `id`.** Every client
   makes relation `id`s up itself, so by `id` two new relations on the same entity would be
   reported as a conflict.
3. **A relation is written on the source entity only.** The reverse direction is computed; it
   is not in the data, so it is not merged either.
4. **A relation can also come from an attribute** of type `relation` — the value is the target
   entity's `id`, an array of ids with `multi: true`. Reference cleanup (§ 2.5) must reach
   there too, not only into `relations`.
5. **An empty value is not stored** — the key is removed from `attributes`. A missing key is a
   normal state, not an error. In `customAttributes` an empty string stands for "not filled in",
   because the key cannot be removed.
6. **A composed attribute (`composed`) has no value** — the data holds its template. There is
   nothing to merge.
7. **`updatedAt` is the time the content changed.** Locking, pinning and wiki-link fixes do not
   move it; a merge takes the later of the two and it decides nothing (§ 2.15).
8. **The auto-numbering counter (`autoInc`, `posledni`) lives in the attribute definition**,
   i.e. in the model — and it merges differently from the rest of the model (§ 2.5).

## 1.3 What the schema does not enforce

JSON Schema can describe shape, not relationships, so a writer must not rely on validation
alone: **referential integrity** (`typeId`, `aspects[]`, the keys of `attributes`,
`relationTypeId`, `targetId`, `listId`, `tagSetId`, `targetType`, `scopeId`/`attrId` in filter
rules), **the value matching the attribute type** (the type lives in the definition, not with
the value), **uniqueness of `id`** and **uniqueness of assigned numbers** (`posledni` is a
counter, not a reservation). The complete list of references is in `dkm-formats-en.md`, § 7.

---

# PART 2 — SYNCHRONISATION

## 2.1 What it is and what it is not

DKM is a single HTML file with no server. "Synchronisation" here therefore means: **several browsers write and read the same file in a GitHub repository**, and the application makes sure they do not overwrite each other's work.

What it is **not**:

- It is not locking. Nobody reserves anything; two people may change the same entity at once.
- It is not operational transformation, nor a CRDT. Changes are not sent; **the whole file** is.
- It is not realtime. Someone else's change lands within 20 seconds while you are working, within 2 minutes when idle — and only while the window is visible.
- It is not a service. All of the logic is in the browser; GitHub is **dumb storage with a conditional write**.

What it is: **optimistic concurrency over a three-way merge.** Exactly what `git merge` does, only over JSON and by the structure of the data rather than by lines of text.

The property that makes it worth writing down: **a merge never asks anyone anything and never takes away work in progress.** It only adds. A dialog must not be there, because automatic saving goes down this same path.

## 2.2 Four copies of the data

At any moment there are three copies of the project in the browser and one on the network:

| Copy | Where | What it is |
|---|---|---|
| **base** (`state.baseline`) | page memory | the project as we **loaded** it, or as we last saved it |
| **mine** (`state.data`) | memory + `sessionStorage` | the project as the user sees it, including unsaved changes |
| **theirs** | GitHub | the file's content as someone last saved it |
| **the entity being edited** (`state.view.editZaklad` + the form) | page memory | an open editor is one more deferred copy — see § 2.11 |

Plus two small pieces of state: `state.ghSha` (the version of the file we started from) and `ghPosledniCommit` (the latest commit we know about).

`state.ghSha` is kept in `sessionStorage` next to the data, so it **survives a page refresh**. Without it the first save after F5 would blindly run into someone else's write.

## 2.3 The optimistic check: the `sha` we do not refresh

A write goes through the GitHub Contents API:

```
PUT /repos/{owner}/{repo}/contents/{path}
{ "message": "…", "content": "<base64>", "sha": "<state.ghSha>" }
```

What is sent is **the `sha` of the version we started from** — not the freshest one. That is exactly how GitHub notices that somebody else saved in the meantime and rejects the write: **409** (mismatched `sha`), **422** (missing `sha` for a file that already exists).

> **Never re-read the `sha` just to make a write succeed.** That switches the whole protection off. DKM used to fetch the `sha` right before writing, so the last save silently overwrote the other person's work. It is the one mistake in this whole mechanism that destroys data without a word.

The conflict is not shown to the user. It is handled by a loop:

```
attempt(n):
  response = PUT(state.ghSha)
  if not a conflict → done
  if n >= 3 → give up and report an error
  mergeWithRemote()      // downloads, merges, moves ghSha on
  attempt(n+1)
```

Three attempts are a compromise: with two people one is enough; with ten the loop would spin pointlessly and "try again" is the better answer.

## 2.4 The three-way merge

The input is three projects (**base**, **mine**, **theirs**); the output is merged data and **a report of what happened**. The report is not decoration: it is the only way the user learns that somebody's change gave way.

```
{ prevzatoEntit, pridanoEntit, smazanoEntit,
  kolize: [{id, nazev, pole:[…]}],
  oziveno: [{nazev, strana}],
  zahozenychOdkazu, zmenenoModelu }
```

The counts are **from the point of view of what arrived from the other side**: `prevzatoEntit` are entities that changed on their side, `pridanoEntit` those I did not have, `smazanoEntit` those **the other side deleted** and I had not touched. My own deletions are not counted — I know about those.

When there is no base (the project was created locally and is only now being saved into someone else's file), the merge runs **against an empty project**. That turns the merge into a union in which the saver wins any clash and **nothing of theirs is deleted**. This is why there is no "overwrite / reload" dialog: automatic saving comes through here and must never be blocked.

## 2.5 The rules, level by level

### The model (`entityTypes`, `aspects`, `relationTypes`, `selectLists`, `tagSets`, `savedViews`, `jsonExports`)

Union by `id`; **on a clash my copy of the whole object wins**. The user minds the model themselves; this is only here to stop a save from deleting someone else's new type.

One exception: **the auto-numbering counter** (`autoInc`, `posledni`). There the **maximum of both sides** is taken, not the winner of the clash — whoever created entities on the other side moved `posledni` on their side, and my lower value would hand out numbers a second time. The base is **not** counted into the maximum: if both sides lowered it, that is a deliberate reset.

### An array of objects with `id` (entities, comments, objects, custom attributes)

First it is decided **what stays in the array**:

| Base | Mine | Theirs | Result |
|---|---|---|---|
| absent | present anywhere | — | **stays** (somebody added it) |
| present | present | present | **stays** |
| present | absent | absent | **gone** (both deleted it) |
| present | present | absent | stays **only if I changed it** → reported as "revived" |
| present | absent | present | stays **only if they changed it** → reported as "revived" |

So: **only the side the other one did not touch may delete. An edit beats a deletion.** The other order would throw away the other person's work — which is exactly what this is here to prevent. A revived item is **always reported**, even in a silent merge: the user deleted it and it is back, and they must know.

Then each surviving item is resolved:

- only I changed it → **mine**,
- only they changed it → **theirs**,
- **both** changed it → per-item merge (for entities `slucEntitu`; for the model, "mine"),
- nobody changed it → mine (they are identical).

The output order is **my order**, with whatever the other side added appended at the end. Data is never reordered.

### One entity

| Part of the entity | Rule |
|---|---|
| scalars (`name`, `inInbox`, `archived`, `typeId`, `createdAt`, `locked`, `pinned`) | they did not change it → mine; only they changed it → **theirs**; both changed it differently → **mine**, and a **conflict** is recorded |
| `attributes` | **per key**, by the same rule — two people on different attributes of the same entity never clash. An empty value removes the key |
| `aspects` | set membership: what the other added is added; what the other removed disappears; what I added stays |
| `relations` | set membership keyed by the **pair `(relationTypeId, targetId)`** |
| `customAttributes`, `comments`, `objects` | by `id` (table above); comments and objects are additive in practice, so they almost never clash |
| `updatedAt` | **the later of the two** — the date is a fact here, not something to argue about |

**This table only applies when both sides changed the entity.** When only one side changed it, **that side's version is taken wholesale** (see the resolution step in § 2.5 above) — nothing is compared attribute by attribute, because there is nothing to compare it with. This matters when writing tests: an empty value removes the key only on that per-key path; in a foreign version taken wholesale it stays exactly as the other side wrote it.

**Why a relation is identified by the pair and not by its `id`:** every client makes relation `id`s up itself. Two people adding a different relation to the same entity would be reported as a conflict with `id`s, and one relation would vanish. With the `(type, target)` pair they do not clash at all — and two relations of the same type to the same target are one relation anyway.

**A conflict (`kolize`) means the other side's field value gave way.** The saver wins, because they have the data in front of them — but it must be reported, see § 2.8.

### After the merge: cleaning up references

`uklidOdkazy` walks the merged data and drops references to entities that no longer exist — `relations[].targetId` as well as the values of `relation`-typed attributes (including `customAttributes`). Without it, deleting an entity on the other side would leave relations pointing into nothing. The count goes into the report.

The order matters: **merge first, clean up second.** The other way round would clean against a stale list of entities.

## 2.6 After a merge the new base is **theirs**

Not the merged data. The reason is mechanical: after the merge `state.ghSha` points at **their** file, so the base must be what is in that file. If merged data were put into the base, the next save would compute its difference against something that was never on GitHub, and "I changed this" would be judged wrongly.

The merged data is `state.data`, i.e. **my** copy — and that differs from the new base, so it stays `dirty` and is sent out by the next save.

## 2.7 The shortcut: nothing in progress

When `!state.dirty && !state.view.edit`, **their version is taken wholesale** and nothing is merged. No conflict and no revival can arise there, so the screen stays completely silent. It is the most common case: one person reading, another writing.

The base, `state.data` and `ghSha` are set to their version, `ghPath` is preserved (it belongs to this browser), and a trace with the number of entities that arrived is written into the ↻ button's tooltip.

## 2.8 What the user learns about a merge

The split is deliberate and follows two rules: **a question that is always answered the same way is not a question**, and **it must be possible to read the information that somebody's change gave way.**

| What happened | Manual merge | Automatic (silent) |
|---|---|---|
| nothing new | toast "nothing new" | silent |
| entities taken over / added / deleted | toast with counts | **silent** — a trace in the ↻ tooltip, the button blinks |
| **conflict** (both sides on the same field) | a **banner** that does not disappear by itself | **banner** |
| **revived entity** (an edit beat a deletion) | **banner** | **banner** |
| **a different project** on that path | it merges (the user asked for it) | **banner with a question** |
| network / token error | toast | always reported, autosave switches off |

**Why a banner and not a toast:** right after a merge comes the "saved" message, which would cover a toast — and that toast is the only notice that somebody's change gave way. **Why not a dialog:** automatic saving comes through here and must not be blocked.

The trace of a silent merge is **composed** into the tooltip, not appended (base tooltip + last merge) — otherwise it would grow by a sentence with every merge.

## 2.9 Watching for other people's changes

```
GET /repos/{owner}/{repo}/commits?per_page=1&path={path}
```

This asks **only for the latest commit, not the content** — and only while the window is visible. When the commit `sha` differs from the one we remember, an automatic merge is started.

The cadence is adaptive: **20 s** while somebody is working, **120 s** when idle (switched by the last key or click). Even the fast cadence is cheap — 180 requests an hour against a limit of 5000. Nothing is asked in the background at all; on returning to the tab a check runs immediately.

**Your own commit must not look like somebody else's.** The `sha` of our own commit is taken straight from the `PUT` response (`result.commit.sha`); asking for it separately is only a fallback. Without that, the check can run first and the application merges with itself.

Only what would get in the way is deferred:

- **an open dialog** → merge once it closes,
- **a save in flight** → wait for the next tick,
- **a backgrounded window** → the check does not start at all.

**An open editor is not in the way**: it merges but does not re-render — re-rendering would steal focus mid-word, and the entity being edited is merged when it is committed anyway (§ 2.11).

## 2.10 Automatic saving

An optional switch. After each change it waits for **2.5 s of quiet** (typing in the editor reports a change on every keystroke and a commit per keystroke would be nonsense). The switch lives **in page memory only**: "I am sending my work out" is a matter for whoever is at the computer, not a property of a project people pass around. Whether it turns itself on after loading is held by a **browser preference**, not by the data.

- Concurrency is guarded by a "running" / "again" pair of flags — two saves at once would overwrite each other's `sha`.
- **After an error autosave switches off.** Retrying on every change would, with a bad token, mean an endless stream of error messages.
- Leaving the tab does not wait for quiet; it sends immediately.
- A silent save suppresses the message, **not the sound** — the tone is the only feedback a silent save has. An error is always reported.

## 2.11 An open editor is a deferred copy too

Between opening the editor and pressing Save, something from the other person may have been merged in the background. Saving the in-progress copy as it stands would overwrite their changes to that entity.

So **a three-way merge runs here too**, just over a single entity: the base is the state when the editor opened, "mine" is the in-progress copy (which wins a clash, because a person is typing it right now), and "theirs" is what is in the data now. The merge may bring in foreign attribute values, so the composed name is recomputed afterwards.

## 2.12 The one question that is left

The automatic path balks at exactly one situation: **a different project** lies on that path. It is recognised by sharing **not a single entity** with ours (an empty side is not considered a different project — merging into emptiness is safe). Merging would pour two unrelated projects into one, and untangling that is hard.

So a banner appears offering **Merge** — not Reload, which would throw away work in progress. A manually started merge does not ask: the user asked for it themselves.

## 2.13 The 1 MB trap in the Contents API

**The Contents API only returns a file's content up to 1 MB.** Above that it returns `content: ""` and `encoding: "none"`, so a naive `atob(response.content)` yields an empty string and `JSON.parse` throws. Meanwhile the data in the repository is whole and undamaged — it only looks damaged. One embedded file is enough to get there; base64 also inflates the content by a third.

DKM handles this with a fallback read: when the content does not arrive in the response, it is fetched by `sha` from `/repos/{owner}/{repo}/git/blobs/{sha}` (good for up to 100 MB). It is **one function**, used by project loading and by conflict merging alike — a second copy of that logic belongs nowhere.

Part of the same thing is an **overwrite guard**: until the file has genuinely been loaded, nothing may be saved. Without it, one failed load leaves an empty state running and automatic saving overwrites the user's entire data with it. In DKM that role is played by `ghSha` and the base: without a load there is no `ghSha`, and without a `ghSha` the only write that succeeds is into a file that **does not exist** (a `PUT` with no `sha` over an existing file returns 422, i.e. a conflict, and a conflict is resolved by merging, not by overwriting).

**The same limit applies to writing, from the other side.** Contents `PUT` stays for
ordinary small saves; above `GH_MEZ_VELKEHO` (1 MB of content bytes) the commit is assembled
from the Git Data API: blob → `git/trees` with `base_tree` → `git/commits` →
`PATCH git/refs/heads/{branch}`. The path to the project does not carry a branch (the Contents
API writes to the default branch), so the Git Data API path has to look it up on the
repository — `ghVychoziVetev` remembers it per repository.

**The overwrite guard must not be bypassed in the process**, and it is the only thing that
really matters on this path. The Contents API provides it for us when we send the `sha` in the
body of the `PUT`. The Git Data API has no such parameter, so it is assembled from two pieces:

1. **the file's sha is compared with the one we started from** (`ghShaSouboru`). A mismatch
   means somebody else's write → a conflict. **A fresh sha is never fetched to make the write
   succeed.**
2. **The branch update goes without `force`.** If somebody committed in the meantime, our
   parent is stale, the update is not a fast-forward, and GitHub rejects it (422) → a conflict.

Both return **the same response shape, `{__konflikt:true}`**, as 409/422 from the Contents API,
so the "download, merge, retry" loop is one for both paths and does not have to know about the
large one.

Two edge cases this path otherwise gets stuck on: **the file does not exist yet** (the sha is
`null` on both sides, so nothing is compared and the tree is simply added on top of
`base_tree`), and **a repository without a single commit** — that one has no branch, so the
commit is assembled with no parent, the tree with no `base_tree`, and the branch is **created**
with `POST git/refs` rather than updated. Without the second case, the first save of a large
project into a fresh repository ends on a 404.

And for large files, build base64 **in chunks** (`TextEncoder` + `String.fromCharCode.apply`): `btoa(unescape(encodeURIComponent(text)))` over a multi-megabyte string creates enormous intermediate copies.

## 2.14 `BroadcastChannel` is a different thing

Alongside GitHub there is a second, unrelated mechanism: synchronisation **between tabs of the same browser**. It is instant, it sends the whole data, and it merges nothing — it only offers a banner when the other window has work in progress.

The channel is per **workspace** (`dkm-sync-<id>`), because `BroadcastChannel` is heard by the whole origin and two projects open in two windows would otherwise overwrite each other's data.

Do not conflate the two. GitHub handles **different people**; `BroadcastChannel` handles **different windows of one person**.

## 2.15 What this does not guarantee

Saying so plainly is part of the design:

- **No locking.** Two people may change the same entity; on a clash on the same field one value gives way and that is reported.
- **A conflict is resolved in favour of whoever is saving.** Not "the last one", not "the newest by timestamp" — in favour of the one with the data in front of them.
- **Auto-numbering values are not unique.** Two windows creating an entity at the same moment get the same number. Without a server there is no way around it.
- **An entity lock does not block merging.** Merging is not a user action, and if a lock stopped it, the two copies of the file would diverge for good. The same goes for a relation's target restriction and for any other input check: a write that is not by hand throws nothing away.
- **Latency is seconds to minutes**, not milliseconds.
- **Client time is not used to decide anything.** `updatedAt` is taken as the later of the two, but what wins is decided by the **structure of the difference**, not by clocks. Clocks on two computers do not agree.

---

# PART 3 — PROGRAMMER'S DESCRIPTION

## 3.1 The function map

Everything is in `dkm/index.html`. The names are Czech, because the whole repository is Czech.

| Function | What it does |
|---|---|
| `slucProjekty(zaklad, moje, jejich)` | **the main entry point.** Returns `{data, zprava}` |
| `slucPodleId(zaklad, moje, jejich, slucPrvek, onOziveno)` | merges an array of objects with `id` (§ 2.5) |
| `slucEntitu(zaklad, moje, jejich)` | one entity; returns `{entita, kolize:[field names]}` |
| `clenstvi(zaklad, moje, jejich)` | three-way merge of set membership (aspects, relation keys) |
| `klicVazby(r)` | `JSON.stringify([relationTypeId, targetId])` — a relation's identity |
| `uklidOdkazy(data)` | drops references to non-existent entities; returns the count |
| `slucSVzdalenym(parsed, {tiche})` | downloads the file, merges it into `state.data`, moves the base and `ghSha` on |
| `slucitZGithubu()` | the manual Merge (the ↻ button) — downloads and merges, **but does not save** |
| `saveToGitHub(tiche)` | writes with `state.ghSha`; on a conflict merges and retries at most 3 times |
| `zkontrolujVzdalene()` | asks for the latest commit, adaptive cadence |
| `automatickeSlouceni(parsed)` | silent merge, deferred while a dialog is open |
| `ohlasSlouceni(z, tiche)` | decides toast / banner / trace (§ 2.8) |
| `ghNactiSoubor(parsed)` | download with the blob fallback above 1 MB |
| `ghZapamatujCommit()` | so our own commit does not look foreign |
| `snapshotBaseline()` / `hasBaseline()` | the base of the three-way merge |
| `mergeEmpty(p)` | normalises a foreign file — the canonical definition of the format |
| `jinyProjekt(a, b)` | two projects without a single entity in common |

Helpers: `slKopie` (deep copy), `slStejne` (comparison via `JSON.stringify` with `undefined → null`), `slPodleId` (array → `Map`).

**Mind the name clash:** `klicVazby` belongs to merging and carries the type+target pair. `klicSkupinyVazby` is something else — the grouping of relations by type and direction in the Relations card and in the table export.

## 3.2 Pseudocode

```
mergeProjects(base, mine, theirs):
  result = deep copy of mine

  # 1. the model
  for each model collection k:
     result[k] = mergeById(base[k], mine[k], theirs[k], mergeItem = (b,m) => m)

  # 2. auto-numbering counters: the maximum of both sides; the base does not count
  for each autoInc attribute a in result:
     a.posledni = max(a.posledni, mine…a.posledni, theirs…a.posledni)

  # 3. entities
  result.entities = mergeById(base.entities, mine.entities, theirs.entities,
      mergeItem = (b,m,j) => { r = mergeEntity(b,m,j); record conflicts; return r.entity },
      onRevived = (e,side) => record the revival)

  # 4. clean up only after merging
  result.droppedRefs = cleanUpRefs(result)
  return { data: result, report }


mergeById(base, mine, theirs, mergeItem, onRevived):
  survives = {}
  for each id in the union of all three sides:
     inB, inM, inJ = id is in base / mine / theirs
     if !inB:                      survives += id if inM || inJ ; next
     if inM && inJ:                survives += id ; next
     if !inM && !inJ:              next                      # both deleted it
     if inM && !inJ:               if changed(base, mine): survives += id; onRevived(mine, 'mine')
                                   next
     if changed(base, theirs):     survives += id; onRevived(theirs, 'theirs')

  resolve(id):
     b,m,j = the items
     if m && j:
        if changed(b,m) && changed(b,j): return mergeItem(b,m,j)
        return changed(b,j) ? j : m
     return m || j

  # order: mine first, then whatever the other side added
  return [ resolve(id) for id in my order ] ++ [ resolve(id) for id in their order, not already there ]


mergeEntity(base, mine, theirs):
  e = deep copy of mine ; conflicts = []

  take(field, valB, valM, valJ, set):
     if !changed(valB, valJ):  return               # they did nothing → mine
     if !changed(valB, valM):  set(valJ); return    # only they → theirs
     if valM != valJ:          conflicts += field   # both differently → mine, but report

  for each scalar: take(...)
  for each attribute key: take(...)      # an empty value removes the key
  e.aspects   = membership(base.aspects, mine.aspects, theirs.aspects)
  e.relations = membership keyed by (relationTypeId, targetId)
  e.customAttributes / comments / objects = mergeById(...)
  e.updatedAt = the later of (mine.updatedAt, theirs.updatedAt)
  return { entity: e, conflicts }


membership(base, mine, theirs):
  out = mine
  out += { k in theirs : k not in base }                 # what the other added
  out -= { k in base : k not in theirs && k in mine }     # what the other removed
  out += { k in mine : k not in base }                    # what I added
  return out


save(silent):
  attempt(n):
     response = PUT(content = my data, sha = ghSha)
     if 409 or 422:
        if n >= 3: error "gave up"
        mergeWithRemote()        # moves the base and ghSha on
        return attempt(n+1)
     return response
  result = attempt(0)
  ghSha = result.content.sha
  dirty = false ; base = snapshot(my data)
  last known commit = result.commit.sha      # so our own commit does not look foreign


mergeWithRemote(path, silent):
  (text, sha) = download(path)                  # with the blob fallback above 1 MB
  if sha == ghSha && a base exists:             "nothing new" ; return
  theirs = mergeEmpty(JSON.parse(text))
  base = base exists ? base : empty project
  if silent && differentProject(base, theirs):  banner with a question ; return
  if silent && !dirty && !editor:               mine = theirs ; base = theirs ; ghSha = sha ; return
  result = mergeProjects(base, mine, theirs)
  mine = result.data
  base = copy of theirs           # NOT the merged data — ghSha points at their file
  ghSha = sha
  reportMerge(result.report, silent)
  if !editor: re-render
```

## 3.3 Invariants

Eight sentences that must not be broken. Each of them rests on a mistake that has actually happened:

1. **The `sha` is not re-read just to make a write succeed.** What is sent is the version we started from.
2. **After a merge the base is *their* version**, not the merged data — `ghSha` points at their file.
3. **A relation's identity is `(relationTypeId, targetId)`**, never `id`.
4. **Only the side the other one did not touch may delete.** An edit beats a deletion; a revival is reported.
5. **A merge never blocks and never asks** (the one exception is a different project). No lock, no input check, no dialog.
6. **Conflicts and revivals are always reported**, even in a silent merge, and in an element that does not disappear by itself.
7. **Reference cleanup runs after the merge**, not before it.
8. **Auto-numbering counters merge by maximum**, not by the winner of the clash.

Plus two security ones: **a token, an API key or an author's name belong neither in the project data, nor in the debug log, nor in a URL** — only in browser storage. And **until the file has genuinely been loaded, nothing is saved.**

## 3.4 Test scenarios

The minimum every implementation must pass. All of them can be written as pure tests over three JSON documents, with no network and no browser:

| # | Scenario | Expectation |
|---|---|---|
| 1 | each side adds a different entity | both stay |
| 2 | each side changes a **different attribute** of the same entity | both changes stay, no conflict |
| 3 | each side changes the **same** attribute differently | mine wins, **conflict reported** |
| 4 | I delete an entity the other side did not touch | **it is gone**; `smazanoEntit` does not go up (that deletion is mine) |
| 4b | the other side deletes an entity I did not touch | **it is gone** and is reported in `smazanoEntit` |
| 5 | I delete an entity the other side changed | **it stays**, reported as revived |
| 6 | each side adds a **different** relation to the same entity | both stay (the `id` vs. pair test) |
| 7 | both add the **same** relation | it is there once, no conflict |
| 8 | the other side deletes an entity I have a relation to | the relation is cleaned up, the count is reported |
| 9 | each side adds an entity with an auto-numbered value | the counter is the **maximum**, not my value |
| 10 | no base (a new project into a foreign file) | a union; nothing of theirs disappears |
| 11 | two saves at once | the second hits a conflict, merges and goes through |
| 12 | a file over 1 MB | it loads via the blob, not as an empty string |
| 13 | a file with no entity in common | **a question**, not a merge |
| 14 | nothing in progress on my side | their version wholesale, the screen **silent** |
| 15 | a conflict with the editor open | it merges and does **not** re-render; the entity merges again on save |
| 16 | only the other side changed the entity | their version is taken wholesale; nothing is compared attribute by attribute |

Negative tests belong to every item: that no conflict is reported where there is none (items 2 and 7) matters just as much as that one is reported where there is.

---

# PART 4 — BRIEF FOR AN AI

The text below is written to be handed over as a brief to a model that is to build the same thing on the `dkmdata` format in another application.

---

## The brief

Build multi-user work over a single file in the `dkmdata` format stored in a repository (GitHub, or any other store with a conditional write). The application runs **without a server**: all of the logic is on the client, the store is dumb.

**The authority on the format** is `dkmdata-scheme.json` (JSON Schema 2020-12, self-contained) and, in prose, `dkm-formats-en.md`; hand both over with this document. Parts 2 and 3 describe the reference implementation in `dkm/index.html`.

### What to build

1. **A three-way merge** `mergeProjects(base, mine, theirs) → {data, report}` per § 2.5 and the pseudocode in § 3.2. It is a pure function over three JSON documents: no network, no DOM, no global state. Write it that way and test it that way.
2. **An optimistic write**: send the version you started from (`sha`, ETag, generation — whatever the store offers). On rejection, download, merge and retry, at most three times.
3. **Watching for foreign changes**: the cheapest request the store offers (latest commit, ETag, `If-None-Match`), only while the window is visible, with an adaptive cadence of tens of seconds while working and single minutes when idle.
4. **Reporting** at three levels — silence (the ordinary course of a silent merge), a transient message (a manual merge), a persistent element (conflict, revival). No dialog.
5. **Reference cleanup** after every merge.
6. **A fallback read and a fallback write** for files over the store's limit — and **the same overwrite guard on both**: when the fallback path has no "I am writing against this version" parameter, replace it with a version comparison plus a conditional update (on GitHub: the file's sha plus a branch update without `force`). Plus **a guard that nothing is saved until the file has genuinely been loaded**.
7. **Base64 in chunks** over `TextEncoder` / `TextDecoder`, not `btoa(unescape(encodeURIComponent(…)))`.

### What to hold to

- **The eight invariants from § 3.3.** Each one is the fix for a real bug; a broken invariant means silently losing someone else's work.
- **Never ask the user what should be merged.** A merge never takes away work in progress; it only adds. The one legitimate question is "there is a completely different project on that path".
- **Never block a merge with an input check.** A record lock, a relation target restriction, a required field, a closed select list — none of them apply while merging. A merge is not a user action; if a check stopped it, the two copies of the file would diverge for good. A value that fails a check is **marked**, not deleted.
- **Never reorder data.** The order in the file is the user's. Only what is displayed gets sorted.
- **Secrets in browser storage only.** A token or an API key must not be in the project data, in the debug log or in a URL.
- **Identity before time.** The winner is decided by the structure of the difference, not by the client's clock.
- **The modification time is not a change.** Skip `updatedAt` when comparing two versions — otherwise everything will read as "changed".

### How to verify it

The fifteen scenarios from § 3.4, each as a pure test over three JSON documents. In addition:

- validate both input and output against `dkmdata-scheme.json` with **two validators** and **always negatively as well**,
- a concurrency test: two clients saving into the same file in a loop; at the end both must have everything,
- a large-file test (over the store's limit),
- an "empty base" test: the first save into a foreign file must delete nothing.

"Zero errors" on its own proves nothing. What proves it is the negative test that genuinely fails.

### What to avoid

Mistakes that look like simplifications of this design and quietly destroy data:

| Shortcut | What happens |
|---|---|
| reading the `sha` right before writing | the protection is off; the last save overwrites the other person's work |
| "whoever saved later is right" | everything the other person did in the meantime is lost |
| merging whole entities by `updatedAt` | a change to one attribute throws away all the others |
| a relation's identity by `id` | two new relations on the same entity are reported as a conflict and one vanishes |
| deletion always wins | the other person's edit disappears without a word |
| an "overwrite / reload / merge" dialog | automatic saving stalls on a question nobody is watching |
| putting the merged data into the base | the next difference is computed against something that was never in the file |
| cleaning up references before merging | the cleanup runs against a stale list of records |
| a naive `atob(response.content)` | a file over 1 MB looks damaged while it is perfectly fine |
| a fallback write without a version comparison | it bypasses the protection the ordinary path provides by itself — and you find out only when data is lost |
| saving without a confirmed load | one failed load plus automatic saving equals overwritten data |

---

## Related documents

- `dkm/dkm-formats-en.md` (in Czech `dkm-formats-cs.md`) — the normative description of both formats
- `dkm/dkmdata-scheme.json`, `dkm/dkmpkg-scheme.json` — the machine-readable schemas
- `dkm/docs-en.md` ch. 34 (technical background: browser storage, the GitHub API) — the user manual; it does not describe the formats
- `dkm/CLAUDE.md` — the sections "Dva lidé na jednom souboru: sloučení místo přepsání" and "Sloučení běží samo; ptát se je výjimka"
- `dkm/dkm-sync-cs.md` — the Czech version of this document
