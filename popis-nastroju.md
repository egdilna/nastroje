# Popis nástrojů

Tento dokument shrnuje jednotlivé webové nástroje EGdílny, které najdete v tomto repozitáři. Každý nástroj je samostatná jednosouborová HTML aplikace, která běží přímo v prohlížeči bez nutnosti instalace či serveru. Data zůstávají v prohlížeči uživatele (případně lze zvolit ukládání do souboru nebo GitHub repozitáře).

Online verze všech nástrojů je k dispozici na adrese `https://egdilna.github.io/nastroje/<nazev-slozky>`.

---

## aed — AudioEdit

**Jednostopý webový audio editor.**

Webová aplikace pro střih a zpracování zvukových stop. Umožňuje práci s jednou audio stopou — nahrávání, stříhání, exportování. Plně lokalizovaná do češtiny a angličtiny, s důrazem na přístupnost (klávesové zkratky, čtečky obrazovky).

- Nový projekt, otevírání a ukládání projektů
- Export hotového výsledku
- Vícejazyčné rozhraní (CS/EN)

---

## archimate — ArchiMate 3.2 Editor

**Komplexní editor architektury v jazyce ArchiMate.**

Pokročilý webový nástroj pro tvorbu a správu architektonických modelů podle standardu ArchiMate 3.2. Slouží nejen architektům — díky katalogovému přístupu zvládne modelovat i nearchitekt.

Hlavní funkce:
- Podpora všech 60 typů prvků a 11 typů vazeb ArchiMate 3.2 s kontrolou validity
- Vizuální editor diagramů i tabulkový (katalogový) editor
- Import/export ve formátech AJX (JSON) a ArchiMate Open Exchange XML, export diagramů do PNG a SVG
- Slučování modelů s uživatelským výběrem částí
- Správa ADR (Architecture Decision Records), úkolů a poznámek (Markdown s verzováním)
- Generátor textových výstupů z modelu podle uživatelských šablon
- Hromadné operace nad příznaky (tagy)
- Integrace s GitHub/GIT repozitáři (i privátními) přes API klíč
- DokuWiki plugin pro týmovou spolupráci
- Plně přístupné rozhraní pro odečítače obrazovky
- Vícejazyčné rozhraní (CS/EN)

Součástí složky je JSON schéma `ajx-schema.json` a dokumentace `docs-cs.md`, `docs-en.md`.

---

## bookmark — Správce záložek

**Webový správce záložek, bookmarků a odkazů.**

Od jednoduchého seznamu odkazů až po komplexní tříúrovňový hierarchický katalog s kartami, skupinami a složkami.

Hlavní funkce:
- Komplexní správa katalogů záložek (tříúrovňová hierarchie: karty → skupiny/složky → záložky)
- Otevírání záložek ve stejném/novém okně, kopírování URL i Markdown odkazu
- Načtení a uložení katalogu z lokálního souboru, GitHub repozitáře (i privátního) nebo přes rozhraní Chromium
- Tagy a uživatelské poznámky k záložkám (více poznámek k jedné záložce)
- Export přehledu celé složky do Markdownu
- Plnotextové vyhledávání

---

## dkedit — Správce datových katalogů

**Komplexní nástroj pro správu datových katalogů úřadu.**

Spravuje všechny katalogy úřadu — datové slovníky, konceptuální datové katalogy, katalogy údajů do RPP, číselníky a jejich položky. Vše je verzováno, auditováno a podporuje export v závazných formátech podle Otevřených formálních norem (OFN) DIA.

Hlavní funkce:
- Slovníky a pojmy podle OFN (Obecný pojem, Typ objektu/subjektu práva, Vlastnost, Vztah, Třída, Veřejný/Neveřejný údaj)
- Číselníky a jejich položky dle OFN schématu
- Export i import JSON-LD podle OFN (slovníky i číselníky), kompatibilní s DIA/RPP/NKOD
- Hromadný import pojmů a položek z CSV/TSV s průvodcem mapování sloupců
- Snapshoty verzí slovníků a číselníků s možností návratu a porovnání
- Sestavy pro projednávání a schvalování (s barevným zvýrazněním změn)
- Hromadné operace nad slovníky, pojmy, číselníky a položkami (včetně hromadného schvalování)
- ELI průvodce pro odkazy do e-Sbírky
- Auto-generování IRI identifikátorů
- Univerzální autorské poznámky (interní)
- Ukládání projektu do jediného JSON souboru a do localStorage

