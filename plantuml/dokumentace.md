# PlantUML editor — Strukturovaný vícejazyčný editor UML diagramů s náhledem, verzemi a sdílenými prvky

**Online verze nástroje:** [https://egdilna.github.io/nastroje/plantuml](https://egdilna.github.io/nastroje/plantuml)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#plantuml](https://egdilna.github.io/nastroje/#plantuml)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez nutnosti instalace.

---

## Přehled funkcí

**PlantUML editor** je přístupná webová aplikace pro vizuální tvorbu PlantUML diagramů. Diagramy se skládají pomocí formulářů — aplikace průběžně generuje validní PlantUML zdroj a umožňuje jeho vykreslení přes oficiální server `plantuml.com`. Vše běží v jediném HTML souboru bez instalace, závislostí a bez odesílání dat mimo prohlížeč (kromě samotného vykreslení diagramu).

### Klíčové funkce

- **Čtrnáct typů diagramů** — aktivitní, class, sekvenční, use case, stavový, komponentový, nasazení, síťový (nwdiag), Ganttův diagram, časová osa, timing, EBNF gramatika, mindmap, WBS (rozpad práce)
- **Projekty s více diagramy** — projekt seskupuje libovolný počet diagramů, lze je třídit do hierarchie složek s ikonami pro přesun a export
- **Sdílené prvky projektu** — třídy, aktéři, use cases, komponenty, rozhraní, účastníci, úlohy a milníky lze povýšit na společné pro celý projekt; jejich definice žije v projektu a změna se propaguje všude
- **Dvě jazykové mutace** — čeština a angličtina, přepínatelné v hlavičce, volba se pamatuje v `localStorage`
- **Náhled inline i v okně** — vykreslený PNG diagram přímo na kartě Výstup nebo v samostatném okně; promítací režim pro druhou obrazovku
- **Kontextová hlavička** — v pohledu na projekt kompletní projektová lišta, v pohledu na diagram jen tlačítka pro návrat a uložení
- **Verze diagramu** — manuální snapshoty s vlastními popisky; před obnovením se aktuální stav automaticky zálohuje
- **Stav diagramu (workflow)** — 9 stavů (rozpracovaný, návrh, ke schválení, schválený, upravovaný, neschválený, aktualizovaný, hotový, zrušený)
- **Skrytí prvků** — jednotlivé prvky lze skrýt z výsledného diagramu (výřez), model zůstává
- **Označení „hotovo"** — checkbox u každého prvku ve stromu + filtr Vše / Hotové / Nehotové
- **Export a import** — projekt `.pup`, přenosový balíček `.pupe` (diagram nebo složka), PlantUML zdroj `.puml`; import PUML s automatickou detekcí typu diagramu; načtení i uložení přes schránku (Ctrl+Shift+O/S)
- **Textový popis a dokument** — automaticky generovaný čtivý popis diagramu; export do Markdown a Word (DOCX) i s obrázkem
- **Validace** — průběžná kontrola modelu (chybějící texty, neplatné odkazy, duplicitní aliasy)
- **Témata a skinparam** — výběr z 32 oficiálních PlantUML témat + vlastní `skinparam`
- **Titulek, hlavička, patička, popisek** — čtyři textová pole kolem diagramu s kaskádou projekt → diagram
- **Plavací dráhy** — automatická registrace drah z akcí v aktivitních diagramech
- **Barevné prvky a šipky** — paleta 40 pojmenovaných barev s českými popisky
- **Křížové odkazy** — v detailu prvku se automaticky vypíší vazby, nadřazený prvek, vnořené prvky a připojené poznámky

### Přístupnost

Aplikace je navržena s důrazem na přístupnost — semantické HTML, ARIA atributy (`role="toolbar"`, `role="tablist"`, `aria-labelledby`, `aria-live`), plné ovládání klávesnicí včetně šipkové navigace ve stromech i mezi kartami, nativní `<dialog>` prvky pro modální okna a dostupný debug výstup přímo na stránce (ne v konzoli).

### Uložení dat

Projekt se ukládá jako jediný soubor s příponou `.pup` (PlantUML Project) — obsahuje všechny diagramy, složky, verze, sdílené prvky a nastavení v JSON formátu. Při načítání aplikace automaticky rozpozná, zda jde o projekt (`.pup`), přenosový balíček (`.pupe`) nebo PUML zdroj, takže pracuje i s přejmenovanými soubory nebo soubory bez přípony. Data se nikam neodesílají, vykreslování přes `plantuml.com` posílá pouze zakódovaný zdrojový kód aktuálního diagramu do URL.

---

## Rozložení aplikace

Aplikace má **dva pohledy** a v pohledu na diagram **tři karty**. Přepínání kart je možné myší nebo šipkami vlevo/vpravo (Home/End skočí na první/poslední kartu).

### Pohled 1 — Projekt

Zobrazí se po startu, po tlačítku „← Zpět na projekt" a po vytvoření nového projektu. Obsahuje dvě sekce:

- **Diagramy v projektu** — strom složek a diagramů s barevně rozlišeným typem, tlačítky pro nový diagram a novou složku
- **Sdílené prvky projektu** — seznam všech sdílených entit napříč diagramy (třídy, aktéři, use cases, komponenty, rozhraní, účastníci, úlohy, milníky) s počtem použití; kliknutím se skočí na první diagram, kde je prvek použit

### Pohled 2 — Diagram

Otevře se po kliknutí na konkrétní diagram. Nahoře jsou tři karty:

| Karta | Obsah |
|-------|-------|
| **Diagram** | Akce diagramu (Přejmenovat, Přesunout, Duplikovat, Exportovat, Smazat, Nastavení diagramu), Stav diagramu (workflow + aplikovat skrytí + „Skrytí prvků…"), Verze diagramu, Validace |
| **Tvorba** | Levý sloupec: toolbar pro vkládání prvků + strom prvků s filtrem hotové/nehotové. Pravý sloupec: detail vybraného prvku (formulář) + křížové odkazy na související prvky |
| **Výstup** | Náhled diagramu (Načíst / aktualizovat, Náhled v okně, Promítat, Stáhnout PNG), Zdrojový kód (Stáhnout .puml, Zkopírovat zdroj), Textový popis (Vygenerovat popis, Kopírovat popis), Dokument (Kopírovat MD, Uložit MD, Uložit DOCX) |

### Kontextová hlavička

Modré záhlaví se dynamicky přizpůsobuje pohledu:

**V pohledu na projekt** — název projektu v H1 a plný projektový toolbar:

| Tlačítko | Zkratka | Akce |
|----------|---------|------|
| Nový projekt | Alt+N | Vytvoří prázdný projekt (s potvrzením) |
| Načíst projekt | Alt+O | Otevře libovolný soubor — autodetekce typu (.pup, .pupe, .puml) |
| Načíst ze schránky | Ctrl+Shift+O | Načte projekt z obsahu schránky (nebo z dialogu jako fallback) |
| Uložit projekt | Alt+S | Stáhne projekt jako `.pup` JSON soubor |
| Vložit do schránky | Ctrl+Shift+S | Zkopíruje JSON projektu do schránky |
| Importovat .puml | Alt+M | Naimportuje PlantUML soubor jako nový diagram |
| Importovat .pupe | — | Naimportuje diagramy/složky z přenosového balíčku |
| Nastavení projektu | — | Otevře dialog s názvem, tématem, hlavičkou, patičkou atd. |
| Nápověda | Alt+H | Zobrazí integrovanou nápovědu |
| Jazyk | — | Přepínač česky / anglicky |

**V pohledu na diagram** — název diagramu v H1 a jen dvě tlačítka (návrat, uložit), plus stále „Vložit do schránky" a přepínač jazyka.

---

## Práce s projektem

### Vytvoření a načtení

Při startu aplikace je k dispozici prázdný projekt „Nový projekt". Tlačítkem **Načíst projekt** lze vybrat libovolný soubor. Aplikace rozezná typ podle obsahu:

- Začíná `{` → JSON, dále:
  - Obsahuje `pupeVersion` nebo `kind: "diagram"/"folder"` → balíček `.pupe` (import diagramů/složek)
  - Jinak → plný projekt `.pup`
- Obsahuje `@startuml` nebo klíčová slova diagramu → PUML zdroj, naimportuje se jako nový diagram

**Načtení ze schránky** (Ctrl+Shift+O) zkusí přímo přečíst schránku; když prohlížeč přístup nedovolí, otevře se dialog s textareou, do které uživatel obsah vloží ručně.

### Nastavení projektu

Dialog **Nastavení projektu** obsahuje pole platná pro všechny diagramy v projektu:

| Pole | Popis |
|------|-------|
| Název projektu | Zobrazuje se v záhlaví a v názvu okna prohlížeče |
| Téma (theme) | Výběr z 32 oficiálních PlantUML témat (viz níže) |
| Vlastní skinparam | Více řádků skinparam parametrů; klíčové slovo `skinparam` se doplní automaticky |
| Titulek | Zobrazí se nahoře nad diagramem, může být víceřádkový |
| Hlavička | Text úplně nahoře (nad titulkem), víceřádkový |
| Patička | Text úplně dole, víceřádkový |
| Popisek (caption) | Krátký jednořádkový popisek pod diagramem |

### Kaskáda projekt → diagram

Hodnoty z nastavení projektu se použijí pro všechny diagramy. Pokud konkrétní diagram má v dialogu **Nastavení diagramu** svou vlastní hodnotu, ta má přednost. Skinparam parametry projektu i diagramu se skládají za sebe.

### Nastavení diagramu

Kromě čtyř textových polí (téma, skinparam, titulek/hlavička/patička/popisek) obsahuje dialog **Nastavení diagramu** podle typu diagramu i další skupiny polí:

- **Směr layoutu** (activity, class, usecase, component, deployment, state) — top-bottom nebo left-right
- **Vizuální direktivy pro class diagram** — Skrýt prázdné členy / atributy / metody / kolečko / stereotypy
- **Nastavení Ganttova diagramu** — datum začátku projektu, měřítko časové osy, zvýraznění dnešního dne, pravidelně volné dny v týdnu, jednorázové svátky
- **Nastavení timing diagramu** — skrýt časovou osu, formát data

### Složky a organizace diagramů

Tlačítkem **Nová složka** vytvoříte složku (volitelně vnořenou do nadřazené). Diagram se do složky zařadí buď při vytvoření, nebo později tlačítkem **Přesunout do složky**. Ve stromu má každá složka i akční tlačítka pro export do `.pupe` a smazání.

### Akce nad diagramem (karta Diagram)

- **Přejmenovat** — změna názvu
- **Přesunout do složky** — výběr cílové složky z dialogu
- **Duplikovat** — vytvoří kopii (bez historie verzí) s příponou „(kopie)"
- **Exportovat (.pupe)** — vytvoří přenosový balíček s tímto diagramem, který lze naimportovat do jiného projektu
- **Smazat diagram** — nevratné, s potvrzením; smaže i všechny verze
- **Nastavení diagramu** — vlastní téma, skinparam, titulek atd. + typově specifická nastavení

### Stav diagramu (workflow)

Diagram může mít stav ve workflow. Ukládá se jako kód (jazykově nezávislý), zobrazuje se v seznamu projektu za názvem v závorce.

| Kód | Česky | Anglicky |
|-----|-------|----------|
| draft | Rozpracovaný | Draft |
| proposal | Návrh | Proposal |
| for_review | Ke schválení | For review |
| approved | Schválený | Approved |
| editing | Upravovaný | Being edited |
| rejected | Neschválený | Rejected |
| updated | Aktualizovaný | Updated |
| done | Hotový | Done |
| cancelled | Zrušený | Cancelled |

### Skrytí prvků diagramu

V sekci **Stav diagramu** lze zapnout přepínač **Aplikovat skrytí prvků při vykreslení** — když je zaškrtnuto, náhled a export vygenerují jen viditelné prvky (výřez). Skryté prvky zůstávají v modelu, jen se dočasně nevykreslí.

Tlačítko **Skrytí prvků…** otevře dialog s hromadným zaškrtáváním všech prvků v diagramu (Zobrazit vše / Skrýt vše / individuálně) v hierarchickém seznamu s možností filtrování.

### Přenos mezi projekty (.pupe)

Diagram nebo celou složku (včetně vnořených podsložek a jejich diagramů) lze vyexportovat jako přenosový balíček `.pupe` (PlantUML Editor Export):

- **Export diagramu** — tlačítko „Exportovat (.pupe)" na kartě Diagram
- **Export složky** — tlačítko se šipkou dolů (⤓) ve stromu vlevo
- **Import** — tlačítko „Importovat .pupe" v hlavičce projektu

Balíček nese kompletní obsah včetně historie verzí a nastavení; sdílené prvky se balí s sebou. Při importu se automaticky přegenerují všechny identifikátory (zabránění kolizí) a hierarchie složek se zachová. Pokud v cílovém projektu už existuje sdílený prvek se stejným aliasem, zvítězí ten cílový (předpokládá se přizpůsobená verze).

---

## Sdílené prvky projektu

Prvky používané ve více diagramech lze povýšit na **společné pro celý projekt** — jejich definice žije v projektu a změny se propagují všude. Sdílet lze:

| Typ diagramu | Sdílené entity |
|--------------|----------------|
| Class | Třídy, rozhraní, výčty, abstraktní třídy, struktury, anotace, entity |
| Sequence | Účastníci (všechny typy) |
| Use case | Aktéři i use cases |
| Component | Komponenty, rozhraní, vazby |
| Deployment | Uzly / prvky |
| Gantt | Úlohy (název, alias, trvání) a milníky (název, alias) |

Prvek povýšíte zaškrtnutím **Společný pro celý projekt** v jeho detailu. Od té chvíle se edituje sdílená definice; lokální zůstávají jen věci jako barva, balíček, systém, `groupId`, umístění v Ganttu, `startMode`/`startDate`/`refTaskId`.

Vložení existujícího sdíleného prvku do dalšího diagramu se dělá tlačítkem **„Vložit sdílený…"** v toolbaru daného typu (v use case diagramu jsou dvě samostatná tlačítka pro aktéra a use case; v component diagramu tři — komponenta, rozhraní, vazba).

Změna aliasu sdíleného prvku se automaticky přepíše ve všech diagramech, kde je použit. Ve stromu se sdílené prvky poznají po ikonce **🔗**.

---

## Typy diagramů

| Typ | ID | Popis |
|-----|----|-------|
| Aktivitní diagram | `activity` | Tok řízení s akcemi, rozhodnutími, smyčkami a paralelním zpracováním |
| Class diagram | `class` | Třídy, rozhraní, výčty, balíčky a vztahy mezi nimi |
| Sequence diagram | `sequence` | Posloupnost zpráv mezi účastníky |
| Use Case diagram | `usecase` | Aktéři, případy užití a hranice systému |
| Stavový diagram | `state` | Stavy, kompozitní stavy, přechody |
| Komponentový diagram | `component` | Komponenty, rozhraní, skupiny a vazby |
| Diagram nasazení | `deployment` | Uzly infrastruktury, artefakty, propojení |
| Síťový diagram | `network` | Sítě (nwdiag) s uzly, adresami a skupinami |
| Ganttův diagram | `gantt` | Úlohy projektu na časové ose, milníky, závislosti |
| Časová osa | `timeline` | Chronologie událostí s datumy |
| Časový průběh | `timing` | Timing diagram — stavy signálů v čase |
| EBNF gramatika | `ebnf` | Formální gramatika (Extended Backus-Naur Form) |
| Myšlenková mapa | `mindmap` | Stromový diagram s kořenem uprostřed |
| WBS — rozpad práce | `wbs` | Work Breakdown Structure — hierarchický rozpad projektu |

### Aktivitní diagram

Modeluje tok procesu — od startu přes akce a rozhodnutí ke konci. Generuje se v moderní PlantUML notaci (activity beta).

**Prvky toolbaru:**

| Prvek | Popis |
|-------|-------|
| Akce | Standardní akce procesu (`:text;`) |
| SDL task | Akce se stereotypem `<<task>>` (SDL úloha) |
| SDL input | Akce se stereotypem `<<input>>` (přijetí signálu) |
| SDL output | Akce se stereotypem `<<output>>` (odeslání signálu) |
| SDL procedure | Akce se stereotypem `<<procedure>>` (volání procedury) |
| SDL save | Akce se stereotypem `<<save>>` (uložení stavu) |
| SDL load | Akce se stereotypem `<<load>>` (načtení stavu) |
| Vazba (šipka) | Pojmenovaná/stylová šipka mezi prvky |
| Rozhodnutí (if) | Větvení s podmínkou (větve „ano" a „ne", lze přidat elseif) |
| Smyčka while | Cyklus s podmínkou na začátku (popisky „pokračovat" a „ukončit") |
| Smyčka repeat | Cyklus s podmínkou na konci |
| Fork (paralelní) | Paralelní rozvětvení s `end fork` nebo `end merge` |
| Split (větvení) | Větvení (`split` / `split again` / `end split`) |
| Poznámka | Volně umístěná poznámka (vlevo/vpravo/nad/pod) |
| Start, Stop, End | Uzly začátku a konce procesu |
| Detach, Kill, Break | Speciální ukončovací uzly |
| Partition (oddíl) | Titulkovaná oblast obsahující několik akcí |
| Konektor (odkaz) | Krátké návěstí (typicky písmeno), stejné návěstí na dvou místech je vizuálně propojí |
| Plavací dráhy… | Správa seznamu drah (jeden název na řádek) |

**Detail akce:**

| Vlastnost | Popis |
|-----------|-------|
| Text akce | Hlavní popis (`:text;`) |
| SDL stereotyp | Výběr z 8 stereotypů (standardní + 7 SDL: task, input, output, procedure, save, load, continuous) |
| Plavací dráha | Volitelné přiřazení k dráze |
| Barva pozadí akce | Výběr ze 40 pojmenovaných barev nebo vlastní hex |
| Poznámka u akce | Volitelná `note left/right` s pozicí (vlevo/vpravo) |

**Detail šipky (vazba):** text, styl (plná / čárkovaná / tečkovaná / tučná), barva.

**Detail smyčky while / repeat:** podmínka + volitelné popisky pro „pokračovat" a „ukončit".

**Plavací dráhy** se registrují **automaticky** — pokud do akce vyplníte dráhu, která dosud neexistuje, sama se přidá. Alternativně lze seznam otevřít tlačítkem „Plavací dráhy…". Generátor správně řeší přepínání dráhy uvnitř `if` / `while` skupin.

### Class diagram

Modeluje třídní strukturu — třídy, rozhraní, výčty, balíčky a jejich vztahy.

**Typy prvků v toolbaru:**

| Stereotyp | Klíčové slovo PlantUML |
|-----------|------------------------|
| Class | `class` |
| Interface | `interface` (s volbou **lollipop** — vykreslí jako kroužek ○) |
| Abstract | `abstract class` |
| Enum | `enum` (s podporou seznamu hodnot) |
| Struct | `struct` |
| Annotation | `annotation` |
| Entity | `entity` |
| Protocol | `protocol` |

Dále jsou v toolbaru tlačítka **Vztah**, **Balíček**, **Poznámka** a **Vložit sdílený…**.

**Detail třídy:** název, alias (generuje se automaticky z názvu bez diakritiky), stereotyp, doplňkový stereotyp (např. `<<service>>`), URL odkaz (vygeneruje se jako klikatelný v SVG/PNG), balíček, atributy a metody, poznámka s pozicí.

**Atributy:** viditelnost (`+` public, `-` private, `#` protected, `~` package), název, typ, výchozí hodnota, příznaky `static` / `abstract`, tlačítka pro řazení a smazání.

**Metody:** viditelnost, název, návratový typ, seznam parametrů (název + typ), příznaky `static` / `abstract`.

**Typy balíčků / kontejnerů:**

| Typ | PlantUML |
|-----|----------|
| Balíček | `package` |
| Jmenný prostor | `namespace` |
| Uzel | `node` |
| Obdélník | `rectangle` |
| Složka | `folder` |
| Rámec | `frame` |
| Oblak | `cloud` |
| Databáze | `database` |

Balíčky lze vnořovat. Volba **Uspořádat obsah svisle (skryté vazby)** přidá mezi přímé děti balíčku skryté vazby `-[hidden]-`, které donutí GraphViz dát je pod sebe.

**Typy vztahů:**

| Typ vztahu | Symbol PlantUML |
|------------|-----------------|
| Dědičnost (extends) | `<|--` |
| Realizace (implements) | `<|..` |
| Kompozice | `*--` |
| Agregace | `o--` |
| Asociace | `--` |
| Závislost | `..>` |

U vztahu lze nastavit **kardinalitu** na obou koncích (paleta 9 hodnot + vlastní), popisek, směr (výchozí → cílová nebo opačně) a barvu.

**Kardinality (multiplicita):**

| Hodnota | Význam |
|---------|--------|
| (neuvedeno) | Bez kardinality |
| `1` | Právě jeden |
| `0..1` | Nula nebo jeden (nepovinný) |
| `*` | Libovolný počet |
| `1..*` | Alespoň jeden |
| `0..*` | Libovolný počet (i nula) |
| `2`, `2..*`, `n`, `1..n` | Předdefinované hodnoty |
| Vlastní hodnota… | Ruční zadání (např. `3..7`) |

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

**Zpráva** má odesílatele, příjemce, text, typ šipky a volitelně poznámku a barvu:

| Typ šipky | Symbol |
|-----------|--------|
| synchronní | `->` |
| asynchronní | `->>` |
| návrat | `-->` |
| ztracená | `->x` |

Zprávě lze aktivovat/deaktivovat příjemce (životní čáru).

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
| Vytvořit | `create` — dynamické vytvoření účastníka |
| Zničit | `destroy` — zničení účastníka |
| Box (rámeček) | Vizuální seskupení několika účastníků (s barvou pozadí a titulkem) |

### Use Case diagram

Modeluje aktéry, případy užití a hranice systémů.

**Typy aktérů (5 stereotypů):**

| Typ | Popis |
|-----|-------|
| Aktér (osoba) | Klasický stick figure |
| Aktér (business) | Business aktér — stick figure s diagonálou |
| Aktér (systém) | Externí systém jako rámeček |
| Aktér (externí) | Externí aktér / služba mimo modelovanou oblast |
| Aktér (zařízení) | Hardware, robot, sensor |

Každý aktér má název, alias, typ a volitelný **doplňkový stereotyp** (přidá se za automatický stereotyp typu).

**Use case** má název, alias a volitelný popis (generuje se jako `note right of` blok). Lze zařadit do systému (lokální nastavení, i když je use case sdílený).

**Systém (rectangle)** je vizuální hranice se jménem a aliasem, do které spadají use cases; podporuje volbu „Uspořádat obsah svisle (skryté vazby)".

**Vztahy:**

| Typ vztahu | Generuje se jako |
|------------|------------------|
| Asociace | `-->` |
| Include | `..>` s popiskem `<<include>>` |
| Extend | `..>` s popiskem `<<extend>>` |
| Generalizace | `<|--` |

Vztah propojuje aktéra nebo use case s jiným aktérem nebo use case; oba konce mají volitelný typ (aktér / use case), popisek a barvu.

Podporovány jsou také **volně plovoucí poznámky** připojené k aktéru / use case s volitelnou pozicí.

### Stavový diagram (state)

Modeluje stavy a přechody mezi nimi.

**Detail stavu:** název, **stereotyp** (choice, fork, join, history, sdlreceive nebo bez), nadřazený (kompozitní) stav, popis stavu, **entry / exit akce** (`entry / akce`, `exit / akce`), příznak **paralelní region** (ortogonální) — má smysl jen pro podstav v kompozitním stavu, barva.

**Přechod:** z (`__start__` = počáteční, `__end__` = koncový, nebo některý ze stavů), do, popisek události/podmínky, směr (dolů / nahoru / doleva / doprava), barva.

Podporovány jsou volně plovoucí poznámky připojené ke stavu.

### Komponentový diagram (component)

Modeluje komponenty a rozhraní se vzájemnými vazbami.

**Detail komponenty:** název, alias, **stereotyp** (component, database, queue, cloud, node, folder, frame, file), skupina (viz níže), barva.

**Detail rozhraní:** název, alias, skupina.

**Skupiny (kontejnery)** — 6 typů: package, node, folder, frame, cloud, database. Skupina má název, typ a možnost uspořádat obsah svisle.

**Typy vazeb (relationships):**

| Typ | Význam |
|-----|--------|
| use | používá |
| provide | poskytuje |
| dependency | závisí na |
| association | asociace |
| realization | realizuje |
| inheritance | dědí od |
| composition | obsahuje |
| aggregation | agreguje |
| line | propojeno |

Vazby lze **sdílet napříč diagramy** (chybějící koncové prvky se při vložení automaticky doplní).

### Diagram nasazení (deployment)

Modeluje uzly infrastruktury a jejich vzájemné propojení. Podporuje **22 typů uzlů**:

- Hlavní: node, artifact, database, cloud, component, folder, queue, storage (v toolbaru samostatná tlačítka)
- Další: rectangle, frame, card, stack, actor, agent, boundary, collections, control, entity, file, interface, package, usecase (pod tlačítkem „Další uzel…")

**Detail uzlu:** název, alias, typ prvku, **stereotyp** (volitelný text `<<...>>`), nadřazený prvek (pro vnořování), barva, volba „Uspořádat obsah svisle (skryté vazby)".

**Propojení (link):** z, do, styl čáry (plná `--`, šipka `-->`, přerušovaná `..`, silná `==`, tečkovaná `~~`), popisek, barva.

Podporovány jsou volně plovoucí poznámky.

### Síťový diagram (network / nwdiag)

Modeluje sítě, uzly v nich a přímá propojení.

**Nastavení diagramu (klik do prázdna ve stromu):** výchozí barvy pro uzel, síť, skupinu, čáry a text.

**Síť:** název (bez mezer — identifikátor v nwdiag), adresní rozsah (např. `192.168.10.0/24`), barva. Uzly se přidávají tlačítkem `+` u sítě ve stromu.

**Uzel v síti:** název (stejný název v jiné síti = automatické propojení mezi sítěmi), adresa (např. `.1`), tvar (node, database, cloud, storage, queue, actor).

**Skupina:** název, popis, barva a zaškrtávátka pro výběr uzlů ve skupině.

**Přímé propojení (peer link):** z uzlu, do uzlu, tvary konců.

### Ganttův diagram (project)

Zobrazuje úlohy projektu na časové ose s milníky, závislostmi, dokončeností a vyznačením dnešního dne.

**Nastavení diagramu (v Nastavení diagramu):**

- **Datum začátku projektu** (YYYY-MM-DD) — pokud prázdné, osa je číslovaná (Den 1, Den 2, …), vhodné pro obecné procesy bez kalendáře (např. „do 15 dnů od podání žádosti")
- **Měřítko časové osy** — daily / weekly / monthly / quarterly / yearly
- **Zvýraznit dnešní datum** + barva čáry (výchozí salmon)
- **Pravidelně volné dny** — zaškrtávátka Po až Ne
- **Konkrétní svátky** — řádky `YYYY-MM-DD` nebo `YYYY-MM-DD | popisek`

**Úloha:** název, alias, **trvání** (dny), způsob začátku, procento dokončení (0–100), barva.

**Způsoby začátku:**

| Volba | Chování |
|-------|---------|
| na začátku projektu | Úloha začne první den (nebo Den 1) |
| absolutní datum | Konkrétní YYYY-MM-DD |
| po jiné úloze / dle vazby | Reference na jinou úlohu + bod (`konec` / `začátek`) + posun (kladné = po, záporné = před) |

V detailu úlohy se navíc automaticky zobrazí **vyřešený termín** (spočítané absolutní datum), který se přepočítává při každé změně.

**Milník:** název, alias, typ termínu (absolutní datum / vazba na úlohu). Pro vazbu na úlohu se zadává i bod (konec/začátek) a posun.

Úlohy i milníky lze **sdílet napříč Gantty** — sdílí se název, alias a trvání (u milníku jen název a alias); umístění v konkrétním diagramu (start, vazba, posun, barva) zůstává lokální.

### Časová osa (timeline / chronology)

Jednoduchá vizualizace událostí v čase. **Nastavení diagramu:** maximální velikost (px) a omezovaná osa (šířka / výška).

**Událost:** název, datum, volitelný popis.

### Časový průběh (timing)

Timing diagram zobrazuje změny stavů několika signálů v čase.

**Nastavení:** skrýt časovou osu (`hide time-axis`), formát data (`use date format`).

**Typy signálů:**

| Typ | Popis |
|-----|-------|
| concise | Jednoduchý datový (výchozí) |
| robust | Více pojmenovaných stavů |
| binary | High/low (přijímá aliasy on/off, true/false, 1/0, active/inactive) |
| clock | Hodinový signál (perioda, puls, posun) |
| analog | Spojitý s rozsahem od–do |
| rectangle | Obdélníkový |

**Časový rámec:** čas (lineární číslo, relativní `+50`, nebo datum). V každém rámci se editují:

- **Stavy** — pro každého účastníka: hodnota / stav + volitelná barva (texty s mezerami se obalí do uvozovek)
- **Zprávy** — z / do účastníka + popisek + volitelný posun cíle (např. `+50`)

**Poznámka:** připojena k účastníkovi, s pozicí (nad / pod signálem), text.

**Zvýrazněný interval (highlight):** od času, do času, barva, popisek.

**Časová anotace (constraint):** od času, do času, směr (oboustranný ↔ / jednosměrný →), popisek (např. `10 tu`, `setup time`).

### EBNF gramatika

Diagram syntaxe formálního jazyka. Detail pravidla obsahuje dvě komplementární UI:

1. **Klikací stavebnice** (token builder) — pravou stranu pravidla skládáte z bloků: terminál `"text"`, nonterminál (odkaz), skupina `( )`, volitelně `[ ]`, opakování `{ }`, speciální `? ?`, alternativa `|`, konkatenace `,`, surový text.
2. **Textový výraz** (textarea) — alternativní pohled; při změně se stavebnice přerenderuje (parser). Pokud text nelze naparsovat, ponechá se jako jeden „raw" token.

Každé pravidlo má identifikátor (bez mezer), výraz a volitelný komentář.

### Myšlenková mapa (mindmap) a WBS

Stromové diagramy s kořenem. Toolbar obsahuje tlačítka: **+ dítě**, **+ sourozenec**, ↑ ↓ (mezi sourozenci), → (odsadit — stane se dítětem předchozího sourozence), ← (o úroveň výš), **Stereotypy…** (definice vizuálních stylů).

**Detail uzlu:** text (víceřádkový přes `:text;`), **strana** (mindmap: auto/vpravo/vlevo; WBS: na opačnou stranu), volba **bez rámečku (boxless)** (přidá podtržítko `_`), barva, stereotyp z definic diagramu.

**Editor stereotypů** (`Stereotypy…`) — pro každý stereotyp lze nastavit: název, popis, barva pozadí (BackgroundColor), barva čáry (LineColor), tloušťka a styl čáry, barva a velikost a styl a název písma, zaoblení rohů (RoundCorner), stín. Definice se vygenerují do PlantUML `<style>` bloku.

---

## Editor — struktura a detail

### Strom prvků a filtr

Strom uprostřed obrazovky (karta Tvorba) zobrazuje hierarchii modelu. Kliknutím na prvek se v pravém sloupci vykreslí formulář v sekci **Detail vybraného prvku**. U každého prvku jsou tlačítka **↑**, **↓**, **×**.

Nad stromem je **filtr:**

- **Vše** — zobrazí všechny prvky
- **Hotové** — jen prvky zaškrtnuté jako hotové (nehotové se zobrazí, jen pokud mají hotové potomky)
- **Nehotové** — jen nezaškrtnuté (analogicky)

Prvky mají checkbox **Hotovo** (informativní — negeneruje se do PlantUML).

### Pravidla vkládání

Tlačítka v toolbaru přidávají nový prvek podle aktuálního výběru:

- Pokud není nic vybráno → na konec hlavního seznamu
- Pokud je vybraná **větev** (v `if` nebo `fork`) → dovnitř větve
- Pokud je vybraný uzel typu `while` / `repeat` → dovnitř smyčky
- Pokud je vybraný konkrétní prvek → vloží se **za něj** ve stejné úrovni

U skupin `if` / `fork` / `split` se ve stromu zobrazuje tlačítko **+ elseif větev** / **+ další větev** pro přidání další alternativy.

### Křížové odkazy v detailu

Detail sdíleného prvku (třídy, komponenty, uzlu, stavu, aktéra, use case) obsahuje sekce s automaticky spočítanými **křížovými odkazy**:

- **Vazby tohoto prvku** — všechny relace/vazby, kde figuruje
- **Nadřazený prvek** — pokud je vnořen (balíček, systém, kompozitní stav, uzel v uzlu…)
- **Vnořené prvky** / **Use cases v tomto systému** / **Komponenty ve skupině** — děti prvku
- **Připojené poznámky** — samostatné poznámky odkazující na prvek

Kliknutím na kterýkoli křížový odkaz se v editoru přepne selekce na daný prvek.

### Barvy

Paleta obsahuje **40 pojmenovaných barev** v češtině:

- **Základní** (13): Bílá, Černá, Červená, Zelená, Modrá, Žlutá, Oranžová, Fialová, Růžová, Hnědá, Šedá, Azurová, Magenta
- **Světlé varianty** (9): Světle modrá, Světle zelená, Světle žlutá, Světle růžová, Světle azurová, Světle šedá, Světle lososová, Světle korálová, Světle ocelově modrá
- **Tmavé varianty** (8): Tmavě červená, Tmavě modrá, Tmavě zelená, Tmavě oranžová, Tmavě fialová, Tmavě šedá, Tmavě šedomodrá, Tmavě olivová
- **Speciální** (10): Zlatá, Stříbrná, Námořní modrá, Modrozelená, Olivová, Vínová, Korálová, Lososová, Khaki, Limetková

Hodnoty jsou validní CSS i PlantUML názvy (bez konverze). Pokud načtete PUML s barvou, kterou paleta neobsahuje, doplní se automaticky jako „Vlastní: …".

### Aliasy

Pro třídy, balíčky, účastníky sekvence, aktéry, use cases, systémy, komponenty, rozhraní, uzly, úlohy, milníky, sítě, pravidla EBNF, timing účastníky, mindmap/WBS uzly se používá **alias** — krátký identifikátor bez diakritiky a mezer. Odvozuje se z názvu pomocí NFKD normalizace (Žadatel → Zadatel), pak se omezí na `A-Z`, `a-z`, `0-9`, `_`. Při kolizi se doplní číselný suffix (`Zadatel2`).

Pokud přejmenujete alias sdíleného prvku, **automaticky se přepíše ve všech diagramech**, kde je použit.

---

## Náhled a promítání

### Inline náhled (karta Výstup)

Tlačítko **Načíst / aktualizovat náhled** zavolá server `plantuml.com`, stáhne PNG obrázek a vloží jej do stránky. Zobrazí se i **rozměry v pixelech**. Pokud server odmítne (typicky syntax chyba), zobrazí se diagnostický box s odkazy na SVG/PNG URL i zdroj.

### Náhled v okně (Alt+V)

Otevře vykreslený SVG na `plantuml.com` v novém okně. Pro uložení SVG se použije pravé tlačítko v prohlížeči.

### Promítací režim (Alt+I)

Tlačítko **Promítat** otevře vykreslený SVG diagram v samostatném okně. Hodí se pro druhou obrazovku nebo projektor.

| Stav | Akce tlačítka |
|------|--------------|
| Okno není otevřené | „Promítat" — otevře nové okno |
| Okno je otevřené | „Překreslit promítání" — aktualizuje obsah |
| Uživatel zavře okno | Vrátí se na „Promítat" (kontrola každou sekundu) |

V promítacím okně je tlačítko **Celá obrazovka** využívající Fullscreen API (alternativně F11). Promítací okno nemá vlastní ovládání obsahu — vše se řídí z hlavní aplikace.

---

## Verze diagramu

Verze se ukládají **tlačítkem Uložit verzi** (Alt+W) s vlastním popiskem. Snapshot obsahuje kompletní model a nastavení diagramu (ne globální nastavení projektu).

### Akce nad verzemi

| Akce | Popis |
|------|-------|
| Obnovit tuto verzi | Před obnovením se automaticky uloží aktuální stav jako verze „Před obnovením z: …", takže nikdy nepřijdete o data |
| Smazat verzi | Nevratné, s potvrzením |
| Náhled (SVG) | Otevře vykreslený diagram ze snapshotu v novém okně bez obnovení |

---

## Validace

Sekce **Validace diagramu** (karta Diagram) zobrazuje průběžně aktualizovaný seznam upozornění a chyb. Chyby jsou červeně, upozornění žlutě.

### Pravidla podle typu

**Aktivitní diagram:**
- Upozornění: akce bez textu, rozhodnutí/smyčka bez podmínky, diagram bez `start`

**Class diagram:**
- Chyby: třída bez názvu, duplicitní alias, duplicitní alias balíčku, vztah na neexistující třídu
- Upozornění: duplicitní název třídy

**Sequence diagram:**
- Chyby: účastník bez aliasu, zpráva na neexistujícího odesílatele/příjemce
- Upozornění: duplicitní alias, zpráva bez textu

**Use Case diagram:**
- Chyby: aktér/use case bez názvu, duplicitní alias, duplicitní alias systému, vztah na neexistující prvek

---

## Textový popis a dokument

### Generovaný textový popis

Tlačítko **Vygenerovat popis** (Alt+T) na kartě Výstup vytvoří čtivý textový popis diagramu:

- **Aktivitní**: souvislý text členěný do odstavců — kdo co dělá, jak se proces větví, poznámky a typy akcí
- **Sequence**: výčet zpráv „Od → Pro: text (poznámka)" s odstavci pro alternativy, smyčky, paralelní větve
- **Class**: prvky (atributy, metody), balíčky, vztahy
- **Use Case**: aktéři, jejich činnosti, vztahy
- **State**: počáteční stav, přechody, popisy stavů
- **Component**: komponenty, rozhraní, co která poskytuje/používá
- **Deployment**: uzly a jejich obsah, propojení
- **Network**: sítě, uzly s adresami, uzly sdílené mezi sítěmi
- **Gantt**: úlohy s absolutními datumy (i pro relativně definované)

Popis se zobrazí v poli pod zdrojovým kódem a lze ho zkopírovat tlačítkem **Zkopírovat popis**.

### Dokument (MD, DOCX)

Tři tlačítka: **Kopírovat MD**, **Uložit MD**, **Uložit DOCX**. Dokument obsahuje:

- Header kurzívou (z nastavení, kaskáda)
- Název diagramu tučně
- Souhrn počtu prvků
- Verze, datum
- Obrázek diagramu (PNG z plantuml.com)
- Caption kurzívou pod obrázkem
- Textový popis
- Footer kurzívou dole

Prázdné hodnoty se vynechávají. DOCX se generuje v prohlížeči i s vloženým obrázkem; knihovna pro tvorbu DOCX se stáhne z CDN při prvním použití (vyžaduje internet).

---

## Export, import a sdílení

| Akce | Zkratka | Popis |
|------|---------|-------|
| Stáhnout PNG | Alt+E | Zavolá `plantuml.com` a stáhne PNG. Při CORS chybě otevře okno k ručnímu uložení |
| Náhled (SVG) | Alt+V | Otevře SVG na plantuml.com v novém okně |
| Stáhnout .puml | Alt+U | Uloží zdrojový kód jako `.puml` soubor |
| Zkopírovat zdroj | Alt+C | Vloží PlantUML kód do schránky (fallback na výběr v textarea + Ctrl+C) |
| Uložit projekt | Alt+S | Stáhne projekt jako `.pup` JSON |
| Vložit do schránky | Ctrl+Shift+S | Zkopíruje JSON projektu do schránky |
| Načíst projekt | Alt+O | Otevře libovolný soubor s autodetekcí (.pup / .pupe / .puml) |
| Načíst ze schránky | Ctrl+Shift+O | Načte projekt z obsahu schránky |
| Importovat .puml | Alt+M | Přidá existující PUML jako nový diagram |
| Importovat .pupe | — | Naimportuje diagramy / složky z přenosového balíčku |
| Exportovat (.pupe) | — | Vyexportuje aktuální diagram jako přenosový balíček |

### Spolehlivost importu .puml

- **Vlastní výstup**: spolehlivý round-trip (export a opětovný import dává stejný model)
- **Cizí PUML**: best-effort, složitější konstrukce mohou být vynechány

Akce v aktivitních diagramech podporují tři syntaktické varianty (moderní `:text; <<stereo>>`, starou prefixovou `<<stereo>>#color:text;` a velmi starou suffixovou `:text<`). Po importu doporučujeme zkontrolovat Validaci a data upřesnit ve formulářích.

---

## Klávesové zkratky

### Globální (Alt+písmeno)

| Zkratka | Akce |
|---------|------|
| Alt+N | Nový projekt |
| Alt+O | Načíst projekt |
| Alt+S | Uložit projekt |
| Alt+M | Importovat .puml |
| Alt+H | Nápověda |
| Alt+B | ← Zpět na projekt (v pohledu na diagram) |
| Alt+D | Nový diagram |
| Alt+F | Nová složka |
| Alt+W | Uložit verzi diagramu |

### Ctrl+Shift kombinace

| Zkratka | Akce |
|---------|------|
| Ctrl+Shift+O | Načíst projekt ze schránky |
| Ctrl+Shift+S | Vložit projekt do schránky |

### Náhled, promítání, export (karta Výstup)

| Zkratka | Akce |
|---------|------|
| Alt+V | Náhled (SVG) v okně |
| Alt+I | Promítat / Překreslit promítání |
| Alt+E | Stáhnout PNG |
| Alt+U | Stáhnout .puml |
| Alt+C | Zkopírovat zdroj do schránky |
| Alt+T | Vygenerovat textový popis |

### Navigace ve stromech (diagramy i prvky)

| Klávesa | Akce |
|---------|------|
| Šipka nahoru/dolů | Přepnutí mezi položkami |
| Šipka doleva/doprava | Přepnutí mezi odkazem a akčními tlačítky (↑ ↓ ×) |
| Home | Skok na první položku |
| End | Skok na poslední položku |
| Tab | Standardní tab navigace |

### Karty v pohledu na diagram

| Klávesa | Akce |
|---------|------|
| Šipka doleva/doprava | Přepnutí mezi kartami (Diagram / Tvorba / Výstup) |
| Home / End | První / poslední karta |

### Dialogy

| Klávesa | Akce |
|---------|------|
| Enter | Potvrzení (v jednořádkovém vstupu) |
| Ctrl+Enter | Potvrzení v textarea (Enter v textarea dělá nový řádek) |
| Esc | Zrušení dialogu |

---

## Témata

Aplikace nabízí výběr z 32 oficiálních PlantUML témat:

`amiga`, `aws-orange`, `black-knight`, `bluegray`, `blueprint`, `cerulean`, `cerulean-outline`, `crt-amber`, `crt-green`, `cyborg`, `hacker`, `lightgray`, `mars`, `materia`, `materia-outline`, `metal`, `mimeograph`, `minty`, `mono`, `plain`, `reddress-darkblue`, `reddress-darkgreen`, `reddress-lightblue`, `sandstone`, `silver`, `sketchy`, `sketchy-outline`, `spacelab`, `superhero`, `toy`, `united`, `vibrant`.

Téma se nastavuje v dialogu **Nastavení projektu** nebo **Nastavení diagramu** a vkládá se do PlantUML jako direktiva `!theme nazev`.

### Vlastní skinparam

Pole **Vlastní skinparam** akceptuje jeden parametr na řádek, bez klíčového slova `skinparam` (doplní se automaticky):

```
backgroundColor #fefefe
defaultFontName Verdana
```

### Vizuální direktivy pro class diagram

V nastavení diagramu (jen pro `class`) lze zaškrtnout:

- Skrýt prázdné členy (`hide empty members`)
- Skrýt prázdné atributy (`hide empty attributes`)
- Skrýt prázdné metody (`hide empty methods`)
- Skrýt symbol kolečka (`hide circle`)
- Skrýt stereotypy (`hide stereotype`)

---

## Vícejazyčnost

Přepínač jazyka je v pravé části záhlaví (**česky** / **anglicky**). Volba se ukládá do `localStorage` pod klíčem `plantuml.editor.lang` a zachovává se mezi sezeními. Jazyk ovlivňuje:

- Texty UI (tlačítka, popisky polí, hlášky stavu)
- Nadpisy dialogů a nápovědu
- Generované textové popisy diagramů (české / anglické formulace)

Interní hodnoty (typy prvků, stereotypy, kódy stavů) zůstávají jazykově nezávislé.

---

## Technické informace

### Architektura

- Jediný HTML soubor obsahuje vše — markup, CSS, JavaScript
- Žádné externí knihovny (kromě `docx.min.js` z CDN, který se stáhne až při prvním exportu DOCX)
- Vanilla JavaScript, semantické HTML a ARIA pro přístupnost
- Bez build procesu

### Formát URL pro plantuml.com

Aplikace kóduje zdrojový kód do hexadecimálního formátu (`~h{hex}`) a sestavuje URL:

```
https://www.plantuml.com/plantuml/svg/~h{hex}
https://www.plantuml.com/plantuml/png/~h{hex}
```

Na server se odesílá pouze obsah aktuálního diagramu — žádná data o projektu, autorovi ani jiných diagramech.

### Formát projektu (.pup)

Projekt je JSON soubor s následující strukturou:

| Pole | Typ | Popis |
|------|-----|-------|
| `schemaVersion` | číslo | Verze schématu (aktuálně 1) |
| `projectName` | string | Název projektu |
| `created`, `modified` | ISO datum | Časové značky |
| `settings` | objekt | Nastavení projektu (theme, skinparam, header, footer, title, caption) |
| `folders` | pole | Složky `{id, name, parentId}` |
| `diagrams` | pole | Diagramy `{id, name, type, folderId, status, settings, model, done, hidden, versions}` |
| `sharedElements` | pole | Sdílené entity `{alias, kind, name, ...}` |

### Formát přenosového balíčku (.pupe)

JSON s poli `pupeVersion`, `kind` (`diagram` nebo `folder`), obsah exportovaného prvku (včetně verzí, nastavení a použitých sdílených prvků) a mapa použitých `sharedElements`.

### Migrace formátu

Při načtení projektu se automaticky migrují starší formáty. Například stará vlastnost `shape` u akcí v aktivitních diagramech se převede na novou `stereotype` podle mapování legacy znaků:

| Legacy znak | Nový stereotyp |
|-------------|---------------|
| `]` | `task` |
| `<` | `input` |
| `>` | `output` |
| `|` | `procedure` |

### Generovaná syntax PlantUML

- Aktivitní diagramy — moderní varianta „beta" (`:text; <<stereotype>> <<#color>>`)
- Class diagramy — barvu ve vztahu jako `[#color]` vloženou do šipky
- Timing — `robust`/`concise`/`binary`/`clock`/`analog`/`rectangle` s parametry (`with period`, `pulse`, `offset`, `between … and …`)
- Mindmap / WBS — `<style>` blok se stereotypy generovaný z definic
- Gantt — `Project starts YYYY-MM-DD`, `printscale`, `saturday/sunday are closed`, konkrétní data pro svátky, `today is …`, procenta dokončení jako `[alias] is N% completed`
- nwdiag — dovnitř `@startuml` jako blok `nwdiag { … }` (aby fungovaly title/header/footer)

Při importu se rozpoznají i starší varianty zápisu.

### Debug

Pokud při generování PlantUML kódu nebo importu nastane chyba, zobrazí se debugovací výpis v boxu vpravo dole (`#debug`). Box lze zavřít tlačítkem **Zavřít**. Debugovací zprávy se **nepíšou do konzole prohlížeče** — jsou přímo v UI, aby byly dostupné i pro screen readery.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Vyžaduje připojení k internetu pouze pro:

- Vykreslení diagramu (přístup na `plantuml.com`)
- Export DOCX (stáhnutí knihovny z CDN při prvním použití)

Editor, model, uložení projektu, generování PUML, export MD, náhled souboru — vše ostatní funguje offline.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| PlantUML | Textový jazyk pro popis UML diagramů s vykreslovacím serverem |
| `.pup` | PlantUML Project — formát uložení projektu této aplikace (JSON) |
| `.pupe` | PlantUML Editor Export — přenosový balíček s diagramem nebo složkou |
| `.puml` | Standardní přípona souboru s PlantUML zdrojovým kódem |
| Alias | Krátký identifikátor entity bez diakritiky a mezer pro použití v PlantUML kódu |
| Stereotyp | Klasifikace prvku v UML, zapisuje se jako `<<stereotyp>>` |
| Kardinalita | Multiplicita vztahu — kolik instancí jedné strany odpovídá jedné instanci druhé |
| Plavací dráha | Vertikální oblast v aktivitním diagramu představující odpovědnost (role, oddělení) |
| Skinparam | PlantUML direktiva pro grafické nastavení (barvy, fonty atd.) |
| Theme | Předdefinovaná sada vizuálních nastavení (skinparam parametrů) |
| Snapshot | Zaznamenaný stav modelu a nastavení diagramu pro účely verzování |
| Round-trip | Proces export → import beze ztráty informace |
| Sdílený prvek | Entita společná pro celý projekt; jedna definice, použití v mnoha diagramech |
| Lollipop notace | Vykreslení rozhraní jako kroužek `()` místo obdélníku |
| Křížové odkazy | Automaticky spočítané vazby, nadřazené a vnořené prvky v detailu |
| Kaskáda | Hodnota z projektu se použije, pokud diagram nemá vlastní; diagram má přednost |
| nwdiag | PlantUML rozšíření pro síťové diagramy |
| EBNF | Extended Backus-Naur Form — formální notace gramatik |
| WBS | Work Breakdown Structure — hierarchický rozpad projektu |

---

*Dokumentace odpovídá stavu aplikace PlantUML editor ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
