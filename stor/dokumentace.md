# DMS úložiště — Dokumentace

**Online verze nástroje:** [https://egdilna.github.io/nastroje/stor](https://egdilna.github.io/nastroje/stor)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#stor](https://egdilna.github.io/nastroje/#stor)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu (k práci s daty však potřebuje připojení ke GitHubu).

---

## Přehled funkcí

**DMS úložiště** (Document Management System) je odlehčená webová aplikace pro ukládání, verzování a sdílení dokumentů. Celé úložiště je popsané jediným souborem `storage.json` v zadané složce libovolného GitHub repozitáře a verze souborů jsou ukládané jako binární přílohy v té samé složce. Aplikace běží jen v prohlížeči — žádný server, žádná instalace, GitHub se chová jako úložná vrstva.

### Klíčové funkce

- **Strom složek a položek** — hierarchická struktura složek, do kterých lze přidávat soubory (s verzemi), textové poznámky a externí odkazy
- **Verzování souborů** — každý nahraný soubor je nová verze, předchozí verze zůstávají dostupné s datem, autorem a popisem
- **Části souborů** — volitelná podstruktura pro paralelní linie verzí (např. různé subjekty smluv) uvnitř jednoho logického souboru
- **Markdown poznámky** — editovatelné poznámky s podporou Markdownu, CriticMarkupu, tabulek, odkazů a kódu
- **Komentáře k souborům** — diskusní vlákno u každého souboru s autorem (název zařízení) a datem
- **Tagy a filtrování** — seznam tagů na úrovni úložiště, přiřazení tagů jednotlivým položkám, filtrování složek podle tagů s AND logikou
- **Náhledy v aplikaci** — vestavěný náhled pro Markdown, obrázky (PNG, JPG, GIF, SVG, WebP, AVIF…), audio (MP3, WAV, OGG…), video (MP4, WebM…) a PDF
- **Multi-úložiště** — práce s libovolným počtem různých úložišť (různých GitHub repo/složek) z jednoho zařízení s jedním sdíleným API klíčem
- **Vizuální motivy** — 25+ vestavěných motivů (světlý/tmavý/auto, sépiové, vysoký kontrast, Solarized, Nostalgia 90s, Terminal, inspirace produkty atd.); motiv je vlastnost úložiště — vidí ho všichni uživatelé stejně
- **Embed režim** — možnost vložit detail položky do iframe v jiném webu, automaticky jen pro čtení
- **Sdílitelné URL** — adresa odráží aktuální cestu v úložišti i případně zobrazenou verzi; odkaz lze kopírovat z adresního řádku
- **Atomický commit** — verze souboru i aktualizovaný `storage.json` se zapisují do GitHubu jako jeden Git commit (žádný nesoulad mezi metadaty a obsahem)
- **Operační log s retry** — všechny GitHub operace jsou logované; chybné lze opakovat tlačítkem, hromadně, nebo z konkrétní položky logu

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML, ARIA atributy (`role`, `aria-live`, `aria-pressed`, `aria-expanded`, `aria-labelledby`), klávesová ovladatelnost, podpora čteček obrazovky. Klávesové zkratky jsou zaregistrovány v capture fázi tak, aby měly přednost před quick-navigation NVDA/JAWS/VoiceOver. Dialogy využívají nativní `<dialog>` element.

### Uložení dat

Data úložiště jsou v `storage.json` v zadané složce na GitHubu — slouží jako jediný zdroj pravdy a synchronizace mezi zařízeními a uživateli probíhá přes GitHub. Lokálně v prohlížeči (`localStorage` pod klíčem `dms-config-v3`) jsou jen údaje vázané na zařízení: GitHub API klíč, jméno zařízení, výchozí větev a seznam navštívených úložišť. Verze souborů jsou samostatné binární soubory v té samé složce, jejich obsah se posílá rovnou na GitHub a do `localStorage` se neukládá.

---

## Hlavní koncept

### Co je „úložiště"

Úložiště je jedna složka v GitHub repozitáři, ve které se nachází:

- soubor `storage.json` popisující celou strukturu (složky, soubory, poznámky, odkazy, verze, tagy, komentáře, vlastnosti)
- jednotlivé verze souborů jako binární soubory s názvem ve tvaru `{storageid}_{souborid}_{cast}_{datum}_{cas}.{přípona}`

Cesta k úložišti se zadává ve tvaru `owner/repo/cesta/ke/složce`. Repozitář a větev musí existovat, ale složka sama vzniknout může — vytvoří se automaticky při prvním uložení.

### Co je „verze"

Každý upload souboru vytvoří novou verzi. Předchozí verze zůstávají v úložišti dostupné. Verze obsahuje:

- časové razítko nahrání
- velikost a SHA hash
- jméno zařízení, ze kterého byla nahrána
- volitelný popis (changelog)
- volitelnou příslušnost k „části" souboru
- vlastní název souboru na GitHubu (deterministicky generovaný)

### Co je „část souboru"

Část je volitelná podstruktura jednoho souboru, která pomáhá organizovat verze, když k jednomu logickému souboru patří více paralelních linek (např. smlouva existuje v několika subjektových variantách). Každá verze může — nebo nemusí — patřit k některé části. Filtr verzí dovoluje zobrazit jen verze konkrétní části, „bez části" nebo všechny.

### API klíč jako vlastnost zařízení

GitHub Personal Access Token je v aplikaci sdílený pro všechna úložiště otevřená v daném prohlížeči — je to vlastnost zařízení, ne úložiště. Pokud se přepnete na jiné úložiště ve stejném prohlížeči (klikem v sekci „Známá úložiště", nebo otevřením jiného URL), klíč se použije automaticky bez nutnosti znovu jej zadávat.

Bez API klíče funguje jen čtení veřejných repozitářů; pro zápis (upload verzí, mazání, úpravy `storage.json`) je klíč nutný.

### Atomický commit

Pokud aplikace nahrává novou verzi nebo maže verzi/položku, zapisuje do GitHubu nový blob (nebo deklarovaný delete) **i** aktualizovaný `storage.json` jako součást jednoho Git commitu přes Git Data API. Tím je garantováno, že nenastane stav „verze v JSONu existuje, ale blob na GitHubu chybí" (a naopak).

---

## Navigace a rozložení

### Hlavička stránky

Obsahuje:

- malý popisek nahoře s názvem úložiště (a jeho popisem, je-li nastaven)
- drobečkovou navigaci — od kořene úložiště přes všechny mezilehlé složky až po aktuálně otevřenou položku, každý článek s ikonou typu a možností kliknutí
- velký nadpis H1 odpovídající aktuálně zobrazené položce (ikona + název)

Záložka prohlížeče (title) automaticky zobrazuje „Název položky · Název úložiště – DMS".

### Hlavní obsah

Podle typu otevřené položky se zobrazí:

- složka — toolbar (hledání, řazení, akce), volitelný filtr podle tagů, seznam položek
- soubor — záhlaví, ID, sekce částí (v režimu úprav), seznam verzí, komentáře, formulář pro nahrání nové verze
- odkaz — popis a URL
- poznámka — Markdown obsah (případně editor)

### Spodní panel pro úpravy

Stálý panel pod hlavním obsahem obsahuje:

- **Přepínač „Režim úprav"** — zapíná editační akce a sekci nastavení
- **Indikátor „Neuloženo"** — bliká, pokud `storage.json` v paměti není ve shodě s GitHubem
- **Sekci „Operace s GitHubem"** — sklápěcí log probíhajících, úspěšných a neúspěšných operací
- **Sekci „Debug"** — interní log pro diagnostiku, vypnutý standardně

Při zapnutém režimu úprav panel obsahuje navíc sekce **Nastavení**, **Vlastnosti úložiště**, **Známá úložiště**, **Globální vyhledávání** a **Statistiky úložiště**.

### Embed režim

Pokud URL obsahuje parametr `embed`, aplikace skryje hlavičku, drobečkovou navigaci, vyhledávací box i editační panel a vynutí jen-pro-čtení režim. Hodí se pro vložení konkrétního detailu úložiště do iframe na jiné stránce. Klávesové zkratky jsou v embed režimu vypnuté.

---

## Typy položek

V úložišti existují čtyři typy položek; každý má vlastní ikonu:

| Typ | Ikona | Popis |
|-----|-------|-------|
| Složka | 📁 | Kontejner pro libovolné další položky; lze zanořovat libovolně hluboko |
| Soubor | 📃 | Logický soubor s verzovaným binárním obsahem; má neměnné ID použité v názvech blobů |
| Odkaz | ⛓️ | URL na externí zdroj s názvem a popisem |
| Poznámka | 📝 | Markdown text editovatelný přímo v aplikaci, není uložen jako samostatný soubor (je v `storage.json`) |

---

## Práce se složkami

### Zobrazení složky

Pohled na složku obsahuje seznam jejích položek. Složky jsou ve výpisu vždy nahoře, bez ohledu na zvolený režim řazení; ostatní položky následují uvnitř seskupení podle pravidel řazení.

U každé položky se zobrazují metadata:

- **Složka:** počet položek a datum poslední úpravy (rekurzivně přes všechen vnořený obsah)
- **Soubor:** počet verzí, datum poslední verze, velikost poslední verze
- **Odkaz:** URL a datum aktualizace
- **Poznámka:** datum úpravy a délka obsahu ve znacích

Pod metadaty se vypisuje popis (je-li) a tagy (jsou-li).

### Hledání ve složce

Textový vyhledávač nad seznamem filtruje pouze položky aktuální složky podle názvu. Filtruje se bez překreslení stránky, takže fokus zůstává v inputu.

### Řazení

| Možnost | Chování |
|---------|---------|
| A–Z | Abecedně vzestupně (česky) |
| Z–A | Abecedně sestupně |
| Naposledy upraveno | Nejnovější změna obsahu nahoře (rekurzivně pro složky) |
| Podle typu | Soubory → poznámky → odkazy, v rámci typu abecedně |

Složky jsou vždy v samostatné skupině nad ostatními a řadí se mezi sebou stejným způsobem.

### Filtr podle tagů

Pokud má úložiště definované tagy, zobrazí se nad seznamem sklápěcí sekce „Filtr podle tagů". Lze vybrat libovolný počet tagů — položka musí mít **všechny** vybrané (AND logika). Tlačítkem „Vymazat filtr" se výběr zruší.

### Akce ve složce (režim úprav)

| Tlačítko | Akce | Klávesa |
|----------|------|---------|
| + 📁 | Přidat novou podsložku | F |
| + ⛓️ | Přidat nový odkaz | L |
| + 📃 | Přidat nový soubor | N |
| + 📝 | Přidat novou poznámku | M |

Editační akce nad samotnou složkou (pokud nejsme v kořeni): **Přejmenovat / popis**, **Přesunout**, **Smazat 📁**.

---

## Práce se soubory

### Detail souboru

Záhlaví obsahuje popis (je-li), tagy, datum poslední verze, velikost, datum vytvoření a odkaz na stažení nejnovější verze.

Pod záhlavím je vždy zobrazené **ID souboru** — neměnný identifikátor použitý v názvech blobů na GitHubu.

### Vytvoření nového souboru

V dialogu „Nový soubor" se zadává:

| Pole | Popis |
|------|-------|
| ID souboru | Povinné, neměnné, jen `a-z`, `A-Z`, `0-9`, `_` a `-`; musí být v celém úložišti unikátní |
| Název | Povinné, libovolné |
| Popis | Volitelný textový popis |
| Tagy | Volitelný výběr z tagů úložiště |

### Verze souboru

Sekce „Verze" obsahuje seznam všech verzí seřazený od nejnovější. U každé verze se zobrazuje:

- Název části (je-li) a datum/čas
- Velikost
- Jméno zařízení, ze kterého byla nahrána
- Popis verze (je-li)
- U verzí čekajících na upload „⏳ čeká na upload"

Kliknutí na verzi se chová podle typu souboru:

| Typ obsahu | Kliknutí na verzi |
|------------|--------------------|
| Markdown (`.md`, `.markdown`) | Zobrazí náhled inline na stránce |
| Obrázek (`png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `bmp`, `ico`, `avif`) | Vykreslí inline |
| Audio (`mp3`, `wav`, `ogg`, `oga`, `m4a`, `flac`, `aac`, `opus`) | Přehrávač inline |
| Video (`mp4`, `webm`, `ogv`, `mov`, `m4v`) | Přehrávač inline |
| PDF | Vestavěný PDF prohlížeč (`<embed>`) |
| HTML (`html`, `htm`) | Standardně stáhne, vedle je odkaz „Zobrazit" — otevře v novém okně jako blob URL (izolovaný origin) |
| Ostatní | Stáhne soubor |

Při zobrazené verzi se v adrese (URL) objeví parametr `&v=<filename>`, takže lze odkaz sdílet — odkaz směruje přímo na konkrétní verzi.

### Nahrávání nové verze

Formulář „Nahrát novou verzi" pod seznamem verzí obsahuje:

- výběr souboru (vč. drag & drop přes celou sekci)
- výběr části (jen pokud soubor má definované části)
- popis verze (volitelně)

Tlačítkem **Nahrát verzi** se rovnou vytvoří atomický Git commit s blobem a aktualizovaným `storage.json`. Pokud soubor přesahuje 100 MB, aplikace upozorní, že GitHub může požadavek odmítnout.

Klávesa **O** otevře dialog pro výběr souboru bez nutnosti přejít kurzorem na input.

### Komentáře k souboru

Pod seznamem verzí je sekce „Komentáře" — vlastní diskusní vlákno. Komentáře se ukládají v `storage.json` v poli `file.comments` a obsahují:

- autora (jméno zařízení uvedené v Nastavení)
- text
- datum vytvoření a případně úpravy

V režimu úprav lze komentáře přidávat, upravovat a mazat. Komentáře se nikdy nezobrazují jako nahrávané soubory — vždy jen jako součást `storage.json`.

### Části souboru

V režimu úprav je v detailu souboru sekce „Části" s tlačítkem **+ Část**. Část má:

| Pole | Popis |
|------|-------|
| ID části | Povinné, jen `a-z`, `0-9`, `_`, `-`, unikátní v rámci souboru, neměnné |
| Název části | Povinný čitelný název zobrazený u verzí |

Část lze přejmenovat. Smazat ji lze, pouze pokud k ní nepatří žádná verze (jinak je nutné nejdřív verze smazat).

Část se nezobrazuje jako samostatný uzel ve stromu — vyjde v textu odkazu na verzi a v selectu „Část" při uploadu.

### Filtr verzí podle části

Pokud má soubor definované části, nad seznamem verzí se objeví výběr „Zobrazit:" s volbami **Všechny verze**, **Bez části**, nebo konkrétní část.

### Akce nad souborem (režim úprav)

**Přejmenovat / popis** (jen název, popis, tagy — ID je read-only), **Přesunout**, **Smazat 📃**.

Smazání souboru vymaže i všechny jeho verze z GitHubu (v jediném atomickém commitu).

---

## Práce s odkazy

Odkaz je jednoduchý záznam externí URL. V dialogu „Nový odkaz" se zadává **Název**, **URL**, **Popis** a **Tagy**. Detail odkazu zobrazuje URL jako klikatelný odkaz otevírající se v novém okně.

Akce: **Upravit**, **Přesunout**, **Smazat ⛓️**.

---

## Práce s poznámkami

### Co je poznámka

Poznámka je Markdown text uložený přímo v `storage.json` — nemá samostatný soubor a nemá verze. Hodí se pro krátké zápisky, popisy procesů, README struktury atd.

### Vytvoření a vlastnosti

V dialogu „Nová poznámka" se zadává **Název**, **Krátký popis** a **Tagy**. Obsah se edituje až v detailu.

### Editor obsahu

V režimu úprav je v detailu poznámky tlačítko **Upravit obsah** (klávesa **O**), které otevře textareu s aktuálním Markdownem. Tlačítkem **Uložit** se uloží do paměti a aktualizuje `modified`; změna se odešle na GitHub při ukončení režimu úprav nebo ručním pushi.

### Akce nad poznámkou

- **Kopírovat do schránky** — zkopíruje surový Markdown
- **Stáhnout jako .md** — uloží jako soubor s názvem odvozeným z názvu poznámky

V režimu úprav: **Upravit obsah**, **Přejmenovat / popis**, **Přesunout**, **Smazat 📝**.

### Podporovaný Markdown

Vestavěný parser podporuje nadpisy `# … ######`, tučné `**text**`/`__text__`, kurzívu `*text*`/`_text_`, kódové bloky se třemi backticky, inline kód v jednoduchých backticků, odkazy `[text](url)`, obrázky `![alt](src)`, citace `> …`, číslované i nečíslované seznamy, horizontální oddělovače, a jednoduché tabulky:

```markdown
| Sloupec | Sloupec |
|---------|---------|
| Buňka   | Buňka   |
```

### CriticMarkup

Parser navíc rozumí CriticMarkupu pro značení úprav v textu:

| Zápis | Význam | Vykreslení |
|-------|--------|------------|
| `{++doplněno++}` | Vložené | `<ins>` |
| `{--smazáno--}` | Smazané | `<del>` |
| `{~~staré~>nové~~}` | Nahrazené | `<del>` + `<ins>` |
| `{==zvýrazněné==}` | Zvýrazněné | `<mark>` |
| `{>>komentář<<}` | Komentář | inline poznámka |
| `{==text==}{>>poznámka<<}` | Zvýrazněné s poznámkou | `<mark>` s tooltipem |

---

## Tagy

### Definice tagů

Seznam povolených tagů se spravuje v Nastavení → **Vlastnosti úložiště** → pole **Tagy úložiště**. Tagy se píší oddělené čárkami; jsou **case-insensitive** a uvnitř se ukládají vždy malými písmeny. Při uložení se duplicity odstraní a abeceda srovná.

### Přiřazení tagů položce

V dialogu pro vytvoření i úpravu položky (složka, soubor, odkaz, poznámka) je pole **Tagy** — zaškrtávací skupina z tagů definovaných pro úložiště.

### Smazání tagu

Pokud z definice úložiště odstraníte tag, který používá alespoň jedna položka, aplikace se zeptá na potvrzení. Po potvrzení se tag automaticky odstraní ze všech položek a z aktuálního filtru ve složce.

### Filtrování podle tagů

Viz [Filtr podle tagů](#filtr-podle-tagů) v sekci o složkách. Filtr funguje s **AND** logikou — položka musí mít všechny zaškrtnuté tagy.

---

## Konfigurace a nastavení

Pro práci s úložištěm je třeba mít zapnutý **Režim úprav**. V editačním panelu pod hlavním obsahem se zobrazí sekce **Nastavení (cesta, klíč, zařízení)**.

### Pole nastavení

| Pole | Význam |
|------|--------|
| Cesta k úložišti | `owner/repo/složka` — kde GitHub repo a větev existují, samotná složka může vzniknout |
| Větev | Výchozí `main`; lze přepsat per-úložiště |
| Název zařízení | Jen lokální — zobrazuje se u verzí a komentářů jako autor |
| GitHub API klíč | Personal Access Token s právy `repo`; **globální** napříč úložišti na zařízení |

### Tlačítka

| Tlačítko | Akce |
|----------|------|
| Uložit a načíst | Uloží konfiguraci a načte `storage.json` z dané cesty |
| Vytvořit nové úložiště | Otevře dialog pro vytvoření prázdného `storage.json` |
| Push storage.json | Manuální commit aktuálního `storage.json` na GitHub |
| Stáhnout storage.json | Lokální export do `.json` souboru |

### Vlastnosti úložiště

Sklápěcí sekce v editačním panelu obsahuje:

| Pole | Popis |
|------|-------|
| ID úložiště | Neměnné, jen pro čtení; použito v názvech blobů |
| Název úložiště | Editovatelný název |
| Popis úložiště | Volný popis |
| Tagy úložiště | Seznam povolených tagů (čárkami) |
| Motiv (vzhled úložiště) | Vizuální téma — sdílené napříč zařízeními |

Změny se ukládají tlačítkem **Uložit vlastnosti**; výběr motivu se uplatní jako live náhled okamžitě, perzistuje až po uložení.

### Známá úložiště

V panelu se zobrazuje seznam dříve navštívených úložišť (lokální historie). U každého je:

- název úložiště, ID a cesta na GitHubu
- datum poslední návštěvy
- odkaz **Otevřít v novém tabu** (s předvyplněným URL parametrem `?detail=`)
- odkaz **Zapomenout** (jen lokální záznam — globální API klíč ani data na GitHubu se neměnní)

Aktuálně otevřené úložiště je v seznamu označené jako „— právě zobrazeno".

### Globální vyhledávání

Pole „Hledat napříč úložištěm" prohledává všechny položky ve všech složkách (název, popis, ID, URL). Zobrazuje až 30 výsledků s cestou, na kterou lze rovnou skočit kliknutím.

### Statistiky úložiště

Souhrnný přehled: počet složek, souborů, verzí, odkazů a celková velikost všech verzí.

---

## Vizuální motivy

Motiv je vlastnost úložiště (uložená v `storage.json`), proto ho vidí všichni uživatelé daného úložiště stejně. Výchozí je **Auto (světlý / tmavý dle systému)**.

### Skupiny motivů

| Skupina | Motivy |
|---------|--------|
| Funkční | Auto, Světlý, Tmavý, Sépiové, Vysoký kontrast (bílá/černá), Solarized Light/Dark |
| Typografie | Serif Reading |
| Hustota | Compact, Comfortable |
| Charakter | Nostalgia 90s, Terminal (zelený), Terminal (amber), Papírový blok, Spisová deska |
| Inspirace produkty | GitHub (světlý/tmavý), Notion (světlý/tmavý), macOS (světlý/tmavý), Material Design (světlý/tmavý), Swiss/Bauhaus |

Motiv se nastavuje v sekci **Vlastnosti úložiště** → **Motiv (vzhled úložiště)**.

---

## URL a sdílení

### Formát URL

Adresa stránky reflektuje aktuální stav:

```
?detail=<base64>&v=<filename>&embed
```

| Parametr | Význam |
|----------|--------|
| `detail` | Base64-URL kódovaná dvojice `repoPath|itemId` (kořen = `root`) |
| `v` | Filename konkrétní zobrazené verze souboru (volitelně) |
| `embed` | Flag aktivující embed režim (jen pro čtení, bez panelů) |

URL se průběžně mění přes `history.replaceState` při navigaci, takže lze kdykoli zkopírovat adresu z adresního řádku a sdílet ji.

### Embed režim

Připojte k URL parametr `&embed` (samotný flag, hodnota není potřeba). Aplikace skryje hlavičku, drobečkovou navigaci, editační panel, debug, status panel i vyhledávací box ve složce. Režim úprav je vypnutý — i pokus o jeho zapnutí přes klávesovou zkratku se ignoruje. Vhodné pro vložení detailu položky do iframe v jiném webu.

---

## Operace s GitHubem

### Jak probíhají

- **Načtení úložiště** — `GET` na Contents API pro `storage.json` (pro velké soubory přes Blobs API)
- **Push změn** — Git Data API (blobs + tree + commit + ref update) pro atomický commit více souborů najednou
- **Verze souboru** — vždy spárováno se `storage.json` v jednom commitu (nemůže nastat sirotčí blob ani sirotčí záznam v JSONu)
- **Smazání** — zapíše do tree položku s `sha: null` plus aktualizovaný `storage.json`

### Operační log

Sklápěcí sekce „Operace s GitHubem" pod přepínačem režimu úprav zobrazuje seznam probíhajících i ukončených operací (poslední 80). Každá položka má:

- ikonu stavu (spinner / ✓ / ✗)
- čas zahájení a popis
- u chybných červený text s chybou a tlačítko **Opakovat**
- tlačítko **✕** pro skrytí z logu

Souhrnný řádek nahoře ukazuje „X probíhá · X chyb · X hotovo".

### Hromadné akce

| Tlačítko | Akce |
|----------|------|
| Vyčistit dokončené | Odstraní úspěšné a chybné položky, ponechá běžící |
| Opakovat všechny chybné | Spustí retry funkci u všech chybných položek, které ji mají |

Při výskytu chyby se panel automaticky rozbalí; pokud ho uživatel ručně sbalí, aplikace tu volbu respektuje.

### Automatický push

Při vypnutí přepínače **Režim úprav** aplikace automaticky pushne `storage.json`, pokud jsou neuložené změny a je nastavená cesta + API klíč. Indikátor **Neuloženo** vedle přepínače signalizuje, že v paměti jsou změny nepřítomné na GitHubu.

### Pending upload

Pokud nahrávání verze selže, verze zůstane v `storage.json` v paměti označená flagem **⏳ čeká na upload**. Tento marker je čistě UI — nikdy se neserializuje a neposílá na GitHub. Operaci lze opakovat z panelu operací; verzi lze také smazat (zrušit rozdělanou akci).

---

## Klávesové zkratky

Zkratky fungují globálně, mimo pole pro vstup a otevřené dialogy. Nepoužívají modifikátory `Ctrl`/`Cmd`/`Alt`; `Shift` pouze u zkratky **B** pro skok na kořen. V embed režimu jsou všechny zkratky vypnuté.

| Klávesa | Akce | Kdy funguje |
|---------|------|-------------|
| **X** | Přepnout režim úprav | Vždy |
| **B** | O úroveň výš (do parent složky) | Mimo kořen |
| **Shift+B** | Na kořen úložiště | Mimo kořen |
| **F** | Přidat 📁 složku | Režim úprav, ve složce |
| **L** | Přidat ⛓️ odkaz | Režim úprav, ve složce |
| **N** | Přidat 📃 soubor | Režim úprav, ve složce |
| **M** | Přidat 📝 poznámku | Režim úprav, ve složce |
| **E** | Přejmenovat / popis aktuální položky | Režim úprav, mimo kořen |
| **D** | Stáhnout nejnovější verzi | V detailu souboru |
| **O** | Otevřít dialog výběru souboru pro novou verzi (resp. začít editaci poznámky) | V detailu souboru / poznámky |
| **C** | Vyčistit dokončené z operačního logu | Když je log viditelný |
| **R** | Opakovat všechny chybné z logu | Když existují chybné s retry |

Zkratky jsou registrované v **capture** fázi — mají přednost před quick-navigation NVDA/JAWS/VoiceOver. Pokud by v některém prostředí nereagovaly, lze ve čtečce přepnout do focus modu (např. v NVDA stiskem NVDA+Mezera).

---

## Migrace dat

Aplikace umí načíst starší verze lokální konfigurace:

- **v1** — jeden repo, jeden API klíč; klíč se povýší na globální (per-device)
- **v2** — více repo, každý se svým API klíčem; vybere se nejnovější jako globální, ostatní zůstávají jen jako záznam o návštěvě
- **v3** — aktuální formát s globálním API klíčem a větví, plus seznam navštívených úložišť

Migrace proběhne tichým průchodem při načtení; starší klíče v `localStorage` se po migraci odstraní. Detaily lze sledovat v debug panelu.

---

## Bezpečnost

### API klíč

GitHub Personal Access Token se ukládá pouze v `localStorage` daného prohlížeče. Nikdy se neposílá nikam jinam než na GitHub API. Při použití v iframe (například při vkládání aplikace do jiného webu) může být `localStorage` izolovaný — v takovém případě aplikace upozorní, že je nutné nejprve klíč zadat při otevření aplikace mimo iframe.

### HTML obsah

Pokud nahrajete HTML soubor jako verzi, aplikace ho **neotevírá v rámci své origin**. Místo toho ho zobrazuje přes `blob:` URL v novém okně — vlastní opaque origin bez přístupu k `storage.json`, k API klíči ani k cookies aplikace. To je úmyslné rozhodnutí: stejně se chová i GitHub (RAW URL vrací `text/plain`).

### Mazání

Aplikace u všech destruktivních akcí vyžaduje potvrzení v dialogu. U mazání složky s obsahem je vypsán plný dopad (kolik podsložek, souborů, verzí a odkazů zmizí).

---

## Technické informace

### Datový model

`storage.json` má následující strukturu:

```json
{
  "schema": "dms-storage-v1",
  "id": "...",
  "name": "...",
  "description": "...",
  "theme": "light-auto",
  "modified": "ISO-8601",
  "tags": ["alfa", "beta"],
  "rootItems": [ /* items */ ]
}
```

Položka má vždy `id`, `type` a `name`; další pole závisí na typu (`items`, `versions`, `parts`, `comments`, `content`, `url`, `tags`, `description`, `created`, `modified`).

### Pojmenování blobů verzí

Verze souboru se ukládá jako binární soubor v té samé složce s deterministickým názvem:

- Bez části: `{storageid}_{souborid}_{rok}-{měsíc}-{den}_{hodina}-{minuta}.{přípona}`
- S částí: `{storageid}_{souborid}_{castid}_{rok}-{měsíc}-{den}_{hodina}-{minuta}.{přípona}`

Všechny ID jsou sanitované — jen `a-z`, `A-Z`, `0-9`, `_`, `-` (ostatní znaky se nahradí `_`).

### Lokální úložiště (localStorage)

Klíč `dms-config-v3` (s automatickou migrací z `dms-config-v2` a `dms-config-v1`) obsahuje:

```json
{
  "apiKey": "ghp_...",
  "deviceName": "...",
  "branch": "main",
  "knownRepos": [
    { "repoPath": "owner/repo/path", "storageId": "...", "storageName": "...", "lastVisited": "ISO", "branch": "..." }
  ],
  "lastRepoPath": "owner/repo/path"
}
```

`apiKey` a `deviceName` jsou globální (per-device). Per-úložiště se ukládá jen `branch` jako override (jen pokud je jiná než globální default), `storageId`, `storageName` a `lastVisited`.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou:

- `<dialog>` element
- `crypto.randomUUID` / `Math.random` UUID
- `AudioContext` (pro zvukovou zpětnou vazbu)
- Fetch API a Git Data API GitHubu

### Před opuštěním stránky

Pokud máte neuložené změny (`unsaved`) a pokusíte se zavřít kartu, prohlížeč zobrazí potvrzovací dialog „Máte neuložené změny. Opravdu chcete odejít?".

### Verze aplikace

Aktuální `APP_VERSION` je `1.0`.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| DMS | Document Management System — systém správy dokumentů |
| Úložiště | Složka v GitHub repu se souborem `storage.json` a verzemi |
| Verze | Konkrétní nahraný obsah souboru s časovým razítkem |
| Část | Volitelná podstruktura souboru pro paralelní linie verzí |
| Pending upload | Verze v paměti, jejíž nahrání na GitHub ještě neproběhlo nebo selhalo |
| Atomický commit | Zápis více souborů (blob + storage.json) v jednom Git commitu |
| PAT | Personal Access Token — GitHub API klíč |
| Embed režim | Jen-pro-čtení režim bez UI panelů, pro vkládání do iframe |
| CriticMarkup | Syntaxe pro značení úprav v textu (`{++…++}`, `{--…--}` atd.) |
| Tag | Klíčové slovo přiřaditelné položce z definovaného seznamu úložiště |

---

*Dokumentace odpovídá stavu aplikace DMS úložiště verze 1.0 ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
