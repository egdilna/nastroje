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

**Vlastní aspekty**: v Nastavení můžete definovat vlastní aspekty s libovolnými poli těchto typů: text, textarea (markdown), číslo, datum, datum+čas, URL, e-mail, telefon, checkbox, select, vazba na jinou entitu, **složený text/markdown** (vyhodnocuje se ze vzorce), **zdrojový kód** (sbalitelný blok s 📋 Kopírovat). Vlastnímu aspektu lze přiřadit **ikonu (emoji)**, která se pak zobrazuje u entity i v seznamech.

V Nastavení se u vestavěných i vlastních aspektů v seznamech zobrazuje jejich **ikona** — u vestavěných v seznamu se zaškrtáváním, u vlastních v samostatném sloupci tabulky.

### Atribut typu „Zdrojový kód"

Speciální atribut bez markdown nástrojů — uloží přesně to, co tam dáte (JSON data, snippet kódu, šablona, libovolný text). V čtení se zobrazí ve sbalitelném `<details>` s tlačítkem 📋 **Kopírovat**.

### Placeholdery `((Atribut))` v textu

Kdekoli v markdown obsahu nebo v textarea atributu můžete použít `((Atribut))` nebo `((Aspekt/Atribut))` — při zobrazení se nahradí hodnotou. Funguje rekurzivně: při `{{include:B}}` z entity A se placeholdery v body B vyhodnocují podle B (její vlastní atributy).

Speciální placeholdery:
- `((Název))` — název entity
- `((Aspekty))` — seznam aspektů
- `((Tagy))` — seznam tagů

Pod každou markdown textarea je tlačítko **📎 Vložit…** otevírající dialog se všemi dostupnými placeholdery z entity, abyste je nemuseli psát ručně.

Hodnota placeholderu se bere jako **údaj, ne jako zápis**: když datum `15. 3. 2026` nebo hodnota začínající na `- `, `# `, `>` či `|` stojí na začátku řádku, nezaloží odrážku, nadpis ani citaci. Formátování uvnitř řádku (například `**tučně**`) funguje dál a víceřádkové hodnoty vypočítaných polí se pořád vykreslují jako plnohodnotný Markdown.

Placeholder, který PIM nezná, zůstane v textu tak, jak je napsaný — překlep v názvu pole tedy poznáte na první pohled. Totéž platí pro `((deník))` a `((dokument))` u entity, která příslušný aspekt nemá.

### Inline-select `(!a/b/|c!)`

Šablona `(!ano/|ne/možná!)` se v read modu vyrenderuje jako `<select>` se žlutým chipem. Klik změní hodnotu → debounce save (přepíše `|` na novou pozici). Vedle selectu je tlačítko **🔒 Zafixovat výběr**, které vybraný text vloží jako prostý text (nahradí celé `(!...!)`).

V exportu / include / tisku / kopírování se inline-select převede na `(!c!)` (jen vybraná hodnota mezi vykřičníkovými závorkami). V JSON exportu se zachová kompletní formát pro přenos.

### Tagy

Volné štítky, ke kterým může entita patřit. V Inboxu, Nástěnce a Vše lze filtrovat. V „Pokročilých filtrech atributů" lze vytvořit komplexní podmínky s 15 operátory.

## Markdown obsah

Tělo entity je v markdownu s rozšířeními:

- **CommonMark + GFM** — nadpisy H1–H6, tučně, kurzíva, ~~přeškrtnuté~~, ==zvýrazněné==, kód, citace, seznamy, tabulky, obrázky
- **Wiki odkazy**: `[[Název entity]]` nebo `[[id:abc-123|popisek]]`
- **Odkaz podle čísla entity**: `#42` — číslo najdete v sekci Meta v detailu entity
- **Include (transkluze)**: `{{include:Název entity}}` — vloží obsah jiné entity (s rekurzivním placeholderem)
  - Podle vnitřního ID: `{{include:id:<id entity>}}` — nerozbije se při přejmenování cílové entity
