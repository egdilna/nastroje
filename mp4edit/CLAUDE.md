# CLAUDE.md — VideoEdit (mp4edit)

## Co to je
Jednostopý webový **video** editor (`index.html`, ~2242 řádků, ~200 kB), verze v titulku
(`VideoEdit v1.2.0`). Projekt je posloupnost **regionů** (výřezů z MP4 souborů); nástroj umí
přehrávání celé stopy, střih na keyframech, posouvání střihové hranice, undo/redo a
export do MP4 **bez překódování**. Sesterský a záměrně velmi podobný nástroj je `../aed`
(AudioEdit) — sdílejí model regionů, transport, i18n i přístupnostní vzorce.

## Pozor: soubor obsahuje minifikované knihovny
Struktura `<script>` bloků:
| Řádek | Obsah |
|---|---|
| 495 | `jszip` z cdnjs (projektový ZIP) |
| 498–705 | **`createFFmpegCore` — ffmpeg-core-st 0.11.1, minifikovaný, vložený inline** |
| 706–715 | **`FFmpeg` (ffmpeg.wasm wrapper), minifikovaný, vložený inline** |
| 716–2242 | vlastní kód aplikace |

Kvůli tomu grep hlásí soubor jako binární a diff je nečitelný.
**Do bloků 498–715 nezasahuj** — nejsou to zdrojové kódy, jen vendorované buildy.
Veškeré změny piš do posledního `<script>`. Než začneš, ověř si, že editace míří za řádek 716.

## Jak se získává ffmpeg engine (`initFFmpeg`, ř. 1726+)
Vložené jsou jen JS části; **wasm binárka se stahuje za běhu**:
1. kontrola, že `window.FFmpeg` i `window.createFFmpegCore` existují;
2. `fetch('https://registry.npmjs.org/@ffmpeg/core-st/-/core-st-0.11.1.tgz')` (~9 MB, CORS `*`);
3. rozbalení gzipu přes `DecompressionStream('gzip')`;
4. **ruční čtení tar hlaviček** (512B bloky, velikost v oktalu) a extrakce
   `ffmpeg-core.wasm` a `ffmpeg-core.worker.js` do `ffmpegWasmBuf` / `ffmpegWorkerBuf`.

Je to single-threaded core **záměrně** — nevyžaduje `SharedArrayBuffer`, takže nástroj funguje
i bez COOP/COEP hlaviček na GitHub Pages. Nepřepínej na multithread build.
Každý krok má vlastní chybovou hlášku do `ffmpegInitError` a `setStatus()`; init selhává tiše
(nástroj jde dál používat k přehrávání a střihu, jen export neproběhne) — tuhle vlastnost zachovej.

## Datový model
```js
region = { id, name, fileName, fileData (ArrayBuffer), duration,
           keyframes: [sekundy], startTrim, endTrim, notes }
// trimmedDuration = duration - startTrim - endTrim
```
Střih je **nedestruktivní**: mění se jen `startTrim`/`endTrim`, zdrojová data zůstávají.
Export pak skládá segmenty za sebou **bez překódování**, proto musí řezy padat na keyframe.

## Keyframy
`parseKeyframes(arrayBuffer, fileName)` používá **mp4box** (vloženo v souboru) a vrací
seřazené časy keyframů; když mp4box chybí nebo se nedobere výsledku, vrátí prázdné pole
(fallback + 2s flush timeout). `nearestKeyframe` / `prevKeyframe` / `nextKeyframe` pak
řídí střih a tlačítka `◀ KF` / `KF ▶`. Bez keyframů se hlásí `status.noKeyframes` —
neznamená to chybu, jen omezení přesnosti.

## Střihová hranice mezi regiony
Specialita oproti AudioEdit: mezi dvěma regiony se vykresluje **cut boundary**
(`buildCutBoundary`) a `moveCut(regionAId, direction)` posouvá střih po keyframech —
technicky mění `endTrim` regionu A a `startTrim` regionu B. Když sáhneš na trim logiku,
projdi zároveň `splitRegion()` a `mergeWithPrevious()`.

`mergeWithPrevious()` u regionů **z různých souborů** neslučuje data (to by znamenalo
překódování) — jen odstraní ořezy na hranici a spoléhá na to, že export poskládá regiony
za sebou. Uživateli se to vysvětlí hláškou `regions.mergeDifferentFiles`. Nesnaž se to
"opravit" skutečným slučováním, byl by to jiný nástroj.

## Undo / Redo
`snapshotRegions()` dělá deep clone `project.regions`, ale **`fileData` (ArrayBuffer) se
neklonuje, jen referencuje** — je imutabilní. Kdyby se někdy začal měnit na místě, undo se
rozbije. `pushUndo(actionLabel)` ukládá popis akce (`edit.*` klíče) do `#undo-label`,
`clearUndoOnSave()` čistí zásobník po uložení.

## Projekt (.ved)
ZIP s JSON metadaty + binárními soubory. Soubory se **deduplikují podle identity ArrayBufferu**
(stejný zdroj se ukládá jen jednou, metadata odkazují na název v ZIPu); při načítání se
používá cache načtených bufferů. Když měníš formát, udrž zpětnou čitelnost starých projektů.

## Lokalizace
Stejný mechanismus jako v `../aed`: `STRINGS`, `loadLang()` s **vloženými** objekty `cs`/`en`,
`t('sekce.klic', {vars})`, `applyTranslations()` nad `data-i18n`.
Zde ve složce **nejsou** oddělené `.json` soubory — jediné místo pravdy je `loadLang()`.
Nové UI popisky vždy přes `data-i18n`.

## Přístupnost
`#sr-announce` live region (`announce()`), `#export-status-announce` pro průběh exportu,
`setStatus()`, skip-link, modaly s fokus managementem, `scrollToRegion()` přesouvá fokus.
Klávesové zkratky viz `help.keys` (P, Shift+P, S, J/K, X/V, I/O, C, `?`, Esc) — nefungují
při psaní do textového pole. Akce nad regionem jdou přes `data-action`
(`play`, `play-from`, `move-up`, `move-down`, `merge`, `insert-after`, `remove`).

## Ověření změny
Načíst 2 MP4 → přehrát → střih `S` na keyframu → posun střihové hranice `◀ KF`/`KF ▶` →
undo/redo → přesun a odstranění regionu → uložit `.ved` a znovu otevřít →
export (sleduj stahování enginu i progres) → chování bez sítě (export musí slušně selhat) →
průchod klávesnicí → přepnutí CS/EN.
