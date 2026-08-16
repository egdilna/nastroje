# CLAUDE.md — AudioEdit (aed)

## Co to je
Jednostopý webový audio editor (`index.html`, ~2288 řádků, ~83 kB). Projekt je posloupnost
**regionů** (jeden zvukový soubor = jeden region); nástroj umí přehrávání celé stopy, střih,
slučování, přeskládání, poznámky u regionů a export do WAV/MP3/OGG/M4A.
Projekt se ukládá jako ZIP (`.aed`).

## Externí závislosti
`jszip` (projektový ZIP) a `lamejs` (MP3 enkodér) z cdnjs. Nic dalšího; CSS je inline
(„Dark studio aesthetic – warm amber accents on deep charcoal“ — drž se té palety).

## Lokalizace — pozor na duplicitu
Ve složce jsou `cs.json` a `en.json`, **ale aplikace je nepoužívá**: obsah je **vložený
přímo do `loadLang()`** (komentář „Embedded strings to avoid CORS issues in single-file
context“, ~ř. 866). Když měníš text, uprav **obě místa** — vložený objekt v `index.html`
i odpovídající `.json` soubor — jinak se rozejdou.

Mechanika: `t('sekce.klic', {vars})` s tečkovou cestou a `{placeholder}` náhradami, fallback
na češtinu; `applyTranslations()` přepisuje prvky s `data-i18n` (textContent) a `data-i18n-title`
(atribut `title`). **Nová UI popiska = `data-i18n` atribut, ne natvrdo napsaný text.**

## Datový model
```js
region = { id, name, fileName, file /* File na disku */, duration, notes }
// po načtení ze ZIP: audioData (ArrayBuffer) místo file
```
`project` drží název a pole regionů; `computeOffsets()` dopočítává začátky/konce v rámci stopy.
Regiony mají **unikátní jména** (`safeName()`), na to navazují hlášky `regions.nameExists`.

## Přehrávací engine — nesahat bez důvodu
Přehrávání jde přes **`<audio>` element a Object URL**, ne přes dekódování do paměti:
soubory se streamují z disku, takže projekt zvládne velké nahrávky. `getFileUrl()` /
`revokeFileUrl()` drží cache Object URL — každý vytvořený URL musí být uvolněn.
`playChain(idx, startPos, stopPos, chainId)` řetězí regiony za sebou; `chainId` slouží
k zneplatnění staré fronty při novém startu.

**Zvláštnosti iOS Safari, které jsou v kódu schválně** (neodstraňuj je):
- `getAudioDuration()` má fallback z `loadedmetadata` na `durationchange` a 15s timeout;
- přehrávání vyžaduje user gesture — při selhání se pokus opakuje;
- `safeDecode()` obaluje `decodeAudioData` tak, aby fungovalo i callbackové API;
- seek u velkých souborů může trvat, kód s tím počítá.

## Střih a export
- `splitRegion()` řeže **vždy podle aktuální pozice přehrávání**, ne podle výběru; hlásí
  `splitNoPosition` / `splitAtEdge`, když to nedává smysl.
- `mergeWithPrevious(id)` slučuje buffery A+B; první region sloučit nelze.
- Export: dekóduje všechny regiony, sestaví výsledný buffer a podle formátu jde přes
  `encodeMP3()` (lamejs, po blocích s progresem), `audioBufferToWav()` (vlastní WAV enkodér)
  nebo `encodeViaOffline()` (MediaRecorder + OfflineAudioContext pro OGG/M4A).
  M4A nemusí být podporováno — hláška `export.m4aNotSupported` je očekávaný stav, ne chyba.
- Ukládání projektu používá kompresi **level 1** — audio už je komprimované, vyšší úroveň
  jen zdržuje.

## Přístupnost — hlavní designový závazek
Nástroj je stavěný pro ovládání klávesnicí a odečítač:
- `#sr-announce` je live region, plní ho `announce()`; stavové hlášky `setStatus()`.
- Klávesové zkratky (viz `help.keys` v překladech): `P` pauza/pokračovat, `Shift+P` přehrát vše,
  `S` střih, `J`/`K` předchozí/další region, `X`/`V` ±5 s, `I`/`O` ±1 min,
  `C` **ohlásit pozici a region**, `?` nápověda, `Esc` zavřít dialog.
  Zkratky nesmí fungovat při psaní do textového pole — kontrolu zachovej.
- `scrollToRegion(id)` přesouvá fokus na nadpis regionu (dočasně focusovatelný `h3`).
- Je tu skip-link a modaly s vlastním fokus managementem (`confirmDialog`, export, nápověda).

**Každá nová funkce potřebuje: `data-i18n` popisek, ohlášení přes `announce()` nebo `setStatus()`,
dosažitelnost klávesnicí a řádek v tabulce zkratek, pokud přidáváš zkratku.**

## Konvence
- Vykreslování regionů je „diff: rebuild all“ — jednoduché a robustní; neoptimalizuj na
  částečné překreslování bez skutečného důvodu.
- Akce nad regionem jdou přes `data-action` (`play`, `play-from`, `move-up`, `move-down`,
  `merge`, `insert-after`, `remove`) a centrální `handleRegionAction(action, id)`.
- Uživatelský text vždy přes `escHtml()`.
- `'use strict'`, vanilla JS, žádný build krok.

## Ověření změny
Načíst 2–3 zvukové soubory → přehrát celý projekt → pauza, střih `S`, sloučení, přesun →
poznámky a přejmenování regionu → uložit projekt a znovu otevřít (regiony musí hrát z `audioData`) →
export do WAV a MP3 (sleduj progres) → celý průchod pouze klávesnicí → přepnutí CS/EN.
Otestuj i v Safari, kvůli zmíněným odchylkám.