- **Markdown úkoly**: `- [ ] úkol`, `- [x] hotovo` (s tlačítkem **→ Entita** v anotačním režimu pro převod na samostatný Task s vazbou `partOf`)
- **CriticMarkup**: `{++přidat++}`, `{--smazat--}`, `{==zvýraznit==}`, `{>>poznámka<<}`, `{~~staré~>nové~~}` (substituce) — editor revizí s krok-za-krokem
- **Private bloky**: `~~~private … ~~~` — viditelné jen v aplikaci, ne v exportu/include
- **Footnotes**: `[^1]` + `[^1]: text`
- **Placeholdery**: `((Atribut))` — viz výše
- **Automatické čítače**: `((#))` = úroveň 1, `((##))` = úroveň 2 atd.; `((#.##))` vypíše víceúrovňové číslo (např. `1.2`) — poslední úroveň se zvyšuje, vyšší se jen čtou, hlubší se při zvýšení vynulují. `((#jméno))` = pojmenovaný průběžný čítač pro celou entitu (každé jméno běží nezávisle)
- **Vložení strukturovaného dokumentu**: `((dokument))` vloží na dané místo v těle obsah aspektu „Strukturovaný dokument" této entity (jako Markdown)
- **Vložení deníku**: `((deník))` vloží na dané místo v těle deník této entity od nejstaršího záznamu (jen u aspektu „Deník")
- **Inline-select**: `(!a/b/|c!)` — viz výše
- **Inline anotace**: `(>text)` — zůstává ve zdroji, zobrazí se jako anotační bublina; do exportu/tisku/kopírování nejde (viz sekce Anotace)

## Nástroje nad textovým polem

Pod každým markdownovým polem (tělo entity, textové atributy) je lišta s nástroji:

- **📎 Vložit…** — vloží dynamický prvek: wiki odkaz, include (transkluzi), status chip, příznak nebo (v entitě) placeholder atributu
- **📥 Vložit z HTML** — vezme formátovaný text ze schránky (např. zkopírovaný z webové stránky) a **převede ho na Markdown** vložený na pozici kurzoru. Zvládá nadpisy, tučné/kurzíva/přeškrtnuté, odkazy, obrázky, seznamy (i vnořené a úkoly), tabulky, citace a kód. Když ve schránce HTML není, vloží prostý text
- **📝 Revize** — správce CriticMarkup revizí (krok za krokem přijmout/odmítnout)
- **🔍 Korektor** — kontrola pravopisu (Korektor ÚFAL). Návrhy oprav lze přijmout jedním kliknutím; opravy se zapisují přímo do textu a spolehlivě i v textech s diakritikou a emoji
- **🧹 Lint** — kontrola syntaxe markdownu

Když v poli **označíte text**, objeví se lišta „Z označeného textu" s dalšími akcemi:

- **📤 Do nové entity…** — výběr přesune do nové entity (jako její obsah) a místo něj vloží **wiki odkaz**, **include** nebo **status**. V dialogu můžete rovnou zaškrtnout, do kterých **projektů** (převzatých ze zdrojové entity) má nová entita patřit
- **➕ Critic vložení / ➖ Critic odstranění / 🔄 Critic náhrada** — obalí výběr značkou CriticMarkup
- **🖍 Zvýraznění** — obalí výběr do `{==…==}`
- **💬 Komentář** — přidá za výběr komentář `{>>…<<}` (kurzor rovnou uvnitř komentáře)
- **🔗 Jako odkaz** — z výběru udělá text markdownového odkazu a jako URL vloží obsah **schránky**. Postup: zkopírujte si někde URL (Ctrl+C), pak označte text a klikněte — vznikne `[text](URL ze schránky)`

Každá akce s výběrem se navíc **ohlásí odečítači obrazovky** (přes aria-live), takže i bez zraku víte, co se stalo.

### Klávesové zkratky při editaci markdownu

Když píšete v markdownovém poli (tělo entity, sekce, odkládací prostor), fungují zkratky (na Macu ⌘ místo Ctrl):

| Klávesa | Akce |
|---|---|
| `Ctrl+B` | Tučné `**text**` |
| `Ctrl+I` | Kurzíva `*text*` |
| `Ctrl+K` | Odkaz — je-li ve schránce URL, vloží `[text](url)` a kurzor dá na název; jinak `[text]()` a kurzor mezi závorky |
| `Ctrl+H` | Nadpis stejné úrovně jako poslední nadpis nad kurzorem (jinak H2) |
| `Ctrl++` | Označené jako Critic vložení `{++…++}` |
| `Ctrl+-` | Označené jako Critic odstranění `{--…--}` |
| `Ctrl+.` | Označené jako Critic náhrada `{~~…~>…~~}` |
| `Ctrl+=` | Označené jako zvýraznění `{==…==}` |
| `Ctrl+Shift+K` | Vložit wiki odkaz na entitu |
| `Ctrl+Shift+E` | Vložit include `{{include:…}}` |
| `Ctrl+Shift+S` | Vložit status `{{status:…}}` |
| `Ctrl+Shift+I` | Vložit příznak (nabídka emoji) |
| `Ctrl+Shift+M` | Z označeného textu vytvořit novou entitu |
| `Ctrl+Shift+A` | Přejít na lištu akcí s označeným textem |
| `Ctrl+Shift+G` | Označený text poslat umělé inteligenci s vlastním zadáním |

### Skrytí hotových úkolů

Pokud má obsah (nebo markdownový atribut) zaškrtnuté úkoly `- [x]`, objeví se tlačítko pro jejich **skrytí v náhledu** — text se nezmění, jen se přehledně schovají splněné položky.

## Odkládací prostor

Rychlé poznámky, výstřižky a dočasné nápady mimo databázi. Otevřete tlačítkem **📌 Odkládací prostor** nebo zkratkou `Alt+Shift+V`. Obsah se ukládá automaticky do prohlížeče a přetrvává mezi sezeními (není součástí databáze ani exportu).

Má vlastní lištu nástrojů: **📎 Vložit…**, **📥 Vložit z HTML** (převod formátovaného textu ze schránky na Markdown), mazání hotových úkolů a — po označení textu — akce nad výběrem včetně CriticMarkup, zvýraznění, komentáře a **🔗 Jako odkaz** (URL ze schránky). Fungují tu i klávesové zkratky pro editaci markdownu. Korektor, Revize a Lint jsou celoobrazovkové režimy dostupné přímo u entit, v odkládacím prostoru nejsou.

## Anotace

Anotace jsou krátké poznámky k jednotlivým řádkům či odstavcům obsahu. **Žijí přímo ve zdrojovém textu** jako zápis `(>text anotace)` na konci daného řádku — text je tak jediným zdrojem pravdy a anotace je vždy pevně svázaná se svým odstavcem (nemůže se „odpojit" ani přemapovat).

**Zápis přímo v textu**: napište `(>poznámka)` kamkoli na řádek. Při zobrazení a při `{{include:…}}` se z toho stane žlutá anotační bublina. Anotace je **prostý text** (ne markdown).

**Panel anotací** pod tělem entity vypisuje všechny anotace, ukazuje, ke kterému odstavci patří, a umožňuje je spravovat: **Upravit** (jednoduché jednořádkové pole, Enter uloží) a **Smazat** — obojí přímo mění `(>text)` ve zdroji.

**Zapnutí anotačního režimu**: klávesa `a` v read modu detailu nebo tlačítko **📝 Anotace**. V režimu se u každého řádku objeví tlačítko **+ Anotace**, které přidá `(>…)` na konec toho řádku.

**Jednotka anotace = jeden řádek**. Pro normální odstavec to znamená celý odstavec; pro **bullet/ordered list** je to **jednotlivá `<li>`**; pro **tabulku** je to **jednotlivý `<tr>`**.

**Kde se anotace zobrazí a kde ne**:
- **Zobrazení a include** (`{{include:…}}`) — anotace se vyrenderuje jako bublina
- **Export, tisk, kopírování zdroje i formátovaného** — anotace se **vynechá** (do výstupu nejde)

**Migrace**: pokud máte ještě staré anotace uložené odděleně (z dřívější verze), při prvním uložení entity se automaticky převedou do textu jako `(>text)` u svého odstavce.

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

## Téma 🌳

Aspekt **Téma (Topic)** je „virtuální entita", která automaticky sbírá obsah do jednoho rozcestníku. Entity do tématu spadají třemi způsoby:

- **podle tagu** — nastavíte téma `topic_tag` a všechny entity s tímto tagem se objeví v tématu
- **ručně připnuté** — vyberete konkrétní entity do pole klíčových entit
- **přes vazbu „je součástí"** — každá entita, která má na téma vazbu `partOf`, se v tématu objeví (z pohledu tématu jako „obsahuje")

Entita, která spadá víc způsoby najednou, se v tématu ukáže jen jednou. Archivované entity se ignorují.

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
| `F10` | Hlavní nabídka (v režimu klasického menu) — dál šipky, Enter otevře, Esc zavře |
| `p` / `Alt+Shift+P` | Skok na první otevřený panel |
| `Esc` | Zavřít dialog / opustit edit / zpět |

### V detailu entity

| Klávesa | Akce |
|---|---|
| `e` | Přepnout edit ↔ čtení |
| `Shift+E` | Přepnout pokročilý editor ↔ čtení (jen u entit, které ho mají zapnutý) |
| `u` | V edit módu: uložit a zpět na čtení |
| `r` | Přidat vazbu na existující entitu |
| `Shift+R` | Vytvořit novou související entitu (lze rovnou zaškrtnout projekty zdrojové entity) |
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

## Přidávání nové entity rovnou do projektů

Když vytváříte novou entitu **z existující** — přes wiki odkaz na neexistující entitu, přes `Shift+R` (nová souvislost), nebo přes „📤 Do nové entity…" z označeného textu — nabídne se vám seznam **projektů zdrojové entity** jako předzaškrtnutá políčka. Co necháte zaškrtnuté, do těch projektů nová entita rovnou dostane vazbu `partOf` (je součástí). Když zdrojová entita v žádném projektu není, políčka se nezobrazí.

## Databázové direktivy `{{database:…}}` a `{{databasetext:…}}`

U entity s aspektem **Databáze** lze její záznamy vložit do textu jiné (nebo téže) entity:

- `{{database:Název}}` — vloží záznamy jako **Markdown tabulku**
- `{{databasetext:Název?format=…}}` — vloží záznamy jako **text** podle vlastní šablony (`format` s placeholdery `<<Sloupec>>`)

Za název lze přidat parametry oddělené `&`: `columns` (výběr sloupců), `filter` (podmínky), `sort` (řazení).

**Filtr** podporuje operátory `=`, `*` (obsahuje), `!=`, `<`, `>`, `<=`, `>=` a prázdnou hodnotu (nevyplněno). Víc podmínek oddělených čárkou se kombinuje logikou **A** (AND).

**OR seznam přes `|`**: u `=`, `*` a `!=` můžete uvést víc hodnot oddělených svislítkem — `filter=Kód=A|B|C` znamená „Kód je A **nebo** B **nebo** C". Funguje i na **počítaných sloučených polích**. (Pozn.: `Kód=A, Kód=B` je AND a nevrátí nic, protože buňka nemůže mít dvě hodnoty zároveň — pro „jednu z hodnot" použijte `|`.)

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

