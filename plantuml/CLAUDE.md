# CLAUDE.md — PlantUML editor

## Co to je
Největší nástroj repozitáře podle počtu řádků: jednosouborový **strukturovaný editor
PlantUML diagramů** (`index.html`, ~16 211 řádků, ~788 kB, 475 top-level funkcí).
Uživatel needituje text — edituje **model** (strom prvků a vazeb), z něhož nástroj generuje
PlantUML zdroj, náhled z plantuml.com a navíc **souvislý textový popis diagramu** v češtině
i angličtině (přístupná alternativa k obrázku).

**Žádné externí knihovny** — vše je v souboru. Jediná síťová závislost je obrázkový server
plantuml.com pro náhled.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~46 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Podporované typy diagramů (`TYPES`, ř. 2045)
`activity`, `class`, `sequence`, `usecase`, `state`, `component`, `deployment`, `network`
(nwdiag), `gantt`, `timeline`, `timing`, `ebnf`, `mindmap`, `wbs`.

**Každý typ má tři paralelní implementace**, které musí zůstat v souladu:
1. **model** — `emptyModelFor(type)` a stromový editor (`render<Typ>Tree`, `renderDetail`),
2. **generátor** — `gen<Typ>(model, diagram)` v sekci `=== GENERÁTORY ===` (ř. 5667+),
3. **popis** — `describe<Typ>(model)` v sekcích `=== <TYP> — POPIS ===` (ř. 2956–5666),
   ve dvou jazykových mutacích.

Když přidáš prvek do modelu, projdi všechny tři. Chybějící popis je stejná vada jako
chybějící generátor — textový popis je hlavní přístupnostní funkce nástroje.

## Orientace v souboru (sekční bannery)
`=== I18N (549) / UTILITY (1743) / DIALOGY (1932) / STAV (2036) / PROJEKT (2194) /
SDÍLENÉ PRVKY (2248) / STAV „HOTOVO/NEHOTOVO" (2373) / SKRÝVÁNÍ PRVKŮ (2393) /
TEXTOVÝ POPIS DIAGRAMU (2956) / BLOKOVÝ MODEL POPISU (3282) / …popisy po typech… /
GENERÁTORY (5667) / …generátory po typech… ===`

## Kódování pro plantuml.com
`plantUmlUrl(source, format)` staví URL nad `https://www.plantuml.com/plantuml/<fmt>/`:
- primárně **DEFLATE + PlantUML base64** (`_plantumlDeflateEncode`, `_plantumlBase64Encode`,
  vlastní abeceda `PLANTUML_B64_ALPHABET = '0123…-_'`) přes `CompressionStream`;
- fallback na **hex zápis `~h…`** (`textToHex`), když `CompressionStream` chybí nebo selže.

Abeceda ani pořadí bitů se **nesmí měnit** — je dané serverem. Fallback nech, drží starší prohlížeče.

## Vícejazyčnost
`I18N` + `tt(path)`, jazyk v `localStorage["plantuml.editor.lang"]`, výchozí `cs`,
`applyI18nToStaticUI()` po přepnutí. Jazyk ovlivňuje **i generované textové popisy** —
proto existují dvojice slovníků (`SEQ_PARTICIPANT_TYPE` / `…_EN`, `CLASS_STEREOTYPE_WORD` / `…_EN`,
`DEPLOY_TYPE_WORD` / `…_EN`, `SCALE_WORD` / `…_EN`, …). Nový termín **vždy do obou**.

Čeština v popisech je skloňovaná a číslovaná ručně: `plCs(n, one, few, many)` (1 / 2–4 / 5+),
`fmtDateCs` s `CS_MONTHS_GEN` (genitivy), `joinAndCs`, `cardinalityPhrase`, `adjSuffixFor`.
Anglické protějšky jsou `plEn`, `fmtDateEn`, `joinAndEn`. Když píšeš novou větu popisu,
skládej ji přes tyto pomocníky, ne konkatenací — jinak vzniknou tvary typu „3 prvky vazeb“.

## Sdílené prvky
Prvek může být **sdílený mezi diagramy** téhož typu (`findShared`, `promoteToShared`,
`unshareElement`, `renameSharedAlias`, `uniqueSharedAlias`, `findSharedUsages`,
`sharedConfig`, `SHARED_KINDS`). `effective(elem)` vrací výslednou podobu prvku
(lokální hodnoty přebíjejí sdílené). Přejmenování aliasu musí projít všechna použití.

