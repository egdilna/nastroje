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
12. [Zobrazení: seznam, Kanban, časová osa](#12-zobrazení-seznam-kanban-časová-osa)
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
23. [Export a tisk entity](#23-export-a-tisk-entity)
24. [Export do XLSX, TSV, PlantUML](#24-export-do-xlsx-tsv-plantuml)
25. [Statický prohlížeč](#25-statický-prohlížeč)
26. [Přenos částí mezi projekty (balíčky)](#26-přenos-částí-mezi-projekty-balíčky)
27. [Nastavení](#27-nastavení)
28. [Klávesové zkratky](#28-klávesové-zkratky)
29. [Přístupnost](#29-přístupnost)
30. [Tipy a triky](#30-tipy-a-triky)
31. [Časté problémy](#31-časté-problémy)
32. [Technické pozadí](#32-technické-pozadí)

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
- **Export** — XLSX export aktuálně filtrovaných entit
- **Import TSV** — nahraje entity z TSV / CSV / vložení ze schránky
- **Nastavení** — projekt, typy, aspekty, vazby, seznamy, pohledy, obecné
- **● Neuložené změny** — klik otevře diff proti poslednímu uložení

### 4.2 Toolbar nad seznamem

- **Záložky**: Inbox, Vše, jednotlivé typy entit, jednotlivé aspekty, připnuté uložené pohledy, Archiv. Klikem se přepneš na pohled, který obsahuje jen entity z dané kategorie.
- **Hledání** — fulltext napříč jménem a textovými atributy
- **Filtr** — typ, aspekt, datum aktualizace
- **Řazení** — podle data úpravy / názvu / data vytvoření
- **⚙ Pokročilé filtry (N)** — panel pro filtrování podle libovolného atributu (viz kapitola 11)
- **📋 / 📊 / 📅** — přepínač zobrazení: seznam / Kanban / časová osa (viz kapitola 12)
- **+ Nová entita**
- **☑ Výběr** — zapne režim hromadných akcí

### 4.3 Karta entity v seznamu

- **Ikona typu** + **název entity** (např. 👤 *Pavel Novák*)
- **Badge** s názvem typu, 📥 Inbox, 📦 Archiv a aspekty (◎ *VIP*)
- **Snippet** — krátký výtah z první textarea atributu
- **Hodnoty atributů s „Zobrazit v seznamu"** — pokud jsou nějaké zapnuté
- **Datum úpravy** a počet vazeb

Kliknutí na kartu otevře detail.

### 4.4 Detail entity

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

### 4.5 Editor entity

- **Název** — povinný
- **Typ** — dá se změnit přes Změnit typ
- **Inbox** — checkbox „v Inboxu"
- **Atributy typu** — pole podle datového typu
- **Aspekty** — sekce s checkboxy. Zaškrtnutí přidá aspekt a okamžitě zobrazí jeho atributy.
- **Vlastní atributy** — sekce s + Přidat vlastní atribut a + Přidat objekt
- **Vazby** — sekce s aktuálními vazbami, + Přidat vazbu
- **Uložit / Zrušit** v zápatí (klávesa U uloží)

### 4.6 Nastavení

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

### 4.7 Panely

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

## 12. Zobrazení: seznam, Kanban, časová osa

V toolbaru list view jsou tři přepínače **📋 Seznam · 📊 Kanban · 📅 Časová osa**.

### 12.1 Seznam (📋)

Výchozí. Karty entit pod sebou. Řazení, filtry a pohledy fungují stejně.

### 12.2 Kanban (📊)

Nad tabulí selector **Sloupce podle**. Nabízí atributy typu select, yesno a systémovou vlastnost „Typ entity". Sloupce jsou hodnoty toho atributu (+ sloupec „bez hodnoty" pro entity bez hodnoty).

Karta má ikonu, název, snippet a **dropdown „Přesunout do"** — screen reader–kompatibilní alternativa k drag-and-drop. Změna sloupce = úprava hodnoty atributu, entita se přeuloží.

### 12.3 Časová osa (📅)

Selector **Časová osa podle** — všechny date atributy typu, aspektu, plus systémové Vytvořeno a Upraveno.

Tlačítko **⇧ Vzestupně / ⇩ Sestupně**.

Entity grupované podle roku a měsíce, s datem před názvem. Entity bez data v samostatné sekci **Bez data**.

### 12.4 Zobrazení v uložených pohledech

Když uložíš pohled, uloží se i display mode a jeho parametry. Klik na připnutou záložku pohledu tě vrátí do stejného zobrazení. Změnit lze přes **Přepsat aktuálním** v Nastavení → Uložené pohledy.

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
- **🎨 PlantUML diagram** — vygeneruje PlantUML z vybraných (viz kap. 24)
- **📦 Export balíčku** — zabalí vybrané do `.dkmpkg` (viz kap. 26)

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

---

## 16. Komentáře

### 16.1 K entitě

V detailu entity sekce **💬 Komentáře**. Formulář nahoře:

- Textarea (Markdown)
- Autor se automaticky bere z **Nastavení → Obecné → Tvoje jméno pro komentáře**
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
- **Akce**: Nová entita, Nastavení, Uložit, Načíst, Pokročilé filtry, Clipboard IO, PlantUML export, Nový panel, Všechny komentáře, Inbox / Vše / Archiv

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

V detailu entity klik na tlačítko **🪟 V samostatném okně**. Otevře se nová instance DKM v samostatném okně.

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

### 21.5 URL parametr pro autoload

`?id={base64ghPath}` v URL → DKM při startu automaticky načte projekt z GitHubu. Šikovné pro sdílení odkazu nebo pro pinnutí do záložek prohlížeče.

### 21.6 Uložení do schránky

**📋⬆ Vložit do schránky** v hlavičce (Ctrl+Shift+S). Zkopíruje celý projekt jako JSON. Použitelné pro rychlé přenesení do jiné záložky nebo do jiné aplikace.

### 21.7 Načtení ze schránky

**📋⬇ Načíst ze schránky** (Ctrl+Shift+O). Přečte projekt ze schránky, nahradí aktuální (s potvrzením pokud jsou neuložené změny). Když prohlížeč nedovolí přímý přístup, otevře se dialog s textarea pro ruční vložení.

### 21.8 Autosave

**Nastavení → Obecné → Autosave** — po každé změně se projekt automaticky ukládá do sessionStorage (aktuální záložky). Refresh přežije, zavření záložky ne.

To NEZAHRNUJE ukládání do souboru ani na GitHub — pravidelně ukládej ručně přes Ctrl+S.

### 21.9 Začít prázdný projekt

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

## 23. Export a tisk entity

V detailu entity tlačítko **🖨 Export / tisk**. Otevře dialog se zaškrtávátky pro sekce:

### 23.1 Volitelné sekce

- **Záhlaví** — název, ikona typu, badge typu, badges aspektů, badges stavu
- **Atributy typu** — každý samostatně (checkbox), tlačítka Vše / Nic
- **Atributy aspektu** — samostatná sekce pro každý aspekt entity
- **Vlastní atributy**
- **Vazby** — vazby ven, odkazuje sem
- **Metadata** — Typ entity, Vytvořeno, Upraveno, ID

### 23.2 Formáty výstupu

- **📋 Kopírovat MD** — surový Markdown do schránky
- **✨ Kopírovat formátované** — přes ClipboardItem s HTML + plain text. Vložení do Wordu, Outlooku, Gmailu zachová nadpisy, tučné, kurzívu, seznamy.
- **📥 Stáhnout MD** — soubor `NázevEntity.md`
- **📄 Stáhnout DOCX** — Word soubor přes docx.js (lazy-loaded z CDN), Calibri font, hierarchie nadpisů, bullet listy pro vazby
- **🖨 Tisk / PDF** — nové okno s vyrenderovaným HTML + auto `window.print()`. Přes prohlížeč tiskneš na papír nebo uložíš jako PDF.

### 23.3 Pravidla

- Prázdné hodnoty se přeskočí (i když je atribut zaškrtnutý)
- Archivované cílové entity vazeb se vyloučí
- Objekty entity se **nikdy neexportují** (ani do MD, DOCX, PDF, formátovaného copy)
- Textarea atributy v HTML / DOCX se rendrují jako Markdown (bold, listy, CriticMarkup)

---

## 24. Export do XLSX, TSV, PlantUML

### 24.1 XLSX

Tlačítko **Export** v hlavičce. Vytvoří `.xlsx` s aktuálně filtrovanými entitami. Sloupce: název, typ, atributy typu, hlavní údaje. Použitelné pro sdílení mimo DKM.

### 24.2 TSV import

Tlačítko **Import TSV**. Nahraje tabulku z Excelu / TSV / vloženého schránky. Můžeš namapovat sloupce na atributy a vytvořit entity hromadně.

### 24.3 PlantUML export vazeb

Přístupný přes:

- **Rychlá paleta (Ctrl+P)** → akce „PlantUML export"
- **Bulk akce** → „🎨 PlantUML diagram" (v selection režimu)

Dialog:

- **Rozsah**: aktuální seznam, výběr (v bulk režimu), všechny, typ, aspekt
- **Styl**: Class diagram (třídy s atributy), Component, Use case
- **Volby**: zahrnout atributy jako pole tříd, zobrazit vazby z atributů-relací (přerušovanou čarou), zahrnout externí cíle mimo rozsah (šedě)
- **Živý náhled** PlantUML kódu

Výstup:

- **📋 Kopírovat** — do schránky
- **📥 Stáhnout .puml** — soubor pro externí PlantUML nástroj

Escape názvů, aliasing ID na E0/E1/…, stereotypy podle typu (`<<Osoba>>`), attribute-relations jako `..>` čárkované.

Ideální pro dokumentaci datového modelu, ER diagramy, architektury.

---

## 25. Statický prohlížeč

DKM umí vygenerovat **statický HTML prohlížeč** dat projektu — jeden soubor, který otevřeš a máš read-only přístup ke všem entitám.

### 25.1 Generování

**Nastavení → Projekt → Statický prohlížeč**. Klik → stáhne se soubor s vloženými daty projektu.

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

### 25.2 Výchozí entita

V dialogu generování můžeš zvolit entitu, na které se statický prohlížeč otevře.

---

## 26. Přenos částí mezi projekty (balíčky)

### 26.1 Formát balíčku

`.dkmpkg` je JSON, který obsahuje **výběr entit + jejich datový model** (jen ty typy, aspekty, seznamy a relační typy, které vybrané entity potřebují). Umožňuje přenést kus jednoho projektu do druhého bez zbytečnosti.

### 26.2 Export balíčku

V bulk režimu vybereš entity, akce **📦 Export balíčku**. Wizard:

1. **Rozsah**: jen vybrané / vybrané + sousedy (přes vazby) / celá komponenta (grafové sousedství)
2. **Model**: typy, aspekty, seznamy a relace, které se přenesou
3. **Preview**: přehled, co se v balíčku octne

Stáhne se `.dkmpkg`.

### 26.3 Import balíčku

**Nastavení → Projekt → Přenos mezi projekty → Importovat balíček**. Nahraješ `.dkmpkg`. Wizard:

- Shrnutí obsahu
- Kontrola konfliktů (existující typy, atributy)
- Automap: matchování atributů podle názvu + typu
- Preview změn
- Backup před importem (checkbox default zapnutý — stáhne se aktuální projekt jako `.dkmdata` před importem)

Klik na Import provede two-pass:

1. Entity se vytvoří s novými ID
2. Vazby a relační atributy se přemapují na nová ID

---

## 27. Nastavení

### 27.1 Projekt

- Název, popis
- GitHub cesta
- Statický prohlížeč (generování)
- Přenos mezi projekty (import balíčku)
- Úložiště projektu (info o session storage + Začít prázdný projekt)

### 27.2 Typy

Seznam typů, klikem se otevře editor s atributy, ikonou, názvem.

### 27.3 Aspekty

Analogicky pro aspekty.

### 27.4 Vazby

Definice relačních typů: název, opačný název, scope, povolené typy zdroje / cíle.

### 27.5 Seznamy

Select listy s výčtem hodnot. Používají se v atributech typu select.

### 27.6 Uložené pohledy

Správa všech uložených pohledů: přejmenovat, změnit ikonu, přepnout pin, přepsat aktuálním filtrem, smazat.

### 27.7 Záložky

Které typy a které aspekty se zobrazují jako záložka v hlavním toolbaru.

### 27.8 GitHub

Personal access token pro GitHub API. Uložený v localStorage prohlížeče (per-origin).

### 27.9 Obecné

- **Jazyk** (Čeština / English)
- **Tvoje jméno pro komentáře** — bere se jako autor u nových komentářů, uloží se do dat projektu
- **Autosave** — automatické ukládání do sessionStorage (per záložka)
- **Debug** — zapne panel s debug logy dole

### 27.10 Statistiky

Přehled počtů: entit, typů, atributů, aspektů, vazeb, komentářů.

### 27.11 Nápověda

Odkazy na online dokumentaci a repozitář.

---

## 28. Klávesové zkratky

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
| Alt+B | Zpět (v detailu, editoru, nastavení) |
| Alt+L | Načíst |
| i | Přejít na Inbox |
| a | Přejít na Vše |
| n | Nová entita (s výběrem typu) |

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

## 29. Přístupnost

DKM je navrženo tak, aby fungovalo se screen readerem.

- **Sémantické nadpisy**: hlavní nadpis stránky (H1) je vždy název obsahu (entita, pohled, sekce nastavení), ne aplikace
- **Žádné treeview** (`role=tree/treeitem`) — hierarchie jsou nested `<ul>/<li>`
- **Žádné position: sticky / fixed** na velkých oblastech
- **ARIA labels** na nezřejmých interaktivních prvcích
- **Klávesová navigace** (viz kap. 28)
- **Screen reader announcements** minimalizované — jen krátká potvrzení akcí (Uloženo, Přidáno), ne re-render polí

### 29.1 Rychlá paleta

Screen reader-kompatibilní: ARIA combobox, listbox, aria-activedescendant, aria-selected na aktivní položce.

### 29.2 Kanban

Karty nejsou drag-and-drop (nedostupné pro screen reader). Místo toho **dropdown Přesunout do** pro každou kartu.

---

## 30. Tipy a triky

### 30.1 Rychlý workflow

1. Denně otevři aplikaci s `?id={ghPath}` (bookmark) — projekt se automaticky natáhne z GitHubu
2. Ctrl+P → napiš pár písmen názvu entity → Enter — okamžitě jsi v detailu
3. Klávesa `e` — editace
4. Klávesa `u` — uložení editace
5. Ctrl+S → push na GitHub

### 30.2 Použití panelů

- Panel 1 = seznam projektu (kontext)
- Panel 2 = detail rozpracované entity
- Panel 3 = detail entity, se kterou porovnávám

Ctrl+T pro nový, klik na tab pro přepnutí.

### 30.3 Wiki-linky místo formálních vazeb

Pokud se nechceš zdržovat vytvářením formální vazby, prostě napiš `[[Název entity]]` v textareu. V sekci Odkazuje sem se odkaz automaticky objeví.

### 30.4 Kanban pro schvalovací workflow

Vytvoř aspekt „Schvalování" s atributem „Status" (select: Nový / V řešení / Schválené / Zamítnuté). Přiřaď aspekt entitám. Přepneš seznam na Kanban podle „Status". Přesouváš karty přes dropdown = měníš status. Ulož jako připnutý pohled 🔥 Schvalování a máš ho v toolbaru na klik.

### 30.5 PlantUML dokumentace modelu

Pro externí dokumentaci datového modelu:

1. Vyber entity (nebo použij aspekt)
2. Ctrl+P → „PlantUML export"
3. Class diagram + zahrnout atributy
4. Stáhnout .puml
5. Vlož do PlantUML editoru → obrázek

### 30.6 Diff před uložením

Než klikneš Ctrl+S:

1. Klik na indikátor ● Neuložené změny
2. Prohlédni diff
3. Zjistíš, jestli je změna přesně to, co jsi zamýšlel

### 30.7 Sloučení duplicit

Když najdeš dvě entity, které jsou vlastně stejná věc:

1. Klávesa V — bulk režim
2. Zaškrtni obě
3. Akce ⇢ Sloučit entity
4. Vyber cíl, strategii pro konflikty
5. Sloučit — všechny vazby a atributy se přesměrují automaticky

### 30.8 Rychlé přepnutí mezi projekty

- V hlavním okně otevři projekt A
- **Ctrl+Shift+S** — zkopíruj do schránky
- Nová záložka → **Ctrl+Shift+O** → projekt A se otevře i v druhé záložce
- V druhé záložce načti projekt B ze souboru

Máš oba projekty naráz, každý v jiné záložce.

---

## 31. Časté problémy

### 31.1 „Nevidím své entity"

- Zkontroluj filtry v toolbaru — možná máš aktivní filtr, který skrývá vše. Klik na Vyčistit filtry.
- Podívej se do záložky Archiv — možná jsou archivované
- Zkontroluj pokročilé filtry (⚙ Pokročilé filtry) — možná mají neplatné pravidlo

### 31.2 „Zavřel jsem záložku a projekt zmizel"

Projekt žije jen v sessionStorage. Pro trvalé uložení:

- Ctrl+S — uložit do souboru
- Nastavit GitHub cestu a Ctrl+S — uložit na GitHub
- Bookmarknout URL `?id={base64ghPath}` pro rychlý autoload

### 31.3 „Prohlížeč nedovolil přístup do schránky"

- Zkus znovu, možná byl focus problém
- Nebo použij dialogový fallback (DKM ho ukáže automaticky)

### 31.4 „PlantUML export nevypadá dobře"

- Zkontroluj rozsah — možná máš moc entit
- Zkus jiný styl (Component / Use case je jednodušší)
- Vypni atributy, když je jich moc

### 31.5 „Diff je prázdný, ale mám neuložené změny"

- Baseline se nastaví jen po uložení nebo načtení. Pokud jsi ještě neuložil, diff nemá s čím porovnat.
- Uložit → od té chvíle se změny sledují proti tomu bodu.

### 31.6 „Samostatné okno se neotevře"

- Prohlížeč blokuje pop-upy — povol vyskakovací okna pro DKM
- Zkontroluj panel oznámení prohlížeče (obvykle vpravo od adresního řádku)

---

## 32. Technické pozadí

### 32.1 Datová struktura

Projekt je jeden JSON dokument (viz `dkmdata.json`):

```
{
  version, projectName, projectDescription, ghPath,
  settings: { visibleTypeTabs, visibleAspectTabs, userName },
  entityTypes: [{ id, name, icon, attributes: [{ id, name, type, required, showInList, ... }] }],
  aspects: [{ id, name, attributes: [...] }],
  relationTypes: [{ id, name, inverseName, scope, fromTypes, toTypes }],
  selectLists: [{ id, name, options }],
  savedViews: [{ id, name, icon, pinned, filter, sort, tab, displayMode, ... }],
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

### 32.2 Úložiště v prohlížeči

- **sessionStorage['dkm-session-data']** — aktuální projekt, per záložka. Refresh přežije, zavření záložky ne.
- **localStorage** — preference (jazyk, autosave, debug, GitHub token). Nikdy neobsahuje data projektu.
- **BroadcastChannel 'dkm-sync'** — live synchronizace mezi otevřenými okny.

### 32.3 GitHub API

DKM používá Contents API pro čtení + Git Data API (blobs) pro zápis velkých souborů. Token je uložený v `localStorage['dkm-github-token']` (per origin).

### 32.4 Rendering

Vanilla JavaScript, žádný framework. Šablony jako přímé DOM manipulace. Full re-render při každé změně stavu (rychlé i pro tisíce entit).

### 32.5 Testování

Regresní testy přes jsdom (viz `smoke_*.js` v repozitáři). Pokrývají: pokročilé filtry, uložené pohledy, export, backlinks, historie navigace, clipboard, sessionStorage, load/save, wiki-linky, diff, merge, PlantUML, mode přepínače, komentáře, objekty, panely, samostatné okno.
