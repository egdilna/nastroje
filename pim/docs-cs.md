# PIM — osobní informační manažer

Webová aplikace pro správu osobních a profesních informací v jediném HTML souboru. Žádná instalace, žádný server — vše běží v prohlížeči a ukládá se lokálně. Volitelně synchronizace s GitHubem.

- **Online verze**: <https://egdilna.github.io/nastroje/pim>
- **Zdrojový kód (open source)**: <https://github.com/egdilna/nastroje/blob/main/pim>
- **Stažení a offline použití**: stáhněte soubor `pim.html`, otevřete v moderním prohlížeči (Chrome, Firefox, Safari, Edge). Aplikace běží i bez připojení k internetu (kromě některých externích služeb jako PlantUML server nebo Korektor).
- **Changelog (historie změn)**: <https://nastroje.egdilna.cz/#pim>

## Hlavní koncept

Aplikace pracuje s **entitami**. Entita může být cokoli — úkol, projekt, osoba, dokument, myšlenka, schůzka, diagram, plán. Místo aby každá entita měla pevný typ, přiřadíte jí jeden nebo více **aspektů**. Aspekty určují, jaké **atributy** entita zná: úkol má termín a stav, osoba má e-mail a telefon, projekt má dashboard. Jedna entita může být současně Úkol *a* Dokument, nebo Osoba *a* Kontakt.

Entity se propojují **wiki odkazy** (`[[Název]]`), **include odkazy** (`{{include:Název}}`), **typovanými vazbami** (je součástí, blokuje, zmiňuje, souvisí…) a **placeholdery atributů** (`((URL))`). Společně tvoří síť, kterou lze procházet, filtrovat, vyhledávat a — pro ty nejcitlivější — i šifrovat.

## Začínáme

**Hlavní navigace** v záhlaví:

- 🏠 **Nástěnka** — pracovní přehled (po termínu, dnes, tento týden, trackery, rychlé akce)
- **Inbox** — nezpracované entity (bez aspektu)
- **Vše** — kompletní seznam s řazením a pokročilým filtrováním
- **Úkoly** — entity s aspektem Úkol
- 📅 **Kalendář** — sbalovací po měsících, dnes a nadcházejících 7 dnů rozbaleno
- **Tagy** — přehled tagů s počty
- 🏳️‍🌈 **Příznaky** — přehled emoji příznaků (viditelné jen pokud máte definované)
- **Nástroje** — import/export, hledání odkazů, hromadné operace, hledání duplicit
- **Nastavení** — vzhled, vlastní aspekty, GitHub, statický prohlížeč

**V záhlaví** (rychlé akce dostupné odkudkoli):

- 🔍 **Hledání** (klávesa `/` nebo `h`) — full-text s navigací šipkami v rychlých výsledcích
- ⚡ **Rychlé zachycení** (`q` nebo `Alt+Shift+Q`) — dočasný dialog pro zápis nápadu do inboxu (vrátí vás zpět tam, kde jste byli)
- ✓ **Rychlý úkol** (`t` nebo `Alt+Shift+T`) — dočasný dialog: název s přirozeným termínem + select projektu
- ➕ **Nová entita** (`n`) — vytvořit prázdnou entitu a otevřít k editaci
- 📋 **Z šablony** (`Shift+N`) — vytvořit z předdefinované nebo vlastní šablony
- 📌 **Odkládací prostor** (`Alt+Shift+V`) — dočasný textový buffer pro práci mezi entitami
- ❔ **Nápověda** — kompletní přehled kláves, syntaxe textu a ikon u entit

## Nástěnka — pracovní centrum

Nástěnka (`Alt+Shift+D`) je první obrazovka, kterou byste měli vidět ráno. Obsahuje:

