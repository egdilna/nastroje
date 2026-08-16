# CLAUDE.md — DMS úložiště (stor)

## Co to je
Jednosouborová **dokumentová správa nad GitHub repozitářem** (`index.html`, ~6198 řádků,
~233 kB, `APP_VERSION = "1.0"`). Strom položek (složka / soubor / odkaz / poznámka) žije
v souboru `storage.json` v repozitáři; verze souborů se commitují jako binární soubory vedle něj.
GitHub je jediné úložiště — aplikace nemá vlastní backend a **data si nedrží v localStorage**.

## Externí závislosti
Žádné natvrdo. JSZip se **načítá až na vyžádání** (`loadJSZip()`, `JSZIP_CDN_URL`) pro export
do ZIP — bez exportu nástroj funguje offline.

## Konfigurace a bezpečnost — přečti dřív, než na to sáhneš
`localStorage["dms-config-v3"]` (`LS_KEY`) obsahuje **jen tři per-device hodnoty**:
```
apiKey      // GitHub PAT — GLOBÁLNÍ pro celé zařízení
deviceName  // jméno zařízení, zapisuje se k verzím
branch      // výchozí větev, default "main"
```
**`repoPath` se zásadně neukládá.** Přichází z URL (parametr `?detail=`), nebo ho uživatel
zadá v Nastavení pro danou session. Neexistuje žádný seznam navštívených úložišť — pro víc
úložišť má uživatel víc URL. `state.config` v paměti je zploštělý a `repoPath` v něm žije
jen po dobu session. **Nezaváděj „historii úložišť“ ani ukládání cesty** — je to vědomé
rozhodnutí o ochraně soukromí.

Migrace: `LS_KEY_V2` a `LS_KEY_V1` se převádějí (z v2 se bere nejnovější `apiKey`), pole
`knownRepos` a `lastRepoPath` ze starších verzí se **ignorují a mažou**. Migrační kód neodstraňuj.

Token je citlivý: nikdy ho nelogguj (ani do `debug()`), nedávej do URL, do `storage.json`
ani do exportů.

## Datový model
Položky mají typy s ikonami v `T_ICON` — složka, soubor, odkaz, poznámka.
Soubor má **části** (`parts`) a **verze**; verze je skutečný soubor v repozitáři pojmenovaný
podle `genVersionFilename()`:
```
bez části:  <storageId>_<fileId>_2026-04-25_16-23.ext
s částí:    <storageId>_<fileId>_<partId>_2026-04-25_16-23.ext
```
Dále: komentáře u souborů, tagy (na úrovni úložiště i položky), popisy verzí.
`fileId` musí být unikátní (`isFileIdUnique`), stejně `partId` v rámci souboru.

Přidání nového typu položky: stačí ho doplnit do `T_ICON` a do konstant typů —
UI se podle komentáře v kódu zařídí samo. Drž se toho.

## Práce s GitHubem
Vrstva `ghHeaders` / `ghFetch` / `ghGetHead` / `ghReadFile` / `ghReadJson` / `ghFileSha` /
`ghCommitChanges(changes, message)`. Commit je **dávkový** — proto existují
`pushStorageJson()`, `pushFileVersionAndJson()` a `pushDeleteAndJson()`: obsah i aktualizovaný
`storage.json` jdou pokud možno jedním commitem, aby nevznikl nekonzistentní stav.
`stripPendingUploadMarkersFromLoadedStorage()` čistí nedokončené uploady po načtení —
neodstraňuj, řeší přerušené operace.

Změny se sledují přes `markModified()` / `markSaved()` + `#unsaved-indicator` a `wireBeforeUnload()`.

## Log operací
`beginOp(label, type)` → `renderOpLog()` → `dismissOp` / `clearDoneOps` / `retryAllFailed`.
Chování je odladěné a stojí za to ho zachovat:
- log si drží posledních 80 položek (debug 200 řádků),
- `details` se **automaticky rozbalí při chybě**, ale jen dokud uživatel sám neurčil stav;
  po vyřešení se zase zavře,
- „Opakovat všechny chybné“ se zobrazí jen když existuje aspoň jedna auto-opakovatelná chyba,
- každý retry handler si operaci znovu zaeviduje přes `beginOp`.

## Motivy (themes)
Motiv je **vlastnost úložiště** (`state.storage.theme`), ne zařízení. Aplikuje se jako
`<html data-theme="…">` proti CSS proměnným v sekci „MOTIVY“ ve `<style>`.
Výchozí `THEME_DEFAULT = "light-auto"` sleduje `prefers-color-scheme`.
Motivů je přes dvacet (light/dark/sepia/high-contrast/solarized/serif-reading/compact/
comfortable/nostalgia-90s/terminal/terminal-amber/github-*/notion-*/macos-*/material-*/swiss).
**Nový motiv = položka v `THEMES` + kompletní sada CSS proměnných**; nikdy nepiš barvy natvrdo
mimo tokeny, jinak motiv rozbiješ.

## Vlastní markdown renderer
`renderMarkdown(src)` a spol. (`parseTableRow`, `renderList`, `parseInline`, `processCritic`) —
včetně **CriticMarkup**. Používá se pro poznámky a náhledy `.md` verzí. Je to vlastní
implementace, ne knihovna: escapuj vstup a při rozšiřování dodrž stávající strukturu.

## URL a navigace
`?detail=<base64url>` kóduje `repoPath` + `itemId` (`encodeDetailParam` / `decodeDetailParam`,
`b64urlEncode`/`b64urlDecode` bez paddingu). `updateUrl()` a `readUrlOnLoad()` drží URL
v souladu se stavem — sdílený odkaz musí otevřít konkrétní položku v konkrétním repozitáři.

## Export
`exportFileAsZip` / `exportFolderAsZip` generují **statický HTML web** (`generateFileIndexHtml`,
`generateFolderIndexHtml`, `generateNoteIndexHtml`) zabalený v ZIPu. Před exportem se odhaduje
velikost (`estimateExportSize`, `checkExportSize`) — kontrolu nech, ZIP se staví v paměti.
Názvy adresářů se sanitizují (`sanitizeFsName`, `uniqueDirName`).

## Přístupnost a UI
`#status-region` + `showStatus(msg, kind, durationMs)`, vlastní dialogy `confirmDialog()`,
`promptDialog(title, fields)` (typy polí včetně `textarea` a `tags`) s fokusem na první vhodný
prvek, výběr cílové složky přes `#picker-dialog` se stromem. Globální klávesy
(`handleGlobalKey`, „Klávesa: X / C / R“), režim úprav přes `#edit-mode-toggle`,
zvuková zpětná vazba `beep()` / `sfx`. Vše česky, texty natvrdo.
Uživatelský obsah vždy přes `escapeHtml()`; prvky stavěj přes `el(tag, attrs, …children)`.

## Ověření změny
Nastav PAT a `repoPath` → vytvoř úložiště → složky, soubor s částmi a verzemi (upload),
odkaz, poznámku → komentáře, tagy, přesun a smazání → obnov stránku a ověř, že se `repoPath`
**nenačetl** z localStorage → sdílecí `?detail=` odkaz → export složky do ZIP a otevření
vygenerovaného HTML → simuluj chybu commitu (neplatný token) a ověř log operací i „Opakovat“ →
přepni několik motivů.
