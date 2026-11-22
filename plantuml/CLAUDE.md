# CLAUDE.md — PlantUML editor

## Co to je
Největší nástroj repozitáře podle počtu řádků: jednosouborový **strukturovaný editor
PlantUML diagramů** (`index.html`, ~16 211 řádků, ~788 kB, 475 top-level funkcí).
Uživatel needituje text — edituje **model** (strom prvků a vazeb), z něhož nástroj generuje
PlantUML zdroj, náhled z plantuml.com a navíc **souvislý textový popis diagramu** v češtině
i angličtině (přístupná alternativa k obrázku).

**Žádné externí knihovny** — vše je v souboru. Jediná síťová závislost je obrázkový server
plantuml.com pro náhled.

**Uživatelská dokumentace: `docs-cs.md` a `docs-en.md` ve stejné složce** (na webu `…/plantuml/docs-cs` a `…/plantuml/docs-en`, z aplikace se otevírají z nápovědy). Popisují chování z pohledu uživatele — čti je jako doplněk k tomuhle souboru a při změně chování aktualizuj **obě** jazykové verze spolu s kódem.

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
Export `.pupe` sbírá odkazy přes `collectSharedRefsUsed` — rekurzivně celý model i verze,
plus konce sdílených vazeb. Nikdy tam nevracej výčet tabulek (dřív chyběly komponenty,
rozhraní, vazby… a importované prvky byly bez názvu). Import volá `pupeLocalizeOrphans`,
který odkaz bez definice převede na lokální prvek s názvem z aliasu.
Alias sdíleného prvku je jeho identifikátor: formuláře ho mění jen přes `applyAliasEdit`
(prázdný a kolizní alias odmítne, přejmenuje z naposledy platného) a `renameSharedAlias`
přepisuje rekurzivně modely i verze všech diagramů a `sourceAlias`/`targetAlias` sdílených vazeb.

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
`parsePuml(source)` rozpoznává typ ve třech krocích: **obal** `@start<typ>` (`detectPumlWrapper`),
**značka** `' puml-editor:type=<typ>`, kterou generátor píše do každého `@startuml` výstupu
(`detectPumlHint`), a teprve pak **markery v obsahu** (`detectPumlByContent`) pro cizí soubory.
Parsery jsou v tabulce `PUML_PARSERS`, jeden na typ — dnes má parser **všech 14 typů**.

Na co si dát pozor:
- Pořadí v `detectPumlByContent` je citlivé. `interface "X" as Y` je i v komponentovém diagramu
  a `database "DB" as D` i v diagramu nasazení — proto se obojí testuje **dřív** než class
  a sequence. Dřív bez toho končil component jako class a deployment jako sequence.
- Značku typu emituje `generatePuml` jen uvnitř `@startuml` (`'` je tam komentář). Wrapper typy
  ji nepotřebují a v EBNF ani mindmapě by `'` komentář být nemusel.
- Když rozšiřuješ generátor, rozšiř i parser, nebo počítej s tím, že daný konstrukt nebude
  zpětně načtený — nesmí ale při importu shodit celý soubor.
- Typ, na který parser není, vrací `{unsupported:true, type, kw}` a import to uživateli řekne;
  nikdy nevyrábět poloprázdný diagram jiného typu.
- Ověřuj round-tripem: model → `generatePuml` → `parsePuml` → `generatePuml` musí dát **shodný**
  zdroj, a to u všech 14 typů.

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

## Náhled vedle a zvýraznění prvku (sekce `=== ŽIVÝ NÁHLED VEDLE ===`)
Přepínač `#btnLivePreview` (Alt+L, `localStorage["plantuml.editor.livePreview"]`) rozdělí kartu
Tvorba: `#editLayout` = `.edit-main` | `#liveSplitter` (role separator, šipky, `--live-left`) |
`#livePane` (sticky, `#liveScroll` s inline SVG). Stav v objektu `live`.
- **Kdy se kreslí:** `renderApp()` volá `liveAfterRenderApp()` (250 ms), `softTouch()` volá
  `liveAfterSoftTouch()` (700 ms). `liveRender` stáhne SVG jen při změně zdroje; starší odpovědi
  zahazuje podle `live.seq`. Kreslí se, jen když je režim zapnutý **nebo je otevřené promítání**.
- **SVG z plantuml.com se vkládá inline** přes `liveParseSvg` — odstraní script, foreignObject,
  on* atributy a javascript: odkazy. Rozměry řídí zoom (`dataset.natW/natH` z viewBoxu).
- **Mapování obrázek ↔ model** (`liveBuildIndex`): `g.entity`/`g.cluster` mají
  `data-qualified-name` (poslední článek = alias) a `data-source-line` (řádek zdroje → název
  v uvozovkách), `g.link` má `data-entity-1/2` → vazba podle konců (`liveRelEnds`: source*Id /
  target*Id, from/to, sdílené sourceAlias/targetAlias). Pseudostav `[*]` = `__start__`/`__end__`.
  Aktivity: start/stop podle koleček shora/zdola (`liveTerminalCircles`). Ostatní typy záložně podle
  textu (`liveTextTargets` + nejmenší obklopující tvar). Cesty prvků: `liveEnumerate` + `liveElemAtPath`
  (vyhodnocuje stejně jako detail; nesedící kandidáty zahazuje) — nový typ diagramu s vlastní
  podobou `selectedPath` tam doplň.