1. **⚡ Rychlé akce** — dvě kartičky bok po boku:
   - **📥 Rychlé zachycení do Inboxu** — jediná textarea, první řádek = název, zbytek = tělo poznámky
   - **✓ Rychlý úkol** — název (s přirozeným termínem typu „zítra v 15:00") + volitelný select projektu, na který se úkol naváže přes `partOf`

2. **Statistiky** — Inbox / Otevřené úkoly / Hotové (s procentem) / Po termínu (červené)

3. **🚨 Po termínu** (pokud je co) — červený box s 10 nejstaršími prošlými úkoly a zaškrtávátky pro rychlé hotovo

4. **📌 Dnes — středa 20. května 2026** — žlutý box s dnešními úkoly, událostmi, narozeninami, připomínkami. Zaškrtávátka u úkolů pro rychlé hotovo.

5. **📅 Tento týden** — zítra + 6 dnů, první 2 rozbalené, ostatní sbalené

6. **📊 Trackery** — kartičky s aktuální hodnotou a progress barem pro každou entitu s aspektem Tracker

7. **❓ Nezodpovězené otázky** — top 5

8. **🕐 Naposledy změněné** — top 10 podle `updated_at`

## Aspekty, atributy, tagy

### Aspekty

Aspekt je „role" entity. Můžete jich přiřadit libovolný počet:

| Aspekt | Co přidá |
|---|---|
| **Úkol** | Termín, stav, datum dokončení, priorita, energie |
| **Událost** | Začátek, konec, místo, program — **plus sekce „Úkoly schůzky"** |
| **Projekt** | Dashboard se sekcemi pro úkoly, cíle, dokumenty atd. |
| **Plán** | WBS tabulka úkolů s termíny, předchůdci, stavy, propojením s entitami |
| **Tracker** | Hodnota, jednotka, cíl, historie změn |
| **Diagram** | PlantUML zdroj + náhled, kopírovací akce |
| **Strukturovaný dokument** | Outline editor s vlastními styly, číslováním (arabsky/písmena/římsky, víceúrovňové), nadpisy H1–H6, sbalitelnými sekcemi a Markdown bloky; export do MD i DOCX (revize z CriticMarkup) |
| **Prezentace / Slide** | Slide-by-slide režim s timer (T/R klávesy, MM:SS / H:MM:SS) |
| **Cíl, Otázka, Rozhodnutí, Nápad** | Specifická pole |
| **Poznámka, Dokument, Zdroj, Záložka** | URL (s tlačítky 📋 URL / 📋 Markdown), autor, datum |
| **Osoba, Organizace** | Kontaktní údaje, vazby |
| **Komunikace** | Směr, kanál (e-mail, telefon, schůzka…), předmět, výsledek |
| **🔒 Zabezpečené** | AES-GCM 256 šifrování obsahu, per-entity heslo |

**Vlastní aspekty**: v Nastavení můžete definovat vlastní aspekty s libovolnými poli těchto typů: text, textarea (markdown), číslo, datum, datum+čas, URL, e-mail, telefon, checkbox, select, vazba na jinou entitu, **složený text/markdown** (vyhodnocuje se ze vzorce), **zdrojový kód** (sbalitelný blok s 📋 Kopírovat).

### Atribut typu „Zdrojový kód"

Speciální atribut bez markdown nástrojů — uloží přesně to, co tam dáte (JSON data, snippet kódu, šablona, libovolný text). V čtení se zobrazí ve sbalitelném `<details>` s tlačítkem 📋 **Kopírovat**.

### Placeholdery `((Atribut))` v textu

Kdekoli v markdown obsahu nebo v textarea atributu můžete použít `((Atribut))` nebo `((Aspekt/Atribut))` — při zobrazení se nahradí hodnotou. Funguje rekurzivně: při `{{include:B}}` z entity A se placeholdery v body B vyhodnocují podle B (její vlastní atributy).

Speciální placeholdery:
- `((Název))` — název entity
- `((Aspekty))` — seznam aspektů
- `((Tagy))` — seznam tagů

Pod každou markdown textarea je tlačítko **📎 Vložit…** otevírající dialog se všemi dostupnými placeholdery z entity, abyste je nemuseli psát ručně.

### Inline-select `(!a/b/|c!)`

Šablona `(!ano/|ne/možná!)` se v read modu vyrenderuje jako `<select>` se žlutým chipem. Klik změní hodnotu → debounce save (přepíše `|` na novou pozici). Vedle selectu je tlačítko **🔒 Zafixovat výběr**, které vybraný text vloží jako prostý text (nahradí celé `(!...!)`).

V exportu / include / tisku / kopírování se inline-select převede na `(!c!)` (jen vybraná hodnota mezi vykřičníkovými závorkami). V JSON exportu se zachová kompletní formát pro přenos.

### Tagy

Volné štítky, ke kterým může entita patřit. V Inboxu, Nástěnce a Vše lze filtrovat. V „Pokročilých filtrech atributů" lze vytvořit komplexní podmínky s 15 operátory.

## Markdown obsah

Tělo entity je v markdownu s rozšířeními:

- **CommonMark + GFM** — nadpisy H1–H6, tučně, kurzíva, ~~přeškrtnuté~~, ==zvýrazněné==, kód, citace, seznamy, tabulky, obrázky
- **Wiki odkazy**: `[[Název entity]]` nebo `[[id:abc-123|popisek]]`
- **Include (transkluze)**: `{{include:Název entity}}` — vloží obsah jiné entity (s rekurzivním placeholderem)
- **Markdown úkoly**: `- [ ] úkol`, `- [x] hotovo` (s tlačítkem **→ Entita** v anotačním režimu pro převod na samostatný Task s vazbou `partOf`)
- **CriticMarkup**: `{++přidat++}`, `{--smazat--}`, `{>>poznámka<<}` — editor revizí s krok-za-krokem
- **Private bloky**: `~~~private … ~~~` — viditelné jen v aplikaci, ne v exportu/include
- **Footnotes**: `[^1]` + `[^1]: text`
- **Placeholdery**: `((Atribut))` — viz výše
- **Automatické čítače**: `((#))` = úroveň 1, `((##))` = úroveň 2 atd.; `((#.##))` vypíše víceúrovňové číslo (např. `1.2`) — poslední úroveň se zvyšuje, vyšší se jen čtou, hlubší se při zvýšení vynulují. `((#jméno))` = pojmenovaný průběžný čítač pro celou entitu (každé jméno běží nezávisle)
- **Vložení strukturovaného dokumentu**: `((dokument))` vloží na dané místo v těle obsah aspektu „Strukturovaný dokument" této entity (jako Markdown)
- **Inline-select**: `(!a/b/|c!)` — viz výše
- **Quick anotace**: `(>text)` — při uložení edit modu se převede na klasickou anotaci k řádku, kde se nacházel, a z těla zmizí

## Anotace

Anotace jsou „post-it" poznámky k jednotlivým řádkům či odstavcům obsahu. Nezasahují do textu — žijí vedle něj v sekci „Anotace" pod tělem.

**Jednotka anotace = jeden řádek**. Pro normální odstavec to znamená celý odstavec; pro **bullet/ordered list** je to **jednotlivá `<li>`**; pro **tabulku** je to **jednotlivý `<tr>`**. Můžete tedy anotovat konkrétní položku seznamu nebo řádek tabulky.

**Zapnutí**: klávesa `a` v read modu detailu nebo tlačítko **📝 Anotace**. V režimu se u každého řádku objeví tlačítko **+ Anotace**.

**Quick anotace** přímo v textu: napište `(>poznámka pro pozdější zpracování)` kdekoli v textu. Při uložení edit modu se text vymaže a vznikne klasická anotace pod tím řádkem. Účel: rychle si při psaní nechat „dluhopis" budoucímu sobě, bez nutnosti zapínat režim, klikat tlačítka atd.

## Editor tabulky

V **section-edit režimu** (přepínač `d` v read modu nebo tlačítko „Editovat sekce") se pod každou markdown tabulkou objeví tlačítko **📊 Upravit tabulku**. Otevře přístupný dialog s gridem:

- Editovatelné záhlaví sloupců + zarovnání (auto/vlevo/střed/vpravo)
- Editovatelné buňky
- Posun řádků ▲ ▼ a sloupců ◀ ▶
- Mazání řádků a sloupců
- Přidávání řádků a sloupců

Po uložení se markdown ve zdrojovém textu nahradí novou tabulkou. Přístupné pro screen readery (každý input má `<label>` s pozicí, tlačítka mají `aria-label`).

## Příznaky 🏳️‍🌈

Příznaky jsou **emoji uvnitř textu**, která fungují jako vizuální značky. Nejsou součástí markdownu — jsou to obyčejné znaky, které aplikace umí najít a zobrazit přehled.

**Použití**: do těla nebo textarea atributu napište emoji ze seznamu příznaků (definujete v Nastavení → Příznaky). V navigaci se objeví karta **🏳️‍🌈 Příznaky** s přehledem všech výskytů: kde se emoji objevuje, v jakém typu řádku (nadpis, odrážka, úkol…), a s kontextem.

**Akce u každého výskytu**:
- **✕** — odstranit emoji z textu (uloží entitu)
- **🔄** — změnit emoji na jiné ze seznamu příznaků (grid s alternativami)

Příznaky jsou ideální pro **vlastní systém značek**: 🔴 urgentní, 🤔 k zamyšlení, 💡 nápad, ⏳ čeká, atd. Můžete je hromadně vyhledat a procházet napříč všemi entitami.

## Sekce Účastníci schůzky 👥

Sourozenecká sekce k „Úkoly schůzky" pro entity s aspektem **Událost (Event)**. Také vždy editovatelná v read i edit modu.

**Seznam účastníků** ukazuje:
- 👤 Osoby / 🏢 Organizace s odkazem na detail
- Tlačítko ↗ otevřít v novém panelu
- Tlačítko ✕ odebrat z účastníků

**Pod seznamem** je rozbalovací **+ Přidat účastníky** s **multi-selectem** všech osob a organizací z databáze, které ještě nejsou účastníky. Stiskněte Ctrl/Cmd pro vícenásobný výběr a tlačítko **+ Přidat vybrané jako účastníky** přidá všem najednou vazbu `attendedBy` (label „má účastníka" / „účastní se").

Toto je oproti běžnému `r` (přidat vazbu) podstatně rychlejší pro mítinky se mnoha lidmi — vyberete je všechny najednou a jedním klikem propojíte.

Vazby se zobrazují i v normální sekci **Vazby** (inverzní: u osoby vidíte „je účastníkem schůzky X").

## Sekce Úkoly schůzky 📋

Tohle je vlajková funkce pro **sekretářky a projektové vedoucí**. Pokud má entita aspekt **Událost (Event)**, automaticky se u ní objeví sekce „📋 Úkoly schůzky" — v read i edit modu, vždy editovatelná.

**Tabulka úkolů** ukazuje:
- **Vazba**: 🔗 součást schůzky (`partOf`) · 📎 zmíněn na schůzce (`mentions`) · 🔸 historická vazba
- **Úkol** se zaškrtávátkem pro rychlé hotovo + tlačítkem **↗** otevřít v novém panelu
- **Termín** (červený, pokud po termínu)
- **Stav**
- **Poslední komentář** (zkrácený)
- **Akce**: 🔗✕ odpojit úkol od schůzky

**Pod tabulkou** je rozbalovací **+ Přidat úkol** se dvěma variantami:

### ✓ Nový úkol
Vytvoří úkol z přirozeného textu (název + případně „zítra v 15:00", „pátek 14:00", „30.6.").
Vazby:
- Úkol → projekty schůzky: **partOf** (úkol je opravdu součástí projektu)
- Schůzka → úkol: **mentions** (úkol byl na schůzce zmíněn)

Schůzka může být ve **více projektech současně** — úkol bude součástí všech.

### ➕ Nová entita (jiný aspekt)
Vedle nového úkolu lze rovnou založit entitu **libovolného aspektu** (poznámka, dokument, osoba…): zadáte název, vyberete aspekt a volitelně zaškrtnete, do kterých projektů schůzky má entita patřit. Entita dostane vazbu `mentions` ze schůzky a `partOf` na vybrané projekty — bez ručního vytváření a vázání.

Totéž je k dispozici i v **detailu projektu**: pod rychlým úkolem je pole „+ Nová entita do tohoto projektu" (název + výběr aspektu), které založí entitu s vazbou `partOf` na projekt.

### 📎 Existující úkol z projektu
Select se všemi úkoly z projektů schůzky, které ještě nejsou propojené. Přidá schůzce vazbu `mentions` → úkol (úkol zůstává součástí svého projektu, jen je teď zmíněn na této schůzce).

Logika vazeb je tedy:
- Úkol „patří" projektu (přes `partOf`)
- Úkol je „zmíněn" na schůzce (přes `mentions` ze schůzky)

Vazby se zobrazují i v normální sekci **Vazby** entity (oboustranně — `zmiňuje` / `je zmíněn v`).

## Aspekt Zabezpečené 🔒

Pro citlivý obsah, který chcete šifrovat ještě před uložením na disk (a tedy i před sync na GitHub).

**Jak funguje**:
- Přidáte aspekt **Zabezpečené (Secured)** k entitě
- Při uložení edit modu se zobrazí dialog: zadejte heslo (a potvrzení při prvním nastavení)
- **Šifruje se**: tělo (body) + všechny `textarea` a `code` atributy
- **Nešifruje se**: název, ostatní atributy (text, číslo, datum, URL, e-mail, telefon, select, checkbox, vazby, tagy, aspekty)
- Plain text se vymaže, na disku zůstane jen šifrovaná verze
- **Algoritmus**: PBKDF2-SHA256 (100 000 iterací) → AES-GCM 256-bit přes Web Crypto API

**Ikony u názvu**: 🔒 (zamčená) / 🔓 (odemčená v této session)

**Při čtení**: pokud je entita zamčená, místo obsahu se zobrazí výzva s tlačítkem **🔓 Odemknout**. Po zadání správného hesla se plain text uloží **jen do paměti** (`_unlockedSecured[id]`) — nikdy se nezapisuje. Při refreshi stránky se automaticky znovu zamkne.

**Hledání** v zabezpečených entitách: prohledává se jen název, tagy, aspekty a veřejné atributy.

**Include** zabezpečené entity:
- Zamčená → placeholder „🔒 Obsah je zamčený a nelze ho vložit"
- Odemčená → vloží plain body s 🔓 hlavičkou

**Bezpečnostní poznámka**: Heslo se neuloží **nikde** — ani v paměti, ani v localStorage, ani na disku. Pokud ho zapomenete, obsah už nikdo nezíská (ani Anthropic, ani autor aplikace).

## Pokročilé filtry atributů

V kartě **Vše** je v sekci „Filtry" rozbalovací podsekce **Pokročilé filtry atributů**. Klikem na **+ Přidat filtr atributu** otevřete dialog:

1. **Atribut** — výběr z globálních polí + atributů aktivních aspektů (skupinový select)
2. **Operátor** — 15 typů (automaticky filtrované podle typu pole):
   - `=`, `≠`, `obsahuje`, `neobsahuje`, `začíná na`, `končí na`
   - `>`, `<`, `≥`, `≤`, `mezi` (s dvojicí inputů)
   - `je prázdné`, `není prázdné`, `je zaškrtnuto`, `není zaškrtnuto`
3. **Hodnota** — adaptivní podle typu (text, číslo, datum, select s options, checkbox)

Filtry se kombinují logikou **AND**.

**Uložené pohledy** uchovají kompletní filtr — aspekt, tagy (včetně „nemá tag"), stav úkolu, prioritu, termín i pokročilé filtry atributů. Filtr přežije i zapnutí režimu výběru. Porovnání tagů nerozlišuje velikost písmen.

## Klávesové zkratky

### Globální (kdekoliv kromě editačních polí)

| Klávesa | Akce |
|---|---|
| `q` / `Alt+Shift+Q` | Rychlé zachycení do Inboxu |
| `t` / `Alt+Shift+T` | Rychlý úkol |
| `n` | Nová prázdná entita |
| `Shift+N` | Nová ze šablony |
| `Alt+Shift+D` | Nástěnka |
| `Alt+Shift+H` | Hledání v záhlaví |
| `Alt+Shift+V` | Odkládací prostor |
| `Alt+Shift+S` | Uložit na GitHub |
| `/` | Skok do pole hledání |
| `?` | Nápověda |
| `p` / `Alt+Shift+P` | Skok na první otevřený panel |
| `Esc` | Zavřít dialog / opustit edit / zpět |

### V detailu entity

| Klávesa | Akce |
|---|---|
| `e` | Přepnout edit ↔ čtení |
| `u` | V edit módu: uložit a zpět na čtení |
| `r` | Přidat vazbu na existující entitu |
| `Shift+R` | Vytvořit novou související entitu |
| `c` | Přidat komentář |
| `d` | (read, pokud má nadpisy) Přepnout režim editace sekcí |
| `a` | (read) Přepnout anotační režim |
| `z` | (u entity s aspektem „Sledování času") Spustit/zastavit timer |
| `Shift+Z` | Přidat aspekt „Sledování času" (pokud chybí) a rovnou spustit timer |
| `Esc` | Zpět na read mode (uloží quick anotace a změny) |

### Navigace

| Klávesa | Akce |
|---|---|
| Šipky ↑↓ v rychlých výsledcích hledání | Skákání mezi výsledky |
| Šipky ↑↓ v tabulce entit | Pohyb mezi řádky |
| `e` na řádku tabulky | Přímá editace entity |
| `o` na řádku tabulky | Otevřít v novém panelu |
| `l` na řádku tabulky | Rychlá úprava štítků |
| `r` na řádku tabulky | Úprava data připomenutí |
| `a` na řádku tabulky | Úprava aspektů |
| `Enter` na řádku tabulky | Otevřít entitu |
| Šipky ↑↓ v search results | Skákání mezi výsledky |

## Vazby mezi entitami

Vazby jsou typované odkazy mezi entitami. Definované typy:

| Typ | Inverzní popis |
|---|---|
| `partOf` (je součástí) | obsahuje |
| `blocks` (blokuje) | je blokován |
| `relatedTo` (souvisí) | souvisí |
| `references` (odkazuje) | je odkazován |
| `mentions` (zmiňuje) | je zmíněn v |
| `dependsOn` (závisí na) | je závislost |
| `dueTo` (kvůli) | je důvod pro |
| `answeredBy` (zodpovězeno) | je odpověď na |
| `attendedBy` (zúčastnil se) | byl účastníkem |

**Vazby se zobrazují v obou směrech**: u entity vidíte své outgoing vazby v sekci Vazby a incoming v Inverzních vazbách.

**Sjednocený výběr entity**: při přidávání vazby (i jinde, kde se vybírá entita — účastníci a úkoly schůzky apod.) se používá jeden společný dialog s hledáním a **filtrem podle aspektu**. U osob se v závorce zobrazuje organizace, kde pracují, u úkolů jejich stav — pro snazší orientaci ve výběru.

## URL atributy — kopírovací tlačítka

U každého URL atributu (např. `url` u Záložky) jsou v read modu vedle samotné URL dvě tlačítka:
- **📋 URL** — zkopíruje čistou URL
- **📋 Markdown** — zkopíruje formát `[Název entity](URL)` použitelný v markdownu

Závorky v názvu se v markdown linku správně escapují.

## Calendar

Kalendář (Alt+Shift+`Šipka`) je redesignovaný do přehledných sekcí:

- **Statistiky** nahoře: celkem / dnes / po termínu
- **📌 Dnes a následujících 7 dnů** — rozbalené detaily
- **⏪ Poslední 3 dny** — rozbalené detaily
- **🔮 Další měsíce** — sbalené po měsících, klikem rozbalit jednotlivé dny
- **🗄 Minulost** — sbalené po měsících, novější nahoře

Ikony podle typu položky: ⏰ termín, ▶ začátek, ⏹ konec, 🎯 cíl, 🔍 revize, 🎂 narozeniny, 📌 rozhodnuto.

## Project dashboard

U entity s aspektem **Projekt** se automaticky generuje dashboard se sekcemi:
- 🎯 Cíle (s manual progress barem a relativním datem)
- ✓ Úkoly (s rychlým zaškrtáváním)
- 📅 Schůzky
- 📄 Dokumenty
- 📚 Zdroje
- atd.

Pod každou sekcí je rychlá akce pro přidání nového dítěte projektu.

## Tisk / Export / Kopírování

Tlačítka **📋 Zkopírovat zdroj** a **✨ Zkopírovat formátované** (pod tělem entity) i export a tisk vykreslují direktivy `{{include:…}}`, `{{database:…}}`, `{{status:…}}`, placeholdery a čítače — do schránky/exportu se tedy nedostane surová direktiva, ale její výsledek.

Z detailu entity tlačítko **🖨 Export / tisk…** otevírá dialog s checkboxy pro každou sekci a výběrem formátu:

- **MD** — markdown (s expandováním include i `{{database:…}}` na tabulku a `{{status:…}}` na textový souhrn, vyhodnocením placeholderů a čítačů `((#))`, zjednodušením inline-selectů na `(!c!)`)
- **HTML** — pro tisk přímo z prohlížeče (Ctrl+P)
- **DOCX** — pro Word, Outlook, e-mailové klienty
- **PDF** — přes systémový tisk

Sekce **Úkoly schůzky** se vykresluje do MD/HTML/DOCX/PDF, ale **ne** do include (aby se schůzka v jiné entitě nezahrnula s celou tabulkou úkolů).

## Datová synchronizace s GitHubem

V Nastavení nastavte GitHub Personal Access Token (fine-grained) a cílový repozitář. Tlačítko **☁ Sync** (`Alt+Shift+S`) uloží aktuální stav (JSON) jako commit přes Contents API. Pro velké soubory (>900 KB) se použije Git Blob API.

Také je k dispozici **statický prohlížeč** — generuje samostatný HTML soubor s vašimi entitami v read-only režimu, vhodný pro sdílení.

## Časté otázky

**Kde jsou moje data?** V `localStorage` prohlížeče pod klíčem `pim_db_v1::DEFAULT` (nebo `pim_db_v1::IDP_ID` pro projektové stránky).

**Mohu mít víc oddělených databází?** Ano, přes URL parametr `?id=NAZEV`. Každý ID má vlastní storage.

**Jak zálohovat?** Nástroje → Export → JSON. Nebo zapnout GitHub sync.

**Mohou ostatní vidět mé Zabezpečené poznámky?** Ne. Jejich obsah je AES-GCM šifrovaný heslem, které se nikam neukládá. Bez hesla nikdo nezíská plain text.
