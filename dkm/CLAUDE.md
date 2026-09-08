# CLAUDE.md — DKM (Dynamický správce znalostí)

## Co to je
Nejrozsáhlejší nástroj repozitáře: jednosouborový **dynamický správce znalostí**
(`index.html`, ~7086 řádků, ~506 kB, 316 top-level funkcí). Datový model si definuje sám
uživatel — typy entit, aspekty, atributy a vazby — nad tím jsou pohledy (seznam, kanban,
timeline, karty), filtry, hromadné operace, balíčkový import/export, generování PlantUML,
DOCX/XLSX export a synchronizace s GitHubem.

**Uživatelská dokumentace je `docs-cs.md` (51 kB) a `docs-en.md`.** Čti ji dřív, než sáhneš
na koncepty (entita, typ, atribut, aspekt, vazba, vlastní atribut, komentáře, objekty),
a při změně chování ji aktualizuj.

## Klíčové koncepty (musíš je znát, než začneš)
- **Entita** — základní záznam; má typ, aspekty, atributy, vazby, komentáře, objekty.
- **Typ entity** definuje sadu atributů; **aspekt** je průřezová sada atributů, kterou lze
  entitě přidat nezávisle na typu (`getAllAttrDefsForEntity` skládá obojí).
- **Vazba** má rozsah (`RSCOPES = ['universal','from','to','specific']`), platnost kontroluje
  `isRelApplicable(rt, fromId, toId)`.
- Typy atributů: `ATYPES = ['text','textarea','date','url','select','yesno','relation','number']`;
  kompatibilitu při konverzích řídí `ATTR_TYPE_COMPAT` (`attrTypesCompatible`).

## Otevření projektu z adresy
Dvě cesty, obě řeší `autoLoadFromUrlParams()` při startu — `?id=` (base64 cesty v GitHub
repozitáři, přes API, `loadFromGitHub`) má přednost před `?open=` (libovolná adresa přes
prostý `fetch`, `loadFromUrl`).

`resolveOpenUrl()` je jediná branka: adresu řeší proti `location.href` (funguje tedy
i relativní zápis) a pouští jen `http(s)` — `javascript:` a `data:` nikdy, `http:` navíc jen
mimo https stránku. Když přidáváš další zdroj, veď ho přes ni.

`fetch` nerozliší síťovou chybu od zablokovaného CORS — obojí je odmítnutý příslib bez
detailu, proto je hláška `urlErrFetch` úmyslně formulovaná pro obě možnosti. Odkaz nikdy
neskládej ručně, na to je `openShareUrl()` (parametr se enkóduje, jinak `&` v cílové adrese
rozbije parsování).

## Perzistence a synchronizace mezi záložkami
| Klíč | Význam |
|---|---|
| `dkm-data-v1` (`SK_DATA`) | data projektu |
| `dkm-session-data` (`SK_SESSION`) | **sessionStorage** — per-záložka, přežije refresh, zavření záložky ne |
| `dkm-lang`, `dkm-autosave`, `dkm-debug` | nastavení |
| `dkm-theme` (`SK_THEME`) | grafický motiv (`light`/`dark`/`paper`/`matrix`) — per prohlížeč |
| `dkm-github-token` | GitHub PAT — **nikdy nelogovat, needovat do dat ani do URL** |
| `dkm-username` (`SK_USERNAME`) | jméno autora komentářů — per prohlížeč, **ne** v datech projektu (`userName()` / `setUserName()`, migrace ze starých dat v `mergeEmpty`) |
| `dkm-handoff-…` (`SK_HANDOFF_PREFIX`) | předání entity do samostatného okna |

Mezi záložkami běží **BroadcastChannel synchronizace** (`initBroadcastSync`,
`broadcastDataChange`, `requestInitSync`, `showSyncBanner`, `ORIGIN_ID`). Každá změna dat
musí projít cestou, která broadcast vyvolá — jinak se ostatní okna rozejdou.
`isStandalone()` / `openEntityStandalone()` / `consumeHandoff()` obsluhují samostatné okno
jedné entity (v něm se skrývá navigační chrome a vynucuje jednosloupcový layout).

