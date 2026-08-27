# CLAUDE.md — Markdown Editor (hierarchický)

## Co to je
Jednosouborový **hierarchický** editor Markdownu (`index.html`, ~3870 řádků, ~167 kB).
Dokument nechápe jako plochý text, ale jako strom sekcí podle úrovní nadpisů; nad ním pak
staví filtrování, izolaci (hoist), náhled, export do DOCX a prezentační režim.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~18 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7–8 | dvě externí knihovny z CDN: `marked.min.js`, `html-docx-js` |
| ř. 9–966 | `<style>` (vč. „Presentation Mode Styles“ ř. 173, „Overview mode“ ř. 381, „CriticMarkup styles“ ř. 595, „DokuWiki tables“ ř. 629) |
| ř. 968–999 | HTML kostra: `#toolbar`, `#sectionTree`, `#emptyState`, `#searchInput`, paste dialog |
| ř. 1002–1382 | `const translations = { cs, en }` (~95 klíčů) |
| ř. 1383–3744 | `const app = { … }` — celá aplikace jako jeden objektový literál |
| ř. 3747–3783 | init IIFE: `?md=` a `?v` z URL |
| ř. 3785+ | DokuWiki integrace — `window.saveToWiki()` přes `window.opener` |

Žádné třídy, žádné top-level funkce: nové chování přidávej jako metodu na `app`.

## Datový model
Sekce = uzel stromu: `{ id, level, title, body, collapsed, contentCollapsed, children[] }`.
`app.parseMarkdown(text)` skládá strom podle úrovně nadpisu („Find the correct parent based on
level“); serializace zpět generuje `#`, `##`, … podle `level`. Změna jednoho směru vyžaduje
změnu druhého — parser a serializer musí zůstat vzájemně inverzní.
Sledování změn: `app.originalData` je hluboká kopie po načtení; po uložení/kopírování se resetuje.

## Rozšíření Markdownu, která nástroj umí
Zpracovávají se **před** předáním do `marked`:
1. **CriticMarkup** — `{++vloženo++}`, `{--smazáno--}`, `{~~staré~>nové~~}`, `{==zvýrazněno==}`,
   `{>>komentář<<}` (ř. 1269–1300). Styly jsou v CSS bloku „CriticMarkup styles“.
2. **DokuWiki tabulky** — řádky s `^` (hlavička) a `|` (data) se převedou na `<table>`
   (ř. 1300–1370).
Pořadí zpracování je záměrné („Process CriticMarkup and DokuWiki tables before markdown“);
při zásahu do renderu ho neměň.

## Prezentační režim
`app.startPresentation()` a okolí (ř. 1468+). Prezentovat lze sekci, která má potomky;
z ní se staví pole slidů (titulní slide = sekce sama, potomci = slidy), běží časovač
`#presentation-timer`, existuje overview režim, ovládání klávesnicí a zavření Escapem.
Prezentace se vkládá do `#presentation-container` a před novým spuštěním se odstraňuje ta stará.

## URL a integrace
- `?md=<base64url>` — dokument v odkazu, URL-safe base64 s UTF-8 (`+`→`-`, `/`→`_`, dopočet paddingu,
  dekódování přes `TextDecoder('utf-8')`). Kodér i dekodér měň vždy současně.
- `?v` — režim jen pro čtení (`app.viewOnly`), toolbar se zkrátí na náhled a hledání.
  Nové tlačítko musí být zařazené do správné větve („In view-only mode…“ / „Normal mode…“).
- „Editor links“ — otevření téhož obsahu v `/opml` a `/json`.
- `window.saveToWiki()` — když je editor otevřen z DokuWiki přes `window.opener`, pošle obsah zpět.
  Bez `window.opener` musí tiše skončit, ne spadnout.

## Lokalizace
`app.t(key)`, `translations.cs` / `.en`, uloženo v `localStorage["markdown-editor-language"]`,
detekce jazyka prohlížeče s fallbackem na češtinu. Každý nový řetězec doplň do obou jazyků.

## Konvence, které dodrž
- Vykresluje se do `innerHTML`; obsah dokumentu je nedůvěryhodný vstup → `escapeHtml` všude,
  kde nejde o záměrně renderovaný Markdown.
- `marked` se konfiguruje jednou nahoře, včetně vlastního rendereru odkazů (otevírání do nového okna).
  Renderer musí umět **starou i novou API** `marked` (`href` jako string vs. objekt) — tuhle
  dvojcestnou větev nezjednodušuj, CDN doručuje aktuální verzi.
- Export do DOCX závisí na `html-docx-js`; funkce nejdřív kontroluje, že je knihovna načtená,
  a jinak zobrazí hlášku. Kontrolu zachovej (CDN může být nedostupné).
- Filtry (hledání, tagy, hoist) se sbíhají v „Get sections that are currently visible based on
  filters“ — sekce se zobrazí i tehdy, když vyhovuje některý její potomek. Export, náhled
  i prezentace pracují nad **viditelnými** sekcemi, ne nad celým stromem.

## Ověření změny
Načíst `.md` → rozbalit/sbalit → přesun sekce nahoru/dolů a odsazení doprava/doleva →
hledání a filtr tagů → izolace sekce → náhled (ověř CriticMarkup i DokuWiki tabulku) →
prezentace vč. overview a časovače → export DOCX → Kopírovat URL a otevřít ji → `&v` režim →
přepnutí jazyka.
