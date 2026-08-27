# CLAUDE.md — OPML Editor

## Co to je
Jednosouborový hierarchický editor OPML (`index.html`, ~4650 řádků, ~203 kB) pro outliny,
úkoly a projekty: neomezené zanoření, poznámky u položek, projektové atributy (termín,
% dokončení), Ganttův diagram, GitHub úložiště a sdílení odkazem.
Dokumentace pro uživatele: `opml-editor-cs.md`, `opml-editor-en.md` — **při změně chování
je aktualizuj spolu s kódem**.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7 | jediná externí knihovna: `marked.min.js` z CDN (render Markdownu v poznámkách) |
| ř. 8–1118 | `<style>` (Markdown v poznámkách ř. 246, CriticMarkup ř. 348, DokuWiki tabulky ř. 382, modaly ř. 760, Gantt ř. 823+) |
| ř. 1120–1148 | HTML kostra: `#toolbar`, `#outlineTree`, `#emptyState`, `#searchInput`, GitHub dialog (`#ghToken`, `#ghPathInput`, `#ghSaveBtn`) |
| ř. 1149–1288 | preprocesory: CriticMarkup, DokuWiki tabulky, konfigurace `marked` |
| ř. 1289–1572 | `const translations = { cs, en }` (~125 klíčů) |
| ř. 1573–1707 | `const GitHubStorage = { … }` |
| ř. 1708–4653 | `const app = { … }` — celá aplikace |

Žádné třídy ani top-level funkce; nové chování patří jako metoda na `app`
(nebo na `GitHubStorage`, jde-li o úložiště).

## Datový formát — OPML s vlastními rozšířeními
Položka je `<outline text="…">` s potomky. Nástroj navíc používá:
- **poznámky**: nově jako **child element `_note`**, historicky jako **atribut `_note`**.
  Parser musí umět obojí („new format“ / „old format for compatibility“, ~ř. 1824) a při čtení
  potomků `_note` element **odfiltrovat**, aby se nezobrazil jako položka. Zpětnou kompatibilitu
  neodstraňuj.
- **`_ghPath`** na prvním `<outline>` — cesta k souboru na GitHubu, cestuje s dokumentem.
- projektové atributy pro Gantt (termín, stav, % dokončení).

## GitHub úložiště (`GitHubStorage`)
- Cesta ve tvaru `owner/repo/cesta/soubor.opml`, rozebírá `parsePath()`.
- Token v `localStorage["opml_editor_github_token"]` — **zůstává jen v prohlížeči**, nikdy ho
  nelogguj, neposílej jinam a neukládej do OPML souboru.
- Čtení: malé soubory přijdou jako base64 v JSON odpovědi; soubory nad 1 MB se čtou přes
  **Git Blob API** kvůli CORS. Obě větve zachovej.
- Zápis: dvoufázově `GET` (zjištění `sha`, pokud soubor existuje) → `PUT`.
- Kódování cest a obsahu jde přes `btoa(unescape(encodeURIComponent(x)))` / inverzi — je to
  UTF-8 safe idiom, nenahrazuj ho holým `btoa`.

## Další funkce, na které pozor
- **Gantt** (`#gantt-modal-container`, klíče `gantt*`) — staví se z termínů a % dokončení,
  rozlišuje nezačaté / probíhající / dokončené / po termínu, víkendy a dnešek.
- **Import OPML do položky** — vloží načtený strom jako potomky cílové položky
  (dočasně se drží id cíle pro handler `#fileInput`).
- **Export do Markdownu** — úroveň položky → úroveň nadpisu, poznámky jako odstavce.
- **Zvukový signál** úspěšného uložení přes Web Audio API; chybí-li podpora, tiše se ignoruje.
- **Sdílení odkazem** — URL-safe base64 (`+`→`-`, `/`→`_`) celého dokumentu; po zkopírování
  se resetuje sledování změn.

## Lokalizace
`app.t(key)` + `translations.cs`/`.en`, uloženo v `localStorage["opml-editor-language"]`,
detekce jazyka prohlížeče, fallback čeština. Nový text = nový klíč v **obou** jazycích.

## Konvence, které dodrž
- Přístupnost je deklarovaná vlastnost nástroje (viz dokumentace: „Plně přístupný — navrženo pro
  odečítače obrazovky a klávesnici“). Nové ovládací prvky musí být dosažitelné klávesnicí,
  s popisky a s `Escape` na zavření modalu.
- Vykresluje se do `innerHTML` → veškerý text z dokumentu escapuj.
- Sledování změn (`originalData`) se resetuje po uložení, po uložení na GitHub a po zkopírování URL;
  když přidáš další způsob „uložení“, reset doplň také.
- Bez build kroku; jediná povolená externí závislost je `marked` z CDN.

## Ověření změny
Nový outline → vnořování a přesuny → poznámka s Markdownem, CriticMarkupem a DokuWiki tabulkou →
uložení a znovunačtení souboru (ověř, že se `_note` nezobrazil jako položka) → import OPML do položky →
Gantt → export Markdownu → Kopírovat URL a otevřít ji → GitHub: nastavení tokenu, načtení a uložení →
přepnutí jazyka.
