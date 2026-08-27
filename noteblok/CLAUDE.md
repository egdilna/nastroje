# CLAUDE.md — NoteBlok (NoteBlock)

## Co to je
Jednosouborový **poznámkový systém se složkami a typovanými poznámkami** (`index.html`,
~7607 řádků, ~348 kB, 261 top-level funkcí). Poznámky žijí ve stromu složek, mají emoji ikonu,
tagy, metadata (klíč–hodnota), záložky, verze a Markdown obsah s vnitřními odkazy, includy
a CriticMarkupem. Celý blok se ukládá jako jeden soubor, do schránky nebo na GitHub.

Externí knihovny z cdnjs: `marked` (Markdown), `jszip` (DOCX/ZIP), `FileSaver.js` (stahování).

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~32 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Typy poznámek — hlavní osa nástroje
Volba typu je v dialogu nové poznámky (`dlg-ntype`):
| Typ | Renderer | Include varianta |
|---|---|---|
| `note` textová | `renderNoteView` | — |
| `file` soubor se správou verzí | `renderFileNoteView` | — |
| `task` úkol | `renderTaskNoteView` | `renderTaskInclude` |
| `iframe` webová stránka | `renderIframeNoteView` | — |
| `vfolder` virtuální složka | `renderVFolderNoteView` | `renderVFolderInclude` |
| `database` databáze | `renderDbNoteView` | `renderDbInclude` |
| `diagram` PlantUML | `renderDiagramNoteView` | `renderDiagramInclude` |
| `journal` deník | `renderJournalNoteView` | `renderJournalInclude` |
| `plan` projektový plán | `renderPlanNoteView` | `renderPlanInclude` |

**Přidání nového typu znamená doplnit všechna místa najednou**: volbu v `dlg-ntype`,
render pohledu, include variantu, případný dialog editace, export do MD i DOCX a verzování.
Neúplně zavedený typ se projeví až u exportu nebo includu.

## Poznámka — datový tvar
```js
note = { id, name, folderId, icon, content, tags: [], meta: [], bookmarked, versions: [],
         created, modified, … typově specifická pole … }
```
Názvy poznámek jsou **unikátní** (`noteNameExists`) — vnitřní odkazy se na ně vážou
(`findNoteByName`). Při přejmenování mysli na odkazy i na includy.

## Markdown, odkazy a includy
- `renderMarkdown(src, noteId, depth, seen)` staví nad `marked` a přidává vnitřní odkazy,
  kotvy sekcí (`renderMarkdownWithIds`, `slugify`, `generateTOC`) a placeholdery (`addPH`).
- **Includy** vkládají obsah jiné poznámky: `resolveIncludes(content, depth, seen)` a
  `collectIncludes` hlídají hloubku a cyklus přes `seen` — tuhle ochranu nikdy neodstraňuj.
- `findBacklinks(noteId)` a `findForwardLinks(noteId)` počítají obousměrné vazby;
  `showMissingLinks()` hlásí odkazy na neexistující poznámky.
- `extractCriticComments` a `extractPendingTasks` vytahují komentáře CriticMarkupu
  a nesplněné úkoly napříč blokem (`countPendingTasks`, `showTasks`).
- Editace po sekcích (`toggleSectionEdit`, `splitSections`, `editSection`) — obsah se dělí
  podle nadpisů; při změně parseru ověř, že se sekce po uložení zase správně spojí.

## Diagramy (PlantUML)
Vlastní kodér `pumlEncode6bit` / `pumlAppend3` / `pumlBase64` / `pumlEncodeAsync` (dávkový
`pump()`, aby nezablokoval UI) a URL `pumlPngUrl` / `pumlSvgUrl`. Kódování odpovídá
PlantUML serveru — nesahej na něj bez ověření proti reálnému serveru. Diagramy mají vlastní
verze a kopírování zdroje / PNG URL / Markdownu / wiki zápisu.

