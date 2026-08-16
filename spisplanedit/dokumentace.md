# Editor spisového plánu — tvorba, návrh a verzování spisového plánu dle zákona 499/2004 a NSESSS

**Online verze nástroje:** [https://egdilna.github.io/nastroje/spisplanedit](https://egdilna.github.io/nastroje/spisplanedit)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#spisplanedit](https://egdilna.github.io/nastroje/#spisplanedit)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Editor spisového plánu** je přístupná webová aplikace pro tvorbu, návrh, úpravu a projednávání spisového a skartačního plánu organizace v souladu se zákonem č. 499/2004 Sb. o archivnictví a spisové službě a národním standardem pro elektronické systémy spisové služby (NSESSS verze 4.0). Vše běží v jednom HTML souboru — žádný server, žádná instalace, data se ukládají do souborů v počítači uživatele.

### Klíčové funkce

- **Hierarchie věcných skupin a součástí** — strom s neomezenou hloubkou zanoření, věcné skupiny mohou obsahovat další věcné skupiny i typové součásti (typové spisy)
- **Skartační režim** — skartační znak (A/S/V), skartační lhůta v letech, spouštěcí událost (po uzavření, po vyřízení, konec roku vzniku), trvalý skartační souhlas
- **Složené spisové znaky** — automatický výpočet plně určeného spisového znaku z jednoduchých znaků a pozice ve stromu
- **Bezpečnostní kategorie** — bezpečnostní úroveň věcné skupiny (veřejná, omezená, důvěrná, tajné) odpovídající požadavkům NZKB
- **Typové spisy a součásti** — označení věcné skupiny jako určené pro typové spisy, výslovný typ položky „Součást" (typová součást)
- **Verzování plánu** — snapshoty obsahující kompletní strukturu a metadata, možnost obnovení dřívější verze i exportu XML konkrétní verze
- **Soupis změn** — automatická evidence změn ve věcných skupinách (přidání, úprava, odstranění, změna metadat) s filtrováním podle typu
- **Označení změny pro projednávání** — ruční označení položky jako Nové / Změněné / Navržené ke zrušení, zvýrazněné v tiskové sestavě
- **Tisková sestava** — strukturovaný spisový a skartační plán ve formátu vhodném pro projednání, schválení a tisk do PDF, s možností zvýraznění změn a začlenění poznámek
- **Import XML (NSESSS v4)** — načtení existujícího spisového plánu z XML souboru dle národního standardu
- **Export XML (NSESSS v4)** — uložení plánu jako platné XML pro nahrání do ESSL
- **Import/Export projektu (JSON)** — kompletní záloha pracovního stavu včetně poznámek, změn a verzí
- **Autorské poznámky** — globální poznámky k návrhu i poznámky k jednotlivým položkám, s typem (informace, upozornění, k dořešení, ke schválení)

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML prvky, ARIA atributy (`role`, `aria-current`, `aria-expanded`, `aria-controls`, `aria-live`), plná ovladatelnost klávesnicí, kompatibilita se čtečkami obrazovky. Strom je realizován jako přístupná navigace pomocí `<ul>` / `<li>` / `<a>` s rozbalovacími tlačítky.

### Uložení dat

Nástroj **neukládá data do prohlížeče** — projekt existuje pouze v paměti běžící aplikace. Pro zachování práce je nutné projekt uložit jako JSON soubor tlačítkem **💾 Uložit projekt** nebo exportovat jako XML. Data se nikam neodesílají.

---

## Rozložení aplikace

Aplikace se skládá ze čtyř hlavních oblastí:

### Záhlaví

Modré záhlaví obsahuje název nástroje, podtitulek s aktuálně vybranou položkou a tlačítka hlavních akcí:

- **➕ Nový projekt** — otevře dialog pro vytvoření nového spisového plánu
- **📂 Načíst projekt** — načte dříve uložený JSON projekt
- **💾 Uložit projekt** — uloží aktuální stav jako JSON soubor
- **📥 Import XML** — importuje spisový plán z XML souboru (NSESSS v4)
- **📤 Export XML** — vygeneruje a stáhne XML soubor (NSESSS v4)

### Postranní panel (Strom spisového plánu)

Postranní panel zobrazuje hierarchický strom všech věcných skupin a součástí projektu. V hlavičce panelu jsou:

- **🔍 Hledat…** — fulltextový filtr stromu podle názvu, jednoduchého i plně určeného spisového znaku; při hledání se strom automaticky rozbalí
- **⊞ Rozbalit vše** — rozbalí celý strom
- **⊟ Sbalit vše** — sbalí celý strom
- **➕ Přidat věcnou skupinu** — vytvoří novou věcnou skupinu na nejvyšší úrovni (aktivní teprve po vytvoření / načtení projektu)

Každý uzel stromu obsahuje:
- Ikonu (📂/📁 pro věcnou skupinu, 📄 pro součást)
- Jednoduchý spisový znak (monotypicky, šedý)
- Název položky
- Odznak se stavem změny (✦ nové, + přidáno, ~ změněno, − odstraněno)

Šířka panelu se dá přetáhnout dělící příčkou (lze ovládat i klávesnicí — šipky doleva/doprava).

### Hlavní obsah s panely

Hlavní obsah obsahuje šest přepínatelných panelů:

| Panel | Obsah |
|-------|-------|
| 📝 Detail položky | Formulář pro úpravu vybrané věcné skupiny / součásti |
| 🏛️ Metada plánu | Metadata celého spisového plánu |
| 🔄 Soupis změn | Chronologický seznam všech provedených změn |
| 📌 Poznámky | Autorské poznámky (globální i k položkám) |
| 📚 Verze | Historie uložených verzí plánu |
| 🖨️ Tisková sestava | Náhled spisového a skartačního plánu pro tisk a PDF |

### Stavový řádek

Spodní stavový řádek zobrazuje název projektu, aktuální verzi, počet položek, počet evidovaných změn a krátké informační hlášky (např. po uložení).

---

## Projekt a původce

### Vytvoření nového projektu

Tlačítko **➕ Nový projekt** otevře dialog s těmito údaji:

| Pole | Popis |
|------|-------|
| Název plánu (povinné) | Oficiální název spisového a skartačního plánu |
| Identifikátor | Identifikátor plánu (např. `SP-2024-001`); při ponechání prázdného se vygeneruje automaticky |
| Vydavatel (organizace) | Název organizace, která plán vydává |
| IČO vydavatele | Identifikační číslo organizace (8 znaků) |
| Platnost od | Datum počátku platnosti plánu (přednastaveno na dnešek) |
| Komentář | Volný popis, účel a poznámky |
| Autor / zpracovatel | Jméno osoby, která plán zpracovává |

Po potvrzení se vytvoří prázdný projekt a aktivují se tlačítka pro přidávání věcných skupin.

### Panel „Metada plánu"

Panel zobrazuje a umožňuje upravit veškerá metadata projektu rozdělená do čtyř karet:

**📋 Základní údaje:** název plánu, identifikátor, XML ID (atribut `SpisovyPlan/@ID`), komentář.

**🏛️ Vydavatel:** název organizace a IČO.

**📅 Platnost:** datum platnost od, platnost do, jméno zpracovatele.

**ℹ️ Informace o projektu:** datum vytvoření, poslední změny, počet položek, počet verzí, počet evidovaných změn, verze NSESSS schématu, se kterým nástroj pracuje (4.0).

Všechna pole se ukládají okamžitě při změně a každá změna se zapíše do soupisu změn jako typ **Metadata**.

---

## Verze spisového plánu

Verze umožňují zachycovat mezistavy při přípravě nové revize spisového plánu a archivovat historicky platné verze.

### Uložení verze

Tlačítko **📌 Uložit verzi** v panelu **📚 Verze** otevře dialog s těmito poli:

| Pole | Popis |
|------|-------|
| Číslo verze | Identifikátor verze (např. `2.0`, `2024-04`); předvyplněno pořadovým číslem |
| Popis změn | Stručný popis toho, co se v dané verzi změnilo |
| Autor | Jméno osoby, která verzi ukládá |
| Stav | Návrh / K schválení / Schváleno / Platné / Archivováno |

Uložená verze obsahuje kompletní snapshot struktury položek a metadat plánu k danému okamžiku.

### Historie verzí

Seznam uložených verzí zobrazuje pro každou verzi číslo, stav (s ikonou: 📝 Návrh, 🔖 K schválení, ✅ Schváleno, 🟢 Platné, 📦 Archivováno), popis, autora, datum a počet evidovaných změn v okamžiku uložení.

Akce u každé verze:

- **↩️ Obnovit** — přepíše aktuální stav položek a metadat snapshotem z verze (s potvrzením)
- **📤 XML** — vyexportuje XML soubor vygenerovaný z dat dané verze
- **✕ Smazat** — odstraní verzi z historie (s potvrzením)

---

## Věcné skupiny a součásti

Spisový plán je tvořen hierarchií dvou typů položek:

- **📁 Věcná skupina (VecnaSkupina)** — uzel hierarchie reprezentující věcný okruh agend; může obsahovat další věcné skupiny nebo součásti
- **📄 Součást (Soucast)** — typová součást (typový spis) jako koncová položka; již nemá další podpoložky

Nástroj automaticky rozlišuje mezi **nadřazenou věcnou skupinou** (má potomky) a **listovou věcnou skupinou** — skartační režim se vyplňuje pouze u listových položek a u součástí. U nadřazených věcných skupin se v detailu zobrazuje **přehled skartačních znaků a lhůt souhrnně z potomků**.

### Přidání položky

Položky se přidávají z lišty nad detailem nebo přímo z formuláře:

- **➕ Přidat věcnou skupinu** (v postranním panelu) — nová věcná skupina na nejvyšší úrovni
- **➕ Přidat podpoložku** — přidá potomka pod vybranou položku
- **➕ Přidat na stejnou úroveň** — přidá sourozence vedle vybrané položky

Dialog **Nová položka** obsahuje:

| Pole | Popis |
|------|-------|
| Typ položky | Věcná skupina nebo Součást |
| Spisový znak (povinné) | Jednoduchý znak, např. `1`, `1.1`, `A-01` |
| Název (povinné) | Název věcné skupiny nebo součásti |
| Datum otevření | Předvyplněno datem otevření rodiče nebo platností projektu |
| Původ | Vlastní / Převzatý / Jiný |
| Skartační znak | A / S / V (předvyplněno S) |
| Skartační lhůta | Roky (předvyplněno 5) |
| Spouštěcí událost | Po uzavření / Po vyřízení / Konec roku vzniku |

Nově přidaná položka dostane automaticky stav **✦ Nové** pro účely soupisu změn.

### Pohyb v hierarchii

Nad detailem položky je nástrojová lišta s tlačítky pro přesouvání:

- **▲ Nahoru** / **▼ Dolů** — změna pořadí mezi sourozenci
- **← Vyčlenit** — posun o úroveň výš (z potomka udělá sourozence rodiče)
- **→ Vložit** — vnoření jako potomek předchozího sourozence (věcnou skupinu nelze vložit pod součást)

Každý přesun se zaznamenává do soupisu změn a automaticky se přepočítá plně určený spisový znak.

### Odstranění položky

Tlačítko **🗑️ Odstranit** smaže vybranou položku včetně všech podpoložek (s potvrzením, pokud má potomky).

### Metadata věcné skupiny / součásti

Detail položky je rozdělen do několika karet:

**📋 Základní identifikace**

| Pole | Popis |
|------|-------|
| Typ entity | Věcná skupina (nadřazená) / Věcná skupina (nejnižší úroveň) / Součást |
| Jednoduchý spisový znak (povinné) | Znak na úrovni rodiče, např. `1`, `A`, `01-02` |
| Plný znak (výpočet) | Automaticky složený z prefixu rodiče a jednoduchého znaku, oddělený tečkami |
| Název (povinné) | Název položky |
| Komentář / popis | Volný popisný text |
| Původ seskupení | Vlastní / Převzatý / Jiný |
| XML ID | Jedinečný identifikátor v XML dokumentu (atribut `@ID`) |

**🗂️ Skartační režim** (jen u listových věcných skupin a součástí)

| Pole | Popis |
|------|-------|
| Skartační znak | A – Archiv (trvalá uchování) / S – Stoupa (skartace) / V – Výběr (archivní výběr) |
| Skartační lhůta (roky) | Číslo 0–999 |
| Spuštění skartace | Po uzavření / Po vyřízení / Konec roku vzniku |
| Trvalý skartační souhlas | Zaškrtnutí (vydáno příslušným archivem, NSESSS 3.1.2) |

U nadřazené věcné skupiny se místo formuláře zobrazí přehled skartačních znaků a lhůt sebraných ze všech listových potomků.

**📅 Manipulace (časové údaje)**

| Pole | Popis |
|------|-------|
| Datum otevření (povinné) | Datum, od kterého platí nová věcná skupina |
| Datum uzavření | Vyplňuje se při uzavření; po tomto datu nelze zakládat dceřiné entity |

**⚙️ Rozšířené vlastnosti**

| Pole | Popis |
|------|-------|
| Bezpečnostní úroveň | Veřejná / Omezená / Důvěrná / Tajné (odpovídá kategorizaci dle zákona o ochraně utajovaných informací a NZKB) |
| Způsob vedení (č. jednacího) | Vlastní / Převzaté |
| Určeno pro typové spisy | Zaškrtnutí (jen u věcné skupiny, NSESSS 3.1.2) |

**📌 Poznámky k položce**

Karta obsahuje seznam autorských poznámek navázaných na položku s tlačítkem pro přidání nové poznámky. Každá poznámka má autora, datum, typ (ℹ️ informace, ⚠️ upozornění, ✅ k dořešení, 🔖 ke schválení) a vlastní text.

**🏷️ Stav změny**

Ruční označení položky pro účely soupisu změn a tiskové sestavy:

| Stav | Použití |
|------|---------|
| (beze změny) | Standardní stav |
| ✦ Nové | Nově přidáno do plánu (nastavuje se automaticky při vytvoření) |
| ~ Změněno | Položka byla upravena |
| − Navrženo ke zrušení | Navrženo k vyřazení v nové revizi |

Označení se promítá do stromu (barevný odznak) i do tiskové sestavy.

---

## Skartační režimy a lhůty

Skartační režim určuje osud dokumentů po uplynutí skartační lhůty. Plně se konfiguruje na **listových položkách** (věcné skupiny bez potomků a součásti).

| Znak | Význam |
|------|--------|
| **A** | Archiv — dokumenty mají trvalou archivní hodnotu, předávají se příslušnému archivu |
| **S** | Stoupa — dokumenty se po uplynutí lhůty fyzicky/elektronicky skartují |
| **V** | Výběr — o osudu rozhoduje archivní výběr, dokumenty se předkládají archivu k posouzení |

**Skartační lhůta** se zadává v celých letech (0–999).

**Spouštěcí událost** určuje, od jakého okamžiku se lhůta začíná počítat:
- **Po uzavření** — od uzavření spisu
- **Po vyřízení** — od vyřízení dokumentu
- **Konec roku vzniku** — od 31. prosince roku, v němž dokument vznikl

**Trvalý skartační souhlas** se zaškrtává, pokud již byl příslušným archivem udělen předběžný souhlas se skartací — odpovídá poli NSESSS 3.1.2.

V tiskové sestavě se ve sloupci „Skart." zobrazuje kombinace znaku a lhůty (např. `A10`, `S5`, `V5`). U nadřazené věcné skupiny se zobrazí přehledový výčet z potomků.

---

## Typové spisy a součásti

Pro typové spisy nástroj poskytuje dvě úrovně podpory:

1. **Příznak „Určeno pro typové spisy"** na věcné skupině (NSESSS 3.1.2) — označuje skupinu, ve které se vede typový spis. Pole je přístupné jen u věcných skupin.
2. **Typ položky „Součást" (PlanSoucast)** — samostatná typová součást zařazená přímo do hierarchie. V XML exportu se serializuje jako element `<PlanSoucast>` (oproti `<PlanVecnaSkupina>` pro věcnou skupinu).

Součást je vždy listová položka (skartační režim se u ní vyplňuje povinně). Pohyb a editace probíhá stejně jako u věcných skupin, jen s omezením, že věcnou skupinu nelze vnořit pod součást.

---

## Sestavy a projednávání

Panel **🖨️ Tisková sestava** generuje strukturovaný náhled spisového a skartačního plánu vhodný pro projednání, schválení, tisk i export do PDF.

### Obsah sestavy

- **Záhlaví** s názvem plánu, vydavatelem, IČO, datem platnosti, aktuální verzí a stavem, datem vygenerování a komentářem plánu
- **Soupis změn** (volitelné) — výběr posledních 50 záznamů typů Přidáno / Odstraněno / Změněno
- **Tabulka spisového a skartačního plánu** se sloupci: Spisový znak, Název věcné skupiny / součásti, Typ, Skart. (znak + lhůta), Datum otevření, případně Změna
- **Legenda** ke zkratkám skartačních znaků a označení nejnižší úrovně

### Volby tiskové sestavy

V liště nad sestavou jsou tři přepínače:

| Volba | Význam |
|-------|--------|
| Zvýraznit změny | Přidá sloupec „Změna" a obarví řádky podle stavu změny (zeleně přidané, žlutě změněné, červeně zrušené) |
| Zahrnout poznámky | Pod každou položku s poznámkami přidá řádek s textem poznámek |
| Jen změněné | Zobrazí pouze položky s nastaveným stavem změny (filtruje nezměněné) |

### Tisk a PDF

Tlačítko **🖨️ Tisk / PDF** otevře nativní tiskový dialog prohlížeče. Pro uložení sestavy jako PDF zvolte v tiskovém dialogu tiskárnu „Uložit jako PDF". Při tisku se automaticky skryje záhlaví aplikace, postranní panel, lišty a stavový řádek.

### Soupis změn

Panel **🔄 Soupis změn** zobrazuje kompletní chronologický log všech akcí provedených v projektu. Každý záznam má typ (Přidáno, Odstraněno, Změněno, Metadata), popis a časové razítko.

Lišta nabízí:

- **🗑️ Vymazat log** — vymaže celý soupis změn (s potvrzením)
- **Filtr** — zobrazí jen vybraný typ záznamů
- **📄 Exportovat soupis** — uloží soupis změn jako textový soubor `soupis-zmen.txt`

---

## Import a export

### Import XML (NSESSS v4)

Tlačítko **📥 Import XML** v záhlaví otevře dialog pro výběr XML souboru. Nástroj očekává kořenový element `<SpisovyPlan>` v jmenném prostoru `http://www.mvcr.cz/nsesss/v4`.

Importer rozpoznává:
- `Identifikator`, `Nazev`, `Komentar` — základní metadata plánu
- `Vydavatel/Nazev`, `Vydavatel/ICO` — údaje vydavatele
- `Manipulace/DatumOtevreni` — platnost plánu
- `PlanVecnaSkupina` a `PlanSoucast` jako vnořené elementy
- Z `EvidencniUdaje` čte: `Trideni/JednoduchySpisovyZnak`, `Nazev`, `Komentar`, `Vyrazovani/SkartacniZnak` (s atributy `hodnota` a `lhuta`), `Manipulace/DatumOtevreni`, `Manipulace/DatumUzavreni`, `ZpusobVedeni`, `TrvalySkartacniSouhlas`, `UrcenoProTypoveSpisy`
- Atribut `@ID` na elementech pro zachování XML identifikátorů

Importované položky nemají nastavený stav změny (předpokládá se převzetí existujícího platného plánu).

### Export XML (NSESSS v4)

Tlačítko **📤 Export XML** v záhlaví vygeneruje XML soubor odpovídající schématu NSESSS verze 4.0 (`http://www.mvcr.cz/nsesss/v4`).

Struktura exportu:

```
<SpisovyPlan xmlns="http://www.mvcr.cz/nsesss/v4" ID="…">
  <Identifikator>…</Identifikator>
  <Nazev>…</Nazev>
  <Komentar>…</Komentar>
  <Manipulace>
    <DatumOtevreni>…</DatumOtevreni>
    <DatumUzavreni>…</DatumUzavreni>
  </Manipulace>
  <Vydavatel>
    <Nazev>…</Nazev>
    <ICO>…</ICO>
  </Vydavatel>
  <PlanVecnaSkupina ID="…">
    <EvidencniUdaje>
      <Identifikator>…</Identifikator>
      <Nazev>…</Nazev>
      <Komentar>…</Komentar>
      <Puvod>vlastni</Puvod>
      <Trideni>
        <JednoduchySpisovyZnak>…</JednoduchySpisovyZnak>
        <PlneUrcenySpisovyZnak>…</PlneUrcenySpisovyZnak>
      </Trideni>
      <Vyrazovani>
        <SkartacniZnak hodnota="S" lhuta="5"/>
        <SpusteniSkartace>…</SpusteniSkartace>
      </Vyrazovani>
      <Manipulace>
        <DatumOtevreni>…</DatumOtevreni>
        <DatumUzavreni>…</DatumUzavreni>
      </Manipulace>
      <ZpusobVedeni>…</ZpusobVedeni>
      <TrvalySkartacniSouhlas>true</TrvalySkartacniSouhlas>
      <UrcenoProTypoveSpisy>true</UrcenoProTypoveSpisy>
    </EvidencniUdaje>
    <PlanVecnaSkupina ID="…">…</PlanVecnaSkupina>
    <PlanSoucast ID="…">…</PlanSoucast>
  </PlanVecnaSkupina>
</SpisovyPlan>
```

Element `<Vyrazovani>` se serializuje jen s vyplněnými skartačními hodnotami u listových položek; u nadřazených věcných skupin zůstává prázdný. Také lze exportovat XML konkrétní uložené verze z panelu **📚 Verze** tlačítkem **📤 XML** u dané verze.

### Uložení a načtení projektu (JSON)

Tlačítka **💾 Uložit projekt** a **📂 Načíst projekt** pracují s plnohodnotným JSON souborem, který obsahuje:

- Verzi formátu (`formatVersion`) a verzi cílového NSESSS schématu (`nsesssVersion`)
- Časová razítka (`createdAt`, `updatedAt`)
- Metadata plánu (`meta`)
- Celý strom položek (`items`) s metadaty, skartačními údaji a vnořenými potomky
- Soupis změn (`changelog`)
- Globální poznámky (`notes`)
- Historii verzí se snapshoty (`versions`)

JSON je vhodný jako pracovní záloha včetně všech autorských poznámek a historie změn. XML naopak slouží pro výměnu s ESSL.

### Generování JSON dle budoucí OFN

Datový model nástroje (JSON struktura) je navržen tak, aby umožňoval budoucí převod do otevřené formální normy pro spisové plány. Pole odpovídají termínům NSESSS a strom položek lze přímo serializovat do plánovaného JSON-LD formátu.

---

## Autorské poznámky

Autorské poznámky jsou interní záznamy projektu — **nevkládají se do XML exportu**. Slouží pro komunikaci v týmu zpracovatelů a pro evidenci připomínek během projednávání.

### Typy poznámek

| Typ | Použití |
|-----|---------|
| ℹ️ Informace | Doplňující informace, vysvětlení |
| ⚠️ Upozornění | Upozornění na problém nebo riziko |
| ✅ K dořešení | Otevřená otázka nebo úkol |
| 🔖 Ke schválení | Bod k formálnímu schválení |

### Globální poznámky a poznámky k položkám

- **Globální poznámka** se vytváří tlačítkem **➕ Přidat poznámku** v panelu **📌 Poznámky** — patří k celému návrhu plánu
- **Poznámka k položce** se vytváří tlačítkem **📌 Přidat poznámku** v liště detailu nebo na kartě „Poznámky k položce" v detailu — patří k vybrané věcné skupině či součásti

Při vytváření poznámky se zadává autor, text a typ. U poznámek k položce dialog zobrazuje, ke které položce poznámka patří.

### Přehled poznámek

Panel **📌 Poznámky** zobrazuje všechny poznámky projektu seřazené od nejnovějších. Filtr nabízí volby **Vše / Globální / K položkám**. U každé poznámky je vidět autor, datum, typ a u poznámek k položce též spisový znak a název položky.

### Poznámky v tiskové sestavě

Při zaškrtnutí volby **Zahrnout poznámky** v tiskové sestavě se pod každou položku s poznámkami přidá žlutý řádek s textem všech poznámek k dané položce — jako podklad pro projednání.

---

## Klávesové zkratky

| Zkratka | Akce |
|---------|------|
| `Ctrl+N` | Nový projekt |
| `Ctrl+O` | Načíst projekt z JSON |
| `Ctrl+S` | Uložit projekt do JSON |
| `Ctrl+E` | Exportovat XML |
| `Esc` | Zavřít otevřený dialog |
| `↑` / `↓` | Navigace ve stromu (přes nativní fokus odkazů) |
| `Enter` | Výběr položky |
| `←` / `→` | Změna šířky postranního panelu (při fokusu na příčce) |

Strom je plně přístupný klávesnicí: tlačítka rozbalit/sbalit i odkazy položek lze procházet tabulátorem, rozbalovací stav má `aria-expanded`, vybraná položka má `aria-current="page"`.

---

## Technické informace

### Uložení dat

Nástroj **nepoužívá localStorage** ani jiné lokální úložiště prohlížeče — projekt existuje pouze v paměti běžící stránky. Pro zachování práce mezi spuštěními aplikace je nutné projekt uložit jako JSON soubor (`💾 Uložit projekt`) nebo exportovat jako XML. Data se nikam neodesílají.

### Struktura JSON projektu

```
{
  "formatVersion": 1,
  "nsesssVersion": "4.0",
  "createdAt": "2026-05-26T…",
  "updatedAt": "2026-05-26T…",
  "meta": {
    "identifikator": "SP-…",
    "nazev": "…",
    "komentar": "…",
    "vydavatel": { "nazev": "…", "ico": "…" },
    "platnostOd": "2026-01-01",
    "platnostDo": "",
    "autor": "…",
    "xmlId": "SP_…"
  },
  "items": [ /* strom PlanVecnaSkupina / PlanSoucast */ ],
  "changelog": [ /* záznamy změn */ ],
  "notes": [ /* globální poznámky */ ],
  "versions": [ /* uložené snapshoty */ ],
  "lastVersionNum": 0
}
```

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou ES6, DOM Parseru, File API a Blob API. Nevyžaduje připojení k internetu — celý nástroj je v jediném HTML souboru.

### NSESSS a legislativní rámec

Nástroj implementuje strukturu spisového plánu podle:
- **Zákona č. 499/2004 Sb.**, o archivnictví a spisové službě
- **Vyhlášky č. 259/2012 Sb.**, o podrobnostech výkonu spisové služby
- **Národního standardu pro elektronické systémy spisové služby (NSESSS) verze 4.0**, vydaného Ministerstvem vnitra ČR (jmenný prostor `http://www.mvcr.cz/nsesss/v4`)

### Bezpečnostní kategorie

Pole „Bezpečnostní úroveň" odpovídá zákonu č. 412/2005 Sb. o ochraně utajovaných informací (stupně Vyhrazené, Důvěrné, Tajné, Přísně tajné) a v rovině informační bezpečnosti i zákonu č. 181/2014 Sb. o kybernetické bezpečnosti (NZKB) a jeho prováděcím vyhláškám pro klasifikaci aktiv.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| Spisový plán | Závazný dokument organizace určující věcné členění a skartační režim dokumentů |
| Věcná skupina | Skupina dokumentů věcně souvisejících, základní stavební prvek spisového plánu |
| Typový spis | Spis založený na základě věcné skupiny určené pro typové spisy |
| Součást typového spisu | Vnitřně strukturovaná část typového spisu (NSESSS `PlanSoucast`) |
| Spisový znak | Identifikátor věcné skupiny v rámci spisového plánu |
| Plně určený spisový znak | Složený znak obsahující prefix všech nadřazených skupin (oddělený tečkami) |
| Skartační znak | A (archiv), S (stoupa), V (výběr) — určuje osud dokumentů po uplynutí lhůty |
| Skartační lhůta | Doba v letech, po kterou se dokument uchovává před skartací |
| Skartační režim | Kombinace skartačního znaku, lhůty a spouštěcí události |
| ESSL | Elektronický systém spisové služby |
| NSESSS | Národní standard pro elektronické systémy spisové služby (MV ČR) |
| NZKB | Národní úřad pro kybernetickou a informační bezpečnost |
| OFN | Otevřená formální norma — technické doporučení DIA pro datové sady veřejné správy ČR |

---

*Dokumentace odpovídá stavu aplikace Editor spisového plánu ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
