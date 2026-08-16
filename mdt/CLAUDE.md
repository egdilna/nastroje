# CLAUDE.md — Šablonář MDT

## Co to je
Jednosouborový nástroj (`index.html`, ~3647 řádků, ~118 kB) pro **interaktivní markdownové
šablony**. Autor napíše markdown s placeholdery, uživatel je ve formuláři vyplní a výsledek
uloží jako `.md`, `.docx` nebo zkopíruje. Ukázkový soubor formátu je `vzor.mdt` ve složce —
při změně syntaxe ho aktualizuj, slouží jako živá dokumentace.

Jediná externí závislost: `docx@8.5.0` z unpkg (export do Wordu).

## Formát MDT — syntaxe (to nejdůležitější)
| Zápis | Význam |
|---|---|
| `[[[typ: obsah]]]` | placeholder (`PH_REGEX`) |
| `{{{ … }}}` | pokyn pro vyplňujícího (`INS_REGEX`) — do výsledku se **nedostane** |
| `[[[Opakování: Název]]] … [[[/Opakování]]]` | opakovaná sekce (`REP_OPEN_RE` / `REP_CLOSE_RE`) |

Typy placeholderů (`TYPES`): `text`, `textarea`, `odrážky`, `číslované`, `volba`, `tabulka`,
`spot`, `datum`. Skupiny s odlišným chováním:
- `DEDUP_TYPES = ['Text','Textarea','Odrážky','Číslované','Datum']` — stejný placeholder na více
  místech sdílí jednu hodnotu (zrcadlení).
- `BLOCK_TYPES = ['Textarea','Odrážky','Číslované','Tabulka','Spot']` — vykreslují se jako blok.
- `Spot` uživatel nevyplňuje; renderuje se vždy a v HTML i DOCX má zvláštní styl
  (rozpoznává se podle prefixu `📍 **SPOT:**`).
- `Tabulka` je volitelná — dokud ji uživatel neaktivuje a nemá řádky, nevykreslí se vůbec.

Přípony souborů: **`.mdt`** šablona, **`.mdd`** rozpracované vyplnění (draft, `DRAFT_FORMAT =
'sablonar-draft'`), výstup `.md` / `.docx`.

## Deduplikace hodnot — citlivé místo
Klíč hodnoty vzniká z `normalizeForDedup(content)`: NFC normalizace, lowercase (locale-aware
pro češtinu), sjednocení bílých znaků včetně NBSP, trim. Původní podoba zůstává v `ph.content`
pro zobrazení.
- U typu `Datum` se deduplikuje **jen podle názvu**, aby `[[[Datum: Termín | d.m.Y]]]` a
  `[[[Datum: Termín | F Y]]]` sdílely hodnotu, ale renderovaly se různě.
- `migrateLegacyDedupKeys()` převádí klíče ze starších `.mdd` souborů (před zavedením
  case-insensitive dedupu); při konfliktu vyhrává neprázdná hodnota. **Migraci neodstraňuj.**

## Formátování data
Vlastní **PHP-style formatter pro češtinu** (`formatDate(iso, fmt)`), výchozí `DEFAULT_DATE_FORMAT
= 'j. n. Y'`. Podporované tokeny jsou vypsané v komentáři nad funkcí: `d D j l N S w z W F f m M n
t L o Y y`, escapování zpětným lomítkem.
Token **`f` je nestandardní rozšíření** — český měsíc v genitivu („ledna“); `F` je nominativ
(„leden“). Konstanty `CS_MONTHS_NOM`, `CS_MONTHS_GEN`, `CS_MONTHS_SHORT`, `CS_DAYS_FULL`,
`CS_DAYS_SHORT`. ISO týden se počítá přes `_isoWeek*` helpery. Vstup je `YYYY-MM-DD`
z `<input type="date">`, s kontrolou proti přetečení (2026-02-31 nesmí tiše naskočit na březen).

## Zpracovatelský řetězec
1. `parseTemplateStructure(text)` → `parsePlaceholders`, `parseInstructions`, `parseRepeats`,
   `findInlineTables` (markdown tabulky v textu, které nejsou uvnitř placeholderu ani pokynu).
2. `buildMarkedTemplate(mode, scope, text)` vloží do textu **znakové značky** `(PH|IN|MT|RP)<n>`
   (`MARK_RE`) — to je jádro celého návrhu: nejdřív se markdown parsuje s markery a teprve
   `processMarkers()` je nahradí skutečnými DOM prvky pro daný režim.
3. Vlastní markdown parser (`parseMarkdown` → AST, `renderBlocksHtml`, `renderInlineHtml`)
   umí nadpisy, code fence, citace, odrážky, číslované seznamy, GFM tabulky a odstavce.
   **Markery musí projít parserem neporušené** — když ho upravuješ, ověř, že se nerozbijí
   uvnitř inline formátování.
4. `substituteFilled()` skládá výsledný markdown, `blocksToDocx()`/`inlineToRuns()` výsledný DOCX.

Parser má na dvou místech pojistky proti nekonečné smyčce („Emergency exit“, „force one advance“).
Nech je tam.

## Režimy
`setMode(mode)` / `renderMode()`: **Náhled vzoru** (Alt+N), **Vyplnění** (Alt+V),
**Náhled výsledku** (Alt+D). Dále `Alt+Z` zdrojový editor, `Alt+S` uložit draft,
`Alt+C` kopírovat MD, `Alt+X` uložit DOCX. Nové zkratky drž ve stejné rodině a doplň `title`.

## Pravidla pro pokyny `{{{ … }}}`
Pokyn, který je **na vlastním řádku** (`isOnOwnLine`), se při odstranění spolkne
i s koncovým newline (`expandInstructionRangeForRemoval`), aby ve výsledku nezůstala prázdná
řádka. Inline pokyn se odstraní jen sám. Tohle chování je odladěné — neměň ho bez důvodu.

## Opakované sekce
Párování `[[[Opakování: X]]]` … `[[[/Opakování]]]` je **ploché (FIFO), bez vnořování**;
nepárové značky zůstanou jako text. Instance mají vlastní scope hodnot
(`scopeIdFor`, `makeScopedItems`, `data-ph-scope`), zrcadlení běží uvnitř scope.

## Konvence
- Vanilla JS, pomocníci `$`, `$all`, `el(tag, attrs, children)` — používej je místo vlastních.
- Uživatelský vstup vždy přes `escapeHtml()`; `data-mk` / `data-mki` / `data-ph-mirror` /
  `data-ph-scope` jsou interní atributy renderu.
- Hlášky přes `setStatus(kind, msg)`, ne `alert`. Kopírování má fallback (`copyMdFallback`).
- Vše česky, texty natvrdo (nemá i18n vrstvu).
- Šablonu lze načíst i z URL (`loadFromUrl`) — počítej s CORS chybou a hlas ji přes `showLoadError`.

## Ověření změny
Načti `vzor.mdt` → projdi všechny tři režimy → vyplň každý typ placeholderu včetně tabulky,
volby a data (vyzkoušej víc formátů) → ověř zrcadlení stejného placeholderu → opakovanou sekci
s více instancemi → ulož `.mdd`, znovu načti, dokonči → ulož `.md` i `.docx` a zkontroluj
strukturu → zkopíruj MD do schránky.
