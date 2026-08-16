# DMS úložiště — Dokumentace

**Online verze nástroje:** [https://egdilna.github.io/nastroje/stor](https://egdilna.github.io/nastroje/stor)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#stor](https://egdilna.github.io/nastroje/#stor)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu (k práci s daty však potřebuje připojení ke GitHubu).

---

## Přehled funkcí

**DMS úložiště** (Document Management System) je odlehčená webová aplikace pro ukládání, verzování a sdílení dokumentů. Celé úložiště je popsané jediným souborem `storage.json` v zadané složce libovolného GitHub repozitáře; verze souborů jsou ukládané jako binární přílohy v té samé složce. Aplikace běží jen v prohlížeči — žádný server, žádná instalace, GitHub se chová jako úložná vrstva.

### Klíčové funkce

- **Uvítací obrazovka** — když aplikace ještě nemá načtené úložiště, ukáže formulář s dvěma volbami: otevřít existující úložiště na GitHubu, nebo vytvořit nové
- **Strom složek a položek** — hierarchická struktura složek, do kterých lze přidávat soubory (s verzemi), textové poznámky a externí odkazy
- **Verzování souborů** — každý nahraný soubor je nová verze, předchozí verze zůstávají dostupné s datem, autorem a popisem
- **Části souborů** — volitelná podstruktura pro paralelní linie verzí (např. různé subjekty smluv) uvnitř jednoho logického souboru; novou část lze založit i přímo při uploadu verze
- **Markdown poznámky** — editovatelné poznámky s podporou Markdownu, CriticMarkupu, tabulek, odkazů a kódu; editor otevírá velkou textareu přímo v detailu
- **Komentáře k souborům** — diskusní vlákno u každého souboru; každý komentář má vlastní identifikátor a lze ho jednotlivě upravovat i mazat
- **Tagy a filtrování** — seznam tagů na úrovni úložiště, přiřazení tagů jednotlivým položkám, filtrování složek podle tagů s AND logikou
- **Náhledy v aplikaci** — vestavěný náhled pro Markdown, obrázky (PNG, JPG, GIF, SVG, WebP, AVIF…), audio (MP3, WAV, OGG…), video (MP4, WebM…) a PDF
- **Export do ZIPu** — složku, celé úložiště i jednotlivý soubor lze stáhnout jako ZIP se statickým `index.html`, tagy, komentáři a všemi verzemi souborů (offline archiv i jednoduchý web)
- **Kopírování a stažení poznámek** — obsah poznámky lze zkopírovat do schránky nebo stáhnout jako `.md` soubor
- **Vizuální motivy** — 25+ vestavěných motivů (světlý/tmavý/auto, sépiové, vysoký kontrast, Solarized, Nostalgia 90s, Terminal, inspirace produkty atd.); motiv je vlastnost úložiště — vidí ho všichni uživatelé stejně
- **Embed režim** — možnost vložit detail položky do iframe v jiném webu, automaticky jen pro čtení
- **Sdílitelné URL** — adresa odráží aktuální cestu v úložišti i případně zobrazenou verzi; odkaz lze kopírovat z adresního řádku
- **Atomický commit** — verze souboru i aktualizovaný `storage.json` se zapisují do GitHubu jako jeden Git commit (žádný nesoulad mezi metadaty a obsahem)
- **Operační log s retry** — všechny GitHub operace jsou logované; chybné lze opakovat tlačítkem, hromadně, nebo z konkrétní položky logu

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML, ARIA atributy (`role`, `aria-live`, `aria-pressed`, `aria-expanded`, `aria-labelledby`), klávesová ovladatelnost, podpora čteček obrazovky. Klávesové zkratky jsou zaregistrovány v capture fázi tak, aby měly přednost před quick-navigation NVDA/JAWS/VoiceOver. Dialogy využívají nativní `<dialog>` element. Součástí je i „Skip to content“ odkaz na začátku stránky.

### Uložení dat

Data úložiště jsou v `storage.json` v zadané složce na GitHubu — slouží jako jediný zdroj pravdy a synchronizace mezi zařízeními a uživateli probíhá přes GitHub. Lokálně v prohlížeči (`localStorage` pod klíčem `dms-config-v3`) jsou jen údaje vázané na zařízení: GitHub API klíč, jméno zařízení a výchozí větev. **Cesta k úložišti (`repoPath`) se neukládá** — přichází vždy z URL (parametr `?detail=`) nebo ji uživatel zadá v Nastavení pro danou session. Verze souborů jsou samostatné binární soubory v té samé složce, jejich obsah se posílá rovnou na GitHub a do `localStorage` se neukládá.

---

## Hlavní koncept

### Co je „úložiště"

Úložiště je jedna složka v GitHub repozitáři, ve které se nachází:

- soubor `storage.json` popisující celou strukturu (složky, soubory, poznámky, odkazy, verze, tagy, komentáře, vlastnosti)
- jednotlivé verze souborů jako binární soubory s názvem ve tvaru `{storageid}_{souborid}_{cast}_{datum}_{cas}.{přípona}`

Cesta k úložišti se zadává ve tvaru `owner/repo/cesta/ke/složce` (podsložka je volitelná). Repozitář a větev musí existovat, ale samotná složka vzniknout může — vytvoří se automaticky při prvním uložení.

### Co je „verze"

Každý upload souboru vytvoří novou verzi. Předchozí verze zůstávají v úložišti dostupné. Verze obsahuje:

- časové razítko nahrání
- velikost a SHA hash
- jméno zařízení, ze kterého byla nahrána
- volitelný popis (changelog)
- volitelnou příslušnost k „části" souboru
- vlastní název souboru na GitHubu (deterministicky generovaný)

### Co je „část souboru"

Část je volitelná podstruktura jednoho souboru, která pomáhá organizovat verze, když k jednomu logickému souboru patří více paralelních linek (např. smlouva existuje v několika subjektových variantách). Každá verze může — nebo nemusí — patřit k některé části. Filtr verzí dovoluje zobrazit jen verze konkrétní části, „bez části" nebo všechny. Novou část lze vytvořit v sekci **Části** v detailu souboru, nebo přímo ve formuláři **Nahrát novou verzi** (checkbox „Vytvořit novou část").

