# CLAUDE.md — TIN Editor (Target Instruction Notation)

## Co to je
Editor formátu **TIN** — JSON zápisu toho, co má (a nemá) AI model dělat pro danou roli či úlohu.
Jediný soubor `index.html` (~506 řádků, ~29 kB) postavený na Alpine.js. Z rozepsaného TIN
umí vygenerovat systémový prompt v Markdownu.

**Zdroj pravdy pro formát je `tin-schema.json` (JSON Schema draft 2020-12), popis v `tin-spec.md`
a `tin-spec-cs.md`.** Když měníš strukturu dat v editoru, uprav i schéma a obě specifikace —
jinak se rozejdou.

## Odlišnost od zbytku repozitáře
Tento nástroj jako jediný v repozitáři **nepíše vlastní CSS ani vanilla JS** — používá:
- `https://cdn.tailwindcss.com` (utility třídy přímo v markupu),
- `https://cdn.jsdelivr.net/npm/alpinejs@3.x.x` (reaktivita, `x-data`, `x-model`, `x-for`),
- `https://unpkg.com/lucide@latest` (ikony přes `data-lucide`).

Drž se toho stylu: nové UI piš Tailwind třídami a Alpine direktivami, nezakládej vlastní
`<style>` bloky ani ruční DOM manipulaci. Rozhraní je **anglicky** (`<html lang="en">`) —
na rozdíl od většiny ostatních nástrojů; nové texty piš také anglicky.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7–9 | tři CDN skripty |
| ř. 10–15 | drobný `<style>` (jen doplňky) |
| ř. 17–252 | markup s `x-data="tinEditor()"`; sekce Metadata, Context, Instruction Sections, Referenced Files, Expected Output, Generated System Prompt |
| ř. 253–504 | `function tinEditor()` — jediná Alpine komponenta, vrací celý stav i všechny metody |

## Datový model (`this.tin`)
```js
{
  tin: "1.0",
  metadata: { id, name, lang, version, purpose, type },   // type: role | …
  context:  { scope, out_of_scope },
  sections: [ { id: "sec-xxxxx", title, instructions: [ {type, text} ], areas: [ …sekce… ] } ],
  files:    [ … ],
  output:   { description, language: "text/markdown" }
}
```
- `sections` jsou **rekurzivní** — `areas` obsahuje tytéž objekty jako `sections`, proto
  `addSection(targetArray)` bere pole jako parametr a `addArea(section)` ho jen volá nad `section.areas`.
  Novou operaci nad sekcemi piš stejně (parametrizovaně), ať funguje v libovolné hloubce.
- `instructions[].type` má tři hodnoty: **`do` / `dont` / `note`** (v UI `DO` / `DON'T` / `NOTE`).
  Rozšíření enumu se musí promítnout do `tin-schema.json` i do generátoru promptu.
- `id` sekce se generuje jako `'sec-' + Math.random().toString(36).substr(2, 5)` — jen pro
  klíčování v `x-for`, není součástí sémantiky.
- Volitelná pole (`related`, `extensions`) jsou ve schématu; editor je zatím needituje — pokud je
  doplníš, respektuj `additionalProperties: false` na kořeni.

## Import / export
- **Load from file** (`#importFile` + `FileReader`) a **Load from clipboard**.
- Import prochází „basic merge“ (~ř. 493), který doplní chybějící povinnou strukturu a zachová
  reaktivitu Alpine. Nikdy nenahrazuj `this.tin` cizím objektem bez tohoto sloučení — rozbije se
  binding a spadne render.
- **Copy JSON / Download JSON**, přepínač `minify` (JSON bez odsazení kvůli velikosti).
- **Generate Markdown system prompt** — výstup do `generatedPrompt`, zobrazení řídí `showPrompt`.

## Pasti
- Ikony Lucide se musí překreslit po každém renderu Alpine — proto `this.$watch('tin', …)` +
  `$nextTick(() => lucide.createIcons())` v `init()`. Když přidáš ikony do nově generovaného
  markupu a nezobrazí se, je to tohle.
- Mazání sekce se ptá přes `confirm()` — zachovej potvrzení u destruktivních akcí.
- Alpine je načtený s `defer`; nespoléhej na to, že je k dispozici v inline skriptu nad tělem.

## Ověření změny
Otevři soubor v prohlížeči (CDN vyžaduje online): přidání sekce, podoblasti a instrukcí všech tří
typů → přidání souboru → vyplnění metadat → generování promptu → download JSON i minify variantu →
import staženého souboru zpět → ověření výsledného JSON proti `tin-schema.json`.
