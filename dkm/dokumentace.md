# DKM — Dynamický správce znalostí

**Online verze nástroje:** [https://egdilna.github.io/nastroje/dkm](https://egdilna.github.io/nastroje/dkm)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#dkm](https://egdilna.github.io/nastroje/#dkm)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**DKM (Dynamický správce znalostí)** je univerzální nástroj pro evidenci propojených dat bez pevné databáze. Místo toho, abyste přijali předem daný datový model, **navrhnete si v něm vlastní typy entit, aspekty a typy vazeb** a teprve potom je naplňujete. Aplikace funguje v jediném HTML souboru — žádný server, žádná instalace, data se ukládají v prohlížeči (localStorage). Volitelně lze synchronizovat projekty s GitHubem.

### Klíčové funkce

- **Vlastní typy entit** — definujete si, co budete evidovat (Projekt, Úkol, Osoba, Dokument…) a jaké atributy má každý typ
- **Aspekty** — doplňkové sady atributů, které lze přiřadit k jakékoliv entitě navíc k jejímu typu (např. Schválení, Termín, GDPR)
- **Vlastní atributy** — v detailu entity lze přidat libovolný atribut jen pro tuto jednu entitu
- **Typované vazby** — propojení entit pojmenovanými vztahy (univerzální nebo omezené na konkrétní typy), s volitelným opačným názvem pro backlinks
- **Inbox** — volné úložiště pro nezatříděné nápady a poznámky bez typu, později snadno přidělíte typ a přesunete do hlavních dat
- **Strukturální pohled (outline)** — interaktivní stromový průchod vazbami a backlinks z dané entity, s detekcí cyklů
- **Hromadné operace** — výběr více entit a najednou změnit typ, přidat/odebrat aspekt, nastavit atribut, přidat vazbu, archivovat nebo smazat
- **Archiv** — skrytí entit z běžných pohledů s možností pozdějšího obnovení
- **Více projektů** — v jednom prohlížeči lze držet více oddělených projektů, mezi kterými se přepíná nebo je otevírat v paralelních záložkách
- **Import TSV/CSV** — hromadný import entit z tabulky (Excel → uložit jako TSV/CSV nebo vložit ze schránky)
- **Export XLSX** — uložení aktuálně zobrazeného seznamu jako tabulky pro Excel
- **GitHub synchronizace** — načítání a ukládání projektu přímo do GitHub repozitáře (i privátního) přes API, sdílecí URL pro spolupracovníky
- **Statický prohlížeč** — vygenerování samostatného HTML souboru s vloženými daty pro distribuci (read-only)
- **Markdown + CriticMarkup** — víceřádková textová pole podporují Markdown a značkování změn (`{++přidání++}`, `{--smazání--}`, `{==zvýraznění==}`, `{>>komentář<<}`, `{~~staré~>nové~~}`)
- **Dvojjazyčné rozhraní** — přepínání čeština ↔ angličtina

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML prvky, ARIA atributy a `role` u všech interaktivních prvků, `aria-live` pro hlášení změn, plná ovladatelnost klávesnicí, kompatibilita se čtečkami obrazovky a podpora tmavého režimu dle systémového nastavení.

### Uložení dat

Data jsou uložena v `localStorage` prohlížeče po jednotlivých projektech (klíče `dkm-projects-v1`, `dkm-pdata-{id}`). Při zapnutém automatickém ukládání se každá změna okamžitě promítá do prohlížeče. Projekt lze exportovat jako soubor `.dkmdata` (JSON), případně ukládat do GitHubu. Data se nikam neodesílají bez vědomí uživatele.

---

## Navigace a rozložení

Aplikace má tři hlavní oblasti:

### Záhlaví

Záhlaví je „lepkavé" (sticky) a obsahuje:

- 🧩 **Název projektu** a podtitul
- Indikátor ● **Neuložené změny** (zobrazí se při změně dat)
- **Načíst** — otevře dialog pro výběr `.dkmdata` souboru
- **Uložit** — chytré uložení: pokud je nakonfigurován GitHub, ukládá tam, jinak stahuje soubor (klávesa S, Ctrl+S)
- **Export** — export aktuálně zobrazeného seznamu do XLSX (Excel)
- **Import TSV** — otevře dialog pro hromadný import z tabulky
- **Nastavení** — otevře sekci nastavení
- **EN / CS** — přepínač jazyka rozhraní

### Záložky

Pod záhlavím je řada záložek, které odpovídají kontextu vašich dat:

- **📥 Inbox** — nezatříděné položky bez typu
- **Záložky podle typu entit** — pro každý typ, který si v nastavení označíte jako viditelný v záložkách
- **Záložky podle aspektů** — pro každý aspekt, který si označíte jako viditelný v záložkách
- **Vše** — kompletní seznam všech entit
- **📦 Archiv** — zobrazí se pouze pokud máte alespoň jednu archivovanou entitu

U každé záložky je v kroužku počet položek.

### Hlavní obsah

Pod záložkami se zobrazuje aktuální pohled — seznam entit, detail jedné entity, formulář pro novou nebo upravovanou entitu, nebo sekce nastavení. Maximální šířka obsahu je 1100 pixelů.

---

## Inbox a rychlé přidávání

Záložka **📥 Inbox** je výchozí místo pro zachycení nápadů. Nahoře je formulář:

- **Krátký název nápadu** (povinný, Enter přesune do těla)
- **Volitelný obsah / poznámka** (Markdown + CriticMarkup)
- Tlačítko **Přidat do Inboxu** nebo `Ctrl+Enter`

Entita v Inboxu nemá typ — je to čistě poznámka. Později ji můžete otevřít a v detailu kliknout na **Přidělit typ**, čímž ji proměníte v plnohodnotnou entitu zvoleného typu (text poznámky se zachová jako vlastní atribut).

Klávesa **Q** vás odkudkoliv přenese na Inbox a aktivuje pole pro rychlý zápis.

---

## Seznam entit a filtry

Každá záložka kromě nastavení zobrazuje seznam entit jako karty s názvem, štítky typu/aspektů, krátkým úryvkem textu a informací o poslední úpravě a počtu vazeb.

Nad seznamem je panel nástrojů:

| Prvek | Funkce |
|-------|--------|
| Hledat… | Fulltextové hledání v názvu, úryvku a atributech (klávesa F nebo /) |
| Řadit podle | Nejnovější, Nejstarší, Naposledy upraveno, Název A→Z, Název Z→A |
| Filtr typu | Pouze na záložce „Vše" — filtruje seznam dle typu entity |
| Filtr aspektu | Filtruje seznam dle přiřazeného aspektu |
| Filtr upraveno | Cokoliv / Dnes / Posledních 7 dní / Posledních 30 dní / Starší než měsíc |
| ＋ Nová entita | Vytvoří entitu daného typu (nebo otevře výběr typu na záložce „Vše") |
| ☑ Výběr | Zapne režim hromadných akcí (klávesa V) |

Kliknutím na kartu se otevře detail entity. V režimu výběru se místo otevření přepíná zaškrtávátko.

---

## Detail entity

Detail entity obsahuje:

### Hlavička

- Tlačítko **← Zpět**
- Titulek (název + typ v závorce)
- Akce: **Upravit** (klávesa E), **⎘ Duplikovat**, **📦 Archivovat** / **♻ Obnovit**, **Vrátit do Inboxu** / **Vyjmout z Inboxu**, **Přidělit typ** (jen u entit v Inboxu), **Smazat**

### Štítky

Pod hlavičkou jsou barevné odznaky pro typ, případné stavy (Archiv, Inbox) a všechny přiřazené aspekty.

### Atributy

Seznam všech atributů entity rozdělený do skupin:

- **Z typu {název typu}** — atributy podle definice typu
- **Z aspektu {název aspektu}** — atributy z každého přiřazeného aspektu
- **Pouze pro tuto entitu** — vlastní atributy přidané v této entitě

U každého atributu se zobrazuje název (s hvězdičkou, pokud je povinný) a hodnota. Prázdné atributy se zobrazují kurzívou jako **Nevyplněno**. Víceřádkový text se renderuje jako Markdown.

### Vazby

Vazby vycházející z této entity, seskupené dle typu vazby. Tlačítko **＋ Přidat vazbu** (klávesa R) otevře dialog pro výběr typu vazby a cílové entity (nebo umožní rovnou vytvořit novou).

### Odkazuje sem (backlinks)

Vazby směřující na tuto entitu z jiných entit. Pokud má typ vazby definován opačný název, použije se zde.

### 🌳 Strukturální pohled (outline)

Interaktivní stromový průchod vazbami a backlinks dané entity. U každého uzlu je kliknutelný trojúhelník pro rozbalení potomků. Cykly se vykreslují jednou s ikonou ↻ a poznámkou „už zobrazeno výše". Vedle uzlu je počet odchozích a příchozích vazeb ve tvaru `[N→ M←]`.

### Metadata

ID entity, datum vytvoření a datum poslední úpravy.

---

## Editace a vytváření entit

Formulář pro novou nebo upravovanou entitu obsahuje:

- **Název** (vždy první)
- Volbu typu (u nové entity na záložce „Vše")
- Pole pro každý atribut z typu a všech přiřazených aspektů
- Sekci **Pouze pro tuto entitu** pro vlastní atributy
- Tlačítka **Přidat aspekt** / **Odebrat aspekt** pro přiřazení aspektů
- Tlačítko **＋ Přidat vlastní atribut** pro libovolný atribut jen pro tuto entitu
- Sekci vazeb s tlačítkem **＋ Přidat vazbu**

Změny se ukládají buď tlačítkem **Uložit**, klávesou U nebo Alt+U. Klávesa Esc vrátí zpět bez uložení (s potvrzením, pokud byly změny).

### Typy atributů

| Typ | Použití |
|-----|---------|
| Text (jeden řádek) | Krátký text, jeden řádek |
| Text (víceřádkový) | Markdown + CriticMarkup, renderuje se s formátováním |
| Datum | Standardní datumový picker |
| URL | Webová adresa, v detailu jako odkaz |
| Výběr ze seznamu | Hodnota z předem definovaného číselníku |
| Ano/Ne | Logická hodnota (zaškrtávátko) |
| Relace na entitu | Odkaz na jednu nebo více jiných entit (zužitelné na cílový typ) |
| Číslo | Numerická hodnota |

Každý atribut může být označen jako **povinný** (zobrazuje se s hvězdičkou). U typu „Relace na entitu" lze povolit volbu **Více hodnot**.

---

## Vazby mezi entitami

### Přidání vazby

V detailu nebo formuláři entity klikněte na **＋ Přidat vazbu** (nebo stiskněte R). V dialogu vyberete:

1. **Typ vazby** — z předem definovaných typů; nabídka se zužuje podle aplikovatelnosti na zdrojový a cílový typ
2. **Cílovou entitu** — s filtry podle typu a textu, případně rovnou tlačítkem **Vytvořit nového/novou: {typ}**

Pokud výběr cílů zůstane prázdný, zobrazí se podrobná diagnostika (kolik je entit daného typu, kolik je vyloučeno jako zdrojová, kolik je v Inboxu bez typu, kolik je archivováno, kolik nesplnilo textový filtr).

### Rozsahy typů vazeb

V nastavení lze pro každý typ vazby zvolit:

| Rozsah | Význam |
|--------|--------|
| Univerzální | Mezi jakýmikoliv typy |
| Pouze od typu | Lze vytvořit pouze od zvolených typů |
| Pouze na typ | Lze vytvořit pouze na zvolené typy |
| Specifický | Omezení na obou stranách (od typu na typ) |

Volitelný **opačný název** se používá v sekci „Odkazuje sem" a v outline pohledu pro směr proti vazbě (např. vazba „je součástí" může mít opačný název „obsahuje").

---

## Hromadné akce

Klávesou **V** nebo tlačítkem **☑ Výběr** zapnete režim hromadných akcí. Na kartách se objeví zaškrtávátka a nad seznamem se zobrazí lišta s počtem vybraných položek, tlačítky **Vybrat vše viditelné**, **Odznačit vše** a výběrem akce.

| Akce | Co dělá |
|------|---------|
| Změnit typ | Změní typ vybraných entit; hodnoty atributů se stejným názvem a typem se zachovají |
| Přidat aspekt | Přidá aspekt entitám, které jej ještě nemají |
| Odebrat aspekt | Odebere aspekt z entit, které jej mají (vyčistí i hodnoty jeho atributů) |
| Nastavit atribut | Nastaví hodnotu atributu u entit, které ten atribut mají (z typu nebo aspektu) |
| Vyprázdnit atribut | Vymaže hodnotu atributu u vybraných entit |
| Přidat vazbu | Přidá vazbu od každé vybrané entity na zvolenou cílovou entitu |
| Vrátit do Inboxu / Vyjmout z Inboxu | Přesune entity do/z Inboxu |
| Archivovat / Obnovit | Hromadné přesuny do/z archivu |
| Smazat | Trvale smaže (s potvrzením) |

Po dokončení se zobrazí toast s počtem zpracovaných a přeskočených entit a režim výběru zůstává aktivní.

---

## Nastavení

Nastavení má v levém sloupci navigaci s těmito sekcemi:

### Projekt

- **Název projektu** — zobrazí se v hlavičce, v titulku okna a uloží se do souboru
- **Popis projektu** — volný text (zobrazí se jako podtitul)
- **Aktivní projekt** se zobrazí se značkou ✓
- **Všechny projekty** — seznam projektů uložených v prohlížeči s tlačítky **Přepnout**, **V nové záložce** a **×** (smazat)
- **＋ Nový projekt** — vytvoří prázdný projekt
- **Statický prohlížeč** — tlačítko **⬇ Stáhnout HTML prohlížeč** vygeneruje jediný HTML soubor s vloženými daty, který funguje samostatně bez čehokoli dalšího (pouze pro čtení)

### Typy entit

Seznam definovaných typů s počtem atributů a entit. Tlačítky lze:

- **Upravit** — otevře editor jednoho typu (ikona, název, atributy)
- **↑ ↓** — změnit pořadí
- **×** — smazat typ (entity zůstanou, jen ztratí přiřazení typu)
- **＋ Přidat typ entity**

V editaci typu definujete jeho **ikonu** (emoji), **název** a seznam **atributů** (každý s názvem, typem, případně cílovým typem pro relace nebo seznamem hodnot pro výběr).

### Aspekty

Stejná struktura jako u typů. Aspekt je doplňková sada atributů, kterou lze nezávisle přiřadit jakékoliv entitě navíc k jejímu typu. Smazání aspektu jej odebere ze všech entit a hodnoty atributů aspektu se ztratí.

### Typy vazeb

Pro každý typ vazby definujete:

- **Název** (např. „je součástí")
- **Opačný název** (volitelný, např. „obsahuje")
- **Rozsah** (univerzální / od typu / na typ / specifický)
- Seznam **od typu** / **na typ** dle rozsahu

### Seznamy

Číselníky pro atributy typu „výběr ze seznamu". Každý seznam má **název** a textareu **Hodnoty (každá na jednom řádku)**.

### Záložky

Zaškrtávátka pro každý typ entity a každý aspekt — zda se má objevit jako vlastní záložka v hlavním rozhraní.

### GitHub

| Pole | Popis |
|------|-------|
| Personal Access Token | Token s oprávněním Contents → Read and write; ukládá se pouze v tomto prohlížeči (localStorage), nikdy do datového souboru |
| Cesta k souboru | Formát: `owner/repo/cesta/soubor.dkmdata` |
| ⬇ Načíst z GitHubu | Načte projekt z GitHubu |
| ⬆ Uložit na GitHub | Commit aktuálního stavu (commit message „Update from DKM") |
| Sdílecí URL | URL, které kdokoli může otevřít a získat projekt z GitHubu (privátní repozitář vyžaduje vlastní token příjemce) |

Sekce má vlastní indikátor stavu: ✓ Připraveno / Nepřipojeno (s důvodem).

### Obecné

- **Jazyk / Language** — čeština nebo angličtina
- **Automaticky ukládat do prohlížeče** — pokud je vypnuto, prohlížeč při odchodu se zápisem upozorní
- **Zobrazit debug panel** — plovoucí panel s logem (vpravo dole)
- **Nový (prázdný) projekt** — resetuje aktuální projekt na prázdný (s potvrzením)
- **Vymazat všechna data** — smaže aktuální projekt v prohlížeči (nevratné, s potvrzením)

### Statistiky

Karty s počty: Entit celkem, V Inboxu, Archiv, Typů, Aspektů, Typů vazeb, Vazeb. Pod nimi tabulka „Typy entit" s počtem entit u každého typu.

### Nápověda

Stručný úvod, popis konceptů (typy, aspekty, vlastní atributy, vazby, Inbox, Markdown + CriticMarkup, klávesy, TSV export).

---

## Import dat z tabulky (TSV / CSV)

Tlačítko **Import TSV** v záhlaví otevře dialog s těmito možnostmi:

1. **Vybrat soubor** (TSV, CSV, středníkový formát — oddělovač se detekuje automaticky)
2. nebo **Vložit ze schránky** — vlepit řádky z Excelu nebo libovolnou tabulku
3. Kliknout na **Naimportovat**

**Požadavky na tabulku:**

- První řádek = hlavička sloupců
- Povinný sloupec **Název** (nebo „Name" / „Title" / „Jméno")
- Volitelný sloupec **Typ** — namapuje typ entity podle jeho jména
- Ostatní sloupce, jejichž název odpovídá atributu typu nebo aspektu (lze i ve formátu „Typ / Atribut"), se naimportují; neznámé sloupce se ignorují

Po importu se zobrazí výsledek: kolik bylo přidáno, aktualizováno a přeskočeno.

---

## Export do XLSX

Tlačítko **Export** v záhlaví uloží aktuálně zobrazený seznam jako Excel soubor (XLSX). Sloupce odpovídají atributům typu (případně atributům z aspektů), víceřádkový text se zalomí, vazby a relace se vypíší jako čitelné texty.

---

## Klávesové zkratky

Globální zkratky fungují odkudkoli (i z textových polí pro Ctrl+S a Ctrl+K). Písmenné zkratky fungují pouze pokud nepíšete v textovém poli a není otevřený dialog.

| Klávesa | Akce |
|---------|------|
| `S` nebo `Ctrl+S` (`Cmd+S`) | Uložit (na GitHub pokud je nakonfigurován, jinak stáhnout soubor) |
| `I` | Přejít na Inbox |
| `Q` | Rychlé přidání do Inboxu (zaměří pole pro nový nápad) |
| `N` | Nová entita (otevře výběr typu) |
| `A` | Přejít na záložku Vše |
| `E` | Upravit (v detailu entity) |
| `R` | Přidat vazbu (v detailu entity) |
| `U` nebo `Alt+U` | Uložit změny (při úpravách) |
| `V` | Zapnout/vypnout režim hromadného výběru |
| `F` nebo `/` nebo `Ctrl+K` | Hledat (zaměří vyhledávací pole) |
| `Esc` | Zavřít dialog / opustit detail nebo editaci |
| `L` | Načíst soubor (přístupová klávesa tlačítka Načíst) |

V poli rychlého přidání do Inboxu:

| Klávesa | Akce |
|---------|------|
| `Enter` (v poli názvu) | Přejít na pole těla |
| `Ctrl+Enter` | Odeslat (přidat do Inboxu) |

---

## Markdown a CriticMarkup

Víceřádková textová pole (typ atributu „Text víceřádkový") podporují:

**Markdown:**

- Nadpisy `# … ####`, odrážky `- `, číslované seznamy, vodorovná čára `---`, citace `> `
- **`**tučné**`**, `*kurzíva*`, `` `inline kód` ``
- Bloky kódu ohraničené ` ``` `
- Odkazy `[text](https://…)`

**CriticMarkup:**

| Zápis | Význam |
|-------|--------|
| `{++přidání++}` | Přidaný text (zelené pozadí) |
| `{--smazání--}` | Smazaný text (přeškrtnutý, červené pozadí) |
| `{==zvýraznění==}` | Zvýrazněný text (žluté pozadí) |
| `{>>komentář<<}` | Komentář (žlutě, kurzíva) |
| `{~~staré~>nové~~}` | Nahrazení (smazané + přidané) |

---

## Více projektů

V jednom prohlížeči lze držet libovolný počet projektů současně. Přepínání mezi nimi je v **Nastavení → Projekt → Všechny projekty**. Každý projekt má vlastní data v `localStorage` pod klíčem `dkm-pdata-{id}`.

- **Přepnout** — přepne aktivní projekt (s varováním, pokud jsou neuložené změny)
- **V nové záložce** — otevře projekt v nové záložce prohlížeče (URL `?p={id}`), takže můžete pracovat s více projekty paralelně
- **×** — smaže projekt v tomto prohlížeči (nejde smazat poslední; data zůstanou v souborech, které jste si dříve stáhli)
- **＋ Nový projekt** — vytvoří prázdný projekt s volitelným názvem

---

## Statický prohlížeč

V **Nastavení → Projekt** tlačítko **⬇ Stáhnout HTML prohlížeč** vygeneruje jediný HTML soubor s vloženými daty projektu. Tento soubor:

- Funguje **samostatně** — kdokoli ho otevře v prohlížeči vidí všechna data
- Je **pouze pro čtení** — žádná editace, žádný GitHub, žádné nastavení
- Hodí se pro distribuci výsledků projektu kolegům nebo veřejnosti

---

## Archiv

V detailu entity tlačítko **📦 Archivovat** entitu skryje z běžných pohledů, výběrů i hledání. Záložka **📦 Archiv** se objeví v hlavičce pouze pokud máte alespoň jednu archivovanou entitu. Z této záložky lze entity tlačítkem **♻ Obnovit** vrátit zpět.

Archivované entity se nezobrazují ve výběrech vazeb ani v seznamech atributů typu „relace".

---

## Datový soubor

Soubor projektu má příponu `.dkmdata` a uvnitř obsahuje JSON s touto strukturou:

| Klíč | Obsah |
|------|-------|
| `version` | Verze schématu |
| `projectName`, `projectDescription` | Metadata projektu |
| `ghPath` | Cesta k souboru v GitHubu (volitelně) |
| `settings.visibleTypeTabs`, `visibleAspectTabs` | Které typy/aspekty se zobrazují jako záložky |
| `entityTypes` | Definice typů entit (id, název, ikona, atributy) |
| `aspects` | Definice aspektů (id, název, atributy) |
| `relationTypes` | Definice typů vazeb (id, název, opačný název, rozsah, od/na typy) |
| `selectLists` | Číselníky pro atributy typu „výběr" |
| `entities` | Vlastní data — všechny entity včetně atributů, vazeb, archivace a Inbox stavu |

Soubor je čistý JSON, lze ho verzovat v gitu, zobrazit v textovém editoru a v případě potřeby upravit ručně.

---

## Technické informace

### Uložení dat v prohlížeči

Aplikace používá `localStorage` s těmito klíči:

| Klíč | Obsah |
|------|-------|
| `dkm-projects-v1` | Seznam projektů (id, název, popis, ghPath, updatedAt) |
| `dkm-active-project` | ID aktivního projektu |
| `dkm-pdata-{id}` | Data jednotlivého projektu |
| `dkm-lang` | Jazyk rozhraní (`cs` / `en`) |
| `dkm-autosave` | Automatické ukládání zapnuto/vypnuto |
| `dkm-debug` | Debug panel zapnut/vypnut |
| `dkm-dirty` | Indikátor neuložených změn |
| `dkm-github-token` | GitHub Personal Access Token (pouze lokálně) |

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) a po prvním načtení nevyžaduje připojení k internetu. GitHub synchronizace samozřejmě vyžaduje internet a platný token.

### URL parametry

| Parametr | Význam |
|----------|--------|
| `?p={projectId}` | Otevře konkrétní projekt v této záložce |
| `?id={base64GhPath}` | Sdílecí URL — automaticky načte projekt z GitHubu (pokud má příjemce token) |

### Otevírání entit přes URL hash

V adrese se používá hash ve tvaru `#entity/{entityId}`, takže lze sdílet odkazy na konkrétní entitu v rámci jednoho projektu.

---

*Dokumentace odpovídá stavu aplikace DKM ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdílna.*