## Sledování změn a diff
`snapshotBaseline()` / `hasBaseline()` / `computeDiff()` počítají rozdíl proti výchozímu stavu
a `openDiffDialog()` ho ukazuje po sekcích (přidané / odstraněné / upravené, pole po poli).
Porovnání **řadí klíče a přeskakuje `updatedAt`** — časové razítko není změna. Když přidáváš
pole do entity, doplň ho do `normalizeEntity` a `diffEntityFields`, jinak z diffu vypadne.
`setDirty(v)` + `smartSave()` řídí, co se uloží kam (soubor / GitHub / schránka).

## Grafické motivy
Motivy jsou **jen sady CSS proměnných** na `:root[data-theme="…"]` (`THEMES`, `THEME_LBL`,
`currentTheme`, `setTheme`). Papír a Matrix navíc přenastavují `--ff` (serif / monospace).
Barvu **nikdy nepiš natvrdo** — vždycky přes token, jinak ti nový motiv rozbije kontrast;
popředí na akcentní ploše má vlastní token `--acf` (kvůli `.btn-pri`).

Motiv stanoví krátký skript v `<head>` **dřív, než se cokoliv vykreslí** — bez něj by
probliklo výchozí téma. Ten skript je jediné místo, kde se čte `dkm-theme` mimo `setTheme`.
Bez uložené volby se poprvé řídí `prefers-color-scheme`.

Motiv se týká aplikace; tisk, DOCX/PDF a statický prohlížeč mají vlastní světlé styly —
tak to má zůstat, jsou to výstupy pro někoho jiného.

## Zvuková odezva
`playTones()` syntetizuje tóny přes Web Audio API — **nikdy nepřidávej zvukový soubor**,
nástroj musí zůstat jeden HTML soubor použitelný offline. `soundSaved()` a `soundFailed()`
visí na ukládání na GitHub (všechny čtyři cesty selhání, včetně předčasných návratů).

Prohlížeč zvuk povolí až po interakci uživatele a ukládání je asynchronní, takže v okamžiku
přehrání už gesto „nedrží“ — proto `primeAudio()` na prvním `pointerdown`/`keydown`.
Bez toho by první tón po načtení stránky spolkl autoplay. Hlasitost drž kolem 0.16 a náběh
i doznění veď exponenciálou, skoková hlasitost lupe.

## AI asistent
Poskytovatelé jsou v registru `AI_PROVIDERS` — každý má `listModels()` a `send()`, takže
přidání dalšího je jeden objekt. **Model se nikdy nehardkóduje do nabídky**: seznam se tahá
z API poskytovatele, protože co je aktuální dnes, nemusí platit zítra. Výchozí `defaultModel`
je jen předvyplněná hodnota textového pole.

Klíč (`dkm-ai-key`) se chová jako GitHub token — jen v prohlížeči, nikdy v datech projektu
a **nikdy v `dbg()`**; log smí nést poskytovatele, model a velikost kontextu, ne klíč.

Kontext pro model **není vlastní serializace** — skládá ho `renderBulkExportMd()` ze stejného
`sel`, jaký používá export. Uživatel tedy posílá přesně to, co by si vyexportoval, a může si
to předem prohlédnout. Kontext se staví při **každém** odeslání znovu (jde do
`systemInstruction`), takže změna zaškrtávátek uprostřed rozhovoru platí od další zprávy.

Rozhovory drží `aiChats` v paměti stránky, klíčované id entit — do dat projektu nepatří.

## Externí závislosti — jen líně
Nic se nenačítá dopředu. `loadSheetJS()` stáhne SheetJS z CDN **až při exportu XLSX**;
DOCX a ZIP se generují **ručně** (`buildDocxFile`, `makeZip`, `crc32`). Tuhle vlastnost drž —
nástroj musí být použitelný offline.

