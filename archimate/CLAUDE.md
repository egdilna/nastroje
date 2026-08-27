# CLAUDE.md — ArchiMate 3.2 Editor

## Co to je
Jednosouborový **editor architektury v jazyce ArchiMate 3.2** (`index.html`, ~18 085 řádků,
~846 kB, 338 top-level funkcí). Spravuje katalog prvků a vazeb, diagramy (textově i vizuálně),
ADR dokumenty, architektonické úkoly a poznámky; generuje textové výstupy, exportuje do
AJX/XML/CSV/SVG/DOCX a umí slučování modelů s uživatelským výběrem.

Ve složce jsou závazné doprovodné soubory: **`ajx-schema.json`** (JSON Schema formátu `.ajx`)
a **`docs-cs.md` / `docs-en.md`** (uživatelská příručka). Změna datového formátu se musí
promítnout do obou — schéma i příručka jsou součástí kontraktu.

## Externí závislosti
`docx@9.0.0` (jsDelivr) pro export do Wordu a `fabric.js@5.3.1` (cdnjs) pro vizuální editor
diagramů. Jinak nic; SVG se generuje vlastním kódem.

## Doména: ArchiMate 3.2 je normativní
Konstanty, které drží specifikaci — **nesahat od oka, ověř proti ArchiMate 3.2**:
- `ARCHIMATE_LAYERS`, `ELEMENT_TYPES` (60 typů prvků), `ELEMENT_DESCRIPTIONS`,
- `RELATIONSHIP_TYPES` (11 typů vazeb) a hlavně **`RELATIONSHIP_RULES`** — matice povolených
  kombinací; používá ji `updateAllowedRelationships()` při kaskádovém výběru zdroje a cíle.
  Bez ní editor přestane hlídat validitu modelu, což je jeho hlavní přidaná hodnota.
- `ELEMENT_VISUALS`, `ARCHIMATE_SHAPES`, `RELATIONSHIP_STYLES`, `LAYER_Y_POSITIONS` — vizuální
  notace (tvary a čáry musí odpovídat normě, ne vkusu).

## Formát AJX (`.ajx`)
Povinná pole podle `ajx-schema.json`: `archimateVersion` (`3.2`/`3.1`/`3.0`), `model`,
`elements`, `relationships`, `diagrams`; volitelně `exportDate` a rozšíření editoru
(ADR, úkoly, poznámky, příznaky). Rozšíření musí zůstat **volitelná**, aby soubor přečetl
i jiný nástroj. Kromě AJX se exportuje **ArchiMate Open Exchange XML**
(`generateArchiMateXML`, `generateArchiMateXMLFiltered`) a importuje zpět
(`importXML`, `parseArchiMateXMLForMerge`).

## Perzistence — pozor, více klíčů
```
archimate-model-data   archimate-model        archimate-elements
archimate-relationships archimate-diagrams    archimate-adr
archimate-tasks        archimate-notes        archimate-editor-language
archimate-github-token
```
Data jsou rozdělená do několika klíčů `localStorage` — `saveToLocalStorage()` /
`loadFromLocalStorage()` je jediné místo, kde se to má řešit. **Když přidáš novou entitu,
zapoj ji sem, do exportu, do importu, do slučování i do `clearAllData()`** — jinak
tiše zmizí při uložení nebo zůstane po „vyčistit vše“.
GitHub token nikdy nelogguj, nedávej do modelu ani do sdíleného odkazu
(`copyGitHubLink`, `initGitHubFromUrl` sdílí jen cestu).

## Slučování modelů
`mergeModel()` → náhled po záložkách (prvky / vazby / diagramy) s výběrem položek
(`renderMergeElementsList`, `updateMergeSelectionStats`) → `executeMerge(data, sourceName,
strategy)` → `finalizeMerge(stats, …)`. Import umí AJX i ArchiMate XML.
Sloučení je destruktivní a strategie rozhoduje o kolizích ID — při zásahu vždy ověř
statistiky, které se uživateli ukazují na konci.