Dokumentace ve složce: `dokumentace.md`.

---

## dkm — DKM (Dynamický správce znalostí)

**Dynamický správce znalostí — flexibilní znalostní báze.**

Webová aplikace pro správu znalostí s entitním modelem a aspekty. Podporuje import z CSV s automatickým rozpoznáním sloupců (název, typ, aspekty, archiv, inbox, atributy), hromadné operace nad výběrem entit a vícejazyčné rozhraní.

---

## json — Vizuální JSON Editor

**Intuitivní webový editor JSON dat.**

Editor pro prohlížení a úpravu JSON bez nutnosti psát závorky a uvozovky. Vhodný pro konfigurační soubory, API odpovědi a datové struktury.

Hlavní funkce:
- Vizuální úpravy ve stromové struktuře (bez ruční syntaxe)
- Automatická validace datových typů
- Načítání ze souboru, ze schránky nebo z URL (komprimovaná data pro sdílení)
- Plně přístupný (podpora čteček obrazovky)
- Vícejazyčné rozhraní (CS/EN)

Dokumentace ve složce: `info-cs.md`, `info-en.md`.

---

## jsondb — Univerzální editor JSONDB databází

**Komplexní webový editor strukturovaných databází ve formátu JSONDB.**

Univerzální databázový nástroj pro vytváření a správu databází s pokročilými funkcemi. Jednosouborová HTML/JavaScript aplikace bez závislostí.

Hlavní funkce:
- Tabulky, záznamy, kolekce, tagy a nastavení v jediném `.jsondb` souboru
- Mezinárodní otevřený formát JSONDB se všemi rozšířeními
- Více databází souběžně otevřených v různých kartách
- DokuWiki plugin pro integraci
- Integrace s GIT/GitHub (čtení i zápis, podpora privátních repos přes API klíč)
- Plně lokální zpracování (data zůstávají v prohlížeči uživatele)

Soubory ve složce: `docs-cs.md`, `docs-en.md`, `jsondb-format.md`, `jsondb-schema.json`.

---

## markdown — Markdown Editor

**Hierarchický editor Markdownu.**

Webový editor pro tvorbu strukturovaných Markdown dokumentů s hierarchickým členěním. Obsahuje i režim prezentace (slide-show) s časovačem a navigací mezi snímky. Vícejazyčné rozhraní (CS/EN).

---

## mdt — Šablonář MDT

**Editor šablonových dokumentů ve formátu MDT.**

Pracuje s Markdown šablonami obsahujícími placeholdery typu `[[[Text: Název]]]`, `[[[Tabulka: Sloupec1, Sloupec2]]]` atd. Šablonu (`.mdt`) uživatel vyplní a uloží jako rozpracovanou verzi (`.mdd`); finální výstup lze vyexportovat (mj. do Wordu/DOCX přes `docx` knihovnu). Ve složce je i ukázka `vzor.mdt`.

---

## mp4edit — VideoEdit

**Jednostopý webový video editor.**

Webová aplikace pro střih videa přímo v prohlížeči (aktuálně ve verzi 1.2.0). Nový projekt, otevírání, ukládání, export hotového videa. Vícejazyčné rozhraní (CS/EN), klávesové zkratky a tmavý design.

---

## noteblok — NoteBlock

**Univerzální nástroj pro poznámky a dokumentaci.**

Webová poznámkovací aplikace s pokročilou organizací: filtrování podle emoji, metadata, úkoly, plnotextové vyhledávání, import a export. Vhodný i pro náročnější dokumentační scénáře.

---

## opendata — Prohlížeč otevřených dat

**Univerzální prohlížeč otevřených dat.**

Po zadání URL JSON schématu a URL datové sady automaticky načte, zparsuje a zobrazí data. Podporuje entitní model (ne jen plochá tabulková data) i RDF transformace.