## Statický prohlížeč
`VIEWER_TPL_B64` je base64 šablona samostatné HTML stránky, ze které `generateStaticViewer()`
vyrábí offline prohlížeč dat. Když měníš strukturu dat, ověř, že vygenerovaný prohlížeč
pořád funguje — je to snadno přehlédnutelná závislost.

Šablona je **samostatná aplikace s vlastními tokeny, vlastním I18N a vlastními motivy** —
tokeny se jmenují jinak než v hlavní aplikaci (`--fg` místo `--tx`, `--ac-fg` místo `--acf`),
takže se CSS mezi nimi kopírovat nedá. Motivy i jazyk si prohlížeč ukládá pod
`dkm-viewer-theme` / `dkm-viewer-lang`, tedy do prohlížeče příjemce, ne do generovaného souboru.
Editace: dekóduj base64 do souboru, uprav, zakóduj zpět a nahraď řetězec — nikdy needituj base64.

## Export výběru entit (`openBulkExportDialog`)
Staví na exportu jedné entity a nemění ho: `buildExportModel(entity, sel)` čte jen atributy
daného typu a jeho aspektů, takže **jeden `sel` jako sjednocení všech typů a aspektů ve výběru
projde beze změny** — id atributů jsou jedinečná. Dialog proto jen vypisuje sekce podle toho,
co se ve výběru vyskytlo, a u atributů ukazuje, u kolika entit je vyplněný.

Pořadí dává `bulkExportOrdered()` podle `getList()`, ne podle `state.bulk.selected` (to je
pořadí klikání). Entity mimo aktuální seznam se připojují na konec.

Renderery jsou sdílené: `emitEntityDocxParas(model, paras, rels, off)` a `printExportHtmlDoc()`
vznikly vytažením z jednoentitních funkcí, ty je teď volají taky. Při titulku dokumentu se
nadpisy entit posouvají o úroveň (`shiftMdHeadings`, `shiftHtmlHeadings`, parametr `off`
u DOCX), aby dokument měl jedinou H1 — kdo přidá další formát, ať to udělá stejně.

## Export do DOCX — netriviální část
Vlastní generátor OOXML: `renderMarkdownBlocksToDocx`, `runsToParagraphXml`,
`renderMarkdownTableToDocx`, `buildDocxFile`. Zvláštnosti popsané v komentářích:
- CriticMarkup se převádí na **Word revize** — `<w:ins>` a `<w:del>` (mazaný text používá
  `<w:delText>`, ne `<w:t>`), `nextRevId()` je globální čítač revizí.
- Komentář `{>> <<}` se zatím vkládá jako inline „💬 [text]“ v poznámkové barvě — skutečný
  DOCX komentář by vyžadoval `comments.xml`.
- Za tabulkou se **musí** vložit prázdný odstavec, jinak Word slévá následující text s tabulkou.
- Obrázky: EMU 914400/palec, 96 DPI → `px * 9525`, šířka omezená na ~600 px; nestažený obrázek
  degraduje na odkaz.

## Export dat — jedno místo (`openExportHub`)
**Všechno, co jde z dat ven, vede jedním dialogem.** Cíle jsou v registru `EXPORT_TARGETS`
(skupiny `EXPORT_GROUPS`); dialog sbírá **rozsah** (`exportScopeEntities`) a **cíl**. Nový cíl
přidávej **jen sem** — nikdy jako další tlačítko do hlavičky, položku hromadných akcí ani
záznam v paletě. Přesně tak vznikl chaos, který tenhle dialog nahradil: dvanáct ovládacích
prvků na pěti místech, dva z nich duplicitní v paletě, export balíčku v akcích a jeho import
v nastavení.

Cíl má buď `panel(ctx,box)` (volby se kreslí rovnou v dialogu, vrací `{run}`), nebo `run(ctx)`
plus `next:true` (naváže vlastní dialog s předvyplněným rozsahem). `whole:true` znamená, že cíl
bere vždy celý projekt — rozsah se zamkne a napíše se to.