Tlačítka **📋 Zkopírovat zdroj** a **✨ Zkopírovat formátované** (pod tělem entity) i export a tisk vykreslují direktivy `{{include:…}}`, `{{database:…}}`, `{{status:…}}`, placeholdery a čítače — do schránky/exportu se tedy nedostane surová direktiva, ale její výsledek. **Inline anotace `(>text)` se do exportu, tisku ani kopírování nedostanou** (zůstávají jen ve zdroji a při include). Kopírování do schránky i stahování souborů funguje i v prostředích bez zabezpečeného kontextu (má spolehlivou záložní cestu).

Z detailu entity tlačítko **🖨 Export / tisk…** otevírá dialog s checkboxy pro každou sekci a výběrem formátu:

- **MD** — markdown (s expandováním include i `{{database:…}}` na tabulku a `{{status:…}}` na textový souhrn, vyhodnocením placeholderů a čítačů `((#))`, zjednodušením inline-selectů na `(!c!)`)
- **HTML** — pro tisk přímo z prohlížeče (Ctrl+P)
- **DOCX** — pro Word, Outlook, e-mailové klienty
- **PDF** — přes systémový tisk

Sekce **Úkoly schůzky** se vykresluje do MD/HTML/DOCX/PDF, ale **ne** do include (aby se schůzka v jiné entitě nezahrnula s celou tabulkou úkolů).

