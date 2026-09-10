# DKM — Dynamický správce znalostí

Uživatelská příručka

- **Online nástroj:** <https://nastroje.egdilna.cz/dkm>
- **Rozcestník nástrojů EGdílna:** <https://nastroje.egdilna.cz/#dkm>
- **Zdrojový kód:** <https://github.com/egdilna/nastroje> (složka `dkm`)

---

## Obsah

1. [Co je DKM a k čemu se hodí](#1-co-je-dkm-a-k-čemu-se-hodí)
2. [Začínáme za pět minut](#2-začínáme-za-pět-minut)
3. [Klíčové koncepty](#3-klíčové-koncepty)
4. [Orientace v uživatelském rozhraní](#4-orientace-v-uživatelském-rozhraní)
5. [Práce s entitami](#5-práce-s-entitami)
6. [Typy entit](#6-typy-entit)
7. [Atributy](#7-atributy)
8. [Aspekty](#8-aspekty)
9. [Vazby a zpětné odkazy](#9-vazby-a-zpětné-odkazy)
10. [Hledání a základní filtry](#10-hledání-a-základní-filtry)
11. [Pokročilé filtry a uložené pohledy](#11-pokročilé-filtry-a-uložené-pohledy)
12. [Zobrazení dat](#12-zobrazení-dat)
13. [Hromadné operace](#13-hromadné-operace)
14. [Inbox a archiv](#14-inbox-a-archiv)
15. [Markdown, CriticMarkup, wiki-linky](#15-markdown-criticmarkup-wiki-linky)
16. [Komentáře](#16-komentáře)
17. [Objekty](#17-objekty)
18. [Panely](#18-panely)
19. [Rychlá paleta (Ctrl+P)](#19-rychlá-paleta-ctrlp)
20. [Samostatná okna](#20-samostatná-okna)
21. [Ukládání dat](#21-ukládání-dat)
22. [Diff od posledního uložení](#22-diff-od-posledního-uložení)
23. [Co všechno jde z DKM dostat ven](#23-co-všechno-jde-z-dkm-dostat-ven)
24. [Export a tisk entit](#24-export-a-tisk-entit)
25. [Export do tabulky, PlantUML a GraphML](#25-export-do-tabulky-plantuml-a-graphml)
26. [Export do datového JSON se schématem](#26-export-do-datového-json-se-schématem)
27. [Statický prohlížeč](#27-statický-prohlížeč)
28. [Přenos částí mezi projekty (balíčky)](#28-přenos-částí-mezi-projekty-balíčky)
29. [Nastavení](#29-nastavení)
30. [Klávesové zkratky](#30-klávesové-zkratky)
31. [Přístupnost](#31-přístupnost)
32. [Tipy a triky](#32-tipy-a-triky)
33. [Časté problémy](#33-časté-problémy)
34. [Technické pozadí](#34-technické-pozadí)
35. [AI asistent](#35-ai-asistent)
36. [Datový model a jeho export](#36-datový-model-a-jeho-export)
37. [Formáty souborů `.dkmdata` a `.dkmpkg`](#37-formáty-souborů-dkmdata-a-dkmpkg)
38. [Identifikátor obrazovky v patičce](#38-identifikátor-obrazovky-v-patičce)

---

## 1. Co je DKM a k čemu se hodí

**DKM (Dynamický správce znalostí)** je nástroj pro správu strukturovaných znalostí — věcí, lidí, dokumentů, požadavků, smluv, čehokoli, co se dá popsat atributy a propojit vazbami. Místo abys vyplňoval formuláře v rigidní databázi, definuješ si **typy entit** a **vazby** mezi nimi tak, jak ti dává smysl, a postupně do nich přidáváš obsah.

DKM se hodí například na:

- **Osobní informační manažer** — kontakty, projekty, úkoly, knihy, filmy, knowledge graph osobních věcí
- **Datový model softwarového systému** — entity, jejich atributy, vazby mezi tabulkami, audit
- **Legislativní normy a požadavky** — paragrafy, povinnosti, návaznosti, podpůrná dokumentace
- **CRM lehké váhy** — klienti, projekty, smlouvy, lidé na druhé straně
- **Knihovní katalog, kartotéka** — cokoli, co tradičně bylo v kartotéčních boxech
- **Wiki s typovými stránkami** — když Markdown sám nestačí

Nástroj je **jeden HTML soubor** běžící v prohlížeči. Žádný server, žádná instalace, žádný účet. Data jsou tvoje a leží v prohlížeči, případně v GitHub repozitáři pod tvojí kontrolou.

---

## 2. Začínáme za pět minut

1. Otevři nástroj na <https://nastroje.egdilna.cz/dkm> nebo si stáhni `dkm.html` z GitHubu a otevři lokálně.
2. Při prvním otevření tě DKM uvítá s prázdným projektem. Klikni na **Nastavení** v hlavičce.
3. V **Projekt** zadej název a popis.
4. V **Typy** vytvoř alespoň jeden typ entity (např. „Osoba"). Přidej mu atribut, třeba „Email" (text).
5. Zpět v hlavním pohledu klikni **+ Nová entita** a vyplň něco konkrétního.
6. **Ulož** projekt — DKM ti stáhne soubor `.dkmdata`. Uložiž si ho někam, kde ho najdeš.
7. Přiště, když otevřeš DKM, klikni **Načíst** a vyber svůj soubor. Projekt bude tam, kde jsi ho nechal.

DKM žije jen v aktuální záložce prohlížeče. Refresh (F5) přežije, zavření záložky neuchová stav — proto pravidelně ukládej do souboru nebo na GitHub.

---

## 3. Klíčové koncepty

DKM stojí na několika pojmech. Pojďme je projít s konkrétními příklady.

### 3.1 Entita

**Entita** je jedna konkrétní věc, kterou si pamatuješ — *Pavel Novák*, *Smlouva 2026/001*, *iPhone 14 Pro*, *Schůzka s panem ředitelem 4. 6. 2026*. Každá entita má **název** a obvykle **typ**.

### 3.2 Typ entity

**Typ** určuje, jakou strukturu má entita — jaké má atributy. Typ má **jméno** (např. „Osoba", „Smlouva", „Zařízení") a volitelně **ikonu** (emoji, které pomůže rozlišit typy na první pohled).

Klíčové: typ nediktuje obsah, jen šablonu pro atributy. Entita stejného typu nemusí mít všechny atributy vyplněné.

### 3.3 Atribut

**Atribut** je vlastnost entity. Definuje se na úrovni typu (a aspektu, viz dále) — všechny entity stejného typu sdílí stejné atributy.

Datové typy atributů:

- **text** — krátký řetězec na jeden řádek
- **textarea** — víceřádkový text s podporou Markdownu, CriticMarkupu a wiki-linků
- **date** — datum
- **url** — odkaz (zobrazí se jako klikatelný)
- **select** — výběr z předem definovaného seznamu hodnot
- **yesno** — ano/ne
- **number** — číslo
- **relation** — odkaz na jinou entitu (volitelně omezený na konkrétní typ, jednonásobný nebo vícenásobný)

U každého atributu si můžeš nastavit:

- **Povinný** — DKM nedovolí uložit entitu bez vyplnění
- **Zobrazit v seznamu** — hodnota se zobrazí přímo v kartě entity v seznamech

### 3.4 Aspekt

**Aspekt** je něco jako tag s rozšířením. Aspekt přidává **další atributy** entitě, **nezávisle na jejím typu**.

Příklad: máš typy „Osoba", „Smlouva", „Zařízení". Definuješ aspekt „Schválení" se dvěma atributy: *Kdo schválil* (relation na Osobu) a *Kdy* (date). Aspekt „Schválení" pak můžeš přiřadit jakékoli entitě — osobě, smlouvě, zařízení — a u každé budeš mít přístup k těm dvěma navíc atributům.

Aspekt se používá také jako:

- **Filtr** v seznamech (záložka „Aspekt: Schválení" ukáže všechny entity, které ten aspekt mají)
- **Sémantický tag** (entita „je VIP", „je archivovaná logika", „prošla auditem")
- **Modifikátor stavu** s atributy o tom stavu

Entita může mít libovolný počet aspektů současně.

### 3.5 Vazba (relace)

**Vazba** propojuje dvě entity. Vazba má svůj **typ** se jménem (např. „spolupracuje s") a obvykle **opačné jméno** (např. „spolupracuje s" pro symetrické, nebo „je nadřízený / je podřízený" pro asymetrické).

Vazba má **scope** (rozsah platnosti):

- **universal** — funguje mezi entitami libovolných typů
- **from / to / specific** — omezuje, mezi kterými typy entit vazba může vzniknout

Vazby jsou jednosměrné v datech, ale DKM zobrazuje obě strany: u entity vidíš její **vazby** (kam vede) i **odkazuje sem** (kdo na ni ukazuje). Do „Odkazuje sem" počítá i atributy typu relation a wiki-linky v textareas — vazba tedy vzniká i bez formálního vytvoření (viz kapitola 9).

### 3.6 Vlastní atribut (custom attribute)

Někdy potřebuješ na **konkrétní jednu entitu** zapsat něco, co nepatří do typu ani aspektu. Vlastní atribut je ad hoc atribut, který platí jen pro tu entitu. Má stejné datové typy jako standardní atribut, ale není sdílený s ničím jiným.

Příklad: typ „Osoba" nemá atribut „Oblíbená káva". Pavel ale rád espresso. Přidáš mu vlastní atribut „Káva: espresso" jen pro Pavla.

### 3.7 Komentáře

Ke každé entitě lze přidat libovolný počet komentářů. Každý komentář má autora (bere se z nastavení uživatele), datum a Markdown obsah. Detail v kapitole 16.

### 3.8 Objekty

Objekt je **pojmenované úložiště textu** připnuté k entitě — např. `data.json`, `outline.mroutline`. Nikde se nezobrazuje jako obsah entity, ale má tlačítka pro kopírování do schránky, uložení jako soubor a načtení nové verze. Objekty se nikdy neexportují do tisku / DOCX / PDF. Detail v kapitole 17.

---

## 4. Orientace v uživatelském rozhraní

DKM má hlavní pohledy: **Seznam** (výchozí), **Detail entity**, **Editor entity**, **Nastavení**, **Všechny komentáře**.

### 4.1 Hlavička

Vždy nahoře. Obsahuje:

- **Logo / název projektu**
- **Načíst** (klávesa Alt+L) — otevře soubor `.dkmdata` jako aktuální projekt
- **Uložit** (klávesa Ctrl+S) — uloží aktuální projekt (na disk nebo GitHub, podle nastavení)
- **📋⬇ Načíst ze schránky** (Ctrl+Shift+O) — nahradí projekt daty ze schránky (s potvrzením)
- **📋⬆ Vložit do schránky** (Ctrl+Shift+S) — zkopíruje celý projekt jako JSON do schránky
- **📤 Export** — otevře dialog Export dat: rozsah, cíl a formát na jednom místě (kap. 23)
- **Import TSV** — nahraje entity z TSV / CSV / vložení ze schránky
- **Nastavení** — projekt, typy, aspekty, vazby, seznamy, pohledy, obecné
- **⚙ Přizpůsobit** — rozbalovací menu se dvěma sekcemi: **Jazyk** (Čeština / English) a **Motiv** (viz 4.2)
- **● Neuložené změny** — klik otevře diff proti poslednímu uložení

### 4.2 Grafické motivy

V menu **⚙ Přizpůsobit → Motiv** (nebo v Nastavení → Obecné, nebo přes rychlou paletu Ctrl+P):

| Motiv | Jaký je |
|---|---|
| **Světlý** | výchozí, světlé pozadí, modrý akcent |
| **Tmavý** | tmavě šedé pozadí, světlý text |
| **Papír** | teplý sépiový list, hnědý inkoust, **serifové písmo** |
| **Matrix** | zelený text na černé, **monospace písmo**, decentní záře |

Volba se ukládá **jen do tohoto prohlížeče** (klíč `dkm-theme`), stejně jako jazyk —
neputuje v datech projektu, takže si každý může nastavit svůj.

Motiv se nastaví ještě než se stránka vykreslí, takže při načtení neproblikne výchozí vzhled.
Když jsi motiv ještě nikdy nevybral, řídí se první spuštění nastavením systému (tmavý režim
operačního systému = Tmavý), dál už platí jen tvoje volba.

Motiv se týká aplikace. **Tisk, export do DOCX/PDF a statický prohlížeč zůstávají světlé** —
jsou to výstupy pro někoho jiného, ne tvoje pracovní prostředí.

### 4.3 Toolbar nad seznamem

- **Záložky**: Inbox, Vše, jednotlivé typy entit, jednotlivé aspekty, připnuté uložené pohledy, Archiv. Klikem se přepneš na pohled, který obsahuje jen entity z dané kategorie.
- **Hledání** — fulltext napříč jménem a textovými atributy
- **Filtr** — typ, aspekt, datum aktualizace
- **Řazení** — podle data úpravy / názvu / data vytvoření
- **⚙ Pokročilé filtry (N)** — panel pro filtrování podle libovolného atributu (viz kapitola 11)
- **📋 / 📊 / 📅** — přepínač zobrazení: seznam / Kanban / časová osa (viz kapitola 12)
- **`{ }`** — export zobrazeného seznamu do datového JSON se schématem (viz kapitola 25)
- **+ Nová entita**
- **☑ Výběr** — zapne režim hromadných akcí

### 4.4 Karta entity v seznamu

- **Ikona typu** + **název entity** (např. 👤 *Pavel Novák*)
- **Badge** s názvem typu, 📥 Inbox, 📦 Archiv a aspekty (◎ *VIP*)
- **Snippet** — krátký výtah z první textarea atributu
- **Hodnoty atributů s „Zobrazit v seznamu"** — pokud jsou nějaké zapnuté
- **Datum úpravy** a počet vazeb
- **🪟** vpravo v záhlaví karty — otevře entitu rovnou v samostatném okně (viz kap. 20), bez zajížďky přes detail

Kliknutí na kartu kdekoliv mimo odkazy a tlačítka otevře detail. Samotný název je navíc
skutečný odkaz — jde otevřít prostředním tlačítkem nebo Ctrl+klikem v nové záložce.

### 4.5 Detail entity

- **← Zpět** (klávesa Alt+B) — vrátí se na předchozí zobrazenou stránku. Nikdy se nevrací do editace — přeskočí ji.
- **▾ Historie navigace** — rozbalovátko vedle Zpět se seznamem posledních navštívených entit a pohledů v této session. U entit vidíš ikonu typu, název a typ.
- **Nadpis** — ikona typu + název entity + badge typu, badges aspektů, stavu
- **Akce**: Upravit (E), Duplikovat, Změnit typ, 🖨 Export / tisk, 🪟 V samostatném okně, Archivovat, Smazat
- **Atributy** — vyplněné atributy (typu, aspektu, vlastní)
- **Vazby** — entity, kam vede vazba, seskupené podle typu vazby
- **Odkazuje sem** — entity, které odkazují sem (klasické vazby, atributy typu relation, wiki-linky). Skupiny mají různé popisky:
  - `název vazby ←` (klasické vazby)
  - `Typ / Atribut ←` (odkazy přes atribut typu)
  - `◎ Aspekt / Atribut ←` (odkazy přes aspektový atribut)
  - `[[Atribut]] (Kontext) ←` (wiki-linky)
- **Objekty** — sekce s objekty entity (viz kapitola 17)
- **Komentáře** — sekce s komentáři a formulářem na nový (viz kapitola 16)
- **Strukturální pohled** — 🌳 hierarchický strom podle vazeb
- **Metadata** — ID, vytvořeno, upraveno

### 4.6 Editor entity

- **Název** — povinný
- **Typ** — dá se změnit přes Změnit typ
- **Inbox** — checkbox „v Inboxu"
- **Atributy typu** — pole podle datového typu
- **Aspekty** — sekce s checkboxy. Zaškrtnutí přidá aspekt a okamžitě zobrazí jeho atributy.
- **Vlastní atributy** — sekce s + Přidat vlastní atribut a + Přidat objekt
- **Vazby** — sekce s aktuálními vazbami, + Přidat vazbu
- **Uložit / Zrušit** v zápatí (klávesa U uloží)

### 4.7 Nastavení

Levý panel se sekcemi:

- **Projekt** — název, popis, GitHub cesta, statický prohlížeč, přenos přes balíčky, úložiště projektu
- **Typy** — seznam typů entit, atributy, ikony
- **Aspekty** — analogie typů, ale pro aspekty
- **Vazby** — relační typy, jejich jména, scope, povolené typy
- **Seznamy** — select listy s výčtem hodnot
- **Uložené pohledy** — správa uložených filtrů
- **Záložky** — které typy a aspekty se zobrazují v toolbaru
- **GitHub** — token, synchronizace
- **Obecné** — jazyk, jméno uživatele pro komentáře, autosave, debug
- **Statistiky** — počty entit, atributů, vazeb
- **Nápověda** — odkazy na dokumentaci

### 4.8 Panely

Nad hlavním obsahem se objevuje **panelová lišta**, pokud máš otevřených víc panelů. Každý panel je nezávislý pracovní kontext s vlastním pohledem, filtry a otevřenou entitou. Detail v kapitole 18.

---

## 5. Práce s entitami

### 5.1 Vytvoření entity

Několik způsobů:

- **+ Nová entita** v hlavičce nebo toolbaru
- **Rychlé přidání** z Inbox pohledu — pole „Nová entita" nahoře v Inboxu, zapíšeš text a stiskneš Enter → vznikne entita bez typu v Inboxu
- **Duplikovat** v detailu — vytvoří kopii aktuální entity (s příponou „(kopie)" v názvu)
- Přes **Rychlou paletu (Ctrl+P)** → akce „Nová entita"

Entity vytvořené přes rychlé přidání jsou v Inboxu bez typu. V Detailu klikneš **Změnit typ** a přiřadíš.

### 5.2 Editace entity

Klikneš **Upravit** (nebo klávesa E). Formulář ukazuje:

- Základní pole (Název, Typ, v Inboxu)
- Atributy typu
- Aspekty (checkboxy — zaškrtnutí okamžitě přidá další sekci atributů)
- Vlastní atributy
- Objekty
- Vazby

Ukládáš přes tlačítko Uložit nebo klávesou U.

### 5.3 Duplikování

V Detailu tlačítko **⎘ Duplikovat**. Vytvoří kopii se všemi atributy, aspekty a vlastními atributy. Vazby se nekopírují (musíš je pak vytvořit ručně). Komentáře a objekty se také nekopírují.

### 5.4 Změna typu

Když entitu vytvoříš v Inboxu bez typu, později jí přiřadíš přes **Změnit typ** v detailu. DKM zachová všechny hodnoty atributů, které mají stejné ID. Zbytek si musíš vyplnit ručně.

### 5.5 Archivace a mazání

- **Archivovat** — entita zmizí ze všech seznamů (kromě záložky Archiv), ale zůstává v datech. Vazby na ni pořád fungují.
- **Obnovit** — vrátí entitu z archivu.
- **Smazat** — trvale odstraní entitu i její vazby.

### 5.6 Historie navigace

V detailu / v nastavení je tlačítko **← Zpět** (klávesa Alt+B) a vedle **▾** rozbalovátko s posledními navštívenými entitami / pohledy. Historie je pouze pro session — po zavření záložky zmizí. Zpět nikdy nevrací do editace (přeskočí ji).

---

## 6. Typy entit

Definuješ v **Nastavení → Typy**. Každý typ má:

- **Název** (např. „Osoba")
- **Ikona** — emoji, které se zobrazí u entit tohoto typu
- **Sada atributů** — libovolný počet, každý s vlastním datovým typem

### 6.1 Vytvoření typu

Klikneš **+ Nový typ**. Zadáš název, volitelně ikonu. Otevře se editor typu.

### 6.2 Editor typu

- Přejmenování / změna ikony
- Přidání / odebrání atributů, jejich přejmenování, přesun (nahoru / dolů)
- Přepínač **Povinný** u každého atributu
- Přepínač **Zobrazit v seznamu** (hodnota bude v kartě entity)

### 6.3 Mazání typu

Smazat lze typ jen tehdy, když neexistuje entita, která ho používá. DKM tě jinak upozorní.

### 6.4 Zobrazit typ jako záložku

V **Nastavení → Záložky** zaškrtneš, které typy chceš mít v hlavním toolbaru jako záložku (např. jen ty nejčastější). Ostatní jsou dostupné přes rozšířené filtrování nebo rychlou paletu.

---

## 7. Atributy

### 7.1 Standardní atribut (na úrovni typu)

Přidáš v editoru typu. Zadáš:

- **Název** (např. „Email")
- **Datový typ** (viz kap. 3.3)
- **Povinný** (checkbox)
- **Zobrazit v seznamu** (checkbox)
- Volitelně: **Seznam hodnot** (pro select), **Typ cíle** (pro relation)

### 7.2 Atribut aspektu

Definuješ v editoru aspektu. Pravidla jsou stejná. Aspekt může přinést atributy libovolného typu (včetně relation).

### 7.3 Vlastní atribut

V editoru entity klikneš **+ Přidat vlastní atribut**. Zadáš název, vybereš datový typ, vyplníš hodnotu. Vlastní atribut je jen pro tuto entitu.

### 7.4 Atribut typu relation

Zvláštní typ atributu — hodnota je ID cílové entity. Můžeš nastavit:

- **Typ cíle** — jen entity tohoto typu jsou nabízené
- **Vícenásobný** — pole ID místo jednoho

Tento atribut se **automaticky započítává do „Odkazuje sem"** u cílové entity, i když neexistuje formální vazba.

---

## 8. Aspekty

Aspekt je jako typ, ale pro doplňkové sady atributů. Definuješ v **Nastavení → Aspekty**.

Rozdíly proti typu:

- Aspekt nemá ikonu (jen ◎ jako společný symbol)
- Entita může mít víc aspektů zároveň (typ jen jeden)
- Aspekt lze u entity přidat / odebrat kdykoli — atributy zůstanou zapsané i po odebrání aspektu, ale nezobrazí se

### 8.1 Kdy použít aspekt vs. typ

- **Typ** = základní klasifikace, jaká věc to je (Osoba, Smlouva)
- **Aspekt** = doplňková vlastnost, která přichází a odchází nezávisle (VIP, Ve schvalování, Archivováno-kandidát)

---

## 9. Vazby a zpětné odkazy

### 9.1 Definice typu vazby

V **Nastavení → Vazby** vytvoříš typ vazby:

- **Název** (např. „spolupracuje s")
- **Opačný název** (např. „spolupracuje s" nebo „je nadřízený / je podřízený")
- **Scope**: universal, from-to, specific
- **Povolené typy zdroje / cíle**

### 9.2 Vytvoření vazby

V detailu entity → **+ Přidat vazbu** → dialog:

- Typ vazby
- Cílová entita (výběr přes autocomplete nebo picker)

Vazba se okamžitě zobrazí v sekci Vazby.

**Smazání vazby:** v režimu úprav je za názvem navázané entity kolečko **×**. Klik ji odebere
z formuláře; do dat se to propíše **až uložením entity**. Ze sekce *Odkazuje sem* mazat nejde —
vazba patří té entitě, ze které vede, tak ji smaž tam.

### 9.3 Zpětné odkazy („Odkazuje sem")

Sekce **Odkazuje sem** u entity **automaticky zahrnuje tři typy odkazů**:

1. **Klasické vazby** — jiné entity, které mají vazbu na tuto (skupina se jmenuje podle opačného názvu vazby)
2. **Atributy typu relation** — jiné entity, které mají atribut typu relation odkazující sem (skupina se jmenuje `Typ / AttrName ←` nebo `◎ Aspekt / AttrName ←`)
3. **Wiki-linky** — jiné entity, které v textareas obsahují `[[Název této entity]]` (skupina se jmenuje `[[AttrName]] (Kontext) ←`)

V každé skupině jsou odkazy na zdrojové entity s ikonou typu.

To znamená, že **můžeš budovat síť odkazů přirozeně**, aniž bys musel formálně vytvářet vazby — stačí použít atribut typu relation nebo napsat wiki-link do textu.

### 9.4 Systémový filtr podle vazeb

V pokročilých filtrech (kap. 11) můžeš filtrovat entity podle:

- **Počet vazeb / zpětných odkazů**
- **Má vazbu typu X**
- **Odkazuje sem entita X**

Vše počítá i s atribut-relacemi a wiki-linky, konzistentně napříč aplikací.

---

## 10. Hledání a základní filtry

### 10.1 Fulltext

Pole **Hledání** v toolbaru prochází:

- Název entity
- Textové a textarea atributy
- Vlastní atributy typu text a textarea

Vrátí entity, kde je hledaný řetězec.

### 10.2 Filtr typu

Dropdown v toolbaru — zúží seznam na jeden vybraný typ.

### 10.3 Filtr aspektu

Dropdown — zúží seznam na entity, které mají daný aspekt.

### 10.4 Filtr data úpravy

Dropdown se čtyřmi volbami: dnes, posledních 7 dní, posledních 30 dní, starší než měsíc.

### 10.5 Řazení

Podle data úpravy (výchozí), názvu, data vytvoření.

Pro složitější filtrování → kapitola 11.

---

## 11. Pokročilé filtry a uložené pohledy

### 11.1 Panel pokročilých filtrů

Tlačítko **⚙ Pokročilé filtry (N)** v toolbaru (klávesa Ctrl+F). Otevře panel, kde přidáváš pravidla. Každé pravidlo má:

- **Atribut** — dropdown se všemi atributy: systémové vlastnosti, atributy typů, atributy aspektů
- **Operátor** — dropdown podle datového typu
- **Hodnota** — vstupní pole odpovídající datovému typu

Pravidla se kombinují v **AND** — všechna musí platit.

### 11.2 Systémové vlastnosti

- **Název** — text operátory
- **Typ entity** — equals / notEquals / in / notIn / empty
- **Aspekty** — hasAspect / hasNoAspect / hasAllAspects / hasAnyOfAspects / hasNoAspects
- **V Inboxu** / **Archivováno** — yes/no
- **Vytvořeno** / **Upraveno** — datumové operátory
- **Počet vazeb** — number operátory
- **Počet zpětných odkazů** — number operátory (počítá i attribute-relace a wiki-linky)
- **Má vazbu typu**

### 11.3 Operátory podle datového typu

**Text / URL:** contains, notContains, equals, notEquals, startsWith, endsWith, regex, empty, notEmpty

**Select:** equals, notEquals, in, notIn, empty, notEmpty

**Number:** equals, notEquals, greaterThan, greaterOrEqual, lessThan, lessOrEqual, between, empty, notEmpty

**Date:** equals, before, after, between, isToday, isYesterday, isTomorrow, isThisWeek, isThisMonth, isThisYear, isPast, isFuture, inLastDays N, inNextDays N, olderThanDays N, newerThanDays N, empty, notEmpty

**Yes/No:** isTrue, isFalse, empty

**Relation atribut:** hasAnyTarget, hasNoTarget, targetIs (konkrétní entita), targetIsType, targetHasAspect

### 11.4 Popis aktivního filtru

Když panel zavřeš a jsou aktivní pravidla, nad seznamem se objeví strip s popisem: `Filtr: Person / Email obsahuje "firma" · aspekty má aspekt VIP  [Vyčistit]`. Klik na Vyčistit zahodí všechna pokročilá pravidla.

### 11.5 Uložené pohledy

Tlačítko **⭐ Uložit jako pohled** v panelu filtrů. Dialog: název, ikona (emoji), zaškrtávátko **Připnout jako záložku**.

Uložený pohled uchová: search, filtr typu / aspektu / data, pokročilá pravidla (attrFilters), řazení, aktivní záložku a display mode (seznam / Kanban / časová osa) i s parametry.

**Připnutý pohled** se objeví jako záložka v hlavním toolbaru (např. `🔥 Naléhavé`). Klik aplikuje filtr.

### 11.6 Správa pohledů

**Nastavení → Uložené pohledy**: editace názvu / ikony, přepnutí připnutí, **Přepsat aktuálním** (uloží aktuální filtr do pohledu), Smazat. Náhled obsahu pohledu.

Pohledy se ukládají do dat projektu (`state.data.savedViews`), přenášejí se s projektem.

### 11.7 Neplatná pravidla

Když smažeš atribut, na který pravidlo odkazuje, pravidlo se v panelu označí červeně jako `⚠ Neplatné`. Při aplikaci vrátí prázdný seznam — je to signál, ať ho smažeš nebo přemapuješ.

---

## 12. Zobrazení dat

V liště nad seznamem je pět přepínačů: **📋 Seznam · ▦ Tabulka · 📊 Kanban · 🗓 Kalendář · 📅 Časová osa**.
Vedle nich přepínač **⫸ Náhled** a u seznamu ještě volba **Sekce podle**.

Přepíná se jen způsob zobrazení — filtry, hledání i řazení platí ve všech stejně.

### 12.1 Seznam (📋)

Výchozí a zůstává výchozí. Karty entit pod sebou.

**Sekce podle** rozdělí seznam do rozbalovacích skupin podle atributu typu výběr, ano/ne, nebo
podle typu entity. U každé sekce je vidět, kolik entit obsahuje; entity bez hodnoty mají sekci
„(bez hodnoty)" na konci. Rozbalení a sbalení si pohled pamatuje.

### 12.2 Tabulka (▦)

Klasická mřížka: řádky jsou entity, sloupce atributy. **Needituje se v ní** — je to pohled,
ne formulář; na úpravy je detail entity.

- **⚙ Sloupce** — vybereš, co se ukáže. Nabídka je členěná na základní údaje, každý typ
  a aspekt zvlášť, vlastní atributy a metadata, a u každého sloupce je vidět, u kolika entit je
  vyplněný. Výchozí sada = název, typ, atributy, které jsou u něčeho vyplněné, a datum úpravy.
- **Řazení klikem na hlavičku** — první klik vzestupně, druhý sestupně, třetí zruší a vrátí
  řazení z lišty.
- **První sloupec a hlavička zůstávají na místě** při odscrollování.
- V režimu výběru přibude sloupec se zaškrtávátky, takže hromadné operace fungují i tady.

Sloupce berou tentýž zdroj jako export do tabulky — co vidíš, to i vyexportuješ.

### 12.3 Kalendář (🗓)

Měsíční mřížka podle zvoleného datového atributu. Nahoře výběr atributu, přepínání měsíců
a tlačítko **Dnes**; dnešek je zvýrazněný. Entity jsou v příslušném dni jako štítky, klik
otevře detail (nebo náhled, když je zapnutý). Pod kalendářem se píše, kolik entit datum nemá,
a tedy v něm nefiguruje.

### 12.4 Náhled vedle seznamu (⫸)

**Režim, ne jednorázová akce.** Zapneš ho tlačítkem v liště a od té chvíle se klik na entitu
neotevře na celou stránku, ale **napravo vedle seznamu**. Můžeš tak projít deset entit za sebou,
aniž bys pokaždé skákal tam a zpět. Vybraná entita je v seznamu zvýrazněná.

Funguje v seznamu, v tabulce i v kalendáři. V náhledu jsou všechny akce detailu (Upravit,
Duplikovat, Export…), jen chybí navigace zpět — z náhledu se nikam neodchází. Na úzké
obrazovce se panel přesune pod seznam. Vypnutím se vrátí normální chování.

### 12.5 Kanban (📊)

Nad tabulí selector **Sloupce podle**. Nabízí atributy typu select, yesno a systémovou vlastnost „Typ entity". Sloupce jsou hodnoty toho atributu (+ sloupec „bez hodnoty" pro entity bez hodnoty).

Karta má ikonu, název, snippet a **dropdown „Přesunout do"** — screen reader–kompatibilní alternativa k drag-and-drop. Změna sloupce = úprava hodnoty atributu, entita se přeuloží.

### 12.6 Časová osa (📅)

Selector **Časová osa podle** — všechny date atributy typu, aspektu, plus systémové Vytvořeno a Upraveno.

Tlačítko **⇧ Vzestupně / ⇩ Sestupně**.

Entity grupované podle roku a měsíce, s datem před názvem. Entity bez data v samostatné sekci **Bez data**.

### 12.7 Zobrazení v uložených pohledech

Když uložíš pohled, uloží se i způsob zobrazení a jeho nastavení — včetně vybraných sloupců
tabulky, sekcí, atributu kalendáře a toho, jestli byl zapnutý náhled. Klik na připnutou záložku pohledu tě vrátí do stejného zobrazení. Změnit lze přes **Přepsat aktuálním** v Nastavení → Uložené pohledy.

---

## 13. Hromadné operace

Klikneš **☑ Výběr** v toolbaru (klávesa V). Karty entit získají checkbox. Vyber, které entity chceš zpracovat.

Toolbar hromadných akcí ukazuje počet vybraných + dropdown akcí:

- **📥 Do Inboxu** — přesune do Inboxu
- **📤 Z Inboxu** — odebere z Inboxu
- **📦 Archivovat / Obnovit**
- **🗑 Smazat**
- **🏷 Přiřadit typ**
- **◎ Přidat aspekt / Odebrat aspekt**
- **↔ Přidat vazbu** — hromadně přidá vazbu ke všem
- **⇢ Sloučit entity** — sloučí vybrané do jedné cílové (viz 13.1)
- **🎨 PlantUML diagram** — vygeneruje PlantUML z vybraných (viz kap. 25)
- **📦 Export balíčku** — zabalí vybrané do `.dkmpkg` (viz kap. 28)
- **`{ }` Export do datového JSON** — data + JSON Schema v ZIPu (viz kap. 26)
- **🖨 Export / tisk výběru** — vybrané entity do jednoho dokumentu (MD, DOCX, tisk; viz kap. 24.4)
- **🤖 Zeptat se AI** — poslat výběr jazykovému modelu (viz kap. 35)

### 13.1 Sloučení entit

Vybereš 2+ entit, akce **⇢ Sloučit entity**. Dialog:

- **Cílová entita** (do které se ostatní slijou)
- **Strategie pro konfliktní hodnoty**: Nechat cíl / Přepsat zdrojem / Spojit obě
- **Náhled** — kolik vazeb se přesune, atributů, backlinků

Klik na **Sloučit**:

- Přenese atributy podle strategie
- Sjednotí aspekty a vlastní atributy
- Přesune výstupní vazby (s deduplikací)
- Přesměruje **všechny příchozí vazby** z ostatních entit na cíl (klasické i atribut-relace)
- Smaže zdrojové entity
- Skočí na cíl

Ideální pro duplicity („dva Pavel Novák", „stejná tabulka pod jiným jménem").

---

## 14. Inbox a archiv

### 14.1 Inbox

**Inbox** je záložka pro entity, které vytvoříš rychle bez rozmyslu (např. myšlenka do budoucna) nebo bez znalosti typu. Nová entita může být v Inboxu — checkbox „V Inboxu" v editoru.

Nahoře v Inboxu je pole **Rychlé přidání** — napíšeš text, Enter, vznikne entita bez typu v Inboxu. Volitelně velký textarea pro delší poznámku.

Cílem je pak entity z Inboxu postupně zpracovat: přiřadit typ (Změnit typ v detailu), doplnit atributy, přesunout z Inboxu (odškrtnout checkbox).

### 14.2 Archiv

**Archivovat** = entita zmizí ze všech běžných pohledů (kromě Archivu). Data zůstávají, vazby fungují. Vhodné pro dokončené věci, které nechceš vidět denně, ale ani mazat.

Archiv se v hlavním toolbaru zobrazuje jen tehdy, když v něm něco je.

---

## 15. Markdown, CriticMarkup, wiki-linky

### 15.1 Markdown v textarea atributech

Podporované věci:

- **# Nadpisy** (# až ####)
- **odstavce** oddělené prázdnou řádkou
- **`inline kód`** a bloky ``` ``` ```
- **`*kurzíva*`, `**tučně**`, `~~přeškrtnuté~~`**
- **Nadpisy Setextové** styl (=== / ---)
- **Seznamy** `- ` a `1. `
- **Odkazy** `[text](url)`
- **Obrázky** `![alt](url)`
- **Blockquote** `>`
- **Tabulky** GFM styl

Renderuje se pod editorem jako preview a v Detailu jako finální obsah.

### 15.2 CriticMarkup

Pro označování změn (užitečné při schvalování textu):

- `{++ přidaný text ++}` — vloženo
- `{-- smazaný text --}` — smazáno
- `{~~ starý ~> nový ~~}` — nahrazení
- `{== zvýrazněno ==}` — zvýraznění
- `{>> komentář <<}` — vedlejší poznámka

V zobrazení se vyrenderuje barevně (přidané zeleně, smazané červeně, atd.). V exportech do DOCX se přenese jako sledované změny.

### 15.3 Wiki-linky

Uvnitř textarea (nebo custom text) můžeš napsat `[[Název entity]]`. Když entita s tímto názvem existuje, wiki-link se vyrenderuje jako klikatelný odkaz. Když neexistuje, zobrazí se červeně s tooltipem „Entita s tímto názvem neexistuje".

**Nejsilnější je zpětný účinek**: cílová entita ve své sekci **Odkazuje sem** automaticky uvidí všechny zdrojové entity, které na ni odkazují wiki-linkem. Nemusíš formálně vytvářet vazbu.

Příklad: v poznámce k jedné entitě napíšeš „Návaznost na [[Vyhláška 409/2025]]." Když otevřeš tu vyhlášku, vidíš tento odkaz v sekci Odkazuje sem, skupině `[[Popis]] (Osoba) ←`.

Match je case-insensitive přes plný název entity.

### 15.4 Nabídka odkazů při uložení

Psát `[[…]]` ručně je otrava, takže **při uložení entity projde DKM její víceřádkové (Markdown)
atributy** a hledá v nich názvy jiných entit napsané prostým textem. Co najde, ukáže v dialogu
se zaškrtávátky — vybereš, z čeho má být odkaz, a potvrdíš. **Nic se nemění samo**, rozhodnutí
je vždy na tobě.

U každé nabídky je název cílové entity s ikonou typu, počet výskytů a výřez textu se zvýrazněným
místem, ať víš, o který výskyt jde. Tlačítka **Vybrat vše** / **Nevybrat nic** urychlí hromadné
rozhodnutí, dole je pak trojice:

- **🔗 Vytvořit odkazy a uložit** — zabalí zaškrtnuté výskyty do `[[…]]` a uloží
- **Uložit bez odkazů** — uloží text tak, jak je
- **Zpět k editaci** — zavře dialog a nechá tě v editoru

Pravidla, podle kterých se hledá:

- jen **víceřádkové** atributy (typu, aspektu i vlastní); jednořádkový text se neprohledává
- název musí stát jako **samostatné slovo** — „Rodné číslostí" se netrefí
- porovnává se **bez ohledu na velikost písmen** a původní psaní zůstává (`[[rodné číslo]]`
  se dohledá stejně dobře jako `[[Rodné číslo]]`)
- **delší název má přednost** — v textu „Rodné číslo" se nabídne *Rodné číslo*, ne *Číslo*
- nesahá se do **existujících odkazů `[[…]]`, kódu (`` ` `` i ohraničených bloků), markdown
  odkazů `[text](url)`, HTML značek a URL** — díky tomu druhé uložení téže entity už nic nenabízí
- názvy kratší než tři znaky se přeskakují, jinak by se trefovala půlka textu
- archivované entity a entita samotná se nenabízejí

Vypnout to jde v **Nastavení → Obecné → Nabízet wiki odkazy při uložení entity**.

---

## 16. Komentáře

### 16.1 K entitě

V detailu entity sekce **💬 Komentáře**. Formulář nahoře:

- Textarea (Markdown)
- Autor se automaticky bere z **Nastavení → Obecné → Tvoje jméno pro komentáře** (nastavení prohlížeče, ne dat projektu)
- Tlačítko **Přidat komentář** (nebo Ctrl+Enter v textarea)

Seznam komentářů: každý má autora, datum, Markdown obsah, štítek „upraveno" pokud editován, tlačítka **✎ Upravit** (inline editace) a **× Smazat**. Řazení od nejnovějšího.

**Klávesa `c` v detailu** skočí focusem na comment input.

### 16.2 Samostatný pohled Všechny komentáře

Přístup přes Rychlou paletu (Ctrl+P → „Všechny komentáře") nebo URL `#comments`.

- Vyhledávací pole — hledá v obsahu, autorovi a názvu entity
- Řazení od nejnovějšího napříč všemi entitami
- Každý řádek má odkaz na entitu (s ikonou typu), autora, datum a Markdown náhled komentáře

Ideální pro rychlé procházení diskusí napříč projektem.

---

## 17. Objekty

### 17.1 Co je objekt

**Objekt** je pojmenované úložiště textu připnuté k entitě — např. `data.json`, `outline.mroutline`, `graph.puml`. Objekt je jenom text — DKM ho **nikde nevykresluje**, jen ho drží. Nikdy se neobjeví v tiskových výstupech (MD, DOCX, PDF, formátovaný copy).

Cíl: mít bezpečné úložiště strojových dat (výstupů z externích nástrojů) přímo u entity, bez zaneřáďování detailu.

### 17.2 Přidání objektu

V editoru entity vedle **+ Přidat vlastní atribut** je **+ Přidat objekt**. Zadáš název s příponou. Vznikne prázdný objekt.

### 17.3 Práce s objektem

V detailu sekce **📦 Objekty**. Každý objekt zobrazí:

- Ikona 📦 + název monospaceem
- Velikost (B / kB / MB)
- Tlačítka:
  - **📋⬆ Kopírovat do schránky**
  - **📋⬇ Vložit ze schránky** (jen když prohlížeč umí `readText`)
  - **💾 Uložit jako soubor** — stáhne se přesně pod tím názvem
  - **📥 Načíst novou verzi** — file input, přepíše obsah zvoleným souborem
- V hlavičce: **✎ Přejmenovat** a **× Smazat**

Přepis obsahu (Vložit ze schránky / Načíst novou verzi) **neptá se na potvrzení** — chová se jako v PIM.

### 17.4 Kdy použít objekt vs. textarea atribut

- **Textarea atribut** = strukturovaný text, který chceš vidět v detailu, exportovat, tisknout
- **Objekt** = strojová data, JSON, XML, výstup nástroje, který chceš mít u entity, ale ne v detailu ani v exportu

Objekty jsou součástí projektových dat (uloží se do souboru, na GitHub, do balíčku).

---

## 18. Panely

### 18.1 Co je panel

**Panel** je nezávislý pracovní kontext v rámci jedné záložky prohlížeče. Každý panel má vlastní pohled (detail entity, seznam, nastavení), vlastní filtry, vlastní pozici v historii navigace.

Můžeš mít současně:

- V panelu 1 seznam „Vše"
- V panelu 2 detail konkrétní entity
- V panelu 3 uložený pohled „Naléhavé"

Přepínáš mezi nimi jedním klikem, každý panel si drží svůj stav.

### 18.2 Panelová lišta

Objevuje se nad hlavním obsahem, pokud máš víc než 1 panel. Každý panel = tab s ikonou (podle obsahu), názvem a × pro zavření. Napravo tlačítko **＋** pro nový panel.

Label tabu se automaticky aktualizuje:

- Detail entity → ikona typu + název

Ikona typu se vypisuje u **každého** výskytu názvu entity: v seznamu, na kanban kartě, v timeline,
v nadpisu detailu, u vazeb i zpětných odkazů, u hodnot atributů typu „vazba", ve výběru entit,
v osnově, v přehledu komentářů i v dialogu změn.
- Editor → `✎ Název`
- Nová entita → `＋ Nová entita`
- Seznam → ikona + název záložky
- Uložený pohled → ikona + název pohledu
- Nastavení → `⚙ Nastavení`
- Všechny komentáře → `💬 Všechny komentáře`

### 18.3 Klávesové zkratky

- **Ctrl+T** — nový panel (otevře se v Inboxu)
- **Ctrl+W** — zavřít aktivní panel (nelze poslední)
- Klik na tab — přepnout
- **× u tabu** — zavřít konkrétní

### 18.4 Kdy panely použít

- **Srovnání dvou entit** — v jednom panelu jedna, ve druhém druhá, přepínáš mezi nimi
- **Práce na entitě + kontext** — v hlavním panelu seznam projektu, v druhém rozpracovaná entita
- **Rychlá reference** — v třetím panelu Statistiky nebo Nastavení, nemusíš opouštět práci

Panely jsou **jen v paměti** — při zavření záložky prohlížeče zmizí.

---

## 19. Rychlá paleta (Ctrl+P)

### 19.1 Otevření

Stiskneš **Ctrl+P** (Cmd+P na Macu) → modal s textovým polem.

### 19.2 Co lze najít

- **Entity** (top 60, nebo fuzzy match) — klik otevře detail
- **Uložené pohledy**
- **Aspekty** (klik → záložka aspektu)
- **Typy entit** (klik → záložka typu)
- **Akce**: Nová entita, Nastavení, Uložit, Načíst, **Načíst z URL**, Pokročilé filtry, načtení ze schránky, **📤 Export dat**, **Motiv (všechny čtyři)**, Nový panel, Všechny komentáře, Inbox / Vše / Archiv

### 19.3 Fuzzy match

Píšeš klíčová slova. Podmínka: každé slovo musí být substring v labelu nebo popisku (case-insensitive). Bonusy: exact match, startsWith. Kratší label vyhrává v pořadí.

Prázdný dotaz nabídne poslední navštívené entity z historie navigace.

### 19.4 Ovládání klávesnicí

- **↑↓** — pohyb v seznamu
- **Home / End** — první / poslední
- **Enter** — spustit akci
- **Esc** — zavřít

Screen reader kompatibilní (ARIA combobox + listbox + aria-activedescendant).

---

## 20. Samostatná okna

### 20.1 K čemu to je

Někdy chceš odseparovat práci na jedné entitě do samostatného **okna prohlížeče** — např. pro srovnávání se side-by-side vedle hlavního okna, pro dedikovaný focus, pro paralelní editaci.

### 20.2 Otevření

Buď v detailu entity tlačítkem **🪟 V samostatném okně**, nebo rovnou ze seznamu tlačítkem **🪟**
vpravo v záhlaví karty. Otevře se nová instance DKM v samostatném okně.

### 20.3 Standalone mode

Samostatné okno má **minimalizovaný chrom**: skrytá záložková lišta, panelová lišta, formulář Rychlé přidání, tlačítka Export / Import. Zůstávají jen Uložit, Načíst, Nastavení a základní ovládání entity. Titulek aplikace je zmenšený.

### 20.4 Předání dat a live sync

Aktuální data se předají do nového okna přes localStorage handoff (short-lived, jednorázový). Nové okno data načte a smaže handoff klíč.

Mezi otevřenými okny funguje **live sync přes BroadcastChannel**:

- Když v jednom okně upravíš data, ostatní okna se automaticky aktualizují
- Když je jiné okno v editaci, ukáže se banner „Data se změnila v jiném okně" s tlačítkem **Načíst aktuální** — zabrání se přepsání rozdělané editace

Můžeš mít otevřeno **libovolný počet samostatných oken** současně.

### 20.5 Omezení

- Popup blocker: prohlížeč musí povolit vyskakovací okna pro DKM
- Data před otevřením musí být načtena v hlavním okně

---

## 21. Ukládání dat

### 21.1 Kde data žijí

**Projekt existuje jen v aktuální záložce prohlížeče.** Refresh (F5) ho neztratí (data jsou v sessionStorage), zavření záložky ano.

**Jeden projekt na záložku** — pokud chceš mít otevřeno víc projektů současně, otevři aplikaci ve víc záložkách. Každá záložka je nezávislá.

### 21.2 Uložení do souboru

Klik **Uložit** (Ctrl+S). Když nemáš nastavenou GitHub cestu, stáhne se soubor `.dkmdata` s celým projektem.

Do souboru se ukládá vše: typy, aspekty, vazby, seznamy, uložené pohledy, entity (s atributy, aspekty, vazbami, vlastními atributy, objekty, komentáři).

### 21.3 Načtení souboru

Klik **Načíst** (Alt+L) → dialog výběru souboru → `.dkmdata` nebo `.json`.

Pokud jsou v aktuálním projektu neuložené změny, DKM se ptá „Neuložené změny zmizí. Opravdu pokračovat?".

### 21.4 GitHub sync

V **Nastavení → GitHub** zadáš **token** (personal access token) a v **Nastavení → Projekt** cestu k souboru na GitHubu ve formátu `owner/repo/branch/path/file.dkmdata`.

Pak **Uložit** (Ctrl+S) uloží přímo do GitHubu (`Uložit lokálně` zůstává jako záloha).

**Načíst z GitHubu** — tlačítko v Nastavení → Projekt.

Uložení doprovází **zvuková odezva** — po úspěchu krátký stoupavý tón, po neúspěchu temnější klesavý (chybějící cesta, chybějící token, zamítnutí GitHubu i síťová chyba). Dá se vypnout v Nastavení → Obecné.

### 21.5 URL parametr pro autoload z GitHubu

`?id={base64ghPath}` v URL → DKM při startu automaticky načte projekt z GitHubu přes API.
Odkaz vygeneruje **Nastavení → GitHub → Odkaz**. Šikovné pro sdílení nebo pro záložku
v prohlížeči. Na privátní repozitář je potřeba token uložený v prohlížeči.

### 21.6 URL parametr pro načtení z libovolné adresy

`?open={url}` v URL → DKM při startu stáhne projekt z té adresy. Na rozdíl od `?id=`
**nejde přes GitHub API**, takže funguje kdekoliv: statický hosting, intranet, GitHub Pages,
`raw.githubusercontent.com`, sdílený síťový disk vystavený přes HTTP.

Adresa se **musí zakódovat** (kvůli `?` a `&` v ní) — proto ji nepiš ručně, ale nech si
odkaz vyrobit v **Nastavení → Projekt → Načíst projekt z adresy (URL)**. Tamtéž je tlačítko,
kterým projekt načteš rovnou, bez odkazu. Načtení nabízí i rychlá paleta (Ctrl+P).

Pravidla:

- povolené je jen `https://`, a `http://` jen tehdy, když DKM samo neběží na https
  (jinak by požadavek prohlížeč zablokoval jako mixed content); `javascript:` a `data:` se odmítnou
- funguje i **relativní cesta** — `?open=data/model.dkmdata` vezme soubor vedle `index.html`
- cílový server musí povolit **čtení z jiné domény (CORS)**. Když to nedělá, prohlížeč
  odpověď zahodí a DKM ohlásí, že soubor nešlo stáhnout. `raw.githubusercontent.com`
  a GitHub Pages CORS povolují, běžný firemní web často ne.
- když má `?id=` i `?open=`, vyhraje `?id=`
- když máš neuložené změny, DKM se zeptá dřív, než je přepíše

Načtený projekt **nemá nastavenou GitHub cestu**, pokud ji nenese sám soubor — Uložit tedy
uloží do souboru, ne na GitHub.

### 21.7 Uložení do schránky

Tlačítko **📋⬆** v hlavičce (Ctrl+Shift+S), nebo v dialogu **📤 Export dat** cíl **Projekt do schránky**. Zkopíruje celý projekt jako JSON. Použitelné pro rychlé přenesení do jiné záložky nebo do jiné aplikace.

### 21.8 Načtení ze schránky

**📋⬇ Načíst ze schránky** (Ctrl+Shift+O). Přečte projekt ze schránky, nahradí aktuální (s potvrzením pokud jsou neuložené změny). Když prohlížeč nedovolí přímý přístup, otevře se dialog s textarea pro ruční vložení.

### 21.9 Autosave

**Nastavení → Obecné → Autosave** — po každé změně se projekt automaticky ukládá do sessionStorage (aktuální záložky). Refresh přežije, zavření záložky ne.

To NEZAHRNUJE ukládání do souboru ani na GitHub — pravidelně ukládej ručně přes Ctrl+S.

### 21.10 Začít prázdný projekt

**Nastavení → Projekt → 📄 Začít prázdný projekt**. Zahodí aktuální projekt (s potvrzením pokud jsou neuložené změny) a začne s prázdným.

---

## 22. Diff od posledního uložení

### 22.1 Co je to

Po každém úspěšném uložení nebo načtení si DKM pořizuje **snapshot** aktuálních dat. Pak porovnává aktuální stav s tímto snapshotem, aby ti mohl přehledně říct, **co se změnilo od posledního uložení**.

### 22.2 Otevření

Klik na indikátor **● Neuložené změny** v hlavičce (viditelný, když projekt je „dirty").

### 22.3 Co vidíš

Barevně tři sekce:

- 🟢 **Přidané** — nové entity od baseline
- 🟡 **Upravené** — entity s per-field výpisem změn (Email, Datum, Aspekty, atd., před → po)
- 🔴 **Smazané** — entity, které zmizely

Klik na entity → zavře dialog a skočí na detail.

### 22.4 Kdy to použít

- **Před uložením** — kontrola, jestli žádná úprava není náhodná
- **Před push do GitHubu** — přehled změn v „commitu"
- **Po hodině práce** — přehled, co jsi dnes udělal
- **Recovery** — pokud si nejsi jistý, co poslední změny udělaly, otevři diff a zorientuj se

---

## 23. Co všechno jde z DKM dostat ven

### 23.1 Dvě roviny: data a model

DKM umí exportovat ve dvou rovinách a stojí za to je nezaměňovat:

- **Data** — konkrétní entity, jejich hodnoty, vazby a komentáře. To je obsah.
- **Model** — typy, aspekty, atributy, číselníky a vazby. To je popis toho, jak je projekt
  postavený, bez jediné entity.

Většina exportů níže je datová. Model se exportuje z jednoho místa — **Nastavení → Model**
(kap. 36) — a míří jinam: do rukou vývojáře, architekta nebo databáze.

### 23.2 Exporty dat

**Všechno kromě uložení projektu vede jedním tlačítkem: 📤 Export dat.** Otevřeš ho tlačítkem
**Export** v hlavičce, hromadnou akcí **📤 Export dat** nad výběrem, nebo z rychlé palety.
V dialogu si vybereš **rozsah** (vybrané entity / zobrazený seznam / celý projekt) a **cíl**:

| Cíl | Formáty | K čemu |
|---|---|---|
| **Dokument** | Markdown, DOCX, tisk / PDF, formátovaný text do schránky | zpráva, přehled, podklad ke čtení (kap. 24) |
| **Tabulka** | XLSX, CSV, TSV — s výběrem sloupců | Excel, úprava a import zpět (kap. 25.1) |
| **Data se schématem** | JSON + JSON Schema, XML + XSD | strojové zpracování, integrace (kap. 26) |
| **Diagram nebo graf** | PlantUML, GraphML | obrázek vazeb, nebo graf do Gephi a yEd (kap. 25.3) |
| **Balíček** | `.dkmpkg` | přenos výseku do jiného DKM projektu (kap. 28) |
| **Statický prohlížeč** | jeden HTML soubor | poslat někomu, kdo DKM nemá (kap. 27) |
| **Projekt do schránky** | JSON | rychlý přesun mezi záložkami (Ctrl+Shift+S) |

Mimo ten dialog zůstávají tři věci, a to schválně:

| Co | Kde | Proč zvlášť |
|---|---|---|
| Celý projekt jako `.dkmdata` | hlavička **Uložit** (Ctrl+S) | není to export, ale uložení projektu — má GitHub, zvukovou odezvu a vlastní klávesu (kap. 21) |
| Jedna entita | detail entity → **🖨 Export / tisk** | je to o jedné konkrétní věci, kterou máš zrovna otevřenou (kap. 24) |
| Kontext pro jazykový model | **🤖 Zeptat se AI** → Zobrazit, co se odešle | nejde o soubor, ale o zadání pro AI (kap. 35.3) |

### 23.3 Exporty modelu

Všech sedm najdeš na jednom místě — **Nastavení → Model** (kap. 36), jednotlivě nebo v ZIPu:

| Soubor | Formát | K čemu |
|---|---|---|
| `model.md` | Markdown | čitelná dokumentace modelu pro lidi |
| `openapi.yaml` | OpenAPI 3.1 | zadání REST API nad modelem |
| `schema.json` | JSON Schema 2020-12 | validace dat, generování kódu |
| `schema.xsd` | XSD (XML Schema) | validace XML, integrace, generování tříd |
| `model.sql` | SQL DDL (PostgreSQL) | založení databáze |
| `model.ttl` | RDFS/OWL + SKOS | ontologie, propojená data |
| `shapes.ttl` | SHACL | validace RDF dat proti modelu |
| `model.xmi` | XMI 2.1 (UML) | Enterprise Architect a jiné CASE nástroje |

### 23.4 Který cíl si vybrat

- **Chci to jen uschovat nebo přenést na jiný počítač** → **Uložit** (kap. 21)
- **Chci to někomu poslat, ať si to přečte** → Statický prohlížeč (kap. 27) nebo Dokument (kap. 24)
- **Chci s tím počítat v Excelu** → Tabulka (kap. 25.1)
- **Chci graf proměřit, ne nakreslit** → Diagram nebo graf → GraphML (kap. 25.3)
- **Chce to strojově zpracovat kolega nebo skript** → Data se schématem (kap. 26)
- **Chci část předat do jiného DKM projektu** → Balíček (kap. 28)
- **Chci předat, jak je to postavené, ne co v tom je** → export modelu (kap. 36)

### 23.5 Co ven nikdy nejde

- **Objekty entity** (přílohy) se do dokumentových exportů nedávají nikdy — ani do MD,
  DOCX, PDF, ani do formátovaného textu ve schránce (kap. 24.3)
- **GitHub token**, **API klíč k AI** a **tvoje jméno pro komentáře** žijí jen v prohlížeči.
  Nejsou v datech projektu, a tedy ani v žádném exportu.
- Do AI odchází **jen to, co si zaškrtneš** — nikdy celý projekt (kap. 35.3)

---

## 24. Export a tisk entit

V detailu entity tlačítko **🖨 Export / tisk**. Otevře dialog se zaškrtávátky pro sekce:

### 24.1 Volitelné sekce

- **Záhlaví** — název, ikona typu, badge typu, badges aspektů, badges stavu
- **Atributy typu** — každý samostatně (checkbox), tlačítka Vše / Nic
- **Atributy aspektu** — samostatná sekce pro každý aspekt entity
- **Vlastní atributy**
- **Vazby** — vazby ven, odkazuje sem
- **Metadata** — Typ entity, Vytvořeno, Upraveno, ID

### 24.2 Formáty výstupu

- **📋 Kopírovat MD** — surový Markdown do schránky
- **✨ Kopírovat formátované** — přes ClipboardItem s HTML + plain text. Vložení do Wordu, Outlooku, Gmailu zachová nadpisy, tučné, kurzívu, seznamy.
- **📥 Stáhnout MD** — soubor `NázevEntity.md`
- **📄 Stáhnout DOCX** — Word soubor. Skládá ho DKM samo, nic se nestahuje, takže export funguje i offline. Calibri, hierarchie nadpisů, odrážky u vazeb, CriticMarkup jako wordovské revize.
- **🖨 Tisk / PDF** — nové okno s vyrenderovaným HTML + auto `window.print()`. Přes prohlížeč tiskneš na papír nebo uložíš jako PDF.

### 24.3 Pravidla

- Prázdné hodnoty se přeskočí (i když je atribut zaškrtnutý)
- Archivované cílové entity vazeb se vyloučí
- Objekty entity se **nikdy neexportují** (ani do MD, DOCX, PDF, formátovaného copy)
- Textarea atributy v HTML / DOCX se rendrují jako Markdown (bold, listy, CriticMarkup)

### 24.4 Export výběru entit do jednoho dokumentu

Totéž pro víc entit najednou: v seznamu přepni do **režimu výběru** (klávesa V), zaškrtej
entity a zvol hromadnou akci **🖨 Export / tisk výběru**. Vznikne **jeden dokument** ve
stejných formátech jako u jedné entity.

**Pořadí je takové, v jakém jsou entity v seznamu** — ne v jakém jsi je naklikal. Řídí se
tedy aktivním řazením a filtry. Kdyby ve výběru zůstala entita, která v aktuálním seznamu
není (přepnul jsi mezitím záložku), připojí se na konec. V dialogu je pořadí vypsané, ať to
vidíš předem.

#### Titulek dokumentu

Nepovinné pole nahoře, předvyplněné názvem projektu. Když ho vyplníš, stane se z něj hlavní
nadpis a **nadpisy entit se posunou o úroveň níž** — dokument má tedy jednu H1 a entity jsou
H2, což je to, co čeká Word i navigační panel. Prázdný titulek = entity jdou rovnou za sebou,
každá jako H1, oddělené vodorovnou čarou (v DOCX zalomením stránky).

#### Výběr obsahu u smíšeného výběru

Když máš vybrané entity různých typů, dialog nabídne **sekci pro každý typ a každý aspekt,
které se ve výběru vyskytly**. U každého atributu je navíc vidět, **u kolika entit je vůbec
vyplněný** (`vyplněno u 2 z 5`) — poznáš tak, co má smysl zahrnout, a nemusíš to hádat.
Zaškrtnutí platí pro všechny entity daného typu či aspektu; entita, která atribut nemá,
ho prostě přeskočí.

Zbytek (vlastní atributy, vazby, zpětné odkazy, komentáře, metadata) je společný a u každé
položky je součet přes celý výběr, ať víš, kolik toho přibude.

Ostatní pravidla z 23.3 platí beze změny — prázdné hodnoty se přeskakují, objekty se
neexportují nikdy.

---

## 25. Export do tabulky, PlantUML a GraphML

### 25.1 Tabulkový export — XLSX, CSV, TSV

V dialogu **📤 Export dat** (kap. 23) zvol cíl **Tabulka**. Formát a **sloupce** si vybereš
rovnou tam — nedostaneš tedy všechno, ale právě to, co potřebuješ.

**Formát**

- **XLSX** — sešit pro Excel. Zamrzlá hlavička, automatický filtr, spočítané šířky sloupců,
  víceřádkové texty se zalamují. Volitelně **list na každý typ entity** — na listu typu pak
  zůstanou jen sloupce, které k němu patří.
- **CSV** — oddělovač si vybereš: **středník** (sedne českému Excelu) nebo **čárka**
  (standardní CSV). K tomu volba **desetinné čárky**, opět kvůli Excelu.
- **TSV** — oddělené tabulátorem. Čísla vždy s tečkou.

CSV i TSV začínají značkou BOM, jinak by Excel rozhodil diakritiku. **Import TSV** v DKM ji
umí přeskočit, takže kolečko *export → úprava v Excelu → import zpět* drží; ke spárování
s existujícími entitami stačí nechat ve výstupu sloupec **ID** (viz 25.2).

**Sloupce** jsou rozdělené do skupin — základní údaje, každý typ zvlášť, každý aspekt zvlášť,
vlastní atributy, a vazby s metadaty. U každého sloupce je vidět, **u kolika entit je
vyplněný**, a zaškrtávátkem **Jen vyplněné sloupce** schováš ty prázdné. Tlačítka Vše / Nic
platí na to, co je zrovna vidět.

Vlastní atributy se sdružují **podle názvu** — tři entity s vlastním atributem „Poznámka"
dají jeden sloupec, ne tři.

### 25.2 TSV / CSV import

Tlačítko **Import TSV** v hlavičce. Bere soubor (Excel → *Uložit jako* TSV/CSV) nebo řádky
vložené ze schránky. Oddělovač se detekuje sám — TAB, středník nebo čárka, podle toho, čeho
je v prvním řádku nejvíc.

**První řádek je hlavička** a rozhoduje o všem. Sloupce, kterým import nerozumí, tiše ignoruje.

#### Systémové sloupce

| Sloupec | Co dělá | Přijímá také |
|---|---|---|
| **Název** | povinný, název entity | Name, Title, Jméno, Titul |
| **Typ** | název typu entity | Type, Kategorie, Category |
| **Aspekty** | názvy aspektů, víc oddělených `;` nebo `,` | Aspects, Aspekt, Aspect |
| **ID** | interní ID pro spárování s existující entitou | Identifikátor |
| **Archiv** | `1` / `true` / `ano` / `yes` / `x` → archivovat | Archive, Archived, Archivováno |
| **Inbox** | totéž pro zařazení do Inboxu | Schránka |

Bez sloupce **Typ** entita skončí v Inboxu bez typu.

#### Sloupce s atributy

Název sloupce = název atributu. Aby bylo jasné, ke kterému typu či aspektu atribut patří,
zapiš ho ve tvaru **`Název typu / Název atributu`** nebo **`Název aspektu / Název atributu`**.

Příklad — entity typu *Vlastnost* s aspektem *Data* a jeho poli *Concept type* a *Data type*:

```
Název	Typ	Aspekty	Data / Concept type	Data / Data type
Rodné číslo	Vlastnost	Data	Identifikátor	string
Datum narození	Vlastnost	Data	Atribut	date
```

Prefix je nepovinný, ale **vyplatí se ho psát**. Bez něj import hledá atribut nejdřív u typu
entity a teprve pak u jejích aspektů — když má typ *Vlastnost* taky atribut *Concept type*,
hodnota bez prefixu skončí u typu, ne u aspektu. S prefixem `Data / Concept type` je to
jednoznačné. Dělí se na **prvním** lomítku, takže atribut s lomítkem v názvu takhle zapsat nejde.

> **Pozor na chybějící sloupec Aspekty.** Když ho vynecháš, hodnoty se do dat uloží, ale entita
> aspekt nedostane — a protože detail entity zobrazuje jen atributy svého typu a **přiřazených**
> aspektů, uvidíš prázdno. Data ti tam budou ležet naslepo. Sloupec `Aspekty` s názvem aspektu
> u každého řádku tedy není volitelný.

#### Hodnoty podle typu atributu

- **ano/ne** — `1`, `true`, `ano`, `yes`, `x` = ano; `0`, `false`, `ne`, `no` = ne
- **číslo** — desetinná čárka i tečka; co nejde převést, se přeskočí
- **vazba** — názvy cílových entit oddělené `;`; nenalezené se přeskočí, u jednohodnotové
  vazby se použije první nalezená
- **ostatní** — text tak, jak je; prázdná buňka se přeskočí (existující hodnotu nepřepíše)

#### Zakládá, nebo aktualizuje?

Entita se hledá podle sloupce **ID**, a když chybí, podle dvojice **Typ + Název**. Když se
najde, řádek ji **aktualizuje** — druhý import téže tabulky tedy nezaloží duplikáty.
Aspekty se při aktualizaci jen **přidávají**, nikdy neodebírají.

#### Kolečko přes XLSX export

Export do XLSX vyrábí hlavičku přesně v tomhle tvaru (`ID`, `Název`, `Typ`, `Inbox`, `Archiv`,
`Aspekty`, pak `Typ / Atribut` a `Aspekt / Atribut`), takže se dá exportovat, upravit v Excelu
a naimportovat zpět. Dvě výjimky: sloupce `Vazby`, `Vytvořeno` a `Upraveno` import ignoruje
a **vlastní atributy** (v exportu značené `* Název`) se zpátky nevytvoří — hvězdička se odřízne
a název se hledá mezi atributy typů a aspektů; když tam není, sloupec propadne.

### 25.3 Diagram a graf — PlantUML a GraphML

V dialogu **📤 Export dat** (kap. 23) zvol cíl **Diagram nebo graf**. Naváže dialog s:

- **Rozsahem**: aktuální seznam, výběr, všechny, typ, aspekt
- **Styl**: Class diagram (třídy s atributy), Component, Use case
- **Volby**: zahrnout atributy jako pole tříd, zobrazit vazby z atributů-relací (přerušovanou čarou), zahrnout externí cíle mimo rozsah (šedě)
- **Formát**: PlantUML, nebo **GraphML**
- **Živý náhled** vygenerovaného kódu

Výstup:

- **📋 Kopírovat** — do schránky
- **📥 Stáhnout** — `.puml` pro PlantUML, nebo `.graphml`

**PlantUML** je zdroj obrázku: escapované názvy, aliasy E0/E1/…, stereotypy podle typu
(`<<Osoba>>`), vazby z atributů čárkovaně. Hodí se na dokumentaci modelu a architektury.

**GraphML** je tentýž graf, ale ke zpracování, ne k obrázku. Otevřeš ho v **Gephi, yEd nebo
Cytoscape** a můžeš s ním počítat — centralita, komunity, shluky, cesty. Entity jsou uzly
(nesou název, typ, aspekty a volitelně hodnoty atributů), vazby jsou hrany (nesou název,
opačný název a údaj, jestli pocházejí z vazby nebo z atributu). Volba stylu diagramu se
u GraphML schová — ta patří PlantUML.

---

## 26. Export do datového JSON se schématem

### 26.1 K čemu to je

`.dkmdata` je serializace nástroje — všechno stojí na interních ID, aby to šlo zase načíst.
**Datový JSON** je opak: projekce dat ven, s klíči odvozenými z názvů typů a atributů, určená
k importu do dynamických JSON databází a k předání komukoliv, kdo o DKM nic neví.

Entita typu *Subjekt* skončí v kolekci `subjekt`, atribut *Příjmení* jako klíč `prijmeni`.
K datům se generuje **JSON Schema**, které popisuje **právě tento výstup** — ne celý datový
model projektu. Vše se stahuje jako jeden ZIP.

Export je **jednosměrný**. Na přenos mezi projekty DKM slouží balíčky (kap. 28).

### 26.2 Kde se spouští

- tlačítko **`{ }`** v panelu seznamu (exportuje aktuálně zobrazený seznam podle filtrů)
V dialogu **📤 Export dat** (kap. 23) zvol cíl **Data se schématem**. Rozsah už padl tam,
průvodce se na něj tedy podruhé neptá a začne rovnou volbou typů.

### 26.3 Průvodce

**Krok 1 — Rozsah.** Vybrané entity / aktuálně zobrazený seznam / celý projekt (bez archivu),
plus zaškrtání typů. Entity bez typu (Inbox) se dají přibrat do kolekce `_bez_typu`.
Nahoře se dá načíst uložený **profil exportu**.

**Krok 2 — Klíče.** Styl klíčů (`snake_case` výchozí, nebo `camelCase`) a jazyk systémových
polí (česky `nazev`/`typ`/`vazby`, nebo anglicky `name`/`type`/`relations`). Pod tím tabulka
všech odvozených klíčů k ručnímu přepsání. Zaškrtávátko **Uložit klíče do modelu** je zapíše
natrvalo (viz 26.7).

**Krok 3 — Obsah.** Režim vazeb, vlastní atributy, komentáře, objekty, nevyplněné atributy,
prázdné hodnoty jako `null`, soubor na kolekci.

**Krok 4 — Náhled a kontrola.** Souhrn, výsledek validace, upozornění a náhled `data.json`
i `schema.json`. Odsud se stahuje ZIP nebo ukládá profil.

### 26.4 Tvar výstupu

```json
{
  "$schema": "schema.json",
  "_meta": { "projekt": "Registr", "exportovano": "…", "verze_formatu": 1, "pocty": {...} },
  "subjekt": [
    {
      "id": "e_k3n1",
      "typ": "subjekt",
      "nazev": "Jan Novák",
      "prijmeni": "Novák",
      "datum_narozeni": "1980-04-12",
      "aspekty": ["gdpr"],
      "souhlas_platny_do": "2027-01-01",
      "vazby": { "pouziva": [ {"ref": "e_a91", "typ": "dokument", "nazev": "Smlouva"} ] }
    }
  ]
}
```

Atributy **aspektů** se vlévají do objektu naplocho vedle atributů typu; entita navíc nese
seznam `aspekty`. Když se klíč aspektového atributu potká s klíčem atributu typu, dostane
prefix slugem aspektu (`gdpr_prijmeni`).

### 26.5 Vazby

| Režim | Výstup |
|---|---|
| **Odkaz** (výchozí) | `{"ref": "…", "typ": "…", "nazev": "…"}` — čitelné bez joinu |
| Jen ID | `["e_a91"]` |
| Vnořený objekt | celý objekt cíle, hloubka 1, bez jeho vlastních vazeb |

Atributy typu „vazba" mají stejný tvar jako sekce `vazby`. Vazby na neexistující entitu se
vynechají a nahlásí. Zpětné odkazy se neexportují — jsou odvozené.

### 26.6 Schéma — jen to, co se použilo

Řídící pravidlo: **schéma musí validovat data, se kterými je zabalené.** Proto:

- do schématu jde jen typ, který má v exportu aspoň jednu entitu
- vlastnost jen tehdy, když je aspoň u jedné entity vyplněná (dá se přepnout)
- `required` jen u atributu vyplněného **u všech** exportovaných entit toho typu; jinak je
  nepovinný a průvodce to napíše mezi upozornění
- `enum` u výběrových atributů = hodnoty číselníku; hodnota v datech mimo číselník enum
  rozšíří a nahlásí se
- `format: date` / `format: uri` se doplní jen tehdy, když **všechny** hodnoty odpovídají

Před zabalením se spustí vestavěný validátor a jeho výsledek jde i do `README.md`.

### 26.7 Stabilita klíčů

Klíč se odvozuje z názvu, takže přejmenování atributu by změnilo klíč a rozbilo navazující
import. Proto má každý typ, aspekt, atribut i typ vazby nepovinné pole **Klíč v JSON**
(v nastavení u dané položky). Prázdné = odvodí se z názvu. Vyplněné = platí napevno.
Zaškrtávátko v kroku 2 průvodce vyplní tato pole podle aktuálně odvozených klíčů.

### 26.8 XML a XSD

Ve volbách průvodce si vybereš **formát souborů**: JSON + JSON Schema, XML + XSD, nebo obojí.
XML není druhá serializace — staví se **z téhož, už zvalidovaného JSON objektu** a prochází
se podle stejného schématu, ze kterého vzniká XSD. Pořadí prvků i omezení proto sedí
z principu, ne shodou okolností.

Pravidla převodu jsou jednoduchá:

| JSON | XML |
|---|---|
| objekt | prvek s podprvky |
| pole | prvek se stejným názvem se opakuje |
| skalár | textový obsah |
| `null` (při volbě „zahrnout prázdné") | `xsi:nil="true"` |
| vlastní atributy | vždy `<polozka klic="…">` — jejich názvy si píšeš ty a nemusí být platné XML jméno |

XSD není tolerantní: odmítne neznámý prvek, chybějící `id`, hodnotu mimo číselník, číslo
zapsané textem, špatný tvar data, cizí hodnotu u pevného `typ` i prohozené pořadí prvků.

`schema.json` zůstává v balíčku vždy — popisuje tentýž obsah a hodí se ke křížové kontrole.

### 26.9 Obsah ZIPu

| Soubor | Co je uvnitř |
|---|---|
| `data.json` | data, kolekce podle typu (nebo `data/<typ>.json` při volbě soubor na kolekci) |
| `schema.json` | JSON Schema draft 2020-12 pro tento výstup |
| `data.xml` + `schema.xsd` | při formátu XML — tatáž data a XSD, které je validuje |
| `mapovani.json` | převod interních ID na klíče — pro ladění a navazující nástroje |
| `README.md` | lidský popis: co je uvnitř, tabulka mapování, upozornění, výsledek validace |

### 26.10 Profily exportu

Nastavení průvodce se dá uložit jako pojmenovaný **profil** (drží se v datech projektu),
aby opakovaný export do stejné databáze dopadl vždycky stejně.

---

## 27. Statický prohlížeč

DKM umí vygenerovat **statický HTML prohlížeč** dat projektu — jeden soubor, který otevřeš a máš read-only přístup ke všem entitám.

### 27.1 Generování

V dialogu **📤 Export dat** (kap. 23) zvol cíl **Statický prohlížeč**. Stáhne se soubor
s vloženými daty projektu. Bere vždycky celý projekt, rozsah se na něj nevztahuje.
V **Nastavení → Projekt** je na totéž zkratka.

Statický prohlížeč má:

- Seznam entit
- Detail entity
- Hledání
- Základní filtry
- Read-only režim (žádné úpravy)

Použitelné pro:

- **Sdílení dat** s někým, kdo nemá DKM
- **Archivní snímek** stavu projektu k danému datu
- **Publikace** na web (třeba GitHub Pages)

### 27.2 Výchozí entita

V dialogu generování můžeš zvolit entitu, na které se statický prohlížeč otevře.

### 27.3 Jazyk a motiv v prohlížeči

Vygenerovaný prohlížeč má vpravo nahoře stejné menu **⚙ Přizpůsobit** jako aplikace,
se stejnou nabídkou jazyků (Čeština / English) a motivů (Světlý / Tmavý / Papír / Matrix).

Volba se ukládá do prohlížeče toho, kdo soubor otevřel (klíče `dkm-viewer-lang`
a `dkm-viewer-theme`) — **nezapisuje se do vygenerovaného souboru**. Každý příjemce si tedy
nastaví svoje, aniž by tím měnil to, co jsi rozeslal, a při dalším otevření téhož souboru
mu to zůstane. Jazyk, ve kterém prohlížeč generuješ, je jen výchozí hodnota pro toho,
kdo si ještě nevybral; bez uložené volby se motiv poprvé řídí nastavením systému.

---

## 28. Přenos částí mezi projekty (balíčky)

### 28.1 Formát balíčku

`.dkmpkg` je JSON, který obsahuje **výběr entit + jejich datový model** (jen ty typy, aspekty, seznamy a relační typy, které vybrané entity potřebují). Umožňuje přenést kus jednoho projektu do druhého bez zbytečnosti.

### 28.2 Export balíčku

V bulk režimu vybereš entity, akce **📦 Export balíčku**. Wizard:

1. **Rozsah**: jen vybrané / vybrané + sousedy (přes vazby) / celá komponenta (grafové sousedství)
2. **Model**: typy, aspekty, seznamy a relace, které se přenesou
3. **Preview**: přehled, co se v balíčku octne

Stáhne se `.dkmpkg`.

### 28.3 Import balíčku

**Nastavení → Projekt → Přenos mezi projekty → Importovat balíček**. Nahraješ `.dkmpkg`. Wizard:

- Shrnutí obsahu
- Kontrola konfliktů (existující typy, atributy)
- Automap: matchování atributů podle názvu + typu
- Preview změn
- Backup před importem (checkbox default zapnutý — stáhne se aktuální projekt jako `.dkmdata` před importem)

#### Když už entita v projektu je

Entity si v balíčku **nesou svoje ID**, takže opakovaný import týchž dat je pozná. Krok
*Konflikty* vypíše každou takovou entitu a u ní, **co se liší** proti tomu, co už v projektu
je — nebo že je beze změny.

Podle toho se předvyplní akce — a **liší se to podle režimu průvodce**:

| Situace | Easy | Podrobný |
|---|---|---|
| V projektu je totéž | Přeskočit | Přeskočit |
| Něco se liší | **Přepsat** — vyhrává balíček | **Doplnit do existující** |

Easy krok s konflikty vůbec neukazuje, takže tam platí, co člověk čeká: **data z balíčku
vyhrávají**. Podrobný režim ti je vypíše a nechá rozhodnout, proto je tam opatrnější výchozí
volba, která tvoje úpravy nepřepíše. Entity, které jsou úplně stejné, se přeskočí v obou
režimech — přepisovat je čím, když je to totéž, by jen zbytečně změnilo datum úpravy.

Nabízené akce:

- **⊕ Doplnit do existující** — entita zůstane, jak je. Doplní se **jen to, co v ní chybí**:
  prázdné atributy, chybějící aspekty, vazby, které tam ještě nejsou. Tvoje úpravy zůstanou.
- **♻ Přepsat** — obsah z balíčku nahradí to, co v projektu je
- **❌ Přeskočit** — entita se neimportuje vůbec
- **🆕 Vytvořit novou** — vznikne kopie s novým ID. Použij, jen když opravdu chceš dva záznamy.

Nahoře je i **Nastavit všem najednou**, ať u velkého balíčku neklikáš po jedné.

#### Balíček z cizího projektu

Když balíček nepochází z tohoto projektu, entity mají jiná ID a shoda podle ID nic nenajde —
všechno by se naimportovalo jako nové. Pro ten případ je v podrobném režimu zaškrtávátko
**Spárovat i podle názvu, když nesedí ID**. Páruje na entitu se shodným názvem (bez ohledu na
velikost písmen a diakritiku) a u takové dvojice to i napíše. **Nejednoznačné názvy se
přeskočí** — když je v projektu „Jan" dvakrát, nemá průvodce jak poznat, který z nich je ten
pravý, a raději nespáruje nic. V easy režimu se podle názvu nepáruje.

Klik na Import provede dvouprůchod:

1. Entity se založí, doplní nebo přepíšou podle zvolené akce
2. Vazby a relační atributy se přemapují na cílová ID; při doplňování se **tatáž vazba
   nezaloží podruhé**

---

## 29. Nastavení

### 29.1 Projekt

- Název, popis
- **Načíst projekt z adresy (URL)** — načte projekt z libovolné adresy a vyrobí odkaz `?open=…` (viz 21.6)
- GitHub cesta
- Statický prohlížeč (generování)
- Přenos mezi projekty (import balíčku)
- Úložiště projektu (info o session storage + Začít prázdný projekt)

### 29.2 Typy

Seznam typů, klikem se otevře editor s atributy, ikonou, názvem a nepovinným
polem **Klíč v JSON** (viz kap. 26.7). Totéž pole má i každý atribut.

Pořadí typů měníš tlačítky **↑↓** u každého řádku, nebo řádek chytneš myší
a přetáhneš na jiné místo. Obě cesty dělají totéž — přetahování je tu navíc
pro toho, komu se s myší pracuje rychleji.

### 29.3 Aspekty

Analogicky pro aspekty, včetně pole **Klíč v JSON**, včetně změny pořadí
tlačítky **↑↓** i přetažením.

### 29.4 Vazby

Definice relačních typů: název, opačný název, scope, povolené typy zdroje / cíle
a **Klíč v JSON**.

### 29.5 Seznamy

Číselníky s výčtem hodnot. Používají se v atributech typu „výběr ze seznamu" —
atribut se na číselník odkáže v jeho editoru.

### 29.6 Uložené pohledy

Správa všech uložených pohledů: přejmenovat, změnit ikonu, přepnout pin, přepsat aktuálním filtrem, smazat.
Tlačítka **↑↓** mění jejich pořadí, a tím i pořadí jejich záložek nahoře.

### 29.7 Záložky

Které typy a které aspekty se zobrazují jako záložka v hlavním toolbaru.
Zapnuté položky jsou nahoře v tom pořadí, v jakém jdou záložky za sebou, a tlačítka
**↑↓** u nich pořadí mění. Totéž svede přetažení záložky přímo v hlavním toolbaru.

Přetahovat jde jen v rámci jedné skupiny — typ mezi typy, aspekt mezi aspekty,
uložený pohled mezi uloženými pohledy. Schránka, Vše a Archiv mají pevné místo.
Na dotykových zařízeních přetahování nefunguje; tlačítka **↑↓** ano vždycky.

### 29.8 GitHub

Personal access token pro GitHub API. Uložený v localStorage prohlížeče (per-origin).

### 29.9 AI

Poskytovatel, API klíč a model pro AI asistenta — viz kap. 35.2.

### 29.10 Model

Přehled datového modelu a jeho export do standardních formátů — viz kap. 36.

### 29.11 Duplicity

Najde entity, které mají **stejný název**, ukáže je vedle sebe a nabídne řešení.

**Shoda názvu** — buď volná (výchozí: nezáleží na velikosti písmen, diakritice ani mezerách
navíc, takže „Praha", „praha" i „Praha " jsou totéž), nebo přesná znak po znaku. U každé
skupiny je vidět, o který případ jde.

**Zaškrtávátka** — hledat jen v rámci jednoho typu, zahrnout archiv, ukázat i řádky, které
jsou u všech prázdné.

**Porovnání** je tabulka: řádky jsou údaje, sloupce jednotlivé entity. Vypíšou se název, typ,
aspekty, všechny atributy, které má aspoň jedna z nich vyplněné, vlastní atributy, vazby,
počet zpětných odkazů a komentářů, datum úpravy a ID. **Řádky, ve kterých se entity liší, jsou
podbarvené** — na první pohled tak vidíš, co je jinak.

**Řešení** — u každé entity tlačítka *Otevřít* a *Přejmenovat*, pod tabulkou **Sloučit entity**.
Slučuje se stejnou cestou jako hromadná operace (kap. 13.1): vybereš, která entita zůstane a co
udělat s odlišnými hodnotami, vazby vedoucí na zrušené entity se přesměrují. Po sloučení
i přejmenování zůstaneš na kartě Duplicity a seznam se přepočítá.

### 29.12 Obecné

- **Jazyk** (Čeština / English)
- **Motiv** — Světlý / Tmavý / Papír / Matrix, totéž co v menu ⚙ Přizpůsobit
- **Tvoje jméno pro komentáře** — bere se jako autor u nových komentářů. Ukládá se **jen do tohoto prohlížeče** (klíč `dkm-username`, stejně jako GitHub token), ne do dat projektu — nad jedním projektem tak může pracovat víc lidí a každý se podepíše sám za sebe. Starší projekt, který jméno nesl v datech, ho při načtení jednorázově převezme do prohlížeče (pokud tam ještě žádné není) a z dat ho vypustí.
- **Nabízet wiki odkazy při uložení entity** — po uložení nabídne názvy jiných entit nalezené ve víceřádkových atributech k převodu na `[[odkaz]]` (viz 15.4). Ukládá se jen do tohoto prohlížeče (klíč `dkm-wiki-suggest`).
- **Zvuková odezva u ukládání na GitHub** — krátký stoupavý tón po úspěšném uložení, temnější klesavý po neúspěchu. Tóny se generují přímo v prohlížeči přes Web Audio API, nic se nestahuje, takže to funguje i offline. Vedle zaškrtávátka jsou tlačítka, kterými si oba zvuky poslechneš. Ukládá se jen do tohoto prohlížeče (klíč `dkm-sound`).
- **Autosave** — automatické ukládání do sessionStorage (per záložka)
- **Debug** — zapne panel s debug logy dole

### 29.13 Statistiky

Přehled počtů: entit, typů, atributů, aspektů, vazeb, komentářů.

### 29.14 Nápověda

Odkazy na online dokumentaci a repozitář.

---

## 30. Klávesové zkratky

### Globální

| Zkratka | Akce |
|---------|------|
| Ctrl+S | Uložit (soubor / GitHub) |
| Ctrl+F | Otevřít pokročilé filtry |
| Ctrl+Shift+F | Zavřít pokročilé filtry a vyčistit |
| Ctrl+P | Rychlá paleta |
| Ctrl+T | Nový panel |
| Ctrl+W | Zavřít aktivní panel |
| Ctrl+Shift+O | Načíst projekt ze schránky |
| Ctrl+Shift+S | Vložit projekt do schránky |
| Ctrl+K | Fokus na hledání |
| Esc | Zavřít dialog / opustit režim |

### Navigace

| Zkratka | Akce |
|---------|------|
| i | Přejít na Inbox |
| a | Přejít na Vše |
| n | Nová entita (s výběrem typu) |
| q | Rychlé přidání do Inboxu |
| s | Uložit (soubor / GitHub) |

### Přístupové klávesy (accesskey)

Fungují i v textových polích. Konkrétní kombinaci určuje prohlížeč — obvykle **Alt+**,
ve Firefoxu **Alt+Shift+**, na macOS **Ctrl+Alt+**.

| Klávesa | Akce |
|---------|------|
| Alt+L | Načíst projekt ze souboru |
| Alt+S | Uložit |
| Alt+N | Nová entita (tlačítko v seznamu) |
| Alt+A | Záložka Vše |
| Alt+B | Zpět (v detailu, editoru, nastavení) |
| Alt+R | Přidat vazbu (v detailu entity) |
| Alt+U | Uložit editaci (v editoru) |

### Seznam

| Zkratka | Akce |
|---------|------|
| f | Fokus na hledání |
| / | Fokus na hledání |
| v | Přepnout režim výběru |

### Detail

| Zkratka | Akce |
|---------|------|
| e | Editovat |
| r | Přidat vazbu |
| c | Fokus na comment input |

### Editor

| Zkratka | Akce |
|---------|------|
| u | Uložit editaci |
| Esc | Zrušit editaci |

### Komentáře

| Zkratka | Akce |
|---------|------|
| Ctrl+Enter v textarea | Odeslat komentář |

---

## 31. Přístupnost

DKM je navrženo tak, aby fungovalo se screen readerem.

- **Sémantické nadpisy**: hlavní nadpis stránky (H1) je vždy název obsahu (entita, pohled, sekce nastavení), ne aplikace
- **Žádné treeview** (`role=tree/treeitem`) — hierarchie jsou nested `<ul>/<li>`
- **Žádné position: sticky / fixed** na velkých oblastech
- **ARIA labels** na nezřejmých interaktivních prvcích
- **Klávesová navigace** (viz kap. 30)
- **Screen reader announcements** minimalizované — jen krátká potvrzení akcí (Uloženo, Přidáno), ne re-render polí

### 31.1 Pole s vazbou

Atribut typu **vazba** není jedno pole, ale skupina: filtr typu, filtr textu, seznam na výběr
a tlačítko pro potvrzení. Aby bylo při procházení formuláře pořád jasné, který atribut
vyplňuješ, **nese název atributu každý prvek té skupiny** — přečteš si tedy „Používá systémy —
filtr typu", „Používá systémy — výběr" a tak dál, ne jen „filtr typu". Skupina jako celek je
`role="group"` se jménem atributu.

Totéž řeší **ano/ne** (skupina přepínačů `role="radiogroup"` se jménem atributu) a **výběr ze
seznamu bez přiřazeného číselníku** — ten je teď zakázané pole s vysvětlením, ne jen text,
takže má jméno i stav. Atribut, který nemá vyplněný název, se ohlásí jako *Atribut bez názvu*
místo ničeho.

### 31.2 Kam jde focus po odebrání

Když odebereš vybranou entitu nebo vazbu křížkem, tlačítko, na kterém stojíš, tím okamžikem
zmizí. Focus proto **přeskočí na další křížek** v řadě, a když žádný nezbyl, na seznam na výběr
(u vazby na tlačítko Přidat vazbu). Nikdy nespadne na začátek stránky.

### 31.3 Rychlá paleta

Screen reader-kompatibilní: ARIA combobox, listbox, aria-activedescendant, aria-selected na aktivní položce.

### 31.4 Kanban

Karty nejsou drag-and-drop (nedostupné pro screen reader). Místo toho **dropdown Přesunout do** pro každou kartu.

---

## 32. Tipy a triky

### 32.1 Rychlý workflow

1. Denně otevři aplikaci s `?id={ghPath}` (bookmark) — projekt se automaticky natáhne z GitHubu
2. Ctrl+P → napiš pár písmen názvu entity → Enter — okamžitě jsi v detailu
3. Klávesa `e` — editace
4. Klávesa `u` — uložení editace
5. Ctrl+S → push na GitHub

### 32.2 Použití panelů

- Panel 1 = seznam projektu (kontext)
- Panel 2 = detail rozpracované entity
- Panel 3 = detail entity, se kterou porovnávám

Ctrl+T pro nový, klik na tab pro přepnutí.

### 32.3 Wiki-linky místo formálních vazeb

Pokud se nechceš zdržovat vytvářením formální vazby, prostě napiš `[[Název entity]]` v textareu. V sekci Odkazuje sem se odkaz automaticky objeví.

### 32.4 Kanban pro schvalovací workflow

Vytvoř aspekt „Schvalování" s atributem „Status" (select: Nový / V řešení / Schválené / Zamítnuté). Přiřaď aspekt entitám. Přepneš seznam na Kanban podle „Status". Přesouváš karty přes dropdown = měníš status. Ulož jako připnutý pohled 🔥 Schvalování a máš ho v toolbaru na klik.

### 32.5 PlantUML dokumentace modelu

Pro externí dokumentaci datového modelu:

1. Vyber entity (nebo použij aspekt)
2. Tlačítko **Export** → cíl **Diagram nebo graf**
3. Class diagram + zahrnout atributy
4. Stáhnout .puml
5. Vlož do PlantUML editoru → obrázek

### 32.6 Diff před uložením

Než klikneš Ctrl+S:

1. Klik na indikátor ● Neuložené změny
2. Prohlédni diff
3. Zjistíš, jestli je změna přesně to, co jsi zamýšlel

### 32.7 Sloučení duplicit

Když najdeš dvě entity, které jsou vlastně stejná věc:

1. Klávesa V — bulk režim
2. Zaškrtni obě
3. Akce ⇢ Sloučit entity
4. Vyber cíl, strategii pro konflikty
5. Sloučit — všechny vazby a atributy se přesměrují automaticky

### 32.8 Rychlé přepnutí mezi projekty

- V hlavním okně otevři projekt A
- **Ctrl+Shift+S** — zkopíruj do schránky
- Nová záložka → **Ctrl+Shift+O** → projekt A se otevře i v druhé záložce
- V druhé záložce načti projekt B ze souboru

Máš oba projekty naráz, každý v jiné záložce.

---

## 33. Časté problémy

### 33.1 „Nevidím své entity"

- Zkontroluj filtry v toolbaru — možná máš aktivní filtr, který skrývá vše. Klik na Vyčistit filtry.
- Podívej se do záložky Archiv — možná jsou archivované
- Zkontroluj pokročilé filtry (⚙ Pokročilé filtry) — možná mají neplatné pravidlo

### 33.2 „Zavřel jsem záložku a projekt zmizel"

Projekt žije jen v sessionStorage. Pro trvalé uložení:

- Ctrl+S — uložit do souboru
- Nastavit GitHub cestu a Ctrl+S — uložit na GitHub
- Bookmarknout URL `?id={base64ghPath}` pro rychlý autoload

### 33.3 „Prohlížeč nedovolil přístup do schránky"

- Zkus znovu, možná byl focus problém
- Nebo použij dialogový fallback (DKM ho ukáže automaticky)

### 33.4 „PlantUML export nevypadá dobře"

- Zkontroluj rozsah — možná máš moc entit
- Zkus jiný styl (Component / Use case je jednodušší)
- Vypni atributy, když je jich moc

### 33.5 „Diff je prázdný, ale mám neuložené změny"

- Baseline se nastaví jen po uložení nebo načtení. Pokud jsi ještě neuložil, diff nemá s čím porovnat.
- Uložit → od té chvíle se změny sledují proti tomu bodu.

### 33.6 „Samostatné okno se neotevře"

- Prohlížeč blokuje pop-upy — povol vyskakovací okna pro DKM
- Zkontroluj panel oznámení prohlížeče (obvykle vpravo od adresního řádku)

---

## 34. Technické pozadí

### 34.1 Datová struktura

Projekt je jeden JSON dokument. Tady je jeho obrys; závazný popis obou formátů
včetně strojových schémat je v kapitole 37:

```
{
  version, projectName, projectDescription, ghPath,
  settings: { visibleTypeTabs, visibleAspectTabs },
  entityTypes: [{ id, name, icon, jsonKey?, attributes: [{ id, name, type, required, showInList, listId?, jsonKey?, ... }] }],
  aspects: [{ id, name, jsonKey?, attributes: [...] }],
  relationTypes: [{ id, name, inverseName, scope, fromTypes, toTypes, jsonKey? }],
  selectLists: [{ id, name, values }],
  savedViews: [{ id, name, icon, pinned, filter, sort, tab, displayMode, ... }],
  jsonExports: [{ id, name, cfg }],
  entities: [{
    id, name, typeId, inInbox, archived,
    attributes: { attrId: value },
    customAttributes: [{ id, name, type, value }],
    aspects: [aspectId],
    relations: [{ id, relationTypeId, targetId }],
    objects: [{ id, name, content }],
    comments: [{ id, content, author, createdAt, editedAt? }],
    createdAt, updatedAt
  }]
}
```

### 34.2 Úložiště v prohlížeči

- **sessionStorage['dkm-session-data']** — aktuální projekt, per záložka. Refresh přežije, zavření záložky ne.
- **BroadcastChannel 'dkm-sync'** — live synchronizace mezi otevřenými okny.
- **localStorage** — jen předvolby, nikdy data projektu:

| Klíč | Co drží |
|---|---|
| `dkm-lang` | jazyk rozhraní |
| `dkm-theme` | grafický motiv |
| `dkm-username` | jméno autora komentářů |
| `dkm-autosave`, `dkm-debug`, `dkm-sound`, `dkm-wiki-suggest` | přepínače v Nastavení → Obecné |
| `dkm-ai-provider`, `dkm-ai-key`, `dkm-ai-model` | napojení na AI (viz kap. 35) |
| `dkm-github-token` | GitHub PAT (per origin) |
| `dkm-handoff-…` | krátkodobé předání dat do samostatného okna |
| `dkm-viewer-lang`, `dkm-viewer-theme` | volby ve vygenerovaném statickém prohlížeči |

### 34.3 GitHub API

DKM používá Contents API pro čtení + Git Data API (blobs) pro zápis velkých souborů. Token je uložený v `localStorage['dkm-github-token']` (per origin).

### 34.4 Rendering

Vanilla JavaScript, žádný framework. Šablony jako přímé DOM manipulace. Full re-render při každé změně stavu (rychlé i pro tisíce entit).

### 34.5 Testování

V repozitáři není automatizovaná testovací sada — DKM je jeden HTML soubor bez build kroku.
Změny se ověřují průchodem aplikace podle kontrolního seznamu v `dkm/CLAUDE.md`: typy, aspekty
a atributy všech druhů → entity, vazby, komentáře, objekty → pravidlový filtr a uložený pohled →
kanban a časová osa → hromadné operace včetně sloučení → export balíčku a jeho import průvodcem →
export MD, DOCX, XLSX, PlantUML a datového JSON → statický prohlížeč → GitHub → dvě záložky
současně → samostatné okno → přepnutí CS/EN a všechny motivy.

---

## 35. AI asistent

### 35.1 K čemu to je

DKM umí poslat obsah entity (nebo celého výběru) jazykovému modelu a povídat si o něm —
shrnutí, hledání rozporů, návrh struktury, cokoliv. Výsledek je Markdown, který si zkopíruješ
nebo z něj rovnou založíš entitu v Inboxu.

### 35.2 Nastavení

**Nastavení → AI**:

- **Poskytovatel** — zatím Google Gemini
- **API klíč** — uloží se **jen do tohoto prohlížeče** (klíč `dkm-ai-key`), stejně jako
  GitHub token. Neputuje v datech projektu a nikde se nevypisuje, ani do debug logu.
- **Model** — název modelu. Tlačítkem **⟳ Načíst modely** si necháš vypsat modely, které
  tvůj klíč skutečně umí použít, a vybereš z nabídky. Nemusíš tedy hádat, jak se právě
  teď model jmenuje.
- **Vyzkoušet spojení** — pošle jednu krátkou zprávu a ukáže, co se vrátilo

### 35.3 Co se posílá ven

Do služby poskytovatele odchází **jen to, co si zaškrtneš**, a text tvých zpráv. Nikdy se
neposílá celý projekt ani GitHub token. Tlačítkem **Zobrazit, co se odešle** si obsah
prohlédneš přesně tak, jak půjde ven.

### 35.4 Dotaz nad jednou entitou

V detailu entity tlačítko **🤖 Zeptat se AI**. V dialogu:

- sbalená sekce **Co se pošle jako kontext** — stejná zaškrtávátka jako u exportu, tedy
  atributy typu, atributy aspektů, vlastní atributy, vazby, zpětné odkazy a komentáře;
  vedle je vidět velikost kontextu ve znacích
- pole se zadáním dole, **Ctrl+Enter odesílá**
- rozhovor nad ním — tvoje zprávy i odpovědi modelu vykreslené jako Markdown

**Zaškrtnutí platí pro každou odeslanou zprávu.** Když je během rozhovoru změníš, další
zpráva půjde s novým kontextem — dá se tak modelu doplnit něco, co jsi zprvu neposlal.

### 35.5 Dotaz nad výběrem

V seznamu přepni do režimu výběru (klávesa V) a zvol hromadnou akci **🤖 Zeptat se AI**.
Kontext se skládá ze všech vybraných entit v pořadí, v jakém jsou v seznamu, a sekce
zaškrtávátek se nabízejí po typech a aspektech, které se ve výběru vyskytly — stejně jako
u exportu výběru (kap. 24.4).

### 35.6 Co s odpovědí

Pod každou odpovědí jsou dvě tlačítka:

- **📋 Kopírovat MD** — odpověď do schránky jako Markdown
- **📥 Založit do Inboxu** — vytvoří novou entitu v Inboxu; název se nabídne podle prvního
  nadpisu odpovědi a text se uloží jako vlastní atribut

Rozhovor **přežije zavření dialogu** v rámci načtené stránky — omylem zavřený dialog tedy
neznamená ztrátu konverzace. Do dat projektu se ale neukládá a s obnovením stránky zmizí.
Tlačítko **Nový rozhovor** ho vymaže dřív.

---

## 36. Datový model a jeho export

### 36.1 K čemu to je

**Nastavení → Model** ukazuje na jednom místě celé schéma projektu — typy, aspekty,
atributy, číselníky a vazby — a umí ho vyexportovat do standardních formátů, ve kterých
si ho přečtou jiné nástroje: OpenAPI, JSON Schema, SQL, RDF/OWL, SHACL, XMI.

Nepleť si to s kapitolou 25. Tam se exportují **data** (entity) a schéma je jen přiložené,
aby se dala ověřit. Tady jde **jen o schéma** — žádná entita ven nejde, ani její název.
Ven jde popis toho, jak je projekt postavený.

Hodí se, když model potřebuješ předat vývojáři, architektovi, do Enterprise Architectu,
nebo si z něj chceš nechat založit databázi.

### 36.2 Přehled modelu

Horní část karty je čitelný výpis modelu:

- **Souhrn** — kolik je typů, aspektů, vazeb, číselníků a atributů celkem
- **Typy** — každý rozklikneš a uvidíš jeho atributy (název, klíč, datový typ, povinnost,
  navázaný číselník) a vazby, které z něj vedou. V řádku typu je i to, **kolik entit** ho
  reálně používá — dobře se tím pozná typ, který jsi kdysi založil a nikdy nepoužil.
- **Aspekty** — atributy aspektu a počet entit, které aspekt nesou
- **Vazby** — odkud → kam, opačný název a kolikrát je vazba v datech skutečně použita.
  Kde není omezení na konkrétní typy, stojí „libovolný".
- **Číselníky** — hodnoty a počet atributů, které číselník používají
- **Varování** — co by mohlo export zkomplikovat: atribut bez názvu, atribut typu výběr
  bez přiřazeného číselníku, prázdný nebo nepoužívaný číselník, kolize klíče mezi aspektem
  a typem, projekt bez jediného typu

Varování nic neblokují — export proběhne. Jsou to místa, kde model něco nedopověděl a
generátor musel něco domyslet.

### 36.3 Základní IRI

RDF výstupy (OWL, SKOS, SHACL) potřebují jmenný prostor. Pole **Základní IRI** se ukládá
**do dat projektu** (na rozdíl od jazyka nebo motivu), aby všem, kdo model exportují,
vycházely stejné identifikátory. Když ho necháš prázdné, odvodí se z názvu projektu —
na první pokus to stačí, ale pro cokoliv, co se má publikovat, si nastav vlastní
(např. `https://firma.cz/model/`).

Pod ním je zaškrtávátko **Kompatibilita s OWL 2 DL**. Datum se v RDF přirozeně zapisuje jako
`xsd:date` — jenže ten leží mimo datovou mapu OWL 2 DL, takže reasonery typu HermiT takovou
ontologii odmítnou načíst. Zaškrtnutím se v OWL i SHACL použije `xsd:dateTime` a ontologie
projde reasonerem. Nezaškrtnuté je sémanticky přesnější a sedí na export dat i na JSON Schema,
kde je datum datum. Přepínač mění **oba** RDF výstupy najednou, aby si nikdy neodporovaly.

### 36.4 Klíče

Klíče (`kod_takto`) se odvozují **úplně stejně jako u exportu dat** (kap. 26.7): snake_case
bez diakritiky, s možností přepsat je nepovinným polem **Klíč v JSON** u typu, aspektu,
atributu i typu vazby. Díky tomu vygenerované OpenAPI a JSON Schema sedí na to, co
skutečně vyleze z exportu dat — jedno se dá použít k validaci druhého.

Když atribut přejmenuješ, klíč se změní. Právě proto se u modelu, který už někam odešel,
vyplatí klíče zafixovat.

### 36.5 Formáty

Přepínačem si vybereš formát, hned pod ním vidíš náhled výstupu.

| Soubor | Formát | K čemu |
|---|---|---|
| `model.md` | Dokumentace (MD) | Čitelný popis modelu pro lidi — typy, atributy, aspekty, vazby, číselníky |
| `openapi.yaml` | OpenAPI 3.1 | Popis REST API nad modelem: schémata plus cesty `list/create/get/update/delete` pro každý typ |
| `schema.json` | JSON Schema 2020-12 | Validační schéma; aspekty jsou samostatná `$defs` skládaná přes `allOf` |
| `schema.xsd` | XSD (XML Schema) | Totéž pro XML; aspekt je `xs:group`, protože tak se v XSD skládá do typu |
| `model.sql` | SQL DDL | PostgreSQL: tabulka `entita`, tabulka na každý typ i aspekt, tabulky číselníků, `typ_vazby` + `vazba` a spojovací tabulky pro relační atributy |
| `model.ttl` | RDFS/OWL + SKOS | Ontologie v Turtle: třídy, vlastnosti, k tomu číselníky jako SKOS koncepty |
| `shapes.ttl` | SHACL | Tvary odpovídající třídám z OWL — validace RDF dat proti modelu |
| `model.xmi` | XMI (UML) | UML model pro Enterprise Architect a další CASE nástroje: třídy, atributy, asociace, výčty |

### 36.6 Stažení

- **📋 Kopírovat** — aktuálně zobrazený formát do schránky
- **📥 Stáhnout soubor** — jen ten jeden soubor
- **📦 Stáhnout vše (ZIP)** — všech sedm souborů plus `README.md` s přehledem, datem
  vygenerování, základním IRI a případnými varováními

Náhled v okně je u velkých modelů zkrácený, ale kopírování i stažení berou celý obsah.

### 36.7 Jak se model překládá

Datový model DKM má pár věcí, které v cílových formátech přímý protějšek nemají. Stojí za
to vědět, jak se to řeší:

- **Aspekt je průřezový**, dá se přidat k entitě libovolného typu. V SQL je proto z aspektu
  samostatná tabulka navázaná na `entita`, ne sloupce v tabulce typu. V JSON Schema je
  z něj `$defs` skládané do typu přes `allOf` + `unevaluatedProperties: false`. V OWL a UML
  je to samostatná třída.
- **Stejně pojmenovaný atribut u dvou typů je v RDF jiná vlastnost.** Kdyby se sloučily,
  `rdfs:domain` u obou tříd by v OWL znamenal *průnik* — tedy „jen entita, která je obojí" —
  což je něco jiného, než co model říká. Vlastnosti proto nesou klíč vlastníka
  (`:subjekt_stav`, `:system_stav`) a SHACL to zrcadlí v `sh:path`.
- **Omezení vazby na typy** (scope) se v SQL vyjádřit nedá — spojovací tabulka umí
  cizí klíče, ne „jen z těchto typů". Omezení se proto zapíše na konec DDL jako komentář
  s poznámkou, že to musí hlídat aplikace nebo trigger. V OpenAPI, OWL a SHACL se omezení
  promítne do rozsahu / `sh:class`.
- **Prázdný seznam povolených typů znamená „libovolný"**, ne „žádný" — v přehledu i ve
  výstupech se to tak i chová.
- **Vlastní atributy** (ty, které si přidáš jen na jedné entitě) do modelu nepatří —
  nejsou součástí schématu, jsou to data.
- **Třída `Entita` je společný předek.** V SQL je to tabulka `entita`, v OWL třída `:entita`,
  ke které jsou typy `rdfs:subClassOf`, v UML třída, ze které typy dědí. Nese to, co má každá
  entita bez ohledu na typ: `id`, `nazev`, `inbox`, `archiv`, `vytvoreno`, `zmeneno`.
- **Univerzální vazba se v UML kreslí jednou**, mezi `Entita` a `Entita`. Kdyby se rozepsala
  na všechny dvojice typů, dostaneš z osmi typů 64 asociací a diagram se nedá číst.
- **Hodnoty číselníku jsou v RDF koncepty SKOS**, ne řetězce. SHACL to říká stejně
  (`sh:in` s IRI konceptů), takže OWL a SHACL popisují tatáž data. Kdyby jeden mluvil
  o řetězcích a druhý o konceptech, neexistoval by dataset, který projde oběma.
- **XMI si primitivní typy definuje samo.** UML 2.1 zná jen `String`, `Boolean`, `Integer`
  a `UnlimitedNatural` — odkaz na `Date` nebo `Real` do standardní knihovny by se v žádném
  nástroji nerozřešil. Soubor je proto samonosný.
- **Konce asociací mají vždy vypsanou násobnost.** Bez ní UML rozumí `1..1`, což by
  znamenalo, že každá entita tu vazbu mít musí — a to model neříká.

### 36.8 Jak jsou výstupy ověřené

Každý formát prochází skutečným nástrojem svého světa, ne jen kontrolou „vypadá to rozumně":

| Soubor | Čím je ověřený |
|---|---|
| `openapi.yaml` | oficiální validátor OpenAPI 3.1 |
| `schema.json` | metaschéma draftu 2020-12; k tomu se proti němu validuje ukázková entita a kontroluje se, že chybějící povinný atribut, hodnota mimo číselník i neznámý klíč **neprojdou** |
| `schema.xsd` | validátor XML Schema (libxml2) |
| `model.sql` | parser PostgreSQL |
| `model.ttl` | RDF parser; navíc se hlídá, že žádná vlastnost nemá dvě domény a že každý obor je deklarovaná třída nebo XSD typ |
| `shapes.ttl` | reálná SHACL validace: platná data projdou, kdežto chybějící povinný atribut, hodnota mimo číselník, číslo zapsané textem i vazba na špatný typ jsou odmítnuty |
| oba `.ttl` společně | křížová kontrola, že tvary mluví o týchž třídách, vlastnostech a konceptech, jaké deklaruje ontologie |
| `model.xmi` | kontrola struktury XMI 2.1: jedinečná `xmi:id`, všechny odkazy rozřešené, každá asociace se dvěma konci, které ukazují zpět na ni, a každý konec s typem i násobností |

Se zaškrtnutou **kompatibilitou s OWL 2 DL** (kap. 36.3) navíc ontologii načte a prohlásí
za konzistentní reasoner HermiT.

**Co ověřené není: import do Enterprise Architectu.** XMI je psané podle UML 2.1 / XMI 2.1
a strukturou odpovídá tomu, co CASE nástroje čekají, ale v samotném EA vyzkoušené nebylo.
Kdyby na něčem trval, dej vědět — doladit se to dá.

---

## 37. Formáty souborů `.dkmdata` a `.dkmpkg`

Tahle kapitola je pro toho, kdo chce s daty DKM pracovat zvenčí: vlastním skriptem,
jiným nástrojem nebo přes AI. Popisuje oba souborové formáty závazně — co v nich je,
co v nich být musí a co z nich smí čekat čtečka.

### 37.1 Dva formáty a rozdíl mezi nimi

| | `.dkmdata` | `.dkmpkg` |
|---|---|---|
| Co obsahuje | **celý projekt** — model, všechny entity, uložené pohledy a nastavení | **výsek** — vybrané entity a jen ta část modelu, kterou potřebují |
| K čemu je | uložení a zálohování projektu, přenos mezi zařízeními, GitHub | přenos dat mezi dvěma projekty |
| Jak vznikne | Uložit (Ctrl+S), schránka, GitHub | Nastavení → Balíčky, nebo hromadná akce nad výběrem (kap. 28) |
| Poznávací značka | žádná — pozná se podle přípony a obsahu | povinný klíč `"format": "dkmpkg"` |
| Jak se načte | nahradí celý projekt | projde průvodcem importu, který mapuje model na cílový projekt |

Oba jsou prostý JSON v UTF‑8, bez komprese a bez obalení. `.dkmdata` je doslova
`JSON.stringify` vnitřního stavu aplikace — nic se do něj nepřidává ani neubírá.

### 37.2 Strojová schémata

Vedle aplikace leží dvě schémata v JSON Schema, draft 2020-12:

- **<https://nastroje.egdilna.cz/dkm/dkmdata-scheme.json>** — celý projekt
- **<https://nastroje.egdilna.cz/dkm/dkmpkg-scheme.json>** — přenosný balíček

Ve zdrojovém kódu je najdeš jako `dkm/dkmdata-scheme.json` a `dkm/dkmpkg-scheme.json`.

Obě schémata jsou **samonosná**: neodkazují se na sebe navzájem ani na nic na síti,
takže jedno stačí zkopírovat celé a validovat offline — nebo vložit AI do rozhovoru.
Sdílené definice (entita, definice atributu, typ entity, aspekt, typ vazby, číselník,
vazba, komentář, objekt, vlastní atribut, hodnota atributu) jsou v obou souborech
záměrně totožné. Každá vlastnost má popis, který říká nejen tvar, ale i význam.

Příklad kontroly v Pythonu:

```python
import json
from jsonschema import Draft202012Validator

schema = json.load(open('dkmdata-scheme.json'))
data   = json.load(open('projekt.dkmdata'))

v = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
for e in sorted(v.iter_errors(data), key=lambda e: list(e.path)):
    print('/' + '/'.join(map(str, e.path)), '→', e.message)
```

`format_checker` je potřeba dodat výslovně — bez něj většina validátorů klíč `format`
jen zaznamená a časová razítka nezkontroluje. V JavaScriptu si totéž vyžádá
`ajv-formats` vedle `ajv`.

### 37.3 Co schéma neuhlídá: odkazy uvnitř souboru

JSON Schema umí zkontrolovat tvar, ne ale to, že odkaz někam vede. Tohle si musí
ohlídat čtečka i ten, kdo soubor vyrábí:

| Odkaz | Musí ukazovat na |
|---|---|
| `entities[].typeId` | `entityTypes[].id`, nebo `null` |
| `entities[].aspects[]` | `aspects[].id` |
| klíč v `entities[].attributes` | `id` definice atributu na typu entity nebo na některém jejím aspektu |
| `entities[].relations[].relationTypeId` | `relationTypes[].id` |
| `entities[].relations[].targetId` | `entities[].id` |
| hodnota atributu typu vazba | `entities[].id` (při `multi` pole identifikátorů) |
| `…attributes[].listId` | `selectLists[].id` |
| `…attributes[].targetType` | `entityTypes[].id`, nebo `any` |
| `relationTypes[].fromTypes[]`, `toTypes[]` | `entityTypes[].id` |
| `settings.visibleTypeTabs[]`, `visibleAspectTabs[]` | `entityTypes[].id`, `aspects[].id` |

Identifikátory jsou v rámci souboru jedinečné. DKM tvoří tvar `předpona_<čas><náhoda>`
(`e_lz3k9a1b2c`), ale formát to nevynucuje — stačí, aby byl řetězec jedinečný a stabilní.

Visící odkaz aplikaci nesloží: vazbu na neexistující cíl prostě nezobrazí. Data jsou
tím ale poškozená a při dalším exportu se ztráta rozšíří.

**Prázdný seznam znamená „cokoli", ne „nic".** Platí to u `fromTypes` a `toTypes`
u typu vazby: neprázdný seznam omezuje, prázdný seznam i chybějící klíč nechává vazbu
volnou. Kdo to přečte obráceně, zakáže všechno. Omezení se navíc čte jen podle `scope` —
u `from` se dívá na `fromTypes`, u `to` na `toTypes`, u `specific` na obojí, u `universal`
na nic.

### 37.4 Hodnoty atributů podle typu

Hodnoty entity leží v `attributes` pod **identifikátorem** definice atributu, ne pod
jejím názvem. Tvar hodnoty se řídí typem té definice:

| Typ atributu | Tvar hodnoty | Poznámka |
|---|---|---|
| `text`, `url` | řetězec | |
| `textarea` | řetězec | vykresluje se jako Markdown s CriticMarkup |
| `date` | řetězec `RRRR-MM-DD` | ne plné ISO razítko — je to hodnota HTML pole typu date |
| `number` | číslo | opravdu číslo, ne řetězec s číslicemi |
| `yesno` | `true` / `false` | |
| `select` | řetězec | musí být jednou z hodnot navázaného číselníku |
| `relation` | identifikátor entity | při `multi: true` pole identifikátorů |

**Prázdná hodnota se neukládá.** DKM klíč z `attributes` rovnou smaže, takže `null`
ani `""` v čerstvě zapsaných datech nevzniká a chybějící klíč je normální stav.
Schéma obojí toleruje, aby prošla i data z cizí ruky. Výjimkou jsou vlastní atributy
entity (`customAttributes`), kde klíč `value` smazat nelze — nevyplněno je tam prázdný
řetězec.

Vazby v `relations` se zapisují **jen u zdrojové entity**. Opačný směr (sekce
„Odkazuje sem") si DKM dopočítává; v datech se neduplikuje. Kdo by ho zapsal na obě
strany, dostane každou vazbu dvakrát.

### 37.5 Identita při importu balíčku

Entita se poznává podle `id`, ne podle názvu. Balíček identifikátory zachovává, takže
opakovaný import týchž dat se pozná jako konflikt existujících entit a nabídne přepsání
či sloučení — nezaloží druhou sadu záznamů. Kdo balíček vyrábí mimo DKM, musí proto
identifikátory držet **stabilní mezi vydáními**; jinak se data při každém importu
zduplikují. Párování podle názvu jde zapnout jen v podrobném režimu průvodce (kap. 28.3)
a je to nouzové řešení pro data, která společnou historii identifikátorů nemají.

Model v balíčku je zúžený na to, co vybrané entity potřebují. Má to dva důsledky:

- **Vazby mimo balíček se při exportu zahodí**, aby v souboru nezůstal odkaz na entitu,
  která v něm není. Rozšíření výběru o sousedy nebo o celou souvislou komponentu tomu
  předejde (kap. 28.1).
- **`fromTypes` a `toTypes` u přenášených typů vazeb mohou odkazovat na typy, které
  v balíčku nejsou.** Omezení pak v cílovém projektu nesedí a průvodce zakládá typ
  vazby bez něj.

### 37.6 Kanonický tvar a starší zápisy

Číselníky prošly sjednocením a čtečka dodnes toleruje starší tvar. Kdo soubor vyrábí,
má psát jen kanonický sloupec:

| Kanonicky | Zastarale | Co s tím DKM udělá |
|---|---|---|
| `selectLists[].values` | `selectLists[].options` | při načtení překlopí do `values` a starý klíč zahodí |
| `…attributes[].listId` | `…attributes[].selectListId` | při načtení překlopí do `listId` a starý klíč zahodí |
| číselník v `selectLists` | hodnoty přímo v `…attributes[].options` | čte se už jen jako záchytná síť |
| jméno autora v prohlížeči | `settings.userName` | převezme si ho k sobě a z dat smaže |

`settings.userName` odešel proto, aby nad jedním projektem mohlo pracovat víc lidí —
jméno autora komentářů patří konkrétnímu prohlížeči, ne sdíleným datům.

### 37.7 Co načtení přežije a co ne

- **Neznámý klíč na nejvyšší úrovni `.dkmdata` se při načtení zahodí.** Čtečka
  přebírá jen klíče, které zná, takže vlastní metadata vedle `entities` nepřežijí
  první uložení. Schéma na to upozorní chybou (`additionalProperties: false`).
- **Neznámý klíč uvnitř entity se zachová.** Entity procházejí načtením i uložením
  beze změny, takže vlastní příznak u záznamu přežije. Schéma ho proto povoluje.
- **Chybějící kolekce se doplní jako prázdné pole.** Minimální platný soubor je
  `{"entities": []}`; `version` chybějící znamená 1.

### 37.8 Co v souborech nikdy není

Do dat projektu se **neukládají žádná tajemství**. GitHub token, klíč k AI ani jméno
autora komentářů v souboru nejsou a nikdy nebudou — drží je jen prohlížeč (kap. 34.2).
`ghPath` nese pouze cestu ve tvaru `vlastník/repozitář/cesta/soubor.dkmdata`, nikoli
přístup k ní. Soubor `.dkmdata` je proto možné poslat dál nebo commitnout, aniž by
s sebou vzal přihlašovací údaje — obsahuje ale všechna data projektu, takže o jejich
citlivosti platí to, co u dat samotných.


---

## 38. Identifikátor obrazovky v patičce

Úplně dole na každé obrazovce je drobným písmem krátký kód, například `#scrallview.table`
nebo `#dlgimppkg.step3`. Je to **interní označení obrazovky**, na kterou se právě díváš.

K čemu je dobrý:

- **Hlášení chyby nebo dotaz.** Místo popisu „ta obrazovka se seznamem, jak mám zapnutou
  tabulku" stačí napsat `#scrallview.table`.
- **Práce s AI nad aplikací.** Asistent podle něj pozná, o kterou obrazovku jde, aniž by
  hádal z popisu nebo ze snímku.
- **Testy a dokumentace.** Odkaz na obrazovku, který se nerozbije překladem ani
  přejmenováním.

Kód se v češtině i angličtině shoduje a nepřekládá se. Za tečkou bývá upřesnění — režim
zobrazení (`.table`, `.cal`), zapnutý náhled (`.preview`), režim výběru (`.select`) nebo
krok průvodce (`.step3`).

Stejné označení nese i vygenerovaný statický prohlížeč, jen s předponou `scrstat`.

Úplný seznam všech identifikátorů je v souboru `dkm/screens.md` ve zdrojovém kódu.
