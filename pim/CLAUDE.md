# CLAUDE.md — PIM (osobní znalostní báze)

## Co to je
Největší nástroj repozitáře: jednosouborová **osobní znalostní báze / manažer informací**
(`index.html`, **~41 860 řádků, ~2 MB, přes 900 top-level funkcí**). Entity s aspekty, vazby,
Markdown obsah s wiki odkazy a includy, úkoly, projekty a plány, deník, databáze, dokumenty,
přílohy, šifrované atributy, statický prohlížeč, publikace webu a synchronizace s GitHubem.

Autor tímto nástrojem **spravuje a pushuje i tento web** (`website.md`, `sidebar.md`,
`cs.json`, `index.html` v kořeni repozitáře). Změna v PIM se tedy může projevit i na provozu
webu EGdílny.

Uživatelská dokumentace: `docs-cs.md` (31 kB) a `docs-en.md` — aktualizuj je se změnou chování.

## Než začneš: v souboru je i šablona offline prohlížeče
PIM umí ze svých dat vygenerovat **samostatný offline prohlížeč** — jednosouborovou HTML
stránku, kterou lze rozdat nebo publikovat a která data jen zobrazuje (needituje, neukládá,
nesynchronizuje). Předloha tohoto prohlížeče je uložená přímo v souboru jako konstanta
`STATIC_VIEWER_TEMPLATE`:

| Rozsah | Co to je |
|---|---|
| ř. 1643–27670 | živá aplikace — **sem patří změny funkčnosti** |
| ř. 27671–36266 | `STATIC_VIEWER_TEMPLATE` — šablona generovaného prohlížeče (template literál) s místy `__VIEWER_EXTRA__` a `__PIM_DATA_PLACEHOLDER__` |
| ř. 36268+ | `sanitizeDbForStaticViewer()` a zbytek aplikace |
| ř. 36342+ | `VIEWER_EXTRA_JS` — doplňkový kód prohlížeče jako **escapovaný řetězec** |

Prohlížeč **není celá aplikace**: editační cesty, ukládání, GitHub modul i další funkce jsou
v něm vypuštěné (`GITHUB MODUL (stripped in viewer)`, `window.__VIEWER_MODE = true`, `save()`
přepsané na no-op). Je to samostatná, zjednodušená zobrazovací vrstva nad stejnými daty.

Prakticky to ale znamená, že **zobrazovací kód existuje na dvou místech** a leccos se musí
upravit v obou. Týká se to všeho, co prohlížeč umí taky ukázat — render Markdownu, wiki odkazy,
status chipy, database includy, pohledy nad daty (Úkoly, Kalendář, Hledání, Vazby, Tagy,
Vlastní pohledy, Šablony, Detail, Outline), definice v `ASPECTS`, `GLOBAL_FIELDS` a podobné
konstanty. Proto grep na `const ASPECTS`, `VIEW: ÚKOLY` a spol. vrací **dva výskyty** —
vždy si ověř, ve které části jsi, a u sdílené funkčnosti uprav obě. Jinak se vygenerovaný
prohlížeč rozejde s aplikací a data se v něm zobrazí jinak (nebo vůbec).

Naopak čistě editační funkce do šablony nepatří — nepřenášej je tam jen kvůli symetrii.
Živý příklad obojího: přechod nadpisů v řádcích entit z `h5` na `h6` (`.entity-row-heading`)
se musel udělat na **13 místech v aplikaci i 5 místech v šabloně**, zatímco pohled
Připomenutí (viz níže) zůstal jen v aplikaci.

Řádková čísla v tabulce jsou orientační — soubor roste. Hranice si vždy ověř
(`grep -n "const STATIC_VIEWER_TEMPLATE\|const VIEWER_EXTRA_JS\|sanitizeDbForStaticViewer" pim/index.html`).

Uvnitř šablony platí zvláštní zápis: `</script>` se píše jako `<\/script>`, zpětné apostrofy
a `${` se musí escapovat a ve `VIEWER_EXTRA_JS` (běžný řetězec, ne template literál) jsou
zdvojená zpětná lomítka. Chyba v escapování se projeví až ve vygenerovaném souboru, ne při
načtení PIM — proto je generování prohlížeče povinný test.

`sanitizeDbForStaticViewer(filterTags, opts)` připravuje data pro prohlížeč: dělá hlubokou
kopii, odstraňuje GitHub metadata a citlivé věci a umí filtrovat podle tagů. **Při přidání
nového pole do dat rozhodni, zda do prohlížeče patří** — všechno, co tudy projde, se dostane
ven k příjemci vygenerovaného souboru.