U entit s aspektem **Projekt** nabízí dialog navíc volbu **Úkoly po kategoriích** — do exportu (MD/HTML/DOCX) se vloží úkoly projektu seskupené do kanbanových kategorií (K udělání, Probíhá, Čeká, Hotovo) jako nadpisy se seznamem úkolů. Hodí se jako report o stavu projektu.

### Odkaz na konkrétní entitu

V detailu entity je tlačítko **🔗 Kopírovat odkaz**, které do schránky uloží odkaz vedoucí přímo na tuto entitu (drží databázi i konkrétní entitu přes parametry `?id=…&e=…`). Po otevření odkazu se načte databáze z GitHubu a skočí se rovnou na danou entitu. Adresní řádek navíc tento odkaz průběžně udržuje aktuální podle otevřené entity, takže jde zkopírovat i přímo odtud.

## Archivované položky v detailu

Archivace slouží k tomu, aby hotové a neaktuální věci zmizely z každodenní práce, ale zůstaly dohledatelné. V detailu entity se proto archivované položky **nezobrazují v běžných sekcích**:

- **Vazby** ukazují jen odchozí a příchozí vazby na aktivní entity,
- **Dashboard projektu** (včetně kanbanu úkolů, cílů, lidí a organizací) obsahuje jen aktivní podřízené entity,
- **Úkoly schůzky** a **Účastníci schůzky** ukazují jen aktivní položky.

