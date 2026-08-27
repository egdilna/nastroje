# CLAUDE.md — Mronenote

## Co to je
Jednosouborový **poznámkový blok s osnovou** ve stylu OneNote (`index.html`, ~4778 řádků,
~237 kB, 299 top-level funkcí). Hierarchie **poznámkový blok → skupiny oddílů → oddíly →
stránky → podstránky → řádky osnovy**. Řádky jsou bohatý text (contenteditable) s příznaky,
styly, zaškrtávátky, vnitřními odkazy, Markdown bloky a CriticMarkupem.
Export: JSON, HTML, Markdown, DOCX (vlastní generátor), tisk. Synchronizace s GitHubem.

**Žádné externí zdroje, žádné knihovny** — DOCX i ZIP se generují ručně (`zipStore`, `crc32`,
`buildDocx`). Nepřidávej CDN.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~37 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Datový model (komentář na ř. 485)
```js
nb   = { name, sections:[ {id,name,pages:[page]} ], settings:{}, flags:[…] }
page = { id, title, items:[item], created, modified, history:[] }
item = { id, html, style, list, collapsed, done, flags:[], children:[], att:null }
```
Pozor: `nb.sections` je dnes **strom** — obsahuje oddíly i **skupiny oddílů** (`isGroup(n)`,
`kids(n)`). Procházej ho vždy přes `walkNodes` / `getNode` / `nodePath`, nikdy přímo indexy.
Barva oddílu se **dědí ze skupiny** (`effColor(id)`).

Příznaky (`flags`) se ukládají **do bloku**, takže putují se souborem. Klíč `k` je neměnný
identifikátor uložený u řádků — měnit lze název, symbol a barvu, **nikdy klíč**.
`flagsEnsure()` doplňuje chybějící výchozí příznaky po načtení starších souborů.

## Bezpečnost obsahu — `sanitize(html)`
Řádky jsou contenteditable, takže do nich může přijít cokoli. Povolený seznam je konstanta
`ALLOWED` (`B,I,U,S,EM,STRONG,CODE,SPAN,A,BR,SUP,SUB,MARK,IMG,…`); nepovolený prvek se
**rozbalí** (obsah zůstane, obal zmizí), zaškrtávací políčko se povoluje jen z Markdownu a
vždy neaktivní. **Každá nová cesta, kterou se do řádku dostane HTML** (vložení ze schránky,
import, Markdown render, odkaz), musí projít `sanitize()`. URL prožeň `mdSafeUrl`/`mdParserSafeUrl`.

## Undo/redo a autosave
`snapshot(label)` před každou destruktivní operací, `doUndo`/`doRedo`.
`scheduleAutosave()` → `persist()` / `restore()` / `normalize()`; `normalize()` opravuje
strukturu po načtení cizího nebo staršího souboru — při změně modelu ho doplň.

## GitHub synchronizace
Konfigurace v `localStorage["mronenote.github.v1"]` (`GHKEY`), token nikam neposílej ani nelogguj.
Push je **odložený**: `ghPushSoon(delay)` s `GH_IDLE = 3000` ms a stropem `GH_MAX = 30000` ms,
`ghPending()` hlídá rozpracovaný stav, `ghUpdateBadge()`/`ghStateText()` ukazují stav v liště.
Když přidáš operaci měnící data, zavolej `touch()` — na něj navazuje autosave i push.

## Režimy a ochrana úprav
`setMode(m)` přepíná **úpravy / čtení** (`isView()`), `guardEdit()` blokuje editační akce ve
čtení a pole v `EDIT_ONLY` se skrývají. Nová editační akce patří do `EDIT_ONLY` a musí volat
`guardEdit()`.

## Vnitřní odkazy (refs) a wiki odkazy
`refUrl(kind,id)` / `parseRef(u)` / `gotoRef(u)` / `refHtml(...)` — odkazovat lze na blok, oddíl,
stránku i konkrétní řádek; `flashItem(id)` cíl zvýrazní. Wiki odkazy `[[Název stránky]]`
řeší `wikiHtml`, `autoWiki()` a při přejmenování stránky se přepisují přes `retargetWiki(old,new)`
— na to nezapomeň u jakékoli změny názvů stránek.

## Markdown a CriticMarkup
Řádek lze přepnout na **Markdown blok** (`mdEnabled`, `makeMarkdownNode`, `mdToHtml`, `mdList`),
navíc funguje Markdown **při psaní** (`mdOnInput`, `mdBlockShortcut`, `mdInlineAtCaret`).
CriticMarkup (`CRITIC_RE`) pokrývá `{++ ++}`, `{-- --}`, `{~~ ~> ~~}`, `{>> <<}`, `{== ==}`
a promítá se i do DOCX exportu jako sledované změny (`runXml`, `delRunXml`, `revAttrs`).

## Přístupnost — nosný rys nástroje
Toto je nejnáročnější část kódu; neruš ji zjednodušením.
- Klasické **menubar** (`m-*`, `mb-*`, `MENUS`, `openMenu`, `panelKey`) s obsluhou šipek,
  Home/End, Escape a `F10`.
- **Regiony a přepínání fokusu**: `focusTree`, `focusContent`, `currentRegion`, `cycleRegion`
  (`F6`), `navKey`.
- Levý strom (`navItems`, `navMove`, `navRight/navLeft`, roving tabindex přes `navSetTabstop`)
  a osnova ve čtení (`outlineView*`) mají vlastní klávesovou navigaci.
- **Kontextové menu řádku** (`openRowContextMenu`, klávesa `ContextMenu`) je plně ovladatelné
  klávesnicí včetně podnabídek (`ctxOpenSub`, `ctxItemKey`).
- `say(m)` je hlášení pro odečítač; používej ho po každé akci, která nemá vizuální fokus.
- Přehled zkratek je v `SHORTCUTS` a v dialogu nápovědy (`dlgHelp`, `shortcutTableHtml`) —
  **novou zkratku doplň i tam**, jinak zmizí uživateli z dohledu.

## Konvence
- Styl kódu je ES5-ish (`var`, `function`), krátké názvy funkcí, česky pojmenované UI.
  Drž se toho, i když je to úsporné až telegrafické.
- Pomocníci: `$`(id), `esc(s)`, `uid()`, `say(m)`, `dbg(msg)` (ladicí výpis, drží 200 řádek).
- Texty česky natvrdo (nemá i18n vrstvu). Motivy: světlý / tmavý / vysoký kontrast
  (`data-theme`).
- Nikdy nezobrazuj skryté file inputy (`fileIn`, `fileImg`, `fileAtt`) — spouštějí se z nabídky.

## Ověření změny
Vytvoř blok, skupinu, oddíl, stránku a podstránku → osnova: psaní, zanoření, přesun, sbalení,
zaškrtávátka, příznaky → Markdown blok i Markdown při psaní → CriticMarkup → vnitřní odkaz a
wiki odkaz (a přejmenování stránky) → hledání a historie → undo/redo → uložení `.json`,
export HTML, MD, DOCX (otevři ve Wordu) → GitHub pull/push → celý průchod **jen klávesnicí**
včetně menubaru, stromu a kontextového menu → režim čtení.
