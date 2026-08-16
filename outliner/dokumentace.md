# Outliner — přístupný nástroj pro hierarchické dokumenty

**Online verze nástroje:** [https://egdilna.github.io/nastroje/outliner](https://egdilna.github.io/nastroje/outliner)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#outliner](https://egdilna.github.io/nastroje/#outliner)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Outliner** je přístupná webová aplikace pro tvorbu strukturovaných hierarchických dokumentů — osnov, zápisů, projektových plánů, právních textů nebo tabulek úkolů. Vše běží v jednom HTML souboru bez serveru a bez instalace.

Osnova se v hlavní ploše zobrazuje jako víceúrovňový seznam „jen ke čtení" — přesně tak, jak bude vypadat po exportu. Veškeré úpravy struktury i obsahu se provádějí přes tlačítka, klávesové zkratky a dialogová okna.

### Klíčové funkce

- **Hierarchická osnova** — libovolně hluboké zanořování řádků s vlastní poznámkou, stavem hotovo/nehotovo a libovolným počtem sloupců
- **Vlastní sloupce** — text (Markdown), číslo, datum, trvání, zaškrtávátko, pop-up seznam; každý s možností souhrnu na rodičovských řádcích (součet, min, max, průměr, stav)
- **Sloupec v nadpisu** — sloupec přesunutý nalevo od tématu se stane prefixem nadpisu (např. kód „ABC" před názvem)
- **Sémantický typ řádku** — Normální, Zvýrazněné, Důležité, Vloženo, Odstraněno, Zvýrazněno, Citace, Článek, Poznámka; promítá se do HTML/DOCX exportu i do filtrů
- **Markdown a CriticMarkup** — plný Markdown v tématu, poznámkách i textových sloupcích; sledované změny stylem CriticMarkup se ve Wordu vykreslí jako revizní značky
- **Wiki-odkazy a štítky** — `[[Název řádku]]` skočí na jiný řádek, `#štítek` filtruje osnovu
- **Zrcadla** — živá kopie řádku, která ukazuje aktuální obsah zdroje; ve výstupech se promítá na obou místech
- **Hoist (zaostření)** — dočasné omezení pohledu jen na vybranou větev s drobečkovou navigací
- **Sekce s odděleným číslováním** — libovolný řádek lze označit jako začátek číslovací sekce s vlastním schématem
- **Číslování řádků** — až 6 úrovní s vlastním formátem (arabské, římské, písmena), předponami a příponami; hierarchické i kontinuální
- **Sledované změny (CriticMarkup)** — vložení, smazání, nahrazení, zvýraznění, komentář; export do DOCX zachová revizi
- **Uložené filtry** — pokročilé podmínky nad libovolnými sloupci (`=`, `≠`, `<`, `>`, obsahuje…) kombinované logickým **A**
- **Hromadné operace** — přesun, změna sloupce, změna typu řádku, smazání pro označené řádky
- **Verze dokumentu** — pojmenované snímky celého dokumentu uložené přímo v souboru `.outline`
- **Fulltextové hledání** — v tématu, poznámkách i hodnotách sloupců
- **Statistiky** — počty řádků, hloubka, rozpad podle stavu, úrovní i typů; souhrny sloupců
- **Import a export** — nativní `.outline`, OPML, Markdown, DOCX, HTML (statické i dynamické), CSV, TSV, prostý text

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML, ARIA role a atributy, plná ovladatelnost klávesnicí, práce se čtečkami obrazovky. Osnova je vnořený seznam pro odečítač, akce se ohlašují přes `aria-live` region, přepínatelné položky nabídky se hlásí jako zaškrtávací. Klávesa **F10** skočí kdykoli do hlavní nabídky, **Shift+F10** (nebo **T**) otevře kontextovou nabídku vybraného řádku. Podporován je tmavý i světlý režim.

### Uložení dat

Nativní formát nástroje je **`.outline`** (JSON) — obsahuje kompletní stav dokumentu včetně metadat, sloupců, řádků, stylů, číslovacích schémat, uložených filtrů a verzí. Pro zpětnou kompatibilitu se otevírají i starší soubory `.mroutline`.

---

## Formát `.outline`

Soubor `.outline` je JSON s následující strukturou:

| Klíč | Význam |
|------|--------|
| `meta` | Metadata dokumentu — název, popis, autoři, klíčová slova, jazyk, verze |
| `columns` | Definice sloupců (v pořadí zleva doprava) |
| `rows` | Kořenové řádky s vnořenými potomky (pole `children`) |
| `styles` | Styly celého dokumentu, úrovní a pojmenované styly |
| `numbering` | Globální schéma číslování — 6 úrovní, oddělovač, hierarchické |
| `levelHeadingMap` | Mapování úrovní (1–6) na HTML značky (`h1`–`h6`, `p`, `li`) |
| `filters` | Uložené filtry osnovy |
| `versions` | Pojmenované snímky dokumentu (pole objektů `{id, name, timestamp, doc}`) |

### Struktura řádku

Každý řádek `rows[i]` má:

| Pole | Popis |
|------|-------|
| `id` | Interní identifikátor (řetězec `row_...`) |
| `topic` | Text tématu (Markdown + CriticMarkup) |
| `cells` | Objekt `{ colId: hodnota }` pro každý sloupec |
| `note` | Volná poznámka (Markdown) |
| `status` | Zaškrtávátko hotovo — `0` / `1` |
| `collapsed` | Zda je větev sbalená |
| `namedStyles` | Pole názvů pojmenovaných stylů aplikovaných na řádek |
| `rowType` | Sémantický typ (`normal`, `strong`, `em`, `ins`, `del`, `mark`, `blockquote`, `article`, `aside`) |
| `sectionStart` | Volitelně `true` — začátek číslovací sekce |
| `sectionNumbering` | Volitelně vlastní schéma číslování pro tuto sekci |
| `mirrorOf` | Volitelně `id` zdrojového řádku (živá kopie) |
| `children` | Pole potomků |

### Struktura sloupce

| Pole | Popis |
|------|-------|
| `id` | Identifikátor sloupce |
| `title` | Popisek sloupce |
| `type` | `markdown`, `number`, `date`, `duration`, `checkbox`, `popup` |
| `format` | Formát zobrazení (pro číslo, datum) |
| `summary` | Souhrn na rodičích (viz kapitola Sloupce) |
| `popupValues` | Pole hodnot pro pop-up seznam |
| `hidden` | Skrytý sloupec |
| `width` | Šířka (nebo `null`) |
| `isTopic` | `true` u sloupce Téma |
| `isStatus` | `true` u sloupce Stav (hotovo) |

---

## Rozložení aplikace

Aplikace má tři hlavní oblasti:

### Záhlaví

- Název dokumentu jako H1 (aktualizuje se podle metadat)
- **Hlavní nabídka** — Soubor, Úpravy, Zobrazení, Nástroje, Nápověda
- **Rychlé filtry** — pole „Filtr textu" a rozbalovací seznam stavu (Vše / Jen hotové / Jen nehotové)

### Postranní panel

Sada rozbalovacích panelů:

| Panel | Účel |
|-------|------|
| Sekce dokumentu | Vnořený seznam odkazů na řádky s přiřazeným HTML nadpisem — slouží jako obsah dokumentu |
| Sloupce | Přidávání, řazení a nastavení sloupců (šipky ← → mění pořadí) |
| Číslování řádků | Globální schéma číslování — formát, prefix, sufix, hierarchické a kontinuální přepínače pro 6 úrovní |
| Styly a úrovně | Přiřazení HTML značky (`h1`–`h6`, `p`, `li`) každé úrovni |
| Metadata dokumentu | Název, popis, autoři, klíčová slova, jazyk, verze |
| Uložené filtry | Seznam uložených filtrů; tlačítko **Upravit filtr…** |
| Ladicí výstup | Diagnostické zprávy aplikace (pro řešení potíží) |

Panely se rozbalují klasickým `<details>` prvkem. Panel lze celý skrýt volbou **Zobrazení → Skrýt panely**.

### Hlavní plocha

- **Drobečková cesta** — zobrazuje se při hoistu, kliknutím na článek přeskočíš na danou úroveň
- **Lišta hromadných operací** — objeví se po zapnutí režimu výběru
- **Osnova** — víceúrovňový seznam řádků; každý řádek má vlastní tlačítka **Upravit** a **Akce**
- **Stavový řádek** dole zobrazuje krátké informace o poslední akci

---

## Řádky a jejich úpravy

### Vytvoření a přesun

| Akce | Klávesa | Nabídka |
|------|---------|---------|
| Přidat řádek na konec dokumentu | — | Úpravy → Přidat řádek na konec |
| Přidat sourozence za vybraný | Shift+Enter | Úpravy → Přidat sourozence |
| Přidat potomka | Ctrl+Enter | Úpravy → Přidat potomka |
| Posunout nahoru | A | Úpravy → Posunout nahoru |
| Posunout dolů | D | Úpravy → Posunout dolů |
| Zanořit (odsadit) | . | Úpravy → Zanořit |
| Vynořit (předsadit) | , | Úpravy → Vynořit |
| Smazat řádek | — | Úpravy → Smazat řádek |

### Editor řádku

Klávesou **Enter** nebo tlačítkem **Upravit** se otevře dialog **Úprava řádku** — obsahuje pole pro:

- **Typ řádku** (viz níže)
- **Téma** (Markdown + CriticMarkup, wiki-odkazy a štítky)
- **Poznámka** (Markdown, víceřádková)
- **Každý sloupec** podle jeho typu (číslo, datum, trvání, zaškrtávátko, pop-up seznam nebo Markdown)
- Nastavení **pojmenovaných stylů** aplikovaných na řádek

Uložit lze klávesou **Alt+U** nebo tlačítkem **Uložit řádek**.

### Poznámka

Klávesou **M** se otevře přímo editor poznámky. Poznámka je Markdown — může obsahovat nadpisy, seznamy, odrážky, tabulky, blok kódu i CriticMarkup.

### Přepnutí hotovo

**Mezerník** přepne stav vestavěného sloupce „Stav (hotovo)". Pokud je sloupec skrytý, přepíná se přesto — souhrny to zohlední (viz níže).

### Informace o řádku

Klávesa **I** přečte kompletní shrnutí vybraného řádku odečítači: umístění v hierarchii, počet potomků, stav, typ řádku, hodnoty všech sloupců a poznámku.

### Typ řádku (sémantika)

Kromě „Normální" lze zvolit devět dalších sémantických typů — každý se v HTML a DOCX exportu obalí příslušnou značkou. Podle typu lze také **filtrovat**.

| ID | Popis | HTML značka |
|----|-------|-------------|
| `normal` | Normální | (žádná) |
| `strong` | Zvýrazněné | `<strong>` |
| `em` | Důležité | `<em>` |
| `ins` | Vloženo | `<ins>` |
| `del` | Odstraněno | `<del>` |
| `mark` | Zvýrazněno | `<mark>` |
| `blockquote` | Citace | `<blockquote>` |
| `article` | Článek | `<article>` |
| `aside` | Poznámka | `<aside>` |

První pět typů (`strong`, `em`, `ins`, `del`, `mark`) obalí jen text tématu; poslední tři obalí celý blok řádku.

### Zrcadlo řádku

Přes **Úpravy → Vytvořit zrcadlo** (nebo z kontextové nabídky) vznikne vedle původního řádku jeho živá kopie. Zrcadlo zobrazuje **aktuální** obsah zdroje — téma, poznámku, sloupce i stav. Úprava zrcadla otevře zdrojový řádek. Zrcadlo je označené odznakem a odečítač ho hlásí jako „zrcadlo". V exportech se zdrojový obsah objeví na obou místech; v postranním panelu Sekce, ve výběru cíle při hromadném přesunu, v drobečkové navigaci, filtrech, hledání i statistikách se zrcadlo chová jako by tam byl zdrojový text.

---

## Navigace v osnově

Osnova je pro odečítač semanticky vnořený seznam (`<ul>` s vnořenými `<ul>`). Pohyb po řádcích funguje jako v běžném stromovém ovládacím prvku.

| Zkratka | Akce |
|---------|------|
| ↑ / ↓ | Předchozí / další řádek — odečítač hlásí úroveň, pozici a počet podúrovní |
| → | Rozbalit větev; pokud je rozbalená, přejít na prvního potomka |
| ← | Sbalit větev; pokud je sbalená, přejít na rodiče |
| Home / End | První / poslední viditelný řádek |
| / | Skočit do osnovy (na vybraný nebo první řádek) |
| F10 | Skočit do hlavní nabídky |
| Shift+F10 nebo T | Otevřít kontextovou nabídku vybraného řádku |
| H | Hoist na vybranou větev / zrušit hoist |

### Sbalování a rozbalování

Trojúhelníček na začátku řádku sbaluje/rozbaluje větev. Přes **Zobrazení → Sbalit vše** / **Rozbalit vše** se přepnou všechny větve v aktuálním pohledu (při zapnutém hoistu jen zaostřená větev). Pokud by se sbalením vybraný řádek schoval, výběr se přesune na nejbližšího viditelného předka.

### Hoist a drobečková navigace

Klávesou **H** (nebo přes **Zobrazení → Hoist na vybranou větev**) zaostříš pohled jen na vybranou větev. Nad osnovou se objeví **drobečková cesta** „Celý dokument › … › větev"; kliknutím na kterýkoli článek přeskočíš na danou úroveň, kliknutím na „Celý dokument" hoist zrušíš.

### Kontextová nabídka řádku

Otevírá se **pravým tlačítkem myši**, klávesou **Shift+F10**, samostatnou klávesou **Menu** (ContextMenu) nebo klávesou **T**. Obsahuje:

- Úpravu řádku a poznámky, přepnutí hotového
- Přidání sourozence/potomka, posun nahoru/dolů, zanoření a vynoření
- Sbalení/rozbalení, hoist, vytvoření zrcadla, začátek sekce
- Informace o řádku a smazání
- **Podnabídku Typ řádku** — rychlá volba sémantického typu
- **Podnabídku pro každý sloupec typu pop-up** — rychlá volba hodnoty nebo její vyprázdnění
- **Vybrat řádek** (zapne režim výběru a zaškrtne řádek)
- **Vybrat celou větev** (zaškrtne řádek i všechny potomky)

Nabídka se ovládá šipkami ↑ ↓, klávesami Home/End, psaním prvního písmene, → nebo Enter otevře podnabídku, ← nebo Esc zavře.

---

## Sloupce a souhrny

### Typy sloupců a jejich formáty

| Typ | Zápis hodnoty | Formáty zobrazení |
|-----|---------------|-------------------|
| Text (Markdown) | Volný text s inline i blokovým Markdownem, CriticMarkup, wiki-odkazy, štítky | — |
| Číslo | Desetinné číslo | `9 999`, `9 999,99`, celé číslo, procenta (celá i 2 des.), měna (Kč) |
| Datum | ISO formát `YYYY-MM-DD` | Krátké (15.6.2026), Dlouhé (15. června 2026), Datum a čas, ISO |
| Trvání | Přirozený zápis (`2 h`, `2 d`, `18 h`) — hodinově | — |
| Zaškrtávátko | ANO/NE | — |
| Pop-up seznam | Jedna z předdefinovaných hodnot | Sada hodnot se nastavuje v dialogu Sloupec |

### Souhrny na rodičovských řádcích

Rodičovské řádky u sloupců počítají souhrny z listových hodnot. Volby závisí na typu sloupce:

| Typ | Dostupné souhrny |
|-----|------------------|
| Text (Markdown) | Žádný, Skrytý |
| Číslo | Žádný, Součet, Minimum, Maximum, Průměr listů, Skrytý |
| Trvání | Žádný, Celkem, Minimum, Maximum, Skrytý |
| Datum | Žádný, Nejdřívější, Nejpozdější, Skrytý |
| Zaškrtávátko | Žádný, Stav (vše / část / nic), Skrytý |
| Pop-up seznam | Žádný, Minimum, Maximum, Skrytý |

### Pořadí sloupců a „sloupec v nadpisu"

Šipky ← → v panelu Sloupce mění pořadí sloupce. Pokud sloupec posuneš **nalevo od tématu**, jeho hodnota se stane **prefixem nadpisu** (např. kód „ABC" → nadpis „ABC Úvod"). Prefix se promítá do všech exportů (DOCX, HTML, Markdown). Takový sloupec se přestane zobrazovat jako samostatný a žije jen v nadpisu.

### Vestavěný sloupec Stav

Sloupec `status` typu `checkbox` je vestavěný a hlásí hotovo/nehotovo. Přednastavený souhrn `state` zobrazuje na rodičích „vše hotovo / částečně / nic". Sloupec lze v panelu Sloupce skrýt nebo zobrazit jako každý jiný.

---

## Číslování

### Globální schéma

V panelu **Číslování řádků** nastavíš pro každou z **šesti úrovní** samostatně:

- **Formát** — `1, 2, 3`, `A, B, C`, `a, b, c`, `I, II, III`, `i, ii, iii`, nebo Bez čísla
- **Předponu** (např. `§ `, `odst. `, `písm. `, `Část `, `Článek `)
- **Příponu** (např. `.`, `)`)
- **Nečíslovat** — úroveň se z čísla úplně vynechá (potomci pokračují, např. `1 → 1.1`, ne `1.0.1`)

Dále má každá úroveň dva nezávislé přepínače:

- **Hierarchické (skládat s rodičem)** — číslo se skládá z čísel nadřazených úrovní (např. `1.1`, `1.2.a`). Když je vypnuté, úroveň má samostatné číslo, které se neskládá.
- **Kontinuální (průběžně v sekci)** — úroveň se nečísluje od 1 u každého rodiče, ale běží průběžně přes celou sekci. Typický případ: legislativní **Článek**, který pokračuje 1, 2, 3 v Části I a dál 4, 5 v Části II.

Přepínače jsou nezávislé — úroveň může být obojí.

### Předvolby

Panel nabízí čtyři přednastavené šablony:

| Předvolba | Popis |
|-----------|-------|
| **Úřední (§ 1.2)** | Klasické paragrafové číslování s odstavci, písmeny a body |
| **Osnova (I/A/1/a)** | Klasická osnova (římská, velká písmena, arabská, malá písmena) |
| **Předpis (Část/Článek)** | Legislativní číslování s Částmi a průběžně číslovanými Články |
| **Desetinné (1.1.1)** | Klasické desetinné číslování |

### Sekce s odděleným číslováním

Libovolný řádek lze označit jako **Začátek sekce** (Úpravy → Začátek sekce nebo z kontextové nabídky). Sekce běží od tohoto řádku po další začátek sekce v pořadí dokumentu a má vlastní čítače — **kontinuální číslování se na začátku každé sekce resetuje**. Přes **Číslování této sekce…** lze sekci dát vlastní schéma úrovní nezávislé na globálním; **Reset na globální** ji vrátí k výchozímu číslování. Sekce je označená odznakem a odečítač u ní hlásí „začátek sekce".

### Panel Sekce

Postranní panel **Sekce dokumentu** zobrazuje obsah dokumentu jako vnořený seznam odkazů. Vypisují se jen řádky, jejichž **úroveň je namapovaná na HTML nadpis** (`h1`–`h6`) v panelu Styly a úrovně; úrovně mapované na odstavec či položku seznamu se nevypisují (ale jejich nadpisové potomky se zařadí na správné místo).

---

## Styly a úrovně

Panel **Styly a úrovně** přiřazuje každé z 6 úrovní osnovy sémantickou HTML značku (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `li`). Tato mapa řídí:

- **Panel Sekce** (obsah dokumentu) — zobrazí jen úrovně mapované na nadpis
- **HTML export** — hlubší úrovně jsou navíc vizuálně odsazené doleva (každá úroveň o kousek víc)
- **DOCX export** — nadpisové úrovně se vyexportují jako odpovídající Word nadpisy

Pojmenované styly lze aplikovat na jednotlivý řádek přes editor řádku (pole `namedStyles`).

---

## Markdown a CriticMarkup

### Markdown

V tématu, textových sloupcích i poznámkách se vykresluje **plný Markdown**:

**Inline:** `**tučné**`, `*kurzíva*`, `` `kód` ``, `~~přeškrtnuté~~`, `[text](https://odkaz)`

**Blokové:** nadpisy `#` až `######`, odrážkové i číslované seznamy (včetně vnořených přes odsazení), citace `>`, blok kódu ohraničený `` ``` ``, vodorovná čára `---`, tabulky `| A | B |` s oddělovačem `|---|---|`

Plný Markdown se promítá i do HTML a DOCX exportu (včetně tabulek). U nadpisové úrovně se **první řádek tématu** bere jako samotný nadpis a případný další blokový obsah se vykreslí pod ním.

### CriticMarkup (sledované změny)

| Zápis | Význam | V DOCX |
|-------|--------|--------|
| `{++text++}` | Vložení | Sledované vložení |
| `{--text--}` | Smazání | Sledované smazání |
| `{~~staré~>nové~~}` | Nahrazení | Smazání + vložení |
| `{==text==}` | Zvýraznění | Žluté zvýraznění |
| `{>>text<<}` | Komentář | Komentář ve Wordu |

Při exportu lze zvolit, zda sledované změny **zůstanou jako návrhy**, nebo se rovnou **přijmou**. Funguje v Markdown buňkách i v poznámkách.

### Klávesové zkratky při psaní

V editoru tématu, poznámky i v Markdown sloupcích fungují formátovací zkratky. Obalí označený text, nebo (není-li nic označeno) vloží značky a umístí kurzor mezi ně. Každou akci odečítač ohlásí.

| Zkratka | Akce |
|---------|------|
| Ctrl+B | Tučné `**…**` |
| Ctrl+I | Kurzíva `*…*` |
| Ctrl+K | Odkaz — je-li ve schránce URL, vloží `[název](url)` a označí název; jinak `[text]()` |
| Ctrl++ | Critic vložení `{++…++}` |
| Ctrl+- | Critic odstranění `{--…--}` |
| Ctrl+. | Critic náhrada — označený text se stane původním, kurzor skočí na místo náhrady |
| Ctrl+= | Zvýraznění `{==…==}` |

### Wiki-odkazy a štítky

V textu tématu i poznámky:

- **Wiki-odkazy** `[[Název řádku]]` (volitelně `[[cíl|popisek]]`) — kliknutím skočíš na první řádek se shodným tématem; neexistující cíl je vizuálně odlišený
- **Štítky** `#štítek` (fungují i s diakritikou) jsou klikací — kliknutí nastaví filtr na daný štítek

Obojí prochází i do exportů.

---

## Filtrování a hledání

### Rychlé filtry v liště

- **Filtr textu** — hledá v tématu i poznámkách
- **Filtr podle stavu** — Vše / Jen hotové / Jen nehotové

### Pokročilé filtry

V panelu **Uložené filtry** tlačítkem **Upravit filtr…** se otevře dialog, kde skládáš podmínky nad sloupci — každý podle svého typu:

| Typ sloupce | Podmínky |
|-------------|----------|
| Text | obsahuje / přesně / neobsahuje |
| Číslo, trvání | `<`, `>`, `=`, `≠` |
| Datum | před / po / přesně |
| Zaškrtávátko | ano / ne |
| Pop-up | `=`, `≠` |
| **Typ řádku** | `=`, `≠` (výběr jednoho z sémantických typů) |

Podmínky se kombinují logickým **A** (musí platit všechny). Přepínač **Rekurzivně** určuje, zda se u vyhovujícího řádku zobrazí i jeho rodiče (jako kontext, zešednutí), nebo jen samotné vyhovující řádky.

Filtr lze **Použít** hned, nebo **Uložit** pod jménem a kdykoli později spustit. Uložené filtry se ukládají do souboru `.outline`.

### Fulltextové hledání

Přes **Nástroje → Najít…** (nebo **Ctrl+F**) prohledáš celý dokument — **téma, poznámky i hodnoty sloupců**. Výsledky se vypíšou jako seznam s úryvkem a informací, kde byl výraz nalezen; kliknutím (nebo tlačítky Předchozí/Další) skočíš na daný řádek.

---

## Režim výběru a hromadné operace

Tlačítko **Úpravy → Režim výběru** zobrazí u každého řádku zaškrtávátko. Výběr se týká **jen daného řádku**, ne jeho potomků — potomky je nutné zaškrtnout ručně. Po výběru se nahoře objeví lišta:

| Akce | Popis |
|------|-------|
| Přesunout do… | Vybere se cíl, řádky se do něj přesunou jako potomci i s vlastní hierarchií; lze i na nejvyšší úroveň |
| Změnit sloupec… | Podle typu sloupce; u data buď konkrétní datum, nebo **posun o ± dnů** přepočítaný pro každý řádek zvlášť, a také **vyprázdnění hodnoty** |
| Změnit typ… | Sémantický typ řádku |
| Smazat | Trvalé smazání vybraných řádků |
| Zrušit výběr | Vyprázdní seznam vybraných |

Kontextová nabídka řádku má i položky **Vybrat řádek** a **Vybrat celou větev**, které usnadní hromadný výběr.

---

## Verze dokumentu

### Uložit verzi

Přes **Soubor → Uložit verzi…** uložíš pojmenovaný snímek aktuálního stavu. Název se předvyplní podle poslední verze (u první je prázdný), datum a čas se doplní automaticky. Verze se ukládají **spolu s dokumentem do souboru `.outline`**, takže se přenášejí s ním.

### Verze dokumentu

Přes **Soubor → Verze dokumentu…** se otevře seznam všech verzí (nejnovější nahoře) s názvem, datem a časem a počtem řádků. U každé verze lze:

- **Zobrazit** náhled jejího obsahu
- **Vrátit se k ní** (nahradí aktuální stav — uložené verze přitom zůstanou zachovány, takže se nic neztratí)
- **Uložit jako…** samostatný soubor `.outline`
- **Přejmenovat**
- **Smazat**

Náhled i „Vrátit se k verzi" jsou dostupné i přímo z okna náhledu.

---

## Statistiky

**Nástroje → Statistiky…** otevře přehled dokumentu:

- **Celkový počet řádků**
- **Počet úrovní** (maximální hloubka)
- **Počet listů**, řádků s poznámkou, zrcadel a sekcí
- **Rozpad podle stavu** hotovo/nehotovo s procenty
- **Počty řádků podle úrovní**
- **Rozpad podle sémantických typů** s procenty
- **Pro každý sloupec** vlastní přehled:
  - u pop-up sloupců počty a procenta pro jednotlivé volby
  - u zaškrtávátek počty ano/ne
  - u čísel a trvání součet, průměr a min/max
  - u dat nejdřívější a nejpozdější

Přepínač **Počítat jen aktuálně zobrazené řádky** omezí výpočet na řádky vyhovující filtru a hoistu. Tlačítko **Zkopírovat jako text** vloží celý přehled do schránky.

---

## Import a export

### Import

Přes **Soubor → Otevřít…** nebo **Soubor → Import…** lze načíst:

| Formát | Poznámka |
|--------|----------|
| Automaticky podle souboru | Detekce podle přípony a obsahu |
| Outliner (`.outline` JSON) | Nativní formát; načtou se i starší `.mroutline` |
| OPML | Plná podpora |
| Markdown | Nadpisy `#…` a odsazené seznamy tvoří hierarchii |
| Prostý text | Hierarchii určuje odsazení (tabulátory i mezery); šířka jednoho odsazení se rozpozná automaticky |
| Tab-delimited (TSV) | První sloupec je téma, další se stanou textovými sloupci |

Přepínač **Nahradit aktuální dokument** určuje, zda se import stane novým dokumentem, nebo se přidá do stávajícího.

### Načíst ze schránky

Přes **Soubor → Načíst ze schránky** (Ctrl+Shift+O) se otevře dialog, do kterého vložíš JSON projektu.

### Export

Přes **Soubor → Export…** (Alt+E) — dialog s výběrem formátu:

| Formát | Poznámka |
|--------|----------|
| Microsoft Word (`.docx`) | CriticMarkup jako sledované změny, tabulky, nadpisy dle mapy úrovní |
| HTML | Sémantické nadpisy, hlubší úrovně vizuálně odsazené |
| Dynamické HTML | Rozbalovací `<details>` — klikatelný interaktivní výstup |
| Markdown | Plný Markdown včetně tabulek |
| OPML | Plná podpora hierarchie |
| CSV | Sloupce dokumentu jako CSV |
| Prostý text | Odsazený text |

Volba **Sledované změny přijmout** určuje, zda se CriticMarkup značky ponechají jako návrhy, nebo se rovnou aplikují.

### Uložit `.outline`

**Soubor → Uložit .outline** (Ctrl+S) uloží celý dokument v nativním formátu — včetně metadat, sloupců, řádků, číslování, stylů, filtrů a všech uložených verzí.

### Vložit do schránky

**Soubor → Vložit do schránky** (Ctrl+Shift+S) zkopíruje celý projekt jako JSON do schránky pro rychlé sdílení.

### Export podle aktuálního zobrazení

Když je osnova filtrovaná (rychlým filtrem, stavem, pokročilými podmínkami) nebo zaostřená hoistem, **export** (DOCX, HTML, Markdown, OPML, CSV, text) zahrne **jen to, co je právě vidět**. Naopak **uložení do `.outline`** a **vložení do schránky** vždy uloží celý dokument bez ohledu na filtr.

---

## Klávesové zkratky — souhrn

### Navigace v osnově

| Zkratka | Akce |
|---------|------|
| ↑ / ↓ | Pohyb mezi řádky |
| ← / → | Sbalit / rozbalit větev (nebo přejít na rodiče/potomka) |
| Home / End | První / poslední viditelný řádek |
| / | Skočit do osnovy |
| F10 | Skočit do hlavní nabídky |
| Shift+F10 nebo T | Kontextová nabídka řádku |
| Menu / ContextMenu | Kontextová nabídka řádku |

### Úpravy vybraného řádku

| Zkratka | Akce |
|---------|------|
| Enter | Otevřít editor řádku |
| Shift+Enter | Přidat sourozence (a otevřít editor) |
| Ctrl+Enter | Přidat potomka (a otevřít editor) |
| M | Upravit poznámku |
| Mezerník | Přepnout stav „hotovo" |
| A / D | Posunout řádek nahoru / dolů |
| . / , | Zanořit / vynořit |
| H | Hoist / zrušit hoist |
| I | Přečíst informace o řádku |

### Soubor a nástroje

| Zkratka | Akce |
|---------|------|
| Alt+O | Otevřít |
| Alt+S nebo Ctrl+S | Uložit `.outline` |
| Alt+E | Export |
| Ctrl+Shift+O | Načíst ze schránky |
| Ctrl+Shift+S | Vložit do schránky |
| Ctrl+F | Najít |
| Alt+U | V editoru řádku: uložit řádek |

Podle prohlížeče může být přístupová klávesa i **Alt+Shift** místo samotného Alt.

### Ovládání nabídek

Hlavní nabídka i kontextová nabídka řádku se ovládají jako běžné menu:

- **← →** přecházíš mezi nabídkami
- **↓** nebo **Enter** nabídku otevře
- **↑ ↓** mezi položkami
- **Home / End** — první / poslední položka
- Napsání písmene — skok na položku začínající tímto písmenem
- **→** nebo **Enter** otevře podnabídku
- **← nebo Esc** zavře

Přepínací položky (režim výběru, skrýt panely, tmavý režim) se odečítači hlásí jako zaškrtávací a nedostupné položky se při pohybu přeskakují.

---

## Metadata dokumentu

Panel **Metadata dokumentu** obsahuje:

| Pole | Popis |
|------|-------|
| Název | Zobrazuje se jako H1 nahoře a v `<title>` prohlížeče |
| Popis | Volný popis dokumentu |
| Autoři | Seznam autorů |
| Klíčová slova | Klíčová slova pro exporty |
| Jazyk | Kód jazyka (výchozí `cs`) |
| Verze | Textové označení verze |

---

## Nápověda v aplikaci

**Nápověda → Nápověda a klávesové zkratky** otevře dialogové okno se stručnou nápovědou přímo v aplikaci — obsahuje kompletní tabulky zkratek a popisy všech funkcí, aby byla vždy po ruce.

---

## Technické informace

### Formát souboru

Nativní formát `.outline` je běžný JSON. Otvírá se v jakémkoli textovém editoru a je snadno programově zpracovatelný. Pro zpětnou kompatibilitu se otevírají i starší soubory `.mroutline`.

### Uložení dat

Aplikace **neukládá data automaticky** na server ani do prohlížeče (kromě pomocných preferencí). Veškerá práce probíhá s otevřeným souborem — pravidelně ukládej klávesou **Ctrl+S**. Snapshoty důležitých stavů uložit jako **verze dokumentu**, které se přenášejí spolu se souborem.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). **Nevyžaduje připojení k internetu** — HTML soubor lze stáhnout a spustit lokálně. Některé prohlížeče mohou při běhu z `file://` blokovat načtení ukázkového souboru — v takovém případě je vhodnější spustit aplikaci z jednoduchého lokálního web serveru.

### Přístupnost a čtečky

- Osnova je pro odečítač semanticky vnořený seznam
- Krátká oznámení akcí jdou přes `aria-live="polite"` region
- Přepínací položky nabídky se hlásí jako zaškrtávací
- Nedostupné položky se při pohybu v nabídce přeskakují
- Aplikace nepoužívá `position: sticky` ani `position: fixed`, aby nekomplikovala odečítačům rozlišení výškových vrstev
- Aplikace nikdy nepíše do konzole prohlížeče — ladicí výpis jde do panelu **Ladicí výstup**

### Tmavý režim

Přepíná se přes **Zobrazení → Tmavý režim**. Volba se pamatuje v prohlížeči.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| Osnova | Hlavní hierarchický seznam řádků dokumentu |
| Téma | Hlavní text řádku (sloupec `topic`) |
| Sekce | Skupina řádků s vlastním číslovacím schématem, uvozená řádkem s vlastností „začátek sekce" |
| Hoist | Dočasné zaostření pohledu jen na vybranou větev; zbytek dokumentu se skryje |
| Zrcadlo | Živá kopie řádku, která zobrazuje aktuální obsah zdrojového řádku |
| Souhrn | Automaticky vypočtená hodnota sloupce na rodičovském řádku (součet, min, max, průměr, stav) |
| CriticMarkup | Sada značek pro sledované změny v prostém textu (`{++…++}`, `{--…--}` atd.) |
| Sloupec v nadpisu | Sloupec umístěný nalevo od tématu — jeho hodnota se stane prefixem nadpisu |
| Wiki-odkaz | Zápis `[[Název]]` — kliknutím se skočí na řádek s daným tématem |
| Štítek | Zápis `#štítek` v textu; kliknutím se osnova filtruje na daný štítek |
| Verze dokumentu | Pojmenovaný snímek celého dokumentu uložený uvnitř souboru `.outline` |
| OPML | Standardní XML formát pro výměnu hierarchických osnov |

---

*Dokumentace odpovídá stavu aplikace Outliner ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