## Paleta příkazů
Paleta (`F1`, `Ctrl+Shift+P`, tlačítko `#btn-palette`) je v aplikaci **jediné místo, kde se
příkazy sbíhají**. Žije v bloku `==== PALETA PŘÍKAZŮ ====` hned nad `buildMenuModel()`.

Dvě pravidla, která se nesmí porušit:

1. **Seznam příkazů se staví až při otevření** (`paletaSestavPrikazy()`), ne jako konstanta.
   Je kontextový — v detailu nabízí akce nad entitou, v seznamu nad seznamem, a skrývá to,
   co nedává smysl (GitHub bez konfigurace, AI bez klíče). Nová akce v aplikaci patří
   i sem; paleta je to, kde ji uživatel bude hledat.
2. **Vykresluje se nejvýš `PALETA_MAX_VYSLEDKU` položek.** Entit můžou být tisíce
   a `paletaSestavEntity()` je proto normalizuje jednou při otevření, ne při každém stisku.

Hledání je bez diakritiky a velikosti písmen (`paletaNorm`), víc slov je AND. Předpony
`>` (příkazy), `@` (entity), `#` (tagy) zúží rozsah. Při shodném skóre rozhoduje `_poradi`,
tedy pořadí deklarace — labely začínají emoji, takže abecední řazení dává nesmysly.

Prázdná paleta schválně nevypisuje celý katalog, jen `zakladni: true` pohledy, kontextové
akce a posledních `PALETA_NEDAVNYCH` změněných entit.

Paleta je **jen v aplikaci, ne v šabloně prohlížeče** — většina jejích příkazů edituje.

## Archivace: co kam patří
Archivované entity (`e.archived`) se **nezobrazují v běžných sekcích detailu** — ve Vazbách,
v dashboardu projektu (kanban, cíle, lidé a organizace) ani v úkolech a účastnících schůzky.
Sesbírá je `renderDetailArchiveSection(e)` do jedné sbalené sekce „🗄 Archiv" na konci detailu,
nad sekcí Meta. Zdroj dat jsou `buildOutgoingLinkItems(e)` a `buildInverseLinkItems(e)`:
každá vrací položky i s protější entitou, takže se týmiž renderery vykreslí aktivní i archivovaná
část (`renderLinksReadOnly(e, {archived:true})`). Buildery drží **původní index vazby** v `e.links`,
protože na něj míří tlačítko odebrání vazby — při filtrování ho nikdy nepřepočítávej.

Nová sekce detailu, která vypisuje související entity, tedy musí archivované vynechat; pokud mají
zůstat dohledatelné, patří do sekce Archiv, ne do vlastní vedlejší sekce. Celý mechanismus je
zobrazovací, takže je **v aplikaci i v šabloně prohlížeče** (šablona nemá `openInPanelBtnHtml`
ani `invText.databaseFrom` — její kopie je o ně kratší).

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

Úkol zapsaný v Markdownu lze povýšit na samostatnou entitu; nová entita se propojí vazbou
`partOf` a navíc **zdědí projekty rodičovské entity** (`getEntityParentProjects`), stejně jako
entita vzniklá z wiki odkazu. Zděděné vazby se nesmí duplikovat — kontroluj existující
`partOf` před přidáním.

## České jazykové funkce
- `parseNaturalDate(text)` / `natlangParseDateInText` — přirozené datum v češtině
  („zítra“, „v pátek“, „za 3 dny“) s `dayDelta`/`applyDelta` a zachováním času
  (`combineDateWithOriginalTime`).
- `JOURNAL_DAYS` / `JOURNAL_MONTHS` (genitivy) pro deník.
- **Kontrola pravopisu** přes externí služby: `SPELL_CORRECT_API`
  (LINDAT Korektor, MFF UK) a vlastní slovník `SPELL_CUSTOM_DICT_URL` z GitHubu.
  Jsou to volání třetí strany — musí zůstat volitelná, nesmí posílat citlivý obsah bez
  vědomí uživatele a jejich výpadek nesmí shodit editor.

## Umělá inteligence: v GUI bez značky
Modul `AI` (konstanty `AI_KEY_STORAGE`, `AI_MODEL_STORAGE`, `AI_DEFAULT_MODEL`, `AI_ENDPOINT_BASE`)
volá jazykový model přímo z prohlížeče — služba povoluje CORS, takže **není potřeba proxy**
jako u Toggl. V uživatelském rozhraní se o tom mluví vždycky jen jako o **„umělé inteligenci"**;
název poskytovatele nesmí být vidět nikde v GUI, v nápovědě ani v dokumentaci — jen v komentáři
u modulu a v konstantě s modelem. Platí to i pro chybové hlášky: uživateli jde česká věta,
syrová odpověď služby jde do `debug()`.