Hlavní funkce:
- Univerzální prohlížeč jakékoliv sady otevřených dat (JSON, JSON-LD, JSON-RDF, CSV)
- Procházení vnořených objektů v detailu prvku
- Filtrování (rozpoznání patternových polí), třídění, seskupování, hledání
- Konfigurovatelné zobrazení tabulky
- Export dat do různých formátů
- U dynamického entitního modelu jsou u záznamů odkazy na detail s propojenými entitami

---

## opml — Hierarchický OPML Editor

**Editor hierarchických seznamů, úkolů a projektů ve formátu OPML.**

Standardní OPML formát kompatibilní s mnoha aplikacemi. Vhodný pro outlining, GTD, plánování projektů a organizaci myšlenek.

Hlavní funkce:
- Neomezená hierarchie (libovolná hloubka vnoření)
- Checkboxy pro dokončené položky, víceřádkové poznámky
- Sledování termínů, procent dokončení a Ganttův diagram
- Plně přístupné (klávesnice, čtečky obrazovky)
- Vícejazyčné rozhraní (CS/EN)

Soubory ve složce: `opml-editor-cs.md`, `opml-editor-en.md`.

---

## pim — PIM (osobní informační manažer)

**Osobní znalostní báze a manažer informací.**

Webová aplikace pro správu osobních a profesních informací v jediném HTML souboru. Pracuje s **entitami** a **aspekty** — místo pevných typů má entita jeden či více aspektů (Úkol, Projekt, Osoba, Dokument...), které určují její atributy. Jedna entita může být současně Úkol *a* Dokument.

Hlavní funkce:
- Entitní model s aspekty a typovanými vazbami
- Wiki odkazy `[[Název]]`, include `{{include:Název}}`, placeholdery atributů `((URL))`
- Nástěnka, Inbox, Vše, Úkoly, Kalendář, Tagy, Příznaky, Nástroje, Nastavení
- Pokročilé filtrování, vyhledávání, hledání duplicit a hromadné operace
- Volitelné šifrování citlivých entit
- Volitelná synchronizace s GitHubem
- Statický prohlížeč pro publikaci

Soubory ve složce: `docs-cs.md`, `docs-en.md`.

---

## plantuml — PlantUML editor

**Editor PlantUML diagramů s projektovou strukturou.**

Webový editor pro tvorbu UML a dalších diagramů v jazyce PlantUML. Organizuje diagramy do projektů a stromové struktury složek.

Hlavní funkce:
- Nový/načítání/ukládání projektu (`.pup`), import samostatných `.puml` souborů
- Strom diagramů a složek
- Generátor PlantUML kódu pro náhled (read-only zobrazení)
- Promítání diagramů v celoobrazovkovém režimu
- Klávesové zkratky pro všechny hlavní akce

---

## rpp — Prohlížeč RPP

**Prohlížeč Registru práv a povinností.**

Univerzální komplexní nástroj pro prohlížení obsahu Registru práv a povinností bez nutnosti přihlašování do AIS působnostního.

Hlavní funkce:
- Zobrazování různých sekcí dat (datové sady i komplexní dotazy)
- Propojená data a souvislosti, které nejsou ani v AIS působnostním
- Statická URL adresa na detail entity a pohled (sdílení odkazů)
- Komplexní hledání (podle OVM i s jeho kategoriemi, podle agend apod.)
- Detailní a kompletní informace o působnosti v rámci detailu OVM
- Export do CSV, TSV, XLSX
- Přizpůsobení zobrazení tabulek a filtrování
- Správa dat (vlastní administrátorská sekce)

---

## spisplanedit — Editor spisového plánu

**Tvorba, úprava a verzování spisového plánu podle zákona 499/2004.**

Komplexní nástroj pro práci se spisovým plánem v elektronické podobě (povinný pro každého původce). Podporuje plnohodnotný import a export v závazném XML formátu pro ESSL (NSESSS).

Hlavní funkce:
- Správa projektu (nad původcem se spravují všechny verze SP)
- Správa verzí SP se stavem, sledováním změn a projednání
- Správa věcných skupin, jejich podrobností dle NSESSS/XSD, metadat a hierarchie
- Skládaný složený znak s automatickým generováním z rodičů a kontrolou duplicit
- Bezpečnostní kategorie podle NZKB
- Vizuální rozlišení (text i barva) věcné skupiny v hierarchii a nejnižší úrovně
- Výpis podřízených skartačních režimů a lhůt
- Věcné skupiny pro typové spisy a součásti ve správné hierarchii
- Autorské interní poznámky (volitelně se zobrazují v sestavě pro projednání)
- Import a export XML (NSESSS), uložení JSON projektu
- Přehledná barevná sestava pro tisk se zvýrazněním navrhovaných změn
- Generování JSON podle budoucí OFN pro SP jako otevřená data (2027)

