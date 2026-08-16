# CLAUDE.md — Prohlížeč RPP (Registr práv a povinností)

## Co to je
Jednosouborový prohlížeč otevřených dat **Registru práv a povinností** (`index.html`,
~2946 řádků, ~141 kB). Stahuje datové sady z `rpp-opendata.egon.gov.cz`, ukládá je do
**IndexedDB**, staví nad nimi křížový index vazeb a nabízí záložky s tabulkami, filtry,
detailem záznamu a exportem. Sesterský obecný nástroj je `../opendata`.

`dokumentace.md` ve složce je zatím **prázdný** — pokud budeš psát uživatelskou dokumentaci,
patří sem.

## Struktura souboru
Jeden `<script>` členěný bannery — nový kód zařazuj do příslušné sekce:
`===== Dataset Configuration / State / IndexedDB Cache / DOM / Helpers / JSON Loading /
Loading / Management Panel =====` a dále index, taby, tabulka, detail.
CSS je celé inline; jediná externí knihovna je `xlsx.full.min.js` z CDN (export do XLSX).

## Konfigurace datových sad — `DS_CONFIG`
Srdce nástroje. Každá položka:
```js
{ key:'ovm', name:'Orgány veřejné moci', jsonUrl: BASE_JSON+'ovm.json',
  tableCols:[…], idPrefix:'orgán-veřejné-moci/', large?:true, manualOnly?:true, virtual?:true }
```
Příznaky mění celé chování načítání:
- **`large`** (např. `role`) — pokusí se stáhnout automaticky, při selhání skončí v „pending baru“
  s nabídkou ručního načtení souboru z disku.
- **`manualOnly`** (např. `pusobnost`) — nikdy se nestahuje automaticky, jen ručně.
- **`virtual`** (např. `cinnosti`) — **nestahuje se vůbec**, sestavuje se z jiných sad
  (`buildVirtualCinnosti()` z inline dat v agendách). Pokud už existují reálná jména, nepřepisuje je.

Přidání nové datové sady = položka v `DS_CONFIG` + případná specifická transformace
v `processJsonRecord()`. `BASE_JSON` a `RDF_BASE` jsou konstanty nahoře; identifikátory
záznamů jsou URI začínající `RDF_BASE`.

## Načítání velkých dat — nesahat bez rozmyslu
- `streamParseJSON(file, onProgress)` čte soubor **po 5 MB blocích** (`CHUNK`) a sleduje hloubku
  závorek, aby parsoval jednotlivé záznamy zvlášť. Je to záměrné: zvládá soubory **600 MB+**,
  které by `JSON.parse()` ani `FileReader.readAsText()` nepřežily. Nenahrazuj to naivním parsováním.
- `fetchJsonWithProgress()` streamuje přes HTTP s ukazatelem průběhu a má fallback pro prohlížeče
  bez streamů (spojení bloků a parsování najednou).
- Vadné záznamy se přeskakují („skip bad record“), načítání kvůli nim nepadá.

## Cache v IndexedDB
`IDB_NAME='rpp-prohlizec'`, `IDB_VERSION` (aktuálně **23**), stores `datasets` a `meta`.
**Změna schématu dat v cache vyžaduje zvýšení `IDB_VERSION`** — jinak uživatelům zůstanou
nekompatibilní data. `DATE_PROPS` mapuje pro každou sadu název datumové vlastnosti a slouží
k **inkrementální aktualizaci** (`incrementalUpdate()`). Správa je v panelu „⚙ Správa dat“:
aktualizovat změny / načíst vše znovu / vymazat cache (`fullReload()`, `clearCache()`).

## Křížový index vazeb
`buildIndex()` běží ve třech průchodech:
1. `globalIndex` + `bareIndex` (krátké identifikátory → plné ref ID),
2. `reverseIndex` ze všech referencí v záznamech,
3. **syntetické vazby z URI rolí** — `role/{kódAgendy}/{kódČinnosti}/{IČO OVM}` se rozebere tak,
   aby vazby Agenda↔OVM↔Činnost fungovaly i bez načtené (velké) sady Role.

`enrichFromUri()` dopočítává reference z tvaru URI (`agenda/Axxx`, `činnost/{A}/{C}`,
`kategorie-ovm/KOxxx`, `působnost/{agenda}/{entita}`). Když měníš tvary URI, projdi obě funkce.

## Transformace záznamů (specifika RPP)
- `flattenPusobnostRecord()` — zplošťuje vnořený objekt `registrace` (agenda, ovm, spuú, datum)
  a bere `činnosti` jako pole; dopočítává pole `zdroj` (OVM nebo kategorie).
- `flattenIsvsRecord()` — vytahuje `správce-isvs` a `provozovatel-isvs` z vnořených objektů.
- Ostatní sady jdou generickou cestou + `enrichFromUri()`.

## UI konvence
- Vše česky, včetně názvů vlastností v datech (diakritika v klíčích je normální —
  `platnost-od`, `osoba-v-čele`, `oprávnění-k-přístupu-k-údajům/`). Nepřepisuj klíče na ASCII.
- Prvky se generují s ID podle vzoru `prefix-<klíčSady>` (`tab-`, `panel-`, `tbl-`, `tbody-`,
  `thead-`, `pag-`, `flt-`, `rflt-`, `psz-`, `ds-search-`). Tuhle konvenci dodrž, kód na ní staví.
- Hlášky přes `setStatus`/`#status-area`, ne `alert`. `Escape` zavírá detail i panel správy.
- Odkazy do e-sbirka.cz a LodView u zdrojů zachovej.
- Export: CSV/JSON/XLSX přes `exportData(key, fmt)`.

## Ověření změny
Tvrdý reload s prázdnou cache (Aplikace → IndexedDB smazat) → načtení všech sad → ruční
načtení `role`/`pusobnost` ze souboru → záložky, filtry, hledání, stránkování → detail záznamu
včetně sekcí Působnost/Pracoviště a souvisejících záznamů → permalink na detail →
inkrementální aktualizace → export do všech formátů.