### API klíč jako vlastnost zařízení

GitHub Personal Access Token je v aplikaci sdílený pro všechna úložiště otevřená v daném prohlížeči — je to vlastnost zařízení, ne úložiště. Pokud otevřete jinou URL (jiné `owner/repo/složka`) ve stejném prohlížeči, klíč se použije automaticky bez nutnosti znovu jej zadávat.

Bez API klíče funguje jen čtení veřejných repozitářů; pro zápis (upload verzí, mazání, úpravy `storage.json`) je klíč nutný.

### Více úložišť z jednoho zařízení

Aplikace si **nedrží seznam navštívených úložišť**. Cesta k úložišti není v localStorage — každé úložiště je zkrátka jiná URL (`?detail=...`). Pro víc úložišť si uživatel udržuje víc odkazů (záložky, panely, iframe). Globální API klíč a jméno zařízení jsou sdílené napříč všemi.

### Atomický commit

Pokud aplikace nahrává novou verzi nebo maže verzi/položku, zapisuje do GitHubu nový blob (nebo deklarovaný delete) **i** aktualizovaný `storage.json` jako součást jednoho Git commitu přes Git Data API. Tím je garantováno, že nenastane stav „verze v JSONu existuje, ale blob na GitHubu chybí" (a naopak).

---

## Připojení k GitHubu

### Uvítací obrazovka

Když aplikace nemá načtené žádné úložiště (první spuštění, přímé otevření URL bez `?detail=`), zobrazí uvítací formulář „Vítejte v DMS“ se dvěma sekcemi:

**Otevřít úložiště na GitHubu** — pole:

| Pole | Popis |
|------|-------|
| Cesta k repu | `owner/repo` nebo `owner/repo/podsložka` |
| Větev | Výchozí `main` |
| GitHub API klíč | Zobrazuje se jen pokud v prohlížeči ještě není uložen; jinak jen upozornění, že klíč je uložen v tomto prohlížeči |
| Název zařízení | Volitelně; zobrazuje se u nahraných verzí |

Tlačítko **Otevřít úložiště** načte `storage.json` z dané cesty.

**Nebo vytvořit nové úložiště** — s vyplněnou cestou a klíčem stiskněte tlačítko **Vytvořit nové úložiště**; aplikace se pak zeptá na **ID**, **Název** a **Popis** nového úložiště a při prvním uložení sama vytvoří i cílovou složku na GitHubu.