Všechno archivované se místo toho sesbírá do jediné sbalené sekce **🗄 Archiv** úplně na konci detailu (nad technickou sekcí Meta). V závorce je počet položek; sekce je rozdělená na **archivované odchozí vazby** a **archivované příchozí vazby**, takže je u každé položky vidět, jakým vztahem k entitě patří — archivovaný úkol projektu se ukáže jako „je součástí", archivovaný účastník schůzky jako „účastní se" a podobně.

Archivovat a obnovovat se dá i odsud stejně jako odjinud; tlačítko pro odebrání vazby (×) funguje v sekci Archiv také.

## Umělá inteligence

Volitelná funkce: umožní poslat text jazykovému modelu s vlastním zadáním. Klíč zadáte v **Nastavení → Umělá inteligence** a ukládá se pouze ve vašem prohlížeči (`localStorage`, klíč `pim_ai_key`). Dokud klíč nezadáte, tlačítka se nikde nezobrazují.

**Dvě cesty, kudy text poslat:**

- **Označený text** — v editaci obsahu označte text a stiskněte `Ctrl+Shift+G`, nebo použijte tlačítko **✨ Umělá inteligence…** v liště nad označeným textem.
- **Celý obsah entity** — tlačítko **✨ Umělá inteligence…** pod obsahem entity. Pošle vyrenderovaný obsah: s vloženými `{{include:…}}`, doplněnými placeholdery a čítači a bez anotací — tedy přesně ten text, který jde do exportu a na GitHub přes `ghpath`.

**Okno** má pole na zadání (co se má s textem udělat), rozbalovací náhled **Co se odešle** a po odeslání textové pole s odpovědí. Odpověď si v něm můžete ještě upravit a pak zvolit:

- **📋 Zkopírovat** — do schránky,
- **📤 Jako nová entita** — založí novou entitu, název se odvodí z prvního řádku odpovědi,
- **↩ Nahradit označený text** — jen u varianty s výběrem; obsah pole se přepíše až tímhle tlačítkem, samo se nic nemění.

Odeslat jde i klávesou `Ctrl+Enter` z pole se zadáním.

**Co se neodesílá:** entity s aspektem **Zabezpečené** (ani odemčené) a bloky `~~~private`, které se ze vstupu vyříznou — okno pak napíše, kolik jich bylo. Před každým odesláním si můžete v náhledu ověřit, co přesně odchází.

