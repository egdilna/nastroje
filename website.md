# Homepage

Tohle je mikroweb věnovaný informacím o našich (snad) užitečných nástrojích, které by se nejen egovernmenťákům mohly hodit.


⚠️ Web a         informace k jednotlivým nástrojům (zejména dokumentace) se vytváří, když má zrovna někdo (nejvíc [Michal]) čas, takže pokud něco chybí, pardon, bude to.


## ✏️Nástroje

Teď jsou pro vás připravené tyhle nástroje: [ArchiMate editor], [Prohlížeč RPP], [Prohlížeč opendat], [Editor JSONDB databází], [NoteBlok], [MarkDown editor], [OPML editor], [Editor spisového plánu], [NSESSS korpus]


## Novinky k našim nástrojům

ℹ️ Čistě teoreticky, na stránce nástroje je sekce s novinkami a změnami v daném nástroji... Teda aspoň doufám, že tam je...

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

# ✏️JSONDB

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


