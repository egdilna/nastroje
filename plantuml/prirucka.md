# Uživatelská příručka: PlantUML editor

## Obsah

1. [Úvod](#1-úvod)
2. [Rozvržení obrazovky](#2-rozvržení-obrazovky)
3. [Práce s projektem](#3-práce-s-projektem)
4. [Správa složek a diagramů](#4-správa-složek-a-diagramů)
5. [Typy diagramů](#5-typy-diagramů)
6. [Aktivitní diagram (flow/action)](#6-aktivitní-diagram-flowaction)
7. [Třídní diagram (class)](#7-třídní-diagram-class)
8. [Sekvenční diagram (sequence)](#8-sekvenční-diagram-sequence)
9. [Diagram případů užití (use case)](#9-diagram-případů-užití-use-case)
10. [Detail a úprava prvků](#10-detail-a-úprava-prvků)
11. [Verzování diagramů](#11-verzování-diagramů)
12. [Validace diagramu](#12-validace-diagramu)
13. [Zdrojový kód, náhled a export](#13-zdrojový-kód-náhled-a-export)
14. [Nastavení projektu a diagramu](#14-nastavení-projektu-a-diagramu)
15. [Import souborů .puml](#15-import-souborů-puml)
16. [Klávesové zkratky](#16-klávesové-zkratky)
17. [Tipy a řešení problémů](#17-tipy-a-řešení-problémů)

---

## 1. Úvod

**PlantUML editor** je webová aplikace umožňující vytvářet a editovat diagramy ve formátu [PlantUML](https://plantuml.com/) bez nutnosti ručně psát zdrojový kód. Stačí otevřít soubor `index.html` v jakémkoli moderním prohlížeči — aplikace nevyžaduje instalaci, server ani přístup k internetu pro základní editaci.

### Co aplikace umí

- Vizuální editace čtyř typů diagramů: **aktivitní**, **třídní**, **sekvenční** a **use case**
- Automatické generování zdrojového kódu PlantUML
- Správa více diagramů v rámci jednoho **projektu**
- Organizace diagramů do **složek**
- **Verzování** — uložení stavu diagramu a návrat k libovolné dřívější verzi
- **Validace** — upozornění na chybějící nebo konfliktní data
- Export diagramu jako `.puml`, PNG nebo SVG
- Import existujících `.puml` souborů
- Podpora **témat** a vlastních `skinparam` parametrů
- Plná přístupnost (klávesnice, čtečky obrazovky)

### Formát uložení projektu

Projekt se ukládá jako jeden soubor s příponou **`.pup`** (PlantUML Project). Jde o textový soubor ve formátu JSON, který obsahuje všechny diagramy, složky, verze a nastavení. Soubor lze otevřít v textovém editoru nebo zpracovat programově.

---

## 2. Rozvržení obrazovky

Aplikace je rozdělena do tří hlavních oblastí:

```
┌──────────────────────────────────────────────────────────────────────┐
│  HLAVIČKA — název projektu + tlačítka pro správu projektu           │
├─────────────────┬────────────────────────────────┬───────────────────┤
│  LEVÝ PANEL     │  HLAVNÍ PANEL                  │  PRAVÝ PANEL      │
│  (Diagramy      │  (Editor diagramu)             │  (Zdrojový kód    │
│   v projektu)   │                                │   a export)       │
│                 │  • Struktura diagramu          │                   │
│  • Složky       │  • Detail vybraného prvku      │  • PlantUML kód   │
│  • Diagramy     │  • Verze                       │  • Náhled, PNG,   │
│                 │  • Validace                    │    .puml, kopie   │
└─────────────────┴────────────────────────────────┴───────────────────┘
```

### Hlavička

Obsahuje název aktuálního projektu a tato tlačítka:

| Tlačítko | Zkratka | Funkce |
|---|---|---|
| **Nový projekt** | Alt+N | Vytvoří prázdný projekt (aktuální neuložený stav se ztratí) |
| **Načíst projekt** | Alt+O | Otevře soubor `.pup` nebo `.puml` |
| **Uložit projekt** | Alt+S | Stáhne projekt jako soubor `.pup` |
| **Importovat .puml** | Alt+I | Přidá diagram z existujícího souboru `.puml` |
| **Nastavení projektu** | — | Název, téma, skinparam, hlavička, patička |
| **Nápověda** | Alt+H | Stručná nápověda v dialogu |

### Levý panel — Diagramy v projektu

Zobrazuje strom složek a diagramů. Každý diagram je označen barevným odznakem s typem (`flow`, `class`, `seq`, `usecase`). Kliknutím na diagram se otevře jeho editor v hlavní části.

Tlačítka nad stromem:

| Tlačítko | Zkratka | Funkce |
|---|---|---|
| **Nový diagram** | Alt+D | Přidá nový diagram do projektu |
| **Nová složka** | Alt+F | Vytvoří organizační složku |

### Hlavní panel — Editor diagramu

Po vybrání diagramu se zobrazí:

- **Struktura diagramu** — strom prvků s tlačítky pro přidání, přesun a smazání
- **Detail vybraného prvku** — formulář pro editaci vlastností prvku
- **Verze diagramu** — seznam uložených verzí
- **Validace diagramu** — seznam nalezených chyb a varování

Nad stromem jsou akce pro aktuální diagram:

| Tlačítko | Funkce |
|---|---|
| **Přejmenovat** | Změní název diagramu |
| **Přesunout do složky** | Přesune diagram do jiné složky |
| **Duplikovat** | Vytvoří kopii diagramu |
| **Smazat diagram** | Smaže diagram i s historií verzí |
| **Nastavení diagramu** | Téma, skinparam, titulek, hlavička, patička diagramu |

### Pravý panel — Zdrojový kód a export

Zobrazuje automaticky generovaný kód PlantUML (jen pro čtení). Nad textovým polem jsou tlačítka:

| Tlačítko | Zkratka | Funkce |
|---|---|---|
| **Náhled (SVG)** | Alt+P | Otevře diagram jako SVG na plantuml.com v novém okně |
| **Stáhnout PNG** | — | Stáhne obrázek ve formátu PNG |
| **Stáhnout .puml** | Alt+U | Stáhne zdrojový kód jako soubor `.puml` |
| **Zkopírovat zdroj** | — | Zkopíruje kód do schránky |

---

## 3. Práce s projektem

### Vytvoření nového projektu

Klikněte na **Nový projekt** (Alt+N). Potvrzením upozornění se vytvoří prázdný projekt s názvem „Nový projekt". Název a další nastavení projektu změníte přes **Nastavení projektu**.

> ⚠️ Při vytvoření nového projektu se aktuální neuložený stav ztratí. Projekt nejprve uložte (Alt+S).

### Uložení projektu

Klikněte na **Uložit projekt** (Alt+S). Prohlížeč stáhne soubor `<název projektu>.pup`. Soubor je ve formátu JSON a obsahuje všechna data projektu.

### Načtení projektu

Klikněte na **Načíst projekt** (Alt+O) a vyberte soubor. Aplikace automaticky rozpozná, zda se jedná o projekt `.pup` (JSON) nebo zdrojový kód `.puml`, a korektně jej zpracuje. Funguje proto i se soubory bez přípony nebo přejmenovanými soubory.

### Nastavení projektu

Klikněte na **Nastavení projektu** a upravte:

- **Název projektu** — zobrazuje se v hlavičce a v názvu okna prohlížeče
- **Téma (theme)** — vizuální styl pro všechny diagramy v projektu (lze přepsat v nastavení konkrétního diagramu)
- **Vlastní skinparam** — parametry pro přizpůsobení vzhledu (jeden parametr na řádek, bez klíčového slova `skinparam`)
- **Hlavička** — text zobrazený v záhlaví každého diagramu
- **Patička** — text zobrazený v zápatí každého diagramu

Nastavení projektu platí pro všechny diagramy jako výchozí hodnoty; nastavení jednotlivého diagramu je může přepsat.

---

## 4. Správa složek a diagramů

### Vytvoření složky

Klikněte na **Nová složka** (Alt+F). Zadejte název složky. Pokud již existují složky, zobrazí se dotaz na nadřazenou složku — složky lze vnořovat. Složky slouží pouze k organizaci; generování kódu ani export nijak neovlivňují.

Složku lze přejmenovat kliknutím na její název ve stromě. Smazat ji lze tlačítkem `×` u složky — diagramy a podsložky uvnitř se přesunou na kořen (neztratí se).

### Vytvoření diagramu

Klikněte na **Nový diagram** (Alt+D). Zobrazí se dialog, kde:
1. Vyberte **typ diagramu** (aktivitní, třídní, sekvenční, use case)
2. Zadejte **název diagramu**
3. Pokud projekt obsahuje složky, vyberte **složku** pro uložení (nebo nechte na kořeni)

### Přejmenování a přesunutí

Po výběru diagramu v levém panelu se v hlavní části zobrazí tlačítka akcí. Pomocí **Přejmenovat** lze změnit název, pomocí **Přesunout do složky** diagram zařadit do jiné složky nebo přesunout na kořen.

### Duplikování diagramu

Tlačítko **Duplikovat** vytvoří identickou kopii diagramu (s názvem „<originál> (kopie)") bez zachování historie verzí. Kopie je okamžitě vybrána.

### Smazání diagramu

Tlačítko **Smazat diagram** odstraní diagram včetně všech verzí. Tato akce je nevratná.

---

## 5. Typy diagramů

Aplikace podporuje čtyři typy diagramů:

| Typ | Označení | Popis |
|---|---|---|
| **Aktivitní diagram** | `flow` | Tok aktivit, rozhodnutí, smyčky, paralelní větve |
| **Třídní diagram** | `class` | Třídy, rozhraní, enumerace, vztahy, balíčky |
| **Sekvenční diagram** | `seq` | Zprávy mezi účastníky, skupiny, podmínky |
| **Diagram případů užití** | `usecase` | Aktéři, use cases, systémy, vztahy include/extend |

Typ diagramu je pevně dán při vytvoření a nelze jej změnit.

---

## 6. Aktivitní diagram (flow/action)

Aktivitní diagram popisuje průběh procesu nebo algoritmu.

### Prvky aktivitního diagramu

V nástrojové liště „Struktura diagramu" najdete tato tlačítka:

#### Základní uzly

| Tlačítko | PlantUML | Popis |
|---|---|---|
| **Akce** | `:text;` | Standardní krok procesu |
| **SDL task** | `<<task>>:text;` | SDL úloha |
| **SDL input** | `<<input>>:text;` | Přijetí vstupního signálu |
| **SDL output** | `<<output>>:text;` | Odeslání výstupního signálu |
| **SDL procedure** | `<<procedure>>:text;` | Volání procedury |
| **SDL save** | `<<save>>:text;` | Uložení stavu |
| **SDL load** | `<<load>>:text;` | Načtení stavu |
| **Vazba (šipka)** | `--> text;` | Šipka s volitelným textem nebo barvou |
| **Rozhodnutí (if)** | `if (...) then ... endif` | Podmíněné větvení (vytvoří dvě větve) |
| **Smyčka while** | `while (...) ... endwhile` | Cyklus s podmínkou na začátku |
| **Smyčka repeat** | `repeat ... repeat while (...)` | Cyklus s podmínkou na konci |
| **Fork (paralelní)** | `fork ... fork again ... end fork` | Paralelní větve (s volbou `end fork` / `end merge`) |
| **Split (větvení)** | `split ... split again ... end split` | Větvení |
| **Poznámka** | `note right / left / top / bottom ...` | Připojená poznámka |
| **Start** | `start` | Počáteční uzel |
| **Stop** | `stop` | Ukončení toku |
| **End** | `end` | Alternativní ukončení |
| **Detach** | `detach` | Oddělení toku |
| **Kill** | `kill` | Přerušení toku |
| **Break** | `break` | Přerušení cyklu |
| **Plavací dráhy…** | `\|lane\|` | Správa plavacích drah (swimlanes) |

### Vkládání prvků

- **Nic není vybráno**: nový prvek se přidá na konec diagramu
- **Je vybrán uzel**: nový prvek se vloží za vybraný uzel
- **Je vybrána větev** (u if/fork/split) nebo **uzel while/repeat**: nový prvek se vloží dovnitř

### Větve rozhodnutí (if)

Při přidání rozhodnutí se automaticky vytvoří dvě větve: „ano" a „ne". Kliknutím na větev ve stromě se zobrazí její detail, kde lze upravit popisek. Tlačítkem **+ elseif větev** přidáte další podmíněnou větev (vloží se mezi existující větve před „else"). Poslední větev je vždy větev „else".

> ⚠️ Skupinu (if/fork/split) musí tvořit nejméně dvě větve. Chcete-li odebrat celou podmínku, smažte ji jako celek.

### Plavací dráhy (swimlanes)

Kliknutím na **Plavací dráhy…** zadáte seznam drah (každá na jeden řádek). Dráhy pak lze akcím přiřazovat v detailu akce v poli „Plavací dráha". Akce bez přiřazené dráhy nepatří do žádné dráhy.

### Vlastnosti akce (detail)

Po výběru akce ve stromě se v panelu Detail zobrazí:

- **Text akce** — obsah kroku (průběžně aktualizuje zdrojový kód)
- **SDL stereotyp** — tvar akce dle SDL notace
- **Plavací dráha** — přiřazení dráhy (musí existovat v seznamu drah)
- **Barva pozadí** — výběr z 40 pojmenovaných barev nebo custom hodnoty
- **Poznámka u akce** — doplňková poznámka (s výběrem pozice vlevo/vpravo)

---

## 7. Třídní diagram (class)

Třídní diagram zachycuje strukturu systému — třídy, jejich atributy, metody a vzájemné vztahy.

### Typy entit

V nástrojové liště lze přidat tyto typy entit:

| Tlačítko | Klíčové slovo | Popis |
|---|---|---|
| **Class** | `class` | Obyčejná třída |
| **Interface** | `interface` | Rozhraní |
| **Abstract** | `abstract class` | Abstraktní třída |
| **Enum** | `enum` | Výčtový typ |
| **Struct** | `struct` | Struktura |
| **Annotation** | `annotation` | Anotace |
| **Entity** | `entity` | Entita (zpravidla DB) |
| **Vztah** | (šipka) | Vazba mezi třídami |
| **Balíček** | `package` | Seskupení tříd |

### Detail třídy

Po výběru třídy ve stromě lze upravovat:

- **Název** — zobrazovaný název třídy
- **Identifikátor (alias)** — krátký ASCII identifikátor (bez mezer a diakritiky); v PlantUML se generuje jako `"Název" as Alias`
- **Stereotyp** — základní typ (class, interface, abstract, enum, struct, annotation, entity)
- **Doplňující stereotyp** — libovolný text za `<<`, např. `service`, `repository`
- **Balíček** — zařazení třídy do balíčku

#### Atributy

Každý atribut má tyto vlastnosti:

| Vlastnost | Popis |
|---|---|
| Viditelnost | `+` public, `-` private, `#` protected, `~` package |
| Název | Název atributu |
| Typ | Datový typ |
| Výchozí hodnota | Počáteční hodnota |
| static | Příznak statického členu |
| abstract | Příznak abstraktního členu |

Atributy lze řadit šipkami ↑↓ a mazat.

#### Metody

Každá metoda má tyto vlastnosti:

| Vlastnost | Popis |
|---|---|
| Viditelnost | `+` public, `-` private, `#` protected, `~` package |
| Název metody | Název metody |
| Návratový typ | Typ návratové hodnoty |
| static / abstract | Příznaky |
| Parametry | Každý parametr má název a typ |

#### Hodnoty enumerace

Pro typ `enum` se zobrazí sekce **Hodnoty enum** s možností přidávat, upravovat a mazat hodnoty výčtu.

#### Poznámka ke třídě

Lze přidat volný text poznámky s volbou pozice (vlevo, vpravo, nad, pod).

### Balíčky

Balíčky slouží k logickému seskupení tříd. V detailu balíčku lze nastavit:
- **Název** — zobrazovaný název
- **Alias** — identifikátor pro odkazování
- **Nadřazený balíček** — pro vnořování balíčků

Při smazání balíčku třídy v něm zůstanou (přesunou se na kořen, neztrácejí se).

### Vztahy

Vztah propojuje dvě třídy. V detailu vztahu se nastavuje:

| Vlastnost | Popis |
|---|---|
| Výchozí třída | Odkud šipka vychází |
| Cílová třída | Kam šipka míří |
| Typ vztahu | dědičnost, realizace, kompozice, agregace, asociace, závislost |
| Kardinalita u výchozí třídy | Multiplicita (1, 0..1, *, 1..*, vlastní…) |
| Kardinalita u cílové třídy | Multiplicita |
| Popisek | Text na šipce |
| Směr šipky | forward (výchozí → cílová) nebo backward (cílová → výchozí) |
| Barva čáry | Výběr barvy |

#### Kardinalita — vlastní hodnota

Pro méně obvyklé multiplicity (např. `3..7`) vyberte „Vlastní hodnota…" a zadejte libovolný text.

---

## 8. Sekvenční diagram (sequence)

Sekvenční diagram zachycuje výměnu zpráv mezi účastníky v čase.

### Účastníci

Tlačítky v nástrojové liště přidáte účastníka konkrétního typu:

| Typ | PlantUML | Vizuální podoba |
|---|---|---|
| **actor** | `actor` | Panáček |
| **participant** | `participant` | Obdélník |
| **boundary** | `boundary` | Rozhraní (kruh + linie) |
| **control** | `control` | Ovládací prvek (šipka v kruhu) |
| **entity** | `entity` | Entita (kruh s linou) |
| **database** | `database` | Válec (databáze) |
| **collections** | `collections` | Stoh obdélníků |
| **queue** | `queue` | Fronta |

Pořadí účastníků ve stromu odpovídá pořadí jejich zobrazení v diagramu (sloupce zleva doprava). Pořadí lze měnit šipkami ↑↓.

### Zprávy

Přidání zprávy vyžaduje nejméně dva účastníky. V detailu zprávy se nastavuje:

| Vlastnost | Popis |
|---|---|
| Odesílatel | Odkud zpráva přichází |
| Příjemce | Kam zpráva míří |
| Text zprávy | Popisek zprávy |
| Typ šipky | synchronní (`->`), asynchronní (`->>`), návrat (`-->`), ztracená (`->x`) |
| Barva šipky | Volitelná barva |
| Aktivovat příjemce | Přidá `activate <příjemce>` |
| Deaktivovat příjemce | Přidá `deactivate <příjemce>` |
| Poznámka u zprávy | Text poznámky s volbou pozice (vlevo, vpravo, přes obě strany) |

### Skupiny

Skupiny umožňují označit blok zpráv:

| Skupin | PlantUML | Popis |
|---|---|---|
| **alt** | `alt ... else ... end` | Alternativa (větvení) |
| **opt** | `opt ... end` | Volitelný blok |
| **loop** | `loop ... end` | Opakování |
| **par** | `par ... else ... end` | Paralelní provádění |
| **critical** | `critical ... end` | Kritická sekce |
| **break** | `break ... end` | Přerušení |
| **group** | `group ... end` | Obecná skupina |

Skupiny `alt` a `par` podporují více větví — tlačítkem **+ další větev** ve stromě přidáte větev.

### Ostatní prvky sekvence

| Tlačítko | PlantUML | Popis |
|---|---|---|
| **Poznámka** | `note left/right/over ...` | Anotace k diagramu nebo účastníkovi |
| **Oddělovač** | `== text ==` | Vizuální oddělovač |
| **Autonumber** | `autonumber` | Automatické číslování zpráv (s volitelným počátkem a krokem) |
| **Pauza** | `... text ...` | Časová mezera |
| **Reference (ref)** | `ref over ... : text` | Odkaz na jiný diagram |

---

## 9. Diagram případů užití (use case)

Diagram use case zobrazuje funkce systému z pohledu uživatelů.

### Aktéři

Kliknutím na **Aktér (osoba)** nebo **Aktér (systém)** přidáte aktéra. Osoby se generují jako `actor`, systémové aktéry jako `:Název: as Alias <<system>>`.

V detailu aktéra nastavíte:
- **Název** — zobrazovaný název
- **Alias** — identifikátor (bez mezer a diakritiky)
- **Typ** — osoba/role nebo externí systém

### Use cases

Kliknutím na **Use case** přidáte případ užití. V detailu nastavíte:
- **Název** — zobrazovaný název
- **Alias** — identifikátor
- **Popis** — zobrazí se jako poznámka u use case v diagramu
- **Patří do systému** — zařazení do hranice systému (rectangle)

### Systémy (hranice systému)

Kliknutím na **Systém (rectangle)** přidáte obdélník označující hranici systému. Use cases pak lze zařadit do systému v jejich detailu nebo použít dropdown „Patří do systému". V detailu systému nastavíte název a alias.

### Vztahy

Přidáte kliknutím na **Vztah**. Podporované typy:

| Typ | PlantUML | Popis |
|---|---|---|
| **asociace** | `-->` | Základní vztah aktér ↔ use case |
| **include** | `..> : <<include>>` | Povinné zahrnutí jiného UC |
| **extend** | `..> : <<extend>>` | Podmíněné rozšíření UC |
| **generalizace** | `<\|--` | Dědičnost (aktér i UC) |

V detailu vztahu zvolíte typ výchozího i cílového prvku (aktér nebo use case), konkrétní prvky a volitelný popisek.

---

## 10. Detail a úprava prvků

Po kliknutí na prvek ve stromě struktury se v panelu **Detail vybraného prvku** zobrazí formulář s editovatelnými vlastnostmi.

### Okamžitá aktualizace

Textová pole a textové oblasti reagují na každou stisknutou klávesu — zdrojový kód v pravém panelu se průběžně aktualizuje, aniž by se překreslovalo celé rozhraní. Výběrová pole a zaškrtávátka překreslí celý diagram ihned po změně.

### Posun prvků

Každý prvek ve stromě má tlačítka **↑** (posunout nahoru) a **↓** (posunout dolů). Pořadí prvků ve stromě odpovídá pořadí v generovaném kódu.

### Smazání prvku

Tlačítkem **×** u prvku ve stromě vyvoláte potvrzovací dialog. Smazání je nevratné (k obnovení lze využít verzování).

---

## 11. Verzování diagramů

Verzování umožňuje uložit aktuální stav diagramu a kdykoli se k němu vrátit.

### Uložení verze

Klikněte na **Uložit verzi** (Alt+V). Zadejte krátký popisek verze (např. „Po schválení zadání"). Verze se přidá do seznamu pod strukturou diagramu.

### Obnovení verze

V sekci **Verze diagramu** najdete pro každou verzi tři tlačítka:
- **Obnovit tuto verzi** — před obnovou se automaticky uloží aktuální stav jako nová verze „Před obnovením z &lt;popisek&gt;", takže nikdy nepřijdete o data
- **Smazat verzi** — nevratné smazání verze
- **Náhled (SVG)** — zobrazí uloženou verzi v prohlížeči bez přepisu aktuálního stavu

> 💡 Verze nejsou ukládány automaticky. Vytvářejte je manuálně v klíčových okamžicích práce (po dokončení části, před zásadní změnou apod.).

---

## 12. Validace diagramu

Sekce **Validace diagramu** se zobrazuje pod verzemi a automaticky kontroluje strukturu diagramu. Problémy jsou rozlišeny na **chyby** (červeně) a **varování** (oranžově).

### Co se kontroluje

#### Aktivitní diagram
- Akce bez textu (varování)
- Rozhodnutí bez podmínky (varování)
- Smyčka bez podmínky (varování)
- Akce odkazující na neexistující plavací dráhu (chyba)
- Diagram bez uzlu `start` (varování)

#### Třídní diagram
- Třída bez názvu (chyba)
- Duplicitní název třídy (varování)
- Duplicitní alias třídy nebo balíčku (chyba)
- Vztah odkazující na neexistující třídu (chyba)

#### Sekvenční diagram
- Účastník bez aliasu (chyba)
- Duplicitní alias (varování)
- Zpráva odkazující na neexistujícího odesílatele nebo příjemce (chyba)
- Zpráva bez textu (varování)

#### Diagram případů užití
- Aktér nebo use case bez názvu (chyba)
- Duplicitní alias (chyba)
- Vztah odkazující na neexistující prvek (chyba)

Chyby nebrání generování kódu ani exportu, ale na plantuml.com může výsledný diagram vypadat nesprávně nebo se vůbec nevyrenderuje.

---

## 13. Zdrojový kód, náhled a export

### Generovaný zdrojový kód

Kód v pravém panelu se generuje automaticky z dat diagramu. Je pouze pro čtení — pro úpravy slouží formuláře. Kód začíná `@startuml` a končí `@enduml` a je okamžitě použitelný v jakémkoli PlantUML nástroji.

### Náhled jako SVG

Klikněte na **Náhled (SVG)** (Alt+P). V novém okně prohlížeče se otevře vykreslený diagram na serveru plantuml.com. Diagram se odešle zakódovaný v URL — žádný soubor se neodesílá, data jsou součástí adresy.

### Stažení PNG

Klikněte na **Stáhnout PNG**. Aplikace stáhne obrázek z plantuml.com. Pokud prohlížeč neumožní přímé stažení z důvodu CORS, otevře se obrázek v novém okně — tam jej lze uložit pravým tlačítkem myši.

### Stažení .puml

Klikněte na **Stáhnout .puml** (Alt+U). Stáhne se soubor `<název diagramu>.puml` s čistým PlantUML kódem.

### Kopírování do schránky

Klikněte na **Zkopírovat zdroj**. Zdrojový kód se zkopíruje do schránky. Pokud prohlížeč kopírování nepodporuje, kód se automaticky označí a lze jej zkopírovat ručně pomocí Ctrl+C.

---

## 14. Nastavení projektu a diagramu

### Téma (theme)

PlantUML podporuje předdefinovaná vizuální témata. Aplikace nabízí přes 30 témat, například:

| Téma | Popis |
|---|---|
| `(žádné)` | Výchozí styl PlantUML |
| `blueprint` | Modrý „technický výkres" |
| `sketchy` | Ručně kreslený styl |
| `mono` | Černobílý |
| `cyborg` | Tmavý |
| `minty` | Světle zelený |
| `vibrant` | Sytý barevný |

Kompletní seznam témat je k dispozici na [plantuml.com/theme](https://plantuml.com/theme).

Téma nastavené v **Nastavení projektu** se použije jako výchozí pro všechny diagramy. V **Nastavení diagramu** jej lze pro konkrétní diagram přepsat.

### Vlastní skinparam

Zadejte jeden parametr na řádek bez klíčového slova `skinparam`. Příklady:

```
backgroundColor #fefefe
defaultFontName Verdana
ArrowColor #336699
```

Aplikace automaticky doplní klíčové slovo `skinparam` před každý řádek. Parametry nastavené v projektu se kombinují s parametry konkrétního diagramu.

### Titulek diagramu

V **Nastavení diagramu** lze zadat **Titulek diagramu** — zobrazí se v záhlaví vykresleného diagramu jako deklarace `title`.

### Hlavička a patička

Libovolný víceřádkový text zobrazený v záhlaví (`header`) nebo zápatí (`footer`) každého vykresleného diagramu.

---

## 15. Import souborů .puml

### Jak importovat

Klikněte na **Importovat .puml** (Alt+I) a vyberte soubor `.puml`. Aplikace se pokusí analyzovat obsah a přidat diagram do projektu. Případně lze při **Načíst projekt** nahrát libovolný soubor — aplikace sama rozhodne, zda jde o projekt nebo PUML zdroj.

### Spolehlivost importu

- **Výstup z této aplikace** (round-trip) — importuje se spolehlivě; veškerá data se obnoví správně
- **Cizí PUML soubory** — import je „best-effort"; složité nebo nestandardní konstrukce mohou být vynechány nebo zjednodušeny

### Co se naimportuje

| Typ diagramu | Rozpoznávání |
|---|---|
| Aktivitní | klíčová slova `start`, `stop`, `:akce;`, `if (`, `while (`, `repeat`, `fork` |
| Třídní | klíčová slova `class`, `interface`, `abstract class`, `enum`, `struct`, `entity`, `annotation` |
| Use case | klíčová slova `usecase`, `:Aktor:`, `rectangle` |
| Sekvenční | klíčová slova `participant`, `boundary`, `control`, `database`, `->`, `-->`, `->>` |

Po importu zkontrolujte sekci **Validace diagramu** a v případě nesrovnalostí doplňte data ručně.

---

## 16. Klávesové zkratky

| Zkratka | Akce |
|---|---|
| **Alt+N** | Nový projekt |
| **Alt+O** | Načíst projekt |
| **Alt+S** | Uložit projekt |
| **Alt+I** | Importovat .puml |
| **Alt+H** | Otevřít nápovědu |
| **Alt+D** | Nový diagram |
| **Alt+F** | Nová složka |
| **Alt+V** | Uložit verzi diagramu |
| **Alt+P** | Náhled (SVG) |
| **Alt+U** | Stáhnout .puml |

> ℹ️ Na macOS se místo Alt používá klávesa Option (⌥).

---

## 17. Tipy a řešení problémů

### Diagram se nevyrenderuje na plantuml.com

Zkontrolujte sekci **Validace** — červené chyby zpravidla ukazují na konkrétní problém (chybějící třída, neplatný alias apod.).

### PNG se nestáhlo, otevřelo se nové okno

Jde o omezení prohlížeče (CORS). Obrázek je zobrazen v novém okně — klikněte na něj pravým tlačítkem myši a zvolte „Uložit obrázek jako…".

### Ztratil jsem neuložený projekt

Aplikace neukládá data automaticky — při zavření okna nebo obnovení stránky se vše ztratí. Ukládejte projekt pravidelně pomocí **Uložit projekt** (Alt+S).

### Jak zobrazit ladící výstup

Pokud se v pravém dolním rohu zobrazí panel s červeným rámečkem (debug), obsahuje technické informace o posledním problému. Panel zavřete tlačítkem „Zavřít".

### Alias a diakritika

Aliasy (identifikátory) musí obsahovat pouze písmena A–Z, a–z, číslice 0–9 a podtržítko. Aplikace českou diakritiku automaticky transliteruje (Žadatel → Zadatel). Pokud zadáte alias ručně, nepovolené znaky jsou tichě odstraněny.

### Kolizní aliasy

Při přidání třídy/aktéra s názvem, jehož alias by kolidoval s již existujícím, se automaticky přidá číselný suffix (Zákazník, Zákazník2, …). Aliasy lze kdykoli ručně upravit v detailu prvku.

### Práce s rozsáhlými projekty

Projekt s desítkami diagramů zůstává přehledný díky složkám. Při výrazném zpomalení prohlížeče zkontrolujte, zda jeden diagram neobsahuje stovky prvků — v tom případě zvažte rozdělení na více diagramů.

### Přístupnost

Aplikace je plně ovladatelná klávesnicí. Fokus se vždy pohybuje logicky. Pro uživatele čteček obrazovky jsou všechny interaktivní prvky opatřeny textovými popisky (`aria-label`).

---

*Příručka platí pro verzi aplikace dostupnou v souboru `plantuml/index.html` v repozitáři [egdilna/nastroje](https://github.com/egdilna/nastroje).*
