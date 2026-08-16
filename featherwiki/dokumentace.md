# FeatherWiki — Česká EGD verze osobní wiki v jednom HTML souboru

**Online verze nástroje:** [https://egdilna.github.io/nastroje/featherwiki](https://egdilna.github.io/nastroje/featherwiki)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#featherwiki](https://egdilna.github.io/nastroje/#featherwiki)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**FeatherWiki** (Česká EGD verze, upstream 1.9.1 „Goldfinch") je odlehčená osobní wiki, která běží celá z jednoho jediného HTML souboru. Nevyžaduje žádný server, žádnou databázi ani instalaci — obsah wiki (stránky, obrázky, nastavení, vlastní CSS/JS) je uložen přímo uvnitř téhož HTML souboru, ve kterém aplikace běží. Uložení změn probíhá formou stažení aktualizovaného HTML souboru nebo — pokud to server umí — přímým zápisem přes WebDAV.

### Klíčové funkce

- **Wiki v jednom souboru** — celá wiki (kód aplikace + obsah + vlastní styly + obrázky) je v jediném HTML souboru, který lze poslat e-mailem, uložit na USB flash disk nebo hostovat kdekoli jako statický soubor
- **Tři editory obsahu** — vizuální WYSIWYG editor, Markdown editor s náhledem a přímý HTML editor; každá stránka si pamatuje, ve kterém editoru byla naposledy upravena
- **Interní odkazy wiki** — zápis `[[Název stránky]]` nebo `[[zobrazený text|slug_stránky#nadpis]]`; odkazy na neexistující stránky se zvýrazňují jinou barvou
- **Vložené obrázky** — obrázky lze vložit ze souboru (automaticky se zmenší na zadaný rozměr) nebo připojit z existující knihovny; jsou uloženy přímo ve wiki souboru
- **Hierarchie stránek** — každá stránka může mít nadřazenou stránku, čímž vzniká strom podstránek; hierarchie se zobrazuje v postranním panelu jako rozbalovací seznam
- **Štítky** — libovolný počet štítků oddělených čárkou; klikem na štítek se zobrazí seznam stránek s tímto štítkem
- **Vyhledávání chybějících stránek** — přehled odkazů, které vedou na dosud nevytvořené stránky
- **Vlastní CSS, JavaScript a HEAD** — možnost přizpůsobit vzhled i chování wiki
- **Publikovaný režim** — skryje tlačítka pro editaci a činí wiki „jen ke čtení"
- **Statický HTML export** — volitelně přibalí obsah wiki i jako čisté HTML pro prohlížeče bez JavaScriptu
- **Import z jiné wiki** — přenesení obsahu ze staršího souboru Feather Wiki
- **Ukládání klávesovou zkratkou** — Ctrl+S / Cmd+S (Ctrl+Shift+S vynutí lokální stažení)
- **Ochrana proti ztrátě změn** — potvrzovací dialog při zavírání okna nebo přechodu, pokud jsou neuložené změny

### Uložení dat

Veškerý obsah wiki je uložen přímo uvnitř téhož HTML souboru:

- Metadata a stránky ve značce `<script id=p type=application/json>` (JSON, komprimovaný slovníkem klíčů)
- Obrázky uvnitř téhož JSON v poli `img` jako datové URL (`data:image/…;base64,…`)
- Vlastní CSS ve značce `<style id=c>`
- Vlastní JavaScript ve značce `<script id=j>`
- Vlastní HEAD přímo v `<head>` výsledného souboru

Data se nikam samovolně neodesílají. Uložit se dá dvěma způsoby:

1. **Lokální uložení** — kliknutí na tlačítko **Uložit wiki** stáhne aktualizovaný HTML soubor prohlížečem
2. **Uložení na server** — pokud je wiki hostována na serveru, který podporuje WebDAV (metoda `PUT` a hlavička `DAV`), nabídne aplikace navíc tlačítko **Uložit wiki na server**, které soubor zapíše přímo zpět

---

## Rozložení stránky

Aplikace se skládá ze dvou oblastí:

### Postranní panel (vlevo)

Obsahuje:

- Klikatelný **název wiki** (odkaz na domovskou stránku)
- Popis wiki
- Upozornění **Wiki byla změněna!** a tlačítka pro uložení (viditelná pouze v editovatelném režimu)
- Odkaz **Nastavení wiki**
- Rozbalovací pole **Nová stránka** s tlačítkem **Vytvořit stránku**
- Záložky **Stránky**, **Štítky**, **Nedávné**
- Seznam odpovídající aktivní záložce

Na malých obrazovkách se panel skryje a nahradí tlačítkem **Skrýt menu / Zobrazit menu**.

### Hlavní oblast (vpravo)

Zobrazuje obsah aktuální stránky nebo jednu ze systémových stránek (Nastavení, Všechny stránky, Chybějící stránky, výpis podle štítku, editor).

### Zápatí

V zápatí je odkaz „Běží na Feather Wiki" s uvedením verze v atributu `title`.

---

## Stránky wiki

### Vytvoření stránky

Novou stránku lze založit několika způsoby:

- V postranním panelu rozbalit **Nová stránka**, zadat název a potvrdit **Vytvořit stránku** (název musí mít alespoň 2 znaky)
- Kliknout na odkaz na dosud neexistující stránku — aplikace nabídne její vytvoření
- Ručně otevřít URL `?page=slug_nové_stránky` (pokud slug neexistuje, aplikace nabídne založení a odvodí název ze slugu — podtržítka převede na mezery a slova s velkými písmeny)

### Editace stránky

Tlačítko **Upravit** v pravém horním rohu stránky (skryté v publikovaném režimu) otevře editační formulář:

| Pole | Popis |
|------|-------|
| Název stránky | Povinný, minimálně 2 znaky |
| Slug stránky | Identifikátor v URL; tlačítko **Vytvořit slug z názvu** ho odvodí z názvu |
| Obsah | Editor obsahu — viz kapitola Editory |
| Štítky stránky | Čárkou oddělený seznam štítků; rozbalovací **Přidat existující štítek** urychluje volbu |
| Nadřazená stránka | Volba rodiče v hierarchii; **Žádná** = stránka je na nejvyšší úrovni |
| Skrýt stránku | Skryje stránku z hierarchie v postranním panelu |

Tlačítka:

- **Uložit** — uloží změny do stavu wiki (nezapisuje ještě do HTML souboru — k tomu je nutné zvlášť uložit wiki)
- **Zrušit** — zahodí neuložené změny (s potvrzením)
- **Smazat stránku** — trvale odstraní stránku (s potvrzením; nevratné po uložení wiki)

### Vlastnosti stránky

- **Datum vytvoření** a **datum poslední úpravy** — zobrazují se v záhlaví stránky (jsou-li shodná, zobrazí se pouze jedno)
- **Drobečková navigace** — nad nadpisem stránky se zobrazí posloupnost rodičovských stránek
- **Podstránky** — v zápatí stránky se zobrazí seznam podstránek
- **Kotva u nadpisů** — u každého nadpisu se při najetí myší objeví odkaz `#` pro sdílení odkazu přímo na daný nadpis

---

## Editory obsahu

Ve výběru **Default Page Editor** v nastavení wiki i u každé jednotlivé stránky lze zvolit jeden ze tří editorů:

### Vizuální editor (Editor)

WYSIWYG editor s formátovací lištou. Ovládací tlačítka:

| Tlačítko | Funkce |
|----------|--------|
| ☒ | Vymazat formátování |
| **B** | Tučné |
| *I* | Kurzíva |
| U | Podtržené |
| **H** | Nadpis (H2) |
| **H₂** | Podnadpis (H3) |
| ¶ | Odstavec |
| ↦ ↔ ↤ | Zarovnat vlevo / na střed / vpravo |
| # | Číslovaný seznam |
| • | Odrážkový seznam |
| „ " | Citace (`<blockquote>`) |
| ― | Oddělovač (`<hr>`) |
| 🔗 | Odkaz (výzva k zadání URL) |
| 🖼️ | Odkaz na externí obrázek (výzva k zadání URL) |
| 📸 | Vložit obrázek ze souboru |
| 📎 | Přidat existující obrázek z knihovny wiki |

Odsazení seznamů: klávesa **Tab** odsadí, **Shift+Tab** vrátí zpět. Stisknutí **Enter** uvnitř nadpisu nebo citace ukončí formátování a přejde na nový odstavec.

### Markdown editor

Textové pole pro Markdown s tlačítky:

- **Náhled** — přepíná náhled výsledného HTML pod editorem
- **Vložit obrázek ze souboru** — nahraje a vloží obrázek
- **Přidat existující obrázek** — vloží obrázek z knihovny wiki

Podporovaná Markdown syntaxe zahrnuje:

- Nadpisy (`#` až `######`, případně podtržením `====` a `----`)
- Tučné (`**text**`, `__text__`), kurzíva (`*text*`, `_text_`), přeškrtnutí (`~~text~~`)
- Citace (`> text`), odrážkové i číslované seznamy s vnořováním pomocí Tab / mezer
- Oddělovač (`---`), zaškrtávací pole `[ ]` a `[x]`
- Kódové bloky ve trojitých apostrofech (```) s volitelným označením jazyka, inline kód v jednoduchých apostrofech
- Odkazy `[text](url)` (a e-mail / URL v ostrých závorkách `<…>`), obrázky `![alt](url)`
- HTML značky (procházejí beze změny)
- Zalomení řádku dvěma mezerami na konci řádku
- Únikový zápis `\znak` (např. `\*` pro doslovnou hvězdičku)

### HTML editor

Textové pole s přímým HTML zdrojem stránky. Umožňuje plnou kontrolu nad značkami.

### Přepínání editoru u stránky

Nad editorem je tlačítko **Použít Markdown / Použít editor**. Přepnutí z Markdownu na vizuální editor nabídne konverzi Markdown → HTML (potvrzením „Zrušit" se zachová původní obsah). Přepnutí na HTML editor se nastavuje v hlavním nastavení wiki (Default Page Editor).

### Interní odkazy wiki

V každém editoru fungují interní odkazy:

- `[[Název stránky]]` — odkaz podle názvu (slug se odvodí automaticky)
- `[[Zobrazený text|slug_stránky]]` — vlastní zobrazený text
- `[[text|slug_stránky#nadpis]]` — odkaz na konkrétní nadpis v cílové stránce

Odkazy na dosud neexistující stránky se zvýrazňují jinou barvou; kliknutím na ně aplikace nabídne vytvoření stránky.

### Vsuvka `<nowiki>`

Text uzavřený do `<nowiki>…</nowiki>` se nezpracovává jako Markdown / wiki syntaxe a zobrazí se doslova.

---

## Obrázky

### Vložení obrázku

Tlačítka **Vložit obrázek ze souboru** (v každém editoru) otevřou dialog pro výběr souboru. Po výběru:

1. Aplikace se dotáže na **alternativní text** obrázku
2. Zeptá se na **maximální šířku v pixelech** (výchozí 400)
3. Zeptá se na **maximální výšku v pixelech** (výchozí 350)
4. Obrázek zmenší (poměr stran zachován) a vloží do knihovny wiki

Před prvním vložením se zobrazí varování „Vkládání obrázků zvětšuje velikost souboru wiki. Pokračovat?".

### Knihovna obrázků

Tlačítkem **Přidat existující obrázek** nebo v nastavení wiki v sekci **Vložené obrázky** je dostupná knihovna všech vložených obrázků. U každého obrázku:

- Miniatura, alternativní text, rozměry v pixelech
- **Zobrazit** — otevře obrázek v samostatném okně v původní velikosti
- **Upravit alternativní text** (jen v nastavení)
- **Smazat obrázek** (jen v nastavení) — trvale odstraní obrázek; pokud byl použit na stránkách, nahradí jeho výskyty textem `deleted`
- **Vložit obrázek** (jen z editoru) — vloží obrázek na aktuální kurzor
- **Použito na N stránkách** (jen v nastavení) — rozbalovací seznam stránek, které obrázek používají

### Zápis obrázku v obsahu

Ve zdrojovém zápisu wiki jsou obrázky reprezentovány jako `img:{id}:img` (Markdown i vizuální editor je při renderu nahradí odpovídajícím `<img>` s alt textem z knihovny).

---

## Štítky

- Zadávají se v editoru stránky jako **čárkou oddělený seznam**
- Rozbalovací volba **Přidat existující štítek** urychluje výběr již použitých štítků
- V postranním panelu vzniká záložka **Štítky** (zobrazí se, jakmile aspoň jeden štítek ve wiki existuje) se seznamem všech štítků
- Klik na štítek otevře **Stránky se štítkem `název`** — výpis všech stránek s daným štítkem

---

## Speciální pohledy

| URL | Popis |
|-----|-------|
| `?` | Domovská stránka wiki (nastavená v Nastavení, jinak seznam všech stránek) |
| `?page=slug` | Konkrétní stránka podle slugu |
| `?page=a` | **Všechny stránky** — hierarchický seznam všech nezakázaných stránek |
| `?page=s` | **Nastavení wiki** — dostupné vždy, i v publikovaném režimu |
| `?page=m` | **Chybějící stránky** — přehled odkazů na dosud nevytvořené stránky |
| `?tag=název` | Stránky s daným štítkem |

Pokud v URL parametru `page` je slug neexistující stránky, aplikace nabídne její založení a název odvodí z podtržítek (např. `moje_prvni_stranka` → „Moje Prvni Stranka").

---

## Postranní panel — záložky

### Stránky

Hierarchický strom stránek nejvyšší úrovně a jejich podstránek. Nadřazené stránky jsou rozbalovací (`<details>`) a při načtení podstránky se automaticky rozbalí až k aktivní stránce. Aktuálně otevřená stránka je zvýrazněna. Pod stromem se vždy zobrazuje odkaz **Všechny stránky** a — pokud existují chybějící odkazy — **Chybějící stránky**.

### Štítky

Seznam všech použitých štítků s odkazy na výpisy stránek. Záložka je viditelná jen tehdy, když ve wiki existuje aspoň jeden štítek.

### Nedávné

Seznam stránek seřazený podle data poslední úpravy (nebo vzniku), u každé stránky se zobrazuje formátované datum a čas.

---

## Nastavení wiki

Otevře se odkazem **Nastavení wiki** v postranním panelu (nebo přímo přes `?page=s` — funguje i v publikovaném režimu).

### Základní pole

| Pole | Popis |
|------|-------|
| Název wiki | Zobrazí se v postranním panelu a v `<title>` (povinné) |
| Popis wiki | Krátký popis pod názvem, zapisuje se i do meta description |
| Default Page Editor | Výchozí editor pro nové stránky: **Použít editor** / **Použít Markdown** / **Zobrazit HTML** |
| Domovská stránka | **Všechny stránky (výchozí)** nebo konkrétní stránka z výběru |
| Pořadí stránek | Textové pole s jedním slugem na řádek — určuje pořadí v postranním panelu |

### Rozšíření vzhledu a chování

| Pole | Popis |
|------|-------|
| Vlastní CSS | CSS vložené do stránky ve značce `<style id=c>` — aplikuje se okamžitě |
| Vlastní JS | JavaScript spuštěný jednou při načtení wiki (nutno wiki uložit a znovu otevřít, aby se změna projevila) |
| Vlastní Head | Libovolné HTML vkládané do `<head>` (upozornění: chybné HTML může wiki rozbít) |

### Přepínače

| Volba | Popis |
|-------|-------|
| Zahrnout statické HTML | Vloží do výstupu obsah všech stránek i jako čisté statické HTML pro prohlížeče bez JavaScriptu — téměř zdvojnásobí velikost souboru |
| Publikovaná needitovatelná wiki | Skryje tlačítka **Uložit**, **Nová stránka**, **Nastavení wiki** i tlačítko **Upravit** na stránkách; zrušení je možné ručním otevřením `?page=s` |

Změny se aplikují tlačítkem **Aktualizovat** (potvrzením se změny zapíšou do stavu wiki; k jejich zápisu do souboru je nutné wiki dále uložit).

### Importovat a přepsat jiným souborem Feather Wiki

Tlačítko **Importovat a přepsat jiným souborem Feather Wiki** načte jinou wiki (HTML soubor Feather Wiki) a přepíše celý aktuální obsah — stránky, obrázky, CSS i JS. Použitelné pro převzetí obsahu ze starší verze aplikace nebo pro spojení projektů.

### Vložené obrázky (v nastavení)

Sekce **Vložené obrázky** v dolní části nastavení zpřístupňuje knihovnu obrázků s možností úpravy alternativního textu, smazání a přehledem stránek, na kterých je obrázek použit — viz kapitola Obrázky.

---

## Ukládání wiki

Změny provedené v aplikaci jsou nejprve pouze v paměti prohlížeče. Aby se zapsaly do HTML souboru, je nutné wiki uložit.

### Lokální uložení

- V postranním panelu tlačítko **Uložit wiki** (v publikovaném režimu je skryté)
- Klávesová zkratka **Ctrl+S** (na Macu **Cmd+S**)

Prohlížeč stáhne aktualizovaný HTML soubor pod původním názvem (nebo `index.html`, není-li k dispozici jiný).

### Uložení na server (WebDAV)

Pokud je wiki hostována na serveru s podporou WebDAV, aplikace to při načtení detekuje (metoda `OPTIONS` + hlavička `DAV`) a zobrazí navíc tlačítko **Uložit wiki na server**. To zapíše aktualizovanou wiki přímo zpět na server metodou `PUT`.

- **Ctrl+S** v tomto režimu ukládá na server
- **Ctrl+Shift+S** vynutí lokální stažení, i když je dostupný server

Úspěch / chyba se ohlásí notifikací v horní části okna.

### Upozornění na neuložené změny

Pokud jsou v paměti neuložené změny:

- V postranním panelu se zobrazí upozornění **Wiki byla změněna!**
- Tlačítko uložení má zvýrazněný styl
- Při zavírání okna se zobrazí prohlížečový dialog „Lose unsaved changes?"
- Při přechodu z editoru se zobrazí potvrzení „Zahodit neuložené změny?"

---

## Klávesové zkratky

| Zkratka | Akce |
|---------|------|
| Ctrl+S / Cmd+S | Uložit wiki (lokálně nebo na server, viz kapitola Ukládání) |
| Ctrl+Shift+S | Vynutit lokální uložení, i když je dostupný server |
| Tab | V Markdown / HTML editoru odsadí řádek (nebo výběr) |
| Shift+Tab | Zruší odsazení řádku (nebo výběru) |
| Enter | V citaci nebo nadpisu ve vizuálním editoru přejde na nový odstavec |

---

## Publikovaný režim

Přepnutím **Publikovaná needitovatelná wiki** v nastavení se aplikace přepne do režimu pouze pro čtení:

- Skryjí se tlačítka **Uložit wiki**, **Nová stránka**, **Nastavení wiki** a **Upravit** na stránkách
- Upozornění o změnách se nezobrazuje

Vypnutí je možné ručním otevřením nastavení přes adresu `?page=s` a odškrtnutím volby.

---

## Statické HTML

Volba **Zahrnout statické HTML** přidá do výsledného souboru obsah všech stránek renderovaný jako statické HTML. Účel:

- Wiki je čitelná i v prohlížečích, které nemají povolený JavaScript
- Vyhledávače, screen readery a jiné nástroje pro zpracování textu vidí plný obsah

V uložené statické podobě odkazy směřují na kotvy (`#page=slug`) uvnitř téhož souboru místo klasického parametru `?page=slug`.

Cena za výhodu: velikost souboru narůstá téměř dvojnásobně.

---

## Notifikace

Systémové zprávy (např. „Nastavení aktualizováno", „Uloženo", „Uložení selhalo!") se zobrazují jako oznámení v horní části okna. Kliknutím na notifikaci ji lze zavřít; jinak se sama zavře po přibližně 5 sekundách. Chybové notifikace zůstávají zobrazené déle (přibližně 10 sekund) a mají červené pozadí.

---

## Konkrétní úpravy v distribuované české EGD verzi

Distribuovaný soubor obsahuje kromě standardní aplikace Feather Wiki i tyto úpravy:

- **Kompletní česká lokalizace** rozhraní (název „Česká FW", popis „Česká EGD verze FeatherWiki", jazyk stránky nastaven na `cs-cz`)
- **Výchozí editor je Markdown** (`editor: "md"` v inicializační konfiguraci)
- **Náhrada Markdown parseru knihovnou Marked.js** — ve značce `<script id=j>` je vlastní JavaScript, který při načtení wiki nahradí vestavěný Markdown parser knihovnou [Marked.js](https://marked.js.org) načítanou z CDN `https://cdn.jsdelivr.net/npm/marked/marked.min.js`. Znamená to:
  - Renderování Markdownu odpovídá aktuální stabilní verzi Marked.js (širší podpora syntaxe než vestavěný minimalistický parser)
  - **První načtení vyžaduje připojení k internetu** pro stažení knihovny; po prvním úspěšném načtení bude knihovna obvykle v cache prohlížeče
  - Pokud používáte wiki plně offline, můžete v Nastavení → Vlastní JS tento skript odstranit (vrátíte se k vestavěnému parseru), případně nahradit URL vlastním hostovaným souborem

---

## Kompatibilita a technické informace

### Prohlížeče

Aplikace je jednosouborová statická HTML stránka bez externích závislostí (kromě volitelného načtení Marked.js, viz výše). Vyžaduje moderní prohlížeč s podporou JavaScriptu (Chrome, Firefox, Edge, Safari v aktuálních verzích). Pro čtení publikované wiki v prohlížeči bez JavaScriptu je nutné mít při ukládání zapnutou volbu **Zahrnout statické HTML**.

### Struktura souboru

Uložený HTML soubor obsahuje ve své `<head>` sekci:

- `<title>` — název wiki
- `<meta name="application-name" content="Feather Wiki">`
- `<meta name=version content=1.9.1>`
- `<style id=s>` — vestavěné styly aplikace
- `<style id=c>` — volitelné vlastní CSS
- `<script id=p type=application/json>` — komprimovaná data wiki (stránky, obrázky, metadata); JSON má zkrácené názvy klíčů a slovník ve zvláštní vlastnosti `_`
- `<script id=a>` — kód aplikace
- volitelný vlastní obsah HEAD

V `<body>` je:

- základní `<main>` a `<footer>` (přepisované aplikací při běhu)
- `<script id=j>` — volitelný vlastní JavaScript, obalený v `FW.ready(() => { … })` a spouštěný po načtení wiki

### Verze upstream

- Aktuální verze aplikace: **1.9.1 (Goldfinch)**
- Označení lokalizace: **Česká FW** / **Česká EGD verze FeatherWiki**
- Jazyk stránky: `cs-cz`
- Domovská stránka projektu Feather Wiki: [https://feather.wiki](https://feather.wiki)

### Bezpečnost

Aplikace neposílá zadaný obsah wiki nikam mimo prohlížeč. Uložení probíhá stažením souboru nebo (jen na WebDAV serveru) přímým zápisem zpět na místo, odkud byla wiki načtena.

Vlastní JavaScript zadaný v nastavení se spouští při každém načtení wiki — při přebírání souboru z cizího zdroje je vhodné jeho obsah v nastavení zkontrolovat. To se týká i této distribuce, která ve výchozím stavu obsahuje skript stahující knihovnu Marked.js z veřejného CDN.

---

*Dokumentace popisuje Českou EGD verzi nástroje FeatherWiki na základě upstream verze 1.9.1 „Goldfinch". Nástroj je vydáván v rámci iniciativy eGdilna.*
