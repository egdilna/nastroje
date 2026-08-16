# Mronenote — přístupný poznámkový blok v jediném HTML

**Online verze nástroje:** [https://egdilna.github.io/nastroje/mronenote](https://egdilna.github.io/nastroje/mronenote)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#mronenote](https://egdilna.github.io/nastroje/#mronenote)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Mronenote** je webová aplikace pro vedení strukturovaného poznámkového bloku typu outliner. Inspiruje se pracovní logikou aplikací jako OneNote, ale běží v jediném souboru HTML — bez serveru, bez instalace a bez cizích knihoven. Obsah bloku se v prohlížeči neukládá; ukládání zajišťuje buď ruční export do souboru `.json`, nebo synchronizace s repozitářem na GitHubu.

### Klíčové funkce

- **Hierarchická struktura** — poznámkový blok se skládá ze **skupin oddílů**, **oddílů**, **stránek** a jejich **podstránek**; každá stránka pak nese vlastní osnovu odstavců s libovolnou hloubkou zanoření.
- **Osnovový editor (outliner)** — řádky lze zanořovat (Tab), přesouvat (Alt+šipky), sbalovat a rozbalovat, měnit jim styl (odstavec, nadpisy 1–3, citace, kód) a typ seznamu (odrážky, číslování, zaškrtávátka).
- **24 přednastavených příznaků** — barevné štítky pro úkoly, otázky, důležité, kontakty, adresy, hesla, citace, nápady, rizika, rozhodnutí a další; každý příznak lze přejmenovat, dostat jiný symbol nebo barvu, případně skrýt.
- **Textový blok v Markdownu** — pro delší souvislé texty lze řádek přepnout na Markdown blok se živým náhledem (nadpisy, tučně, kurzíva, kód, tabulky s odrážkami, citace, čára, code fence).
- **Markdown při psaní** — automatický převod běžných značek přímo v běžném řádku (`**tučně**`, `# nadpis`, `- odrážka`, `- [ ]` úkol, `> citace`, `==zvýrazněno==`, `~~přeškrtnuto~~`).
- **Wiki odkazy `[[Název stránky]]`** — po napsání se po opuštění řádku automaticky převedou na klikací odkaz; kliknutí na chybějící stránku nabídne její vytvoření.
- **Vnitřní odkazy na identifikátor** — kopírování odkazu na konkrétní odstavec, stránku, oddíl, skupinu i celý blok; odkaz přežije přejmenování cíle.
- **CriticMarkup pro sledování změn** — značky `{++…++}`, `{--…--}`, `{~~…~>…~~}`, `{>>…<<}`, `{==…==}` se v DOCX exportu převedou na skutečné revize Wordu a komentáře.
- **Import a export** — celý blok lze uložit jako `.json` (.mron.json), exportovat do HTML, Markdownu nebo DOCX (samotná stránka i celý blok), importovat Markdown.
- **Synchronizace s GitHubem** — automatické ukládání do libovolného souboru v repozitáři včetně soukromého; kolize se automaticky řeší přenačtením a opakovaným uložením.
- **Panely** — přepínatelný pravý panel se souhrnem příznaků v bloku nebo přehledem odkazů z i na aktuální stránku.
- **Hledání** — fulltextové hledání v rámci celého bloku, oddílu nebo stránky, s filtry na příznak, velikost písmen a názvy stránek.
- **Historie stránky** — na každé stránce lze uložit snímek a později se k němu vrátit (posledních 20 verzí).
- **Barevné oddíly** — oddíl i skupina oddílů mohou dostat jednu z devíti barev; barva se dědí ze skupiny a hlásí se i textem pro odečítač obrazovky.
- **Undo / Redo** — 60 kroků zpět a znovu pro každou úpravu obsahu i struktury.

### Přístupnost

Nástroj je stavěn s důrazem na přístupnost — semantické HTML, ARIA atributy pro nabídky, stromy a živé oblasti (`aria-live`), plná ovladatelnost klávesnicí, tři motivy (světlý, tmavý, vysoký kontrast), nastavitelná velikost písma 12–28 px. Symboly příznaků a barvy jsou vždy doplněny textovým popisem, aby je odečítač obrazovky správně přečetl. Ve stromu i v obsahu je při pohybu tabulátorem vždy jen jeden vstupní bod; uvnitř se pohybujete šipkami.

### Uložení dat

Obsah poznámkového bloku se v prohlížeči **neukládá**. V úložišti prohlížeče je pouze konfigurace synchronizace s GitHubem (repozitář, cesta, token, větev). Data putují buď na GitHub, nebo do souboru `.json`. Aplikace nepotřebuje ke svému běhu server ani připojení k internetu; internet se využívá jen pro synchronizaci s GitHubem.

---

## Navigace a rozložení

Aplikace se skládá z několika hlavních oblastí, které se skládají shora dolů.

### Záhlaví aplikace

Obsahuje název aplikace „Mronenote", název aktuálně otevřené stránky (nadpis 1. úrovně) a drobečkovou navigaci (blok › oddíl › nadřízená stránka › stránka).

### Hlavní nabídka (menubar)

Vodorovná lišta nabídek přístupná klávesou **F10** a přes **Alt** + podtržené písmeno. Nabídky:

| Nabídka | Zkratka | Obsah |
|---|---|---|
| **S**oubor | Alt+S | Nový blok, otevřít, uložit .json, schránka, exporty (HTML, Markdown, DOCX), import Markdownu, GitHub, tisk, nastavení |
| **Ú**pravy | Alt+U | Zpět/znovu, přidat/smazat řádek, zanořit/vynořit, přesun, kopírování odkazů, hledání |
| **F**ormát | Alt+F | Tučně, kurzíva, podtržení, přeškrtnutí, kód, zvýraznění, zrušit formát, styl odstavce a typ seznamu |
| **V**ložit | Alt+V | Odkaz, wiki odkaz, vnitřní odkaz, tabulka, obrázek, příloha, CriticMarkup značky, datum, oddělovač |
| **P**říznaky | Alt+P | Nabídka všech příznaků, dialog příznaků, správa příznaků, odebrání příznaků, hotovo, panel souhrnu |
| **B**lok a stránky | Alt+B | Nový oddíl, skupina, stránka, podstránka, přejmenování, přesun, smazání, historie, panel odkazů |
| **Z**obrazení | Alt+Z | Režim úprav/čtení, sbalit/rozbalit, sbalit vše, sbalit do úrovně, úklid zaškrtávátek |
| **N**ápověda | Alt+N | Kompletní nápověda a přehled zkratek (F1) |

### Rychlá lišta akcí (quickbar)

Pruh pod hlavní nabídkou obsahuje nejčastěji potřebná tlačítka:

| Tlačítko | Funkce |
|---|---|
| **Režim: úpravy / čtení** | Přepnutí režimu (F2) |
| **Zanořit** / **Vynořit** | Zanoření a vynoření řádku |
| **Nahoru** / **Dolů** | Přesun řádku |
| **Sbalit/rozbalit** | Sbalení aktuálního řádku |
| **Úkol**, **Důležité**, **Otázka** | První tři příznaky v pořadí |
| **Wiki odkaz** | Vložení wiki odkazu |
| **Hledat** | Otevření dialogu hledání |

### Postranní strom (navigace bloku)

Levý panel zobrazuje strom skupin, oddílů, stránek a podstránek. Nahoře je pole **Rychlý filtr stránek** — hledaný text se hned zvýrazní ve stromu. Panel lze skrýt tlačítkem **☰ Skrýt panel** vlevo nahoře; šířku lze měnit tažením za pravou hranu.

### Pracovní plocha

Zobrazuje editovatelné pole s názvem právě otevřené stránky, nadpis **Obsah stránky** a osnovu jejích řádků. Vlevo u každého řádku je trojúhelník pro sbalování, v úpravách i tlačítko **⋮** s kontextovou nabídkou řádku. Pod osnovou je tlačítko **Přidat řádek na konec**.

### Postranní panel (volitelný)

Pravý panel se aktivuje v nabídce **Příznaky → Souhrn příznaků (panel)** nebo **Blok a stránky → Odkazy stránky (panel)**. Slouží k přehledu; skryje se opětovným zvolením volby.

### Stavový řádek a lišta GitHubu

Pod pracovní plochou hlásí stavový řádek výsledek poslední akce (např. „Zanořeno o úroveň níž.") a lišta GitHubu ukazuje repozitář, se kterým je aplikace spojena, a čas posledního uložení (např. „uloženo před 12 s").

### Ladicí výpis

Volitelný panel (zapíná se v Nastavení) ukazuje časový přehled operací (spuštění, uložení, chyby GitHubu). Slouží k ladění a hlášení problémů.

---

## Poznámkový blok a jeho struktura

### Hierarchie

```
Poznámkový blok
├── Skupina oddílů (volitelně vnořená)
│   └── Oddíl
│       └── Stránka
│           └── Podstránka
│               └── Podstránka…
└── Oddíl
    └── Stránka
```

- **Skupina oddílů** může obsahovat oddíly i další skupiny. Doporučuje se nezanořovat hlouběji než tři úrovně.
- **Oddíl** obsahuje pouze stránky.
- **Stránka** obsahuje libovolně zanořené řádky a případně podstránky.

### Vytváření a přesun

| Akce | Kde |
|---|---|
| Nový oddíl | Nabídka **Blok a stránky → Nový oddíl…**, zkratka **Ctrl+Shift+N** |
| Nová skupina oddílů | Nabídka **Blok a stránky → Nová skupina oddílů…** |
| Nová stránka | **Ctrl+N**, případně z dialogu oddílu |
| Nová podstránka | Nabídka **Blok a stránky → Nová podstránka…** |
| Přejmenování stránky | Kliknutím do pole s názvem stránky, nebo přes **Blok a stránky → Přejmenovat stránku…**; wiki odkazy na starý název se automaticky přepíší |
| Přesun stránky | Nabídka **Blok a stránky → Přesunout stránku…**; cílem může být oddíl (na konec) nebo jiná stránka (stane se podstránkou) |
| Přesun oddílu / skupiny | V dialogu oddílu/skupiny volbami **Přesunout do** a **Pozice** |
| Změna pořadí | Přes dialog položky nebo klávesovými zkratkami při editaci pozice |

Přesun sebou vezme celý podstrom; do vlastního potomka přesunout nelze (smyčka).

### Dialog oddílu

Kliknutí na oddíl v levém stromu otevře jeho dialog s poli **Název oddílu**, **Barva**, **Přesunout do** a **Pozice** a s tlačítky **Uložit**, **Přidat stránku**, **Smazat oddíl** a **Zrušit**.

### Dialog skupiny oddílů

Kliknutí na skupinu otevře její dialog s poli **Název skupiny oddílů**, **Barva**, **Přesunout do** a **Pozice**, dále s tlačítky **Uložit**, **Přidat oddíl**, **Přidat podskupinu**, **Smazat skupinu** a **Zrušit**.

### Barvy oddílů

Oddíl i skupinu oddílů lze obarvit jednou z devíti barev: modrá, zelená, červená, fialová, oranžová, tyrkysová, růžová, hnědá, šedá. Oddíly bez vlastní barvy dědí barvu skupiny. Barva se zobrazuje jako pruh nalevo a jako tečka u názvu; **v odečítači obrazovky se hlásí i textem** (např. „Oddíl Práce, 4 stránky, barva modrá").

### Rychlý filtr stránek

Nad stromem je pole **Rychlý filtr stránek**. Napsaný text se okamžitě promítne do stromu — položky, které neodpovídají a nemají odpovídající potomka, se skryjí. Šipkou dolů z filtru vstoupíte do stromu.

---

## Práce s řádky (osnova)

Hlavním prvkem stránky je **řádek**. Řádky lze libovolně zanořovat, řadit, sbalovat, měnit jim styl, typ seznamu, přiřazovat příznaky a vkládat do nich formátovaný text.

### Vytváření a přesun řádků

| Akce | Zkratka |
|---|---|
| Nový řádek pod aktuální | **Enter** |
| Zanořit řádek pod předchozí | **Tab** |
| Vynořit řádek o úroveň výš | **Shift+Tab** |
| Přesun řádku nahoru / dolů | **Alt+↑** / **Alt+↓** |
| Sbalit / rozbalit řádek | **Ctrl+.** |
| Smazat prázdný řádek | **Backspace** (v prázdném řádku) |
| Pohyb mezi řádky | šipky **↑** / **↓** |

Za úkolem se **nový řádek na úkol nedědí**, aby zaškrtávátko nevznikalo u běžných řádků. Odrážky a číslování naopak pokračují.

### Styl řádku

Styl řádku se mění v nabídce **Formát → Styl odstavce**, klávesou **F3** (otevře kontextovou nabídku rovnou na podnabídce Styl řádku), nebo v kontextové nabídce řádku:

| Styl | Vzhled |
|---|---|
| Odstavec | Základní |
| Nadpis 1, 2, 3 | Zvětšený tučný text |
| Citace | Kurzíva s levým pruhem |
| Kód | Neproporcionální písmo s podbarvením |
| Textový blok (Markdown) | Editor Markdownu s živým náhledem |
| Oddělovač | Vodorovná čára (vloží se přes **Vložit → Oddělovač**) |

### Typ seznamu

| Typ | Význam |
|---|---|
| Bez odrážky | Běžný řádek |
| Odrážka | Puntík |
| Číslování | Automatické pořadové číslo |
| Zaškrtávátko | Řádek typu úkol, se skutečným checkboxem |

Řádek s příznakem **Úkol** dostává zaškrtávátko automaticky. Volba **Zobrazení → Zrušit zaškrtávátka u prázdných úkolů…** hromadně opraví řádky, které zbyly zaškrtávacím polem omylem.

### Kontextová nabídka řádku

Otevře se pravým tlačítkem myši, klávesou kontextové nabídky, **Shift+F10** nebo tlačítkem **⋮** vlevo od řádku (užitečné na dotykových zařízeních). Obsahuje:

- Vyjmout / Kopírovat / Vložit
- Tučně, Kurzíva, Podtržení, Zvýraznění, Zrušit formátování
- Odkaz, Wiki odkaz, Vnitřní odkaz, Kopírovat odkaz na tento odstavec, Vložit zkopírovaný odkaz
- **Příznaky** (podnabídka se všemi příznaky jako přepínači)
- Označit jako hotové / nehotové
- Odebrat všechny příznaky
- **Styl řádku** (podnabídka)
- **Typ seznamu** (podnabídka)
- Zanořit, Vynořit, Přesunout nahoru / dolů, Sbalit / Rozbalit
- Přidat řádek pod
- Smazat řádek

Pohyb šipkami nahoru a dolů, podnabídka **šipkou doprava**, zpět **šipkou doleva**, potvrzení **Enterem** nebo **mezerou**, zavření **Escape**.

### Sbalování a hromadné operace

- **Zobrazení → Sbalit vše** / **Rozbalit vše** — hromadně sbalí nebo rozbalí všechny řádky aktuální stránky.
- **Zobrazení → Sbalit do úrovně** — vybere se úroveň 1–5, na které zůstanou položky rozbalené.
- **Zobrazení → Zrušit zaškrtávátka u prázdných úkolů…** — spočítá řádky se zaškrtávátkem, které nejsou označené jako úkol, a po potvrzení je převede zpět na běžné řádky.

---

## Formátování textu

Formátování se aplikuje na označený text uvnitř řádku.

| Formát | Zkratka | Poznámka |
|---|---|---|
| Tučně | **Ctrl+B** | |
| Kurzíva | **Ctrl+I** | |
| Podtržení | **Ctrl+U** | |
| Přeškrtnutí | přes nabídku Formát | |
| Kód | přes nabídku Formát | Neproporcionální písmo |
| Zvýraznění | **Ctrl+Shift+H** | Žluté podbarvení |
| Zrušit formátování | přes nabídku Formát | Odstraní veškeré značky |

Povoleny jsou tyto HTML značky (vše ostatní se při sanitizaci rozbalí): `B`, `I`, `U`, `S`, `EM`, `STRONG`, `CODE`, `SPAN`, `A`, `BR`, `SUP`, `SUB`, `MARK`, `IMG`, `H1`–`H6`, `P`, `UL`, `OL`, `LI`, `BLOCKQUOTE`, `PRE`, `HR`, `INPUT` (jen zaškrtávátko z Markdownu). Zakázáno je vkládání JavaScriptu, `on*` atributů a nedůvěryhodných zdrojů `src`.

---

## Textový blok (Markdown)

Běžný řádek nese jednu myšlenku; **textový blok** unese celou podkapitolu psanou v Markdownu.

**Jak jej vytvořit:** u prázdného řádku klikněte na tlačítko **Markdown** vedle pole, nebo v kontextové nabídce řádku zvolte **Styl řádku → Textový blok (Markdown)**.

**V úpravách** píšete syrový Markdown do textového pole a pod ním vidíte živý náhled. V **režimu čtení** se zobrazí jen vyrenderovaný text.

**Ovládání:** **Enter** vytváří nový řádek uvnitř bloku; nový řádek osnovy za blokem vytvoříte **Ctrl+Enter**. **Escape** blok opustí do stromu osnovy.

**Podporováno:** nadpisy `#`–`######`, odstavce, `**tučně**`, `*kurzíva*`, `_kurzíva_`, `` `kód` ``, `~~přeškrtnuté~~`, `==zvýrazněné==`, odkazy `[text](url)`, obrázky `![alt](url)`, odrážky `-`/`*`/`+`, číslování `1.`, vnořené seznamy, zaškrtávací seznam `- [ ]` / `- [x]`, citace `>`, čára `---`, blok kódu ` ``` `.

**Export:** do Markdownu se text bloku vloží tak, jak je; do HTML a Wordu se vyrenderuje.

### Markdown při psaní (v běžném řádku)

Pokud je v Nastavení zapnut **převod Markdownu při psaní**, ihned se konvertují:

- **Na začátku řádku:** `#` nadpis, `##` a `###` nižší nadpisy, `####` nadpis 3, `-` nebo `*` odrážka, `1.` číslování, `>` citace, `` ``` `` kód, `- [ ]` a `- [x]` úkol.
- **Uvnitř textu:** `**tučně**`, `*kurzíva*` nebo `_kurzíva_`, `` `kód` ``, `~~přeškrtnuté~~`, `==zvýrazněné==`.
- **Odkazy:** `[popisek](https://adresa)` a holé adresy `https://…` nebo `www.…` se převedou na klikací odkaz; samotný e-mail v `[popisek](adresa)` na `mailto:`.
- Holá adresa se převede až po napsané mezeře nebo při opuštění řádku, aby se tečky uvnitř adresy nespletly s koncem věty.
- Vložená značka se převede, jakmile dopíšete uzavírací znak; řádková po mezeře za značkou.

---

## Příznaky (štítky řádků)

Řádek může nést libovolný počet **příznaků** — barevných štítků s emoji symbolem a názvem. Slouží k pozdějšímu filtrování, hledání a přehledům.

### Výchozích 24 příznaků

| Symbol | Název | Barva | Symbol | Název | Barva |
|---|---|---|---|---|---|
| ☐ | Úkol | modrá | 🏠 | Adresa | hnědá |
| ✅ | Hotový úkol | zelená | 📞 | Telefonní číslo | modrá |
| ⭐ | Důležité | červená | ✉️ | E-mail | modrá |
| ❓ | Otázka | oranžová | 📅 | Schůzka | fialová |
| 📌 | Zapamatovat na později | fialová | 🗂️ | Název projektu | šedá |
| 📗 | Definice | zelená | 🔑 | Heslo a přístup | hnědá |
| 🔆 | Zvýrazněné | žlutá | 📖 | Kniha ke čtení | hnědá |
| 👤 | Kontakt | modrá | 🎬 | Film ke zhlédnutí | fialová |
| 🎵 | Hudba k poslechu | fialová | 💬 | Citace | šedá |
| 🛒 | Nákup | zelená | 💡 | Nápad | žlutá |
| ⚖️ | K diskusi | oranžová | ⚠️ | Riziko | červená |
| ✔️ | Rozhodnutí | zelená | 🔗 | Zdroj a odkaz | modrá |

### Přidávání a odebírání

| Akce | Kde |
|---|---|
| Nabídka příznaků řádku | Nabídka **Příznaky** (obsahuje seznam všech příznaků jako přepínače) |
| Otevření nabídky příznaků klávesou | **F4** |
| První tři příznaky v pořadí | **Ctrl+Shift+1**, **Ctrl+Shift+2**, **Ctrl+Shift+3** |
| Označit hotovo / nehotovo | **Ctrl+Shift+D** (přidá `Hotový úkol`, odebere `Úkol`) |
| Smazat všechny příznaky řádku | **Shift+F4** nebo **Příznaky → Odebrat příznaky z řádku** |
| Detailní dialog příznaků | **Příznaky → Příznaky řádku v dialogu…** |

### Správa příznaků

Nabídka **Příznaky → Spravovat příznaky…** otevře tabulku, v níž lze:

- **Přejmenovat** příznak, změnit **symbol** (emoji nebo obyčejný znak) i **barvu**.
- Změnit **pořadí** šipkami ve sloupci Pořadí — první tři pak reagují na zkratky **Ctrl+Shift+1** až **3** a jsou v rychlé liště jako **Úkol**, **Důležité**, **Otázka**.
- **Skrýt** nepoužívaný příznak z nabídky (u řádků, kde už je použit, zůstane).
- Sledovat sloupec **Použití** s počtem výskytů v bloku.
- **Vybrat symbol ze seznamu…** — nabídne dialog s emoji a znaky, které se vloží do naposledy upravovaného pole.
- **Obnovit výchozí nastavení příznaků** — vrátí u všech 24 příznaků výchozí název, symbol i barvu.

**Klíč příznaku (vnitřní identifikátor) je neměnný**, proto úpravy nerozbijí existující označení. Nastavení příznaků se ukládá **do bloku**, putuje tedy se souborem.

### Souhrn příznaků (pravý panel)

Nabídka **Příznaky → Souhrn příznaků (panel)** zobrazí v pravém panelu přehled všech použitých příznaků v bloku, s počtem výskytů a klikacími odkazy na jednotlivé řádky. Nabízí filtr **Zobrazit příznak**, kterým lze omezit zobrazení na jeden vybraný.

---

## Odkazy

Mronenote rozlišuje tři druhy odkazů.

### 1. Externí odkazy (HTTP, mailto)

Vloží se z nabídky **Vložit → Odkaz…** nebo zkratkou **Ctrl+K**. Dialog nabízí URL a viditelný popisek (předplní se aktuálně označeným textem). Kliknutí na odkaz v obsahu si nejprve vyžádá potvrzení a poté ho otevře v novém okně; s **Ctrl** se otevře přímo.

### 2. Wiki odkazy `[[Název stránky]]`

Odkazují na stránku podle názvu. Vytvoříte je:

- Zkratkou **Ctrl+Shift+K** nebo z nabídky **Vložit → Wiki odkaz…** (nabídne seznam existujících stránek).
- Ručně zápisem `[[Název stránky]]` v textu — po opuštění řádku se automaticky převede.
- Formát `[[Cíl|Zobrazený text]]` umožňuje jiný popisek než název cíle.

Kliknutí na odkaz na neexistující stránku nabídne její okamžité vytvoření. Chybějící cíle jsou v textu vyznačeny čárkovaným podtržením a najdete je i v panelu **Odkazy stránky**.

Wiki odkazy míří na název — při přejmenování cílové stránky se **automaticky přepíší** ve všech řádcích celého bloku.

### 3. Vnitřní odkazy na identifikátor

Odkazují na konkrétní odstavec, stránku, oddíl, skupinu oddílů nebo celý blok pomocí vnitřního ID (formát `mronenote:<druh>/<id>`). Přežijí přejmenování cíle.

| Akce | Zkratka / Kde |
|---|---|
| Kopírovat odkaz na odstavec | **Ctrl+Shift+C** nebo **Úpravy → Kopírovat odkaz na odstavec** |
| Kopírovat odkaz na stránku | **Úpravy → Kopírovat odkaz na stránku** |
| Kopírovat odkaz na oddíl | **Úpravy → Kopírovat odkaz na oddíl** |
| Kopírovat odkaz na celý blok | **Úpravy → Kopírovat odkaz na poznámkový blok** |
| Vložit zkopírovaný odkaz | **Ctrl+Shift+V** |
| Vybrat cíl ze seznamu | **Vložit → Vnitřní odkaz na odstavec či stránku…** |

Po přechodu na vnitřní odkaz se cílový odstavec zvýrazní (blikne) a získá fokus. Odkaz se do systémové schránky ukládá v čitelném tvaru `text <mronenote:druh/id>`.

### Panel odkazů stránky

**Blok a stránky → Odkazy stránky (panel)** zobrazí v pravém panelu:

- **Odkazy z této stránky** (wiki odkazy)
- **Odkazy na tuto stránku** (backlinks)
- **Vnitřní odkazy z této stránky**
- **Vnitřní odkazy na tuto stránku**
- **Chybějící cíle** wiki odkazů (s tlačítkem pro vytvoření chybějící stránky)

---

## Vkládání

Nabídka **Vložit** kromě odkazů umožňuje vkládat:

| Prvek | Detail |
|---|---|
| **Tabulku…** | Zvolíte počet řádků a sloupců a popisek; vloží se jako podřízené řádky osnovy (každý řádek tabulky jako samostatná položka, buňky oddělené středníkem) — zajišťuje čitelnost v odečítači obrazovky |
| **Obrázek…** | Nahrání souboru z disku, povinný alternativní text pro přístupnost |
| **Přílohu…** | Libovolný soubor (uloží se do bloku jako data URL); zobrazí se odkaz se jménem a velikostí |
| **Datum a čas** | Vloží aktuální datum a čas v českém formátu |
| **Oddělovač** | Vodorovná čára jako samostatný řádek |

**Přílohy a obrázky se ukládají přímo do bloku** (a tedy i do souboru `.json` a synchronizovaného souboru na GitHubu). Fungují bez serveru, ale velké soubory výrazně zvětší uložený blok — doporučuje se vkládat menší přílohy.

### CriticMarkup (sledování změn)

Značky pro revizi textu:

| Značka | Význam | Zápis |
|---|---|---|
| Vložený text | Nový text | `{++text++}` |
| Smazaný text | K odstranění | `{--text--}` |
| Záměna | Původní za nový | `{~~původní~>nový~~}` |
| Poznámka | Komentář revizora | `{>>poznámka<<}` |
| Zvýraznění | Zvýraznit v textu | `{==text==}` |

Značky lze psát ručně nebo vložit z nabídky **Vložit → Revize: …**. **Při exportu do DOCX vzniknou skutečné sledované změny Wordu a skutečné komentáře**, které recipient přijímá nebo odmítá běžnou cestou.

---

## Režimy

Přepínač **Režim: úpravy / čtení** v rychlé liště (nebo klávesa **F2**, případně v nabídce **Zobrazení**).

| Režim | Chování |
|---|---|
| **Úpravy** | Řádky jsou editovatelné, aktivní jsou všechna tlačítka a zkratky pro změny |
| **Čtení** | Obsah nelze měnit, text lze pohodlně vybírat a kopírovat, odkazy se otevírají klávesou **Enter**; zaškrtávátka úkolů zůstávají funkční |

**Po spuštění aplikace je vždy zvolen režim čtení.** Zvolený režim se pamatuje spolu s blokem (v nastavení bloku).

### Navigace v obsahu ve čtení

Ve čtení má obsah **jeden vstupní bod tabulátoru** (chová se jako strom):

| Klávesa | Akce |
|---|---|
| **↑** / **↓** | Předchozí / další řádek |
| **→** | Rozbalit řádek; druhý stisk přejde na první podřízený |
| **←** | Sbalit řádek; u sbaleného přejde na nadřízený |
| **Home** / **End** | Začátek / konec obsahu |
| **F6** / **Shift+F6** | Přeskočí mezi stromem, obsahem a hlavní nabídkou |

### Navigace v levém stromu

Analogická logika: **↑ ↓** procházení, **→** rozbalit + přejít, **←** sbalit + přejít na rodiče, **Home** / **End** skok na kraje. Z pole rychlého filtru lze do stromu vstoupit šipkou **↓**. Kliknutí na oddíl otevře dialog oddílu, kliknutí na skupinu otevře dialog skupiny, kliknutí na stránku ji otevře.

---

## Hledání

**Ctrl+F** nebo **Úpravy → Hledat…** otevře dialog hledání.

| Parametr | Volby |
|---|---|
| **Hledaný výraz** | Volný text |
| **Rozsah** | Celý blok / aktuální oddíl / aktuální stránka |
| **Jen s příznakem** | Libovolný filtr na konkrétní příznak |
| **Rozlišovat velikost písmen** | ANO/NE |
| **Hledat i v názvech stránek** | ANO/NE |

Výsledky se zobrazí v dialogu s klikacími odkazy — kliknutí přejde přímo na příslušný řádek. Ve výsledku je nalezený výraz zvýrazněn a doplněn popisem oddílu, stránky a případných příznaků řádku.

---

## Historie stránky

**Blok a stránky → Historie stránky…** ukazuje datum vytvoření, datum poslední změny a seznam ručně uložených snímků stránky. Tlačítko **Uložit současnou verzi** zapíše aktuální obsah do historie; **Obnovit verzi z…** obsah stránky nahradí zvolenou verzí (po potvrzení). Historie je vázaná ke stránce, ukládá se spolu s blokem a udržuje nejvíce 20 posledních verzí (starší se zahazují).

---

## Uložení, export a import

### Uložení do souboru

**Soubor → Uložit jako .json…** stáhne celý blok jako soubor `název.mron.json` — plnohodnotný snímek se všemi stránkami, přílohami, historií i konfigurací příznaků.

### Otevření souboru

**Soubor → Otevřít soubor…** otevře systémový výběr souboru; podporované přípony `.json`, `.mron`, `application/json`. Načtený obsah nahradí aktuální blok.

### Nový poznámkový blok

**Soubor → Nový poznámkový blok…** po potvrzení názvu vytvoří prázdný blok s jedním oddílem („Oddíl 1") a jednou stránkou („První stránka").

### Schránka

| Akce | Zkratka |
|---|---|
| Zkopírovat celý blok do schránky | **Ctrl+Shift+S** |
| Načíst celý blok ze schránky | **Ctrl+Shift+O** |

Pokud prohlížeč přístup ke schránce nepovolí, aplikace nabídne textové pole s náhradním postupem (ručně **Ctrl+C** / **Ctrl+V**).

### Exporty

| Formát | Co obsahuje |
|---|---|
| **HTML** | Celý blok s hierarchií nadpisů, seznamy řádků, štítky příznaků, přeškrtnutými hotovými úkoly |
| **Markdown** | Celý blok jako `.md`; textové bloky Markdown se vloží tak, jak jsou; příznaky jako `symbol @klic` |
| **DOCX — stránka** | Aktuální stránka jako Word dokument |
| **DOCX — celý blok** | Celý blok jako Word dokument |

**Detaily DOCX exportu:**

- Nadpisy používají vestavěné styly Wordu (Heading1–Heading4) — lze z nich vygenerovat obsah.
- Úkoly mají zaškrtávací pole (☐/☒), hotové úkoly přeškrtnutí.
- Příznaky se vypisují jako čitelný štítek na začátku odstavce (`[symbol název]`) — srozumitelné v tisku i v odečítači.
- CriticMarkup se převede na skutečné sledované změny (`w:ins`, `w:del`) a skutečné komentáře Wordu.
- Balík `.docx` se sestavuje přímo v prohlížeči (vlastní ZIP writer bez knihoven).

### Import Markdownu

**Soubor → Importovat Markdown…** vytvoří v bloku nový oddíl a v něm novou stránku, do níž převede strukturu Markdownu na osnovu (nadpisy → styly odstavce, odrážky → hierarchie, úkoly `- [ ]`, wiki odkazy `[[…]]`, `[text](url)`, holé adresy, značky příznaků `symbol @klic`).

### Tisk

**Soubor → Tisk stránky** nejprve rozbalí všechny řádky a spustí tisk prohlížeče. Postranní panel, nabídky a stavový řádek jsou v tisku skryty.

---

## Synchronizace s GitHubem

Volitelná synchronizace uloží obsah bloku do zvoleného souboru v repozitáři na GitHubu (přes GitHub REST API).

### Nastavení

**Soubor → Nastavení GitHubu…** otevře dialog:

| Pole | Popis |
|---|---|
| **Repozitář a cesta k souboru** | Tvar `vlastnik/repozitar/slozka/soubor.mrone`, například `michalradacz/experimenty/mronenote/public.mrone` |
| **Větev** | Nepovinná; prázdné = výchozí větev repozitáře |
| **Přístupový token GitHubu** | Osobní token s oprávněním ke čtení i zápisu obsahu; funguje i se soukromým repozitářem |
| **Automaticky ukládat změny na GitHub** | Přepínač automatického ukládání |

Tlačítka dialogu: **Uložit nastavení**, **Ověřit spojení**, **Načíst z GitHubu**, **Uložit na GitHub**, **Odstranit nastavení**, **Zavřít**. Tlačítko **Ověřit spojení** hlásí, zda se povedlo spojení, zda je repozitář veřejný nebo soukromý a zda má token právo zápisu.

### Ukládání a načítání

- **Po spuštění** se blok automaticky načte z GitHubu a otevře v režimu čtení.
- **Automatické ukládání**: 3 sekundy po poslední úpravě, a pokud píšete bez přestávky, nejpozději po 30 sekundách.
- Uloží se také při **opuštění řádku** a při **zavření okna**.
- **Ručně** kdykoli klávesou **Ctrl+S** (nebo **Ctrl+Alt+S**). Pokud GitHub není nastaven, **Ctrl+S** uloží do souboru `.json`.
- Každé uložení se ohlásí ve stavovém řádku; čas posledního uložení najdete v nabídce **Soubor** (u položky „GitHub…") a v dolní liště (např. „uloženo před 12 s").
- Pokud uložení **selže**, změny zůstanou označené jako neuložené a aplikace to za 20 sekund zkusí znovu.
- Pokud soubor mezitím **změnil někdo jiný** (409/422), aplikace načte aktuální verzi (SHA) a uložení automaticky zopakuje.

### Bezpečnost tokenu

Token se ukládá **pouze do prohlížeče** (`localStorage`, klíč `mronenote.github.v1`) a odesílá se výhradně na GitHub API. Přesto: na sdíleném počítači jej nepoužívejte, používejte token s co nejužším oprávněním a omezenou platností. **Kdokoli s přístupem k profilu prohlížeče token přečte.**

---

## Nastavení

**Soubor → Nastavení…** otevře dialog s volbami:

| Volba | Rozsah / Význam |
|---|---|
| Název poznámkového bloku | Textové pole |
| Motiv | **Světlý** / **Tmavý** / **Vysoký kontrast** |
| Velikost písma (px) | 12 – 28 |
| Průběžně ukládat na GitHub | Přepínač automatického ukládání |
| Zobrazovat ladicí výpis na stránce | Debug panel s logem operací |
| Převádět Markdown při psaní | Zapíná / vypíná on-the-fly převod v běžných řádcích (výchozí: zapnuto) |

Nastavení bloku (motiv, písmo, autosave, debug, Markdown, zvolený režim) se ukládá **do bloku** a putuje se souborem.

---

## Úplný přehled klávesových zkratek

### Obecné

| Akce | Zkratka |
|---|---|
| Nápověda | **F1** |
| Přepnout režim úprav a čtení | **F2** |
| Přeskočit mezi stromem, obsahem a nabídkou | **F6** (zpět **Shift+F6**) |
| Přejít do hlavní nabídky | **F10** |
| Otevřít nabídku podle podtrženého písmene | **Alt+písmeno** (S, U, F, V, P, B, Z, N) |
| Pohyb v nabídce | šipky, **Home**, **End** |
| Zavřít nabídku / dialog | **Escape** |

### Blok, stránky, soubor

| Akce | Zkratka |
|---|---|
| Nová stránka | **Ctrl+N** |
| Nový oddíl | **Ctrl+Shift+N** |
| Uložit na GitHub (nebo do souboru, když není nastaveno) | **Ctrl+S** |
| Ručně uložit na GitHub | **Ctrl+Alt+S** |
| Uložit do souboru `.json` | z nabídky **Soubor** |
| Zkopírovat celý blok do schránky | **Ctrl+Shift+S** |
| Načíst celý blok ze schránky | **Ctrl+Shift+O** |
| Hledat | **Ctrl+F** |

### Editace obsahu

| Akce | Zkratka |
|---|---|
| Zpět | **Ctrl+Z** |
| Znovu | **Ctrl+Y** |
| Nový řádek | **Enter** |
| Zanořit řádek | **Tab** |
| Vynořit řádek | **Shift+Tab** |
| Přesunout řádek nahoru | **Alt+↑** |
| Přesunout řádek dolů | **Alt+↓** |
| Pohyb mezi řádky | šipky **↑** / **↓** |
| Sbalit nebo rozbalit řádek | **Ctrl+.** |
| Smazat prázdný řádek | **Backspace** |
| Nový řádek osnovy z Markdown bloku | **Ctrl+Enter** (uvnitř Markdown bloku) |

### Formátování

| Akce | Zkratka |
|---|---|
| Tučně | **Ctrl+B** |
| Kurzíva | **Ctrl+I** |
| Podtržení | **Ctrl+U** |
| Zvýraznění | **Ctrl+Shift+H** |
| Odkaz | **Ctrl+K** |
| Wiki odkaz | **Ctrl+Shift+K** |

### Vnitřní odkazy

| Akce | Zkratka |
|---|---|
| Kopírovat odkaz na odstavec | **Ctrl+Shift+C** |
| Vložit zkopírovaný odkaz | **Ctrl+Shift+V** |

### Příznaky a stav řádku

| Akce | Zkratka |
|---|---|
| První tři příznaky v nabídce | **Ctrl+Shift+1**, **Ctrl+Shift+2**, **Ctrl+Shift+3** |
| Nabídka příznaků řádku (kontextová) | **F4** |
| Smazat příznaky řádku | **Shift+F4** |
| Nabídka stylu řádku (kontextová) | **F3** |
| Označit hotovo nebo nehotovo | **Ctrl+Shift+D** |

### Kontextová nabídka

| Akce | Zkratka |
|---|---|
| Otevřít kontextovou nabídku řádku | **Shift+F10** nebo klávesa kontextové nabídky |
| Na dotykovém zařízení | tlačítko **⋮** vlevo od řádku |

---

## Datový model a technické informace

### Datový model

Poznámkový blok je uložen jako strom objektů:

```
nb      = {name, sections:[…], settings:{…}, flags:[…]}
section = {id, type:'section', name, color, pages:[…], collapsed}
group   = {id, type:'group',   name, color, children:[…], collapsed}
page    = {id, title, items:[…], created, modified, history:[…], sub:[…]}
item    = {id, html, md, style, list, collapsed, done, flags:[…], children:[…], att}
```

Soubor `.json` je přímý serializovaný obraz této struktury. Přílohy (obrázky, soubory) jsou uloženy jako **data URL** přímo v atributu `att` řádku (`{kind, data, name, size[, alt]}`).

### Ukládání

- V úložišti prohlížeče (`localStorage`, klíč `mronenote.github.v1`) je uložena **pouze konfigurace synchronizace s GitHubem**.
- Obsah bloku se ukládá na GitHub (pokud je nastaven) a/nebo do souboru `.json`.
- Aplikace nepoužívá cizí knihovny, není závislá na CDN a funguje offline. DOCX i ZIP jsou vytvářeny vlastním kódem přímo v prohlížeči.

### Sanitace HTML

Veškerý HTML text v řádcích prochází sanitací — povoleny jsou jen bezpečné značky (`B`, `I`, `U`, `S`, `EM`, `STRONG`, `CODE`, `SPAN`, `A`, `BR`, `SUP`, `SUB`, `MARK`, `IMG`, `H1`–`H6`, `P`, `UL`, `OL`, `LI`, `BLOCKQUOTE`, `PRE`, `HR`, `INPUT`) a bezpečné atributy (`href`, `data-wiki`, `data-ref`, `class`, `title`, `src` jen pro `data:image/` a `https:`, `alt`, `width`, `type=checkbox`, `checked`, `disabled`). JavaScriptové handlery, `javascript:` URL a nedůvěryhodné `src` jsou odstraněny.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Ke svému běhu **nevyžaduje připojení k internetu** — internet se využívá pouze pro volitelnou synchronizaci s GitHubem. Volitelně se využívá Clipboard API (u prohlížečů, kde není k dispozici, nabízí aplikace textové pole s náhradním postupem).

### Migrace starších souborů

Při načtení bloku se automaticky doplní:

- Chybějící výchozí příznaky (u souborů, kde chybí novější příznaky).
- Uzel bez atributu `type` se interpretuje jako oddíl.
- Chybějící `md` na řádku, chybějící `history` na stránce a další pole se doplní prázdnou hodnotou.
- U řádků typu Markdown se z `md` přegeneruje `html` (renderem se sanitizací).

### Debug / ladicí výpis

Volitelný panel (Nastavení → **Zobrazovat ladicí výpis**) zobrazuje časovou stopu operací: spuštění, úspěšná i neúspěšná uložení na GitHub, načítání, chyby dialogů. Slouží k ladění a hlášení problémů.

---

## Slovník pojmů

| Pojem | Význam |
|---|---|
| **Poznámkový blok** | Kořenový kontejner, celá jednotka dat aplikace |
| **Skupina oddílů** | Volitelný obal pro seskupení oddílů; může obsahovat další skupiny |
| **Oddíl** | Kolekce stránek s možnou barvou |
| **Stránka** | Nositel osnovy řádků, může mít podstránky |
| **Podstránka** | Stránka zařazená pod jinou stránku; přesouvá se s ní |
| **Řádek (item)** | Základní jednotka obsahu — text, styl, typ seznamu, příznaky, děti |
| **Textový blok (Markdown)** | Speciální řádek pro delší text psaný v Markdownu |
| **Příznak** | Barevný štítek s emoji symbolem přiřazený řádku |
| **Wiki odkaz** | Odkaz na jinou stránku podle názvu (`[[Název]]`) |
| **Vnitřní odkaz** | Odkaz na konkrétní odstavec/stránku/oddíl podle vnitřního ID (`mronenote:druh/id`) |
| **CriticMarkup** | Textová syntaxe pro sledování změn (`{++vloženo++}`, `{--smazáno--}`, …) |
| **Režim čtení** | Read-only zobrazení, ve kterém není možné obsah měnit |
| **Autosave** | Průběžné automatické ukládání na GitHub |
| **Sanitace** | Bezpečnostní filtrování HTML značek a atributů |

---
