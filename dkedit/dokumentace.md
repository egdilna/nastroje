# Správce datového katalogu úřadu — Dokumentace

**Online verze nástroje:** [https://egdilna.github.io/nastroje/dkedit](https://egdilna.github.io/nastroje/dkedit)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#dkedit](https://egdilna.github.io/nastroje/#dkedit)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí a vychytávek

**Správce datového katalogu úřadu** je přístupná webová aplikace pro správu OFN datových slovníků a číselníků. Vše běží v jednom HTML souboru — žádný server, žádná instalace, data se ukládají v prohlížeči (localStorage).

### Klíčové funkce

- **Slovníky a pojmy** — tvorba a správa OFN datových slovníků se všemi typy pojmů dle specifikace (Obecný pojem, Typ objektu/subjektu práva, Vlastnost, Vztah, Třída, Veřejný/Neveřejný údaj)
- **Číselníky a položky** — správa číselníků dle OFN schématu Číselníky včetně všech atributů položek
- **Export JSON-LD** — export slovníků i číselníků do validního JSON-LD dle OFN schémat
- **Import JSON-LD** — import z OFN JSON-LD souborů (slovníky i číselníky), včetně podpory reálných OFN slovníků z produkce
- **Import CSV/TSV** — hromadný import pojmů a položek z tabulkových souborů s průvodcem mapování sloupců
- **Sestavy a tisk** — přehledné sestavy pojmů a položek pro projednání a schválení, s barevným zvýrazněním změn oproti předchozí verzi
- **Správa verzí** — snapshoty verzí slovníků a číselníků s možností návratu a porovnání
- **Autorské poznámky** — interní poznámky s evidencí nevyřízených/vyřízených položek, přehled napříč projektem
- **Hromadné operace** — hromadná změna stavu, typu, legislativních zdrojů a přidání poznámky pro vybrané pojmy nebo položky
- **ELI průvodce** — asistované zadávání odkazů na ustanovení právních předpisů z e-Sbírky
- **Auto-generování IRI** — automatické sestavení globálního identifikátoru pojmu, položky, slovníku nebo číselníku ze zadaného názvu/kódu

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML prvky, ARIA atributy, plná ovladatelnost klávesnicí, kompatibilita se čtečkami obrazovky. Dialogová okna využívají nativní `<dialog>` element s atributem `inert` při zavření.

### Uložení dat

Data jsou uložena v `localStorage` prohlížeče pod klíčem `ofnv3` s verzí `v4`. Projekt lze exportovat jako JSON soubor a opětovně načíst. Data se nikam neodesílají.

---

## Navigace a rozložení

Aplikace se skládá ze tří hlavních oblastí:

### Záhlaví

Záhlaví obsahuje tlačítko **☰** pro skrytí/zobrazení postranního panelu a hlavní navigační lištu se záložkami:

- **Projekt** — přehled projektu, statistiky, import/export
- **Slovníky** — seznam slovníků a jejich správa
- **Pojmy** — seznam a editace pojmů aktivního slovníku
- **Číselníky** — seznam číselníků a jejich správa
- **Hledat** — fulltextové vyhledávání napříč pojmy
- **Verze&změny** — přehled verzí a porovnání změn
- **Poznámky** — přehled všech autorských poznámek projektu

### Postranní panel

Postranní panel zobrazuje přehled slovníků a číselníků jako karty. Každá karta obsahuje:
- Název, stav a verzi
- Počet pojmů/položek
- Odznak s počtem nevyřízených autorských poznámek
- Rychlá tlačítka: **Otevřít**, **+ Pojem**/**+ Položka**, **🖨 Sestava**

Panel lze skrýt tlačítkem ☰ v záhlaví pro větší pracovní plochu.

### Hlavní obsah

Zobrazuje aktuální pohled dle aktivní záložky. Dynamicky renderovaný obsah včetně formulářů, tabulek a sestav.

---

## Projekt

### Nastavení projektu

Na záložce **Projekt** se nastavují základní metadata projektu:

| Pole | Popis |
|------|-------|
| Název projektu | Interní název projektu (zobrazuje se v postranním panelu) |
| Organizace | Název organizace — přebírá se do metadat slovníků |
| Odpovědná osoba | Jméno autora |
| E-mail | Kontaktní e-mail |
| Základní IRI organizace | Základ URL pro auto-generování IRI, např. `https://slovník.gov.cz/datový` |
| Popis projektu | Volný popis |

Pole **Základní IRI organizace** je klíčové — od něj se odvozují automaticky generovaná IRI pro slovníky, pojmy, číselníky i položky.

### Statistiky

Přehled počtu slovníků, pojmů, číselníků a položek v projektu s přímými odkazy na jednotlivé entity.

### Import a export projektu

- **Exportovat projekt (.json)** — uloží celý projekt jako JSON soubor včetně všech dat, verzí a autorských poznámek
- **Načíst projekt (.json)** — načte dříve exportovaný projekt
- **Importovat slovník z JSON-LD** — přidá slovník z OFN JSON-LD souboru
- **Importovat číselník z JSON-LD** — přidá číselník z OFN JSON-LD souboru
- **⚠ Resetovat aplikaci** — smaže všechna data v localStorage (nevratné, s potvrzením)

---

## Slovníky

### Seznam slovníků

Záložka **Slovníky** zobrazuje karty všech slovníků projektu. Každá karta obsahuje název, stav, verzi, IRI, počet pojmů dle typů a tlačítka akcí.

Tlačítka na kartě slovníku:
- **Otevřít** — přejde na editaci metadat slovníku
- **Verze** — správa verzí slovníku
- **Export JSON-LD** — stažení slovníku jako JSON-LD soubor
- **Smazat** — smazání slovníku (s potvrzením)

### Metadata slovníku

| Pole | Popis |
|------|-------|
| Název (česky) | Povinný, automaticky generuje IRI při psaní |
| Název (anglicky) | Volitelný překlad |
| IRI slovníku | Globální identifikátor; tlačítko ⚙ generuje z názvu a základního IRI organizace |
| Popis (česky/anglicky) | Textový popis slovníku |
| Stav | Viz kapitola Stavy |
| Úroveň | Tezaurus nebo Konceptuální model — ovlivňuje `typ` v JSON-LD exportu |
| Organizace, Autor | Metadata o původci |

Po uložení metadat jsou dostupná tlačítka **Správa verzí**, **🖨 Sestava pojmů** a **Export JSON-LD**.

### Export JSON-LD

Exportuje slovník ve formátu OFN JSON-LD. Kontext: `https://ofn.gov.cz/slovníky/...`. Exportují se veškerá pole pojmů dle OFN schématu včetně ELI odkazů, vazeb, klasifikace a typů.

**ELI odkazy** se ukládají ve formátu `opendata.eselpoint.cz` (OFN standard) a při otevření odkazem 🔗 se automaticky přesměrují na `www.e-sbirka.cz`.

### Import JSON-LD

Podporuje import OFN JSON-LD souborů. Správně zpracovává:
- Všechny typy pojmů včetně kombinovaných typů (např. Vztah + Neveřejný údaj)
- `alternativní-název` jako pole synonyma
- `nadřazená-třída` pro Typy objektu/subjektu práva
- `agenda`, `agendový-informační-systém`, `definiční-obor`, `obor-hodnot`
- `ustanovení-dokládající-neveřejnost-údaje`
- Správnou prioritu typů: TypObjektu > TypSubjektu > Vlastnost > Vztah > Třída

---

## Pojmy

### Seznam pojmů

Záložka **Pojmy** zobrazuje tabulku pojmů aktivního slovníku s filtry a hromadnými operacemi.

**Filtry:**
- Textové vyhledávání (název, synonyma, definice)
- Filtr dle typu pojmu
- Filtr dle stavu pojmu

**Tlačítka nad tabulkou:**
- **+ Přidat pojem** — vytvoří nový pojem
- **⬆ Import CSV/TSV** — hromadný import z tabulky

Každý řádek tabulky obsahuje zaškrtávátko pro výběr k hromadným operacím.

### Typy pojmů

| Typ | ID | Popis |
|-----|----|-------|
| Obecný pojem | `Pojem` | Základní obecný pojem slovníku |
| Typ objektu práva | `TypObjektu` | Třída reprezentující objekt práva, má Agendu a AIS |
| Typ subjektu práva | `TypSubjektu` | Třída reprezentující subjekt práva |
| Vlastnost | `Vlastnost` | Vlastnost třídy s datovým typem (obor hodnot) |
| Vztah | `Vztah` | Vztah mezi třídami (definiční obor → obor hodnot) |
| Třída | `Trida` | Obecná třída s možností napojení na číselník |
| Veřejný údaj | `VerejnyUdaj` | Veřejný údaj dle RPP |
| Neveřejný údaj | `NeverejnyUdaj` | Neveřejný údaj s povinným ustanovením neveřejnosti |

### Formulář pojmu — základní a rozšířený režim

Formulář se přepíná zaškrtávátkem **Rozšířený režim** v modrém pruhu nahoře.

**Základní režim** zobrazuje:
- Stav pojmu
- Název (česky)
- Synonyma (česky)
- Definice (česky)
- Popis (česky)
- Jedno hlavní legislativní ustanovení (rok + číslo předpisu)

**Rozšířený režim** přidává:
- Překlady do angličtiny (název, definice, popis)
- Alternativní názvy v angličtině a skrytý název
- IRI pojmu s tlačítkem ⚙ pro auto-generování
- Všechna legislativní ustanovení (definující a související)
- Nelegislativní zdroje (definující a související)
- Hierarchii (nadřazený pojem) a ekvivalentní pojmy
- Typ-specifická pole (viz níže)
- Klasifikaci údajů (způsob získání, typ obsahu, způsoby sdílení, PPDF)

**Typ-specifická pole v rozšířeném režimu:**

- **Vlastnost:** Datový typ (obor hodnot) — xsd:string, xsd:boolean, xsd:date, xsd:integer, xsd:decimal, xsd:dateTime atd.; Zdrojová třída (definiční obor); Nadřazená vlastnost
- **Vztah:** Cílová třída (obor hodnot) — výběr ze tříd v projektu; Zdrojová třída (definiční obor) — výběr ze tříd v projektu; Nadřazený vztah
- **Třída:** Nadřazená třída; Napojení na číselník (výběr z číselníků v projektu nebo IRI)
- **Typ objektu/subjektu práva:** Agenda (IRI); AIS — agendový informační systém (IRI)
- **Neveřejný údaj:** Ustanovení dokládající neveřejnost (povinné, ELI odkaz)

### Auto-generování IRI

IRI pojmu se automaticky generuje při psaní názvu, pokud:
- pole IRI je prázdné (existující hodnota se nepřepíše)
- slovník má nastaveno IRI

Formát: `{IRI slovníku}/pojem/{slug z názvu}`

Tlačítko **⚙ Generovat** spustí generování ručně. Upozornění se zobrazí pokud slovník nemá nastavené IRI.

### Legislativní ustanovení — ELI

Legislativní ustanovení jsou uložena jako IRI ve formátu OFN (`opendata.eselpoint.cz`).

**Jednoduché zadání** (v základním i rozšířeném režimu):
1. Zadejte **rok** a **číslo předpisu**
2. Klikněte **Přidat** — vloží odkaz na aktuální znění celého předpisu
3. Tlačítko **⚖ Detailně…** otevře průvodce pro přesné ustanovení (část, paragraf, odstavec, písmeno, bod)

**Zobrazení:** místo URL se zobrazuje čitelný popis, např. `Předpis 13/1997 Sb., § 20 odst. 2 písm. b)` s datem znění.

**Odkaz 🔗** otevře přímo v e-Sbírce na adrese `www.e-sbirka.cz`.

### Hromadné operace nad pojmy

Po zaškrtnutí více pojmů se zobrazí tlačítko **Hromadná akce…** s těmito operacemi:

| Akce | Popis |
|------|-------|
| Změnit stav | Nastaví vybraný stav všem označeným pojmům |
| Změnit typ | Přetypuje označené pojmy |
| Přidat legislativní ustanovení | Přidá ELI odkaz (rok+číslo, volba Definující/Související) |
| Přidat nelegislativní zdroj | Přidá zdroj se jménem, URL a typem |
| Přidat autorskou poznámku | Přidá interní poznámku ke každému označenému pojmu |

### Import CSV/TSV — pojmy

Záložka **⬆ Import CSV/TSV** umožňuje hromadný import pojmů.

1. Načtěte soubor nebo vložte obsah ze schránky (CSV, TSV, středníkový formát — detekuje se automaticky)
2. Klikněte **Analyzovat data** — zobrazí se náhled prvních 5 řádků
3. Namapujte sloupce na pole aplikace (shodné názvy se předvyberou automaticky)
4. Zvolte chování při duplikátu dle českého názvu: **Přeskočit** nebo **Nahradit**
5. Klikněte **Importovat**

Po importu se automaticky dogeneruje IRI pro pojmy bez IRI (pokud má slovník nastavené IRI).

**Mapovatelná pole:** název CS/EN, definice CS/EN, popis CS/EN, synonyma CS (oddělená středníkem), typ, stav, IRI, definující ustanovení (ELI).

---

## Číselníky

### Seznam číselníků

Záložka **Číselníky** zobrazuje karty všech číselníků projektu analogicky ke slovníkům.

### Metadata číselníku

| Pole | Popis |
|------|-------|
| Název (česky/anglicky) | Název číselníku |
| IRI číselníku | Globální identifikátor; ⚙ generuje z názvu |
| Kód | Krátký kód číselníku |
| Akronym | Zkratka |
| Popis (česky/anglicky) | Popis |
| Definice (česky/anglicky) | Definice |
| Stav | Viz kapitola Stavy |
| Platnost od/do | Datumové ohraničení platnosti |
| URL v NKOD | Odkaz na datovou sadu v Národním katalogu otevřených dat |

### Položky číselníku

Tabulka položek s filtrem dle stavu a hromadnými operacemi.

**Formulář položky — základní a rozšířený režim:**

**Základní režim:**
- Stav položky
- Kód (povinný, automaticky generuje IRI)
- Název (česky, povinný)
- Definice/Popis (česky)

**Rozšířený režim přidává:**
- IRI položky s tlačítkem ⚙
- Název (anglicky)
- Zkrácený název (česky/anglicky)
- Alternativní název (česky/anglicky)
- Definice a popis (anglicky)
- Platnost od/do

### Hromadné operace nad položkami

| Akce | Popis |
|------|-------|
| Změnit stav | Nastaví stav označeným položkám |
| Nastavit platnost | Platnost od a/nebo do (prázdné = neměnit) |
| Přidat autorskou poznámku | Přidá poznámku ke každé označené položce |

### Import CSV/TSV — položky

Funguje stejně jako import pojmů. **Mapovatelná pole:** kód, název CS/EN, definice/popis CS/EN, zkrácený název CS, alternativní název CS/EN, stav, IRI, platnost od/do.

Klíč pro detekci duplikátů je **kód položky**.

### Export JSON-LD

Exportuje číselník ve formátu OFN Číselníky. Kontext: `https://ofn.gov.cz/číselníky/2022-02-08/kontexty/číselník.jsonld`.

### Správa verzí číselníku

Stejný princip jako u slovníků — ukládání snapshotů s možností obnovení.

---

## Stavy

Stavy jsou sdílené pro všechny entity: slovníky, číselníky, pojmy i položky. Jsou to interní stavy nástroje — do JSON-LD exportu se nevkládají.

| Stav | Popis |
|------|-------|
| Rozpracovaný | Pracovní verze, ještě nepřipravená k projednání |
| Návrh | Připravený návrh k prvnímu projednání |
| Projednávaný | Aktuálně projednávaný |
| Ke schválení | Prošel projednáváním, čeká na formální schválení |
| Schválený | Formálně schválený |
| Publikovaný | Zveřejněný |
| Neaktuální | Platný, ale nahrazený novějším |
| Zrušený | Zrušený, dále neplatný |
| Archivovaný | Historický záznam |

---

## Správa verzí

### Slovníky

Záložka **Verze** u každého slovníku umožňuje:
- Uložit novou verzi s číslem, datem a popisem změn
- Zobrazit přehled všech verzí s počtem pojmů ve snapshotu
- Obnovit slovník na dřívější verzi (s potvrzením)
- Spustit sestavu změn oproti aktuálnímu stavu

### Číselníky

Stejný princip jako u slovníků, snapshoty zachycují stav položek.

---

## Sestavy

### Sestava pojmů slovníku

Tlačítko **🖨 Sestava pojmů** v editaci slovníku nebo v postranním panelu.

Sestava obsahuje:
- Záhlaví se všemi metadaty slovníku (název, IRI, verze, stav, organizace, autor, popis)
- Datum a čas vygenerování
- Souhrnné počty pojmů dle typů

**Pořadí sekcí:**
1. Nové pojmy (zelené, jen v sestavě změn)
2. Upravené pojmy (žluté, s tabulkou Bylo/Nově, jen v sestavě změn)
3. Beze změny — seskupeno dle typu pojmu
4. Odstraněné pojmy (červené, jen v sestavě změn)

U každého pojmu jsou zobrazeny: název CS/EN, synonyma, definice, popis, legislativní ustanovení (jako čitelný text s odkazem), stav, typ.

Na konci sestavy jsou nevyřízené autorské poznámky slovníku i pojmů.

### Sestava změn slovníku

Z přehledu verzí tlačítkem **Vs. aktuální** — zobrazí sestavu s barevně odlišenými změnami oproti vybrané verzi.

### Sestava položek číselníku

Tlačítko **🖨 Sestava položek** v editaci číselníku nebo v postranním panelu.

Tabulková sestava s kódem, názvem, popisem/definicí, platností, stavem a sloupcem změny (v diff režimu).

### Tisk a PDF

Tlačítko **🖨 Tisknout / PDF** v záhlaví sestavy otevře tiskový dialog prohlížeče. Pro uložení jako PDF zvolte v tiskném dialogu tiskárnu „Uložit jako PDF".

---

## Autorské poznámky

Autorské poznámky jsou interní záznamy — **nevkládají se do JSON-LD exportu**.

### Práce s poznámkami

U každé entity (slovník, pojem, číselník, položka) lze přidat libovolný počet poznámek tlačítkem **+ Přidat poznámku**. Každá poznámka má:
- Text
- Datum vytvoření
- Stav: **Nevyřízená** (žlutá) / **Vyřízená** (zelená)

Přepínání stavu poznámky je dostupné přímo u každé poznámky nebo z přehledového pohledu.

### Přehled poznámek projektu

Záložka **Poznámky** v hlavní navigaci zobrazuje:
- Souhrnné počty (nevyřízené, vyřízené, celkem)
- Filtrování dle stavu, slovníku a typu pojmu
- Přepínání stavu přímo ze seznamu

### Odznaky v postranním panelu

Karty slovníků a číselníků v postranním panelu zobrazují číslo nevyřízených poznámek (součet poznámek entity i všech jejích pojmů/položek).

### Poznámky v sestavách

Nevyřízené autorské poznámky se automaticky připojí na konec každé sestavy slovníku nebo číselníku, jako podklad pro projednání.

---

## Vyhledávání

Záložka **Hledat** umožňuje fulltextové vyhledávání pojmů napříč všemi slovníky projektu.

Vyhledávání prohledává:
- Název (česky i anglicky)
- Synonyma
- Definici
- Popis

Výsledky jsou seskupeny dle slovníku. Kliknutím na výsledek se přejde přímo na editaci pojmu.

---

## ELI — průvodce odkazem na právní předpis

### Průvodce ELI

Dialog **⚖ Detailně…** umožňuje sestavit přesný odkaz na ustanovení:

| Pole | Příklad hodnoty |
|------|-----------------|
| Rok vyhlášení | `1997` |
| Číslo předpisu | `13` |
| Datum znění | `2024-07-01` (prázdné = aktuální) |
| Část | `cast_6` |
| Paragraf | `par_20`, `par_3a` |
| Odstavec | `odst_2` |
| Písmeno | `pism_b` |
| Bod | `bod_1` |

Náhled výsledného IRI se zobrazuje průběžně při zadávání. Tlačítkem **Vložit IRI** se odkaz vloží do formuláře.

### Formát uložení a zobrazení

- **Ukládáno:** `https://opendata.eselpoint.cz/esel-esb/eli/cz/sb/{rok}/{číslo}/{datum}/dokument/norma/{...}`
- **Zobrazováno:** čitelný popis, např. `Předpis 13/1997 Sb., § 20 odst. 2 písm. b) (znění k 1. 7. 2024)`
- **Odkaz 🔗:** `https://www.e-sbirka.cz/eli/cz/sb/{rok}/{číslo}/{datum}/{...}`

Tento formát zajišťuje kompatibilitu s OFN specifikací a zároveň přímé otevírání v uživatelsky přívětivé e-Sbírce.

---

## Auto-generování IRI

Při zadávání názvu (slovník, pojem) nebo kódu (položka) se IRI automaticky navrhne, pokud:
- Pole IRI je prázdné
- Je nastaveno základní IRI organizace v nastavení projektu

| Entita | Vzorec |
|--------|--------|
| Slovník | `{základní IRI}/{slug z názvu}` |
| Pojem | `{IRI slovníku}/pojem/{slug z názvu}` |
| Číselník | `{základní IRI}/{slug z názvu}` |
| Položka | `{IRI číselníku}/položky/{slug z kódu}` |

Slug se tvoří z názvu/kódu: malá písmena, diakritika odstraněna, mezery nahrazeny pomlčkami.

Tlačítko **⚙ Generovat** spustí generování kdykoli ručně. Pokud slovník/číselník nemá nastavené IRI, zobrazí se varování.

---

## Technické informace

### Uložení dat

Data jsou uložena v `localStorage` prohlížeče:
- Klíč: `ofnv3`, verze: `v4`
- Při načtení jiné verze se data automaticky vymaže (ochrana před nekompatibilitou)
- Projekt lze exportovat jako `.json` a sdílet nebo zálohovat

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Nevyžaduje připojení k internetu.

### Reset aplikace

Tlačítko **⚠ Resetovat aplikaci** v sekci Import/Export na záložce Projekt smaže všechna data v localStorage a obnoví aplikaci do výchozího stavu. Akce je nevratná a vyžaduje potvrzení.

### OFN schémata

Aplikace pracuje s těmito OFN schématy:
- Slovníky: `https://ofn.gov.cz/slovníky/`
- Číselníky: `https://ofn.gov.cz/číselníky/2022-02-08/`

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| OFN | Otevřená formální norma — technické doporučení DIA pro datové sady veřejné správy ČR |
| IRI | Internationalized Resource Identifier — globální identifikátor entity (URI s podporou Unicode) |
| ELI | European Legislation Identifier — standardní identifikátor právních předpisů |
| JSON-LD | Formát pro propojená data (Linked Data) ve formátu JSON |
| PPDF | Propojený datový fond — sdílení údajů mezi agendami veřejné správy |
| RPP | Registr práv a povinností — evidence agend, AIS a datových prvků |
| NKOD | Národní katalog otevřených dat |
| Tezaurus | Slovník na úrovni pojmů bez formálních logických vztahů |
| Konceptuální model | Slovník s formálními vazbami (vlastnosti, vztahy, definiční obory) |
| Snapshot | Zaznamenaný stav pojmů/položek v daném okamžiku pro účely verzování |

---

*Dokumentace odpovídá stavu aplikace Správce datového katalogu úřadu ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
