# Homepage

Tohle je mikroweb věnovaný informacím o našich (snad) užitečných nástrojích, které by se nejen egovernmenťákům mohly hodit.

## ✏️Nástroje

Teď jsou pro vás připravené tyhle nástroje: [ArchiMate editor], [Prohlížeč RPP], [Prohlížeč opendat], [Univerzální databázový nástroj a editor JSONDB databází], [Správce datových katalogů], [NoteBlok], [MarkDown editor], [OPML editor], [Editor spisového plánu], [NSESSS korpus]

⚠️ Web a         informace k jednotlivým nástrojům (zejména dokumentace) se vytváří, když má zrovna někdo (nejvíc [Michal]) čas, takže pokud něco chybí, pardon, bude to.

## Novinky k našim nástrojům

ℹ️ Čistě teoreticky, na stránce nástroje je sekce s novinkami a změnami v daném nástroji... Teda aspoň doufám, že tam je...

* 30. března 2026: Vydali jsme zatím v betaverzi nový a hodně žádaný nástroj a to [[Správce datových katalogů]]. Jak sám název napovídá, umí to spravovat datové katalogy, datové slovníky, konceptuální datové modely, číselníky apod. Bohužel jsem se zatím nedostal k tvorbě dokumentace.
* 23. března 2026: Už je tady nástrojů fakt docela dost a tak je asi fakt na čase rozběhnout samotný web https://egdilna.github.io/nastroje tak uvidíme.

# ✏️ArchiMate

# RPP

## Prohlížeč RPP

⛓️ [Prohlížeč RPP](https://egdilna.github.io/nastroje/rpp) je univerzálním komplexním nástrojem pro prohlížení obsahu Registru práv a povinností bez nutnosti přihlašování do AIS působnostního a s propojenými daty, odkazovatelnými detaily a přehledy včetně exportu dat do CSV a XLSX. Online běží na adrese https://egdilna.github.io/nastroje/rpp a je k němu i jednoduchá [příručka](https://egdilna.github.io/nastroje/rpp/dokumentace)


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

Existuje i [Uživatelská dokumentace](https://egdilna.github.io/nastroje/rpp/dokumentace)

* Prohlížeč RPP má svoje vlastní repository na GitHubu a to na adrese https://github.com/michalradacz/rpp-prohlizec
* Přímý odkaz na složku na hlavním repository nástrojů je https://github.com/egdilna/nastroje/blob/main/rpp

# Opendata

## Prohlížeč opendat

⛓️ [Prohlížeč otevřených dat](https://egdilna.github.io/nastroje/opendata) je univerzálním prohlížečem otevřených dat, který po zadání adresy schématu a datové sady umožňuje jednodiché procházení, hledání, filtrování, zobrazování a propojené detaily dat v datové sadě s možnosti procházejí soubisejících objektů a s možnosti exportu dat. Online běží na adrese https://egdilna.github.io/nastroje/opendata



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

# JSONDB

## Univerzální databázový nástroj a editor JSONDB databází

⛓️ [Editor JSONDB databází](https://egdilna.github.io/nastroje/jsondb) je univerzální nástroj pro správu databází. Komplexní webový editor vlastních strukturovaných databází ve formátu JSONDB. Jde o univerzální databázový nástroj pro vytváření a správu databází s pokročilými funkcemi. Jednosouborová čistě HTML a JavaScript aplikace, žádná instalace, žádné závislosti, funguje plně ve webovém prohlížeči. Využívá mezinárodní otevřený formát JSONDB se všemi rozšířeními. Online je na https://egdilna.github.io/nastroje/jsondb




### ✏️Hlavní funkce


- [ ] dopsat tohle nikde nemůžu najít

### ✏️Dokumentace

* [Kompletní uživatelská příručka](https://egdilna.github.io/nastroje/jsondb/docs-cs)
* [Documentation in english version](https://egdilna.github.io/nastroje/docs-en


### Repository a odkazy

Celý projekt je na GitHubu na https://github.io/michalradacz/database-editor




# DKedit

## Správce datových katalogů

⛓️ [Správce datového katalogu](https://egdilna.github.io/nastroje/dkedit) je komplexní nástroj pro správu datových katalogů úřadu. Umožňuje spravovat všechny katalogy úřadu, včetně datových slovníků, konceptuálních datových katalogů, katalogů údajů do RPP, číselníků a jejich položek a dalších částí povinného datového katalogu úřadu. Vše je spravováno, verzováno, auditováno a samozřejmostí je pak import a export slovníků, číselníků i celých katalogů v závazných formátech JSON a JSONLD podle otevřených formálních norem a požadavků DIA. Online je na https://egdilna.github.io/nastroje/dkedit



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

K dispozici je [Kompletní uživatelská příručka Správce datových katalogů](https://egdilna.github.io/nastroje/dkedit/dokumentace)

V případě zájmu natočíme stručné videonávody.

### Novinky a Historie změn

* 31. března 2026: Když se mi nechce dělat dokumentace, je tu pořád umělá inteligence. A tak jsem s pomocí Claude nechal udělat aspoň první verzi [dokumentace](https://egdilna.github.io/nastroje/dkedit/dokumentace), tak snad to aspoň pomůže.
* 30. března 2026 Publikována první betaverze, kterou lze ale už reálně používat. Bohužel zatím chybí dokumentace.

# ✏️NoteBlok

# ✏️SpisPlanEdit

## Editor spisového plánu

⛓️ [Editor spisového plánu](https://egdilna.github.io/nastroje/spisplanedit) je komplexní nástroj pro tvorbu, návrh, úpravu, změny, verzování projednávání import a export spisového plánu, který musí mít v elektronické podobě každý původce podle zákona 499/2004. Umožňuje nejen import a export v závazném XML formátu pro ESSL, ale i funkce správy jednotlivých verzí spisového plánu a to včetně přehledu změn v jeho verzích a podkladů pro projednání verze a změn věcných skupin.  Online běží na adrese https://egdilna.github.io/nastroje/spisplanedit a je k němu i jednoduchá [příručka](https://egdilna.github.io/nastroje/spisplanedit/dokumentace)


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