Vstupy: tlačítko `b-exp` v hlavičce, hromadná akce `export`, rychlá paleta. Vždy týž dialog,
liší se jen předvyplněný rozsah.

**Mimo dialog zůstávají tři věci schválně:** `smartSave` (uložení projektu, ne export),
export jedné entity v jejím detailu (`openExportDialog`) a kontext pro AI. Nepřidávej je tam.

Průvodce JSON/XML se z dialogu volá s `fromHub=true` a pak **skrývá svůj krok s rozsahem** —
jinak by se na totéž ptal dvakrát.

## Tabulkový export (`tableExportPanel`)
Panel se kreslí do dialogu Export. XLSX, CSV i TSV berou **tytéž sloupce z `tableColumns()`
a tytéž hodnoty z `tableCellValue()`** —
nikdy nepočítej sloupce zvlášť pro jeden formát. Liší se jen zápis (`toDelimited`, `exportTableXlsx`).

Vlastní atributy se sdružují **podle názvu** (`cattr:<název>`), ne podle id — id je u nich per
entita, takže by padesát entit dalo padesát sloupců.

CSV a TSV nesou **BOM**, jinak Excel rozhodí diakritiku; `processTSVImport` ho proto na začátku
přeskakuje — bez toho by se první sloupec z vlastního exportu nespároval a kolečko
export → úprava → import by se rozbilo. Desetinná čárka platí jen pro CSV; TSV zůstává strojové.

SheetJS se v tomhle sandboxu nestáhne (CDN je blokované), takže XLSX se ověřuje **podvrženým
`window.XLSX`** — `loadSheetJS()` ho vrátí, když už existuje.

## GraphML (`buildGraphml`)
Sdílí dialog i rozsah s PlantUML (`collectPumlEntities`), ale je to jiný svět: PlantUML je zdroj
obrázku, GraphML se otevírá v Gephi/yEd/Cytoscape a počítá se nad ním. Klíče se **musí deklarovat
dopředu** (`<key for="node|edge">`) a id hran nesmí kolidovat s id uzlů — uzly nesou id entit,
proto hrany `hrana1`, `hrana2`…

## Export do datového JSON (`openJsonExportDialog`)
Projekce dat ven: kolekce podle typu, klíče odvozené z názvů (`jsonSlug`, snake_case bez
diakritiky), k tomu **JSON Schema jen pro to, co se v exportu objevilo**, `mapovani.json`
a `README.md` — vše přes `makeZip`. Čtyřkrokový průvodce (`jsonWizStep1`…`Step4`).

Železné pravidlo: **schéma musí validovat data, se kterými je zabalené.** Proto se před
zabalením pouští vlastní `jsonValidate` (podmnožina draftu 2020-12 — přesně to, co
generujeme) a všechno, co by schéma rozbilo, se změkčí a zapíše do `plan.warnings`:
`required` jen u atributu vyplněného u všech entit, `enum` se rozšíří o hodnoty mimo
číselník, `format` se doplní jen když sedí všechny hodnoty. Když měníš generátor,
tuhle smyčku (`runJsonExport`) neobcházej.

**XML není druhá serializace.** `buildXmlData` bere **hotový a zvalidovaný `data` objekt** a
prochází ho **podle téhož schématu**, ze kterého `buildXsd` generuje XSD — pořadí prvků i omezení
proto sedí z principu. Kdo by XML stavěl znovu z entit, tuhle záruku zahodí. Převod: objekt →
prvek s podprvky, pole → opakovaný prvek, skalár → text, `null` → `xsi:nil`. Otevřený objekt
(`additionalProperties:true`, tedy vlastní atributy) jde **vždy** jako `<polozka klic="…">`,
protože ty názvy píše uživatel; XSD to zrcadlí větví `polozkaElem`.

