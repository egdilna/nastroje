⛓️ [Nástroj prohlížeč opendat](https://nastroje.egdilna.cz/opendata)  je českým webovým jednoduchým prohlížečem otevřených dat. Nejen v ČR existuje povinnost publikace otevřených dat formou popsaných datových sad, které lze najít třeba v NKOD. A protože jde jen o surová data, je k jejich zpracování potřeba nástroj. Tenhle je jednoduchý, zadáte adresu schématu a sady a nástroj vám vše vykreslí, umožní filtrovat, hledat, exportovat procháze. Běží online na https://nastroje.egdilna.cz/opendata

## Hlavní funkce

* Univerzální prohlížeč jakékoliv sady otevřených dat
* Po vložení URL schématu a URL datové sady se automaticky načte, parsuje a rovnou zobrazuje
* Možnost procházení vnořených objektů v detailu prvku dat
* Podporuje entitní model, tedy ne jen plochá tabulková data
* Podporuje transformace RDF
* Lze si nastavit zobrazení tabulky se záznamy
* Možnost hledat, třídit, seskupovat, filtrovat
* Export dat do různých formátů

## Návod

1. Otevřete si prohlížeč z odkazu výše (nebo si otevřete jeho staženou offline verzi)
1. Po otevření je třeba vložit do příslušných polí:
    1. URL JSON schématu datové sady
    2. URL datové sady (JSON, JSONLD, JSONRDF, CSV)
1. Načtou se všechna data
1. Data lze filtrovat (prohlížeč rozpozná patternová pole), třídit, hledat v nich, zobrazovat
1. Funguje i export
1. Pokud jde o dynamický entitní model, jsou u jednotlivých záznamů také odkaza na jejich detail s podrobným zobrazením i souvisejících entit, jsou-li v dané datové sadě

## Historie změn


| Datum | Typ | Popis |
| --- | --- | --- |
| 19. 4. 2026 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| 18. 4. 2026 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |

