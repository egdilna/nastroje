# CLAUDE.md — PIM (osobní znalostní báze)

## Co to je
Největší nástroj repozitáře: jednosouborová **osobní znalostní báze / manažer informací**
(`index.html`, **~41 700 řádků, ~2 MB, 930 top-level funkcí**). Entity s aspekty, vazby,
Markdown obsah s wiki odkazy a includy, úkoly, projekty a plány, deník, databáze, dokumenty,
přílohy, šifrované atributy, statický prohlížeč, publikace webu a synchronizace s GitHubem.

Autor tímto nástrojem **spravuje a pushuje i tento web** (`website.md`, `sidebar.md`,
`cs.json`, `index.html` v kořeni repozitáře). Změna v PIM se tedy může projevit i na provozu
webu EGdílny.

Uživatelská dokumentace: `docs-cs.md` (31 kB) a `docs-en.md` — aktualizuj je se změnou chování.

## Než začneš: soubor obsahuje sám sebe
Kolem **ř. 27535–36130** je konstanta `STATIC_VIEWER_TEMPLATE` — kompletní **druhá kopie
aplikace** ve zjednodušené („viewer“) podobě, uložená jako template literál. Proto grep na
`const ASPECTS`, `VIEW: ÚKOLY`, `GITHUB MODUL` a podobné najde **dva výskyty**:
| Rozsah | Co to je |
|---|---|
| ř. 1643–27534 | živá aplikace — **sem patří tvoje změny** |
| ř. 27535–36130 | `STATIC_VIEWER_TEMPLATE` (+ `__VIEWER_EXTRA__`, `__PIM_DATA_PLACEHOLDER__`) |
| ř. 36206+ | `VIEWER_EXTRA_JS` — další kód prohlížeče jako **escapovaný řetězec** |
| ř. 36130+ | `sanitizeDbForStaticViewer()` a zbytek aplikace |

**Vždy si ověř, do které poloviny míříš.** Uvnitř šablony platí zvláštní pravidla: `</script>`
se píše jako `<\/script>`, zpětné apostrofy a `${` se musí escapovat a v `VIEWER_EXTRA_JS`
jsou zdvojená zpětná lomítka. Když měníš funkci sdílenou s prohlížečem, uprav **obě** kopie —
jinak se vygenerovaný statický prohlížeč rozejde s aplikací.
`sanitizeDbForStaticViewer()` maže z exportu GitHub metadata a citlivá data — při přidání
nového pole zvaž, zda do prohlížeče patří.

## Datový model
`SCHEMA_VERSION = 2`, data v `localStorage["pim_db_v1"]` (`STORAGE_KEY`).
Entita má aspekty; `ASPECTS` (ř. 1653) definuje vestavěné (`Person`, `Organization`, `Place`,
`Event`, `Task`, `Project`, `Note`, `Document`, …) s poli a ikonami (`BUILTIN_ASPECT_ICONS`).
Dále `GLOBAL_FIELDS` (priorita, připomenutí), `RELATION_TYPES`, `CONFIDENCE_LEVELS`,
`BUILTIN_TEMPLATES`, `PLAN_STATUSES`.

**Interní atributy** poznáš podle prefixů `INTERNAL_ATTR_PREFIXES = ['tt_','journal_',
'tracker_','secured_','topic_','obj_']` a podle `INTERNAL_ATTR_KEYS`; `isInternalAttrKey()`
je jediné správné rozhodovací místo — nové interní pole zaveď se stejným prefixem, jinak se
uživateli objeví v editoru atributů.

## Přílohy — dvě cesty podle velikosti
Soubory do `EMBED_THRESHOLD_BYTES` (256 kB) se vkládají do dat; větší jdou do **IndexedDB**
(`pim_files` / `FILE_STORE`, `openFileDb`, `putFileBlob`, `getFileBlob`, `deleteFileBlob`).
Export do souboru má přepínač `includeFiles`. Při mazání entity nezapomeň na blob v IndexedDB.
`localStorage` má limit ~5 MB (`LIMIT`) — kód s tím počítá a hlídá to; nezvyšuj objem
ukládaných dat bez rozmyslu.

## Šifrované atributy (aspekt Secured)
`deriveKey` = **PBKDF2, `SECURED_ITERATIONS = 100000`, SHA-256**, s náhodnou solí;
`encryptPayload`/`decryptPayload`, stav odemčení drží `isSecuredUnlocked` /
`getUnlockedSecured` / `lockSecuredEntity` / `lockAllSecured`.
Pravidla: heslo se nikde neukládá, odemčený obsah nesmí skončit v exportu, ve statickém
prohlížeči, v publikovaném webu ani v logu. Počet iterací a algoritmus neměň bez migrace —
starší data se ukládají i s `secured_iterations`, aby šla dešifrovat.

## Markdown, wiki odkazy a includy
Vlastní renderer (`renderMarkdown`, `renderBlock`, `renderInline`, `renderListBlock`) plus:
- `[[Entita]]` / aliasy — `resolveWikiLink`,
- `{{status:Název}}` — stavový chip (`buildStatusChipHtml`),
- `{{database:Entita?columns=…&filter=…&sort=…}}` a `{{databasetext:…}}` — vkládání databází
  s parametry (`parseDatabaseIncludeParams`, `dbIncludeMatch`, `renderDatabaseIncludeAsMarkdown`),