### GitHub Personal Access Token (PAT)

Pro zápis (upload, mazání, změny `storage.json`) je nutný PAT s právy `repo`. Klíč:

- se ukládá pouze do `localStorage` daného prohlížeče (nikam se neposílá kromě GitHub API)
- je **globální** — používá se pro všechna úložiště otevřená v tomto prohlížeči
- lze změnit v sekci **Nastavení** v panelu úprav

Pokud aplikace běží v iframe a `localStorage` je izolovaný, upozorní, že klíč je nutné nejdřív zadat při otevření mimo iframe.

### Nastavení (panel úprav)

V zapnutém režimu úprav je nahoře v editačním panelu sekce **Nastavení (cesta, klíč, zařízení)**:

| Pole | Význam |
|------|--------|
| Cesta k úložišti | `owner/repo/složka` — repo a větev musí existovat, složka může vzniknout |
| Větev | Výchozí `main`, lze přepsat |
| Název zařízení | Jen lokální — zobrazuje se u verzí a komentářů jako autor |
| GitHub API klíč | Personal Access Token s právy `repo`; **globální** napříč úložišti na zařízení |

Tlačítka:

| Tlačítko | Akce |
|----------|------|
| Uložit a načíst | Uloží konfiguraci a načte `storage.json` z dané cesty |
| Vytvořit nové úložiště | Otevře dialog pro vytvoření prázdného `storage.json` |
| Push storage.json | Manuální commit aktuálního `storage.json` na GitHub |
| Stáhnout storage.json | Lokální export do `.json` souboru |

### Migrace konfigurace ze starších verzí

Aplikace umí načíst starší verze lokální konfigurace:

- **v1** — jeden repo, jeden API klíč; klíč se povýší na globální (per-device)
- **v2** — více repo, každý se svým API klíčem; vybere se nejnovější jako globální, ostatní data se zahodí
- **v3** — aktuální formát s globálním API klíčem, jménem zařízení a větví

Starší uložené záznamy `knownRepos` a `lastRepoPath` (pokud jsou v konfiguraci) se při načtení tiše smažou. Detaily lze sledovat v debug panelu.

---

## Struktura úložiště

### Typy položek

V úložišti existují čtyři typy položek; každý má vlastní ikonu:

| Typ | Ikona | Popis |
|-----|-------|-------|
| Složka | 📁 | Kontejner pro libovolné další položky; lze zanořovat libovolně hluboko |
| Soubor | 📃 | Logický soubor s verzovaným binárním obsahem; má neměnné ID použité v názvech blobů |
| Odkaz | ⛓️ | URL na externí zdroj s názvem a popisem |
| Poznámka | 📝 | Markdown text editovatelný přímo v aplikaci, není uložen jako samostatný soubor (je v `storage.json`) |

### Rozložení stránky

**Hlavička** obsahuje:

- malý popisek nahoře s názvem úložiště (a případně jeho popisem)
- drobečkovou navigaci od kořene úložiště přes všechny mezilehlé složky až po aktuálně otevřenou položku, každý článek s ikonou typu
- velký nadpis H1 odpovídající aktuálně zobrazené položce (ikona + název)

Záložka prohlížeče (title) automaticky zobrazuje „Název položky · Název úložiště – DMS".

**Hlavní obsah** — podle typu otevřené položky se zobrazí:

- složka — toolbar (hledání, řazení, ZIP export, akce), volitelný filtr podle tagů, seznam položek
- soubor — záhlaví, ID, sekce částí (v režimu úprav), náhled aktivní verze, seznam verzí, komentáře, formulář pro nahrání nové verze
- odkaz — popis a URL
- poznámka — akce (kopírovat/stáhnout), Markdown obsah nebo editor

**Spodní editační panel** obsahuje:

- **Přepínač „Režim úprav"** — zapíná editační akce a sekci nastavení
- **Indikátor „Neuloženo"** — bliká, pokud `storage.json` v paměti není ve shodě s GitHubem
- **Sekci „Operace s GitHubem"** — sklápěcí log probíhajících, úspěšných a neúspěšných operací
- **Sekci „Debug"** — interní log pro diagnostiku, vypnutý standardně

Při zapnutém režimu úprav panel obsahuje navíc sekce **Nastavení**, **Vlastnosti úložiště**, **Globální vyhledávání** a **Statistiky úložiště**.

