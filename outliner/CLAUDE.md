# CLAUDE.md — Outliner

## Co to je
Jednosouborový **outliner se sloupci** (`index.html`, ~5634 řádků, ~284 kB, 260 top-level
funkcí). Dokument je strom řádků, ke kterému lze přidávat datové sloupce (jako v tabulce),
souhrny, číslování úrovní, styly, filtry, verze a exporty (HTML, Markdown, OPML, CSV, TXT, DOCX).
Ukázkový dokument je `Ukázka.outline` ve složce — slouží jako referenční příklad formátu.

**Žádné externí knihovny** — DOCX i ZIP se generují ručně (`buildZip`, `crc32`, `_blocksToDocx`).
Nepřidávej CDN.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~36 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Datový model (`newDoc()`, ř. 910)
```js
{
  meta: { title, description, authors: [], keywords: [], language: "cs", version: "" },
  columns: [ { id, title, type, isTopic?, isStatus?, summary, width, hidden, format?, popupValues? } ],
  rows: [ { id, cells: {}, children: [], … } ],
  styles: { wholeDocument: {…}, levels: { <úroveň>: {…, headingMap} }, named: { <název>: {…} } },
  numbering: { enabled, levels: [ …až 6 úrovní… ] }
}
```
- Sloupec `topic` (`isTopic`) je vždy přítomný a je typu `markdown`; sloupec `status`
  (`isStatus`, checkbox) je skrytý výchozí sloupec. Tyhle dva nikdy neodstraňuj.
- Sloupce se dělí na **prefixové** (před tématem) a pravé datové (`prefixColumns`,
  `rightDataColumns`) — export i render se toho drží.
- `summary` sloupce (`SUMMARY_OPTIONS`) počítá agregaci z listů (`leafValues`, `computeSummary`).
- Formát souboru je `.outline` (JSON). `normalizeDoc(d)` dorovnává starší dokumenty —
  při rozšíření modelu ho doplň.

## Typy řádků
`ROW_TYPES`: `normal`, `strong`, `em`, `ins`, `del`, `mark` (inline) a `blockquote`, `article`,
`aside` (blokové). Mapují se na skutečné HTML značky (`tag`, `kind`) — je to sémantika, ne jen
vzhled; při exportu se z nich generují odpovídající elementy. Typ řádku se dá také filtrovat
(podmínka „Typ řádku“) a odečítač ho ohlašuje při pohybu po osnově.

**V DOCX mají `ins` a `del` revizní sémantiku, ne vizuální.** `exportDOCX` je nepřevádí na
tučné / přeškrtnuté, ale obalí téma řádku CriticMarkupem (`{++ ++}` / `{-- --}`) a nechá
existující aparát sledovaných změn vygenerovat skutečné `<w:ins>` / `<w:del>` — takže se
ve Wordu chovají jako revize a respektují volbu „Sledované změny přijmout“ (`accepted`).
Obaluje se **každá část zvlášť** (první řádek tématu i jednotlivé neprázdné řádky zbytku),
aby CriticMarkup zůstal v každém bloku vyvážený; kdo to zjednoduší na jedno obalení celého
textu, rozbije víceřádková témata.
`strong`, `em` a `mark` zůstávají vizuální (`mark` → žluté zvýraznění, Word nezná „sledované
zvýraznění“).

## Číslování
`computeNumbering()` + `NUM_FORMATS` (`decimal`, `upper-alpha`, `lower-alpha`, `upper-roman`,
`lower-roman`) s pomocníky `toAlpha`, `toRoman`. Číslování je **per úroveň** (až 6),
podporuje hierarchické i průběžné (`hierarchical`, `continuous`) a lze ho přenastavit
pro jednotlivou sekci (`openSectionNumbering`, `toggleSectionStart`). Když měníš čísla,
projdi i export — čísla se do výstupů promítají přes `topicPrefixExport`.

## Zrcadlené řádky (mirrors)
`makeMirror(sourceId)`, `mirrorSource(r)`, `isMirror(r)` — jeden obsah na více místech osnovy.
Každá operace nad řádkem musí rozlišit zrcadlo od originálu; editace zrcadla se propisuje
do zdroje, mazání zrcadla nesmí smazat zdroj.

