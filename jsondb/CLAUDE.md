# CLAUDE.md — JSONDB (Editor databáze)

## Co to je
Jednosouborový databázový nástroj nad formátem **JSONDB** (`index.html`, ~9720 řádků, ~550 kB).
Spravuje tabulky, pole se schématem, záznamy, kolekce, tagy, poznámky, uložené pohledy,
historii změn, podmíněné formátování, hierarchie (nadřazený / podřízené záznamy),
import CSV/TSV/XLSX a export do Markdownu, DOCX a XLSX. Ukládá do souboru, do schránky
nebo na GitHub.

## Zdroj pravdy pro formát
Ve složce jsou tři soubory, které mají přednost před dojmy z kódu:
- **`jsondb-format.md`** — specifikace formátu `.jsondb` včetně rozšíření editoru,
- **`jsondb-schema.json`** — JSON Schema,
- **`docs-cs.md` / `docs-en.md`** — uživatelská dokumentace.

Základní tvar:
```json
{ "meta": { "name": "…", "columnVisibility": {}, "groupStates": {},
            "collections": [], "tags": [], "views": {}, "notes": [], "recordHistory": {} },
  "tables": [ … ] }
```
Vše kromě `meta.name` a `tables` je nepovinné; `collections`, `tags`, `views`, `notes`
a `recordHistory` jsou **rozšíření JSONDB Editoru** — musí zůstat volitelná, aby soubor
zůstal čitelný i pro jiné nástroje. **Změna formátu = změna kódu + `jsondb-format.md` +
`jsondb-schema.json` + dokumentace.** Neměň nic z toho samostatně.

## Struktura a architektura
Dva CDN skripty (`docx@8.5.0`, `xlsx@0.18.5` z unpkg) a pak jeden velký `<script>`.
Kód nemá třídy ani top-level funkce v obvyklém smyslu — je to soubor funkcí a obsluh
pojmenovaných podle akcí; orientuj se podle **ID prvků** (`btnSaveRecord`, `recordModal`,
`tableTabs`, …) a podle `data-action` hodnot (`view`, `viewFromCollection`, `viewFromTag`,
`viewFromHistory`, `viewFromSearch`, `viewFromSize`, `viewFromStructure`, `removeTag`,
`removeFromCollection`, `switchStructureRoot`, `toggleTreeNotes`, `loadAll`, …).
Renderuje se do `innerHTML` — proto existují `escapeHtml()` a **`escapeAttr()`**, který ošetřuje
i zpětné apostrofy a syntaxi template literálů. **Do atributů vždy `escapeAttr`, nikdy `escapeHtml`.**

## Typy polí a odvozené hodnoty
Text, víceřádkový text/Markdown, číslo, datum, URL, ano/ne, výběr ze seznamu, JSON,
**složený** (`compositeTemplate`), **nadřazený záznam** a **podřízené záznamy**.
Zvláštnosti, na které narazíš:
- U pole „nadřazený záznam“ se zobrazuje **hodnota primárního pole** odkazovaného záznamu;
  u „podřízené záznamy“ se spojují primární hodnoty potomků — filtrování i řazení nad nimi
  pracuje s tímto spojeným textem (u `empty`/`notEmpty` s počtem).
- Řazení má pořadí priorit: `f.sortField` → výchozí řazení tabulky → primární pole.
- `fieldAutoIncrement` + `fieldLastValue` drží automatické číslování.
- Datum se formátuje **PHP-style** vlastní implementací (`dateFormat` u pole).

## Režimy zobrazení
- **Jednoduchý vs. pokročilý režim** (`advancedModeToggle`): v jednoduchém se skrývají
  přidávací/mazací tlačítka, zaškrtávátka hromadného výběru, select filtry, správa
  a tabulky s `showInSimpleMode: false`. Každý nový ovládací prvek musí vědět, do kterého
  režimu patří.
- **Read-only režim** skrývá správu úplně.
Když přidáváš funkci, projdi obě větve — jinak se v jednoduchém režimu objeví něco, co tam nemá být.

## Perzistence
| Klíč | Význam |
|---|---|
| `db-editor-autosave` / `db-editor-autosave-tab` | automatické ukládání (sessionStorage → **každá záložka má vlastní databázi**) |
| `db-editor-lang` | jazyk |
| `jsondb_github_token` | GitHub PAT — nikdy nelogovat, nedávat do dat ani do URL |

Neuložené změny hlídá `unsavedBanner` a potvrzení `confirmUnsavedClose`.
Při startu se odregistrovává Service Worker a čistí cache (starší verze rušily API volání).

## Markdown a CriticMarkup
Vlastní jednoduchý parser (kódové bloky, nadpisy, tučné/kurzíva, citace, oddělovač, seznamy
ul/ol zvlášť, odstavce). **CriticMarkup se zpracovává jako první**, před ostatním formátováním:
`{~~staré~>nové~~}`, `{++vloženo++}`, `{--smazáno--}`, `{==zvýrazněno==}`, `{>>komentář<<}`.
Pořadí neměň — jinak se značky rozpadnou uvnitř jiného formátování.

## Historie a hromadné operace
`recordHistory` eviduje vytvoření, editaci, hromadnou změnu a velikost (`historyCreate`,
`historyEdit`, `historyBulk`, `historySize`); hromadná úprava zapisuje **objekt změněných polí**.
Hromadné mazání musí uklidit i **členství v kolekcích, poznámky a historii** smazaných záznamů —
na to nezapomeň u jakékoli nové vazby na záznam.

## Lokalizace
223 klíčů, `data-i18n` (a `data-i18n-placeholder`) v markupu + `t(key)` v kódu, jazyk
v `db-editor-lang`, přepínač `langSelect` (🇨🇿/🇬🇧). Nový text = klíč v obou jazycích.

## Přístupnost a ovládání
Záložky tabulek a podzáložky správy jsou přístupné taby; klávesová navigace v seznamu záznamů
(šipky, Home/End, Enter) a přímé zkratky bez modifikátoru (N, E, S, T, F, H, K, M, V, A…)
s vlastním přehledem v sekci „Klávesové zkratky“ — **novou zkratku tam doplň**.
Modaly automaticky fokusují první vstup (kromě náhledových), zavírá je `Escape`.
Hlášky jdou přes zavedené prvky, ne přes `alert`.

## Ověření změny
Nová databáze → tabulka, pole všech typů (vč. složeného, nadřazeného a podřízených) →
záznamy, řazení, filtry, sloupce → kolekce, tagy, poznámky → podmíněné formátování →
hierarchie a pohled „Struktura“ → hromadné úpravy a mazání (ověř úklid kolekcí, poznámek,
historie) → globální hledání → import CSV, TSV i XLSX s mapováním sloupců →
export Markdown, DOCX, XLSX, JSON → uložení do souboru, do schránky i na GitHub →
přepnutí jednoduchý/pokročilý režim → validace výsledného souboru proti `jsondb-schema.json`.