- **Zvýraznění** `liveHighlight` kreslí vrstvu `.live-hl-layer` na konec SVG (entity obdélník,
  vazby obtažené po čáře); posun k prvku jen při změně výběru (`live.lastHlKey`).
- **Promítací okno** dostává totéž: `liveUpdateProjection` nahradí `#diagram` inline SVG,
  `liveHighlightProjection` zvýrazní, klik vybere prvek v editoru; okno je same-origin, DOM se
  ovládá přímo z hlavní stránky. Promítání se tedy překresluje samo.
- Režim nesmí brát fokus ani nic ohlašovat odečítači (žádné aria-live na překreslení).
- Ověřeno v Playwrightu proti živému plantuml.com: class, usecase, state, component, activity,
  sequence, mindmap, gantt — zvýraznění všech prvků i výběr kliknutím; promítání.

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

## GitHub a GitLab jako úložiště (sekce `=== GITHUB / GITLAB: … ===`)
Projekt (`.pup`) i PNG diagramů se ukládají do repozitáře na GitHubu nebo GitLabu
(gitlab.com i onprem). Vzor převzatý z DKM: **o poskytovateli rozhoduje tvar cesty** —
obsahuje-li `/-/`, je to GitLab (`[http(s)://][server/]skupina/…/projekt/-/[blob|raw/větev/]cesta`,
server vynechán = gitlab.com). `parseGhPath` je rozcestník a vrací `kind:'github'|'gitlab'`
(GitLab: `schema, host, project, path, dir, branch`). Názvy `gh…` zůstaly; větví se na nízké
úrovni: `ghFetchFile` / `ghCurrentRev` / `ghPutFile` / `ghEnsureBranch` / `ghImageUrlFor`.
- **Tokeny jen v `localStorage`.** GitHub jeden (`GH_TOKEN_KEY`, jen na `api.github.com`),
  GitLab jeden **na server** (`GL_TOKENS_KEY`, `glToken(host)` / `glSetToken`). Kontrola
  „token je" jde vždy přes `repoToken(parsed)`, ne přes `ghGetToken()`.
- Cesta se drží v `project.ghPath` i v `localStorage` (`GH_PATH_KEY`); `ghCurrentPath()` je
  jediný správný způsob, jak ji zjistit. `newProject` cestu **záměrně maže**.
- Statická adresa `?gh=<base64 cesty>` funguje pro oba poskytovatele; `initGitHubFromUrl()`
  na konci `init()`. Načtení soukromého projektu bez tokenu (401/403/404) otevře nastavení
  s vyplněným serverem a řekne, který token chybí.
- **Čtení:** GitHub Contents API, nad 1 MB Git Blob API; GitLab `repository/files`,
  záložně `…/raw`. **Zápis:** GitHub Contents API, nad `GH_LARGE_B64` Git Data API
  (`ghPutLarge`: blob → strom s `base_tree` → commit → `PATCH refs` s `force:false`);
  GitLab vždy Commits API (`glPutFile`, akce create/update + `last_commit_id`).
- **Ochrana proti přepsání:** `ghLoadedRev = {path, rev}` (GitHub sha blobu, GitLab
  `last_commit_id`) se nastaví po načtení i uložení a `loadProjectJsonText` ji zahodí.
  `saveProjectToGitHub` posílá `{guard:true, expected}`; liší-li se revize v repozitáři
  (nebo soubor existuje a nenačetli jsme ho), `ghPutFile` vyhodí `conflict:true` a uživatel
  přepsání potvrzuje v `dlgConfirm`. **Revizi si nikdy nedotahuj čerstvou jen proto, aby
  zápis prošel.** PNG se zapisuje bez ochrany (přepis je záměr).
- **Base64** po blocích (`ghBytesToBase64`, `ghTextToBase64` přes `TextEncoder`),
  dekódování `ghBase64ToText` přes `TextDecoder`.
- **Vlastní GitLab server:** `glDiagnoseFetch` rozliší smíšený obsah a povolení Chrome
  „Místní síť“ (`permissions.query({name:'local-network-access'})`, Chrome 142+); dialog má
  rámeček `#glLnaBox` (jen pro jiný server než gitlab.com) s živým stavem a tlačítkem
  „Vyzkoušet spojení“ (`glTestConnection`, dotaz na `/api/v4/version`; i 401 = spojení jde).
- PNG jde do **stejné složky** jako projekt, název = `slugFileName(diagram.name)` (bez
  diakritiky — kvůli čitelné adrese). Soubory **stahované na disk** používají `safeBaseName`.
- Raw adresa obrázku: GitHub `raw.githubusercontent.com/owner/repo/větev/…`, GitLab
  `server/projekt/-/raw/větev/…`; cesta **musí** projít `encodeURI`. Větev: GitLab z cesty,
  jinak `default_branch` z API do `ghBranchCache` (u GitHubu se po zápisu upřesní
  z `download_url`); než odpověď dorazí, platí `main`.
- `saveProjectAction()` (tlačítko „Uložit projekt“, Alt+S): s cestou do repozitáře, bez ní `.pup`.
- Hlášky přes `ghStatus()` (dialog + status pruh), slovník `L.gh` v **obou** jazycích; název
  poskytovatele dosazuje `repoName(parsed)` (čeština: „z GitHubu“ / „z GitLabu“ = jméno + „u“).
- Ověřeno simulovaným GitHubem i GitLabem v Playwrightu (založení, update, PNG, načtení,
  velký soubor, cizí zápis → dotaz, `?gh=` bez tokenu). Proti živé onprem instanci ne.

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
