# CLAUDE.md — Česká FeatherWiki

## Co to je
**Cizí nástroj, ne vlastní kód EGdílny.** Jde o [Feather Wiki](https://feather.wiki)
verze **1.9.1 (Goldfinch)** — jednosouborový wiki systém, který se sám ukládá do vlastního
HTML souboru. EGdílna k němu dodala **český překlad rozhraní** a **skriptovou mutaci**
(náhrada vestavěného Markdown parseru knihovnou marked.js). Web to popisuje jako
„nástroj EGdílny jen tak napůl“.

## Zásadní varování před úpravami
`index.html` (~59 kB) je **minifikovaný upstream build**: 24 řádků, z toho jednotlivé řádky
mají i 19 000 znaků. Není to zdrojový kód.

- **Nikdy soubor neformátuj, nereformátuj ani neprocházej „pro pořádek“ přeformátováním.**
  Prettier/beautifier na něm nadělá nevratnou škodu a smaže rozdíl proti upstreamu.
- Nepokoušej se refaktorovat, přejmenovávat proměnné ani „opravovat“ minifikovaný kód.
- Neaplikuj na něj konvence platné pro ostatní nástroje v repozitáři (české názvy funkcí,
  členění na sekce, i18n vrstva) — ty se sem nevztahují.
- Změny upstreamu se řeší **výměnou buildu za novou verzi z feather.wiki a novým přenesením
  českých úprav**, ne ručním záplatováním.

## Kde jsou úpravy EGdílny
1. **Skriptová mutace — řádky 15–24**, uvnitř `<script id=j>`, ohraničená značkami:
   ```
   /**** Replace Parser with Marked.js ****/
   … FW.ready(() => { … markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js' … })
   /**** End Replace Parser with Marked.js ****/
   ```
   Nahrazuje `window.md` funkcí `marked.parse` a po načtení knihovny vyvolá `FW.emit('render')`.
   Toto je **jediné čitelné, ručně psané místo v souboru** — pokud máš něco měnit, s vysokou
   pravděpodobností právě tady, mezi těmi dvěma značkami. Značky zachovej.
   Pozor: mutace přidává **runtime závislost na CDN** (jsDelivr) — bez sítě se použije chování
   podle toho, co stihlo doběhnout, a wiki zůstane bez Markdown renderu.
2. **Český překlad** — texty rozhraní jsou přeložené přímo v minifikovaném těle
   („Všechny stránky“, „Nastavení wiki“, „Vytvořit slug z názvu“, „Uložit wiki na …“,
   „Je vyžadován JavaScript“, `<html lang=cs-cz>`, `<title>Česká FW</title>`).
   Překlad se opravuje **cílenou záměnou konkrétního řetězce**, nikdy hromadným přepisem.
   Hlídej diakritiku: v souboru jsou i escapované podoby (`"Zrušit"`, `pokračov\xE1n\xED`).

## Jak Feather Wiki funguje (kontext pro rozhodování)
- Wiki data (stránky, štítky, nastavení) žijí **uvnitř téhož HTML souboru**, v `<script id=p
  type=application/json>`. Uživatel si soubor stáhne / uloží tlačítkem „Uložit wiki“.
  Proto **soubor v repozitáři je prázdná šablona** — když ho lokálně otevřeš a něco do wiki napíšeš,
  necommituj takto „naplněnou“ verzi.
- Vlastní CSS/JS uživatele se ukládá do polí `wCss` / `wJs` v datech wiki, ne do zdroje.
- Editor umí režim editoru i Markdown, štítky, podstránky, vložené obrázky, seznam chybějících stránek.

## Ověření změny
Otevři soubor v prohlížeči, vytvoř stránku s Markdownem (nadpisy, seznam, odkaz, tučné),
ověř render (marked se musí načíst z CDN), zkontroluj štítky, podstránky a české texty v menu
i v nastavení. Před commitem porovnej diff — musí obsahovat **jen** zamýšlenou změnu,
ne přeformátování celého souboru.