Klíče lze zafixovat nepovinným polem **`jsonKey`** na typu, aspektu, atributu i typu vazby
(`rsJsonKeyFld`) — jinak by přejmenování atributu změnilo klíč a rozbilo navazující import.
Profily exportu žijí v `state.data.jsonExports`.

**Číselníky mají jeden kanonický tvar:** `seznam.values` + `atribut.listId`. Hodnoty čti
**vždy** přes `attrSelectValues(a)` — nikdy si nesahej na `listId`/`values` sám. Starší data
nesla `selectListId` + `options` (kanban, filtry a export balíčku kvůli tomu vycházely
prázdné); `migrateSelectLists` v `mergeEmpty` je při načtení převede a starý tvar z dat
odstraní, `attrSelectValues` ho navíc snese jako záchytnou síť.

## Export datového modelu (`rsModel`, Nastavení → Model)
Ven jde **schéma, ne data** — typy, aspekty, atributy, číselníky a vazby. Osm formátů:
`model.md`, `openapi.yaml`, `schema.json`, `schema.xsd`, `model.sql`, `model.ttl`, `shapes.ttl`,
`model.xmi` (+ `README.md` v ZIPu).

Všechno stojí na jednom mezistupni: **`buildModelIR()`**. Generátory čtou **jen IR**, nikdy
`state.data` — když přidáváš formát, přidej ho do `MODEL_FORMATS` a ber IR. Když do modelu
přibude pojem, přidej ho do IR a promítni do všech generátorů, ne jen do toho svého.

**Klíče se počítají přes `jsonSlug` + `jsonKey`**, tedy stejně jako u exportu dat. Tím
vygenerované OpenAPI a JSON Schema sedí na to, co vyleze z exportu dat — to je smysl celé
věci, neobcházej to vlastním sluggerem.

Modelovací rozhodnutí, která nejsou samozřejmá:
- **Aspekt je průřezový** → v SQL samostatná tabulka navázaná na `entita`, v JSON Schema
  `$defs` skládané přes `allOf` + `unevaluatedProperties:false`, v OWL/UML vlastní třída.
  Nikdy ne sloupce v tabulce typu — aspekt může viset na entitě libovolného typu.
- **Vlastnosti jsou v RDF vlastněné typem** (`ty.key+'_'+a.key`, aspekty `aspekt_…`). Kdyby
  dva typy se stejně pojmenovaným atributem sdílely jednu vlastnost, dva `rdfs:domain` by
  v OWL znamenaly **průnik**, ne sjednocení — sémanticky špatně. SHACL to zrcadlí v `sh:path`.
- **Prázdné `fromTypes`/`toTypes` znamená „cokoliv"**, ne „nic" — v IR se to rozvine na
  `types.slice()`. Platí i pro scope `from`/`to`.
- **SQL neumí scope vazby** → zapíše se komentářem na konec DDL (`modelSqlScopeNote`).
- **`entita` je společný předek ve všech třech světech**: tabulka v SQL, `:entita`
  s `rdfs:subClassOf` v OWL, třída s `uml:Generalization` v XMI. Sloupce drž shodné
  (`id`, `nazev`, `inbox`, `archiv`, `vytvoreno`, `zmeneno`), jinak se výstupy rozejdou.
- **Univerzální vazba se v XMI kreslí jednou** mezi `entita`—`entita`. Rozpis na dvojice typů
  je kartézský součin — osm typů = 64 asociací a nečitelný diagram.
- **Aspekt je v XSD `xs:group`** — tak se v XSD 1.0 skládá do typu, stejně jako ho JSON Schema
  skládá přes `allOf`. Modelový `schema.xsd` popisuje schéma; export dat si veze **vlastní,
  přesné** XSD pro to, co vyexportoval. Nezaměňuj je.

**OWL a SHACL musí popisovat tatáž data.** Hodnota číselníku je v OWL `skos:Concept`, takže
`sh:in` musí nést **IRI konceptů**, ne řetězce (jednou už si odporovaly a žádný dataset
nemohl projít oběma). Typ ber vždy přes `modelXsd(a)` — přepínač `owlDlDates` mění `xsd:date`
na `xsd:dateTime` a **musí** dopadnout na oba výstupy naráz. (`xsd:date` leží mimo datovou
mapu OWL 2 DL, HermiT ontologii s ním nenačte.)