## Generátor textových výstupů
`generateText()` se šablonami a placeholdery (`ELEMENT_PLACEHOLDERS`,
`RELATIONSHIP_PLACEHOLDERS`, `TASK_PLACEHOLDERS`, `NOTE_PLACEHOLDERS`, `ADR_PLACEHOLDERS`),
`insertPlaceholder()`, `hasEmptyPlaceholder()`, `getPlaceholderValue()`.
Nový atribut entity = nový placeholder v odpovídajícím seznamu.
Vedle toho `generateStatement(rel)` skládá česká „tvrzení“ o vazbách (náhled u formuláře).

## Diagramy
Dvě cesty, které musí dávat stejný výsledek:
- **katalogová** — prvky a vazby přiřazené diagramu, automatické rozvržení
  (`calculateLayout(diagramElements, layoutType)`) a `generateSVG(...)`;
- **vizuální** — editor na fabric.js s vlastními pozicemi a lomovými body
  (`saveDiagramLayout`, `generateSVGFromVisualData`, `generateRelationshipLineFromPoints`,
  `generateRelationshipMarkerForVisual`).
Plátno je `DIAGRAM_CANVAS_WIDTH × DIAGRAM_CANVAS_HEIGHT` (3000×2000) s mřížkou `GRID_SIZE = 20`.
Když měníš tvary nebo značky vazeb, uprav obě větve generování SVG.

## Příznaky (tagy) a hromadné operace
Příznaky jsou průřezová vlastnost (`updatePříznakySuggestions`, `addTagToPříznaky`,
`removeTagFrom`, `replaceTagIn`, bulk modal) a slouží i k **exportu podle příznaku**
(`exportByTagAJX`, `exportByTagXML`, `getItemsByTag`).
Pozor: **část identifikátorů je česky s diakritikou** (`Příznaky`) — je to zavedená konvence
tohoto souboru, neopravuj ji na ASCII, rozbil bys volání napříč 18 tisíci řádky.

## Import CSV
`detectDelimiter`, `parseCSV`, `autoMapCsvColumns`, `normalizeElementType`, `getLayerForType`,
`importElementsFromCsv` — s náhledem a mapováním sloupců, vstup ze souboru i ze schránky.
`normalizeElementType` je tolerantní k zápisu typu; při přidání typu prvku ho doplň i sem.

## Lokalizace
`TRANSLATIONS` + `t(key, ...args)`, `detectLanguage()`, `changeLanguage(lang)`,
`applyTranslations()`, jazyk v `archimate-editor-language`. Čeština a angličtina;
každý nový text patří do obou. Popisy prvků má `getElementDescription(type)`.

## Konvence
- `escapeHtml(str)` pro HTML, `escapeXml(str)` pro XML/SVG — nezaměňuj je.
- `logChange(message)` píše do interního changelogu (`showChangeLog`, `copyChangeLog`) —
  po každé významné operaci ho volej, uživatelé ho používají k rekapitulaci práce.
- `smartSave()` volí mezi souborem a GitHubem; `saveFileWithDialog` používá File System Access
  API s fallbackem na `downloadFile`.
- Zvuková zpětná vazba `playSuccessSound` / `playLoadSound`.
- Přístupnost je deklarovaná vlastnost („stoprocentně přístupný“) — katalogová cesta musí
  zůstat plnohodnotnou alternativou k vizuálnímu editoru; nové funkce nesmí existovat
  **jen** na plátně.

## Ověření změny
Nový model → prvky napříč vrstvami → vazby (ověř, že `RELATIONSHIP_RULES` blokují nepovolené
kombinace) → příznaky a hromadné operace → diagram katalogově i ve vizuálním editoru
(pozice, lomové body, SVG výstup) → ADR, úkoly, poznámky → generátor textu se šablonami →
export AJX (validuj proti `ajx-schema.json`), XML, CSV, SVG, DOCX → import AJX i XML →
slučování modelů s výběrem → import CSV → GitHub uložení/načtení → přepnutí jazyka →
reload stránky (ověř všechny `localStorage` klíče).
