# ArchiMate Editor - Uživatelská příručka

Webový editor pro tvorbu a správu architektonických modelů podle standardu ArchiMate 3.2 s rozšířeními pro správu architektonických rozhodnutí (ADR), poznámek a úkolů.

## Online verze a odkazy

- **Nástroj:** https://nastroje.egdilna.cz/archimate
- **Stránka o nástroji:** https://nastroje.egdilna.cz/#archimate
- **Zdrojový kód:** https://github.com/egdilna/nastroje

V repozitáři najdete:
- Editor jako jediný HTML soubor (`archimate/index.html`) — lze ho stáhnout a používat i offline
- Dokumentaci aplikace v češtině i angličtině
- JSON Schema pro validaci AJX formátu (`ajx-schema.json`)

---

## Obsah

1. [Úvod](#úvod)
2. [Formát AJX](#formát-ajx)
3. [Rozhraní editoru](#rozhraní-editoru)
4. [Správa modelu](#správa-modelu)
5. [Práce s prvky](#práce-s-prvky)
6. [Práce s vazbami](#práce-s-vazbami)
7. [Diagramy](#diagramy)
8. [Úkoly](#úkoly)
9. [Poznámky](#poznámky)
10. [Architektonická rozhodnutí (ADR)](#architektonická-rozhodnutí-adr)
11. [Generátor textu](#generátor-textu)
12. [Import a export](#import-a-export)
13. [Slučování modelů](#slučování-modelů)
14. [Správa příznaků](#správa-příznaků)
15. [Log změn](#log-změn)
16. [GitHub integrace](#github-integrace)
17. [Tipy a triky](#tipy-a-triky)
18. [Klávesové zkratky](#klávesové-zkratky)
19. [Referenční příručka ArchiMate](#referenční-příručka-archimate)

---

## Úvod

ArchiMate Editor je kompletní nástroj pro modelování podnikové architektury podle specifikace ArchiMate 3.2 od The Open Group. Editor běží přímo v prohlížeči bez nutnosti instalace a ukládá data lokálně do prohlížeče.

### Hlavní vlastnosti


Pokročilý editor architektury v jazyce ArchiMate, který může ale sloužit i nearchitektům


- **ArchiMate 3.2** - podpora všech 60 typů prvků a 11 typů vazeb s kontrolou validity
- **Vícejazyčné rozhraní** - čeština a angličtina
- **Automatické ukládání** - data se ukládají do prohlížeče
- **Tvorba po katalozích**: Možnost tvořit architekturu přes katalog prvků s jejich vlastnostmi a katalog vazeb, ze kterých se pak sestavují příznaky, packages a diagramy a výstupy
- **Vizuální modelování**: Vizuální editor diagramů
- **Import/export** - formáty AJX (JSON) a ArchiMate Open Exchange XML, plná podpora všech rozšíření AJX, diagramy lze exportovat v PNG a SVG, export vygenerovaných textových výstupů podle uživatelských šablon textu
- **Slučování modelů** - import vybraných částí z jiného modelu
- **Úkoly** - evidence a sledování úkolů pro rozvoj architektury
- **Poznámky** - Markdown poznámky s verzováním
- **ADR (Architecture Decision Records)** - správa architektonických rozhodnutí
- **Generátor textu** - tvorba dokumentace z modelu pomocí šablon
- **Diagramy** - vizuální editor s drag & drop a export do SVG/PNG
- **Hromadné operace** - práce s příznaky (tagy) i hromadné úpravy prvků a vazeb přímo v tabulce
- **Export do Markdownu a Wordu** - úkoly, ADR a diagramy jako `.md` nebo `.docx`
- **Import CSV/TSV** - hromadné zavedení prvků z tabulky s mapováním sloupců
- **Log změn** - přehled všech změn provedených v aktuální session
- **Přístupnost** - plně přístupné rozhraní pro odečítače obrazovky
- **Integrace s GitHub a GIT**: Možnost načíst a ukládat modely a projekty v GIT repozitáři, přístup je zajištěn přes API klíč, takže to bude fungovat i u privátních repos.



## Formát AJX

**AJX (ArchiMate JSON eXchange)** je standardní formát pro výměnu ArchiMate modelů založený na JSON. Soubory mají příponu `.ajx`.

### Struktura AJX souboru

```json
{
  "exportDate": "2025-01-15T10:30:00.000Z",
  "archimateVersion": "3.2",
  "model": {
    "id": "id-model-001",
    "name": "Název modelu",
    "version": "1.0",
    "documentation": "Popis modelu",
    "dublinCore": { ... },
    "properties": []
  },
  "elements": [...],
  "relationships": [...],
  "diagrams": [...],
  "adr": [...],
  "notes": [...],
  "tasks": [...]
}
```

### Rozšíření AJX formátu

Editor používá standardní AJX formát pro ArchiMate modely a přidává tři rozšíření:

- **adr** - Architecture Decision Records (architektonická rozhodnutí)
- **notes** - Poznámky s Markdown podporou a verzováním
- **tasks** - Úkoly pro správu rozvoje architektury

Podrobná specifikace všech polí je v souboru `ajx-schema.json` (JSON Schema).

### Výhody formátu AJX

- Čitelný pro člověka i stroj
- Snadno verzovatelný v Git
- Jednoduchá integrace s jinými nástroji
- Validovatelný pomocí JSON Schema
- Kompaktnější než XML

---

## Rozhraní editoru

### Záhlaví

V záhlaví najdete:
- **Název modelu** - kliknutím přejdete na záložku Model
- **Verze modelu** - zobrazuje aktuální verzi
- **Statistiky** - počet prvků, vazeb, diagramů a vrstev
- **Přepínač jazyka** - CZ/EN
- **Rychlé akce** - 📄 **Nový** (Alt+N), 📂 **Otevřít** (Alt+O) a 💾 **Uložit** (Alt+S, případně Ctrl+S)

Tlačítko **Uložit** se rozhoduje samo: je-li vyplněná cesta do GitHubu a uložený token,
uloží model do GitHubu, jinak stáhne soubor AJX.

### Záložky

Editor je rozdělen do deseti hlavních záložek:

1. **Model** - metadata a nastavení modelu
2. **Prvky** - správa architektonických prvků
3. **Vazby** - správa vztahů mezi prvky
4. **Diagramy** - tvorba a správa pohledů
5. **Úkoly** - evidence a sledování úkolů
6. **Poznámky** - textové poznámky s Markdown
7. **ADR** - architektonická rozhodnutí
8. **Nástroje** - log změn, správa příznaků a generátor textu
9. **Export/Import** - výměna dat s jinými systémy
10. **Reference** - přehled ArchiMate specifikace

---

## Správa modelu

### Základní informace

- **ID modelu** - unikátní identifikátor (automaticky generován)
- **Název modelu** - zobrazuje se v záhlaví
- **Verze** - verzování modelu
- **Dokumentace** - podrobný popis modelu (podporuje Markdown)

### Dublin Core metadata

Standardizovaná metadata podle ISO 15836:

| Pole | Popis |
|------|-------|
| Tvůrce | Autor nebo odpovědná osoba |
| Vydavatel | Organizace zodpovědná za publikaci |
| Datum | Datum vytvoření nebo publikace |
| Jazyk | Jazyk obsahu (cs, en, de...) |
| Práva | Licenční informace |
| Předmět | Téma nebo klíčová slova |
| Popis | Stručný popis obsahu |

### Vlastní vlastnosti

Můžete přidat libovolný počet vlastních vlastností ve formátu klíč-hodnota. Použijte tlačítko **Přidat vlastnost** a vyplňte název a hodnotu.

---

## Práce s prvky

### Vytvoření nového prvku

1. Vyberte **vrstvu** (Strategy, Business, Application...)
2. Vyberte **typ prvku** - seznam se filtruje podle vrstvy
3. Vyplňte **název** prvku
4. Volitelně přidejte:
   - **Stereotyp** - rozšíření typu (např. "microservice")
   - **Určuje** - odkaz na zákon, standard nebo řídicí dokument
   - **Příznaky** - tagy oddělené čárkou pro kategorizaci
   - **Popis** - podrobná dokumentace (podporuje Markdown)
5. Klikněte **Uložit prvek**

### Automatické generování ID

ID prvku se generuje automaticky z typu a názvu:
- `BusinessProcess` + "Zpracování objednávky" → `bp-zpracovani-objednavky`

### Operace s prvky

| Akce | Popis |
|------|-------|
| **Upravit** | Otevře prvek k úpravě ve formuláři pod tabulkou |
| 📋 | Duplikuje prvek (kopie s novým ID) |
| **Smazat** | Smaže prvek i jeho vazby |

Název prvku v tabulce je odkaz na jeho vazby — kliknutím se přepnete na záložku Vazby
s filtrem na daný prvek. Sloupec **Diagramy** ukazuje, na kterých diagramech prvek je.

U názvu prvku jsou také malá tlačítka **Z:** a **Do:** s počtem vazeb, které směřují
z prvku a do prvku. Kliknutím se otevře popup se seznamem těchto vazeb, takže není nutné
přepínat se do záložky Vazby a filtrovat.

### Hromadné operace s prvky

Zaškrtnutím prvků v prvním sloupci (nebo přepínačem v záhlaví tabulky) se nad tabulkou
objeví panel hromadných akcí:

| Akce | Popis |
|------|-------|
| Změnit typ | Přepíše typ u všech vybraných prvků |
| Změnit stereotyp | Nastaví stejný stereotyp |
| Změnit určuje | Nastaví stejnou hodnotu pole Určuje |
| Změnit popis | Nastaví stejný popis |
| Přidat příznaky | Přidá vybraným prvkům příznaky (oddělené čárkou) |
| Smazat vybrané | Smaže vybrané prvky i jejich vazby |

### Filtrování prvků

Nad tabulkou jsou filtry:
- **Vrstva** - filtr podle vrstvy
- **Typ** - filtr podle typu prvku
- **Stereotyp** - filtr podle stereotypu
- **Příznaky** - filtr podle tagů (včetně "bez příznaků")
- **Diagram** - filtr podle příslušnosti k diagramu
- **Hledat** - fulltextové vyhledávání

Tlačítko **Zrušit filtry** vymaže všechny filtry.

### Řazení a sloupce

- **Řazení** - kliknutím na záhlaví sloupce
- **Skrývání sloupců** - tlačítko "Sloupce" pro výběr zobrazených sloupců

---

## Práce s vazbami

### Kaskádový výběr

Formulář pro vazby používá inteligentní kaskádový výběr:

1. **Vrstva zdroje** → filtruje typy zdrojových prvků
2. **Typ zdroje** → filtruje konkrétní zdrojové prvky
3. **Zdrojový prvek** → vyberete konkrétní prvek
4. **Vrstva cíle** → filtruje typy cílových prvků
5. **Typ cíle** → filtruje konkrétní cílové prvky
6. **Cílový prvek** → vyberete konkrétní prvek
7. **Typ vazby** → zobrazí pouze povolené typy podle specifikace

### Kontrola validity vazeb

Editor automaticky kontroluje, zda je vazba povolena podle ArchiMate 3.2. Nepovolené kombinace nejsou v nabídce.

### Náhled tvrzení

Po výběru zdroje, cíle a typu vazby se zobrazí náhled ve formě věty:
> "Zdrojový prvek **poskytuje** Cílovému prvku"

### Filtrování vazeb

- **Zdrojový prvek** - filtr podle zdroje
- **Cílový prvek** - filtr podle cíle
- **Typ vazby** - filtr podle typu
- **Příznaky** - filtr podle tagů
- **Diagram** - filtr podle příslušnosti k diagramu
- **Hledat** - fulltextové vyhledávání

### Rychlý filtr z tabulky prvků

V tabulce prvků můžete kliknout na číslo vazeb a přejít na filtrovaný seznam vazeb pro daný prvek.

### Hromadné operace s vazbami

Stejně jako u prvků lze vazby zaškrtat a upravit hromadně:

| Akce | Popis |
|------|-------|
| Změnit typ vazby | Přepíše typ u všech vybraných vazeb |
| Změnit zdroj / Změnit cíl | Přesměruje vybrané vazby na jiný prvek |
| Změnit název | Nastaví stejný název |
| Změnit popis | Nastaví stejný popis |
| Přidat příznaky | Přidá vybraným vazbám příznaky |
| Smazat vybrané | Smaže vybrané vazby |

---

## Diagramy

Diagramy (pohledy) umožňují organizovat prvky do logických skupin a vizualizovat jejich vztahy.

### Vytvoření diagramu

1. Zadejte **název diagramu**
2. Volitelně přidejte **popis**
3. Klikněte **Vytvořit diagram**

### Seznam diagramů

- Název diagramu je odkaz, kterým se otevře editor diagramu
- Tlačítka **↑** a **↓** mění pořadí diagramů v modelu
- **✏️ Vizuálně** otevře vizuální editor, **Upravit** katalogový editor
- Zaškrtnutím diagramů a tlačítky **📝 Export MD**, **📋 Kopírovat MD**
  a **📄 Export DOCX** vyexportujete vybrané diagramy do jednoho dokumentu
  (**☑️ Vybrat vše** zaškrtne všechny)

### Editor diagramu

Editor má čtyři podzáložky:

#### Nastavení

- **Název diagramu** a **popis**
- **Rozložení prvků** - Po vrstvách (layered) nebo Mřížka (grid); použije se při
  automatickém rozvržení náhledu

#### Prvky

- Přidávání prvků pomocí kaskádového výběru (vrstva → typ → prvek) s filtrem v seznamu prvků
- Tabulka prvků na diagramu s možností odebrání

#### Vazby

- Tabulka ukazuje vazby, jejichž zdroj i cíl jsou na diagramu
- Další vazbu lze přidat vyhledáním ve zdroji, cíli, názvu nebo popisu

#### Náhled

Vizuální náhled diagramu:
- Prvky jsou zobrazeny jako tvary podle notace ArchiMate s barvou podle vrstvy
- Vazby jsou zobrazeny jako čáry s odpovídajícími značkami
- Automatické rozložení podle vrstev (layered) nebo mřížky (grid)
- Tlačítko **Překreslit** náhled přepočítá

### Vizuální editor diagramů

Editor obsahuje pokročilý vizuální editor pro interaktivní úpravu diagramů.

#### Otevření vizuálního editoru

- V tabulce diagramů klikněte na tlačítko **✏️ Vizuálně**
- V náhledu diagramu klikněte na **✏️ Upravit vizuálně**

#### Rozhraní vizuálního editoru

Editor se otevře v celoobrazovkovém modálním okně s těmito částmi:

- **Levý panel (Paleta)** - seznam dostupných prvků seskupených podle vrstvy
- **Střední část (Canvas)** - pracovní plocha s mřížkou pro editaci
- **Pravý panel (Vlastnosti)** - vlastnosti vybraného prvku nebo vazby

#### Práce s prvky

- **Přidání prvku** - přetáhněte prvek z palety na canvas nebo dvakrát klikněte
- **Přesunutí** - klikněte a táhněte prvek na novou pozici
- **Změna velikosti** - použijte rohové úchyty vybraného prvku
- **Odebrání** - vyberte prvek a klikněte na "Odebrat z diagramu" v panelu vlastností

#### Práce s vazbami

- Vazby se automaticky vytvoří mezi prvky, které mají vztah v modelu
- **Skrytí vazby** - v panelu vlastností můžete vazbu skrýt
- Vazby se překreslují automaticky při přesunu prvků

#### Ovládání canvasu

- **Zoom** - tlačítka +/- v toolbaru nebo kolečko myši
- **Zoom 1:1** - resetuje přiblížení na 100%
- **Přizpůsobit** - přizpůsobí zoom tak, aby byl vidět celý diagram
- **Posouvání** - prostřední tlačítko myši nebo tažení na prázdné ploše

#### Uložení

- Klikněte na **Uložit** pro uložení pozic a stylů prvků
- Pozice a velikosti prvků se ukládají do diagramu

### Export diagramů

V náhledu diagramu jsou k dispozici tlačítka pro export:

| Tlačítko | Popis |
|----------|-------|
| **Stáhnout SVG** | Export diagramu jako vektorový SVG soubor |
| **Stáhnout PNG** | Export diagramu jako rastrový PNG obrázek (2x rozlišení) |
| **📄 Export DOCX** | Diagram i se seznamem prvků a vazeb jako dokument Wordu |
| **📝 Export MD** | Totéž jako soubor Markdown |
| **📋 Kopírovat MD** | Markdown podoba diagramu do schránky |

Několik diagramů najednou se exportuje ze seznamu diagramů (viz výše).

---

## Úkoly

Úkoly slouží k evidenci a sledování práce na architektuře.

### Vytvoření úkolu

1. Tlačítkem **+ Nový úkol** otevřete editor
2. **Číslo** se vyplní automaticky, lze ho přepsat
3. Zadejte **název** úkolu
4. Vyberte **stav** a **prioritu** (Nízká, Střední, Vysoká, Kritická)
5. Zadejte **řešitele** a **zadavatele**
6. Nastavte **termín**
7. Volitelně přidejte **příznaky** (oddělené čárkou)
8. Přidejte **popis** a **aktuální stav / poznámky k řešení** (podporují Markdown)
9. Volitelně propojte s **prvky** nebo **vazbami** modelu

### Stavy úkolu

| Stav | Ikona | Popis |
|------|-------|-------|
| Nový | ⚪ | Nově vytvořený úkol |
| Probíhá | 🔵 | Úkol je v řešení |
| Blokováno | 🔴 | Úkol nejde řešit dál |
| Ke kontrole | 🟡 | Úkol čeká na ověření |
| Hotovo | 🟢 | Úkol je dokončen |
| Zrušeno | ⚫ | Úkol byl zrušen |

Priority mají vlastní ikony: 🟢 Nízká, 🟡 Střední, 🟠 Vysoká, 🔴 Kritická.

### Filtrování úkolů

Nad tabulkou jsou filtry podle **stavu**, **priority** a **řešitele** a fulltextové
hledání (název, řešitel, zadavatel, popis, aktuální stav, příznaky).

### Aktuální stav

Ke každému úkolu můžete přidávat poznámky o aktuálním stavu (podporuje Markdown).

### Náhled a export úkolů

Kliknutím na název úkolu se otevře náhled; z náhledu i z editoru lze úkol uložit
jako **📄 Markdown** nebo **📝 DOCX** a **📋 zkopírovat Markdown** do schránky.
Tlačítko **📦 Exportovat všechny úkoly** uloží všechny úkoly do jednoho souboru Markdown.

---

## Poznámky

Poznámky slouží k zaznamenání informací souvisejících s architekturou.

### Vytvoření poznámky

1. Tlačítkem **+ Nová poznámka** otevřete editor
2. Zadejte **název** poznámky
3. Zadejte **autora**
4. Napište **obsah** (podporuje Markdown)
5. Volitelně přidejte **příznaky** (oddělené čárkou) a propojte s prvky/vazbami

Nad tabulkou poznámek je fulltextové hledání (název, autor, obsah, příznaky).

### Náhled poznámky

Kliknutím na název se otevře náhled s vykresleným Markdownem, odkazy na propojené
položky, tlačítkem **📋 Kopírovat** (obsah do schránky) a **📜 Historie verzí**.

### Verzování

Poznámky mají automatické verzování:
- Každá změna vytvoří novou verzi
- Historie verzí je dostupná v náhledu poznámky
- Starší verzi lze zobrazit a tlačítkem **Obnovit tuto verzi** vrátit zpět

---

## Architektonická rozhodnutí (ADR)

ADR (Architecture Decision Records) dokumentují důležitá architektonická rozhodnutí.

### Struktura ADR

Editor ADR je rozdělen do oddílů:

- **Základní informace** - číslo (generuje se automaticky), název, stav, autor,
  schvalovatel, rozhodovatelé, tagy
- **Kontext** - situace vedoucí k rozhodnutí
- **Rozhodnutí** - co bylo rozhodnuto
- **Důsledky** - dopady rozhodnutí
- **Zvažované alternativy** - seznam variant, vybraná varianta a odůvodnění výběru
- **Implementace** - stav implementace (Nezahájeno / Probíhá / Dokončeno),
  datum zahájení, cílové datum a poznámky
- **Související ADR** - Nahrazuje, Nahrazeno, Souvisí s
- **Odkazy** - externí odkazy s popisem
- **Propojené položky** - prvky a vazby modelu
- **Historie stavů** - automatický záznam změn stavu

### Stavy ADR

| Stav | Ikona | Popis |
|------|-------|-------|
| Rozpracováno | ⚪ | Rozhodnutí se připravuje |
| Navrženo | 🔵 | Návrh předložen |
| Projednáváno | 💬 | V diskusi |
| Vráceno | 🔙 | Vráceno k dopracování |
| Schváleno | 🟢 | Schválené rozhodnutí |
| Zamítnuto | 🔴 | Zamítnuté rozhodnutí |
| Aktualizováno | 🔄 | Rozhodnutí bylo aktualizováno |
| Implementováno | 🟣 | Rozhodnutí je implementováno |
| Sledováno | 👁️ | Rozhodnutí je sledováno |
| Zastaralé | 🟠 | Rozhodnutí je zastaralé |
| Nahrazeno | ⚫ | Nahrazeno jiným ADR |
| Uzavřeno | 🔒 | Uzavřené rozhodnutí |

Nad tabulkou ADR je filtr podle stavu a fulltextové hledání (název, autor, kontext,
rozhodnutí, tagy).

### Alternativy a výběr

- Přidejte alternativy s názvem a popisem
- Vyberte zvolenou alternativu z rozbalovacího seznamu
- Popište důvod výběru

### Historie stavů

Každá změna stavu se automaticky zaznamenává včetně data a autora.

### Export ADR

- **📄 Uložit jako Markdown** - stáhne jednotlivé ADR
- **📝 Uložit jako DOCX** - stáhne ADR jako dokument Wordu
- **📋 Kopírovat Markdown** - zkopíruje do schránky
- **📦 Exportovat všechny ADR** - stáhne všechna ADR jako jeden soubor

Tlačítka jsou v editoru ADR i v náhledu, který se otevře kliknutím na název.

---

## Generátor textu

Generátor vytváří textové výstupy z modelu pomocí šablon s placeholdery.

### Zdroje dat

Generátor umí generovat text z:
- **Prvky** - aktuální seznam prvků (respektuje filtry)
- **Vazby** - aktuální seznam vazeb (respektuje filtry)
- **Úkoly** - všechny úkoly
- **Poznámky** - všechny poznámky
- **ADR** - všechna architektonická rozhodnutí

### Šablony

Zadejte šablonu s placeholdery ve složených závorkách:
```
{Název} je {Typ} ve vrstvě {Vrstva}.
```

### Dostupné placeholdery

#### Pro prvky
- `{ID}`, `{Název}`, `{Typ}`, `{Vrstva}`
- `{Stereotyp}`, `{Určuje}`, `{Příznaky}`, `{Popis}`

#### Pro vazby
- `{ID}`, `{Typ}`, `{Název}`, `{Popis}`, `{Příznaky}`, `{Statement}`
- Zdroj: `{Zdroj}`, `{ZdrojID}`, `{ZdrojVrstva}`, `{ZdrojTyp}`, `{ZdrojStereotyp}`, `{ZdrojUrčuje}`, `{ZdrojPříznaky}`, `{ZdrojPopis}`
- Cíl: `{Cíl}`, `{CílID}`, `{CílVrstva}`, `{CílTyp}`, `{CílStereotyp}`, `{CílUrčuje}`, `{CílPříznaky}`, `{CílPopis}`

#### Pro úkoly
- `{ID}`, `{Číslo}`, `{Název}`, `{Stav}`, `{Priorita}`
- `{Řešitel}`, `{Zadavatel}`, `{Termín}`, `{Příznaky}`
- `{Popis}`, `{AktuálníStav}`, `{Vytvořeno}`, `{Aktualizováno}`

#### Pro poznámky
- `{ID}`, `{Název}`, `{Autor}`, `{Příznaky}`
- `{Obsah}`, `{Vytvořeno}`, `{Aktualizováno}`, `{PočetVerzí}`

#### Pro ADR
- `{ID}`, `{Číslo}`, `{Název}`, `{Stav}`
- `{Autor}`, `{Schvalovatel}`, `{Datum}`, `{Příznaky}`
- `{Kontext}`, `{Rozhodnutí}`, `{Důsledky}`
- `{PočetAlternativ}`, `{VybranáAlternativa}`

### Možnosti

- **Přeskočit prázdné** - vynechá položky kde by placeholder byl prázdný

---

## Import a export

### Export

| Formát | Popis |
|--------|-------|
| **Export AJX** | Stažení modelu ve formátu AJX (JSON) |
| **Kopírovat AJX** | Zkopíruje AJX data do schránky |
| **Export XML** | ArchiMate Open Exchange formát (včetně vizuálních dat) |
| **Export CSV** | Prvky a vazby v jednom CSV souboru (dva bloky: Elements, Relationships) |

### Export podle příznaku

Z vybraného příznaku lze vyexportovat jen jeho část modelu:

1. V sekci **Export podle příznaku** vyberte příznak (pod seznamem se ukáže, kolik
   prvků a vazeb mu odpovídá)
2. Klikněte na **Export AJX** nebo **Export XML**

Do výstupu se dostanou prvky s daným příznakem, vazby s daným příznakem a navíc vazby,
jejichž zdroj i cíl ve výběru jsou.

### XML export s vizuálními daty

Při exportu do ArchiMate Open Exchange XML se ukládají také vizuální informace z diagramů:
- Pozice prvků (x, y)
- Velikosti prvků (šířka, výška)
- Barvy výplně a okrajů
- Lomové body vazeb (bendpoints)

Tyto informace jsou kompatibilní s nástrojem Archi a dalšími nástroji podporujícími ArchiMate Open Exchange formát.

### Import

Podporované formáty:
- **AJX** - ArchiMate JSON eXchange (.ajx)
- **XML** - ArchiMate Open Exchange (.xml)

Při importu XML se načítají také vizuální data diagramů, pokud jsou v souboru obsažena.

#### Možnosti importu

1. **Ze souboru** - tlačítko "Vyberte soubor"
2. **Vložením** - vložte data do textového pole
3. **Ze schránky** - tlačítko "Vložit ze schránky"
4. **Drag & Drop** - přetažením souboru na stránku

Import nahrazuje celý obsah editoru. Tlačítko **Smazat vše** vyprázdní model i uložená
data v prohlížeči.

### Import prvků z CSV/TSV

Podzáložka **Import CSV** zavede prvky z tabulky:

1. Vyberte soubor CSV/TSV, nebo data vložte ručně či tlačítkem **📋 Vložit ze schránky**
   (oddělovač se rozpozná sám)
2. V **Mapování sloupců** přiřaďte sloupce k polím ID, Název, Typ, Dokumentace,
   Stereotyp, Příznaky a Určuje — nepřiřazené sloupce se neimportují
3. Vyberte chování **při kolizi ID** (přeskočit / přepsat stávající)
4. Zkontrolujte náhled a klikněte na **Importovat prvky**

Zápis typu prvku je tolerantní (`business actor`, `BusinessActor`, `Business Actor`),
vrstva se k typu doplní automaticky. Řádky s neznámým typem se vypíšou jako
nenaimportované.

---

## Slučování modelů

Sloučení umožňuje importovat vybrané části z jiného modelu.

### Strategie sloučení

| Strategie | Popis |
|-----------|-------|
| Ponechat stávající | Při kolizi ID zachová původní |
| Přepsat novými | Při kolizi ID nahradí novým |
| Ručně vybrat | Umožní vybrat konkrétní položky |

### Ruční výběr

Při volbě "Ručně vybrat":
1. Načtěte soubor ke sloučení
2. Přepínejte mezi záložkami **Prvky**, **Vazby** a **Diagramy**
3. Zaškrtněte položky k importu
4. Klikněte **Sloučit modely**

### Označení importovaných položek

Importované položky dostanou automaticky příznak `Importováno z [název zdrojového modelu]`.

---

## Správa příznaků

Příznaky (tagy) se spravují na záložce **Nástroje**.

### Správa jednoho příznaku

V sekci **Správa příznaků** vyberte příznak ze seznamu (sbírá se z celého modelu) a:

| Operace | Popis |
|---------|-------|
| Odstranit z prvků / z vazeb / Smazat odevšud | Odebere příznak z dané části modelu |
| Nahradit v prvcích / ve vazbách / všude | Přepíše příznak na nový zápis z pole **Nahradit příznakem** |
| Sjednotit zápis | Přepíše varianty lišící se jen velikostí písmen na nejčastější zápis (v prvcích, vazbách, úkolech, poznámkách i ADR) |

Výsledek operace se vypíše pod formulářem (kolik prvků a vazeb se změnilo).

### Hromadná správa příznaků

Tlačítkem **Otevřít hromadnou správu** se otevře okno pro přidání nebo odebrání
jednoho příznaku u vybraných položek:

1. Vyberte **zdroj** (prvky nebo vazby) a **akci** (přidat / odebrat příznak)
2. Zadejte příznak — seznam pak ukáže jen položky, u kterých má akce smysl
3. Zaškrtněte položky: **☑ Vybrat vše**, **☐ Odebrat vše**, nebo
   **🔍 Vybrat filtrované** (položky odpovídající aktivním filtrům v tabulkách)
4. Klikněte na **Provést akci**

Příznaky lze přidávat i přímo v tabulkách prvků a vazeb hromadnou akcí
**Přidat příznaky**.

---

## Log změn

Editor si v průběhu práce zapisuje všechny významné změny (vytvoření, úpravy a mazání
prvků, vazeb, diagramů, úkolů, poznámek i ADR, import, sloučení, hromadné operace).

Na záložce **Nástroje** otevře tlačítko **📋 Zobrazit log změn** okno se seznamem
změn od začátku práce v prohlížeči; obsah lze zkopírovat do schránky a použít třeba
jako podklad pro commit nebo rekapitulaci porady.

Log se váže na aktuální session v prohlížeči — zavřením a znovuotevřením editoru začíná
znovu.

---

## GitHub integrace

Editor umožňuje ukládání a načítání modelu přímo z GitHub repozitáře. Každé uložení vytvoří commit s historií změn.

### Nastavení

1. Vytvořte **Personal Access Token** na https://github.com/settings/tokens?type=beta
   - Vyberte repozitář, kam chcete ukládat
   - Oprávnění: Contents → Read and write
2. V záložce **Export/Import** najděte sekci **GitHub integrace**
3. Vložte token a klikněte **Uložit token**
4. Zadejte cestu k souboru ve formátu `owner/repo/cesta/soubor.ajx`

### Použití

| Tlačítko | Popis |
|----------|-------|
| **📥 Načíst z GitHub** | Načte model ze zadané cesty |
| **📤 Uložit do GitHub** | Uloží model na zadanou cestu (vytvoří commit) |
| **🔗 Kopírovat odkaz** | Zkopíruje přímý odkaz na model |

### Přímé odkazy

Cesta k souboru se kóduje do URL parametru `?gh=...`, takže můžete sdílet přímý odkaz na konkrétní model. Při otevření odkazu se model automaticky načte z GitHubu.

### Bezpečnost

- Token se ukládá pouze v localStorage prohlížeče
- Token se nikdy neukládá do datového souboru ani do URL
- Pro veřejné repozitáře je token potřeba pouze pro zápis
- Pro privátní repozitáře je token potřeba i pro čtení

---

## Tipy a triky

### Automatické ukládání

Model se automaticky ukládá do prohlížeče po každé změně.

### Více modelů najednou

Titulek okna prohlížeče obsahuje název otevřeného modelu (`Název modelu - ArchiMate
Editor`), takže se v několika otevřených záložkách s různými modely dá vyznat.

### Našeptávání

- **Stereotypy** - nabízí dříve použité stereotypy
- **Příznaky** - nabízí existující tagy z prvků a vazeb; filtry nabízejí tagy z celého
  modelu včetně ADR, poznámek a úkolů
- **Názvy vazeb** - nabízí dříve použité názvy

### Propojování položek

Úkoly, poznámky i ADR lze propojit s prvky a vazbami modelu. Propojené položky jsou v náhledech klikatelné.

### Sdílené příznaky

Příznaky (tagy) jsou sdílené mezi prvky, vazbami, úkoly, poznámkami i ADR. Umožňuje to snadné propojování souvisejících položek.

**Velikost písmen nerozhoduje.** „Společné prvky“, „společné prvky“ i „SPOLEČNÉ PRVKY“ jsou jeden a tentýž příznak — ve filtrech, v nabídce příznaků, ve vyhledávání, v hromadných operacích i v exportu podle příznaku. Při zadání příznaku se navíc použije zápis, který už je v modelu zavedený; tlačítko **Sjednotit zápis** v Nástrojích → Správa příznaků přepíše starší varianty na nejčastější zápis.

### Markdown podpora

Markdown je podporován v:
- Dokumentaci modelu
- Popisu prvků a vazeb
- ADR (kontext, rozhodnutí, důsledky, alternativy)
- Poznámkách
- Popisu a stavu úkolů

### Zálohování

Pravidelně exportujte model do AJX souboru. Data v prohlížeči mohou být smazána při vyčištění historie.

---

## Klávesové zkratky

| Zkratka | Akce |
|---------|------|
| Ctrl+S / Cmd+S | Uložení modelu (do GitHubu, jinak do souboru) |
| Alt+N | Nový model |
| Alt+O | Otevřít soubor |
| Alt+S | Uložit model |
| Alt+E | Záložka Prvky |
| Alt+R | Záložka Vazby |
| Alt+D | Záložka Diagramy |
| Alt+M | Záložka Poznámky |
| Alt+T | Záložka Nástroje |
| Alt+U | Uložit vazbu (ve formuláři vazby) |
| Tab | Přechod mezi poli formuláře |
| Enter | Potvrzení formuláře |

Zkratky s Alt jsou `accesskey` — podle prohlížeče se mačkají jako Alt, Alt+Shift
(Firefox) nebo Ctrl+Option (Safari). Modální okna se zavírají tlačítkem **×**,
tlačítkem **Zavřít** nebo kliknutím mimo okno.

---

## Referenční příručka ArchiMate

### Vrstvy

| Vrstva | Barva | Popis |
|--------|-------|-------|
| Strategy | Hnědá | Strategické prvky - zdroje, schopnosti |
| Business | Zlatá | Byznysové prvky - aktéři, procesy, služby |
| Application | Modrá | Aplikační prvky - komponenty, služby, data |
| Technology | Zelená | Technologické prvky - uzly, zařízení |
| Physical | Tmavě zelená | Fyzické prvky - vybavení, budovy |
| Implementation | Fialová | Implementační prvky - balíčky, dodávky |
| Motivation | Červená | Motivační prvky - stakeholdeři, cíle |
| Composite | Šedá | Složené prvky - lokace, seskupení |

### Typy vazeb

| Typ | Kategorie | Popis |
|-----|-----------|-------|
| Composition | Strukturální | Prvek se skládá z jiných prvků |
| Aggregation | Strukturální | Prvek sdružuje jiné prvky |
| Assignment | Strukturální | Přiřazení aktivního prvku k chování |
| Realization | Strukturální | Prvek realizuje jiný prvek |
| Serving | Závislostní | Prvek poskytuje funkcionalitu |
| Access | Závislostní | Prvek přistupuje k datům |
| Influence | Závislostní | Prvek ovlivňuje jiný prvek |
| Triggering | Dynamická | Prvek spouští jiný prvek |
| Flow | Dynamická | Tok informací nebo materiálu |
| Specialization | Ostatní | Prvek je specializací jiného |
| Association | Ostatní | Nespecifikovaný vztah |

---

## Podpora

Editor je open-source nástroj dostupný na GitHubu.

- **Nástroj:** https://nastroje.egdilna.cz/archimate
- **Stránka o nástroji:** https://nastroje.egdilna.cz/#archimate
- **Zdrojový kód:** https://github.com/egdilna/nastroje
- **Hlášení chyb:** https://github.com/egdilna/nastroje/issues

### Systémové požadavky

- Moderní webový prohlížeč (Chrome, Firefox, Safari, Edge)
- JavaScript musí být povolen
- Pro ukládání je potřeba localStorage

### Známá omezení

- Data jsou ukládána lokálně v prohlížeči
- Při vyčištění dat prohlížeče se model smaže
- Doporučeno pravidelně exportovat zálohy

---

*Verze dokumentace: 3.1 (1. 11. 2026)*
*ArchiMate® je registrovaná ochranná známka The Open Group.*
