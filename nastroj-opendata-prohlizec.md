⛓️ [Nástroj prohlížeč opendat](https://nastroje.egdilna.cz/opendata)  je českým webovým jednoduchým prohlížečem otevřených dat. Nejen v ČR existuje povinnost publikace otevřených dat formou popsaných datových sad, které lze najít třeba v NKOD. A protože jde jen o surová data, je k jejich zpracování potřeba nástroj. Tenhle je jednoduchý, zadáte adresu schématu a sady a nástroj vám vše vykreslí, umožní filtrovat, hledat, exportovat procháze. Běží online na https://nastroje.egdilna.cz/opendata

## Hlavní funkce

* Univerzální prohlížeč jakékoliv sady otevřených dat
* {++Umí hledat v celém NKD (Národním katalogu dat) dle různých kritérií a třeba i vypsat sady jednoho poskytovatele či tématu, procházet detaily datové sady a rovnou načíst do části prohlížeče dat++}
* Po vložení URL schématu a URL datové sady se automaticky načte, parsuje a rovnou zobrazuje
* Možnost procházení vnořených objektů v detailu prvku dat
* Podporuje entitní model, tedy ne jen plochá tabulková data
* Podporuje transformace RDF
* Lze si nastavit zobrazení tabulky se záznamy
* Možnost hledat, třídit, seskupovat, filtrovat
* Export dat do různých formátů

## Návod

1. Otevřete si prohlížeč z odkazu výše (nebo si otevřete jeho staženou offline verzi)
1. Pokud chcete hledat sady v NKD a rovnou je načíst, rozbalte si sekci Hledat v NKD a zobrazí se možnosti hledání a filtrů a také výběr poskytovatele a nebo tématu, je tam ale i klasické pole pro hledání.
1. Po tlačítku Hledat se zobrazí výsledky, každá datová sada je klikací odkaz, který otevře detail datové sady s informacemi a odkazy.,
1. U jednotlivých distribucí a formátů je tlačítko Otevřít v prohlížeči, které klasicky načte datovou sadu do prohlížeče dat a sbalí sekci katalogu.
1. Pro ruční zobrazení: Po otevření je třeba vložit do příslušných polí:
    1. URL JSON schématu datové sady
    2. URL datové sady (JSON, JSONLD, JSONRDF, CSV)
1. Načtou se všechna data
1. Data lze filtrovat (prohlížeč rozpozná patternová pole), třídit, hledat v nich, zobrazovat
1. Funguje i export
1. Pokud jde o dynamický entitní model, jsou u jednotlivých záznamů také odkazy na jejich detail s podrobným zobrazením i souvisejících entit, jsou-li v dané datové sadě
1, Přes propagované statické URL lze rovnou načíst datovou sadu, protože do URL lze vsunout odkaz na schéma i data a rovnou se data načtou a zobrazí.

## Historie změn

[[Novinky a změny/Změny a novinky v Opendata prohlížeči|Změny a novinky v Opendata prohlížeči]]