### Embed režim

Pokud URL obsahuje parametr `embed` (samotný flag bez hodnoty), aplikace skryje hlavičku, drobečkovou navigaci, vyhledávací box i editační panel a vynutí jen-pro-čtení režim. Hodí se pro vložení konkrétního detailu úložiště do iframe na jiné stránce. Klávesové zkratky jsou v embed režimu vypnuté.

---

## Práce s dokumenty

### Práce se složkami

Pohled na složku obsahuje seznam jejích položek. Složky jsou ve výpisu vždy nahoře, bez ohledu na zvolený režim řazení; ostatní položky následují uvnitř seskupení podle pravidel řazení.

U každé položky se zobrazují metadata:

- **Složka:** počet položek a datum poslední úpravy (rekurzivně přes všechen vnořený obsah)
- **Soubor:** počet verzí, datum poslední verze, velikost poslední verze
- **Odkaz:** URL a datum aktualizace
- **Poznámka:** datum úpravy a délka obsahu ve znacích

Pod metadaty se vypisuje popis (je-li) a tagy (jsou-li).

**Toolbar složky:**

| Prvek | Akce |
|-------|------|
| Vyhledávací pole | Filtruje položky aktuální složky podle názvu (bez rerenderu, fokus zůstává) |
| Řazení | A–Z, Z–A, Naposledy upraveno, Podle typu |
| ⬇ ZIP | Stáhne celou složku (rekurzivně) jako ZIP se statickým `index.html` |
| + 📁 / + ⛓️ / + 📃 / + 📝 | V režimu úprav — přidání složky, odkazu, souboru, poznámky |

**Řazení:**

| Možnost | Chování |
|---------|---------|
| A–Z | Abecedně vzestupně (česky) |
| Z–A | Abecedně sestupně |
| Naposledy upraveno | Nejnovější změna obsahu nahoře (rekurzivně pro složky) |
| Podle typu | Soubory → poznámky → odkazy, v rámci typu abecedně |

Složky jsou vždy v samostatné skupině nad ostatními a řadí se mezi sebou stejným způsobem.

**Filtr podle tagů** — pokud má úložiště definované tagy, zobrazí se nad seznamem sklápěcí sekce „Filtr podle tagů". Lze vybrat libovolný počet tagů — položka musí mít **všechny** vybrané (AND logika). Tlačítkem „Vymazat filtr" se výběr zruší.

**Editační akce nad samotnou složkou** (v režimu úprav, mimo kořen): **Přejmenovat / popis**, **Přesunout**, **Smazat 📁**. Smazání složky s obsahem ukáže dopad (kolik podsložek, souborů, verzí a odkazů zmizí).

### Práce se soubory

**Záhlaví detailu** zobrazuje popis, tagy, datum poslední verze, velikost, datum vytvoření, odkaz **Stáhnout nejnovější verzi** a **Stáhnout vše jako ZIP** (celý soubor včetně všech verzí a `index.html`). Pod záhlavím je vždy **ID souboru** — neměnný identifikátor použitý v názvech blobů na GitHubu.

**Vytvoření nového souboru** — v dialogu „Nový soubor":

| Pole | Popis |
|------|-------|
| ID souboru | Povinné, neměnné, jen `a-z`, `A-Z`, `0-9`, `_` a `-`; musí být v celém úložišti unikátní |
| Název | Povinné, libovolné |
| Popis | Volitelný textový popis |
| Tagy | Volitelný výběr z tagů úložiště |

