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

Klíče lze zafixovat nepovinným polem **`jsonKey`** na typu, aspektu, atributu i typu vazby
(`rsJsonKeyFld`) — jinak by přejmenování atributu změnilo klíč a rozbilo navazující import.
Profily exportu žijí v `state.data.jsonExports`.

**Číselníky mají jeden kanonický tvar:** `seznam.values` + `atribut.listId`. Hodnoty čti
**vždy** přes `attrSelectValues(a)` — nikdy si nesahej na `listId`/`values` sám. Starší data
nesla `selectListId` + `options` (kanban, filtry a export balíčku kvůli tomu vycházely
prázdné); `migrateSelectLists` v `mergeEmpty` je při načtení převede a starý tvar z dat
odstraní, `attrSelectValues` ho navíc snese jako záchytnou síť.

## Balíčky (package) — průvodce importem
`bulkExportPackage` → `buildPackageObj` a osmikrokový průvodce importem
(`renderPkgWizStep1`…`Step8`) s automatickým mapováním modelu (`autoMapModel`), detekcí
konfliktů (`findEntityConflicts`), **simulací** (`simulateImport`) a zálohou před importem
(`downloadBackupBeforeImport`). Import je destruktivní operace — zálohu ani simulaci
nevyřazuj.

## Filtry, pohledy, hromadné operace
Pravidlový filtr (`evalRule`, `applyAttrFilters`, `opsForType`, `renderRuleRow`) s uloženými
pohledy (`openSaveViewDialog`, `applySavedView`). Zobrazení: seznam / kanban
(`renderKanbanEl`, `moveEntityKanban`) / timeline (`renderTimelineEl`) / karty.
Hromadné akce `bulk*` (změna typu, aspekty, atributy, vazby, archivace, mazání, sloučení
`bulkMerge`/`doMerge`, export balíčku). Sloučení má strategie řešení konfliktů — respektuj je.

## Zpětné odkazy a wiki
`countBacklinks` / `collectBacklinks` sbírají tři zdroje: klasické vazby, atributy typu
`relation` a **wiki odkazy `[[Název]]` skenované v textech** (`scanForWikiLink`).
Při změně názvu entity nebo formátu textových hodnot na to pamatuj.

## Lokalizace
`I18N = {cs:{…}, en:{…}}` s **578 klíči**, přístup přes `t(k, v)`, jazyk v `dkm-lang`.
Každý nový text = klíč v obou jazycích. Do UI nikdy nepiš řetězec natvrdo.
Řetězce jsou **prostý text, ne HTML** — vkládej je přes `textContent`. `importTSVDesc` byl
psaný se značkami a nasazovaný přes `innerHTML=esc(...)`, takže se `<br>` a `<b>` uživateli
ukazovaly jako text; strukturu dělej DOM prvky, ne značkami v překladu.

## Konvence
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