Vstup vždycky prochází `aiOcistiVstup()` (vyřízne bloky `~~~private`) a `aiEntitaPovolena()`
(zabezpečené entity se neodesílají ani odemčené). Okno před odesláním ukazuje přesný text.
Klíč žije v `localStorage` mimo `db`, takže se nedostane do exportu ani do synchronizace —
při přidávání nového úložiště klíčů to musí zůstat tak.

Celý modul, dialog `#dialog-ai` i sekce v Nastavení jsou **jen v aplikaci**, ne ve
`STATIC_VIEWER_TEMPLATE` — prohlížeč needituje a klíč do něj nepatří.

Pohled `aiChat` (`renderAiChatView`, stav `_aiChat`) je chat nad vybranými entitami; otevírá
se z lišty hromadného výběru. Podklady se přikládají **jen k první otázce**, další kola jedou
na historii — v `_aiChat.zpravy` proto zpráva nese jak `text` (co vidí uživatel), tak volitelně
`proSluzbu` (co se opravdu odeslalo). Konverzace **se neukládá do `db`**; kdo si ji chce nechat,
uloží ji tlačítkem jako entitu. Zabezpečené entity se do podkladů nepustí už při otevření, aby
na ně neodkazovala ani uložená konverzace.

Okno umí i **návrh hodnot atributů**: `aiPolePro(entity)` posbírá pole z aspektů,
`GLOBAL_FIELDS` i `entity.customFields` a přes `AI_POUZITELNE_TYPY` odfiltruje, co nedává
smysl (composed, hidden, relace, interní prefixy). `AI.navrhniAtributy()` posílá
`generationConfig` s `responseMimeType: application/json` a `responseSchema`, takže odpověď
nejde dolovat z volného textu; u `select` se do schématu dá `enum` s povolenými hodnotami.
Zpátky na hodnotu pole se text převádí přes `aiPreved()`. **Do entity se nezapisuje nic,
dokud uživatel nepotvrdí**, a nic se nepředzaškrtává — u aspektu s deseti poli by se model
jinak ptal na všechna prázdná.

Odpověď chatu se čte streamovaně (`AI.askChat` → `_ctiStream`, koncový bod `:streamGenerateContent?alt=sse`).
Během psaní se do bubliny sype **prostý text**; Markdown se vykreslí až po dopsání, aby se
neblikaly rozepsané značky.

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

## Pohled Připomenutí (`reminders`)
Přehled všech entit s atributem `reminder_at`, seřazený podle data — `renderRemindersView(main)`,
tlačítko `data-view="reminders"` v navigaci, větev `case 'reminders':` v render routeru.
Stav se počítá proti `localDayKey(new Date())` a barví se třídami `.rem-overdue` / `.rem-today` /
`.rem-future` (mají i variantu pro tmavý motiv — nové stavové barvy dělej stejně).
V tabulce je datum **jen vypsané** (`<time datetime>`), ne jako `<input type="date">`.
Inline pole tam bylo a nefungovalo: každá změna hned uložila a překreslila celý pohled,
řádek se kvůli řazení podle data přesunul jinam, fokus spadl na `<body>` a vyprázdnění pole
připomenutí tiše smazalo. Přeplánování má proto vlastní dialog (`otevriDialogData`) a v akcích
je vedle Odstranit i Přeplánovat. Obě akce nastaví `updated_at`, zavolají `save()`, překreslí
**a vrátí fokus** — po překreslení se na nic nespoléhej, řádek už může být jinde.

`otevriDialogData({ titul, popis, hodnota, onOk, onVymazat, onZavreni })` je obecný dialog na
zadání data — používá ho přeplánování v Připomenutích i tlačítko ⏰ Termín v pohledu Úkoly.
Má pole pro **termín slovy**, které vyhodnocuje `parseNaturalDate()` a `combineDateWithOriginalTime()`,
tedy tentýž parser jako přeplánování v Kalendáři. **Druhý parser dat nepiš** — když má něco
rozumět „zítra" nebo „za 3 dny", vede cesta přes `parseNaturalDate`.

Nativní kalendář neotevírej sám přes `showPicker()` — spolkne první Escape a dialog pak nejde
zrušit jedním stiskem.
Pohled je **jen v aplikaci, ne v šabloně prohlížeče** — `reminder_at` je ale v `GLOBAL_FIELDS`
na obou místech.

