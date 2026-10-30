# WikiWeb — pokyny a architektura

Nástroj na weby a wiki z Markdownu uložené v repozitáři na GitHubu. Dvě části:

| Soubor | Co to je |
|---|---|
| `index.html` | **Aplikace** (nastroje.egdilna.cz/wikiweb). Připojí se k repozitáři, web zobrazí a v režimu Úpravy ho edituje a ukládá. |
| `prohlizec.html` | **Prohlížeč** pro návštěvníky. Kopíruje se do složky webu jako `index.html` (ručně, nebo tlačítkem v Nastavení webu) a na GitHub Pages z něj web běží. |

Aplikace prohlížeč nepřepisuje: zobrazení i náhled dělá přes `<iframe src="prohlizec.html?nahled=1">`, takže web vypadá v aplikaci přesně jako na Pages.

## Web = složka v repozitáři

```
wiki.json        nastavení webu
contents.json    strom stránek
sidebar.md       text v postranním panelu (název jde změnit v sidebar_file)
index.html       kopie prohlizec.html
…/*.md           stránky — libovolné podsložky, výchozí pro nové stránky v folders.pages
…/obrázky        nahrané obrázky — výchozí složka folders.media
```

### wiki.json

Klíče sdílené s md2web (`website.json`) mají stejný význam: `title`, `tagline`, `language`, `color` (název palety md2web), `copyright {name,url,year}`, `menu_links`, `footer_links`.

```json
{
  "title": "Kancelářská příručka",
  "tagline": "Postupy, projekty a šablony",
  "language": "cs",
  "color": "indigo",
  "home": "uvod",
  "menu_links":   [{ "label": "Postupy", "page": "postupy" }, { "label": "GitHub", "url": "https://…" }],
  "footer_links": [{ "label": "Kontakty", "page": "kontakty" }],
  "copyright": { "name": "Kancelář", "url": "", "year": 2026 },
  "sidebar": ["hledani", "sidebar", "sekce", "obsah", "stitky", "kalendar", "odkazy", "komentare"],
  "folders": { "pages": "stranky", "media": "obrazky" },
  "sidebar_file": "sidebar.md",
  "pager": true,
  "expand_sections": true,
  "edit_link": false,
  "github": { "repo": "vlastnik/repo", "branch": "main", "folder": "web" }
}
```

Odkaz v menu má buď `page` (id stránky), nebo `url`. `github` zapisuje aplikace při každém uložení (kvůli odkazu Upravit v patičce) — **token do souboru nikdy nepatří**.

### contents.json

```json
{ "pages": [
  { "id": "postupy", "title": "Postupy", "emoji": "🧭", "type": "rozcestnik", "perex": "…",
    "children": [
      { "id": "zakazka", "title": "Přijetí zakázky", "emoji": "📝",
        "file": "stranky/postupy/zakazka.md", "tags": ["zakázky"] },
      { "id": "cizi", "title": "Článek odjinud", "repo": "michalradacz/testweb",
        "file": "obsah/testovaci-clanek.md" }
    ] }
] }
```

- `file` — cesta ve složce webu, nebo adresa `https://…` (odkaz `github.com/…/blob/…` se převede na raw), nebo zkratka `gh:vlastnik/repo[@vetev]/cesta.md`.
- `repo` — `vlastnik/repo` nebo `vlastnik/repo@vetev`; pak se `file` čte z `raw.githubusercontent.com`. V aplikaci se zadává jedním polem `vlastnik/repo/cesta.md`.
- Bez `file` je stránka čistý rozcestník podstránek.
- `type`: `stranka` (výchozí), `uvod`, `rozcestnik`, `clanky`, `novinky`. Typ mění jen vzhled; obsah je vždy Markdown.
- `hidden: true` — stránka není v sekcích webu, odkazem je dostupná.
- **Data vytvoření a úprav se do contents.json záměrně nedávají** — obsah chodí z různých zdrojů a nedaly by se udržet. Datum mají jen články a novinky přímo v Markdownu.

### Markdown