**XMI je samonosné.** UML 2.1 zná jen `String`, `Boolean`, `Integer` a `UnlimitedNatural`,
takže `href` na `#Date` nebo `#Real` se nikde nerozřeší — primitivní typy si soubor definuje
jako vlastní `uml:PrimitiveType`. Konce asociací **vždy** s `lowerValue`/`upperValue`; bez
nich UML rozumí `1..1`, tedy povinnou vazbu. Stereotyp bez profilu jde jen přes
`xmi:Extension` pro EA.

`baseIri` je jediné nastavení modelu, které patří **do dat projektu**
(`state.data.settings.baseIri`) — všem, kdo model exportují, musí vyjít stejná IRI.

Varování (`ir.warnings`) nikdy neblokují export; jsou to místa, kde generátor musel něco
domyslet. Kolize klíčů hlídej **jen aspekt × typ** — kolize typ × typ žádná není, klíče se
v exportu dat počítají per kolekce.

Ověřování se nedělá od oka — každý formát projde nástrojem svého světa: `openapi.yaml`
validátorem OpenAPI 3.1, `schema.json` metaschématem draftu 2020-12 **a validací instancí**
(platná projde, chybějící povinný atribut / hodnota mimo číselník / neznámý klíč padnou),
`model.sql` parserem PostgreSQL, `.ttl` RDF parserem **a reálnou SHACL validací nad daty**,
`schema.xsd` validátorem XML Schema (libxml2) **a validací dokumentu proti němu** (platný projde,
neznámý prvek / chybějící `id` / hodnota mimo číselník / číslo textem / špatné datum / prohozené
pořadí padnou), `model.xmi` strukturní kontrolou XMI (jedinečná id, rozřešené odkazy, konce
asociací s typem i násobností) a GraphML kontrolou klíčů, id a koncových uzlů hran, k tomu
křížová kontrola OWL ↔ SHACL. Well-formed XML ani „vygenerovalo se to
a má to rozumnou délku“ **ověření nejsou** — na to se tu už jednou spolehlo a prošla kvůli
tomu neplatná YAML.

`toYaml` je vlastní — pozor na blokové uzly v poli (pomlčka nahrazuje odsazení prvního řádku), tam se to už
jednou rozbilo. **Import do Enterprise Architectu ověřený není.**

## Duplicity (`rsDupes`, Nastavení → Duplicity)
`findDuplicates` seskupuje podle `dupeKey` — volně (lowercase, bez diakritiky, sražené mezery)
nebo přesně. `dupeRows` staví porovnání: systémové údaje + **sjednocení atributů celé skupiny**
(`getAllAttrDefsForEntity` přes všechny entity), hodnoty přes `xlsxAttrVal`, řádky s rozdílem
dostanou `.dup-diff`.

**Slučuje se `bulkMerge` → `doMerge`, nikdy vlastní cestou** — jsou tam strategie konfliktů,
přesměrování příchozích vazeb i relačních atributů. `doMerge(ents,id,strategy,after)` má
nepovinné `after`: bez něj skočí na detail sloučené entity, s ním zůstaneš, kde jsi byl.

## Balíčky (package) — průvodce importem
`bulkExportPackage` → `buildPackageObj` a osmikrokový průvodce importem
(`renderPkgWizStep1`…`Step8`) s automatickým mapováním modelu (`autoMapModel`), detekcí
konfliktů (`findEntityConflicts`), **simulací** (`simulateImport`) a zálohou před importem
(`downloadBackupBeforeImport`). Import je destruktivní operace — zálohu ani simulaci
nevyřazuj.