- obecné `resolveInclude` s hlídáním hloubky.
Vkládání rich-textu ze schránky prochází konverzí **HTML → Markdown** (`htmlToMarkdown`,
`mdRenderNode`, `pasteHtmlAsMarkdown`) — ne přímým vložením HTML.

## České jazykové funkce
- `parseNaturalDate(text)` / `natlangParseDateInText` — přirozené datum v češtině
  („zítra“, „v pátek“, „za 3 dny“) s `dayDelta`/`applyDelta` a zachováním času
  (`combineDateWithOriginalTime`).
- `JOURNAL_DAYS` / `JOURNAL_MONTHS` (genitivy) pro deník.
- **Kontrola pravopisu** přes externí služby: `SPELL_CORRECT_API`
  (LINDAT Korektor, MFF UK) a vlastní slovník `SPELL_CUSTOM_DICT_URL` z GitHubu.
  Jsou to volání třetí strany — musí zůstat volitelná, nesmí posílat citlivý obsah bez
  vědomí uživatele a jejich výpadek nesmí shodit editor.

## Integrace
- **GitHub** (`GH_API`, token v `localStorage["pim_gh_token"]`, modul od ř. 23696) včetně
  **autosave na GitHub** (`scheduleAutosaveGh`, `toggleAutosaveGh`, `updateAutosaveButton`).
- **Toggl Track** — `pim_toggl_token`, `pim_toggl_workspace`, `pim_toggl_proxy`
  (proxy kvůli CORS). Token ani proxy URL nikam neloguj.
- **SheetJS** se načítá **líně** z CDN (`SHEETJS_CDN`) pro XLSX; jinak nástroj běží bez sítě.
- Nahrávání zvuku (`MediaRecorder`, `getUserMedia`) a rozsáhlá zvuková zpětná vazba
  (`playSound(kind)` a spol. — `_fanfare`, `_modem`, `_bell`, …).

## Nastavení a další klíče
`pim_settings_v1` (`SETTINGS_KEY`), `pim_sticky_v1` (rychlá textarea),
`pim_detect_ignored_v1` (ignorované návrhy detekce). Nastavení se ukládá lokálně
(`saveSettingsLocal` / `loadSettingsLocal`), data přes `save()` / `saveDebounced()`.

## Orientace v kódu
Sekční bannery, v tomto pořadí: `KONSTANTY (1645) / STAV (1992) / ŠIFROVÁNÍ (2007) /
PERSISTENCE (2110) / AUTOSAVE NA GITHUB (2136) / UTILITY (2410) / HTML→Markdown (2460) /
Přirozený parser data (2769) / MARKDOWN (3329) / STATUS CHIP (3711) / databasetext (4007) /
database include (4220) / ENTITY API (4469) / STICKY (5617) / POKROČILÉ FILTRY (5852) /
COMPOSED ATTRIBUTES (6099) / PŘÍZNAKOVÁ EMOJI (6245) / SEARCH (6506) / SAVED VIEWS (6559) /
TEMPLATES (6738) / ATTACHMENTS (6773) / ROUTING (6886) / RENDER ROUTER (6985) /
HISTORIE NAVIGACE (7000) / PANELY (7149) / KLÁVESOVÁ NAVIGACE (7370) /
VIEW: NÁSTĚNKA (7826) / ÚKOLY (9138) / HLEDÁNÍ (9629) / VAZBY (9651) / TAGY (9850) /
PŘÍZNAKY (10731) / VLASTNÍ POHLEDY (11387) / ŠABLONY (11473) / NASTAVENÍ (11533) /
DETAIL (12178) / GITHUB MODUL (23696)`.
Nová obrazovka = nový `VIEW:` blok + zapojení do routeru (`ROUTING`, `RENDER ROUTER`) a panelů.

## Limity, které jsou tam schválně
`MAX_DEPTH = 3` a `MAX_PER_LEVEL = 15` u grafu souvislostí, `MAX = 20` u výběrů,
`WORDS_PER_PAGE = 350` / `CHARS_PER_PAGE = 2400` u odhadu rozsahu. Jsou to výkonové
a čitelnostní pojistky — neruš je, případně zpřístupni v nastavení.

## Konvence
- Vše česky, texty natvrdo (nemá i18n vrstvu jako DKM).
- `escapeHtml(s)` všude, kde jde uživatelský text do HTML; renderuje se hodně přes řetězce.
- Hlášky: `statusMsg` / `toast` / `alertMsg`, ladění `debug(msg)`.
- Vanilla JS, `'use strict'`, žádný build krok. Jediná stálá externí závislost je GitHub API
  (+ volitelně Toggl, LINDAT a SheetJS).

## Ověření změny
Entity s různými aspekty → vazby a graf souvislostí → Markdown s wiki odkazem, statusem
a database includem → úkoly, projekt s plánem, deník → databáze (filtry, řazení, import TSV/CSV) →
příloha pod i nad 256 kB (ověř IndexedDB) → šifrovaný atribut: zamknout, odemknout, export
(nesmí obsahovat plaintext) → uložení a načtení souboru → **statický prohlížeč** (vygeneruj
a otevři — hlavní test, že jsou obě kopie kódu v souladu) → GitHub uložení i autosave →
přirozené datum v textu → kontrola pravopisu (a chování při nedostupné službě) →
klávesová navigace v tabulce entit → reload a ověření všech `localStorage` klíčů.
