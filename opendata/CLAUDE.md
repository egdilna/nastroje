# CLAUDE.md — Prohlížeč otevřených dat

## Co to je
Jednosouborový prohlížeč libovolného otevřeného datasetu (`index.html`, ~1467 řádků, ~62 kB).
Uživatel zadá **URL schématu** (JSON Schema) a **URL dat** (JSON nebo CSV); nástroj z toho
postaví tabulku se sloupcovými filtry, hledáním, řazením, stránkováním a detailem záznamu.
Sesterský nástroj `../rpp` je jeho specializovaná varianta pro Registr práv a povinností.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~14 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7–350 | `<style>` s komentovanými sekcemi (Forms, Status, Metadata panel, Table, Pagination, Detail view, Responsive) |
| ř. 352–438 | HTML: `#schema-url`, `#data-url`, `#btn-load`, `#toolbar`, `#column-filters`, `#data-table`, `#detail-view` |
| ř. 439–1464 | jeden `<script>` členěný bannery `// ===== State / DOM / Helpers / URL hash / Fetch / Schema parsing / Data parsing / Metadata / Table head / Column filters / Cell rendering / Filter & Sort / Pagination / Detail view / Main load / Events / Init =====` |

**Do těchto sekcí nový kód zařazuj** — členění je jediná struktura, kterou soubor má
(52 top-level funkcí, žádné třídy).

## Jak nástroj rozumí datům
- **Schéma řídí zobrazení.** `parseSchema()` z JSON Schema odvodí sloupce, typy (`detectType`),
  reference (`resolveRef`), jazykové mapy (`isLangMapSchema`) a pole podzáznamů (`isSubRecordArray`).
  Když schéma chybí, sloupce se odvodí z dat (`columnsFromData`).
- **Vícejazyčné hodnoty**: `{"cs": "…", "en": "…"}` se rozbalují přes `unwrapLang()`;
  seznam povolených kódů je v `LANG_CODES`. Nepřidávej jazyk jen do jedné z těch větví.
- **Kódované hodnoty** typu `typ-údaje/VLASTNI` pozná `classifyCodedValue()` a vykreslí je jako
  badge. Heuristika je záměrně přísná (bez mezer, obsahuje verzálky nebo podtržítko).
- **Podzáznamy** (pole objektů) se v tabulce ukazují jako badge a v detailu jako vnořená tabulka;
  chybí-li ve schématu, sloupce se dopočítají z dat.

## Hledání v NKOD (sekce `// ===== NKOD =====`)
- Dotazy jdou přímo na SPARQL `https://data.gov.cz/sparql` (GET, CORS `*`). Soubor
  `datové-sady.csv` (celý NKOD) má přes 300 MB — nestahovat.
- **Jména poskytovatelů a počty sad jsou dva dotazy** (`nkodNactiPoskytovatele`); spojené v jednom
  (join na `foaf:name` + COUNT) trvají přes 20 s a padají na timeout. Ze stejného důvodu se
  neřadí podle jména poskytovatele. Seznam se drží v `localStorage` (`opendata-nkod-poskytovatele`, den).
- Hledání textu: `CONTAINS(LCASE(?t), …)` pro každé slovo (stejně rychlé jako `bif:contains`, které
  navíc odmítá zástupné znaky kratší než 4 znaky). Shoda se jménem poskytovatele se počítá
  v aplikaci bez diakritiky a do dotazu jde jako `?p IN (…)`, nejvýš 40 poskytovatelů.
- Řazení přes `MIN(STR(?t))` — `ORDER BY` nad `SAMPLE(?t)` Virtuoso neřadí.
- Formát se pozná z `dcat:mediaType` nebo `dct:format` (konec IRI `/csv`, `/json`). Schéma
  z `dct:conformsTo` se předá jen když končí `.json` (JSON Schema/CSVW, ne např. json-stat.org).
- Stav hledání je v `#k=` (`nkodStav`), seznamy (výsledky, série, poskytovatel) jsou odkazy `<a href="#k=…">`.
- Načtená sada z NKOD je v `nkodSada` a jde do `#d=` jako `n`/`t`; ruční změna URL ji zruší.
- Schéma je nepovinné; **CSVW** (`isCsvw`, `parseCsvw`) se zpracuje až po načtení dat, protože
  sloupce se párují s hlavičkou CSV přes `titles`, pak `name`.
- V testovacím sandboxu Chromium přes proxy nedostane `Access-Control-Allow-Origin` od některých
  serverů (např. datanzis.uzis.gov.cz), i když ho server posílá — ověř curlem s hlavičkou `Origin`.

## Formáty dat
`fetchData()` sám rozpozná JSON vs. CSV — podle `Content-Type`, přípony v URL a nakonec podle
obsahu; při nesprávně označeném CSV je fallback z JSON parsování.
Vlastní **CSV parser podle RFC 4180**: autodetekce oddělovače z hlavičky (mimo uvozovky),
uvozované hodnoty, zdvojené `""`, CRLF/LF, odstranění BOM, přeskočení prázdných řádků.
`coerceCsvValue()` převádí typy **konzervativně** — řetězce s vedoucí nulou (IČO, PSČ) a kódy
zůstávají řetězcem. Tuhle opatrnost neruš, je to častý zdroj poškozených českých dat.

## Sdílení odkazem
`#d=<base64url>` obsahuje `{"s": schemaUrl, "d": dataUrl}` (`buildShareHash` / `loadHash`).
Podporuje se i **starší formát** `#schema=…&data=…` a stejné parametry v query stringu —
zpětnou kompatibilitu zachovej. Kódování je UTF-8 safe (`encodeURIComponent` → `unescape` → `btoa`).
`copyToClipboard()` má fallback pro prohlížeče bez Clipboard API.

## Konvence, které dodrž
- Čistý ES bez frameworku a bez jediné externí knihovny — nepřidávej CDN.
- Vykresluje se přímo do DOM (`renderCell`, `renderDetailValue`, …). Hodnoty z cizího datasetu
  jsou nedůvěryhodné: vkládej je přes `textContent`, ne `innerHTML`.
- Stav aplikace žije v modulových proměnných v sekci `State`, DOM reference v sekci `DOM` —
  nesahej na `document.getElementById` roztroušeně po kódu.
- Hlášky uživateli jdou přes `setStatus(msg, type)` / `clearStatus()`, ne přes `alert`.
- Nástroj je česky; UI texty jsou v kódu natvrdo česky (nemá i18n vrstvu jako editory).
- Klávesy: `Enter` v poli URL načte data, `Escape` zavře detail — zachovej.

## Ověření změny
Načti reálný dataset se schématem (JSON i CSV variantu), zkontroluj: metadata panel, řazení,
sloupcové filtry, fulltext, stránkování (vč. „Vše“), detail záznamu s podzáznamy,
sdílecí odkaz (nový i starý formát), chování při nedostupné URL a při CORS chybě.