---

## stor — DMS úložiště

**Webové DMS (Document Management System) úložiště.**

Webové úložiště dokumentů s drobečkovou navigací a hierarchickou strukturou složek. Slouží jako lehký dokumentový management v prohlížeči.

---

## tineditor — TIN Editor (Target Instruction Notation)

**Editor TIN — JSON formátu pro popis pokynů pro AI modely.**

Webový editor pro TIN (Target Instruction Notation) verze 1.0 — formát, který v jednom souboru popisuje, co má AI model pro danou roli dělat, co dělat nemá, s jakými materiály má pracovat a jak má vypadat výstup.

Hlavní funkce:
- Editace metadat (ID, název, jazyk, verze, účel)
- Sekce pro pokyny, pravidla, zákazy a oblasti mimo záběr
- Materiály a jejich kontext
- Definice požadovaného výstupu
- Odkazy na související TINy (kompozice)
- Volný objekt `extensions` pro rozšíření
- Import a export JSON, validace proti JSON Schema (draft 2020-12)

Soubory ve složce: `tin-schema.json`, `tin-spec-cs.md`, `tin-spec.md`.

---

## ttsedit — TTS Editor (ElevenLabs Proof Reader)

**Editor pro generování řeči přes ElevenLabs (TTS).**

Webový nástroj pro tvorbu mluveného slova s rozdělením textu na chunky, generování jednotlivých částí, hromadné generování a export do MP3/WAV (jednotlivě nebo spojené).

Hlavní funkce:
- Rozdělení textu na chunky (samostatně zpracovatelné segmenty)
- Generování a přehrávání jednotlivých chunků i celého projektu
- Mazání audia, export celého projektu do JSON
- Import projektu z JSON
- Hromadné stahování všech MP3 v ZIP
- Spojení a stažení v WAV nebo MP3
- Nastavení API klíče ElevenLabs (uložen jen lokálně)

---

## wavecz — Audit přístupnosti webu

**Audit přístupnosti webu pomocí WAVE API od WebAIM.**

Webová aplikace pro profesionální evaluaci přístupnosti stránek po aplikaci CSS a JavaScriptu. Pracuje s WAVE API od WebAIM (100 testů zdarma, dále cca 0,025 USD/test).

Hlavní funkce:
- Vyhodnocení přístupnosti libovolné veřejné stránky
- API klíč se ukládá pouze v `localStorage` (nikam neodchází)
- Detailní popis nálezů včetně zdůvodnění (proč), návrhu opravy (fix) a odkazu na WCAG kritéria
- Pokrytí běžných problémů (např. prázdné nadpisy, chybějící `<h1>`, kontrast, ARIA, …)

---

## Společné vlastnosti všech nástrojů

- **Webové aplikace** běžící přímo v prohlížeči, většinou jako jediný HTML soubor.
- **Bez serveru a bez instalace** — funguje i offline (po stažení HTML souboru).
- **Open source** — celý kód je veřejný v tomto repozitáři (`egdilna/nastroje`); některé nástroje mají i vlastní samostatné repozitáře (např. ArchiMate editor, RPP prohlížeč, JSONDB editor).
- **Lokální data** — data zůstávají v prohlížeči uživatele (localStorage) nebo v souborech, které si uživatel sám stahuje a nahrává. Žádná telemetrie.
- **Volitelná integrace s GitHub/GIT** u většiny nástrojů — možnost načítat a ukládat data v GIT repozitáři, včetně privátních (přes uživatelův API klíč, který zůstává v prohlížeči).
- **Důraz na přístupnost** — semantické HTML, ARIA atributy, plná ovladatelnost klávesnicí, podpora odečítačů obrazovky.
- **Vícejazyčné rozhraní** (CS/EN) u většiny nástrojů.
