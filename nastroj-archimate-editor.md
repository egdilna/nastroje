

⛓️ [Archimate editor](https://nastroje.egdilna.cz/archimate) je webový komplexní nástroj pro tvorbu a správu architektury, především pro architektonické modely v jazyce ArchiMate, ale umí na jednom místě také spravovat ADR dokumenty, architektonické úkoly a poznámky. Má spoustu různých vychytávek, jako je generátor textových výstupů z architektury, slučování modelů s uživatelským výběrem a mnoho dalšího. Je stoprocentně přístupný, ale podporuje i grafické modelování. Online běží na https://egdilna.github-io/nastroje/archimate



## Hlavní funkce

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

## Dokumentace a odkazy na repo

* [Kompletní uživatelská příručka Archimate editoru](https://nastroje.egdilna.cz/archimate/docs-cs
* Nástroj má vlastní repozitář na GitHubu na adrese https://github.com/michalradacz/archimate-editor

## Změny a novinky


| Datum | Typ | Popis |
| --- | --- | --- |
| 20. 4. 2026 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| 13. 4. 2026 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| 12. 4. 2026 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| 9. 4. 2026 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| 6. 4. 2026 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |


## Použití

Úřady a organizace, které nástroj využívají, zatím nechtějí pulikovat svoje modely veřejně.

Nicméně na tomto nástroji jsou založeny online modely:

* [Archimate model Referenční architektura ESSL v2 (EGdílna)](https://egdwiki.info/egdilna:archimate-essl-referencni-v2.ajx)
* [ArchiMate model ehealth u poskytovatele (DigiNemocnice.cz)](https://egdwiki.info/diginemocnice:archimate-model-ehealthuposkytovatele)