Parser je převzatý z md2web (stejná syntaxe i HTML výstup) a doplněný:

- emoji na začátku odstavce dělá barevné upozornění (třídy `ep-*` jako md2web),
- CriticMarkup `{++ ++} {-- --} {~~ ~> ~~} {== ==} {>> <<}`,
- interní odkazy: `[[Název]]`, `[[Název|text]]`, md2web `[Název]` a `[text](jina-stranka.md)`; neexistující cíl se vyznačí,
- relativní cesty obrázků a odkazů se řeší vůči umístění `.md` souboru (funguje i u cizího repozitáře),
- úkoly `- [ ]` / `- [x]`, jazyk u bloku kódu se nezobrazuje,
- úvodní `# Nadpis` v souboru se vynechá (H1 stránky je její název z contents.json), další H1 se sníží na H2,
- **novinky**: řádek `2026-10-30: Titulek` (také `30.10.2026:` a `10/30/2026:`), pod ním text do dalšího data nebo nadpisu; v panelu se ukáže kalendář,
- **sekce článků**: soubor začíná řádkem `articles` (smí mu předcházet `# Název`), každý článek je `## Nadpis`, pod ním `Datum:` a `Tagy:`, první odstavec je perex. Přesně formát md2web; víc sekcí článků = víc takových souborů, každá má vlastní štítky.

## Adresy v prohlížeči

`#id` stránka · `#id/clanek` článek · `#id?tag=x` články se štítkem · `#id:kotva` nadpis na stránce · `#/stitek/x` stránky se štítkem z contents.json. Hash bez známého id zkusí slug názvu stránky (kompatibilita s odkazy md2web).

Parametry: `?repo=vlastnik/repo&slozka=web&vetev=main` načte web z raw.githubusercontent.com (jen veřejné repozitáře); `?nahled=1` čeká na data od aplikace přes `postMessage` (`wikiweb-nahled`, odpovídá `wikiweb-nahled-pripraven` a `wikiweb-stranka`).

## Aplikace

- Parametry `?repo=vlastnik/repo&slozka=web&vetev=main` (přijme i `owner`+`repo`, `path`, `branch` jako editor md2web). Token je jen v `localStorage` (`wikiweb-token-v1`).
- Režimy **Prohlížet** (prohlížeč přes celou plochu) a **Upravovat** (strom | editor | volitelně náhled). Při přepnutí se otevře stránka, která byla zrovna vidět; proklik v náhledu přepne i editor.
- S tokenem se po načtení dotáhnou všechny místní stránky přes API — prohlížení pak funguje i u soukromého repozitáře.
- Obsah z cizího repozitáře nebo URL se v aplikaci jen čte.

### Ukládání — pravidla z kořenového CLAUDE.md

- čtení přes `ghObsahSouboru()` se záložním `git/blobs/{sha}`,
- jeden malý soubor = Contents API `PUT`, víc souborů nebo soubor nad 1 MB = jeden commit přes Git Data API (`ghCommit()`: blob → strom s `base_tree` → commit → `PATCH` větve); mazání souborů je položka stromu se `sha: null`,
- pojistka `E.nacteno`: dokud nejsou načtené `wiki.json` a `contents.json` (nebo potvrzeně chybí), neuloží se nic a důvod je ve stavovém řádku. Stránka, kterou se nepodařilo načíst, je jen ke čtení, dokud uživatel přepsání výslovně nepotvrdí,
- před uložením se porovná SHA každého měněného souboru s repozitářem; když se mezitím změnil, uložení se zastaví,
- Historie souboru vypíše `commits?path=…` a starší verzi načte do editoru (zapíše se až při uložení),
- base64 po blocích (`bytyDoBase64`).

## Kontrola před dodáním

```bash
for f in index.html prohlizec.html; do
  awk '/^<script>/{f=1;next}/^<\/script>/{f=0}f' $f > /tmp/k.js && node --check /tmp/k.js
done
```

Žádné `console.` v kódu. Texty, komentáře i názvy česky.
