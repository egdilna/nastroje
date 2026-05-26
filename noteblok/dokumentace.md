# NoteBlok — všestranný nástroj na poznámky a dokumentaci

**Online verze nástroje:** [https://egdilna.github.io/nastroje/noteblok](https://egdilna.github.io/nastroje/noteblok)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#noteblok](https://egdilna.github.io/nastroje/#noteblok)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu. Veškerá data se ukládají do souboru s příponou `.nmb` (JSON formát) — žádný server, žádná databáze.

---

## Přehled funkcí a vychytávek

**NoteBlok** je webová aplikace v jediném HTML souboru pro správu rozsáhlých kolekcí poznámek různého typu. Místo aby šlo o prostý textový editor, kombinuje hierarchickou navigaci se složkami, devíti specializovanými typy poznámek, propojováním pomocí wiki odkazů a vnořením, pokročilým editorem s prezentačním režimem, revizemi v CriticMarkup a korektorem.

### Klíčové funkce

- **Hierarchické složky a poznámky** — neomezeně zanořené složky, ikona u každé poznámky, oblíbené, historie změn, hoist (izolace části stromu)
- **Devět typů poznámek** — textová poznámka (markdown), soubor s verzemi, úkol, webová stránka v iframu, virtuální složka, databáze (s poli a záznamy), diagram (PlantUML), deník (chronologický), projektový plán (WBS s Ganttovským přepočtem)
- **Markdown s rozšířeními** — wiki odkazy `[[Název]]`, vnoření `{{Název}}`, úkoly `- [ ]`/`- [x]`, CriticMarkup `{++…++}` `{--…--}` `{==…==}` `{>>…<<}`, mřížkové tagy `#tag`
- **Pokročilý editor sekcí** — strukturovaná editace dle nadpisů H1–H6, sbalování, izolace sekcí, badge se statistikami (slova, úkoly, změny), filtr podle tagů a fulltext, export sekcí do DOCX a spuštění prezentace
- **Prezentační režim** — z nadpisů H2 se generují slidy s časovačem, navigací klávesnicí, přehledem všech slidů a celoobrazovkovým režimem
- **Revize CriticMarkup** — dvoupanelový editor revizí (dokument + seznam změn) s tlačítky Přijmout/Odmítnout a hromadnými akcemi
- **Korektor** — kontrola pravopisu přes externí službu Korektor (LindAT) s vlastním slovníkem výjimek
- **Editor tabulek** — vizuální editor markdown tabulek (přidávání řádků, sloupců, úpravy buněk)
- **Štítky a metadata** — volné štítky `#tag`, libovolné dvojice klíč–hodnota, prohlížeč metadat s navigací podle hodnot
- **Více panelů** — otevření až 9 poznámek vedle sebe v záložkách s přepínáním `Alt+1`–`Alt+9`
- **Náhled v novém okně** — vyrenderovaná verze poznámky v samostatném okně, automaticky se přepisuje při změnách
- **Verze poznámek** — pojmenované snapshoty obsahu (zvlášť pro text, zvlášť pro diagramy a plány)
- **Export a import** — celý blok jako `.nmb`, jednotlivé poznámky/složky jako `.nme`, individuální poznámka jako `.md` nebo `.docx`, celé složky jako vnořený `.md` nebo `.docx`
- **GitHub synchronizace** — uložení a načtení bloku přímo do/z GitHub repozitáře (Personal Access Token, sdílecí odkaz)
- **Režim jen pro čtení** — sdílení bloku přes parametr `?url=…` načte data z URL bez možnosti editace
- **Zvuková zpětná vazba** — krátké tóny při uložení a načtení bloku (Web Audio API)

### Uložení dat

Data se ukládají do souboru `.nmb` (JSON s polem složek a poznámek). NoteBlok do `localStorage` ukládá pouze nastavení GitHub tokenu (klíč `nb_github_token`). Vše ostatní je v souboru, který si stahujete a načítáte sami nebo synchronizujete přes GitHub.

### Přístupnost

Záhlaví a tlačítka mají atributy `accesskey` (Alt+písmeno), dialogy lze ovládat klávesnicí (Esc zruší, Enter potvrdí), navigace v postranním panelu používá semantické `<details>`/`<summary>` prvky a tlačítka mají `aria-label`.

---

## Hlavní koncept

NoteBlok pracuje s **blokem** — to je jeden soubor `.nmb` obsahující vše: složky, poznámky, štítky, oblíbené, verze, nastavení. Můžete mít více bloků (např. pracovní, osobní, projektový) a přepínat mezi nimi nahráváním různých souborů.

**Složka** je čistě navigační kontejner s názvem. Může obsahovat podsložky a poznámky.

**Poznámka** má vždy: ID, název, ikonu (emoji), složku, vytvořeno, změněno. Podle `noteType` má další specifická data. Defaultní typ je `note` (textová markdown poznámka).

**Propojení mezi poznámkami** se děje třemi způsoby:

- `[[Název poznámky]]` — wiki odkaz, klik otevře cílovou poznámku
- `{{Název poznámky}}` — include (transkluze), obsah cílové poznámky se vloží do aktuální (rekurzivně až do hloubky 10, s ochranou proti cyklu)
- Vnoření do **virtuální složky** — explicitní seznam ID poznámek

Zpětně se to projeví v sekci **Odkazuje sem** a **Vkládá tuto poznámku** pod každou poznámkou.

---

## Rozložení obrazovky

Aplikace má tři hlavní oblasti:

### Záhlaví

V horní liště jsou tlačítka:

| Tlačítko | Klávesa | Funkce |
|---|---|---|
| ☰ Panel | `Alt+P` nebo `p` | Skrýt/zobrazit postranní panel |
| 🔍 Hledat | `Alt+F` nebo `f` | Fulltextové vyhledávání v poznámkách |
| Filtr emoji | — | Rozbalovací filtr poznámek podle ikony |
| 📋 Metadata | — | Prohlížeč metadat (klíče → hodnoty → poznámky) |
| ☑ Úkoly | `Alt+T` | Přehled všech nesplněných úkolů napříč blokem |
| 📝 Poznámka | `Alt+N` | Nová poznámka (dialog s výběrem typu) |
| 📁 Nahrát | `Alt+O` | Načíst blok (soubor nebo GitHub) |
| 💾 Uložit | `Alt+S` nebo `s` | Uložit blok (soubor nebo GitHub) |
| ⚙ Nastavení | — | Otevře dialog s nastavením bloku, emoji, GitHub |
| 📦 Export | — | Vybrat poznámky/složky k exportu do `.nme` |
| 📥 Import | — | Importovat soubor `.nme` do aktuálního bloku |
| DBG | — | Přepnout panel s ladicími zprávami |

Vpravo nahoře je název aktuálního bloku (`NoteBlock – {název}`).

### Postranní panel (navigace)

Postranní panel obsahuje pět rozbalitelných sekcí:

- **⭐ Oblíbené** — seznam poznámek označených hvězdičkou
- **🕐 Historie** — 20 nejnověji upravených poznámek
- **📁 Navigace** — hierarchický strom složek a poznámek (s počty `[n]` a indikací nevyřízených úkolů `(n)`)
- **📁 Virtuální složky** — seznam poznámek typu „virtuální složka"
- **🏷 Štítky** — chipy všech používaných štítků (kliknutí filtruje)

Nahoře v panelu jsou tlačítka **+ Složka** a **+ Poznámka** pro rychlé přidání do kořene.

Tlačítkem **Hoist** (`Alt+H`) lze izolovat zobrazení na obsah jedné složky — v panelu se objeví žluté tlačítko ↺ s názvem hoistnuté složky, kterým izolaci zrušíte (`Alt+A`).

### Hlavní obsah

Hlavní oblast obsahuje:

1. **Lišta nástrojů** — kontextová tlačítka podle aktuální poznámky/složky
2. **Záložky panelů** — pokud máte otevřeno více poznámek vedle sebe
3. **Drobečková navigace** — `🏠 Blok / Složka / Podsložka`
4. **Obsah** — vyrenderovaná poznámka, tabulka složky, výsledky hledání atd.

---

## Práce se složkami

### Vytvoření složky

Tlačítko **+ Složka** v panelu nebo v liště nástrojů otevře dialog s názvem a výběrem nadřazené složky. Stejnojmenné složky ve stejné nadřazené složce nejsou povoleny.

### Pohled na složku

Pohled na složku zobrazuje:
- Tabulku **Složky** (název, počet poznámek včetně podsložek)
- Tabulku **Poznámky** se sloupci: Název, Typ (metadata), Stav (metadata), Štítky, Změněno

V liště jsou tlačítka **+ Podsložka**, **+ Poznámka**, **Přejmenovat**, **Export MD**, **Export DOCX**, **Hoist**, **Smazat**.

### Export složky

- **Export MD** — vyrobí jediný `.md` soubor, kde každá poznámka je nadpisem podle hloubky vnoření (max H6), `{{include}}` se rozbalí
- **Export DOCX** — totéž, ale jako Word dokument (přes JSZip), nadpisy se mapují na Heading 1–6

### Smazání složky

Dialog explicitně upozorní, kolik podsložek a poznámek se smaže společně se složkou. Operace nelze vrátit zpět.

---

## Textová poznámka

Standardní typ poznámky s markdown obsahem. Pohled obsahuje:

- Drobečkovou navigaci
- Hlavičku s ikonou, názvem, indikátorem nesplněných úkolů a štítky
- Tabulku metadat (klíč–hodnota, URL hodnoty jsou hypertextové)
- **Obsah dokumentu** (TOC) — automaticky generovaný ze všech nadpisů H1–H6
- Vyrenderovaný markdown
- Sekce **Obsažené odkazy** (externí URL z textu), **Odkazuje na poznámky**, **Obsahuje vnořené**
- Sekce **Odkazuje sem** a **Vkládá tuto poznámku** (zpětné odkazy)
- Sekce **Nesplněné úkoly** a **Komentáře** (z CriticMarkup `{>>…<<}`)

### Lišta nástrojů textové poznámky

| Tlačítko | Klávesa | Funkce |
|---|---|---|
| ⭐ Oblíbené | `Alt+B` | Přidat/odebrat z oblíbených |
| Upravit | `Alt+E` | Otevřít prostý editor (textarea) |
| Přejmenovat | `r` | Změnit název a ikonu |
| Štítky | `t` | Spravovat štítky (oddělené čárkou) |
| Metadata | `Alt+M` nebo `m` | Přidat/upravit dvojice klíč–hodnota |
| Přesunout | `Alt+Shift+M` | Změnit nadřazenou složku |
| Duplikovat | — | Vytvoří kopii s „(kopie)" v názvu |
| Smazat hotové | — | Odstraní z obsahu řádky `- [x]` |
| Pokročilý editor | — | Otevře sekční editor (viz níže) |
| Revize | — | Spustí editor revizí CriticMarkup |
| Korektor | — | Spustí kontrolu pravopisu |
| MD | — | Stáhnout poznámku jako `.md` (s rozbalenými includy) |
| DOCX | `Alt+X` | Stáhnout poznámku jako `.docx` |
| Kopírovat | `Alt+C` | Zkopírovat markdown do schránky |
| Verze+ | `Alt+W` | Uložit pojmenovaný snapshot |
| Verze (n) | `Alt+R` | Seznam uložených verzí |
| Náhled | `Alt+I` | Otevřít vyrenderovanou poznámku v novém okně |
| Editace sekcí | `Alt+D` | Přepnout do režimu inline editace po sekcích |
| Smazat | — | Smazat poznámku |

### Editor (prostý režim)

Stiskem **Upravit** se zobrazí jedna velká `<textarea>` s celým obsahem poznámky. Tab vkládá tabulátor (ne přepnutí fokusu). Tlačítka **💾 Uložit** (`Alt+U`) a **Zrušit** (Esc).

### Editace sekcí (inline)

Zaškrtnutím **Editace sekcí** v liště se obsah rozdělí podle nadpisů na jednotlivé bloky, každý s vlastním tlačítkem **Upravit sekci**. Změny v jedné sekci nevyžadují editaci celého dokumentu.

### Klikatelné úkoly v náhledu

Položky `- [ ]` a `- [x]` se v náhledu zobrazují jako zaškrtávátka. Kliknutí přepne stav rovnou v obsahu poznámky (uloží se a překreslí navigace).

### Markdown úkoly a klíčové konstrukce

| Konstrukce | Význam |
|---|---|
| `[[Název]]` | Wiki odkaz na poznámku |
| `{{Název}}` | Include — vloží obsah cílové poznámky |
| `- [ ] text` / `- [x] text` | Úkol (klikatelný v náhledu) |
| `#tag` | Tag (v Pokročilém editoru klikatelný filtr) |
| `{++text++}` | CriticMarkup přidání (zelený `<ins>`) |
| `{--text--}` | CriticMarkup smazání (červený `<del>`) |
| `{~~staré~>nové~~}` | CriticMarkup náhrada |
| `{==text==}` | CriticMarkup zvýraznění (`<mark>`) |
| `{>>komentář<<}` | CriticMarkup komentář |

---

## Pokročilý editor

Tlačítko **Pokročilý editor** otevře strukturovaný pohled, ve kterém je poznámka rozparsovaná podle nadpisů H1–H6 do stromu sekcí.

### Operace nad sekcemi

Každá sekce má tlačítka:
- **▶ / ▼** — sbalit/rozbalit podsekce
- **▶ / ▼** (druhé) — sbalit/rozbalit obsah sekce
- **+ Pod** — přidat podsekci
- **+ Vedle** — přidat sourozeneckou sekci
- **⬆ / ⬇** — přesunout nahoru/dolů
- **➡ / ⬅** — odsadit / předsadit (změnit úroveň)
- **🗑** — smazat sekci včetně podsekcí
- **✏ Upravit** — inline editace nadpisu a těla
- **🔍 Izolovat** — zobrazit pouze tuto sekci a její potomky
- **🎬 Prezentace** — spustit prezentaci od této sekce
- **🗑 Hotové úkoly** — odebrat z této sekce všechny `- [x]`
- **🏷 Odebrat tagy** — odstranit `#tag` z nadpisu a těla

### Badge se statistikami

U každé sekce se zobrazují barevné odznaky:
- 📦 Modrý — počet podsekcí, sbaleno/rozbaleno
- ✏ Žlutý — rozpracované úkoly, dokončené, procento
- ✓ Zelený — celkový poměr splněných úkolů
- 📊 Modrý — počet znaků, slov, případně přírůstek od poslední verze

### Filtry a vyhledávání

- **Vyhledávací pole** v liště — filtruje sekce podle textu (Enter)
- **Klik na `#tag`** — filtruje sekce obsahující daný tag (chipy v liště)
- **Izolovat** — zobrazí jen vybranou sekci jako kořen (s drobečkovou navigací)
- **Zrušit izolaci / filtr** — křížek v žlutém pruhu

### Export pokročilého editoru

Tlačítko **📄 DOCX** v liště vygeneruje Word dokument jen z aktuálně viditelných (filtrovaných) sekcí.

### Prezentační režim

Tlačítko **🎬 Prezentace** otevře nové okno s prezentací slidu po slidu:

| Klávesa | Akce |
|---|---|
| `→`, `Mezerník`, `PageDown` | Další slide |
| `←`, `PageUp` | Předchozí slide |
| `Home` / `End` | První / poslední slide |
| `O` | Přepnout přehled všech slidů |
| `F` / `F11` | Celá obrazovka |
| `Esc` | V přehledu zpět; ve slidu zavřít prezentaci |

V hlavičce prezentace je časovač (od otevření), navigační tlačítka a čítač `n / N`. Slidy se generují z nadpisů a obsahu: H1 = titulní, H2 bez těla = sekce, ostatní = obsahový slide s body a podsekcemi jako odrážky.

---

## Editor revizí (CriticMarkup)

Tlačítko **Revize** otevře dvoupanelové zobrazení:

- **Levý panel** — vyrenderovaný dokument s revizemi obarvenými inline (zelená = přidání, červená = smazání, žlutá = zvýraznění, modrá = komentář). U každé revize jsou tlačítka **✓** a **✗**.
- **Pravý panel** — seznam změn seskupený podle sekcí (nadpisů), s typem (Přidání, Smazání, Náhrada, Zvýraznění, Komentář) a popisem.

### Akce

| Akce | Význam |
|---|---|
| Přijmout (✓) | Aplikuje změnu trvale do textu |
| Odmítnout (✗) | Vrátí původní text |
| Přijmout vše | Hromadně přijme všechny nevyřízené |
| Odmítnout vše | Hromadně odmítne všechny nevyřízené |
| Upravit komentář | Otevře dialog pro úpravu textu komentáře |
| Smazat komentář | Odstraní `{>>…<<}` z textu |
| Odstranit zvýraznění | Zruší `{==…==}`, ponechá text |
| 📋 Kopírovat zdroj | Zkopíruje aktuální markdown do schránky |

Statistika v liště ukazuje `n nevyřešených / N celkem`.

---

## Korektor pravopisu

Tlačítko **Korektor** spustí kontrolu pravopisu obsahu poznámky. Používá:

- Externí službu **Korektor LindAT** (`lindat.mff.cuni.cz/services/korektor`) pro návrhy oprav
- Vlastní slovník platných slov stažený z `mrt.site44.com/cs.txt` (cache v paměti)
- Detekci syntaktických znaků (`+ [ ] { } ~ > # * _ / : | = ^`), které se přeskakují

Pro každé nalezené chybné slovo zobrazí:
- Pozici v dokumentu (s odkazem na blok textu)
- Návrhy oprav z Korektoru (kliknutí aplikuje)
- Vlastní vstup pro ruční opravu (Enter potvrdí)
- Tlačítka **Ignorovat slovo** (jen tato relace) a **Přidat do slovníku** (vlastní)

---

## Editor tabulek

Pokud poznámka obsahuje markdown tabulku (řádek `|…|…|` následovaný řádkem `|---|---|`), v náhledu se vedle tabulky objeví tlačítko pro otevření vizuálního editoru.

V editoru můžete:
- Klikat na buňky a přímo je upravovat
- Přidávat/odebírat řádky a sloupce
- Zachová se zarovnání oddělovacího řádku

Změny se aplikují zpět do markdown obsahu poznámky.

---

## Verze poznámek

### Uložení verze

Tlačítkem **Verze+** (`Alt+W`) se otevře dialog s názvem verze (např. „Před revizí", „Hotovo k recenzi"). Snapshot obsahu se uloží mezi verze poznámky se vším všudy.

### Správa verzí

Tlačítko **Verze (n)** (`Alt+R`) zobrazí tabulku s datem, názvem a velikostí každé verze. Akce:
- **Otevřít** — zobrazí pouze obsah verze (read-only)
- **Upravit** — otevře verzi v editoru (volba **Uložit jako aktuální** přepíše živý obsah)
- **Obnovit** — zazálohuje aktuální stav jako verzi „Před obnovou" a načte verzi do aktivního obsahu
- **Jako nová poznámka** — vytvoří kopii ve formě nové poznámky
- **Smazat** — odstraní verzi

Diagramy (PlantUML) a projektové plány mají vlastní oddělené verze (snapshoty zdrojového kódu / pole úkolů).

---

## Typ: Soubor (správa verzí souborů)

Poznámka typu **Soubor** uchovává binární soubory přímo v bloku (jako Data URL).

- **Nahrát verzi** — dialog s výběrem souboru a poznámkou k verzi
- Tabulka verzí: název souboru (klik stáhne), datum, velikost (B/KB/MB), poznámka, akce smazat
- Vhodné pro malé soubory (PDF, obrázky, ZIP) — velikost bloku roste o `4/3` velikosti souboru

---

## Typ: Úkol

Poznámka typu **Úkol** je samostatný úkol se sledováním stavu a historie.

### Pole úkolu

| Pole | Význam |
|---|---|
| Popis | Markdown text |
| Termín | Datum dokončení |
| Odpovědný | Jméno řešitele |
| Stav | Viz níže |
| Historie | Auto-záznam změn stavu s datem |

### Stavy úkolů

| ID | Štítek | Ikona |
|---|---|---|
| `new` | Nový | 🎊 |
| `active` | Rozpracovaný | 🛠 |
| `waiting` | Čeká na | ⏳ |
| `review` | Ke kontrole | 🔍 |
| `done` | Hotový | ✅ |
| `cancelled` | Zrušený | ❌ |

### Akce

Změna stavu otevře dialog s poznámkou k přechodu — vše se zaznamená do historie. K dispozici jsou tlačítka **Upravit popis** a **Upravit pole** (termín, odpovědný).

Když `{{Název úkolu}}` použijete v jiné poznámce, vloží se zhuštěná karta s názvem, stavem a termínem.

---

## Typ: Webová stránka (iframe)

Poznámka typu **Webová stránka** vkládá libovolnou URL do iframu uvnitř NoteBloku.

- **Změnit URL** — dialog pro zadání adresy
- **Načíst znovu** — reload iframu
- Iframe používá sandbox `allow-scripts allow-same-origin allow-forms allow-popups`
- Některé weby (Google, banky) odmítají vložení do iframu — pak je k dispozici odkaz **🌍 URL** k otevření v novém okně

---

## Typ: Virtuální složka

Virtuální složka je explicitní seznam poznámek (ID), které spolu logicky souvisí, ale jsou v různých složkách. Poznámka může být zařazena ve více virtuálních složkách současně.

- **Popis** — markdown text nad seznamem
- **Přidat poznámky** — dialog s vyhledávacím polem a zaškrtávátky
- Tabulka členů s typem, metadaty Typ/Stav, datem změny a tlačítkem **Odebrat**
- V pohledu jednotlivé poznámky je sekce **Členem virtuálních složek**
- V postranním panelu vlastní sekce **📁 Virtuální složky**
- `{{Název virtuální složky}}` v jiné poznámce vyrenderuje zhuštěnou kartu s počtem členů

---

## Typ: Databáze

Plnohodnotná tabulka s definovanými poli a záznamy.

### Pole

| Typ | Hodnota |
|---|---|
| Text | Libovolný řetězec |
| Číslo | Desetinné číslo |
| Datum | Datum (datepicker) |
| Ano/Ne | Boolean |
| Výběr | Výčet hodnot (oddělené čárkou v definici) |

Pole se přidávají tlačítkem **Pole**, lze je editovat (typ nelze změnit) a smazat (smaže i hodnoty).

### Záznamy

- **Záznam** — dialog s polem pro každou definovanou hodnotu (správný input dle typu)
- **Tabulka** — sloupce dle polí, řazení kliknutím na záhlaví, filtr v záhlaví každého sloupce
- **Reset filtrů** — vyčistí filtry i řazení
- **Akce na řádku** — Upravit / Smazat

`{{Název databáze}}` v jiné poznámce vloží zhuštěnou kartu s počtem záznamů.

---

## Typ: Diagram (PlantUML)

Poznámka typu **Diagram** uchovává PlantUML zdrojový kód a renderuje obrázek pomocí veřejného PlantUML serveru (`plantuml.com`). Kódování probíhá lokálně (asynchronní deflate + base64 6-bit).

### Akce

| Tlačítko | Funkce |
|---|---|
| Upravit zdroj | Editor PlantUML zdrojového kódu |
| Název diagramu | Nastavit popisek obrázku (jiný než název poznámky) |
| Kopírovat zdroj | PlantUML kód do schránky |
| Kopírovat PNG URL | URL obrázku na PlantUML serveru |
| Kopírovat Markdown | `![název](URL)` |
| Kopírovat Wiki | `{{URL?nolink|název}}` (DokuWiki syntaxe) |
| Stáhnout PNG | Stažení vyrenderovaného obrázku |
| Verze+ / Verze (n) | Snapshoty zdrojového kódu |

Pod obrázkem jsou rozbalitelné `<details>` se **Zdrojovým kódem** a **URL obrázku** v plné podobě.

`{{Název diagramu}}` v jiné poznámce vloží přímo obrázek (`<img>`).

---

## Typ: Deník (chronologický)

Poznámka typu **Deník** je seznam časově zařazených záznamů. Vhodné pro pracovní deník, žurnál, log.

### Akce

- **Přidat záznam** — dialog s datem+časem (předvyplněno aktuálním) a textem (podporuje `[[wiki odkazy]]`)
- **Upravit záznamy** — tabulka všech záznamů s akcemi Upravit/Smazat
- **Nejstarší ▲ / Nejnovější ▼** — přepíná směr řazení

### Zobrazení

Záznamy jsou seskupené po dnech s českým formátem data (`pondělí 26. května 2026`). V rámci dne se zobrazuje čas a text.

`{{Název deníku}}` v jiné poznámce vyrenderuje celý seznam záznamů (vzestupně).

---

## Typ: Projektový plán (WBS)

Poznámka typu **Projektový plán** je hierarchická tabulka úkolů ve stylu WBS (Work Breakdown Structure) s automatickým přepočtem rodičů.

### Sloupce

| Sloupec | Význam |
|---|---|
| WBS | Hierarchické číslování (1, 1.1, 1.1.1, …) |
| Úkol | Název s odsazením podle úrovně |
| Stav | Budoucí, Nezahájeno, Probíhá, Blokováno, Splněno, Přerušeno, Zrušeno |
| % | Procento dokončení |
| Začátek | Datum začátku |
| Trvání | Počet dní (do 21 dní jako „d", víc jako „t" týdny) |
| Konec | Datum konce (auto-přepočet při změně začátku nebo trvání) |
| Popis | Krátký text (`[[wiki odkazy]]`) |

### Úprava úkolu

Dialog **Upravit úkol** obsahuje:
- Název, stav, popis
- Volbu nadřazeného úkolu (přesune úkol jako podúkol)
- U listových úkolů: %, datum začátku, trvání, datum konce, předchůdce (výběr z ostatních úkolů — automaticky nastaví začátek na den po konci předchůdce)
- U rodičovských úkolů: data se počítají automaticky z potomků

### Akce na řádku

- **✎** Upravit
- **▲ / ▼** Přesunout nahoru/dolů (přesouvá i potomky jako blok)
- **📍** Hoist (izolovat) — zobrazit jen tento úkol a jeho potomky
- **→** Odsadit (zvýšit úroveň)
- **←** Předsadit (snížit úroveň)
- **+** Vložit pod
- **❌** Smazat (s potomky, s potvrzením)

### Lišta plánu

- **Přidat úkol** — nový kořenový úkol
- **Rozbalit vše / Sbalit vše** — všechny rodičovské uzly
- **Zrušit hoist** — vrátit zobrazení celého plánu
- **Verze+ / Verze (n)** — snapshoty plánu

V záhlaví plánu je souhrn: celkem N úkolů, M splněno (P %).

`{{Název plánu}}` v jiné poznámce vloží zhuštěnou tabulku plánu.

---

## Štítky a metadata

### Štítky

Volné textové štítky (např. `nápad`, `úkol`, `2025`) — oddělené čárkou v dialogu **Štítky** nebo `Alt+T` v textové poznámce. V postranním panelu jsou jako chipy, kliknutí filtruje seznam poznámek.

### Metadata

Libovolné dvojice klíč–hodnota (`Typ = Smlouva`, `Stav = Schváleno`, `URL = https://…`). Hodnoty ve formátu URL se v náhledu automaticky stávají odkazy.

### Prohlížeč metadat

Tlačítko **📋 Metadata** v záhlaví otevře strom všech metadat: klíč (s počtem hodnot a poznámek) → hodnota (s počtem poznámek) → seznam konkrétních poznámek. Použitelné pro rychlou orientaci.

### Filtr v navigaci

V navigaci lze filtrovat poznámky podle ikony (rozbalovací filtr `😎 Vše` v záhlaví).

---

## Více panelů (Split view)

NoteBlok umožňuje otevřít až devět poznámek vedle sebe v záložkách.

| Klávesa | Akce |
|---|---|
| `Alt+1` až `Alt+9` | Přepnout na panel N |
| `Shift+T` | Otevřít aktuální poznámku v novém panelu |
| `Shift+I` | Předchozí panel |
| `Shift+O` | Další panel |
| `Shift+W` | Zavřít aktuální panel |
| Tlačítko **+** v záložkách | Nový prázdný panel |

V seznamu složky je u každé poznámky tlačítko ⎘ pro otevření v novém panelu.

---

## Hledání a úkoly

### Hledání

Tlačítko **🔍 Hledat** (`Alt+F` nebo `f`) zobrazí dialog s vyhledávacím polem. Vyhledává se v:
- Názvech poznámek (skóre 3)
- Štítcích (skóre 2)
- Obsahu (skóre 1)

Výsledky jsou seřazeny podle skóre s úryvkem okolního textu.

### Přehled úkolů

Tlačítko **☑ Úkoly** (`Alt+T`) zobrazí všechny nesplněné úkoly (`- [ ]`) napříč celým blokem, seskupené podle poznámky a s uvedením nadpisu, pod kterým se nacházejí.

---

## Náhled v novém okně

Tlačítko **Náhled** (`Alt+I`) otevře vyrenderovanou poznámku v samostatném okně prohlížeče. Vlastní CSS zajistí čitelnou typografii. Okno se automaticky překresluje při změně obsahu (přes `postMessage`).

Vhodné pro:
- Sdílení obrazovky / prezentaci
- Tisk (z prohlížeče)
- Kontrolu, jak bude poznámka vypadat „mimo" aplikaci

---

## Kontrola integrity (chybějící odkazy)

V dialogu **⚙ Nastavení** je odkaz **🔍 Zobrazit chybějící odkazy a includy**. Otevře přehled všech `[[Název]]` a `{{Název}}` v bloku, jejichž cílová poznámka neexistuje, společně se seznamem poznámek, ve kterých se odkaz nachází.

Slouží k odhalení překlepů a slepých odkazů po přejmenování/smazání.

---

## Export a import jednotlivých položek

Tlačítka **📦 Export** a **📥 Import** v záhlaví umožňují přenášet vybrané poznámky a složky mezi bloky pomocí souboru s příponou `.nme`.

### Export

1. Otevře se seznam všech složek a poznámek se zaškrtávátky (předvyplní aktuální výběr)
2. Tlačítka **Vybrat vše / Zrušit výběr / Vyhledat**
3. Export uloží `noteblock-{datum}.nme` (JSON s formátem `noteblock-export`, verze 1)

Exportují se kompletní data poznámky včetně všech speciálních polí (úkol, soubor, plán, deník, diagram, databáze, virtuální složka, iframe, tagy, metadata, ikona, oblíbené).

### Import

1. **Vybrat soubor** `.nme`
2. Náhled importovaného stromu s počtem poznámek a složek
3. **Cíl** — kořen, aktuální složka nebo libovolná jiná
4. **Konflikty** — pokud existují stejnojmenné poznámky/složky v cíli, zvolte strategii:
   - **Přejmenovat** (přidá „(import)" k názvu)
   - **Přeskočit** existující
   - **Přepsat / sloučit** (u složek sloučí obsah, u poznámek nahradí)

---

## GitHub integrace

NoteBlok umí ukládat a načítat bloky přímo z GitHub repozitáře.

### Nastavení

V dialogu **⚙ Nastavení**:
1. **GitHub Personal Access Token** — vygenerujte na <https://github.com/settings/tokens> (fine-grained: jen Contents read/write na konkrétní repo). Token se ukládá v `localStorage` prohlížeče, ne v souboru.
2. **Cesta v repozitáři** — formát `owner/repo/cesta/soubor.nmb`, např. `egdilna/poznamky/blok.nmb`

### Akce

- **Uložit** (`Alt+S`) — pokud je nastaven token a cesta, ukládá rovnou do GitHubu (PUT na Contents API). Bez cesty se zeptá, zda nastavit cestu nebo uložit jako soubor.
- **Nahrát z GitHubu** — v dialogu **Nahrát** je při existujícím tokenu pole pro cestu s tlačítkem **☁ Načíst z GitHubu**. Pro velké soubory automaticky použije Git Blob API.

### Sdílecí URL

Po uložení s GitHub cestou se URL bloku stane `…/noteblok/?id={base64(cesta)}`. Lze ji sdílet — adresát s tokenem může blok upravovat, bez tokenu jen pro čtení (privátní repo bez tokenu odmítne).

### Režim jen pro čtení

Parametr `?url={URL}` načte blok přímo z libovolné HTTP(S) adresy do režimu jen pro čtení (zmizí tlačítka pro editaci). Vhodné pro publikované bloky na webu.

---

## Nastavení

Dialog **⚙ Nastavení** obsahuje:

| Sekce | Pole |
|---|---|
| Základní | Název bloku |
| Emoji | Vlastní sada emoji (znaky bez oddělovače) — prázdné = výchozí sada cca 50 emoji |
| Kontrola | Odkaz na **Chybějící odkazy a includy** |
| GitHub | Token, cesta v repozitáři, sdílecí URL, tlačítka **Uložit token**, **Uložit jako soubor** |

Pole emoji má živý náhled počtu znaků.

---

## Klávesové zkratky — souhrn

### Globální

| Klávesa | Akce |
|---|---|
| `s` nebo `Alt+S` | Uložit blok |
| `f` nebo `Alt+F` | Hledat |
| `p` nebo `Alt+P` | Skrýt/zobrazit postranní panel |
| `Alt+N` | Nová poznámka |
| `Alt+O` | Nahrát blok |
| `Alt+T` | Přehled úkolů |
| `Alt+H` | Hoist složky |
| `Alt+A` | Zrušit hoist |
| `Shift+R` | Zpět na kořen |

### V pohledu textové poznámky

| Klávesa | Akce |
|---|---|
| `b` | Zpět do nadřazené složky |
| `t` | Štítky |
| `m` nebo `Alt+M` | Metadata |
| `r` | Přejmenovat |
| `Alt+E` | Upravit |
| `Alt+B` | Oblíbené |
| `Alt+C` | Kopírovat MD |
| `Alt+X` | Export DOCX |
| `Alt+I` | Náhled |
| `Alt+D` | Editace sekcí |
| `Alt+W` | Uložit verzi |
| `Alt+R` | Seznam verzí |
| `Shift+M` | Přesunout |
| `Shift+T` | Otevřít v novém panelu |

### Panely

| Klávesa | Akce |
|---|---|
| `Alt+1` až `Alt+9` | Přepnout panel |
| `Shift+I` | Předchozí panel |
| `Shift+O` | Další panel |
| `Shift+W` | Zavřít panel |

### Dialogy

| Klávesa | Akce |
|---|---|
| `Esc` | Zrušit |
| `Enter` | Potvrdit (kromě v textarea) |

### V editoru

| Klávesa | Akce |
|---|---|
| `Tab` | Vložit tabulátor (nepřepíná fokus) |
| `Alt+U` | Uložit |
| `Esc` | Zrušit |

### V prezentaci

| Klávesa | Akce |
|---|---|
| `→`, `Mezerník`, `PageDown` | Další slide |
| `←`, `PageUp` | Předchozí slide |
| `Home` / `End` | První / poslední |
| `O` | Přehled slidů |
| `F` / `F11` | Celá obrazovka |
| `Esc` | Zavřít / opustit přehled |

---

## Technické informace

### Architektura

- **Jeden HTML soubor** (`index.html`, ~7600 řádků) — všechny styly, skripty a HTML šablony inline
- **Žádný build krok** — kód je přímo psaný, používá `var` a tradiční JavaScript bez transpilace
- **Externí knihovny** (přes CDN):
  - **marked.js 15** — markdown renderer
  - **JSZip 3.10** — generování `.docx`
  - **FileSaver.js 2.0** — fallback stahování souborů

### Formát souboru `.nmb`

JSON s následující strukturou (zjednodušeno):

```json
{
  "name": "Můj blok",
  "emojis": "📝📄📋…",
  "ghPath": "owner/repo/cesta.nmb",
  "folders": [{ "id": "…", "name": "…", "parentId": "…|null" }],
  "notes": [{
    "id": "…", "name": "…", "folderId": "…|null",
    "icon": "📝", "content": "markdown…",
    "tags": ["…"], "meta": [{"key":"…","value":"…"}],
    "bookmarked": true,
    "created": "ISO datum", "modified": "ISO datum",
    "versions": [{"id":"…","name":"…","content":"…","date":"…"}],
    "noteType": "file|task|iframe|vfolder|database|diagram|journal|plan",
    "fileVersions|taskData|iframeUrl|vfolderData|dbData|diagramData|journalData|planData": "…"
  }]
}
```

Soubor je vždy pretty-printed (`JSON.stringify(BD, null, 2)`).

### Formát souboru `.nme` (export)

```json
{
  "format": "noteblock-export",
  "version": 1,
  "exported": "ISO datum",
  "items": [{ "type": "folder|note", "name": "…", "children": […], "…": "…" }]
}
```

### Identifikátory

Všechna ID se generují jako `Date.now().toString(36) + Math.random().toString(36).substr(2,6)` — řetězec ~14 znaků, prakticky unikátní v rámci bloku.

### Limity

- **Maximální hloubka rekurze includů** — 10 úrovní (chrání před cyklickými odkazy)
- **Velikost bloku** — omezená pamětí prohlížeče a velikostí stažitelného souboru (typicky desítky až stovky MB při použití typu Soubor)
- **GitHub Contents API** — soubory do 1 MB se přenášejí přímo v base64, větší přes Git Blob API
- **Iframe sandbox** — zabraňuje top-level navigaci a přístupu k localStorage hostitelské stránky

### Bezpečnost

- HTML uživatelského obsahu se escapuje funkcí `esc()` před vložením do DOM
- Externí odkazy v markdownu se automaticky otevírají s `target="_blank" rel="noopener"`
- GitHub token zůstává v `localStorage` prohlížeče, ne v souboru `.nmb`
- Iframe sandbox: `allow-scripts allow-same-origin allow-forms allow-popups`

### Service Worker

Při inicializaci se aktivně odregistrují všechny dříve zaregistrované Service Workery a vyčistí cache (předchozí verze nástroje je používaly a způsobovaly problémy s API voláními).

### Ladění

Tlačítko **DBG** v záhlaví přepíná zelený debug panel dole, do kterého se logují všechny operace s časovou značkou. Hlášení vychází z funkce `dbg()` v kódu a zachycuje i JS chyby.