### Chat nad vybranými entitami

V kterémkoli seznamu zapněte režim hromadného výběru (klávesa `x`), zaškrtněte entity a klikněte na **💬 Chat s vybranými**.

Otevře se pohled s konverzací. Obsah vybraných entit se přiloží jako **podklady k první otázce** — v dalších kolech už se neposílá znovu, pokračuje se historií konverzace. Odpověď se **vypisuje průběžně**, jak přichází ze služby, takže nemusíte čekat na celý text.

- Podklady jsou nahoře jako odkazy a jde je jednotlivě odebrat křížkem; rozbalovátko **Co se odešle jako podklady** ukáže přesný text.
- **Nová konverzace** zahodí zprávy a nechá podklady.
- **💾 Uložit jako entitu** založí entitu s přepisem konverzace a vazbami `mentions` na podklady. Bez toho se konverzace **nikam neukládá** — žije jen do zavření stránky, aby databáze nerostla.

Zabezpečené entity se mezi podklady nedostanou vůbec (aplikace to při otevření oznámí) a soukromé bloky `~~~private` se z obsahu vyříznou.

Model je předvolený; pole **Model** v nastavení ho umí přepsat, když je potřeba. Tlačítkem **Ověřit spojení** si nastavení otestujete. Funkce je jen v aplikaci — vygenerovaný offline prohlížeč ji neobsahuje a klíč se nedostane do exportu, do synchronizace na GitHub ani do statického prohlížeče.

## Datová synchronizace s GitHubem

V Nastavení nastavte GitHub Personal Access Token (fine-grained) a cílový repozitář. Tlačítko **☁ Sync** (`Alt+Shift+S`) uloží aktuální stav (JSON) jako commit přes Contents API. Pro velké soubory (>900 KB) se použije Git Blob API.

Také je k dispozici **statický prohlížeč** — generuje samostatný HTML soubor s vašimi entitami v read-only režimu, vhodný pro sdílení.

### Ukládání jednotlivých souborů do repozitáře — `ghpath` a `ghpngpath`

Kromě synchronizace celé databáze umí PIM uložit **konkrétní soubor na konkrétní místo** v libovolném repozitáři. Slouží k tomu dva vlastní atributy entity:

| Atribut | Co uloží | Kde je tlačítko |
|---|---|---|
| `ghpath` | rozexpandované tělo entity (direktivy, placeholdery a čítače se vyhodnotí stejně jako při exportu) | **☁ Uložit na GitHub** pod obsahem entity |
| `ghpngpath` | vyrenderované **PNG diagramu** (jen u entit s aspektem Diagram) | **☁ Uložit PNG na GitHub** v nástrojové liště diagramu |

Hodnotou je cesta ve tvaru `owner/repo/cesta/soubor.ext` — první dva segmenty jsou vlastník a repozitář, zbytek cesta v něm. Například `egdilna/uilab/website.md` nebo `egdilna/uilab/img/architektura.png`.

Ukládá se do větve `main` a **existující soubor se přepíše** (PIM si sám dohledá jeho SHA); pokud soubor ještě neexistuje, vytvoří se. Používá se stejný GitHub token jako pro synchronizaci.

Oba atributy jsou nezávislé: entita může mít jen jeden z nich, nebo oba — pak se každým tlačítkem uloží jiný soubor na jiné místo.

## Časté otázky

**Kde jsou moje data?** V `localStorage` prohlížeče pod klíčem `pim_db_v1::DEFAULT` (nebo `pim_db_v1::IDP_ID` pro projektové stránky).

**Mohu mít víc oddělených databází?** Ano, přes URL parametr `?id=NAZEV`. Každý ID má vlastní storage.

**Jak zálohovat?** Nástroje → Export → JSON. Nebo zapnout GitHub sync.

**Mohou ostatní vidět mé Zabezpečené poznámky?** Ne. Jejich obsah je AES-GCM šifrovaný heslem, které se nikam neukládá. Bez hesla nikdo nezíská plain text.
