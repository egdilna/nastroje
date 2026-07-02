# Homepage

Tohle je mikroweb věnovaný informacím o našich (snad) užitečných nástrojích, které by se nejen egovernmenťákům mohly hodit.


📈 Tenhle web je hotový přibližně z 40%

## Nástroje

Všechny nástroje máte v seznamu vlevo.

Osobně moje favority jsou: [ArchiMate editor](#archimate), [PIM information manager](#pim) a [PlantUML editor](#plantuml). Ale je jich tady už přes 20.

## Novinky k našim nástrojům

1.7.2026: Jejej, jaksi jsem sem nedal informaci o nástroji TIN editor, přesto že nástroj samotný existuje. Pardon, napraveno, je v sekci Editory.


28.6.2026: Tak konečně jsou tady funkční tabulky changelogů tedy historie změn a oprav pro jednotlivé nástroje, z toho mám radost. Červen byl i měsícem hodně nových funkcí a mám moc velkou radost i z rozvoje PlantUML editoru, který teď sám už taky vlastně denně používám.

27.6.2026: Jaksi se stalo, že na tomhle mikrowebu se ne vždycky všechno ukazovalo. Velký pardon, je to způsobeno přechodem z původního nástroje na PIM, kde taky jako jeden soubor spravuju tenhle web a include mají jinou syntaxi. Stane se, omlouvám se.

2.6.2026: Web teď konečně funguje i na adrese https://nastroje.egdilna.cz a na této adrese fungují i jednotlivé nástroje.

7.4.2026: Nový nástroj [Správce záložek] - Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://nastroje.egdilna.cz/bookmark 

6.4.2026: Pozor, většina našich nástrojů teď mimo jiných metod pro načítání a ukládání dat <mark>podporuje i plnou itegraci s GIT úložištěm, třeba GitHub přes API</mark>. Pro zápisy budete potřebovat vlastní GitHub API klíč, ale ten zůstane jen ve vašem prohlížeči a nikdy se neukládá ani k nám a ani do příslušného datového souboru.

30.3.2026: Vydali jsme zatím v betaverzi nový a hodně žádaný nástroj a to [[Správce datových katalogů]]. Jak sám název napovídá, umí to spravovat datové katalogy, datové slovníky, konceptuální datové modely, číselníky apod. Bohužel jsem se zatím nedostal k tvorbě dokumentace.

23.3.2026: Už je tady nástrojů fakt docela dost a tak je asi fakt na čase rozběhnout samotný web https://egdilna.github.io/nastroje tak uvidíme.

# ArchiMate

## Archimate editor

⛓️ [Archimate editor](https://nastroje.egdilna.cz/archimate) je webový komplexní nástroj pro tvorbu a správu architektury, především pro architektonické modely v jazyce ArchiMate, ale umí na jednom místě také spravovat ADR dokumenty, architektonické úkoly a poznámky. Má spoustu různých vychytávek, jako je generátor textových výstupů z architektury, slučování modelů s uživatelským výběrem a mnoho dalšího. Je stoprocentně přístupný, ale podporuje i grafické modelování. Online běží na https://egdilna.github-io/nastroje/archimate



### Hlavní funkce

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
- **Diagramy** - vizuální náhled s exportem do SVG
- **Hromadné operace** - práce s příznaky (tagy)
- **Přístupnost** - plně přístupné rozhraní pro odečítače obrazovky
- **Integrace s GitHub a GIT**: Možnost načíst a ukládat modely a projekty v GIT repozitáři, přístup je zajištěn přes API klíč, takže to bude fungovat i u privátních repos.
- **DokuWiki integrace** - plugin pro spolupráci v týmu

### Dokumentace a odkazy na repo

* [Kompletní uživatelská příručka Archimate editoru](https://nastroje.egdilna.cz/archimate/docs-cs
* Nástroj má vlastní repozitář na GitHubu na adrese https://github.com/michalradacz/archimate-editor

### Změny a novinky


| Datum | Typ | Popis |
| --- | --- | --- |
| 20. 4. 2026 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| 13. 4. 2026 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| 12. 4. 2026 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| 9. 4. 2026 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| 6. 4. 2026 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |


### Použití

Úřady a organizace, které nástroj využívají, zatím nechtějí pulikovat svoje modely veřejně.

Nicméně na tomto nástroji jsou založeny online modely:

* [Archimate model Referenční architektura ESSL v2 (EGdílna)](https://egdwiki.info/egdilna:archimate-essl-referencni-v2.ajx)
* [ArchiMate model ehealth u poskytovatele (DigiNemocnice.cz)](https://egdwiki.info/diginemocnice:archimate-model-ehealthuposkytovatele)

# RPP

## Prohlížeč RPP

⛓️ [Prohlížeč RPP](https://nastroje.egdilna.cz/rpp) je univerzálním komplexním nástrojem pro prohlížení obsahu Registru práv a povinností bez nutnosti přihlašování do AIS působnostního a s propojenými daty, odkazovatelnými detaily a přehledy včetně exportu dat do CSV a XLSX. Online běží na adrese https://nastroje.egdilna.cz/rpp a je k němu i jednoduchá [příručka](https://nastroje.egdilna.cz/rpp/dokumentace)


### Hlavní funkce

Jednoduchý ale komplexní prohlížeč Registru práv a povinností

* Zobrazování různých sekcí dat složených z datových sad i komplexních dotazů
* Propojená data a souvislosti, které nejsou ani v AIS působnostním
* Statická URL adresa na detail entity a pohled
* Komplexní hledání, třeba podle OVM i s jeho kategoriemi, podle agend apod.
* Obsahuje detailní a kompletní informace o působnosti v rámci detalu OVM
* Export do CSV, TSV i XLSX
* Možnost přizpůsobení zobrazení tabulek dat a filtrování

### Odkazy a dokumentace

Existuje i [Uživatelská dokumentace](https://nastroje.egdilna.cz/rpp/dokumentace)

* Prohlížeč RPP má svoje vlastní repository na GitHubu a to na adrese https://github.com/michalradacz/rpp-prohlizec
* Přímý odkaz na složku na hlavním repository nástrojů je https://github.com/egdilna/nastroje/blob/main/rpp

### Historie změn a oprav


| Datum | Typ | Popis |
| --- | --- | --- |
| (žádný záznam) |  |  |


# Opendata

## Prohlížeč opendat

⛓️ [Nástroj prohlížeč opendat](https://nastroje.egdilna.cz/opendata)  je českým webovým jednoduchým prohlížečem otevřených dat. Nejen v ČR existuje povinnost publikace otevřených dat formou popsaných datových sad, které lze najít třeba v NKOD. A protože jde jen o surová data, je k jejich zpracování potřeba nástroj. Tenhle je jednoduchý, zadáte adresu schématu a sady a nástroj vám vše vykreslí, umožní filtrovat, hledat, exportovat procháze. Běží online na https://nastroje.egdilna.cz/opendata

### Hlavní funkce

* Univerzální prohlížeč jakékoliv sady otevřených dat
* Po vložení URL schématu a URL datové sady se automaticky načte, parsuje a rovnou zobrazuje
* Možnost procházení vnořených objektů v detailu prvku dat
* Podporuje entitní model, tedy ne jen plochá tabulková data
* Podporuje transformace RDF
* Lze si nastavit zobrazení tabulky se záznamy
* Možnost hledat, třídit, seskupovat, filtrovat
* Export dat do různých formátů

### Návod

1. Otevřete si prohlížeč z odkazu výše (nebo si otevřete jeho staženou offline verzi)
1. Po otevření je třeba vložit do příslušných polí:
    1. URL JSON schématu datové sady
    2. URL datové sady (JSON, JSONLD, JSONRDF, CSV)
1. Načtou se všechna data
1. Data lze filtrovat (prohlížeč rozpozná patternová pole), třídit, hledat v nich, zobrazovat
1. Funguje i export
1. Pokud jde o dynamický entitní model, jsou u jednotlivých záznamů také odkaza na jejich detail s podrobným zobrazením i souvisejících entit, jsou-li v dané datové sadě

### Historie změn


| Datum | Typ | Popis |
| --- | --- | --- |
| 19. 4. 2026 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| 18. 4. 2026 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |


# PlantUML

## PlantUML editor

⛓️[Nástroj PlantUML editor](https://nastroje.egdilna.cz/plantuml) je webový plně přístupný speciální editor diagramů a kódu pro textový jazyk diagramů PlantUML. Online běží na https://nastroje.egdilna.cz/plantuml

### Hlavní funkce

PlantUML je dnes asi nejpoužívanější framework pro tzv. text diagramming, tedy tvorbu diagramů psaním jakéhosi zdrojového kódu. Tohle je český editor

* Umožňuje editovat více než 10 základních PlantUML diagramů
* Plná podpora projektu s více složkami a diagramy
* Verzování diagramu s možností obnovy, sledování stavu diagramu
* Editor plně přístupný a klikací
* Vykreslováí, náhled, promítání, uložení, export a stažení diagramu
* Tvorba MD či DOCX celkové dokumentace diagramu s jeho popisky
* Generování hezkých čitelných textových popisů diagramu
* Filtrování hotových a nehotových prvků
* Sdílené objekty napříč celým projektem
* Export a import diagramů a složek, přenos diagramů mezi projekty

### Historie změn a oprav


| Datum | Typ | Popis |
| --- | --- | --- |
| 28. 6. 2026 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| 28. 6. 2026 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| 9. 4. 2026 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| 9. 4. 2026 | Funkce | Nové typy diagramů a to mindmap a WBS |


# PIM

## PIM manažer informací

Univerzální information a PIM manager specializovaný na produktivitu.

### ✏️Hlavní funkce

### Historie změn


| Datum | Typ | Popis |
| --- | --- | --- |
| 30. 6. 2026 | Oprava | Opravena chyba v exportu do DOCX a PDF, kdy se někdy nevykreslovaly správně revize přes critic markup, pokud šlo o přímé nahrazení textu. DOCX nic takového neumí, takže teď je to odstraněný a za ním hned vložený text. |
| 28. 6. 2026 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |
| 25. 6. 2026 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| 13. 6. 2026 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| 12. 6. 2026 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| 8. 6. 2026 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| 2. 6. 2026 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| 9. 4. 2026 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |


# DKM

## Datový správce a konceptuální modeller

- [ ] dodělat [[O nástroji DKM]]



*[⚠ Entita „O nástroji DKM" nenalezena]*

### Hlavní funkce

**Dynamický správce znalostí — flexibilní znalostní báze.**

Webová aplikace pro správu znalostí s entitním modelem a aspekty. Podporuje import z CSV s automatickým rozpoznáním sloupců (název, typ, aspekty, archiv, inbox, atributy), hromadné operace nad výběrem entit a vícejazyčné rozhraní.
* Možno využít jak pro modelování dynamických datových modelů, tak i pro samotné datové aplikace nad DDM
* Dynamické modely založené nad entitami, prvky, typy, aspekty, atributy a volnými uživatelsky definovatelnými vazbami
* Všechny operace správy dat a obsahu, včetně možnosti hromadných operací nad daty
* Pokročilý export do různých formátů včetně přenosu s chytrými funkcemi mezi jednotlivými projekty
* Rozšiřitelnost pomocí datových vrstev a obsahových pluginů
* Podporuje ukládání do GIT jako soubor či jako data objects.


### Dokumentace

K dispozici je kompletní [[uživatelská příručka v češtině]](https://nastroje.egdilna.cz/dkm/docs-cs.md) a také [user guide in english](https://nastroje.egdilna.cz/dkm/docs-en.md)

### ✏️Historie změn a oprav



| Datum | Typ | Popis |
| --- | --- | --- |
| 29. 6. 2026 | Vylepšení | Nyní v editaci typu entity či v editaci aspektu u každého atributu je zaškrtávací pole, které udává, zda bude daný atribut vidět hned ve výpisu entit. Takže teď kvůli nejdůležitějším hodnotám nemusíte každou entitu otevírat. |
| 8. 6. 2026 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |


# JSONDB

## Univerzální databázový nástroj a editor JSONDB databází

{{O nástroji JSONDB editor}}

### ✏️Hlavní funkce

- [ ] dopsat tohle nikde nemůžu najít

### ✏️Dokumentace

* [Kompletní uživatelská příručka](https://nastroje.egdilna.cz/jsondb/docs-cs)
* [Documentation in english version](https://nastroje.egdilna.cz/docs-en

### Repository a odkazy

Celý projekt je na GitHubu na https://github.io/michalradacz/database-editor

# ✏️NoteBlok

# Editory

multisection

## TIN editor

### Editor TIN instrukcí pro AI

⛓️ [TIN editor](https://nastroje.egdilna.cz/tineditor) je jednoduchý, ale účinný webový editor a tvůrce souboru instrukcí pro AI ve formátu standardu TIN (Target instruction notation) s pokročilými funkcemi editace všech prvků instrukcí. Online běží na https://nastroje.egdilna.cz/tineditor

#### Popis a účel

TIN (Target instruction notation) je standard pro vytváření pokročilých instrukcí pro umělou inteligenci. S pomocí TIN standardu lze vytvořit precizně fungujícího agenta AI a velice snadno ovlivit, co a jak dělá a nedělá.


#### Dokumentace

Existuje [TIN specs description](https://nastroje.egdilna.cz/tineditor/tin-spec.md) a její [neoficiální český překlad](https://nastroje.egdilna.cz/tineditor/tin-spec-cs.md)

## ✏️MarkDown

## ✏️OPML

## ✏️JSON

## ✏️SpisPlanEdit

### Editor spisového plánu

{{O nástroji Editor spisového plánu}}

#### Hlavní funkce

Co to umí?

* Správa projektu (projekt je nad původcem, kde se pak budou spravovat všechny verze SP)
* Správa verzí SP s jejich stavem, sledováním změn, sledováním projednání apod.
* Správa věcných skupin, jejich podrobností dle NSESSS/XSD a metadat o plánu a o věcné skupině, hierarchie věcných skupin
* Skládaný složený znak s automatickým generováním z rodičů a hlídáním duplicit
* Kromě stávajících metadat už tam rovnou mám i bezpečnostní kategorii (podle NZKB, bude v budoucích metadatech věcné skupiny)
* Rozlišení (text i barva) věcné skupiny v hierarchii a věcné skupiny nejnižší úrovně
* Výpis podřízených skartačních režimů, lhůt apod.
* Věcné skupiny pro typové spisy a součásti ve správné hierarchii
* Kromě komentáře do oficiálního SP také autorské interní poznámky jk jakékoliv věcné skupině, které se mohou i nemusí objevit v sestavě pro projednávání, ale nejsou pak součástí XML
* Export XML a import XML SP
* Přehledná a barevná sestava pro tisk se zobrazením navrhovaných změn v nové verzi SP - třeba jako podklad pro projednání novelizace SP
* Generování JSON podle budoucí otevřené formální normy pro SP jako otevřená data (2027)

#### ✏️Odkazy a dokumentace

ℹ️ Dokumentace          se vytváří...

- [ ] vážně pohnout s dokumentací k editoru spisového plánu
- [ ] pak až bude hotová dokumentace tak sem odkaz

## DKedit

### Správce datových katalogů

{{O nástroji Správce datového katalogu}}

#### Hlavní funkce

Komplexní webový nástroj pro správu a úpravy a schvalování datových katalogů úřadu, datových slovníků, datových schémat a číselníků

* Snaha o co nejjednodušší aplikaci pro složitý návrh datových katalogů s propojením mezi sebou
* Univerzální principy pro celý projekt, včetně verzování a sledování stavu
* Správa celého DK úřadu jako celého projektu se sledováním změn a verzováním
* Správa, tvorba, úprava a pokročilé nástroje pro datové slovníky
* Správa, tvorba, úprava a pokročilé nástroje pro datové katalogy, včetně schémat pro RPP a schémat pro klasifikaci dle vyhlášky 360/2023
* Správa, tvorba, úprava a pokročilé nástroje pro číselníky, včetně správy jejich položek
* Propojování dat v rámci projektu i pomocí URI/IRI s jinými katalogy
* Sestavy pro projednávání a schralováí a sledování změn ve slovnících i číselnících
* Hromadné operace nad slovníky, pojmy, číselníky i položkami, včetně hromadného schvalování
* Export katalogu a slovníku do JSONLD dle OFN pro datové a konceptuální slovníky, kompatibilní s povinným formátem pro DIA a RPP
* Export číselníků v povinném formátu JSONLD podle OFN pro NKOD a RPP
* Import slovníků a číselníků z JSONLD se sledováním duplicit a změn
* Univerzální autorské poznámky sloužící jen interně pro projekt
* Ukládá projekt do jediného JSON souboru, ukládání a správa v browser storage v prohlížeči

#### Dokumentace a návody

K dispozici je [Kompletní uživatelská příručka Správce datových katalogů](https://nastroje.egdilna.cz/dkedit/dokumentace)

V případě zájmu natočíme stručné videonávody.

#### ✏️Historie změn a oprav



| Datum | Typ | Popis |
| --- | --- | --- |
| (žádný záznam) |  |  |


## AED

### Audio editor

#### Hlavní funkce

**Jednostopý webový audio editor.**

Webová aplikace pro střih a zpracování zvukových stop. Umožňuje práci s jednou audio stopou — nahrávání, stříhání, exportování. Plně lokalizovaná do češtiny a angličtiny, s důrazem na přístupnost (klávesové zkratky, čtečky obrazovky).

- Nový projekt, otevírání a ukládání projektů
- Export hotového výsledku
- Vícejazyčné rozhraní (CS/EN)

#### ✏️Historie změn a oprav

# Ostatní

multisection

## Bookmark

### Správce záložek

{{O nástroji Bookmark}}

#### Hlavní funkce

Správce záložek, bookmarků a odkazů

* Komplexní správa katalogů záložek
* Od jednoduchého seznamu až po trojírovňovou hierarchii karet se skupinami, složek a jejich záložek
* Možnost otevírat záložky ve stejném či novém okně a zkopírovat URL a MD odkaz
* Načtení a uložení katalogu záložek ze souboru, z repozitáře GitHub (včetně privátních pro vaše vlastní katalogy) a nebo přes rozhraní prohlížeče ChroniumChromium
* Tagy
* Uživatelské poznámky k záložce (více poznámek k jedné záložce)
* Export přehledu celé složky do Markdown

#### ✏️Historie změn a oprav



| Datum | Typ | Popis |
| --- | --- | --- |
| (žádný záznam) |  |  |


#### Příklady využívání

Katalog veřejných odkazů EGdílny na drese https://shm.to/egodkazy

## ✏️NSESSS korpus

# Více

multisection

## ✏️Co tohle je

Tohle jsou malé (původně) a snad užitečné nástroje, které mohou pomoci - někdy doslova každému a někdy jen určité skupině uživatelů. Většinou se jedná o dost univerzální kousky k obecnému použití. Třeba [Markdown editor] může použít opravdu každý, kdo rád (nebo právě nerad) pracuje s MD a nebo třeba [NoteBlok] jako naprosto všestranný nástroj na poznámky a dokumentaci. Ale třeba [Editor spisového plánu] použijí jen odborníci na spisovou službu a nebo [Prohlížeč RPP] jen ti, co potřebují pracovat s Registrem práv a povinností.

A protože se to prostě může hodit, tak to tady máte.

############ Jak to vzniká

Většinou se jedná o nástroje, které já sám - tedy [Michal] potřebuju, chci a nebo vím, že chtít budu. No a když už to dělám, tak ať to slouží i ostatním, ne?

## Kdo to dělá

### EGdílna

Oficiálně jsou to nástroje šířené pod hlavičkou EGdílny, to je takové divné neformální uskupení nadšenců do eGovernmentu a digitalizace veřejné správy.

Mrkněte na https://www.egdilna.cz

### Michal

Hlavním tvůrcem jednotlivých nástrojů jsem většinou já, tedy Michal Rada



https://www.michalrada.cz