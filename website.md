# Homepage

Tohle je mikroweb věnovaný informacím o našich (snad) užitečných nástrojích, které by se nejen egovernmenťákům mohly hodit.


📈 Tenhle web je hotový přibližně z 40%


## Nástroje

Všechny nástroje máte v seznamu vlevo.

Osobně moje favority jsou: [ArchiMate editor](#archimate), [PIM information manager](#pim) a [PlantUML editor](#plantuml). Ale je jich tady už přes 20.

## Novinky k našim nástrojům

ℹ️ Čistě teoreticky, na stránce nástroje je sekce s novinkami a změnami v daném nástroji... Teda aspoň doufám, že tam je...

28.6.2026: Tak konečně jsou tady funkční tabulky changelogů tedy historie změn a oprav pro jednotlivé nástroje, z toho mám radost. Červen byl i měsícem hodně nových funkcí a mám moc velkou radost i z rozvoje PlantUML editoru, který teď sám už taky vlastně denně používám.

27.6.2026: Jaksi se stalo, že na tomhle mikrowebu se ne vždycky všechno ukazovalo. Velký pardon, je to způsobeno přechodem z původního nástroje na [PIM](#pim), kde taky jako jeden soubor spravuju tenhle web a include mají jinou syntaxi. Stane se, omlouvám se.

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


| Aplikace | Datum | Typ | Popis |
| --- | --- | --- | --- |
| DKM | 2026-06-08 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |
| PIM | 2026-06-08 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| MD2web | 2026-06-08 | Funkce | External markdown content files location. For example for publishing on services like sublimated.com or tinydot.com. You can now put workpath parameter to website.json config file to fetch website.md and sidebar.md from another URL other than local directory. Usefull for multidir sets. |
| ArchiMate | 2026-04-06 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |
| NoteBlok | 2026-04-05 | Vylepšení | V levém postranním panelu pro navigaci přibyly sekce pro všechny virtuální poznámky a sekce pro historie (posledních 20 změněných poznámek). Jednotlivé sekce lze nyní sbalit, aby byl levý panel stále přehledný. |
| NoteBlok | 2026-04-04 | Vylepšení | Při výběru poznámek třeba do virtuální složky, je nad výběrem nyní editační pole pro rychlé filtrování názvů, čímž se dost usnadní výběr. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Funkce | Nový typ poznámky Virtuální složka: Do virtuální složky můžete výběrem přidat libovolné poznámky a vidíte je jako klasickou složku. Jde tak o další možnost seskupování poznámek, které spolu souvisí nehledě na to, kde jsou v hierarchii složek. U poznámky se také kromě klasických složek objevuje i to, v jakých virtuálních složkách se nachází. |
| Bookmark | 2026-04-06 | Funkce | Nový nástroj Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://egdilna.github.io/nastroje/bookmark |
| Bookmark | 2026-04-07 | Funkce | Několik užitečných drobností: U odkazu je nyní tlačítko pro kopii URL a nebo markdown odkazu do schránky a u dsložky je možnost připravit její export do hezkého přehledného markdown. A taky nová možnost přesunout záložku i do složky v jiné skupině. |
| ArchiMate | 2026-04-09 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| Bookmark | 2026-04-10 | Oprava | Špatně se vykresloval někdy dialog pro export a import záložek, teď už by se měl vykreslit pořádně. |
| NoteBlok | 2026-04-10 | Funkce | Nový typ poznámky Diagram: Umožňuje tvorbu a vykreslování a includování diagramů v PlantUML formátu, včetné jejich náhledu a exportů. Nový typ poznámky Deník: Možnost journal záznamů s datumem a časem s automatickým řazením a možností správy jednotlivých záznamů, také lze samozřejmě includovat do jiných záznamů. |
| ArchiMate | 2026-04-13 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| ArchiMate | 2026-04-12 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| Bookmark | 2026-04-13 | Funkce | Při zapnuté správě je nyní možnost pro určitou složku nebo tag vygenerovat přímý URL odkaz pro jeho zobrazení, což může být užitečné při sdílení knihovny, že se rovnou otevře daná složka či tag. |
| OpenData | 2026-04-18 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |
| OpenData | 2026-04-19 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| ArchiMate | 2026-04-20 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| DMS storage | 2026-04-30 | Vylepšení | Motivy: Aplikace teď pro jednotlivá storage nabízí více jak 20 různých designových motivů. Nastavuje se ve vlastnostech úložiště. |
| Audio editor | 2026-05-02 | Vylepšení | Lepší handling M4A. A trochu srozumitelnější a ergonomičtější klávesové zkratky. A hlavně přidáno okno se zkratkami. |
| DMS storage | 2026-05-03 | Funkce | Tagy pro lepší organizaci a komentáře u souborů. |
| PIM | 2026-06-02 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| PIM | 2026-04-09 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| PlantUML | 2026-04-09 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| PlantUML | 2026-04-09 | Funkce | Nové typy diagramů a to mindmap a WBS |
| Kurzor | 2026-06-09 | Funkce | Řada novinek: Možnost v editoru přepnout do režimu prohlížeče, což se hodí pro kontrolu kurzu a také pro promítání rovnou z editoru bez nutnosti exportu do offline prohlížeče. Upraven workflow editace objektů, kdy výchozí je režim náhledu a režim editace je na tlačítku. Doplněno číslování uvnitř sekce. Nová část aplikace s osobními autorskými poznámkami, co se musí dodelat a opravit a tak, možnost označovat jako hotové, poznámky se nikam neexportují a jsou jen pro autory. A několik drobných oprav. |
| PIM | 2026-06-12 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| PIM | 2026-06-13 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| Kurzor | 2026-06-25 | Funkce | Nově KURZor editor umí kromě exportu kurzu a tvorby offline html prohlížeče také vygenerovat obsah kurzu i s odkazey do DOCX dokumentu. Vhodné pro šíŕení kurzu jako dokument pro studenty. Obsahuje vše co má obsahovat exportovaný kurz. |
| Kurzor | 2026-06-23 | Funkce | Chtěli jste to, tak tady to máte. Nová možnost do kurzu rovnou přidávat obrázky. V horní liště je nově správa obrázků, odkaz na obrázek v markdown obsahu objektu kurzu je standardní a řídí se podle názvu souboru. Obrázky se exportují, ukazují se v assets v LMS exportech, jsou součástí offline prohlížeče, jsou zkratka všude. Ve správě obrázků je pak možnost přepsat obrázek novou verzí i pokud se soubor importovaný jako nová verze jmenuje jinak a to bez ztráty odkazů (nový název se prostě ignoruje). Díky za skvělý námět. |
| PIM | 2026-06-25 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| PlantUML | 2026-06-28 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| PlantUML | 2026-06-28 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| PIM | 2026-06-28 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |


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


| Aplikace | Datum | Typ | Popis |
| --- | --- | --- | --- |
| DKM | 2026-06-08 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |
| PIM | 2026-06-08 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| MD2web | 2026-06-08 | Funkce | External markdown content files location. For example for publishing on services like sublimated.com or tinydot.com. You can now put workpath parameter to website.json config file to fetch website.md and sidebar.md from another URL other than local directory. Usefull for multidir sets. |
| ArchiMate | 2026-04-06 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |
| NoteBlok | 2026-04-05 | Vylepšení | V levém postranním panelu pro navigaci přibyly sekce pro všechny virtuální poznámky a sekce pro historie (posledních 20 změněných poznámek). Jednotlivé sekce lze nyní sbalit, aby byl levý panel stále přehledný. |
| NoteBlok | 2026-04-04 | Vylepšení | Při výběru poznámek třeba do virtuální složky, je nad výběrem nyní editační pole pro rychlé filtrování názvů, čímž se dost usnadní výběr. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Funkce | Nový typ poznámky Virtuální složka: Do virtuální složky můžete výběrem přidat libovolné poznámky a vidíte je jako klasickou složku. Jde tak o další možnost seskupování poznámek, které spolu souvisí nehledě na to, kde jsou v hierarchii složek. U poznámky se také kromě klasických složek objevuje i to, v jakých virtuálních složkách se nachází. |
| Bookmark | 2026-04-06 | Funkce | Nový nástroj Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://egdilna.github.io/nastroje/bookmark |
| Bookmark | 2026-04-07 | Funkce | Několik užitečných drobností: U odkazu je nyní tlačítko pro kopii URL a nebo markdown odkazu do schránky a u dsložky je možnost připravit její export do hezkého přehledného markdown. A taky nová možnost přesunout záložku i do složky v jiné skupině. |
| ArchiMate | 2026-04-09 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| Bookmark | 2026-04-10 | Oprava | Špatně se vykresloval někdy dialog pro export a import záložek, teď už by se měl vykreslit pořádně. |
| NoteBlok | 2026-04-10 | Funkce | Nový typ poznámky Diagram: Umožňuje tvorbu a vykreslování a includování diagramů v PlantUML formátu, včetné jejich náhledu a exportů. Nový typ poznámky Deník: Možnost journal záznamů s datumem a časem s automatickým řazením a možností správy jednotlivých záznamů, také lze samozřejmě includovat do jiných záznamů. |
| ArchiMate | 2026-04-13 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| ArchiMate | 2026-04-12 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| Bookmark | 2026-04-13 | Funkce | Při zapnuté správě je nyní možnost pro určitou složku nebo tag vygenerovat přímý URL odkaz pro jeho zobrazení, což může být užitečné při sdílení knihovny, že se rovnou otevře daná složka či tag. |
| OpenData | 2026-04-18 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |
| OpenData | 2026-04-19 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| ArchiMate | 2026-04-20 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| DMS storage | 2026-04-30 | Vylepšení | Motivy: Aplikace teď pro jednotlivá storage nabízí více jak 20 různých designových motivů. Nastavuje se ve vlastnostech úložiště. |
| Audio editor | 2026-05-02 | Vylepšení | Lepší handling M4A. A trochu srozumitelnější a ergonomičtější klávesové zkratky. A hlavně přidáno okno se zkratkami. |
| DMS storage | 2026-05-03 | Funkce | Tagy pro lepší organizaci a komentáře u souborů. |
| PIM | 2026-06-02 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| PIM | 2026-04-09 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| PlantUML | 2026-04-09 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| PlantUML | 2026-04-09 | Funkce | Nové typy diagramů a to mindmap a WBS |
| Kurzor | 2026-06-09 | Funkce | Řada novinek: Možnost v editoru přepnout do režimu prohlížeče, což se hodí pro kontrolu kurzu a také pro promítání rovnou z editoru bez nutnosti exportu do offline prohlížeče. Upraven workflow editace objektů, kdy výchozí je režim náhledu a režim editace je na tlačítku. Doplněno číslování uvnitř sekce. Nová část aplikace s osobními autorskými poznámkami, co se musí dodelat a opravit a tak, možnost označovat jako hotové, poznámky se nikam neexportují a jsou jen pro autory. A několik drobných oprav. |
| PIM | 2026-06-12 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| PIM | 2026-06-13 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| Kurzor | 2026-06-25 | Funkce | Nově KURZor editor umí kromě exportu kurzu a tvorby offline html prohlížeče také vygenerovat obsah kurzu i s odkazey do DOCX dokumentu. Vhodné pro šíŕení kurzu jako dokument pro studenty. Obsahuje vše co má obsahovat exportovaný kurz. |
| Kurzor | 2026-06-23 | Funkce | Chtěli jste to, tak tady to máte. Nová možnost do kurzu rovnou přidávat obrázky. V horní liště je nově správa obrázků, odkaz na obrázek v markdown obsahu objektu kurzu je standardní a řídí se podle názvu souboru. Obrázky se exportují, ukazují se v assets v LMS exportech, jsou součástí offline prohlížeče, jsou zkratka všude. Ve správě obrázků je pak možnost přepsat obrázek novou verzí i pokud se soubor importovaný jako nová verze jmenuje jinak a to bez ztráty odkazů (nový název se prostě ignoruje). Díky za skvělý námět. |
| PIM | 2026-06-25 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| PlantUML | 2026-06-28 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| PlantUML | 2026-06-28 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| PIM | 2026-06-28 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |


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


| Aplikace | Datum | Typ | Popis |
| --- | --- | --- | --- |
| DKM | 2026-06-08 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |
| PIM | 2026-06-08 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| MD2web | 2026-06-08 | Funkce | External markdown content files location. For example for publishing on services like sublimated.com or tinydot.com. You can now put workpath parameter to website.json config file to fetch website.md and sidebar.md from another URL other than local directory. Usefull for multidir sets. |
| ArchiMate | 2026-04-06 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |
| NoteBlok | 2026-04-05 | Vylepšení | V levém postranním panelu pro navigaci přibyly sekce pro všechny virtuální poznámky a sekce pro historie (posledních 20 změněných poznámek). Jednotlivé sekce lze nyní sbalit, aby byl levý panel stále přehledný. |
| NoteBlok | 2026-04-04 | Vylepšení | Při výběru poznámek třeba do virtuální složky, je nad výběrem nyní editační pole pro rychlé filtrování názvů, čímž se dost usnadní výběr. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Funkce | Nový typ poznámky Virtuální složka: Do virtuální složky můžete výběrem přidat libovolné poznámky a vidíte je jako klasickou složku. Jde tak o další možnost seskupování poznámek, které spolu souvisí nehledě na to, kde jsou v hierarchii složek. U poznámky se také kromě klasických složek objevuje i to, v jakých virtuálních složkách se nachází. |
| Bookmark | 2026-04-06 | Funkce | Nový nástroj Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://egdilna.github.io/nastroje/bookmark |
| Bookmark | 2026-04-07 | Funkce | Několik užitečných drobností: U odkazu je nyní tlačítko pro kopii URL a nebo markdown odkazu do schránky a u dsložky je možnost připravit její export do hezkého přehledného markdown. A taky nová možnost přesunout záložku i do složky v jiné skupině. |
| ArchiMate | 2026-04-09 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| Bookmark | 2026-04-10 | Oprava | Špatně se vykresloval někdy dialog pro export a import záložek, teď už by se měl vykreslit pořádně. |
| NoteBlok | 2026-04-10 | Funkce | Nový typ poznámky Diagram: Umožňuje tvorbu a vykreslování a includování diagramů v PlantUML formátu, včetné jejich náhledu a exportů. Nový typ poznámky Deník: Možnost journal záznamů s datumem a časem s automatickým řazením a možností správy jednotlivých záznamů, také lze samozřejmě includovat do jiných záznamů. |
| ArchiMate | 2026-04-13 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| ArchiMate | 2026-04-12 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| Bookmark | 2026-04-13 | Funkce | Při zapnuté správě je nyní možnost pro určitou složku nebo tag vygenerovat přímý URL odkaz pro jeho zobrazení, což může být užitečné při sdílení knihovny, že se rovnou otevře daná složka či tag. |
| OpenData | 2026-04-18 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |
| OpenData | 2026-04-19 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| ArchiMate | 2026-04-20 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| DMS storage | 2026-04-30 | Vylepšení | Motivy: Aplikace teď pro jednotlivá storage nabízí více jak 20 různých designových motivů. Nastavuje se ve vlastnostech úložiště. |
| Audio editor | 2026-05-02 | Vylepšení | Lepší handling M4A. A trochu srozumitelnější a ergonomičtější klávesové zkratky. A hlavně přidáno okno se zkratkami. |
| DMS storage | 2026-05-03 | Funkce | Tagy pro lepší organizaci a komentáře u souborů. |
| PIM | 2026-06-02 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| PIM | 2026-04-09 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| PlantUML | 2026-04-09 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| PlantUML | 2026-04-09 | Funkce | Nové typy diagramů a to mindmap a WBS |
| Kurzor | 2026-06-09 | Funkce | Řada novinek: Možnost v editoru přepnout do režimu prohlížeče, což se hodí pro kontrolu kurzu a také pro promítání rovnou z editoru bez nutnosti exportu do offline prohlížeče. Upraven workflow editace objektů, kdy výchozí je režim náhledu a režim editace je na tlačítku. Doplněno číslování uvnitř sekce. Nová část aplikace s osobními autorskými poznámkami, co se musí dodelat a opravit a tak, možnost označovat jako hotové, poznámky se nikam neexportují a jsou jen pro autory. A několik drobných oprav. |
| PIM | 2026-06-12 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| PIM | 2026-06-13 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| Kurzor | 2026-06-25 | Funkce | Nově KURZor editor umí kromě exportu kurzu a tvorby offline html prohlížeče také vygenerovat obsah kurzu i s odkazey do DOCX dokumentu. Vhodné pro šíŕení kurzu jako dokument pro studenty. Obsahuje vše co má obsahovat exportovaný kurz. |
| Kurzor | 2026-06-23 | Funkce | Chtěli jste to, tak tady to máte. Nová možnost do kurzu rovnou přidávat obrázky. V horní liště je nově správa obrázků, odkaz na obrázek v markdown obsahu objektu kurzu je standardní a řídí se podle názvu souboru. Obrázky se exportují, ukazují se v assets v LMS exportech, jsou součástí offline prohlížeče, jsou zkratka všude. Ve správě obrázků je pak možnost přepsat obrázek novou verzí i pokud se soubor importovaný jako nová verze jmenuje jinak a to bez ztráty odkazů (nový název se prostě ignoruje). Díky za skvělý námět. |
| PIM | 2026-06-25 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| PlantUML | 2026-06-28 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| PlantUML | 2026-06-28 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| PIM | 2026-06-28 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |


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


| Aplikace | Datum | Typ | Popis |
| --- | --- | --- | --- |
| DKM | 2026-06-08 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |
| PIM | 2026-06-08 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| MD2web | 2026-06-08 | Funkce | External markdown content files location. For example for publishing on services like sublimated.com or tinydot.com. You can now put workpath parameter to website.json config file to fetch website.md and sidebar.md from another URL other than local directory. Usefull for multidir sets. |
| ArchiMate | 2026-04-06 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |
| NoteBlok | 2026-04-05 | Vylepšení | V levém postranním panelu pro navigaci přibyly sekce pro všechny virtuální poznámky a sekce pro historie (posledních 20 změněných poznámek). Jednotlivé sekce lze nyní sbalit, aby byl levý panel stále přehledný. |
| NoteBlok | 2026-04-04 | Vylepšení | Při výběru poznámek třeba do virtuální složky, je nad výběrem nyní editační pole pro rychlé filtrování názvů, čímž se dost usnadní výběr. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Funkce | Nový typ poznámky Virtuální složka: Do virtuální složky můžete výběrem přidat libovolné poznámky a vidíte je jako klasickou složku. Jde tak o další možnost seskupování poznámek, které spolu souvisí nehledě na to, kde jsou v hierarchii složek. U poznámky se také kromě klasických složek objevuje i to, v jakých virtuálních složkách se nachází. |
| Bookmark | 2026-04-06 | Funkce | Nový nástroj Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://egdilna.github.io/nastroje/bookmark |
| Bookmark | 2026-04-07 | Funkce | Několik užitečných drobností: U odkazu je nyní tlačítko pro kopii URL a nebo markdown odkazu do schránky a u dsložky je možnost připravit její export do hezkého přehledného markdown. A taky nová možnost přesunout záložku i do složky v jiné skupině. |
| ArchiMate | 2026-04-09 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| Bookmark | 2026-04-10 | Oprava | Špatně se vykresloval někdy dialog pro export a import záložek, teď už by se měl vykreslit pořádně. |
| NoteBlok | 2026-04-10 | Funkce | Nový typ poznámky Diagram: Umožňuje tvorbu a vykreslování a includování diagramů v PlantUML formátu, včetné jejich náhledu a exportů. Nový typ poznámky Deník: Možnost journal záznamů s datumem a časem s automatickým řazením a možností správy jednotlivých záznamů, také lze samozřejmě includovat do jiných záznamů. |
| ArchiMate | 2026-04-13 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| ArchiMate | 2026-04-12 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| Bookmark | 2026-04-13 | Funkce | Při zapnuté správě je nyní možnost pro určitou složku nebo tag vygenerovat přímý URL odkaz pro jeho zobrazení, což může být užitečné při sdílení knihovny, že se rovnou otevře daná složka či tag. |
| OpenData | 2026-04-18 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |
| OpenData | 2026-04-19 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| ArchiMate | 2026-04-20 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| DMS storage | 2026-04-30 | Vylepšení | Motivy: Aplikace teď pro jednotlivá storage nabízí více jak 20 různých designových motivů. Nastavuje se ve vlastnostech úložiště. |
| Audio editor | 2026-05-02 | Vylepšení | Lepší handling M4A. A trochu srozumitelnější a ergonomičtější klávesové zkratky. A hlavně přidáno okno se zkratkami. |
| DMS storage | 2026-05-03 | Funkce | Tagy pro lepší organizaci a komentáře u souborů. |
| PIM | 2026-06-02 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| PIM | 2026-04-09 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| PlantUML | 2026-04-09 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| PlantUML | 2026-04-09 | Funkce | Nové typy diagramů a to mindmap a WBS |
| Kurzor | 2026-06-09 | Funkce | Řada novinek: Možnost v editoru přepnout do režimu prohlížeče, což se hodí pro kontrolu kurzu a také pro promítání rovnou z editoru bez nutnosti exportu do offline prohlížeče. Upraven workflow editace objektů, kdy výchozí je režim náhledu a režim editace je na tlačítku. Doplněno číslování uvnitř sekce. Nová část aplikace s osobními autorskými poznámkami, co se musí dodelat a opravit a tak, možnost označovat jako hotové, poznámky se nikam neexportují a jsou jen pro autory. A několik drobných oprav. |
| PIM | 2026-06-12 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| PIM | 2026-06-13 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| Kurzor | 2026-06-25 | Funkce | Nově KURZor editor umí kromě exportu kurzu a tvorby offline html prohlížeče také vygenerovat obsah kurzu i s odkazey do DOCX dokumentu. Vhodné pro šíŕení kurzu jako dokument pro studenty. Obsahuje vše co má obsahovat exportovaný kurz. |
| Kurzor | 2026-06-23 | Funkce | Chtěli jste to, tak tady to máte. Nová možnost do kurzu rovnou přidávat obrázky. V horní liště je nově správa obrázků, odkaz na obrázek v markdown obsahu objektu kurzu je standardní a řídí se podle názvu souboru. Obrázky se exportují, ukazují se v assets v LMS exportech, jsou součástí offline prohlížeče, jsou zkratka všude. Ve správě obrázků je pak možnost přepsat obrázek novou verzí i pokud se soubor importovaný jako nová verze jmenuje jinak a to bez ztráty odkazů (nový název se prostě ignoruje). Díky za skvělý námět. |
| PIM | 2026-06-25 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| PlantUML | 2026-06-28 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| PlantUML | 2026-06-28 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| PIM | 2026-06-28 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |


# PIM

## PIM manažer informací


Univerzální information a PIM manager specializovaný na produktivitu.

### ✏️Hlavní funkce

### Historie změn





| Aplikace | Datum | Typ | Popis |
| --- | --- | --- | --- |
| DKM | 2026-06-08 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |
| PIM | 2026-06-08 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| MD2web | 2026-06-08 | Funkce | External markdown content files location. For example for publishing on services like sublimated.com or tinydot.com. You can now put workpath parameter to website.json config file to fetch website.md and sidebar.md from another URL other than local directory. Usefull for multidir sets. |
| ArchiMate | 2026-04-06 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |
| NoteBlok | 2026-04-05 | Vylepšení | V levém postranním panelu pro navigaci přibyly sekce pro všechny virtuální poznámky a sekce pro historie (posledních 20 změněných poznámek). Jednotlivé sekce lze nyní sbalit, aby byl levý panel stále přehledný. |
| NoteBlok | 2026-04-04 | Vylepšení | Při výběru poznámek třeba do virtuální složky, je nad výběrem nyní editační pole pro rychlé filtrování názvů, čímž se dost usnadní výběr. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Vylepšení | Změněn vzhled aplikace, takže teď už je aplikace ve světlé motivu a vypadá daleko lépe. Aplikace automaticky přepíná na světlí tmavý motiv podle nastavení operačního systému. |
| NoteBlok | 2026-04-03 | Funkce | Nový typ poznámky Virtuální složka: Do virtuální složky můžete výběrem přidat libovolné poznámky a vidíte je jako klasickou složku. Jde tak o další možnost seskupování poznámek, které spolu souvisí nehledě na to, kde jsou v hierarchii složek. U poznámky se také kromě klasických složek objevuje i to, v jakých virtuálních složkách se nachází. |
| Bookmark | 2026-04-06 | Funkce | Nový nástroj Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://egdilna.github.io/nastroje/bookmark |
| Bookmark | 2026-04-07 | Funkce | Několik užitečných drobností: U odkazu je nyní tlačítko pro kopii URL a nebo markdown odkazu do schránky a u dsložky je možnost připravit její export do hezkého přehledného markdown. A taky nová možnost přesunout záložku i do složky v jiné skupině. |
| ArchiMate | 2026-04-09 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| Bookmark | 2026-04-10 | Oprava | Špatně se vykresloval někdy dialog pro export a import záložek, teď už by se měl vykreslit pořádně. |
| NoteBlok | 2026-04-10 | Funkce | Nový typ poznámky Diagram: Umožňuje tvorbu a vykreslování a includování diagramů v PlantUML formátu, včetné jejich náhledu a exportů. Nový typ poznámky Deník: Možnost journal záznamů s datumem a časem s automatickým řazením a možností správy jednotlivých záznamů, také lze samozřejmě includovat do jiných záznamů. |
| ArchiMate | 2026-04-13 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| ArchiMate | 2026-04-12 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| Bookmark | 2026-04-13 | Funkce | Při zapnuté správě je nyní možnost pro určitou složku nebo tag vygenerovat přímý URL odkaz pro jeho zobrazení, což může být užitečné při sdílení knihovny, že se rovnou otevře daná složka či tag. |
| OpenData | 2026-04-18 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |
| OpenData | 2026-04-19 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| ArchiMate | 2026-04-20 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| DMS storage | 2026-04-30 | Vylepšení | Motivy: Aplikace teď pro jednotlivá storage nabízí více jak 20 různých designových motivů. Nastavuje se ve vlastnostech úložiště. |
| Audio editor | 2026-05-02 | Vylepšení | Lepší handling M4A. A trochu srozumitelnější a ergonomičtější klávesové zkratky. A hlavně přidáno okno se zkratkami. |
| DMS storage | 2026-05-03 | Funkce | Tagy pro lepší organizaci a komentáře u souborů. |
| PIM | 2026-06-02 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| PIM | 2026-04-09 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| PlantUML | 2026-04-09 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| PlantUML | 2026-04-09 | Funkce | Nové typy diagramů a to mindmap a WBS |
| Kurzor | 2026-06-09 | Funkce | Řada novinek: Možnost v editoru přepnout do režimu prohlížeče, což se hodí pro kontrolu kurzu a také pro promítání rovnou z editoru bez nutnosti exportu do offline prohlížeče. Upraven workflow editace objektů, kdy výchozí je režim náhledu a režim editace je na tlačítku. Doplněno číslování uvnitř sekce. Nová část aplikace s osobními autorskými poznámkami, co se musí dodelat a opravit a tak, možnost označovat jako hotové, poznámky se nikam neexportují a jsou jen pro autory. A několik drobných oprav. |
| PIM | 2026-06-12 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| PIM | 2026-06-13 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| Kurzor | 2026-06-25 | Funkce | Nově KURZor editor umí kromě exportu kurzu a tvorby offline html prohlížeče také vygenerovat obsah kurzu i s odkazey do DOCX dokumentu. Vhodné pro šíŕení kurzu jako dokument pro studenty. Obsahuje vše co má obsahovat exportovaný kurz. |
| Kurzor | 2026-06-23 | Funkce | Chtěli jste to, tak tady to máte. Nová možnost do kurzu rovnou přidávat obrázky. V horní liště je nově správa obrázků, odkaz na obrázek v markdown obsahu objektu kurzu je standardní a řídí se podle názvu souboru. Obrázky se exportují, ukazují se v assets v LMS exportech, jsou součástí offline prohlížeče, jsou zkratka všude. Ve správě obrázků je pak možnost přepsat obrázek novou verzí i pokud se soubor importovaný jako nová verze jmenuje jinak a to bez ztráty odkazů (nový název se prostě ignoruje). Díky za skvělý námět. |
| PIM | 2026-06-25 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| PlantUML | 2026-06-28 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| PlantUML | 2026-06-28 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| PIM | 2026-06-28 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |


# DKM



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

# DKedit

## Správce datových katalogů

{{O nástroji Správce datového katalogu}}

### Hlavní funkce

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

### Dokumentace a návody

K dispozici je [Kompletní uživatelská příručka Správce datových katalogů](https://nastroje.egdilna.cz/dkedit/dokumentace)

V případě zájmu natočíme stručné videonávody.

### Novinky a Historie změn

* 31. března 2026: Když se mi nechce dělat dokumentace, je tu pořád umělá inteligence. A tak jsem s pomocí Claude nechal udělat aspoň první verzi [dokumentace](https://nastroje.egdilna.cz/dkedit/dokumentace), tak snad to aspoň pomůže.
* 30. března 2026 Publikována první betaverze, kterou lze ale už reálně používat. Bohužel zatím chybí dokumentace.

# ✏️NoteBlok

# ✏️SpisPlanEdit

## Editor spisového plánu

{{O nástroji Editor spisového plánu}}

### Hlavní funkce

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

### ✏️Odkazy a dokumentace

ℹ️ Dokumentace          se vytváří...

- [ ] vážně pohnout s dokumentací k editoru spisového plánu
- [ ] pak až bude hotová dokumentace tak sem odkaz

# Editory

multisection

## ✏️MarkDown

## ✏️OPML

## ✏️JSON

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
