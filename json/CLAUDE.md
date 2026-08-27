# CLAUDE.md — JSON Editor

## Co to je
Jednosouborový hierarchický editor JSON (`index.html`, ~1830 řádků, ~74 kB). Zobrazuje JSON
jako rozbalovatelný strom nadpisů, umožňuje editaci klíčů, typů a hodnot, hoisting (izolaci)
podstromu, statistiky a sdílení dokumentu odkazem. Bez backendu, bez build kroku.

**Popis nástroje pro uživatele: `info-cs.md` a `info-en.md` ve stejné složce** — na rozdíl od
většiny ostatních nástrojů tu není `dokumentace.md`; při změně chování aktualizuj obě jazykové
verze.

## Struktura souboru
| Rozsah | Obsah |
|---|---|
| ř. 7–423 | `<style>` — veškeré CSS inline |
| ř. 425–453 | HTML kostra: `#toolbar`, `#editorArea`, `#jsonTree`, `#emptyState`, `#statsPanel` |
| ř. 456–651 | `const translations = { cs: {…}, en: {…} }` |
| ř. 652–1789 | `const app = { … }` — celá aplikace jako jeden objektový literál |
| ř. 1792–1829 | init IIFE: čtení `?json=` a `?v` z URL |

**Aplikace nemá třídy ani top-level funkce.** Všechno visí na `app`; metody se volají jako
`app.render()`, `app.t('key')`. Novou funkčnost přidávej jako metodu `app`, ne jako globální funkci.

## Datový model
```js
app.data = { filename: 'soubor.json', root: <libovolný JSON> }
```
Do stromu se přes `app.addMetadata(root)` doplňují pomocná pole (`__id`, stav rozbalení).
Před uložením/kopírováním se metadata zase odstraňují — když měníš serializaci, ověř,
že se `__*` klíče nedostanou do výstupu.
Stav editace drží `app.editingId`, izolaci `app.hoistedId`, čítač id `app.idCounter`.

## URL a integrace
- `?json=<base64url>` — dokument v odkazu. Kódování je **URL-safe base64 s UTF-8**:
  `+`→`-`, `/`→`_`, padding se dopočítává; dekóduje se přes `atob` + `TextDecoder('utf-8')`.
  Když sáhneš na `copyUrl`, musíš stejně upravit i dekodér v init IIFE.
- `?v` (jakákoli hodnota, stačí přítomnost) — **režim jen pro čtení**: `app.viewOnly = true`
  a toolbar se vykreslí v minimální podobě. Každé nové tlačítko v toolbaru musí respektovat
  větev „In view-only mode, show minimal toolbar“ (~ř. 727).
- „Editor links“ (`openInOpmlEditor` / `openInMarkdownEditor` / `openInJsonEditor`) — provázání
  se sourozeneckými nástroji `/opml` a `/markdown`. Stejná trojice existuje i tam.

## Lokalizace
`app.t(key)` + `translations.cs` / `translations.en` (~66 klíčů). Jazyk se ukládá do
`localStorage["json-editor-language"]`, výchozí je čeština. **Každý nový text musí mít klíč
v obou jazycích** — nikdy nevkládej hlášku natvrdo do šablony.

## Ukládání a načítání
- Uložení přes File System Access API (`showSaveFilePicker`) s fallbackem na Blob download —
  funkce „Universal file save“. Fallback nemaž, používá se v Safari/Firefoxu.
- Načtení souboru přes `#fileInput` + `FileReader`.
- Vložení ze schránky přes dialog `#pasteTextarea` (`navigator.clipboard` není spolehlivé všude).

## Konvence, které dodrž
- Vykreslování je **string-based**: metody skládají HTML do `innerHTML`. Uživatelský text
  proto vždy prožeň `escapeHtml`, jinak vznikne XSS z obsahu JSON souboru.
- Nadpisy stromu se generují podle úrovně (`h1`–`h6`, „Create heading based on level“) —
  strom je záměrně čitelný pro čtečky obrazovky, nedělej z něj `<div>` bez sémantiky.
- Klíč objektu jde přejmenovat jen u objektů, ne u polí; přejmenování zachovává **pořadí klíčů**
  (viz „Get all keys in order“ / „Rebuild object with new key name“, ř. 1116–1160). Nezjednodušuj
  na `delete` + přidání na konec.
- Bez externích knihoven a bez CDN — soubor musí fungovat i offline.

## Ověření změny
Otevři v prohlížeči: nový JSON → přidání vlastnosti i položky pole → přejmenování klíče
(zkontroluj pořadí) → sbalit/rozbalit vše → izolace podstromu a návrat přes hoist banner →
statistiky → Kopírovat URL → otevřít URL v novém okně → přidat `&v` a ověřit read-only režim →
přepnutí jazyka na EN a zpět.
