# Outliner — přístupný nástroj pro hierarchické dokumenty s tabulkou

**Online verze nástroje:** [https://egdilna.github.io/nastroje/outliner](https://egdilna.github.io/nastroje/outliner)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#outliner](https://egdilna.github.io/nastroje/#outliner)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Outliner** je přístupná webová aplikace pro tvorbu strukturovaných hierarchických dokumentů — osnov, zápisů, projektových plánů, právních předpisů, tabulek úkolů nebo revidovaných textů. Vše běží v jednom souboru HTML bez serveru, bez instalace a bez cizích knihoven.

Osnova se v hlavní ploše zobrazuje jako **víceúrovňový vnořený seznam „jen ke čtení“** — přesně tak, jak bude vypadat po exportu. Veškeré úpravy struktury i obsahu se dělají přes tlačítka, klávesové zkratky a dialogová okna, nikdy přímo v textu — což zajišťuje předvídatelné chování pro odečítač obrazovky a stabilní ukládání.

### Klíčové vlastnosti

- **Hierarchická osnova** — libovolně hluboké zanořování řádků s vlastní poznámkou, stavem hotovo/nehotovo a libovolným počtem sloupců.
- **Vlastní sloupce** — text (Markdown), číslo, datum, trvání, zaškrtávátko, pop-up seznam; každý s možností **souhrnu** na rodičovských řádcích (součet, min, max, průměr, stav).
- **Sloupec jako prefix nadpisu** — sloupec přesunutý nalevo od tématu se stane součástí nadpisu (např. kód „ABC“, druh, priorita); prefix se přenáší i do všech exportů.
- **Sémantický typ řádku** — 9 typů (Normální, Zvýrazněné, Důležité, Vloženo, Odstraněno, Zvýrazněno, Citace, Článek, Poznámka); promítá se do HTML i DOCX exportu, do filtrů i do ohlašování odečítačem.
- **Markdown a CriticMarkup** — plný blokový Markdown v tématu, poznámkách i textových sloupcích; sledované změny stylem CriticMarkup se v DOCX exportu vykreslí jako revizní značky.
- **Wiki-odkazy a štítky** — `[[Název řádku]]` skočí na jiný řádek, `#štítek` (s diakritikou) nastaví filtr.
- **Zrcadla (živé kopie)** — kopie řádku, která zobrazuje aktuální obsah zdroje; ve výstupech se promítne na obou místech.
- **Hoist (zaostření)** — dočasné omezení pohledu jen na vybranou větev s drobečkovou navigací.
- **Sekce s odděleným číslováním** — libovolný řádek lze označit jako začátek číslovací sekce s vlastním schématem.
- **Číslování řádků** — až 6 úrovní s vlastním formátem (arabské, římské, písmena), předponami a příponami; hierarchické i kontinuální, s presety (úřední § 1.2, osnova I/A/1/a, legislativní Část/Článek, desetinné).
- **Uložené filtry** — pokročilé podmínky nad libovolnými sloupci a nad typem řádku, kombinované logickým **A**, ukládané spolu s dokumentem.
- **Hromadné operace** — přesun, změna hodnoty sloupce, změna typu řádku, smazání pro označené řádky; u data i posun o počet dnů.
- **Verze dokumentu** — pojmenované snímky celého dokumentu, uložené přímo v souboru `.outline`.
- **Fulltextové hledání** — v tématu, poznámkách i hodnotách sloupců, s úryvky a skoky mezi výsledky.
- **Statistiky** — počty řádků, hloubka, rozpad podle stavu, úrovní a typů; souhrny každého sloupce.
- **Import a export** — nativní `.outline`, OPML, Markdown, DOCX (se sledovanými změnami a komentáři), HTML (statické i dynamické), CSV, TSV, prostý text.
- **Sdílení schránkou** — celý dokument lze zkopírovat do schránky jako JSON a odtud také načíst.

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML, ARIA role a atributy, plná ovladatelnost klávesnicí, práce se čtečkami obrazovky. Osnova je vnořený seznam pro odečítač, akce se ohlašují přes `aria-live` region, přepínatelné položky nabídky se hlásí jako zaškrtávací. Klávesa **F10** skočí kdykoli do hlavní nabídky, **Shift+F10** (nebo **T**) otevře kontextovou nabídku vybraného řádku. Podporován je světlý i tmavý režim (přepínatelný v nabídce Zobrazení).

### Uložení dat

Nativní formát nástroje je **`.outline`** (JSON) — obsahuje kompletní stav dokumentu včetně metadat, sloupců, řádků, stylů, číslovacích schémat, uložených filtrů a pojmenovaných verzí. Pro zpětnou kompatibilitu se otevírají i starší soubory `.mroutline`. V prohlížeči se nic neukládá; ukládat lze do souboru (Ctrl+S), přenášet přes schránku, nebo importovat/exportovat.

---

## Rozložení aplikace

Aplikace má tři hlavní oblasti nad sebou/vedle sebe (bez sticky/fixed prvků — celá plocha se rolí normálně):

### Záhlaví (app-bar)

- **Název aktuálního dokumentu** (velký, aktualizuje se podle metadat).
- **Hlavní nabídka** (menubar) s pěti nabídkami: Soubor, Úpravy, Zobrazení, Nástroje, Nápověda.
- **Filter bar** — pole pro rychlý filtr textu a filtr podle stavu (Vše / Jen hotové / Jen nehotové).

### Postranní panely (sidebar)

Skládací panely (`<details>`); lze je celé skrýt/zobrazit v nabídce Zobrazení → *Skrýt panely*:

| Panel | Obsah |
|-------|-------|
| **Sekce dokumentu** | Vnořený seznam odkazů na řádky mapované na HTML nadpisy (h1–h6). Klikem se skočí na daný řádek a rozbalí se cesta k němu. |
| **Sloupce** | Seznam sloupců s tlačítky ← → pro pořadí, Skrýt/Zobrazit, Upravit, Smazat; tlačítko *Přidat sloupec*. |
| **Číslování řádků** | Zapnutí/vypnutí, oddělovač úrovní, konfigurace šesti úrovní (formát, předpona, přípona, Hierarchické, Kontinuální) a čtyři presety. |
| **Styly a úrovně** | Mapování šesti úrovní osnovy na sémantické značky (h1–h6, p, li) pro export do HTML a DOCX. |
| **Metadata dokumentu** | Název, popis, verze, autoři, klíčová slova. |
| **Uložené filtry** | Přehled aktivních podmínek, tlačítka *Upravit filtr…* a *Zrušit podmínky*, seznam uložených filtrů s tlačítky Použít/Smazat. |
| **Ladicí výstup** | Chronologický log akcí (jen pro informaci; nikdy neteče do konzole). |

### Hlavní plocha (outline-area)

- **Drobečková navigace** (viditelná jen při aktivním hoistu): Celý dokument › … › zaostřená větev.
- **Lišta hromadných operací** (viditelná při zapnutém režimu výběru): Přesunout do…, Změnit sloupec…, Změnit typ…, Smazat, Zrušit výběr.
- **Tabulka osnovy** — hlavička sloupců a vnořený seznam řádků s ovládacími tlačítky.
- **Stavový řádek** — poslední hlášení (aktuální akce, chybové stavy).

---

## Formát `.outline`

Soubor `.outline` je JSON s následujícími kořenovými klíči:

| Klíč | Význam |
|------|--------|
| `meta` | Metadata dokumentu — `title`, `description`, `authors[]`, `keywords[]`, `language`, `version`. |
| `columns` | Definice sloupců (v pořadí zleva doprava). |
| `rows` | Kořenové řádky s vnořenými potomky (pole `children`). |
| `styles` | Styly celého dokumentu, úrovní a pojmenované styly. |
| `numbering` | Globální schéma číslování — 6 úrovní, oddělovač; přepínače hierarchické/kontinuální jsou u každé úrovně zvlášť. |
| `levelHeadingMap` | Mapování úrovní 1–6 na HTML značky (`h1`–`h6`, `p`, `li`). |
| `filters` | Uložené filtry osnovy (pole objektů `{name, conditions[], recursive, text, status}`). |
| `versions` | Pojmenované snímky dokumentu (pole objektů `{id, name, timestamp, doc}`). |

### Struktura řádku

| Pole | Popis |
|------|-------|
| `id` | Interní identifikátor (řetězec `row_...`). |
| `topic` | Text tématu (Markdown + CriticMarkup). |
| `cells` | Objekt `{ colId: hodnota }` pro každý sloupec (kromě tématu a stavu). |
| `note` | Volná poznámka (Markdown + CriticMarkup). |
| `status` | Zaškrtávátko hotovo — `0` / `1`. |
| `collapsed` | Zda je větev sbalená. |
| `namedStyles` | Pole názvů pojmenovaných stylů aplikovaných na řádek (vyhrazeno pro budoucí rozšíření). |
| `rowType` | Sémantický typ (`normal`, `strong`, `em`, `ins`, `del`, `mark`, `blockquote`, `article`, `aside`). |
| `mirrorOf` | Volitelně `id` zdrojového řádku (živá kopie). `null` u obyčejného řádku. |
| `sectionStart` | `true` u řádku, který zahajuje samostatnou číslovací sekci. |
| `sectionNumbering` | Volitelně vlastní schéma číslování pro tuto sekci (`{levels, separator}`); `null` = převzít globální. |
| `children` | Pole potomků (rekurzivní stejná struktura). |

### Struktura sloupce

| Pole | Popis |
|------|-------|
| `id` | Identifikátor sloupce. Speciální hodnoty: `topic` a `status`. |
| `title` | Popisek sloupce (zobrazený v hlavičce). |
| `type` | Typ hodnoty: `markdown`, `number`, `date`, `duration`, `checkbox`, `popup`. |
| `format` | Formát zobrazení (pro číslo a datum). |
| `summary` | Souhrn počítaný na rodičovských řádcích (viz níže). |
| `popupValues` | Pole hodnot pro pop-up seznam. |
| `hidden` | Skrytý sloupec (nezobrazí se, hodnoty se zachovávají). |
| `width` | Šířka (nebo `null` pro auto). |
| `isTopic` | `true` u sloupce Téma (jen jeden). |
| `isStatus` | `true` u vestavěného sloupce Stav (hotovo). |

### Struktura úrovně číslování

| Pole | Popis |
|------|-------|
| `format` | `decimal`, `upper-alpha`, `lower-alpha`, `upper-roman`, `lower-roman`, `none`. |
| `prefix` | Text před číslem (např. `§ `, `Část `). |
| `suffix` | Text za číslem (např. `.`, `)`). |
| `numbered` | Když `false`, úroveň se přeskočí (potomci pokračují bez ní). |
| `hierarchical` | `true` = číslo se skládá s rodičem (1.1); `false` = úroveň běží samostatně. |
| `continuous` | `true` = úroveň se počítá průběžně přes celou sekci, ne po sourozencích. |

---

## Navigace

Osnova je jeden „stromový“ ovládací prvek: v seznamu je vždy tabulátorem dosažitelný **jediný vstupní bod** (vybraný řádek). Uvnitř se pohybujete šipkami — přesně tak, jak očekává odečítač obrazovky.

### Klávesnice v osnově

| Klávesa | Akce |
|---------|------|
| `↑` / `↓` | Přejít na předchozí / další viditelný řádek. Odečítač ohlásí úroveň, pozici a podúrovně. |
| `→` | Rozbalit větev (u sbalené); jinak přejít na prvního potomka. |
| `←` | Sbalit větev (u rozbalené); jinak přejít na rodiče. |
| `Home` / `End` | První / poslední viditelný řádek. |
| `/` | Skočit do osnovy z libovolného pole (mimo dialog a mimo aktivní psaní). |
| `F10` | Skočit do hlavní nabídky. |
| `Shift+F10` nebo `T` | Otevřít kontextovou nabídku vybraného řádku. |
| `Menu` / `ContextMenu` | Otevřít kontextovou nabídku vybraného řádku. |
| `I` | Přečíst kompletní informace o řádku (odečítač: stav, číslo, prefixy, téma, pozice, sloupce, poznámka). |

### Hoist (zaostření)

- Klávesou `H` nebo přes *Zobrazení → Hoist na vybranou větev* pohled se omezí jen na vybraný řádek a jeho potomky.
- Nad osnovou se objeví **drobečková navigace** „Celý dokument › … › větev“; kliknutím na kterýkoli článek se skočí na danou úroveň, kliknutím na „Celý dokument“ se hoist zruší.
- Opětovné stisknutí `H` nebo tlačítko *Zrušit hoist* se vrátí na celý dokument.

### Wiki-odkazy a štítky

- `[[Název řádku]]` — kliknutí (nebo Enter na odkazu) skočí na první řádek se shodným tématem. Neexistující cíl je vizuálně odlišený.
- `[[cíl|popisek]]` — varianta s vlastním popiskem.
- `#štítek` (i s diakritikou, může obsahovat `-`, `_`, `/`) — klikací; klik nastaví filtr textu na daný štítek.
- Obojí prochází i do exportů.

### Sekce dokumentu

Panel *Sekce dokumentu* v postranním panelu zobrazuje **vnořený seznam odkazů** na všechny řádky, jejichž úroveň je namapována na HTML nadpis (h1–h6) v panelu *Styly a úrovně*. Kliknutím se skočí na řádek a cesta k němu se rozbalí. Úrovně mapované na odstavec nebo položku seznamu se v panelu nevypisují, ale jejich nadpisové potomky se zařadí na správné místo hierarchie.

---

## Editace

Osnova samotná **needituje nic přímo v textu**. Všechny hodnoty (téma, poznámka, sloupce, stav, typ) se mění v **editoru řádku** — dialogovém okně, které vyvoláš klávesou `Enter` nebo tlačítkem *Upravit*.

### Přidávání a mazání řádků

| Klávesa / akce | Efekt |
|----------------|-------|
| `Enter` | Otevřít editor vybraného řádku. |
| `Shift+Enter` | Přidat sourozence za vybraný řádek (a otevřít editor). |
| `Ctrl+Enter` / `Cmd+Enter` | Přidat potomka pod vybraný řádek (a otevřít editor). |
| *Úpravy → Přidat řádek na konec* | Nový řádek na konec kořenové úrovně. |
| Kontextová nabídka → *Smazat řádek* | Odstraní řádek i s potomky (s potvrzením). |

### Změna struktury

| Klávesa | Akce |
|---------|------|
| `A` | Posunout řádek nahoru (v rámci sourozenců). |
| `D` | Posunout řádek dolů. |
| `.` (nebo `>`) | Zanořit — udělat z řádku potomka předchozího sourozence. |
| `,` (nebo `<`) | Vynořit — přesunout řádek o úroveň výš (za rodiče). |
| `Mezerník` | Přepnout stav hotovo/nehotovo. |
| `M` | Otevřít editor řádku rovnou na poznámce. |

Stejné akce jsou dostupné v hlavní nabídce Úpravy i v kontextové nabídce řádku.

### Editor řádku (dialogové okno)

Otevřením editoru se zobrazí formulář se všemi hodnotami řádku:

- **Téma** — textarea s Markdown + CriticMarkup, pod ním **živý náhled** vyrenderovaného tématu.
- **Typ řádku (sémantika)** — select se všemi typy (viz Sémantické typy).
- **Sloupce** — pro každý neskrytý sloupec (kromě tématu a stavu) samostatné pole podle typu:
  - Markdown → textarea,
  - číslo → `<input type=number>`,
  - datum → nativní `<input type=date>`,
  - trvání → text (např. `1d 4h`),
  - zaškrtávátko → checkbox,
  - pop-up → select s hodnotami.
- **Poznámka** — textarea s Markdown + CriticMarkup.
- **Hotovo (stav řádku)** — checkbox.

Uložit lze tlačítkem *Uložit řádek* nebo klávesovou zkratkou `Alt+U` (přístupová klávesa).

### Klávesové zkratky při psaní

V editoru tématu, poznámky i ve všech Markdown sloupcích fungují formátovací zkratky. Obalí označený text, nebo (není-li nic označeno) vloží značky a umístí kurzor mezi ně. Každou akci odečítač ohlásí.

| Zkratka | Akce |
|---------|------|
| `Ctrl+B` | Tučné `**…**`. |
| `Ctrl+I` | Kurzíva `*…*`. |
| `Ctrl+K` | Odkaz — je-li ve schránce URL, vloží `[název](url)` a označí název; jinak `[text]()` s kurzorem mezi závorky. |
| `Ctrl++` | Critic vložení `{++…++}`. |
| `Ctrl+-` | Critic odstranění `{--…--}`. |
| `Ctrl+.` | Critic náhrada — označený text se stane původním, kurzor skočí za `~>`: `{~~staré~>|~~}`. |
| `Ctrl+=` | Zvýraznění `{==…==}`. |

### Kontextová nabídka řádku

Na každém řádku lze otevřít **kontextovou nabídku** se všemi jeho akcemi: pravým tlačítkem myši, klávesou `Shift+F10`, klávesou `Menu` (ContextMenu), nebo klávesou `T`.

Obsahuje: úpravu řádku a poznámky, přepnutí hotového, přidání sourozence/potomka, posun nahoru/dolů, zanoření a vynoření, sbalení/rozbalení, hoist, vytvoření zrcadla, začátek sekce, číslování sekce, informace o řádku a smazání. Jako podnabídky nabízí:

- **Typ řádku** — rychlá volba sémantického typu.
- **Každý sloupec typu výběr (popup)** — rychlá volba hodnoty nebo její vyprázdnění.

Navíc jsou v ní dvě položky pro hromadné úpravy: **Vybrat řádek** (zapne režim výběru a zaškrtne tento řádek) a **Vybrat celou větev** (zaškrtne řádek i všechny jeho potomky).

Ovládání menu je standardní — šipky `↑` `↓`, `Home`/`End`, psaní písmene pro skok na položku, `→` nebo `Enter` otevře podnabídku, `←` nebo `Esc` zavře. Nedostupné položky se přeskakují.

### Zrcadlo (živá kopie)

Přes kontextovou nabídku → **Vytvořit zrcadlo** vznikne za řádkem jeho zrcadlo, které zobrazuje **živý obsah zdroje** (téma, poznámku, sloupce, stav, typ). Úprava zrcadla otevře a mění zdrojový řádek. Zrcadlo je označené odznakem, odečítač u něj hlásí „zrcadlo“. V **exportech** se zrcadlo vypíše obsahem svého zdroje, takže se ve výstupu objeví na obou místech. Stejně tak se zdrojovým textem vystupuje všude jinde — v panelu Sekce, ve výběru cíle při hromadném přesunu, v drobečkové navigaci, ve filtrech, hledání i statistikách. Řetězce zrcadel se plošně rozvíjí ke koncovému zdroji (zrcadlo zrcadla nevznikne).

### Sekce s odděleným číslováním

Libovolný řádek lze přes kontextovou nabídku → **Začátek sekce** označit jako začátek samostatné číslovací sekce. Sekce běží od tohoto řádku po další začátek sekce (v pořadí dokumentu) a má vlastní čítače — **kontinuální číslování se na začátku každé sekce resetuje**. Přes *Číslování této sekce…* lze sekci nastavit vlastní schéma úrovní nezávislé na globálním; *Reset na globální* ji vrátí k výchozímu číslování dokumentu. Řádky před první sekcí používají globální schéma. Sekce je označená odznakem a čtečka u ní hlásí „začátek sekce“.

### Režim výběru a hromadné operace

Tlačítko **Režim výběru** (v nabídce Úpravy) zobrazí u každého řádku zaškrtávátko. Výběr se týká **jen daného řádku**, ne jeho potomků — pokud chceš i potomky, zaškrtni je ručně nebo použij *Vybrat celou větev* z kontextové nabídky. Po výběru se nahoře zobrazí lišta hromadných operací:

- **Přesunout do…** — vybere se cíl (nebo *Nejvyšší úroveň*), vybrané řádky se do něj přesunou jako potomci i s vlastní hierarchií. Nelze přesunout dovnitř vybraného řádku (ochrana proti cyklu).
- **Změnit sloupec…** — podle typu sloupce:
  - text/číslo/trvání → přepis hodnoty,
  - datum → *Konkrétní datum*, nebo **Posun o dny** přepočtený pro každý řádek zvlášť (např. `+7`, `-3`),
  - zaškrtávátko → ano/ne,
  - pop-up → jedna z hodnot,
  - v každém režimu i tlačítko **Vyprázdnit hodnotu**.
- **Změnit typ…** — sémantický typ řádku.
- **Smazat** — s potvrzením.

---

## Sloupce a atributy

### Typy sloupců

| Typ | Vstup | Formátování |
|-----|-------|-------------|
| **Text (Markdown + CriticMarkup)** | textarea | Plný Markdown včetně tabulek, kódu, seznamů a citací. |
| **Číslo** | `<input type=number>` | `9 999`, `9 999,99`, celé číslo, procenta (celá / 2 des.), měna (Kč). |
| **Datum** | `<input type=date>` | Krátké (15.6.2026), Dlouhé (15. června 2026), Datum a čas, ISO (2026-06-15). Přijímá i relativní zápis: `dnes`, `zítra`, `včera`, `+7d`, `-3w`, `+1m`, `+1y`. |
| **Trvání** | text | Formát `1d 4h`, `2w`, `10h`; interně v hodinách (den = 8 h). |
| **Zaškrtávátko** | checkbox | Zobrazí se ☑ / ☐. |
| **Pop-up seznam** | select | Konfigurovatelný seznam hodnot (každá na řádek). |

Vestavěný sloupec **Stav (hotovo)** je zaškrtávátko typu status; lze ho v panelu Sloupce zobrazit nebo skrýt jako každý jiný. Je bez souhrnu jinak než *Stav (vše/část/nic)*.

### Prefix v nadpisu (sloupce nalevo od tématu)

V panelu *Sloupce* posouvej šipkami `←` `→`. Pokud sloupec posuneš **nalevo od sloupce Téma**, jeho hodnota se přestane zobrazovat jako samostatný sloupec a stane se **prefixem nadpisu** — ve stromu, v panelu Sekce, ve statistikách i ve všech exportech (DOCX, HTML, Markdown, CSV).

Typické využití: kódy položek (`ABC Úvod`), druhy (`TIP:`, `Příklad:`), priority, kategorie. Prefixy se skládají v pořadí sloupců oddělené mezerou.

### Souhrny na rodičích

Každý sloupec má nastavitelný souhrn, který se zobrazí u rodiče místo prázdné buňky:

| Typ sloupce | Nabízené souhrny |
|-------------|------------------|
| Text (markdown) | Žádný, Skrytý. |
| Číslo | Žádný, Součet, Minimum, Maximum, Průměr listů, Skrytý. |
| Trvání | Žádný, Celkem, Minimum, Maximum, Skrytý. |
| Datum | Žádný, Nejdřívější, Nejpozdější, Skrytý. |
| Zaškrtávátko | Žádný, Stav (vše/část/nic), Skrytý. |
| Pop-up | Žádný, Minimum, Maximum, Skrytý. |

Souhrn se počítá z **listů** podstromu (řádků bez potomků). Souhrny se odlišují stylem (podbarvení, tučně).

### Číslování řádků

V panelu *Číslování řádků*:

- **Zapnout číslování** — přepínač, který zapne výpis čísel u řádků.
- **Oddělovač úrovní** — jeden nebo víc znaků mezi částmi hierarchického čísla (výchozí `.`).
- **Pro každou z šesti úrovní:**
  - **Číslovat tuto úroveň** — když je vypnuto, úroveň se úplně vynechá (např. 1 → 1.1, ne 1.0.1).
  - **Formát čísla** — arabské (1, 2, 3), velká/malá písmena (A/a), velké/malé římské (I/i), *Bez čísla*.
  - **Předpona / Přípona** — text před a za číslem (např. `§ ` a `.`, `Část ` a nic).
  - **Hierarchické (skládat s rodičem)** — když je zapnuté, číslo se skládá z čísel nadřazených úrovní (např. „1.1“, „1.2.a“). Když je vypnuté, úroveň má samostatné číslo a **začíná novou linii** — takže lze mít třeba „Sekce A, 1., 1.1., 1.2., 2.“, kde první úroveň má vlastní číslo, druhá běží samostatně a teprve třetí se skládá.
  - **Kontinuální (průběžně v sekci)** — úroveň se nečísluje od 1 u každého rodiče, ale běží průběžně přes celou sekci i pod různými nadřazenými řádky. Typický příklad: legislativní *Článek*, který pokračuje 1, 2, 3 v Části I a dál 4, 5 v Části II.
  - Hierarchické a kontinuální jsou nezávislé — úroveň může být obojí.

**Presety** (dole v panelu): 
- **Úřední (§ 1.2)** — § / odst. / písm. / bod / římská / písmena.
- **Osnova (I/A/1/a)** — velké římské / velká písmena / arabské / malá písmena / …
- **Předpis (Část/Článek)** — Část I, II, III → Článek 1, 2, 3, 4 (kontinuální přes části) → odst. → písm.
- **Desetinné (1.1.1)** — všechny úrovně arabské, hierarchické.

### Styly a úrovně (mapování na HTML značky)

V panelu *Styly a úrovně* přiřadíš každé z šesti úrovní osnovy jednu sémantickou značku pro HTML a DOCX export:

- **Nadpis 1–6** (`h1`–`h6`),
- **Odstavec** (`p`),
- **Položka seznamu** (`li`).

V HTML i DOCX exportu jsou hlubší úrovně navíc vizuálně odsazené doleva (každá o kousek víc), aby byla hierarchie na první pohled patrná. Toto mapování určuje také obsah panelu *Sekce dokumentu* (zobrazí se jen řádky mapované na `h1`–`h6`).

### Sémantické typy řádků

Kromě „Normální“ lze zvolit devět typů:

| Typ (interně) | Popis | HTML značka | Kryje |
|--------------|-------|-------------|-------|
| `normal` | Normální | — | (žádná) |
| `strong` | Zvýrazněné | `<strong>` | inline (obalí téma) |
| `em` | Důležité | `<em>` | inline |
| `ins` | Vloženo | `<ins>` | inline |
| `del` | Odstraněno | `<del>` | inline |
| `mark` | Zvýrazněno | `<mark>` | inline |
| `blockquote` | Citace | `<blockquote>` | blok (obalí celý prvek) |
| `article` | Článek | `<article>` | blok |
| `aside` | Poznámka | `<aside>` | blok |

Typ se promítá do HTML i DOCX exportu, do Markdown exportu (inline se převede na `**…**`, `*…*`, `~~…~~`, `<ins>`, `<mark>`; blokové se obalí HTML značkou), dá se podle něj **filtrovat** (podmínka *Typ řádku*) a odečítač ho **ohlašuje** při pohybu po osnově.

### Uložené filtry

- **Rychlý filtr** — pole v horní liště hledá v tématu i poznámkách; select vedle filtruje podle stavu (Vše / Jen hotové / Jen nehotové).
- **Pokročilý filtr** (panel *Uložené filtry* → *Upravit filtr…*):
  - Podmínky nad libovolným sloupcem + nad **tématem** (`__topic__`) a **typem řádku** (`__rowtype__`).
  - Operátory podle typu:
    - Text: obsahuje, neobsahuje, přesně, má hodnotu, je prázdné.
    - Číslo / trvání: = , < , > , ≠, má hodnotu, je prázdné.
    - Datum: před, po, přesně, má hodnotu, je prázdné (přijímá i relativní `dnes`, `+7d`).
    - Zaškrtávátko: ano / ne.
    - Pop-up: = , ≠, má hodnotu, je prázdné.
    - Typ řádku: = , ≠.
  - Podmínky se kombinují logickým **A** (musí platit všechny).
  - **Rekurzivně** — když zapnuto, u vyhovujícího řádku se zobrazí i jeho rodiče (jako kontext, zešednutí). Když vypnuto, zobrazí se jen samotné vyhovující řádky.
  - **Použít** aplikuje filtr hned, **Uložit** ho uloží pod jménem (do souboru `.outline`) a použije.

---

## Klávesové zkratky

### Globální

| Zkratka | Akce |
|---------|------|
| `F10` | Skočit do hlavní nabídky. |
| `Shift+F10` | Otevřít kontextovou nabídku vybraného řádku. |
| `/` | Skočit do osnovy (na vybraný nebo první řádek). |
| `Ctrl+S` / `Cmd+S` | Uložit `.outline`. |
| `Ctrl+Shift+O` / `Cmd+Shift+O` | Načíst projekt ze schránky. |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Vložit projekt do schránky. |
| `Ctrl+F` / `Cmd+F` | Otevřít Najít. |
| `Alt+O` / `Alt+S` / `Alt+E` | Otevřít / Uložit / Export (přístupové klávesy; některé prohlížeče vyžadují `Alt+Shift`). |

### V osnově

| Zkratka | Akce |
|---------|------|
| `↑` / `↓` | Pohyb mezi řádky. |
| `→` | Rozbalit větev nebo přejít na potomka. |
| `←` | Sbalit větev nebo přejít na rodiče. |
| `Home` / `End` | První / poslední viditelný řádek. |
| `Enter` | Otevřít editor řádku. |
| `Shift+Enter` | Přidat sourozence za aktuální (a otevřít editor). |
| `Ctrl+Enter` / `Cmd+Enter` | Přidat potomka (a otevřít editor). |
| `Mezerník` | Přepnout stav hotovo. |
| `M` | Upravit poznámku řádku. |
| `I` | Přečíst kompletní informace o řádku (odečítač). |
| `T` | Otevřít kontextovou nabídku vybraného řádku. |
| `H` | Hoist / zrušit hoist. |
| `A` / `D` | Posunout řádek nahoru / dolů. |
| `.` (nebo `>`) | Zanořit (odsadit). |
| `,` (nebo `<`) | Vynořit (předsadit). |

### V editoru řádku

| Zkratka | Akce |
|---------|------|
| `Alt+U` | Uložit řádek (přístupová klávesa). |
| `Ctrl+B` | Tučné `**…**`. |
| `Ctrl+I` | Kurzíva `*…*`. |
| `Ctrl+K` | Odkaz `[text](url)` (URL ze schránky). |
| `Ctrl++` | Critic vložení `{++…++}`. |
| `Ctrl+-` | Critic odstranění `{--…--}`. |
| `Ctrl+.` | Critic náhrada `{~~staré~>nové~~}`. |
| `Ctrl+=` | Zvýraznění `{==…==}`. |
| `Esc` | Zavřít dialog. |

### V nabídkách a v dialozích

| Zkratka | Akce |
|---------|------|
| `←` `→` | Přejít mezi nabídkami v menubaru. |
| `↑` `↓` | Pohyb mezi položkami nabídky. |
| `Home` / `End` | První / poslední položka. |
| `Enter` / `Mezerník` / `→` | Otevřít podnabídku. |
| `Esc` / `←` (v podnabídce) | Zavřít nabídku. |
| Písmeno | Skok na položku začínající tímto písmenem. |

---

## Markdown a sledované změny

### Podporovaný Markdown

V tématu, textových sloupcích i poznámkách se vykresluje **plný Markdown** — nejen inline, ale i blokové prvky.

**Inline:** `**tučné**`, `*kurzíva*` (i `_kurzíva_`), `` `kód` ``, `~~přeškrtnuté~~`, `[text](https://odkaz)`.

**Blokové:**

| Prvek | Zápis |
|-------|-------|
| Nadpisy | `# nadpis` až `###### nadpis` |
| Odrážkový seznam | `- položka`, `* položka`, `+ položka` (vnořování odsazením) |
| Číslovaný seznam | `1. položka`, `1) položka` |
| Citace | `> text` (víc řádků se spojí) |
| Blok kódu | Ohraničený ```` ``` ```` nebo `~~~` |
| Vodorovná čára | `---`, `***`, `___` |
| Tabulka | `\| A \| B \|` s oddělovačem `\|---\|---\|` |

Plný Markdown se promítá i do HTML a DOCX exportu (včetně tabulek). U nadpisové úrovně se **první řádek** tématu bere jako samotný nadpis a případný další blokový obsah se vykreslí pod ním.

### CriticMarkup (sledované změny)

| Zápis | Význam | V DOCX exportu |
|-------|--------|----------------|
| `{++text++}` | Vložení | Sledované vložení |
| `{--text--}` | Smazání | Sledované smazání |
| `{~~staré~>nové~~}` | Nahrazení | Smazání + vložení |
| `{==text==}` | Zvýraznění | Žluté zvýraznění |
| `{>>text<<}` | Komentář | Komentář ve Wordu |

Funguje ve všech Markdown polích (téma, poznámka, textové sloupce). Při exportu lze zvolit, zda sledované změny zůstanou jako **návrhy** (výchozí), nebo se rovnou **přijmou**.

---

## Import a export

### Import

Přes *Soubor → Otevřít…* nebo *Soubor → Import…* lze načíst následující formáty (nabídka *Import…* umožňuje zvolit formát ručně a rozhodnout, zda nahradit aktuální dokument, nebo připojit k němu):

| Formát | Přípona | Poznámka |
|--------|---------|----------|
| Outliner JSON | `.outline`, `.mroutline` | Nativní. Načte kompletní stav včetně sloupců, filtrů a verzí. |
| OPML | `.opml` | Nadpisy/potomky, poznámky přes `_note`. |
| Markdown | `.md` | Nadpisy `#…######` a odsazené seznamy `-` `*` `+` `1.` tvoří hierarchii; obyčejný odstavec se přidá jako poznámka poslednímu řádku. |
| Prostý text | `.txt` | Hierarchie podle **odsazení** (tabulátory nebo mezery — šířka jednoho odsazení se rozpozná automaticky). Importuje se jen téma. |
| Tab-delimited | `.tsv` | První sloupec = téma, další sloupce se stanou textovými sloupci. |
| Automaticky | | Rozpozná se podle přípony a obsahu. |

**Načíst ze schránky** (*Soubor → Načíst ze schránky*, `Ctrl+Shift+O`): načte JSON `.outline` ze systémové schránky, nebo otevře dialog s textovým polem pro ruční vložení.

### Export

Přes *Soubor → Export…* (nebo `Alt+E`) vybereš formát:

| Formát | Popis |
|--------|-------|
| **Microsoft Word (.docx)** | Kompletní OOXML — nadpisy, tabulky, prefixy, sledované změny (CriticMarkup jako `w:ins`/`w:del`), komentáře (`w:comment`), hyperlinky. Volitelné „Sledované změny přijmout“ vyexportuje čistou finální verzi. |
| **HTML (sémantické nadpisy)** | Statické HTML s `<h1>–<h6>`, `<p>`, `<li>`, `<blockquote>`, `<article>`, `<aside>`, definičním seznamem `<dl>` pro sloupce, vizuálním odsazením a stylováním CriticMarkup i typů řádků. |
| **Dynamické HTML** | Totéž, ale větve jsou v `<details>` — kliknutím se rozbalí/sbalí. **Ve výchozím stavu jsou všechny větve sbalené** a nahoře je lepicí panel s hledáním (viz níže). |
| **Markdown (.md)** | Nadpisy `#…######`, listy `-`, poznámky jako `>` citace, sloupce jako pod-odrážky. Inline typy řádků se převedou na Markdown značky; blokové na HTML obalení. |
| **OPML** | Vnořené `<outline>` s tématem a poznámkou. |
| **CSV** | Sloupce: `Úroveň`, pak všechny sloupce dokumentu; jeden řádek na výstupní řádek. |
| **Prostý text (odsazený)** | Odsazení tabulátory; každý řádek = téma, případná poznámka o úroveň hlouběji. |

**Hledání v dynamickém HTML:** vyexportovaná stránka má nahoře pole *Hledat* a tlačítka *Zrušit*, *Rozbalit vše* a *Sbalit vše*. Po zadání textu zůstanou vidět jen řádky, které ho obsahují (v tématu, poznámce i ve sloupcích), spolu s celou cestou nadřazených řádků — ta se automaticky rozbalí. Nalezený text se zvýrazní žlutě a vedle pole se ukáže počet shod. Hledá se bez ohledu na velikost písmen a na diakritiku (*„vetv“* najde *„větvemi“*). Prázdné pole (nebo `Esc` v poli, případně tlačítko *Zrušit*) obnoví výchozí stav — všechno viditelné a sbalené. Stránka je stále jeden soubor bez externích knihoven.

**Export podle aktuálního zobrazení:** když je osnova filtrovaná (rychlým filtrem, stavem, pokročilými podmínkami) nebo zaměřená hoistem, **export zahrne jen to, co je právě vidět**. Naopak **uložení do `.outline`** a **vložení do schránky** vždy uloží celý dokument bez ohledu na filtr.

**Vložit do schránky** (*Soubor → Vložit do schránky*, `Ctrl+Shift+S`): zkopíruje celý dokument jako JSON `.outline` do systémové schránky. Fallback funguje i bez povolení Clipboard API.

### Verze dokumentu

Přes **Soubor → Uložit verzi…** uložíš pojmenovaný snímek aktuálního stavu dokumentu. Název se předvyplní podle poslední verze (u první je prázdný), datum a čas se doplní automaticky. Verze se ukládají spolu s dokumentem do souboru `.outline`, takže se přenášejí s ním.

Přes **Soubor → Verze dokumentu…** se otevře seznam všech verzí (nejnovější nahoře) s názvem, datem a časem a počtem řádků. U každé verze lze:

- **Zobrazit** — náhled obsahu jako čistý vnořený seznam.
- **Vrátit se k této verzi** — nahradí aktuální stav (uložené verze přitom zůstanou zachovány, takže se nic neztratí; je vhodné před tím uložit aktuální stav jako samostatnou verzi).
- **Uložit jako…** — vyexportuje verzi jako samostatný soubor `.outline` (bez vnořené historie).
- **Přejmenovat**.
- **Smazat** — s potvrzením.

Náhled i „Vrátit se k verzi“ jsou dostupné také přímo z okna náhledu.

---

## Nástroje

### Fulltextové hledání

Přes *Nástroje → Najít…* (nebo `Ctrl+F` / `Cmd+F`) se prohledá celý dokument — **téma, poznámky i hodnoty všech sloupců**. Výsledky se vypíšou jako seznam s úryvkem a informací, kde byl výraz nalezen; kliknutím (nebo *Předchozí* / *Další*) se skočí na daný řádek. Hledaný výraz se v ploše osnovy zvýrazní.

### Statistiky dokumentu

Přes *Nástroje → Statistiky…* se otevře přehled:

- Celkový počet řádků, počet úrovní (maximální hloubka), počet listů, řádků s poznámkou, zrcadel, sekcí.
- Rozpad podle **stavu hotovo/nehotovo** s procenty.
- Počty řádků **podle úrovní**.
- Rozpad podle **sémantických typů řádků** s procenty.
- Pro **každý sloupec** vlastní přehled:
  - pop-up — počty a procenta pro jednotlivé volby,
  - zaškrtávátko — ano / ne / prázdné,
  - číslo a trvání — součet, průměr, min / max,
  - datum — nejdřívější a nejpozdější.

Přepínačem *Počítat jen aktuálně zobrazené řádky* lze omezit výpočet na aktuální filtr a hoist. Tlačítko *Zkopírovat jako text* vloží celý přehled do schránky.

---

## Technické info

- **Formát**: jediný HTML soubor bez cizích knihoven a bez `<script src>` — vše je inline v `<script>`.
- **Ukládání dat**: v prohlížeči se nic neukládá. Nativní formát je JSON s příponou `.outline` (starší `.mroutline` je čitelný). Verze dokumentu jsou součástí souboru.
- **DOCX**: generuje se přímo v prohlížeči; ZIP se skládá ručně (bez závislosti na knihovně). Součástí je `document.xml`, `styles.xml`, `numbering.xml`, `comments.xml` (jen když existují CriticMarkup komentáře) a `_rels`.
- **Přístupnost**: ARIA `menubar` / `menu` / `menuitem` / `menuitemcheckbox`, vnořené `<ul>` pro strom, `aria-live="polite"` region pro krátká hlášení, přeskoč-na-obsah odkaz, klávesa `F10` do menu, `Shift+F10`/`Menu`/`T` do kontextové nabídky. Motiv (světlý/tmavý) přes `data-theme`.
- **Bezpečnost**: nekomunikuje s žádným serverem; načítání ukázkových dat vyžaduje běh přes `http(s)://` (přes `file://` ho některé prohlížeče blokují).
- **Prohlížeče**: moderní evergreen prohlížeče podporující ES2020, `<dialog>`, `<details>`, nativní `<input type=date>` a Clipboard API. Fallbacky jsou přítomny pro schránku (skryté `<textarea>` + `execCommand("copy")`).
- **Ukázková data**: při prvním otevření prázdného dokumentu je k dispozici tlačítko *Načíst ukázková data*, které stáhne `ukazka.outline` ze stejné složky jako aplikace. Ručně lze načíst soubor `Ukázka.outline` v repozitáři.

---

## Přehled hlavní nabídky

**Soubor:** Nový · Otevřít… · Uložit .outline · Načíst ze schránky · Vložit do schránky · Import… · Export… · Uložit verzi… · Verze dokumentu…

**Úpravy:** Přidat řádek na konec · Upravit řádek… · Upravit poznámku… · Přepnout hotovo · Přidat sourozence · Přidat potomka · Posunout nahoru / dolů · Zanořit / Vynořit · Vytvořit zrcadlo · Začátek sekce · Číslování této sekce… · Smazat řádek · Režim výběru

**Zobrazení:** Sbalit vše · Rozbalit vše · Sbalit / rozbalit větev · Hoist na vybranou větev · Zrušit hoist · Přejít do osnovy · Přečíst informace o řádku · Skrýt panely · Tmavý režim

**Nástroje:** Najít… · Statistiky…

**Nápověda:** Nápověda a klávesové zkratky (dialog s kompletním přehledem, který se generuje z běžícího nástroje).
