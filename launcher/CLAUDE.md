# CLAUDE.md — Rámeček (launcher)

## Co to je
Jednosouborová "tab-lišta" (`index.html`, ~630 řádků), která otevírá jiné webové nástroje
v `<iframe>` a přepíná mezi nimi jako mezi záložkami. Slouží jako rozcestník/plocha nad
ostatními nástroji EGdílny. Nemá backend, nic nikam neodesílá.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~14 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 11–195 | `<style>` — celý vzhled, žádný externí CSS |
| ř. 197–239 | statické HTML: `#tablist`, `#scena`, `#prazdno`, `#nabidka`, `<dialog id="dlgEditor">` |
| ř. 241–250 | **konfigurační blok mezi značkami `/* ZALOZKY-ZACATEK */` a `/* ZALOZKY-KONEC */`** |
| ř. 252–627 | IIFE s celou logikou (`"use strict"`, styl ES5 — `var`, `function`) |

## Konfigurace záložek
```js
/* ZALOZKY-ZACATEK */
var NAZEV = "Rychlé nástroje";
var ZABUDOVANE = [ { nazev: "PIM", url: "https://nastroje.egdilna.cz/pim/?id=…" }, … ];
/* ZALOZKY-KONEC */
```
Značky `ZALOZKY-ZACATEK` / `ZALOZKY-KONEC` **nesmíš přejmenovat, přesunout ani duplikovat**.
Vestavěný editor (`btnUlozit`) si přes `fetch(location.href)` stáhne vlastní zdroják, najde
tyto dvě značky, nahradí blok mezi nimi a nabídne ke stažení nový `index.html`. Jakákoli
změna formátu (odstranění mezer v komentáři, změna na `const`, přesun za jiný `<script>`)
tuhle funkci tiše rozbije.

## Klíčové funkce
- `postavVse()` – přestaví nabídku i taby ze `zalozky`; volá se po každé změně konfigurace.
- `postavTaby()` / `prepni(i)` / `otevri(i)` / `zavriAktivni()` – správa otevřených iframe.
  `otevrene` je pole indexů v pořadí tabů, `aktivni` je index nebo `null`.
- `nastavHlidac(i, z)` / `zrusHlidac(i)` – hlídač načtení iframe s timeoutem `CEKANI_MS` (12 s);
  detekuje weby, které se v iframe odmítají zobrazit (X-Frame-Options).
- `jakDavno(kdy)` + `ukazCas()` – "Načteno před …", tik po `TIK_MS` (60 s) a na `visibilitychange`.
  Pozor na české skloňování (minutou/minutami, hodinou/hodinami, dnem/dny) — je ručně napsané.
- `zTextu(text)` / `doTextu(pole)` – převod textareu editoru na pole záložek a zpět
  (formát řádku: `Název | URL`).
- `stahni(obsah)` – Blob download upraveného `index.html`.

## Konvence, které dodrž
- **Čeština v identifikátorech.** Funkce i proměnné jsou česky (`prepni`, `zalozky`, `hlaseni`).
  Nové věci pojmenuj stejně, nemíchej angličtinu.
- **ES5 styl** — `var`, klasické `function`, `addEventListener`. Nezaváděj build krok,
  moduly ani framework; soubor musí jít otevřít přímo v prohlížeči.
- **Žádné externí zdroje.** `EXTERNAL_URLS` je prázdné a má takové zůstat (kromě URL záložek).
- **Přístupnost je záměr.** Taby jsou plnohodnotný ARIA tab pattern: `role="tablist"`,
  `aria-selected`, klávesy `ArrowLeft/ArrowRight/Home/End` v `tablist` keydown handleru,
  `#stav` je live region (`rekni()`), `#hlaseni` chybová hláška (`chyba()`).
  Když přidáváš UI, doplň i klávesovou obsluhu a fokus management.
- Editor záložek je schovaný — zobrazí se jen s `?edit` v URL (`lzeEditovat`).

## Perzistence
Jediný klíč: `localStorage["ramecek.aktivni"]` (`KLIC_AKTIVNI`) = index poslední aktivní záložky.
Zápisy jsou obalené `try/catch` kvůli režimům bez storage — tohle zachovej.

## Pasti
- `Cmd+R`/`Ctrl+R`/`F5` je odchycené tak, aby znovu načetlo jen aktivní iframe, ne celý rámeček
  (viz komentář u ř. 487). Funguje jen při fokusu mimo iframe; Safari si `Cmd+R` bere pro sebe.
- Uložení konfigurace nefunguje při otevření souboru z disku (`file://`) — `fetch` selže a
  zobrazí se náhradní hláška. Nesnaž se to "opravit", je to očekávaný fallback.
- Cross-origin iframe nelze číst; stav načtení se zjišťuje jen přes `load` událost a timeout.

## Ověření změny
Otevři `launcher/index.html` přes lokální HTTP server (ne `file://`), zkontroluj:
přepínání tabů myší i klávesnicí, zavření záložky, `?edit` → Vyzkoušet bez uložení → Uložit soubor.