## Orientace v kódu
Sekční bannery, v tomto pořadí: `KONSTANTY (1652) / STAV (1999) / ŠIFROVÁNÍ (2014) /
PERSISTENCE (2117) / AUTOSAVE NA GITHUB (2143) / UTILITY (2417) / HTML→Markdown (2467) /
Přirozený parser data (2776) / MARKDOWN (3336) / STATUS CHIP (3718) / databasetext (4014) /
database include (4227) / ENTITY API (4476) / STICKY (5624) / POKROČILÉ FILTRY (5859) /
COMPOSED ATTRIBUTES (6106) / PŘÍZNAKOVÁ EMOJI (6252) / SEARCH (6513) / SAVED VIEWS (6566) /
TEMPLATES (6745) / ATTACHMENTS (6780) / ROUTING (6893) / RENDER ROUTER (6992) /
HISTORIE NAVIGACE (7007) / PANELY (7157) / KLÁVESOVÁ NAVIGACE (7378) /
VIEW: NÁSTĚNKA (7915) / PŘIPOMENUTÍ (7441) / ÚKOLY (9227) / HLEDÁNÍ (9718) / VAZBY (9740) /
TAGY (9939) / PŘÍZNAKY (10820) / VLASTNÍ POHLEDY (11476) / ŠABLONY (11562) /
NASTAVENÍ (11622) / DETAIL (12311) / GITHUB MODUL (23832)`.
Čísla jsou orientační a s každou změnou se posouvají — ber je jako vodítko, ne jako adresu.
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

## Přístupnost: název první
Aplikaci ovládá i odečítač obrazovky a hledání po písmenech v seznamech. **Přístupný
název položky seznamu musí začínat tím, co uživatel hledá** — názvem entity, ne značkou
výběru, číslem ani ikonou. Vizuální značky patří do elementu s `aria-hidden="true"`
(viz `.rp-znacka` v dialogu Vybrat entitu).

V `role="listbox"` znamená `aria-selected` **vybráno**, ne „zvýrazněno". Zvýraznění
šipkami se hlásí přes `aria-activedescendant` a kreslí se třídou (`.rp-aktivni`).
Záměna obojího je tichá chyba: odečítač pak hlásí vybráno u všeho, přes co se projede.

## Testy: `pim/testy/`
V repozitáři je sada automatických testů proti skutečnému `index.html` v bezhlavém
Chromiu. **Spouštěj ji u každé změny**, která sahá na obsah entit, editory nebo
zobrazovací kód:

```bash
node pim/testy/spustit.mjs
```

Podrobnosti a jak psát novou sadu jsou v `pim/testy/README.md`. Dvě věci, které
musí zůstat platit:

1. **Pravidlo kanárků.** Když nová funkce sahá na text entity, musí k ní přibýt
   test, který do každé sekce dá unikátní značku a po operaci ověří, že žijí
   všechny, kterých se operace neměla dotknout. Tohle chytá tichá přepsání —
   jediná třída chyb, která uživateli sežere data a nedá o sobě vědět.
2. **Nástroj nad výřezem nesmí zapisovat do celku.** Kdo dostane `targetId`
   a `fieldKey: 'body'`, musí počítat s tím, že `targetId` může být
   `sec-edit-ta`, tedy jen jedna sekce. Zápis `entity.body = text` je v takové
   funkci chyba; text patří zpátky do editoru sekce (`obnovEditorSekce`).
   Celoobrazovkové nástroje (Revize, Korektor, Lint) si proto pamatují
   `navratSekce`.

Konce řádků: aplikace počítá s `\n`. Data zvenčí (GitHub, import JSON i ZIP)
procházejí `normalizujKonceRadkuVDb()` — s `\r\n` se markdown nezpracuje vůbec.

## Ověření změny
Entity s různými aspekty → vazby a graf souvislostí → Markdown s wiki odkazem, statusem
a database includem → úkoly, projekt s plánem, deník → databáze (filtry, řazení, import TSV/CSV) →
pohled Připomenutí (změna data v tabulce, odstranění, stavy po termínu/dnes/budoucí) →
příloha pod i nad 256 kB (ověř IndexedDB) → šifrovaný atribut: zamknout, odemknout, export
(nesmí obsahovat plaintext) → uložení a načtení souboru → **offline prohlížeč** (vygeneruj
a otevři — hlavní test toho, že šablona odpovídá aplikaci a že escapování v ní sedí;
zkontroluj i filtrování podle tagů a že se ven nedostalo nic citlivého) →
GitHub uložení i autosave →
přirozené datum v textu → kontrola pravopisu (a chování při nedostupné službě) →
klávesová navigace v tabulce entit → reload a ověření všech `localStorage` klíčů.