## Příznaky „hotovo“ a „skryto“
Dvě nezávislé vrstvy nad modelem:
- `isDone`/`setDone`/`toggleDone` + `hasDoneDescendant`/`hasPendingDescendant` — workflow stav.
- `isHidden`/`isEffectivelyHidden`/`findHidingAncestor`/`findHidingEndpoint` — skrývání
  ve výstupu. `shouldGenerateElement(d, id)` a `shouldGenerateRelationship(d, rel)` jsou
  **jediná správná brána** generátorů: vazba se nesmí vygenerovat, pokud je skrytý některý
  její konec. Nový generátor je musí volat.

Stavy diagramu (`DIAGRAM_STATUSES`) se ukládají **jako kód nezávislý na jazyku**
(`draft`, …) — do `d.status` nikdy nedávej přeložený text.

## Aliasy a bezpečné identifikátory
`generateAlias(name, existingAliases)`, `sanitizeAliasInput`, `asciiize`, `quoteIfNeeded` —
české názvy se převádějí na ASCII aliasy a názvy se v PUML citují jen když je potřeba.
Při generování nikdy nevkládej uživatelský text nezpracovaný.

## Import z PUML
`parsePuml(source)` a dílčí `parseActivity` / `parseClass` / `parseSequence` / `parseUseCase`
umí načíst zpět jen **část** typů. Když rozšiřuješ generátor, buď rozšiř i parser, nebo počítej
s tím, že daný konstrukt nebude zpětně načtený — nesmí ale při importu shodit celý soubor.

## Nastavení diagramu — volby platné jen pro některé typy
`openDiagramSettings()` / `saveSettings()` zobrazují a ukládají volby **podmíněně podle typu
diagramu** a uložené hodnoty žijí v `diagram.settings`. Vzor, kterým se řiď u každé nové volby:
pole se zobrazí jen pro relevantní typy a **ukládá se jen pro ně** — jinak by v `settings`
zůstal zastaralý stav z dřív otevřeného diagramu jiného typu.

Dnes takto fungují:
- `layoutDirection` — `class`, `usecase`, `component`, `deployment`, `state`, `activity`;
- `hide` direktivy (`setClassHideWrap`) — jen `class`;
- **`language`** (`#setLanguageWrap`, `#setDiagramLanguage`) — jen `gantt` a `timeline`.
  Vygeneruje direktivu `language <kód>` (cs, sk, en, de, fr, es, it, pl, ru, nl, pt, ja, ko, zh)
  a lokalizuje názvy měsíců a dnů v týdnu. **Direktiva musí být hned za `@startgantt` /
  `@startchronology`**, jinak neovlivní následující obsah — v `genGantt()` a `genTimeline()`
  se proto vypisuje jako první. Prázdná hodnota = žádná direktiva.

## Gantt — dopočet dat
`solveGanttDates(model)` (+ `addDays`, `maxDate`, `dayNum`) řeší absolutní i relativní termíny
v sekci `=== ŘEŠENÍ ABSOLUTNÍCH DAT V GANTTU ===` (ř. 6709). Popis termínů skládá
`formatGanttTerm` s českým formátem data. Změny v modelu úkolů promítni do obou.

## Paleta příkazů (sekce `=== PALETA PŘÍKAZŮ ===`)
F1 / Ctrl+Shift+P / tlačítko `#btnPalette`; Shift+F1 otevře `openPaletteHelp()`.
- Příkazy mají dva zdroje: `paletteStaticCommands()` (pevné akce) a
  `paletteDynamicCommands()` (diagramy, složky, verze, stavy, sdílené prvky).
  **Vkládací příkazy se čtou z `#modelToolbar`** — nový prvek v toolbaru se tedy
  v paletě objeví sám a seznam se nikde neudržuje dvakrát. Nový prvek v toolbaru
  pojmenovaný klíčovým slovem PlantUML doplň do `PALETTE_SYNONYMS`, aby se dal
  najít i českým slovem.
- Nová akce s tlačítkem = jeden řádek `add(id, cat, label, hint, keys, run, when)`
  ve `paletteStaticCommands()`; `run` volej přes `palClick('btnXxx')`, ať zůstane
  jediný zdroj pravdy v tlačítku. `when` vynechá příkaz, který teď nejde spustit —
  paleta zásadně nenabízí slepé uličky.
- Hledání (`paletteMatch`) je bez diakritiky (`paletteNormalize` vrací i mapu
  indexů kvůli zvýrazňování), tokeny platí konjunktivně, pořadí preferencí je
  začátek názvu → začátek slova → název → ostatní data → fuzzy. Příkazy s `delete`
  v id mají penalizaci, ať se Enter netrefí do mazání.
