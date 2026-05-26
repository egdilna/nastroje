# PlantUML editor — Strukturovaný editor diagramů s živým náhledem

**Online verze nástroje:** [https://egdilna.github.io/nastroje/plantuml](https://egdilna.github.io/nastroje/plantuml)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#plantuml](https://egdilna.github.io/nastroje/#plantuml)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez nutnosti instalace.

---

## Přehled funkcí

**PlantUML editor** je přístupná webová aplikace pro vizuální tvorbu PlantUML diagramů. Místo psaní zdrojového kódu sestavíte diagram pomocí formulářů — aplikace průběžně generuje validní PlantUML zdroj a umožňuje jeho vykreslení přes oficiální server `plantuml.com`. Vše běží v jediném HTML souboru bez instalace.

### Klíčové funkce

- **Strukturovaný editor** — diagramy se sestavují přes formuláře (žádné psaní syntaxe PlantUML), zdrojový kód je generován automaticky
- **Čtyři typy diagramů** — aktivitní (flow/action), třídní (class), sekvenční (sequence), use case
- **Projekty s více diagramy** — projekt seskupuje libovolný počet diagramů, lze je třídit do hierarchie složek
- **Živý náhled** — tlačítko Náhled otevře SVG na plantuml.com v novém okně
- **Promítací režim** — samostatné okno s diagramem pro druhou obrazovku nebo projektor, lze aktualizovat ze základní aplikace
- **Export** — PNG, SVG (přes náhled), PlantUML zdroj (`.puml`)
- **Import .puml** — naimportuje existující PlantUML soubor (best-effort, vlastní výstup spolehlivě round-trip)
- **Verze diagramu** — manuální snapshoty s možností obnovení (před obnovením se automaticky zálohuje aktuální stav)
- **Validace** — průběžná kontrola správnosti modelu (chybějící texty, neplatné odkazy, duplicitní aliasy)
- **Témata a skinparam** — výběr z 33 oficiálních PlantUML témat, vlastní `skinparam` nastavení
- **Titulek, hlavička, patička, popisek** — čtyři textová pole kolem diagramu s kaskádou projekt → diagram
- **Plavací dráhy** — automatická registrace drah z akcí v aktivitních diagramech
- **Barevné prvky a šipky** — paleta 40 pojmenovaných barev s českými popisky

### Přístupnost

Aplikace je navržena s důrazem na přístupnost — semantické HTML, ARIA atributy, plné ovládání klávesnicí včetně šipkové navigace ve stromech, nativní `<dialog>` prvky pro modální okna a dostupný debug výstup přímo na stránce (ne v konzoli).

### Uložení dat

Projekt se ukládá jako jediný soubor s příponou `.pup` (PlantUML Project) — obsahuje všechny diagramy, složky, verze a nastavení v JSON formátu. Při načítání aplikace automaticky rozpozná, zda jde o projekt nebo o PUML zdroj, takže pracuje i s přejmenovanými soubory nebo soubory bez přípony. Data se nikam neodesílají, vykreslování přes plantuml.com posílá pouze zakódovaný zdrojový kód do URL.

---

## Rozložení aplikace

Aplikace je rozdělena do tří hlavních sloupců (při šířce nad 1100 px); na menších obrazovkách se sloupce řadí pod sebe.

### Záhlaví

Modré záhlaví obsahuje název projektu a panel akcí projektu:

| Tlačítko | Zkratka | Akce |
|----------|---------|------|
| Nový projekt | Alt+N | Vytvoří prázdný projekt (s potvrzením, pokud existující není uložen) |
| Načíst projekt | Alt+O | Otevře libovolný soubor — autodetekce typu (`.pup` JSON nebo `.puml` zdroj) |
| Uložit projekt | Alt+S | Stáhne projekt jako `.pup` JSON soubor |
| Importovat .puml | Alt+M | Naimportuje PlantUML soubor jako nový diagram do projektu |
| Nastavení projektu | — | Otevře dialog s názvem, tématem, hlavičkou/patičkou atd. |
| Nápověda | Alt+H | Zobrazí integrovanou nápovědu |

### Levý sloupec — Diagramy v projektu

Strom složek a diagramů. Diagramy mají barevně rozlišený typ (`flow`, `class`, `seq`, `usecase`). Tlačítka:

- **Nový diagram** (Alt+D) — dialog s výběrem typu a názvu
- **Nová složka** (Alt+F) — možnost zařadit do nadřazené složky
- U každé položky stromu: tlačítka pro přesun, smazání atd.

### Hlavní oblast — Editor diagramu

Po výběru diagramu se zobrazí:

- **Nadpis a akce diagramu** — Přejmenovat, Přesunout do složky, Duplikovat, Smazat, Nastavení diagramu
- **Struktura diagramu** — toolbar pro vkládání prvků + strom prvků
- **Detail vybraného prvku** — formulář pro úpravu vlastností aktuálně označeného uzlu/třídy/účastníka atd.
- **Verze diagramu** — seznam uložených snapshotů s možností obnovení a náhledu
- **Validace diagramu** — automaticky aktualizovaný seznam upozornění a chyb

### Pravý sloupec — Zdrojový kód a náhled

| Tlačítko | Zkratka | Akce |
|----------|---------|------|
| Náhled (SVG) | Alt+V | Otevře SVG diagram na plantuml.com v novém okně |
| Promítat | Alt+I | Otevře/aktualizuje promítací okno (viz Promítání) |
| Stáhnout PNG | Alt+E | Stáhne PNG (při CORS chybě otevře okno k ručnímu uložení) |
| Stáhnout .puml | Alt+U | Uloží zdrojový kód jako `.puml` soubor |
| Zkopírovat zdroj | Alt+C | Zkopíruje PlantUML zdroj do schránky |

Pod tlačítky je textarea s automaticky generovaným PlantUML kódem (jen pro čtení) — průběžně se aktualizuje při každé změně v modelu.

---

## Práce s projektem

### Vytvoření a načtení

Při startu aplikace je k dispozici prázdný projekt nazvaný „Nový projekt". Tlačítkem **Načíst projekt** lze vybrat libovolný soubor — aplikace si sama rozezná podle obsahu, zda jde o JSON projekt nebo o PlantUML zdroj. Pokud začíná `{`, načte se jako projekt; pokud obsahuje `@startuml` nebo klíčová slova diagramu, naimportuje se jako nový diagram.

### Nastavení projektu

Dialog **Nastavení projektu** obsahuje pole platná pro všechny diagramy v projektu:

| Pole | Popis |
|------|-------|
| Název projektu | Zobrazuje se v záhlaví a v názvu okna prohlížeče |
| Téma (theme) | Výběr z 33 oficiálních PlantUML témat (amiga, blueprint, cerulean, hacker, plain, sketchy aj.) |
| Vlastní skinparam | Více řádků skinparam parametrů; klíčové slovo `skinparam` se doplní automaticky |
| Titulek | Zobrazí se nahoře nad diagramem, podporuje víceřádkový text |
| Hlavička | Text úplně nahoře (nad titulkem), může být víceřádkový |
| Patička | Text úplně dole, může být víceřádkový |
| Popisek (caption) | Krátký jednořádkový popisek pod diagramem |

### Kaskáda projekt → diagram

Hodnoty z nastavení projektu se použijí pro všechny diagramy. Pokud konkrétní diagram má v dialogu **Nastavení diagramu** svou vlastní hodnotu (např. titulek), ta má přednost před hodnotou projektu. Skinparam parametry projektu se kombinují s parametry diagramu (oba se vypisují za sebe).

### Složky a organizace diagramů

Tlačítkem **Nová složka** vytvoříte složku, případně lze zadat nadřazenou složku (vznikne hierarchie). Diagram se do složky zařadí buď při vytvoření, nebo později tlačítkem **Přesunout do složky**. Smazání složky přesune diagramy uvnitř na kořen.

### Akce nad diagramem

- **Přejmenovat** — změna názvu
- **Přesunout do složky** — výběr cílové složky z dialogu
- **Duplikovat** — vytvoří kopii (bez historie verzí), pojmenovanou „(kopie)"
- **Smazat diagram** — nevratné, s potvrzením; smaže i všechny verze
- **Nastavení diagramu** — vlastní téma, skinparam, titulek, hlavička, patička a popisek pro tento diagram

---

## Typy diagramů

Editor podporuje čtyři typy diagramů. Při vytváření nového diagramu zvolíte typ — ten určuje sadu dostupných prvků a strukturu modelu.

| Typ | ID | Popis |
|-----|----|-------|
| Aktivitní diagram | `activity` | Tok řízení s akcemi, rozhodnutími, smyčkami a paralelním zpracováním |
| Class diagram | `class` | Třídy, rozhraní, výčty, balíčky a vztahy mezi nimi |
| Sequence diagram | `sequence` | Posloupnost zpráv mezi účastníky |
| Use Case diagram | `usecase` | Aktéři, případy užití a hranice systému |

### Aktivitní diagram

Modeluje tok procesu — od startu přes akce a rozhodnutí ke konci. Generuje se v moderní PlantUML notaci (activity beta).

**Dostupné prvky (toolbar):**

| Prvek | Význam |
|-------|--------|
| Akce | Standardní akce procesu (`:text;`) |
| SDL task | Akce se stereotypem `<<task>>` (úloha) |
| SDL input | Akce se stereotypem `<<input>>` (přijetí signálu) |
| SDL output | Akce se stereotypem `<<output>>` (odeslání signálu) |
| SDL procedure | Akce se stereotypem `<<procedure>>` (volání procedury) |
| SDL save | Akce se stereotypem `<<save>>` (uložení stavu) |
| SDL load | Akce se stereotypem `<<load>>` (načtení stavu) |
| Vazba (šipka) | Pojmenovaná/stylová šipka mezi prvky (`-> text;`) |
| Rozhodnutí (if) | Větvení s podmínkou (větve „ano" a „ne", lze přidat elseif) |
| Smyčka while | Cyklus s podmínkou na začátku |
| Smyčka repeat | Cyklus s podmínkou na konci |
| Fork (paralelní) | Paralelní rozvětvení s `end fork` nebo `end merge` |
| Split (větvení) | Větvení (`split` / `split again` / `end split`) |
| Poznámka | Volně umístěná poznámka (vlevo/vpravo/nad/pod) |
| Start, Stop, End | Uzly začátku a konce procesu |
| Detach, Kill, Break | Speciální ukončovací uzly |

**Akce má následující vlastnosti:**

| Vlastnost | Popis |
|-----------|-------|
| Text akce | Hlavní popis (`:text;`) |
| SDL stereotyp | Výběr ze sedmi SDL stereotypů, určuje tvar akce |
| Plavací dráha | Volitelné přiřazení k dráze (viz níže) |
| Barva pozadí | Výběr ze 40 pojmenovaných barev (nebo vlastní hex) |
| Poznámka u akce | Volitelná `note left/right` |

**Šipka (vazba)** má text, styl (plná/čárkovaná/tečkovaná/tučná) a barvu.

**Plavací dráhy** se spravují tlačítkem **Plavací dráhy…** (jeden název na řádek). Dráhy se navíc **automaticky registrují** z akcí — pokud do akce vyplníte dráhu, která dosud neexistuje, sama se přidá. Generátor správně řeší přepínání dráhy uvnitř `if`/`while` skupin, kde PlantUML potřebuje deklarovat všechny dráhy předem.

### Class diagram

Modeluje třídní strukturu — třídy, rozhraní, výčty, balíčky a jejich vztahy.

**Dostupné typy prvků:**

| Typ | Klíčové slovo PlantUML |
|-----|------------------------|
| Class | `class` |
| Interface | `interface` |
| Abstract | `abstract class` |
| Enum | `enum` (s podporou hodnot) |
| Struct | `struct` |
| Annotation | `annotation` |
| Entity | `entity` |

**Třída obsahuje:** název, alias (krátký identifikátor bez diakritiky, generuje se z názvu), doplňující stereotyp (např. `service`), balíček, atributy a metody.

**Atributy:** viditelnost (`+ public`, `- private`, `# protected`, `~ package`), název, typ, výchozí hodnota, příznaky `static`/`abstract`.

**Metody:** viditelnost, název, návratový typ, parametry (s typy), příznaky `static`/`abstract`.

**Vztahy** (tlačítko Vztah):

| Typ vztahu | Symbol PlantUML |
|------------|-----------------|
| Dědičnost (extends) | `<|--` |
| Realizace (implements) | `<|..` |
| Kompozice | `*--` |
| Agregace | `o--` |
| Asociace | `--` |
| Závislost | `..>` |

U vztahu lze nastavit kardinalitu (multiplicitu) na obou koncích, popisek, směr (výchozí → cílová nebo opačně) a barvu. Pro kardinalitu je k dispozici paleta s vlastní hodnotou:

| Kardinalita | Význam |
|-------------|--------|
| (neuvedeno) | Bez kardinality |
| `1` | Právě jeden |
| `0..1` | Nula nebo jeden (nepovinný) |
| `*` | Libovolný počet (i nula) |
| `1..*` | Alespoň jeden |
| `0..*` | Libovolný počet (i nula) |
| `2`, `2..*`, `n`, `1..n` | Předdefinované hodnoty |
| Vlastní hodnota… | Ruční zadání (např. `3..7`) |

**Balíčky** lze vnořovat (nadřazený balíček) a třídy do nich zařazovat.

**Poznámka ke třídě** s pozicí (vlevo/vpravo/nad/pod) se generuje jako `note ... of` blok.

### Sequence diagram

Modeluje posloupnost zpráv mezi účastníky.

**Typy účastníků:**

| Typ | Klíčové slovo |
|-----|---------------|
| actor | osoba |
| participant | obecný účastník (výchozí) |
| boundary | hranice systému |
| control | řídicí komponenta |
| entity | entitní komponenta |
| database | databáze |
| collections | kolekce |
| queue | fronta |

**Zpráva** má odesílatele, příjemce, text, typ šipky a volitelně poznámku:

| Typ šipky | Symbol |
|-----------|--------|
| synchronní | `->` |
| asynchronní | `->>` |
| návrat | `-->` |
| ztracená | `->x` |

U zprávy lze aktivovat/deaktivovat příjemce (boxík života) a nastavit barvu.

**Skupiny:**

| Skupina | Význam |
|---------|--------|
| `alt` | Alternativy (s větvemi `else`) |
| `opt` | Volitelná část |
| `loop` | Cyklus |
| `par` | Paralelní (s větvemi `else`) |
| `critical` | Kritická sekce |
| `break` | Přerušení |
| `group` | Obecné seskupení |

**Další prvky:**

| Prvek | Význam |
|-------|--------|
| Poznámka | `note left/right/over`, lze vázat k jednomu nebo více účastníkům |
| Oddělovač | `== text ==` |
| Autonumber | Automatické číslování zpráv (s počátkem a krokem) |
| Pauza | `...text...` (vizuální mezera) |
| Reference (ref) | `ref over` přes vybrané účastníky |

### Use Case diagram

Modeluje aktéry, případy užití a hranice systémů.

**Aktér** může být osoba (`actor`) nebo externí systém (`:Název: as alias <<system>>`).

**Use case** má název, alias a volitelný popis, který se generuje jako `note right of` blok. Use cases lze zařadit do systémů.

**Systém (rectangle)** je vizuální hranice se jménem a aliasem, do které spadají use cases.

**Vztahy:**

| Typ vztahu | Generuje se jako |
|------------|------------------|
| Asociace | `-->` |
| Include | `..>` s popiskem `<<include>>` |
| Extend | `..>` s popiskem `<<extend>>` |
| Generalizace | `<|--` |

Vztah propojuje aktéra nebo use case s jiným aktérem nebo use case; oba konce mají typ a popisek.

---

## Editor — stromová struktura a detail

Strom prvků uprostřed obrazovky zobrazuje hierarchii modelu. Kliknutím na prvek se zobrazí jeho formulář v sekci **Detail vybraného prvku**. U každého prvku jsou tlačítka **↑** (posun nahoru), **↓** (posun dolů) a **×** (smazat).

### Pravidla vkládání

Tlačítka v toolbaru přidávají nový prvek podle aktuálního výběru:

- Pokud není nic vybráno: na konec hlavního seznamu
- Pokud je vybraná **větev** (např. v `if` nebo `fork`): dovnitř větve
- Pokud je vybraný uzel typu `while` / `repeat`: dovnitř smyčky
- Pokud je vybraný konkrétní prvek: vloží se **za něj** ve stejné úrovni

U skupin `if` / `fork` / `split` se ve stromu zobrazuje tlačítko **+ elseif větev** / **+ další větev** pro přidání další alternativy.

### Barvy

Paleta obsahuje 40 pojmenovaných barev v češtině — základní (bílá, černá, červená, modrá…), světlé varianty (světle modrá, světle růžová…), tmavé varianty (tmavě červená, tmavě fialová…) a speciální (zlatá, stříbrná, námořní modrá, vínová…). Hodnoty jsou validní CSS i PlantUML názvy, takže nepotřebují konverzi. Pokud načtete PUML s barvou, kterou paleta neobsahuje, doplní se automaticky jako „Vlastní: …".

### Aliasy

Pro třídy, balíčky, účastníky sekvence, aktéry, use cases a systémy se generuje krátký alias (identifikátor bez diakritiky a mezer). Alias se odvodí z názvu pomocí NFKD normalizace (Žadatel → Zadatel), pak se omezí na `A-Z`, `a-z`, `0-9`, `_`. Pokud by alias kolidoval s jiným, doplní se číselný suffix (`Zadatel2`).

---

## Promítací režim

Tlačítko **Promítat** otevře vykreslený SVG diagram v samostatném okně. Hodí se pro druhou obrazovku nebo projektor — zatímco v hlavním okně pokračujete v úpravách, ve druhém okně máte stále aktuální verzi diagramu.

| Stav | Akce tlačítka |
|------|--------------|
| Okno není otevřené | Tlačítko zobrazuje „Promítat" — otevře nové okno |
| Okno je otevřené | Tlačítko zobrazuje „Překreslit promítání" — aktualizuje obsah |
| Uživatel zavře okno | Tlačítko se vrátí na „Promítat" (kontrola každou sekundu) |

V promítacím okně je tlačítko **Celá obrazovka** využívající Fullscreen API (alternativně F11 prohlížeče). Promítací okno nemá vlastní ovládání obsahu — vše se řídí z hlavní aplikace.

---

## Verze diagramu

Verze nejsou automatické — uložíte je tlačítkem **Uložit verzi** (Alt+W) s vlastním popiskem. Snapshot obsahuje kompletní model a nastavení diagramu.

### Akce nad verzemi

| Akce | Popis |
|------|-------|
| Obnovit tuto verzi | Před obnovením se automaticky uloží aktuální stav jako verze „Před obnovením z: …", takže nikdy nepřijdete o data |
| Smazat verzi | Nevratné, s potvrzením |
| Náhled (SVG) | Otevře vykreslený diagram ze snapshotu v novém okně bez obnovení |

---

## Validace

Sekce **Validace diagramu** zobrazuje průběžně aktualizovaný seznam upozornění a chyb. Validace probíhá při každé změně modelu.

### Pravidla podle typu

**Aktivitní diagram:**
- Upozornění: akce bez textu, rozhodnutí/smyčka bez podmínky, diagram bez `start`

**Class diagram:**
- Chyby: třída bez názvu, duplicitní alias, vztah na neexistující třídu
- Upozornění: duplicitní název třídy

**Sequence diagram:**
- Chyby: účastník bez aliasu, zpráva na neexistujícího odesílatele/příjemce
- Upozornění: duplicitní alias, zpráva bez textu

**Use Case diagram:**
- Chyby: aktér/use case bez názvu, duplicitní alias, vztah na neexistující prvek

Chyby jsou červeně, upozornění žlutě.

---

## Export, import a sdílení

### Stažení PNG

Tlačítko **Stáhnout PNG** (Alt+E) zavolá oficiální vykreslovací službu na `plantuml.com`. Pokud prohlížeč zablokuje stažení kvůli CORS, otevře se URL v novém okně, kde si uživatel obrázek uloží přes pravé tlačítko myši.

### Náhled SVG

Tlačítko **Náhled (SVG)** (Alt+V) otevře vykreslený diagram jako SVG na plantuml.com v novém okně. Pro uložení SVG použijte pravé tlačítko v náhledu.

### Stažení .puml zdroje

Tlačítko **Stáhnout .puml** (Alt+U) uloží PlantUML zdrojový kód jako textový soubor. Soubor lze otevřít v libovolném PlantUML nástroji nebo zpět naimportovat do editoru.

### Zkopírování zdroje

Tlačítko **Zkopírovat zdroj** (Alt+C) vloží PlantUML kód do schránky. Pokud schránkové API selže, zdroj se vybere v textarea a uživatel jej zkopíruje pomocí Ctrl+C.

### Import .puml

Tlačítkem **Importovat .puml** (Alt+M) lze přidat existující PlantUML soubor jako nový diagram do projektu. Aplikace automaticky rozpozná typ diagramu podle obsahu (klíčová slova `start`, `class`, `actor`, `participant`, `usecase`, `rectangle` aj.).

**Spolehlivost importu:**
- **Vlastní výstup**: spolehlivý round-trip (export a opětovný import dává stejný model)
- **Cizí PUML**: best-effort, složitější konstrukce mohou být vynechány

Po importu doporučujeme zkontrolovat sekci Validace a případně data upřesnit ve formulářích. Akce v aktivitních diagramech podporují tři syntaktické varianty (moderní `:text; <<stereo>>`, starou prefixovou `<<stereo>>#color:text;` a velmi starou suffixovou `:text<`).

### Uložení a načtení projektu

Tlačítko **Uložit projekt** (Alt+S) stáhne celý projekt jako soubor `.pup` (JSON formát) s všemi diagramy, složkami, verzemi a nastavením.

Tlačítko **Načíst projekt** (Alt+O) otevře libovolný soubor — automatická detekce podle obsahu rozhoduje, zda se jedná o JSON projekt nebo PUML zdroj. Funguje proto i u souborů bez přípony nebo přejmenovaných.

---

## Klávesové zkratky

### Globální (Alt+písmeno odpovídá `accesskey`)

| Zkratka | Akce |
|---------|------|
| Alt+N | Nový projekt |
| Alt+O | Načíst projekt |
| Alt+S | Uložit projekt |
| Alt+M | Importovat .puml |
| Alt+H | Nápověda |
| Alt+D | Nový diagram |
| Alt+F | Nová složka |
| Alt+W | Uložit verzi diagramu |

### Náhled, promítání, export

| Zkratka | Akce |
|---------|------|
| Alt+V | Náhled (SVG) v okně |
| Alt+I | Promítat / Překreslit promítání |
| Alt+E | Stáhnout PNG |
| Alt+U | Stáhnout .puml |
| Alt+C | Zkopírovat zdroj do schránky |

### Navigace ve stromech

V seznamu diagramů a v seznamu prvků diagramu fungují kromě Tab i šipky:

| Klávesa | Akce |
|---------|------|
| Šipka nahoru/dolů | Přepnutí mezi položkami |
| Šipka doleva/doprava | Přepnutí mezi odkazem a akčními tlačítky (↑ ↓ ×) |
| Home | Skok na první položku |
| End | Skok na poslední položku |

### Dialogy

| Klávesa | Akce |
|---------|------|
| Enter | Potvrzení (v jednořádkovém vstupu) |
| Ctrl+Enter | Potvrzení v textarea (Enter v textarea dělá nový řádek) |
| Esc | Zrušení dialogu |

---

## Témata

Aplikace nabízí výběr z 33 oficiálních PlantUML témat:

`amiga`, `aws-orange`, `black-knight`, `bluegray`, `blueprint`, `cerulean`, `cerulean-outline`, `crt-amber`, `crt-green`, `cyborg`, `hacker`, `lightgray`, `mars`, `materia`, `materia-outline`, `metal`, `mimeograph`, `minty`, `mono`, `plain`, `reddress-darkblue`, `reddress-darkgreen`, `reddress-lightblue`, `sandstone`, `silver`, `sketchy`, `sketchy-outline`, `spacelab`, `superhero`, `toy`, `united`, `vibrant`.

Téma se nastavuje v dialogu **Nastavení projektu** nebo **Nastavení diagramu** a vkládá se do PlantUML jako direktiva `!theme nazev`.

### Vlastní skinparam

Pole **Vlastní skinparam** akceptuje jeden parametr na řádek, bez klíčového slova `skinparam` (doplní se automaticky):

```
backgroundColor #fefefe
defaultFontName Verdana
```

---

## Technické informace

### Architektura

- Jediný HTML soubor obsahuje vše — markup, CSS, JavaScript
- Žádné externí knihovny, žádný build proces
- Vanilla JavaScript, semantické HTML a ARIA pro přístupnost
- Vykreslování diagramů přes oficiální službu `plantuml.com` přes URL kódování (`~h` hex formát)

### Formát URL pro plantuml.com

Aplikace kóduje zdrojový kód do hexadecimálního formátu (`~h{hex}`) a sestavuje URL:

```
https://www.plantuml.com/plantuml/svg/~h{hex}
https://www.plantuml.com/plantuml/png/~h{hex}
```

To znamená, že na server `plantuml.com` se odesílá pouze obsah aktuálního diagramu — žádná data o projektu, autorovi ani jiných diagramech.

### Formát projektu (.pup)

Projekt je JSON soubor s následující strukturou:

| Pole | Typ | Popis |
|------|-----|-------|
| `schemaVersion` | číslo | Verze schématu (aktuálně 1) |
| `projectName` | string | Název projektu |
| `created`, `modified` | ISO datum | Časové značky |
| `settings` | objekt | Nastavení projektu (theme, skinparam, header, footer, title, caption) |
| `folders` | pole | Složky `{id, name, parentId}` |
| `diagrams` | pole | Diagramy `{id, name, type, folderId, settings, model, versions}` |

### Migrace formátu

Při načtení projektu se automaticky migrují starší formáty — například stará vlastnost `shape` u akcí v aktivitních diagramech se převede na novou `stereotype` podle mapování legacy znaků (`]` → `task`, `<` → `input`, `>` → `output`, `|` → `procedure`).

### Generovaná syntax PlantUML

Editor generuje moderní PlantUML syntax — pro aktivitní diagramy variantu „beta" (`:text; <<stereotype>> <<#color>>`), pro vztahy class diagramů barvu jako `[#color]` vloženou do šipky. Při importu se naopak rozpoznají i starší varianty zápisu.

### Debug

Pokud při generování PlantUML kódu nebo importu nastane chyba, zobrazí se debugovací výpis v boxu vpravo dole. Box lze zavřít tlačítkem **Zavřít**.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Vyžaduje připojení k internetu pouze pro vykreslení diagramu (přístup na `plantuml.com`); editor a uložení projektu funguje offline.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| PlantUML | Textový jazyk pro popis UML diagramů s vykreslovacím serverem |
| `.pup` | PlantUML Project — formát uložení projektu této aplikace (JSON) |
| `.puml` | Standardní přípona souboru s PlantUML zdrojovým kódem |
| Alias | Krátký identifikátor entity bez diakritiky a mezer pro použití v PlantUML kódu |
| Stereotyp | Klasifikace prvku v UML, zapisuje se jako `<<stereotyp>>` |
| Kardinalita | Multiplicita vztahu — kolik instancí jedné strany odpovídá jedné instanci druhé |
| Plavací dráha | Vertikální/horizontální oblast v aktivitním diagramu představující odpovědnost (role, oddělení) |
| Skinparam | PlantUML direktiva pro grafické nastavení (barvy, fonty atd.) |
| Theme | Předdefinovaná sada vizuálních nastavení (skinparam parametrů) |
| Snapshot | Zaznamenaný stav modelu a nastavení diagramu pro účely verzování |
| Round-trip | Proces export → import beze ztráty informace |

---

*Dokumentace odpovídá stavu aplikace PlantUML editor ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