**Entity si v balíčku nesou svoje `id`**, takže opakovaný import se pozná. `findEntityConflicts`
kromě kolize počítá i `diff` (podle názvů atributů, ne podle id — mapování je věc průvodce)
a z něj **výchozí akci**. Nikdy nedávej výchozí `newId` — přesně tím vznikaly duplikáty
při druhém importu.

**Výchozí akce se liší podle režimu**, protože easy krok s konflikty vůbec nezobrazuje
(`renderPkgWizStep6` se v něm přeskakuje) — tam tedy vyhrává balíček (`overwrite`), zatímco
v podrobném režimu, kde uživatel rozhoduje, je opatrnější `merge`. Identické entity se
přeskakují v obou — přepis týmiž hodnotami by jen zbytečně hnul `updatedAt` u všeho.

**Párování podle názvu** (`opts.byName`, jen podrobný režim) je pro balíčky z cizího projektu.
Konflikt pak nese `tgtId` **jiné než `srcId`** — `applyImport` proto cíl bere z `conf.tgtId`,
ne z `findEntity(srcE.id)`. Cíl, který si vzala shoda podle id, si nesmí vzít ještě shoda podle
názvu, a **dvojznačné názvy se nepárují vůbec** (radši nic než špatně).

Akce v `applyImport`: `merge` **doplňuje, nepřepisuje** (prázdné atributy, sjednocení aspektů
a vlastních atributů podle názvu, vazby se ve druhém průchodu deduplikují přes
`typVazby:cíl`), `overwrite` nahrazuje, `skip` přeskočí, `newId` založí kopii.

## Filtry, pohledy, hromadné operace
Pravidlový filtr (`evalRule`, `applyAttrFilters`, `opsForType`, `renderRuleRow`) s uloženými
pohledy (`openSaveViewDialog`, `applySavedView`). Zobrazení: seznam / kanban
(`renderKanbanEl`, `moveEntityKanban`) / timeline (`renderTimelineEl`) / karty.
Hromadné akce `bulk*` (změna typu, aspekty, atributy, vazby, archivace, mazání, sloučení
`bulkMerge`/`doMerge`, export balíčku). Sloučení má strategie řešení konfliktů — respektuj je.

## Nabídka wiki odkazů při uložení
`commitEdit()` se dělí na kontrolu a `finishCommitEdit()`; mezi ně se vklíní
`findWikiCandidates()` + `openWikiSuggestDialog()`. Uživatel rozhoduje vždy — nic se nepřepisuje
samo, a „Zpět k editaci" nechá entitu rozeditovanou.

Hledání stojí na dvou pojistkách, které neobcházej: `wikiProtectedRanges()` vyřízne existující
`[[…]]`, kód, markdown odkazy, HTML značky a URL (bez toho by druhé uložení zanořovalo odkazy
do sebe), a delší názvy se zpracovávají první, aby si zabraly rozsah dřív než jejich podřetězce.
Hranice slova se testuje přes `\p{L}` — `\b` by na diakritice selhalo. Nahrazuje se odzadu kvůli indexům.

## Zpětné odkazy a wiki
`countBacklinks` / `collectBacklinks` sbírají tři zdroje: klasické vazby, atributy typu
`relation` a **wiki odkazy `[[Název]]` skenované v textech** (`scanForWikiLink`).
Při změně názvu entity nebo formátu textových hodnot na to pamatuj.

## Lokalizace
`I18N = {cs:{…}, en:{…}}` s **915 klíči**, přístup přes `t(k, v)`, jazyk v `dkm-lang`.
Každý nový text = klíč v obou jazycích. Do UI nikdy nepiš řetězec natvrdo.
Řetězce jsou **prostý text, ne HTML** — vkládej je přes `textContent`. `importTSVDesc` byl
psaný se značkami a nasazovaný přes `innerHTML=esc(...)`, takže se `<br>` a `<b>` uživateli
ukazovaly jako text; strukturu dělej DOM prvky, ne značkami v překladu.

