# CLAUDE.md — Správce záložek (bookmark)

## Co to je
Jednosouborový správce katalogu záložek (`index.html`, ~3304 řádků, ~126 kB).
Hierarchie je **Skupina → Složka → Záložka**, k tomu globální tagy, poznámky u záložek,
fulltext, import/export CSV a TSV a ukládání do souboru **nebo na GitHub** (i do privátních
repozitářů). Bez vlastního backendu; aplikace startuje **prázdná** — žádná vzorová data.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~21 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Struktura souboru
Jeden `<script>`, členěný bannery `===================== DATA / STATE / UTILS / VIEW URL PARAM /
HEADER TITLE / RENDER / MANAGE MODE / SEARCH / TAGS / CRUD / DIALOGS / DIALOG SAVE HANDLERS /
FETCH PAGE TITLE / MAIN NAV / MANAGE TOGGLE / SEARCH INPUT / SAVE BUTTON / COLLECTION SETTINGS /
OPEN FROM GITHUB / GITHUB STATUS BAR / GITHUB LOAD / GITHUB SAVE / SAVE (UNIFIED) /
AUTO-LOAD FROM URL / CSV-TSV =====================`. CSS je inline, ikony jsou inline SVG,
žádné externí knihovny.

## Datový model
```js
appData = { /* metadata kolekce (název, popis) */, groups: [ { id, name, folders: [ { id, name,
            bookmarks: [ { id, name, url, desc, tags: [], notes } ] } ] } ], tags: [ …globální… ] }
state   = { /* aktivní skupina, režim správy, filtr, hledání, ghPath … */ }
```
- `uid()` generuje id na všech úrovních.
- **Tagy žijí na dvou místech**: v `appData.tags` (globální seznam) a v `bm.tags` u záložek.
  `getMergedTagNames()` je slučuje a řadí. Smazání globálního tagu ho musí odstranit
  **i ze všech záložek** (`deleteGlobalTag`) — na tohle pozor při jakékoli úpravě tagů.
- Přesuny řeší `moveArrayItem()` + `moveGroup` / `moveFolder` / `moveBookmark`.

## Režim správy (manage mode)
UI má dva stavy: čtecí a **správa** (`#manageToggle`, `updateManageUI()`). Editační tlačítka,
správa tagů a přidávání poznámek se zobrazují jen ve správě. **Vypnutí správy automaticky
ukládá** — pokud přidáváš editační akci, zařaď ji do stejného mechanismu, jinak uživatel
o změny přijde.

## GitHub integrace
- Token: `localStorage["bm_github_token"]`. **Zůstává jen v prohlížeči** — nikdy ho neukládej
  do dat kolekce, do sdílených URL ani nikam neposílej. Odkaz na tvorbu tokenu
  (`github.com/settings/tokens?type=beta`) v dialogu zachovej.
- Cesta ve tvaru `owner/repo/cesta/soubor.json` (`parseGhPath`), kódování přes `ghEncode`/`ghDecode`.
- Načítání: velké soubory jdou přes **Git Blob API** (CORS-bezpečné i pro privátní repozitáře) —
  tuto větev neodstraňuj.
- `save()` je sjednocené uložení: podle stavu buď na GitHub, nebo do souboru (`saveToFile()`).

## Sdílené odkazy — `?view=`
`viewEncode` / `viewDecode` kódují base64 hodnotu ve tvaru
`group:<gid>` | `folder:<gid>:<fid>` | `tag:<názevTagu>`.
`applyViewParam()` se aplikuje **až po načtení dat z GitHubu** (nebo hned, když se nenačítá),
a u složky navíc odscrolluje na cíl. Když přidáváš nový typ pohledu, drž se stejného
prefixového formátu a doplň obě funkce i `buildViewUrl`/`copyViewUrl`.

## Načítání názvu stránky
`fetchPageTitle(url)` používá **veřejnou CORS proxy `allorigins.win`** (`raw=true`), timeout
10 s, hledá `<title>`, dekóduje HTML entity; když je pole názvu prázdné, vyplní ho, jinak
nabídne přepsání. Je to jediné místo, kde nástroj kontaktuje třetí stranu mimo GitHub —
kdybys to měnil, počítej s tím, že jde o funkci závislou na cizí službě, a ponech ji volitelnou
a bez pádu při selhání.
V dialogu záložky navíc `Enter` v poli Název rozpozná **Markdown odkaz** `[text](url)` a rozdělí ho.

## CSV / TSV
`detectSeparator()` rozpozná oddělovač, `parseCsvLine`/`parseCsv` zvládají uvozované hodnoty,
`rowVal(row, keys)` mapuje **české i anglické názvy sloupců**. Import má volbu duplicit
(přeskočit / přepsat) a cílovou skupinu. Export umí do schránky i do souboru.
Při rozšiřování sloupců doplň obě jazykové varianty názvu.

## Přístupnost
Skupiny jsou plnohodnotné ARIA taby: `#tabList` + `handleTabKeydown` s
`ArrowLeft/ArrowRight/Home/End`, `Enter`, `Escape` a mezerníkem. `#liveRegion` plní `announce()`,
je tu skip-link, `#loadingBar` pro `loading(on)` a dialogy (`openDialog(id, focusId)` /
`closeDialog`) s `escapeHandler` a cíleným fokusem. Složky mají přímé `h2` nadpisy,
**ne** `details/summary` — to je záměrné rozhodnutí, neměň to.
Mazání vždy přes `confirmDelete(msg, cb)`.

## Konvence
- Vše česky, texty natvrdo (nemá i18n vrstvu).
- Uživatelský text vždy přes `esc(str)`; `highlight(text, query)` zvýrazňuje ve výsledcích
  hledání — pozor, aby zvýrazňování nebylo cestou k vložení HTML.
- Vanilla JS, žádný build krok, žádné CDN.
- `#debugPanel` + `debug(msg)` jsou vývojová pomůcka — nech je tiché a neinvazivní.

## Ověření změny
Prázdný start → skupina, složka, záložka (vč. „Načíst název“ a Markdown odkazu) → tagy
(přidat, filtrovat, smazat globální a ověřit odstranění ze záložek) → poznámky → hledání →
přesuny na všech třech úrovních → vypnutí správy (musí uložit) → uložení do souboru a načtení →
GitHub: token, uložení, načtení, sdílecí `?view=` odkaz pro skupinu, složku i tag →
import a export CSV i TSV → ovládání tabů klávesnicí.
