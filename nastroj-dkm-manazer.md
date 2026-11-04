⛓️ [Nástroj DKM](https://nastroje.egdilna.cz/#dkm) je neuvěřitelně univerzální databázová aplikace, kde si můžete s pomocí dynamického datového modelu vytvářet vlastní databázové aplikace bez nutnosti instalace a serveru apod. Slouží jak k modelování dat a jejich popisů, tak i ke správě dat samotných. Podporuje jsonrl dotazy, jsx a schema exporty včetně datových balíčků kompatibilních se standardy i podle správy dat, exportuje do XLSX a umožňuje i další formy vstupu a výstupu obsahu. Má plno užitečných pokročilých funkcí pro modelování i sama data. Online běží na https://nastroje.egdilna.cz/dkm

## Hlavní funkce

**Dynamický správce znalostí — flexibilní znalostní báze.**

Webová aplikace pro správu znalostí s entitním modelem a aspekty. Podporuje import z CSV s automatickým rozpoznáním sloupců (název, typ, aspekty, archiv, inbox, atributy), hromadné operace nad výběrem entit a vícejazyčné rozhraní. Ale také pokročilé filtrování, vazby mezi entitami, organizaci přes tagy a skupiny, různé pohledy, nebo kompletní pokročilý export (včetně tvorby DOCX) a šablony i s daty.


* Možno využít jak pro modelování dynamických datových modelů, tak i pro samotné datové aplikace nad DDM
* Tvorba a správa datových modelů a EDM, včetně detailního validního popisu dat
* Dynamické modely založené nad entitami, prvky, typy, aspekty, atributy a volnými uživatelsky definovatelnými vazbami
* Pokročilé typy atributů: samočíslování, posuvník s rozsahem a jednotkou, checklisty, tagy ze soustav, složené atributy počítané ze šablony i přes vazbu na jinou entitu, automaticky skládaný název entity a filtrovaná nabídka cílů vazby
* Procházení datového modelu i dat, včetně grafické vizualizace prostřednictvím UML/ERD
* Export datového modelu do OpenAPI 3.1, JSON Schema, XSD, SQL DDL pro PostgreSQL, ontologie RDFS/OWL se SKOS, validačních tvarů SHACL, UML v XMI pro Enterprise Architect a do čitelné dokumentace v Markdownu
* Export vazeb do PlantUML a do GraphML pro analýzu v Gephi, yEd nebo Cytoscape
* Všechny operace správy dat a obsahu, včetně možnosti hromadných operací nad daty
* Pohledy na data: seznam, tabulka, kanban s přetahováním, kalendář, časová osa a náhled vedle seznamu, seskupení do sekcí a uložené pohledy s pravidlovými filtry
* Údržba dat: hledání duplicit a jejich slučování se strategiemi řešení konfliktů, zamykání a připínání entit, přehled změn od posledního uložení
* Wiki odkazy mezi entitami s automatickým návrhem při uložení a přejmenováním, zpětné odkazy, komentáře k entitám a revize v CriticMarkup, které se v DOCX exportují jako revize Wordu
* Pokročilý export do různých formátů včetně přenosu s chytrými funkcemi mezi jednotlivými projekty
* Export do XLSX, TSV (se zpětným importem), plná podpora práce s balíčky DKMexport a DKMdata podle JSX
* Datový export do JSON i XML s přesným schématem (JSON Schema / XSD), které se před zabalením samo ověří proti datům, uložitelné profily exportu a pevné klíče, aby přejmenování nerozbilo navazující import
* Tvorba datových balíčků json se schématem a popisem do ZIP, kompatibilní s JSX a požadavky na exportní datové balíčky
* Úplný přenos dat, včetně datové architektury a modelu a BI datových vazeb
* Import z tabulky s náhledem mapování sloupců a průvodce importem balíčků s automatickým mapováním modelu, simulací a zálohou před importem, přenos samotného modelu bez dat
* Statický HTML prohlížeč dat: jeden offline soubor pro předání komukoli, s vybranými záložkami, šablonami detailu a vazbami v obou směrech
* Rozšiřitelnost pomocí datových vrstev a obsahových pluginů
* Podporuje ukládání do GIT jako soubor či jako data objects.
* Spolupráce více lidí na jednom projektu v GitHubu: automatické ukládání, automatické slučování cizích změn bez přepisování práce druhého a hlášení sporů
* V nástroji lze vytvářet webové aplikace s vlastním rozhraním, moduly, záložkami, nastavením a vzhledem entit a seznamů
* Vlastní nastavení šablon vzhledu pro entity a aspekty, využívaném jak pro zobrazení tak i pro exporty
* Tvorba pokročilých sestav z textových šablon nad daty
* AI asistent nad entitou nebo výběrem: shrnutí, hledání rozporů, návrh struktury, odpověď jde rovnou založit jako entitu
* Práce bez myši a pro odečítače: paleta příkazů, klávesové zkratky, panely a samostatná okna entit se živou synchronizací, otevření projektu odkazem
* Různé motivy vzhledu a barev celé aplikace, včetně tmavého režimu


## Dokumentace

Dokumentace nám trochu roste a proto je zde zvláštní sekce [[Dokumentace DKM]]

{{Dokumentace DKM}}





## Změny a novinky v DKM

{{Novinky a změny/Změny a novinky v DKM}}