## Konvence
- **Dialog se staví do odpojeného `<div>`.** Dokud ho `showDialog()` nevloží do stránky, `document
  .querySelector`/`getElementById` na jeho prvky **vrací null**. Drž si na ně odkazy — `bulkExportPackage`
  na tomhle dlouho tiše padal a export balíčku vůbec neotevřel dialog. Platí i pro první výpočet náhledu.
- Pomocníci `esc(s)`, `uid(p)`, `toast(m)`, `announce(m)` (odečítač), `dbg(m, err)`.
- Panely (`getPanelSnapshot`, `applyPanelSnapshot`, `addPanel`, `switchToPanel`) a navigace
  přes hash (`parseHash`, `navigateTo`, `pushNav`, `goBackSkipEdits`) — nové pohledy zapoj sem.
- Command palette (`openCommandPalette`, fuzzy hledání) a klávesové zkratky bez modifikátoru
  (F, O, P, S, T, W, K…) — novou zkratku doplň do nápovědy v nastavení (`rsHelp`) i do kap. 28 dokumentace.
- Vedle nich běží **přístupové klávesy** (`accesskey`): L a S v hlavičce, N na tlačítku nové entity,
  A na záložce „Vše", B na tlačítku Zpět, R u přidání vazby, U u uložení editace. Fungují i v polích —
  novou vždy doplň i s titulkem ve tvaru `… (Alt+X, nebo X)` přes `t('keyAlt')` / `t('keyOr')`.
- Název entity vypisuj **vždy** přes `appendEntityLabel(el, entita[, fallback])` — doplní emotikonu typu
  a název. Nikdy nepiš `el.textContent = getTitle(e)`, jinak se ikona v novém pohledu ztratí.
- **Barvu ber jen z existujícího tokenu a ověř, že token existuje.** Nedefinovaný token v `var()`
  tiše propadne na dědění, takže se nic nerozbije — jen to nevypadá, jak má. Takhle se v CSS
  nasbíralo pět neexistujících jmen ve 38 výskytech (`--bg-t`→`--acb`, `--er`→`--dg`, `--fg`→`--tx`,
  `--ac-fg`→`--acf`, `--wn-bg`); lišta hromadného výběru třeba vůbec neměla podbarvení.
  Kontrola je jednořádková: posbírej `var(--x)` a odečti definice na `:root`.
- `--dg` je v tmavém i Matrix motivu **světlá**, takže se nehodí jako plocha pod bílý text;
  tónovaná plocha pro nebezpečí je `--dgb`. Kontrast měř, neodhaduj — a měř proti **skutečně
  vykreslenému** pozadí, ne proti tomu, které si myslíš, že tam je.
- Odebrání vazby v editaci je `.rel-x` — dřív to bylo průhledné `×` v barvě odkazu bez `title`,
  takže ho uživatel nenašel. Ovládací prvek musí vypadat jako ovládací prvek.
- Karta v seznamu (`renderCard`) je `<div>`, ne `<a>`: obsahuje odkazy a tlačítko samostatného okna,
  klik kamkoliv jinam otevře detail. Nové interaktivní prvky uvnitř karty proto nemusí volat
  `stopPropagation` jen kvůli navigaci — handler ignoruje `a, button, input, select, textarea`.
- Seznam se ořezává na `MAX = 100` položek — při změně renderu tuto pojistku zachovej.
- Při startu se odregistrovává Service Worker a čistí cache (pozůstatek starší verze).

## Ověření změny
Vytvoř typ, aspekt, atributy všech typů a vazbu → entity, vazby, komentáře, objekty →
pravidlový filtr a uložený pohled → kanban (přetažení) a timeline → hromadné operace včetně
sloučení → export balíčku a jeho import průvodcem do jiného projektu (ověř simulaci i zálohu) →
export MD, DOCX (otevři ve Wordu, zkontroluj revize a tabulky), XLSX, PlantUML →
statický prohlížeč → GitHub uložení/načtení → dvě záložky současně (BroadcastChannel) →
samostatné okno entity → přepnutí CS/EN.
