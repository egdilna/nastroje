# CLAUDE.md — WaveCZ (audit přístupnosti přes WAVE API)

## Co to je
Jednosouborový klient k **WAVE API od WebAIM** (`index.html`, ~1537 řádků, ~71 kB).
Uživatel zadá URL stránky, nástroj zavolá WAVE API a vykreslí výsledky **česky** —
včetně vlastního českého katalogu popisů jednotlivých nálezů. Umí export do Markdownu a raw JSON.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7–314 | `<style>`; písma Atkinson Hyperlegible + JetBrains Mono z Google Fonts (jediná externí závislost) |
| ř. 320–451 | HTML: `#audit-form`, `#url-input`, `#viewport-input`, `#key-section` (API klíč), `#proxy-section`, `#results`, `#report-summary` |
| ř. 452–1534 | jeden `<script>` s bannery `// ===== ČESKÝ KATALOG WAVE ITEMS / WAVE API / UI ELEMENTS / HELPERS / API KEY MANAGEMENT / WAVE API CALL / RENDER / EXPORT / FORM SUBMIT / INIT =====` |

## Český katalog nálezů — `WAVE_ITEMS`
Nejdůležitější datová část souboru. Klíče **musí přesně odpovídat `id` z odpovědi WAVE API**
(`categories.X.items.<id>`). Katalog je členěný komentáři na sekce:
`ERRORS` (ř. ~460) → `CONTRAST` (~625) → `ALERTS` (~643) → `FEATURES` (~880) →
`STRUCTURE` (~936) → `ARIA` (~958).

Když WAVE přidá nový typ nálezu, přidej ho **do správné sekce** se stejnou strukturou jako
sousední záznamy. Neznámé `id` se musí zobrazit i bez katalogu (fallback v `getItemMeta()`) —
tuhle větev neodstraňuj.

## API klíč a proxy
- Klíč: `localStorage["wave-api-key-v1"]` (`LS_KEY`), proxy URL: `localStorage["wave-proxy-url-v1"]`
  (`LS_PROXY`). Vše přes `safeStorage()` — v režimech bez storage nesmí nástroj spadnout.
- **Klíč zůstává výhradně v prohlížeči uživatele.** Nikdy ho nelogguj, neposílej jinam,
  nedávej do exportů ani do sdílených odkazů.
- Přímý endpoint `WAVE_ENDPOINT_DIRECT = 'https://wave.webaim.org/api/request'` často spadne na
  **CORS**, proto existuje volitelná proxy. `callWave()` musí rozlišit síťovou/CORS chybu od chyby
  API a poradit uživateli — viz komentář „Sítová / CORS chyba“ (~ř. 1139).
- Není-li klíč nastaven, sekce s klíčem se otevře automaticky (~ř. 1513).

## Render a export
- `renderResults(data, targetUrl)` → `renderSection(catName, label, type, hint, openByDefault)`.
  Ve výchozím stavu se rozbalují **jen errory a kontrast**, ostatní sekce zůstávají sbalené.
- `renderContrastBlock()` + `contrastRatingClass(ratio)` — poměr jasu se hodnotí proti AA/AAA;
  prahy odpovídají WCAG (příklady v komentářích: 3.5:1 propadá AA, 7:1 splňuje i AAA).
- U každého nálezu se odkazuje do dokumentace WAVE: `https://wave.webaim.org/api/docs?id=<id>`.
- `exportMarkdown()` / `exportJson()` přes `triggerDownload()`; název souboru dělá `slugifyUrl()`.

## URL parametry
`?url=…&viewport=…` předvyplní formulář (~ř. 1518) — hodí se pro odkazy z jiných nástrojů.

## Konvence, které dodrž
- **Nástroj o přístupnosti musí být sám přístupný.** Zachovej `#status` jako live region
  (`setStatus`), viditelný fokus, ovládání klávesnicí, `<details>`/rozbalovací sekce se správnými
  stavy a tlačítka „Rozbalit vše / Sbalit vše“.
- Veškerý cizí obsah (názvy selektorů, kontexty z WAVE) prožeň `escapeHtml()` — v souboru je
  pro to helper a používá se důsledně.
- Texty jsou česky natvrdo (nástroj nemá i18n vrstvu). Odborné termíny drž konzistentní
  s katalogem `WAVE_ITEMS`.
- Pomocníci `$(sel)` / `$$(sel)` jsou zkratky nad `querySelector(All)`; používej je místo
  vlastních variant.
- Žádný build krok, žádné JS knihovny.

## Ověření změny
Bez klíče (očekávej instrukci k nastavení) → s klíčem na reálné URL → chování při CORS chybě →
rozbalení/sbalení sekcí → export Markdownu i JSON → otevření s `?url=…&viewport=…` →
průchod stránky pouze klávesnicí.