**Sekce Verze** obsahuje seznam všech verzí seřazený od nejnovější. Nad seznamem je dynamický nadpis (např. „Verze (5 z 12)" při filtru). U každé verze:

- Název části (je-li) a datum/čas
- Přípona v závorce
- Velikost
- Jméno zařízení, ze kterého byla nahrána
- Popis verze (je-li)
- U verzí čekajících na upload „⏳ čeká na upload"

**Kliknutí na verzi** se chová podle typu souboru:

| Typ obsahu | Kliknutí na verzi |
|------------|--------------------|
| Markdown (`.md`, `.markdown`) | Zobrazí náhled inline na stránce |
| Obrázek (`png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `bmp`, `ico`, `avif`) | Vykreslí inline přes blob URL |
| Audio (`mp3`, `wav`, `ogg`, `oga`, `m4a`, `flac`, `aac`, `opus`) | Přehrávač `<audio controls>` inline |
| Video (`mp4`, `webm`, `ogv`, `mov`, `m4v`) | Přehrávač `<video controls>` inline |
| PDF | Vestavěný PDF prohlížeč (`<embed>`) |
| HTML (`html`, `htm`) | Kliknutí na datum stáhne; vedle je odkaz „Zobrazit" — otevře v novém okně jako blob URL (izolovaný origin) |
| Ostatní | Stáhne soubor |

Při zobrazené verzi se v adrese (URL) objeví parametr `&v=<filename>`, takže lze odkaz sdílet přímo na konkrétní verzi. Nad náhledem se zobrazí banner „Zobrazená verze: …" s odkazem „← Zpět na detail souboru" a „Stáhnout".

**Nahrávání nové verzi** — formulář pod seznamem verzí:

- výběr souboru (vč. drag & drop přes celou sekci)
- výběr části (pokud soubor má definované části); pokud filtrujete na konkrétní část, je předvyplněná
- checkbox **„Vytvořit novou část"** — rozbalí pole pro ID a název nové části, kterou se rovnou uploadem založí (dostupné i u souborů, které zatím žádné části nemají)
- popis verze (volitelně)

Tlačítkem **Nahrát verzi** se vytvoří atomický Git commit s blobem a aktualizovaným `storage.json`. Pokud soubor přesahuje 100 MB, aplikace upozorní, že GitHub může požadavek odmítnout. Klávesa **O** otevře OS dialog pro výběr souboru bez nutnosti přejít kurzorem na input.

**Komentáře k souboru** — pod seznamem verzí je sekce „Komentáře" — vlastní diskusní vlákno. Komentáře se ukládají v `storage.json` v poli `file.comments`; každý má vlastní `id`, autora (jméno zařízení), text, `created` a případné `modified`. V režimu úprav lze komentáře přidávat, upravovat a mazat jednotlivě.

**Části souboru** — v režimu úprav je v detailu souboru sekce „Části (N)" s tlačítkem **+ Část**. Část má:

| Pole | Popis |
|------|-------|
| ID části | Povinné, jen `a-z`, `0-9`, `_`, `-`, unikátní v rámci souboru, neměnné |
| Název části | Povinný čitelný název zobrazený u verzí |

Část lze přejmenovat. Smazat ji lze, pouze pokud k ní nepatří žádná verze (jinak je nutné nejdřív verze smazat).

**Filtr verzí podle části** — pokud má soubor definované části, nad seznamem verzí se objeví výběr „Zobrazit:" s volbami **Všechny verze**, **Bez části**, nebo konkrétní část.

**Akce nad souborem** (režim úprav): **Přejmenovat / popis** (jen název, popis, tagy — ID je read-only), **Přesunout**, **Smazat 📃**. Smazání souboru vymaže i všechny jeho verze z GitHubu (v jediném atomickém commitu).

### Práce s odkazy

Odkaz je jednoduchý záznam externí URL. V dialogu „Nový odkaz" se zadává **Název**, **URL**, **Popis** a **Tagy**. Detail odkazu zobrazuje URL jako klikatelný odkaz otevírající se v novém okně (`target="_blank" rel="noopener noreferrer"`).

Akce: **Upravit**, **Přesunout**, **Smazat ⛓️**.

### Práce s poznámkami

Poznámka je Markdown text uložený přímo v `storage.json` — nemá samostatný soubor a nemá verze. Hodí se pro krátké zápisky, popisy procesů, README struktury atd.

**Vytvoření** — v dialogu „Nová poznámka" se zadává **Název**, **Krátký popis** a **Tagy**. Obsah se edituje až v detailu.

**Editor obsahu** — v režimu úprav je v detailu poznámky tlačítko **Upravit obsah** (klávesa **O**), které otevře textareu (20 řádků) s aktuálním Markdownem. Tlačítkem **Uložit** se uloží do paměti a aktualizuje `modified`; změna se odešle na GitHub při ukončení režimu úprav nebo ručním pushi.

**Akce nad poznámkou:**

- **Kopírovat do schránky** — zkopíruje surový Markdown (přes Clipboard API, s fallbackem na `execCommand`)
- **Stáhnout jako .md** — uloží jako soubor s názvem odvozeným z názvu poznámky

V režimu úprav navíc: **Upravit obsah**, **Přejmenovat / popis**, **Přesunout**, **Smazat 📝**.

**Podporovaný Markdown** — vestavěný parser podporuje nadpisy `# … ######`, tučné `**text**`/`__text__`, kurzívu `*text*`/`_text_`, kódové bloky se třemi backticky, inline kód v backtiches, odkazy `[text](url)`, obrázky `![alt](src)`, citace `> …`, číslované i nečíslované seznamy, horizontální oddělovače, a jednoduché tabulky:

```markdown
| Sloupec | Sloupec |
|---------|---------|
| Buňka   | Buňka   |
```

**CriticMarkup** — parser navíc rozumí syntaxi pro značení úprav v textu:

| Zápis | Význam | Vykreslení |
|-------|--------|------------|
| `{++doplněno++}` | Vložené | `<ins>` |
| `{--smazáno--}` | Smazané | `<del>` |
| `{~~staré~>nové~~}` | Nahrazené | `<del>` + `<ins>` |
| `{==zvýrazněné==}` | Zvýrazněné | `<mark>` |
| `{>>komentář<<}` | Komentář | inline poznámka |
| `{==text==}{>>poznámka<<}` | Zvýrazněné s poznámkou | `<mark>` s tooltipem |

### Tagy

Seznam povolených tagů se spravuje v Nastavení → **Vlastnosti úložiště** → pole **Tagy úložiště**. Tagy se píší oddělené čárkami; jsou **case-insensitive** a uvnitř se ukládají vždy malými písmeny. Při uložení se duplicity odstraní a abeceda srovná.

V dialogu pro vytvoření i úpravu každé položky (složka, soubor, odkaz, poznámka) je pole **Tagy** — zaškrtávací skupina z tagů definovaných pro úložiště.

Pokud z definice úložiště odstraníte tag, který používá alespoň jedna položka, aplikace se zeptá na potvrzení (s výpisem kolik položek každý tag používá). Po potvrzení se tag automaticky odstraní ze všech položek a z aktuálního filtru ve složce.

### Přesun položek

Pomocí tlačítka **Přesunout** se otevře dialog s stromovou nabídkou složek. U složek se ukazuje jejich vlastní podstrom; cíl, který by způsobil cyklus (přesun složky do sebe nebo do svého potomka), je označen „(nelze)" a nelze ho vybrat. Přesun je čistě lokální — data se pushují na GitHub až při ukončení režimu úprav.

### Export do ZIPu

Export ZIPu je dostupný pro:

- **Celou složku** (i kořen = celé úložiště) — tlačítko **⬇ ZIP** v toolbaru
- **Jednotlivý soubor** — odkaz **Stáhnout vše jako ZIP** v záhlaví detailu

Vygenerovaný ZIP obsahuje adresářovou strukturu se statickým `index.html` v každé složce (obsahuje seznam obsahu, tagy, popisy), verze souborů v podadresáři `verze/`, a u poznámek i `.md` soubor. Před velkým exportem (nad 100 MB) aplikace upozorní na trvání a paměťové nároky; nad 500 MB varuje, že prohlížeč nemusí zvládnout.

JSZip knihovna se stahuje z CDN (`cdnjs.cloudflare.com`) až při první potřebě — offline běh aplikace se tím nezpomaluje, ale export bez internetu nefunguje.

---

## Verze

### Model verzí souboru

Každý upload souboru vytvoří novou verzi:

```json
{
  "timestamp": "2026-04-25T16:23:14.000Z",
  "description": "Doplněná preambule",
  "size": 15342,
  "device": "MacBook Mirek",
  "filename": "myrepo_smlouva_novak_2026-04-25_16-23.pdf",
  "sha": "abc123...",
  "partId": "novak"
}
```

Pole `partId` je volitelné (chybí u verzí bez části). Pole `pendingUpload: true` je čistě UI marker pro verze, které ještě nejsou na GitHubu — nikdy se neserializuje.

### Pojmenování blobů verzí

Verze souboru se ukládá jako binární soubor v té samé složce s deterministickým názvem:

- Bez části: `{storageid}_{souborid}_{rok}-{měsíc}-{den}_{hodina}-{minuta}.{přípona}`
- S částí: `{storageid}_{souborid}_{castid}_{rok}-{měsíc}-{den}_{hodina}-{minuta}.{přípona}`

Všechna ID jsou sanitovaná — jen `a-z`, `A-Z`, `0-9`, `_`, `-` (ostatní znaky se nahradí `_`).

### Pending upload

Pokud nahrávání verze selže, verze zůstane v `storage.json` v paměti označená flagem **⏳ čeká na upload**. Tento marker je čistě UI — nikdy se neserializuje a neposílá na GitHub. Operaci lze opakovat z panelu operací; verzi lze také smazat (zrušit rozdělanou akci).

Po úspěšném načtení z GitHubu aplikace defenzivně čistí případné zbylé `pendingUpload` flagy z verzí, které ve skutečnosti na GitHubu existují (atomický commit blob+JSON zaručuje, že verze v načteném JSONu má i blob).

### Editace popisu verze

V režimu úprav u každé nahrané verze je tlačítko **Upravit popis**, které rozbalí inline formulář s textareou. Změna se uloží do paměti a odešle na GitHub při ukončení režimu úprav nebo ručním pushi.

### Smazání verze

**Smazat verzi** vymaže verzi ze `storage.json` **i** blob z GitHubu (v jediném atomickém commitu). U pending verzí (které na GitHubu ještě nejsou) smazání jen zruší lokální záznam.

---

## Metadata

### Vlastnosti úložiště

Sklápěcí sekce **Vlastnosti úložiště** v panelu úprav obsahuje:

| Pole | Popis |
|------|-------|
| ID úložiště | Neměnné, jen pro čtení; použito v názvech blobů |
| Název úložiště | Editovatelný název |
| Popis úložiště | Volný popis |
| Tagy úložiště | Seznam povolených tagů (oddělené čárkami) |
| Motiv (vzhled úložiště) | Vizuální téma — sdílené napříč zařízeními |

Změny se ukládají tlačítkem **Uložit vlastnosti**; výběr motivu se uplatní jako live náhled okamžitě, perzistuje až po uložení.

### Vizuální motivy

Motiv je vlastnost úložiště (uložená v `storage.json` v poli `theme`), proto ho vidí všichni uživatelé daného úložiště stejně. Výchozí je **Auto (světlý / tmavý dle systému)**.

| Skupina | Motivy |
|---------|--------|
| Funkční | Auto, Světlý, Tmavý, Sépiové, Vysoký kontrast (bílá/černá), Solarized Light/Dark |
| Typografie | Serif Reading |
| Hustota | Compact, Comfortable |
| Charakter | Nostalgia 90s, Terminal (zelený), Terminal (amber), Papírový blok, Spisová deska |
| Inspirace produkty | GitHub (světlý/tmavý), Notion (světlý/tmavý), macOS (světlý/tmavý), Material Design (světlý/tmavý), Swiss/Bauhaus |

### Globální vyhledávání

Sklápěcí sekce **Globální vyhledávání** v panelu úprav — pole „Hledat napříč úložištěm" prohledává všechny položky ve všech složkách (název, popis, ID, URL). Zobrazuje až 30 výsledků s cestou, na kterou lze rovnou skočit kliknutím.

### Statistiky úložiště

Sklápěcí sekce **Statistiky úložiště** v panelu úprav — souhrnný přehled: počet složek, souborů, verzí a odkazů; celková velikost všech verzí.

### URL a sdílení

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

### Operace s GitHubem

Sklápěcí sekce „Operace s GitHubem" pod přepínačem režimu úprav zobrazuje seznam probíhajících i ukončených operací (posledních 80). Každá položka má:

- ikonu stavu (spinner / ✓ / ✗)
- čas zahájení a popis
- u chybných červený text s chybou a tlačítko **Opakovat**
- tlačítko **✕** pro skrytí z logu

Souhrnný řádek nahoře ukazuje „X probíhá · X chyb · X hotovo".

**Hromadné akce:**

| Tlačítko | Akce |
|----------|------|
| Vyčistit dokončené | Odstraní úspěšné a chybné položky, ponechá běžící |
| Opakovat všechny chybné | Spustí retry funkci u všech chybných položek, které ji mají |

Při výskytu chyby se panel automaticky rozbalí; pokud ho uživatel ručně sbalí, aplikace tu volbu respektuje.

**Automatický push** — při vypnutí přepínače **Režim úprav** aplikace automaticky pushne `storage.json`, pokud jsou neuložené změny a je nastavená cesta + API klíč. Indikátor **Neuloženo** vedle přepínače signalizuje, že v paměti jsou změny nepřítomné na GitHubu.

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

## Technické info

### Verze aplikace

Aktuální `APP_VERSION` je **`1.0`**. Schéma úložiště je `dms-storage-v1`.

### Datový model `storage.json`

```json
{
  "schema": "dms-storage-v1",
  "id": "myrepo",
  "name": "Moje úložiště",
  "description": "…",
  "theme": "light-auto",
  "modified": "2026-04-25T16:23:14.000Z",
  "tags": ["alfa", "beta"],
  "rootItems": [ /* items */ ]
}
```

Položka má vždy `id`, `type` a `name`; další pole závisí na typu (`items`, `versions`, `parts`, `comments`, `content`, `url`, `tags`, `description`, `created`, `modified`). Komentář: `{ id, author, text, created, modified? }`. Část: `{ id, name }`.

### Lokální úložiště (`localStorage`)

Klíč `dms-config-v3` s obsahem:

```json
{
  "apiKey": "ghp_…",
  "deviceName": "…",
  "branch": "main"
}
```

Všechna tři pole jsou **globální per-device**. Cesta k úložišti (`repoPath`) **není v localStorage** — přichází výhradně z URL parametru `?detail=` nebo se zadává ručně v Nastavení pro danou session.

Automatická migrace ze starších klíčů `dms-config-v1` a `dms-config-v2` proběhne tichým průchodem při načtení; starší klíče se po migraci odstraní. Zbytky `knownRepos` a `lastRepoPath` (kdyby uvízly v konfiguraci) se také mažou.

### GitHub API

- **Načtení úložiště** — `GET` na Contents API pro `storage.json` (pro velké soubory přes Blobs API)
- **Push změn** — Git Data API (blobs + tree + commit + ref update) pro atomický commit více souborů najednou
- **Verze souboru** — vždy spárováno se `storage.json` v jednom commitu
- **Smazání** — zapíše do tree položku s `sha: null` plus aktualizovaný `storage.json`
- **Autorizace** — hlavička `Authorization: Bearer <PAT>` (jen pokud je klíč nastaven)
- **API verze** — `X-GitHub-Api-Version: 2022-11-28`

### Bezpečnost

**API klíč** — GitHub Personal Access Token se ukládá pouze v `localStorage` daného prohlížeče. Nikdy se neposílá nikam jinam než na GitHub API. V iframe je `localStorage` často izolovaný — aplikace v tom případě upozorní.

**HTML obsah** — pokud nahrajete HTML soubor jako verzi, aplikace ho **neotevírá v rámci své origin**. Místo toho ho zobrazuje přes `blob:` URL v novém okně (vlastní opaque origin bez přístupu k `storage.json`, k API klíči ani k cookies aplikace). Stejně se chová i GitHub RAW.

**Mazání** — všechny destruktivní akce vyžadují potvrzení v dialogu. U mazání složky s obsahem je vypsán plný dopad (kolik podsložek, souborů, verzí a odkazů zmizí).

**Před opuštěním stránky** — pokud máte neuložené změny a pokusíte se zavřít kartu, prohlížeč zobrazí potvrzovací dialog „Máte neuložené změny. Opravdu chcete odejít?".

### Zvuková zpětná vazba

Aplikace používá `AudioContext` pro krátké tóny (píp) při úspěšné/chybné operaci a při kliknutí. Zvuk je pokusný — pokud prohlížeč AudioContext neuvolní, tiše se přeskočí.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou:

- `<dialog>` element
- `crypto.randomUUID` (fallback na `Math.random` + timestamp)
- `AudioContext` (pro zvukovou zpětnou vazbu)
- Fetch API a Git Data API GitHubu
- `URL.createObjectURL` (blob URL pro náhledy a downloady)

### Externí závislosti

- **GitHub API** — vždy (bez toho aplikace nemá data)
- **JSZip 3.10.1** — z `cdnjs.cloudflare.com`, načítá se až při první potřebě (jen pro export do ZIPu)

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

*Dokumentace odpovídá stavu aplikace DMS úložiště verze 1.0 (schéma `dms-storage-v1`). Nástroj je vyvíjen v rámci iniciativy eGdílna.*