- Příkazy se staví při každém otevření, takže reagují na jazyk i na aktuální
  kontext. Spuštění nejdřív zavře `#dlgPalette` a teprve pak volá `run` — dva
  modální `<dialog>` nad sebou nedávají smysl.

## GitHub jako úložiště (sekce `=== GITHUB: … ===`)
Projekt (`.pup`) i PNG diagramů se ukládají přes **GitHub Contents API**.
- Token jen v `localStorage` (`GH_TOKEN_KEY`), posílá se výhradně na `api.github.com`.
  Veřejný repozitář jde číst bez tokenu, zápis (a čtení soukromého) ho vyžaduje.
- Cesta `owner/repo/cesta/soubor.pup` se drží na dvou místech: `project.ghPath` (cestuje
  s projektem) a `localStorage` (`GH_PATH_KEY`). `ghCurrentPath()` je jediný správný
  způsob, jak ji zjistit — projekt má přednost. `newProject` cestu **záměrně maže**,
  aby uložení nepřepsalo existující soubor prázdným projektem.
- Statická adresa `?gh=<base64 cesty>` (`ghEncodePath` / `ghDecodePath`, UTF-8 přes
  `unescape(encodeURIComponent())`); `initGitHubFromUrl()` se volá na konci `init()`.
- `ghPutFile` si vždy nejdřív načte SHA (`ghFetchMeta`), jinak GitHub přepis odmítne.
  Soubory > 1 MB nemají `content` v odpovědi — `ghFetchText` pro ně sáhne na Blob API.
  **Zápis tohle ošetřené nemá**: `ghPutFile` jede vždy přes Contents API, takže u projektu
  nebo PNG nad 1 MB může uložení skončit chybou od GitHubu (data se neztratí, jen se
  neuloží a hláška to řekne). Kdyby na to někdo narazil, řešením je commit z Git Data API
  — vzor `ghUlozitVelke()` v `mros/index.html`, postup v kořenovém `CLAUDE.md`.
- PNG jde do **stejné složky** jako projekt, název = `slugFileName(diagram.name)` — bez
  diakritiky, mezery a speciální znaky nahrazené pomlčkou (kvůli čitelné adrese).
  Stejný diagram dá vždy stejný název, takže se starší verze obrázku přepíše (záměr).
  Pozor na rozdíl: soubory **stahované na disk** používají `safeBaseName`, který český
  název zachová. Slug patří jen tam, kde název končí v URL.
- Raw adresu obrázku staví `ghImageUrlFor` a zobrazuje `renderGhImagePanel` (karta Výstup).
  Cesta se **musí** protáhnout `encodeURI` — názvy diagramů mají mezery i diakritiku.
  Větev raw adresa potřebuje, ale z `ghPath` ji nezjistíš: `ghEnsureBranch` ji načte
  z API (`default_branch`) do `ghBranchCache`, po uložení PNG se upřesní z `download_url`
  v odpovědi; než odpověď dorazí, platí `main`.
- `saveProjectAction()` je za tlačítkem „Uložit projekt" i za Alt+S: s nastavenou cestou
  ukládá do repozitáře, bez ní stahuje `.pup`.
- Hlášky jdou přes `ghStatus()` (dialog + globální status pruh) a mají vlastní slovník
  `L.gh` — nový text patří do **obou** jazykových mutací.

## Konvence
- `el(tag, props, …children)` staví DOM, `clear(node)` čistí — nepoužívej `innerHTML`
  s uživatelským textem.
- Dialogy `dlgPrompt` / `dlgConfirm` / `dlgChoice`, hlášky `status(msg, type)`,
  ladění `debug(label, data)` do `#debugContent`.
- Strom má vlastní klávesovou navigaci (`setupTreeKeyNav`) a položky se staví přes `treeItem(…)`
  s badge, stavem hotovo a příznakem skrytí — nové stromy stav prvků respektují.
- `validateDiagram(diagram)` kontroluje konzistenci modelu; při rozšíření modelu doplň kontroly.
- Vygenerovaný HTML export obsahuje vlastní `<style>` a `<script>` skládaný v kódu
  (ř. 14861+, 15026+) — pozor, jsou to řetězce, ne kód souboru; při hledání se snadno pletou.

## Ověření změny
Pro **každý dotčený typ diagramu**: postav model v editoru → zkontroluj vygenerovaný PUML →
náhled z plantuml.com (a chování při nedostupné síti) → **textový popis v češtině i angličtině** →
export → případný import zpět. Dále: sdílené prvky (vytvoření, přejmenování, zrušení sdílení),
skrývání prvků včetně vazeb s jedním skrytým koncem, příznak hotovo, stavy diagramu,
přepnutí jazyka a klávesová navigace ve stromu.