## Projektový plán
`planRecalc(tasks)` přepočítává WBS, termíny a délky (`planWbs`, `planDaysDiff`, `planAddDays`,
`planFormatDuration`); stavy jsou `PLAN_STATUSES` = Budoucí, Nezahájeno, Probíhá, Blokováno,
Splněno, Přerušeno, Zrušeno. Operace se stromem úkolů (`planIndent`, `planOutdent`, `planMoveUp/Down`,
`planHoist`) musí vždy skončit voláním `planRecalc`.

## Deník a databáze
- Deník: české názvy dnů a měsíců jsou konstanty `JRNL_DAYS` / `JRNL_MONTHS` (genitivy);
  záznamy se seskupují podle data (`jrnlGroupByDate`, `jrnlDateKey`).
- Databáze: pole s typy, řazení (`dbToggleSort`, `DB_SORT`), filtry (`DB_FILTERS`,
  `dbFilteredRecords`) — stav je globální, po změně dat ho promítni do renderu.

## Panely a náhledová okna
`PANELS` / `ACTIVE_PANEL` / `newPanel` / `switchPanel` / `openNoteInNewPanel` — víc otevřených
poznámek vedle sebe. `PREVIEW_WINS` drží samostatná náhledová okna (`openPreviewWindow`,
`refreshPreview`) — po změně obsahu je nutné je obnovit.

## Filtry navigace
Filtrování stromu podle emoji (`renderEmojiFilter`, `filterByEmoji`), metadat
(`renderMetaFilter`, `openMetaBrowser`, `filterByMeta`), tagů a hoistingu složky
(`hoistFolder`, `unhoist`). Počty se počítají rekurzivně přes podsložky
(`countEmojiNotes`, `folderHasMetaMatch`) — při změně stromu je přepočítej.

## Ukládání
- Soubor bloku: `saveBlock` / `saveBlockToFile` (File System Access API s fallbackem),
  `loadBlockFromFile`, `loadFromUrl`.
- GitHub: token v `localStorage["nb_github_token"]`, cesta `owner/repo/cesta`
  (`parseGhPath`, `ghEncode`/`ghDecode`), `saveToGitHub` / `loadFromGitHub`.
  **Token nikdy nelogovat, neukládat do bloku ani do URL.**
- `READONLY` + `applyReadonly()` — režim jen pro čtení (např. při načtení z URL);
  každá nová editační akce ho musí respektovat.
- Při startu se odregistrovává Service Worker a čistí cache (pozůstatek starší verze).

## Export
`exportNoteMD`, `exportFolderMD` (rekurzivně s úrovněmi nadpisů), `exportNoteDOCX`,
`exportFolderDOCX` — DOCX se generuje **ručně** (`mdToDocxXml`, `buildDocxTable`,
`buildDocxZip`, číslované seznamy přes `numIdOffset` a `resolveIlvl`). Při změně Markdown
renderu ověř i DOCX větev, je psaná samostatně.

## Konvence
- Styl kódu je ES5-ish (`var`, `function`), globální stavové konstanty velkými písmeny
  (`CUR`, `HOIST`, `EFILT`, `MFILT`, `EXPANDED`, `PANELS`…). Drž se toho.
- Vše česky, texty natvrdo (nemá i18n vrstvu). Escapuj přes `esc(s)` / `xmlEsc(s)`.
- Dialogy `showDialog(title, bodyHTML, onOk, okLabel)` + `dlgKeyHandler` (Escape), ne `alert`
  pro potvrzení; `playSound(type)` je zvuková zpětná vazba.
- `dbg(msg)` / `toggleDebug()` je ladicí výpis — nech ho tichý.

## Ověření změny
Vytvoř složky a poznámky **všech devíti typů** → Markdown s vnitřním odkazem, includem
(zkus i cyklus), CriticMarkupem a úkoly → editace po sekcích → tagy, metadata, emoji filtr,
záložky, hoist složky → verze poznámky a jejich obnovení → panely a náhledové okno →
diagram (ověř vykreslení z PlantUML serveru) → plán (přepočet termínů) → deník → databáze
(řazení, filtry) → export MD i DOCX pro poznámku i celou složku → uložení souboru, schránky
a GitHubu → načtení v režimu jen pro čtení.