## Datové typy sloupců a jejich hodnoty
Text, markdown, checkbox, číslo, datum, doba trvání, popup (výběr z `popupValues`) a další.
Pomocníci: `parseDuration`/`formatDuration`, `parseDate`/`formatDate`/`isoToDateInput`,
`formatNumber(value, format)`. Čtení a zápis buňky **vždy** přes `cellValue` / `setCellValue`
/ `cellDisplay`, ne přímo do objektu.

## Filtry a hledání
Podmínkový filtr (`defaultCondition`, `evalCondition`, `rowMatchesConditions`, `opsForType`)
s rekurzivní volbou — `subtreeVisible` rozhoduje, zda se zobrazí i rodič nevyhovujícího řádku.
Rychlý filtr (`applyQuickFilter`), hledání s náhledem (`runFind`, `findSnippet`, `gotoFind`,
`expandTo`) a fokus na sekci (`focusSection`, `clearFocus`, breadcrumb).

## Hromadné operace a kontextové menu
Režim výběru (`toggleSelectionMode`, `bulkRows`, `isInsideSelected` — hlídá, aby se nevybral
potomek už vybraného podstromu), akce `bulkDelete`, `bulkSetType`, `bulkMoveInto`,
`bulkMoveToRoot`, `openBulkColumn`. Kontextové menu (`openContextMenu`, `renderContextMenu`,
`openSubmenu`, `attachMenuKeys`) je plně ovladatelné klávesnicí včetně podnabídek.

## Verze
`snapshotCurrentDoc()`, `openSaveVersion`, `renderVersions`, `openVersionView`,
`restoreVersion`, `saveVersionAsFile`, `renameVersion`, `deleteVersion`.
Obnovení verze je destruktivní — musí zůstat za potvrzením.

## Import a export
Import: OPML, Markdown, odsazený text, TSV (`importFromText` podle formátu).
Export: HTML (statický i „dynamic“), Markdown, OPML, CSV, TXT a **DOCX**.
DOCX generátor (`_para`, `_run`, `_runsFromNodes`, `_docxTable`, `exportDOCX(accepted)`)
umí CriticMarkup jako Word revize — parametr `accepted` rozhoduje, zda se změny přijmou.
Tudy jdou i typy řádku `ins`/`del` (viz výše), takže změna v této cestě ovlivní obojí.
Vlastní Markdown renderer (`renderMarkdown`, `parseInline`, `parseList`, `parseTableRow`)
je společný pro zobrazení i exporty; při jeho úpravě ověř všechny výstupy.

## Přístupnost
Menubar (`menubar`, `menu-file/edit/view/tools/help`, `openMenu`, `menuItemsOf`) s klávesovou
obsluhou, `live-region` + `announce(msg)`, `status(msg)` ve stavovém řádku, řádková navigace
(`onRowKeydown`, `navigateRel`, `flatVisible`), popisy řádku pro odečítač
(`describeRowBrief`, `describeRowFull`, `rowPositionInfo`), roving fokus a `focusOutline()`.
Osnova se renderuje jako vnořené seznamy s nadpisy podle hloubky (`tagForDepth`, `depthIsHeading`).
**Každá nová akce potřebuje hlášení přes `announce()` a dosažitelnost klávesnicí.**

## Konvence
- Vše česky, texty natvrdo (nemá i18n vrstvu). `escapeHtml(s)` / `esc(s)` / `xmlEsc(s)`
  podle cílového formátu.
- `BUILD` je číslo buildu — při větší změně ho zvyš.
- Panely v postranním liště (`panel-columns`, `panel-numbering`, `panel-styles`,
  `panel-filters`, `panel-sections`, `panel-meta`, `panel-debug`) mají svoje `refresh*()`
  funkce; po změně dat volej `fullRefresh()` nebo konkrétní `refresh*`.
- Ukládání do souboru i do schránky (`clipboardSaveProject`, `clipboardLoadProject`).

## Ověření změny
Načti `Ukázka.outline` → přidej sloupce různých typů včetně popup a souhrnu → zapni číslování
a přenastav ho pro sekci → typy řádků → zrcadlo → filtry (vč. rekurzivních) a hledání →
fokus na sekci a breadcrumb → hromadné operace → verze a její obnovení →
export do všech formátů (DOCX otevři ve Wordu, ověř revize) → import OPML a Markdownu →
průchod celé aplikace klávesnicí včetně menubaru a kontextového menu.
