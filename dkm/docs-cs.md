# DKM — Dynamic Knowledge Manager

Uživatelská příručka

- **Online nástroj:** <https://nastroje.egdilna.cz/dkm>
- **Rozcestník nástrojů EGdílna:** <https://nastroje.egdilna.cz/#dkm>
- **Zdrojový kód:** <https://github.com/egdilna/nastroje> (složka `dkm`)

---

## Obsah

1. [Co je DKM a k čemu se hodí](#1-co-je-dkm-a-k-čemu-se-hodí)
2. [Začínáme za pět minut](#2-začínáme-za-pět-minut)
3. [Klíčové koncepty](#3-klíčové-koncepty)
4. [Orientace v uživatelském rozhraní](#4-orientace-v-uživatelském-rozhraní)
5. [Práce s entitami](#5-práce-s-entitami)
6. [Typy entit](#6-typy-entit)
7. [Atributy](#7-atributy)
8. [Aspekty](#8-aspekty)
9. [Vazby](#9-vazby)
10. [Hledání, filtry, řazení](#10-hledání-filtry-řazení)
11. [Hromadné operace](#11-hromadné-operace)
12. [Inbox a archiv](#12-inbox-a-archiv)
13. [Markdown a CriticMarkup](#13-markdown-a-criticmarkup)
14. [Více projektů](#14-více-projektů)
15. [Ukládání: lokální a GitHub](#15-ukládání-lokální-a-github)
16. [Import a export dat](#16-import-a-export-dat)
17. [Statický prohlížeč](#17-statický-prohlížeč)
18. [Přenos částí mezi projekty (balíčky)](#18-přenos-částí-mezi-projekty-balíčky)
19. [Nastavení](#19-nastavení)
20. [Klávesové zkratky](#20-klávesové-zkratky)
21. [Přístupnost](#21-přístupnost)
22. [Tipy a triky](#22-tipy-a-triky)
23. [Časté problémy](#23-časté-problémy)
24. [Technické pozadí](#24-technické-pozadí)

---

## 1. Co je DKM a k čemu se hodí

**DKM (Dynamic Knowledge Manager)** je nástroj pro správu strukturovaných znalostí — věcí, lidí, dokumentů, požadavků, smluv, čehokoli, co se dá popsat atributy a propojit vazbami. Místo abys vyplňoval formuláře v rigidní databázi, definuješ si **typy entit** a **vazby** mezi nimi tak, jak ti dává smysl, a postupně do nich přidáváš obsah.

DKM se hodí například na:

- **Osobní informační manažer** — kontakty, projekty, úkoly, knihy, filmy, knowledge graph osobních věcí
- **Datový model softwarového systému** — entity, jejich atributy, vazby mezi tabulkami, audit
- **Legislativní normy a požadavky** — paragrafy, povinnosti, návaznosti, podpůrná dokumentace
- **CRM lehké váhy** — klienti, projekty, smlouvy, lidé na druhé straně
- **Knihovní katalog, kartotéka** — cokoli, co tradičně bylo v kartotéčních boxech
- **Wiki s typovými stránkami** — když Markdown sám nestačí

Nástroj je **jeden HTML soubor** běžící v prohlížeči. Žádný server, žádná instalace, žádný účet. Data jsou tvoje a leží v prohlížeči, případně v GitHub repozitáři pod tvojí kontrolou.

---

## 2. Začínáme za pět minut

1. Otevři nástroj na <https://nastroje.egdilna.cz/dkm> nebo si stáhni `dkm.html` z GitHubu a otevři lokálně.
2. Při prvním otevření tě DKM uvítá s prázdným projektem. Klikni na **Nastavení** v hlavičce.
3. Jdi do **Typy entit** a klikni **+ Přidat typ entity**. Vyplň název (např. „Osoba") a ikonu (třeba 👤).
4. Klikni na ten typ v seznamu a přidej mu atributy (např. „Email" typu URL, „Telefon" typu text, „Popis" typu textarea).
5. Vrať se na hlavní stránku přes klávesu **Esc** nebo logem nahoře.
6. Klikni **+ Nová entita** v záložce Vše a vytvoř první entitu typu Osoba.
7. Po uložení uvidíš entitu v seznamu. Klikni na ni a uvidíš detail.

To je všechno. Zbytek příručky je o tom, jak z toho udělat opravdu užitečný systém.

---

## 3. Klíčové koncepty

DKM stojí na šesti pojmech. Pojďme je projít s konkrétními příklady.

### 3.1 Entita

**Entita** je jedna konkrétní věc, kterou si pamatuješ — *Pavel Novák*, *Smlouva 2026/001*, *iPhone 14 Pro*, *Schůzka s panem ředitelem 4. 6. 2026*. Každá entita má **název** a obvykle **typ**.

### 3.2 Typ entity

**Typ** určuje, jakou strukturu má entita — jaké má atributy. Typ má **jméno** (např. „Osoba", „Smlouva", „Zařízení") a volitelně **ikonu** (emoji, které pomůže rozlišit typy na první pohled).

Klíčové: typ nediktuje obsah, jen šablonu pro atributy. Entita stejného typu nemusí mít všechny atributy vyplněné.

### 3.3 Atribut

**Atribut** je vlastnost entity. Definuje se na úrovni typu (a aspektu, viz dále) — všechny entity stejného typu sdílí stejné atributy.

Datové typy atributů:

- **text** — krátký řetězec na jeden řádek
- **textarea** — víceřádkový text s podporou Markdownu a CriticMarkupu
- **date** — datum
- **url** — odkaz (zobrazí se jako klikatelný)
- **select** — výběr z předem definovaného seznamu hodnot
- **yesno** — ano/ne
- **number** — číslo
- **relation** — odkaz na jinou entitu (volitelně omezený na konkrétní typ)

U každého atributu si můžeš nastavit:

- **Povinný** — DKM nedovolí uložit entitu bez vyplnění
- **Zobrazit v seznamu** — hodnota se zobrazí přímo v kartě entity v seznamech

### 3.4 Aspekt

**Aspekt** je něco jako tag s rozšířením. Aspekt přidává **další atributy** entitě, **nezávisle na jejím typu**.

Příklad: máš typy „Osoba", „Smlouva", „Zařízení". Definuješ aspekt „Schválení" se dvěma atributy: *Kdo schválil* (relation na Osobu) a *Kdy* (date). Aspekt „Schválení" pak můžeš přiřadit jakékoli entitě — osobě, smlouvě, zařízení — a u každé budeš mít přístup k těm dvěma navíc atributům.

Aspekt se používá také jako:

- **Filtr** v seznamech (záložka „Aspekt: Schválení" ukáže všechny entity, které ten aspekt mají)
- **Sémantický tag** (entita „je VIP", „je archivovaná logika", „prošla auditem")
- **Modifikátor stavu** s atributy o tom stavu

Entita může mít libovolný počet aspektů současně.

### 3.5 Vazba (relace)

**Vazba** propojuje dvě entity. Vazba má svůj **typ** se jménem (např. „spolupracuje s") a obvykle **opačné jméno** (např. „spolupracuje s" pro symetrické, nebo „je nadřízený / je podřízený" pro asymetrické).

Vazba má **scope** (rozsah platnosti):

- **universal** — funguje mezi entitami libovolných typů
- **from / to / specific** — omezuje, mezi kterými typy entit vazba může vzniknout

Vazby jsou jednosměrné v datech, ale DKM zobrazuje obě strany: u entity vidíš její **vazby** (kam vede) i **odkazuje sem** (kdo na ni ukazuje), takže to vypadá jako obousměrná návaznost.

### 3.6 Vlastní atribut (custom attribute)

Někdy potřebuješ na **konkrétní jednu entitu** zapsat něco, co nepatří do typu ani aspektu. Vlastní atribut je ad hoc atribut, který platí jen pro tu entitu. Má stejné datové typy jako standardní atribut, ale není sdílený s ničím jiným.

Příklad: typ „Osoba" nemá atribut „Oblíbená káva". Pavel ale rád espresso. Přidáš mu vlastní atribut „Káva: espresso" jen pro Pavla.

---

## 4. Orientace v uživatelském rozhraní

DKM má tři hlavní pohledy: **Seznam** (výchozí), **Detail entity**, **Editor entity**. Plus **Nastavení**.

### 4.1 Hlavička

Vždy nahoře. Obsahuje:

- **Logo / název projektu** — kliknutí vrátí na hlavní seznam
- **Načíst** — otevře soubor `.dkmdata` jako nový projekt
- **Uložit** — uloží aktuální projekt (lokálně nebo na GitHub, viz [Ukládání](#15-ukládání-lokální-a-github))
- **Export** — XLSX export aktuálního pohledu (filtrovaných entit)
- **Import TSV** — naimportuje entity z tabulky (Excel TSV / CSV / paste ze schránky)
- **Nastavení** — projekt, typy, aspekty, vazby, seznamy, jazyk
- **Indikátor neuložených změn** (puntík, pokud je projekt dirty)

### 4.2 Toolbar nad seznamem

- **Záložky**: Inbox, Vše, jednotlivé typy entit, jednotlivé aspekty, Archiv. Klikem se přepneš na pohled, který obsahuje jen entity z dané kategorie. (Co se v záložkách zobrazí, určuje **Nastavení → Typy / Aspekty → Zobrazit jako záložku**.)
- **Hledání** — fulltext napříč jménem a textovými atributy
- **Filtr** — typ, aspekt, datum aktualizace
- **Řazení** — podle data úpravy / názvu / data vytvoření
- **+ Nová entita** — vytvoří entitu (otevře dialog s výběrem typu nebo otevře editor)
- **☑ Výběr** — zapne režim hromadných akcí (viz [Hromadné operace](#11-hromadné-operace))

### 4.3 Karta entity

V seznamu se každá entita zobrazuje jako karta s:

- **Ikona typu** + **název entity** v nadpisu (např. 👤 *Pavel Novák*)
- **Badge** s názvem typu, případně 📥 Inbox, 📦 Archiv a aspekty (◎ *VIP*)
- **Snippet** — krátký výtah z první textarea atributu
- **Hodnoty atributů s „Zobrazit v seznamu"** — pokud jsou nějaké zapnuté
- **Datum úpravy** a počet vazeb

Kliknutí na kartu otevře detail.

### 4.4 Detail entity

- **Nadpis** — název s ikonou typu, badge typu, badges aspektů
- **Akce**: Upravit, Duplikovat, Změnit typ, Archivovat, Smazat
- **Atributy** — všechny vyplněné atributy (z typu, z aspektů, vlastní)
- **Vazby** — entity, kam vede vazba od této entity, seskupené podle typu vazby
- **Odkazuje sem** — entity, ze kterých vede vazba na tuto entitu
- **Strukturální pohled** — 🌳 hierarchický strom podle vazeb (rozkrývá síť návaznosti)

### 4.5 Editor entity

- **Název** — povinný
- **Typ** — dá se změnit přes Změnit typ
- **Inbox** — checkbox „v Inboxu"
- **Atributy typu** — pole podle datového typu (text input, textarea s preview, datum, select, atd.)
- **Aspekty** — sekce „Aspekty" s checkboxy. Zaškrtnutí přidá aspekt a okamžitě se zobrazí jeho atributy ve formuláři.
- **Vlastní atributy** — sekce, kde můžeš přidat ad hoc atribut k této entitě
- **Vazby** — sekce s aktuálními vazbami, tlačítko + Přidat vazbu
- **Uložit / Zrušit** v zápatí (a klávesa **U** uloží)

### 4.6 Nastavení

Levý panel se sekcemi:

- **Projekt** — název, popis, GitHub cesta, statický prohlížeč, import balíčku, seznam projektů
- **Typy** — seznam typů entit, klikem se přepne na editor typu (atributy, ikona, název)
- **Aspekty** — analogie typů, ale pro aspekty
- **Vazby** — relační typy, jejich jména, scope, povolené typy
- **Seznamy** — select listy s výčtem hodnot
- **Jazyk** — čeština / angličtina

---

## 5. Práce s entitami

### 5.1 Vytvoření entity

Tři způsoby:

**A) Tlačítkem + Nová entita** v záložce daného typu vytvoří entitu přímo daného typu. Otevře se editor.

**B) Tlačítkem + Nová entita** v záložce Vše nebo v aspektu otevře výběrový dialog — vyber typ, nebo „📥 Přidat do Inboxu" (entita bez typu, později přiřadíš).

**C) Quick-add** v záložce Inbox: vyplň jméno a krátký popis, klávesa Enter založí entitu v Inboxu.

### 5.2 Editace

Klikni na entitu v seznamu, pak **Upravit**. Klávesová zkratka **E** v detailu otevře editor.

Změny se ukládají, až klikneš **Uložit** (zkratka **U**). Pokud opustíš editor (Esc nebo Zrušit), změny se zahodí.

### 5.3 Duplikace

V detailu **Duplikovat** vytvoří kopii entity (včetně typu, atributů, vlastních atributů, vazeb a aspektů). Název dostane suffix „(kopie)" a otevře se editor pro doladění.

### 5.4 Změna typu

V detailu **Změnit typ** ukáže výběr typů. Pokud změníš typ, atributy se stejným názvem a kompatibilním datovým typem v novém typu zachovají své hodnoty. Ostatní atributy přijdou o hodnotu.

### 5.5 Archivace

**Archivovat** přesune entitu do záložky Archiv. Z normálních seznamů zmizí, ale data, vazby a aspekty se zachovají. Z Archivu ji můžeš obnovit zpět.

### 5.6 Smazání

**Smazat** vyžaduje potvrzení a je nevratné (až na zálohy). Po smazání se automaticky odstraní i vazby z ostatních entit, které ukazovaly na smazanou.

---

## 6. Typy entit

### 6.1 Definice typu

V **Nastavení → Typy → + Přidat typ entity**. Otevře se editor typu:

- **Ikona** — emoji nebo krátký řetězec, který se zobrazí jako prefix v kartách (např. 👤, 📄, 🛡)
- **Název** — lidsky čitelný (např. „Osoba", „Smlouva", „Aktivum")
- **Atributy** — seznam, který určuje strukturu entity. Pořadí lze přesouvat šipkami.

### 6.2 Atributy v typu

U každého atributu:

- **Název** — jak se atribut jmenuje (např. „Email", „Datum narození")
- **Typ** — datový typ (viz [3.3](#33-atribut))
- **Povinný** — checkbox, vynutí vyplnění při ukládání entity
- **Zobrazit v seznamu** — checkbox, hodnota se promítne do karet
- Pro **select** se nastavuje propojený **Seznam** (definovaný v Nastavení → Seznamy)
- Pro **relation** se nastavuje **Cílový typ** (omezení) a **multi** (víc cílů)

### 6.3 Záložka pro typ

V seznamu Nastavení → Typy je u každého typu **„Zobrazit jako záložku"** — pokud zaškrtneš, vznikne v hlavním toolbaru samostatná záložka pro entity tohoto typu.

### 6.4 Smazání typu

Smazání typu nesmaže entity — ty jen ztratí typ (zůstanou jako entity bez typu, v Inboxu, viditelné v záložce Vše). Vazby a aspekty zůstávají. Smazání typu se potvrzuje dialogem.

---

## 7. Atributy

### 7.1 Datové typy

| Typ | Použití | Vstup |
|---|---|---|
| text | krátký řetězec | jednořádkové pole |
| textarea | dlouhý text, popis | víceřádkové, podporuje Markdown a CriticMarkup |
| date | datum | datepicker |
| url | odkaz | URL, zobrazí se jako klikatelný |
| select | výběr z výčtu | dropdown |
| yesno | ano/ne | checkbox |
| number | číslo | numerický input |
| relation | odkaz na entitu | výběr z entit, případně omezený typem |

### 7.2 Atribut „Povinný"

Při ukládání entity DKM zkontroluje povinné atributy. Pokud nejsou vyplněné, focus skočí na první prázdný a uložení se nepovede.

### 7.3 Atribut „Zobrazit v seznamu"

Praktické pro klíčové vlastnosti, které potřebuješ vidět bez otvírání detailu. V kartě se objeví ve formátu `Název: Hodnota`. Funguje pro všechny datové typy včetně Markdownu (rendrovaný), URL (klikatelný), relace (odkaz na cílovou entitu).

### 7.4 Custom atributy (vlastní)

Ad hoc atribut, který se přidá jen k té jedné entitě v editoru, sekce Vlastní atributy. Má jméno, datový typ a hodnotu. Užitečné, když nechceš měnit celý typ kvůli jedné výjimce.

---

## 8. Aspekty

### 8.1 Definice aspektu

V **Nastavení → Aspekty → + Přidat aspekt**. Definuješ:

- **Název** — např. „VIP", „Schváleno", „Pod auditem"
- **Atributy** — seznam atributů, které se přidají k entitě, jakmile dostane tento aspekt

### 8.2 Přiřazení aspektu

V editoru entity je sekce **Aspekty** se zaškrtávátky. Zaškrtnutím přidáš aspekt — atributy aspektu se okamžitě objeví ve formuláři pod atributy typu. Odškrtnutím aspekt odstraníš (DKM se ujistí, jestli to chceš, a vyčistí hodnoty atributů aspektu).

### 8.3 Aspekt jako filtr

Stejně jako u typů je v Nastavení → Aspekty u každého aspektu „Zobrazit jako záložku". Pokud zaškrtneš, vznikne záložka v toolbaru a vidíš všechny entity, které ten aspekt mají.

### 8.4 Aspekt vs. atribut typu — kdy co

- **Typ** = co entita **je** (Osoba, Smlouva). Striktní šablona.
- **Aspekt** = jaký **stav** nebo **vlastnost navíc** entita má (VIP, schválená, pod auditem). Volitelný a kombinovatelný.

Aspekt drží data o stavu (kdo, kdy, jak). Když se stav změní, aspekt prostě odebereš a atributy aspektu zmizí.

---

## 9. Vazby

### 9.1 Definice typu vazby

V **Nastavení → Vazby → + Přidat typ vazby**:

- **Název** — jak se vazba čte ve směru vytváření (např. „je nadřízeným")
- **Opačné jméno** — jak se čte zpátky (např. „je podřízeným"); pro symetrickou vazbu nastav stejné jméno
- **Scope**:
  - **universal** — mezi libovolnými typy
  - **from** — omezí jen výchozí typ
  - **to** — omezí jen cílový typ
  - **specific** — omezí oba (např. Smlouva → Osoba)
- **From types / To types** — seznamy typů (závisí na scope)

### 9.2 Přidání vazby k entitě

V detailu nebo editoru entity tlačítko **↔ Přidat vazbu** (klávesa **R** v detailu):

1. Vyber typ vazby z dropdownu
2. Vyber cílovou entitu (s filtrem podle typu a textu)
3. Klik na **+ Přidat / ✓ Vybrat** přidá vazbu

V editoru existující vazby vidíš v sekci Vazby. Křížkem je odebereš.

### 9.3 Vazby v detailu

V detailu jsou vazby seskupené podle typu:

- **Vazby**: seznam, kam vede vazba **od** této entity
- **Odkazuje sem**: vazby, které vedou **na** tuto entitu z jiných (backlinks)

Klik na vazbu otevře detail cílové entity.

### 9.4 Strukturální pohled

V detailu **🌳 Strukturální pohled** rozbalí hierarchický strom: tato entita, její vazby, vazby vazeb, atd. — až do hloubky 3 nebo dokud strom neskončí. Cyklické závislosti jsou detekovány a označeny.

### 9.5 Atribut typu „relation"

Alternativa k samostatným vazbám: atribut datového typu „relation" drží odkaz(y) na jiné entity přímo v datech entity, ne jako samostatnou vazbu. Praktické pro klíčové strukturální vztahy (například „Smlouva má klienta — vždy jednu osobu"). Vazba je univerzálnější (víc vazeb, různé typy), atribut typu relation je striktnější (přesně daný počet, vždy stejná pozice).

---

## 10. Hledání, filtry, řazení

### 10.1 Fulltextové hledání

V toolbaru pole **Hledat**. Hledá v:

- Názvu entity
- Textových atributech (text, textarea, url, select)
- Vlastních atributech

Hledání je case-insensitive, slovní (vyhledává podřetězce). Klávesa **F** nebo **/** zaměří hledání.

### 10.2 Filtry

- **Filtr typu** — jen entity daného typu (pokud nejsi v záložce typu)
- **Filtr aspektu** — jen entity s daným aspektem (pokud nejsi v záložce aspektu)
- **Filtr data** — kdy naposledy upravena (dnes, týden, měsíc, rok)

### 10.3 Řazení

- **Naposledy upraveno** (výchozí, sestupně)
- **Název** (vzestupně)
- **Vytvořeno** (sestupně)

---

## 11. Hromadné operace

### 11.1 Aktivace režimu

V toolbaru list view tlačítko **☑ Výběr** (klávesa **V**). Po zapnutí:

- U každé karty entity se vlevo objeví zaškrtávátko
- Klik na kartu toggluje zaškrtávátko (nepřesouvá na detail)
- Vybrané karty mají barevné zvýraznění
- Toolbar se rozšíří o **panel hromadných akcí**

Vypnout výběr: tlačítko **☐ Zrušit výběr**, klávesa **V**, klávesa **Esc**.

### 11.2 Panel akcí

Obsahuje:

- **Počet vybraných**
- **Vybrat vše viditelné** — vybere všechny entity, které vyhovují aktuálnímu filtru
- **Odznačit vše**
- **Akce** — dropdown se seznamem
- **Provést** — spustí vybranou akci

### 11.3 Dostupné akce

1. **⇄ Změnit typ** — změní typ vybraným entitám. Atributy se stejným názvem a kompatibilním datovým typem v novém typu si zachovají hodnotu.
2. **+ Přidat aspekt** — vybere aspekt z dropdownu (s počítadlem „chybí u N entit") a přidá ho tam, kde chybí.
3. **− Odebrat aspekt** — odebere aspekt entitám, které ho mají. Vyčistí i hodnoty atributů aspektu.
4. **✎ Nastavit atribut** — dropdown sjednocuje atributy napříč vybranými (z typů i aspektů, se značkou „TypeName / AttrName (N×)"). Po výběru atributu zadáš novou hodnotu. Aplikuje se jen na entity, které atribut mají.
5. **⌫ Vyprázdnit atribut** — totéž, ale bez zadání hodnoty (vyprázdní).
6. **↔ Přidat vazbu** — typ vazby + cílová entita. Přidá vazbu z každé vybrané entity na cíl. Přeskočí self, duplikáty a entity, na které vazba nepasuje podle scope.
7. **📦 Exportovat výběr do balíčku** — viz [Přenos částí mezi projekty](#18-přenos-částí-mezi-projekty-balíčky).
8. **📥 Vrátit do Inboxu** — `inInbox=true`
9. **📤 Vyjmout z Inboxu** — `inInbox=false`
10. **📦 Archivovat** — s potvrzovacím dialogem
11. **♻ Obnovit z archivu** — viditelné jen v záložce Archiv
12. **🗑 Smazat** — s důrazným potvrzením, nevratné

### 11.4 Chování po akci

Po dokončení akce se výběr **vyčistí**, ale režim výběru **zůstává aktivní**. Můžeš ihned vybrat jinou sadu entit a provést další akci. Nebo, když výběr necháš stejný, akce „přidat aspekt" a hned za ní „nastavit atribut aspektu" funguje řetězovitě (po každé akci si výběr provedeš znovu).

---

## 12. Inbox a archiv

### 12.1 Inbox

Záložka **📥 Inbox** drží entity bez typu nebo entity, které jsi tam ručně dal (např. „rychlý zápisek, který později zařadím"). Inbox je nárazník pro nezatříděné položky.

**Quick-add** v Inboxu: zadej název + krátký popis, **Enter** vytvoří entitu v Inboxu.

V detailu entity v Inboxu vidíš tlačítko **Převést na typ** — vybereš typ a entita se přiřadí, vystoupí z Inboxu.

### 12.2 Archiv

Záložka **📦 Archiv** drží entity, které už nepotřebuješ aktivně, ale chceš si je zachovat. Archivované entity:

- Nejsou v seznamech (Vše, podle typu, podle aspektu, vyhledávání)
- Nejsou v entity selectorech při tvorbě vazeb
- Zůstávají v datech a vazbách (entita A v archivu, ale na ni vede vazba z B — v B vazba zůstává)
- Lze obnovit jediným klikem

Archiv slouží spíš jako „neaktivní" než jako trash bin. Pro definitivní mazání použij Smazat.

---

## 13. Markdown a CriticMarkup

V atributech datového typu **textarea** lze používat Markdown a CriticMarkup. V detailu se text rendruje, v editoru je zdrojový kód.

### 13.1 Markdown — co funguje

| Zápis | Výsledek |
|---|---|
| `**tučně**` | **tučně** |
| `*kurzíva*` | *kurzíva* |
| `` `kód` `` | `kód` |
| `~~přeškrtnuto~~` | ~~přeškrtnuto~~ |
| `[odkaz](https://...)` | [odkaz](https://...) |
| `# Nadpis` | Velký nadpis |
| `## Podnadpis` | Menší nadpis |
| `- bod` | seznam s odrážkami |
| `1. číslo` | číslovaný seznam |
| `> citace` | citace |
| ` ``` blok ``` ` | blok kódu |

### 13.2 CriticMarkup

Pro značení redakčních úprav v textu:

| Zápis | Význam |
|---|---|
| `{++přidáno++}` | nový text (zobrazí se zeleně, podtrženě) |
| `{--smazáno--}` | smazaný text (zobrazí se červeně, přeškrtnutě) |
| `{~~původní~>nový~~}` | nahrazení (původní přeškrtnuto, nový tučně) |
| `{==zvýraznění==}` | žluté zvýraznění |
| `{>>komentář<<}` | komentář na okraj |

CriticMarkup se rendruje jako pravý HTML (`<ins>`, `<del>`, `<mark>`) a v exportech (XLSX) se zachovává jako čitelný text.

---

## 14. Více projektů

DKM podporuje libovolný počet projektů vedle sebe v jednom prohlížeči.

### 14.1 Seznam projektů

V **Nastavení → Projekt → Všechny projekty** vidíš seznam všech projektů uložených lokálně. U každého tlačítka:

- **Přepnout** — otevře projekt v této záložce (nahradí aktuální)
- **V nové záložce** — otevře projekt v nové záložce prohlížeče (paralelní práce)
- **×** — smaže projekt (s potvrzením)

### 14.2 Nový projekt

Tlačítko **+ Nový projekt** vytvoří prázdný projekt a otevře ho.

### 14.3 URL parametr `?p={id}`

Každý projekt má své id (např. `p_abc123`). Když přidáš `?p=p_abc123` na URL, otevře se konkrétní projekt. To umožňuje mít víc projektů v různých záložkách prohlížeče současně, každý se svými daty.

---

## 15. Ukládání: lokální a GitHub

### 15.1 Lokální (localStorage prohlížeče)

DKM ukládá data do localStorage prohlížeče pod klíče:

- `dkm-projects-v1` — seznam projektů s metadaty
- `dkm-pdata-{id}` — data konkrétního projektu
- `dkm-active-project` — id aktuálně otevřeného

**Autosave** je defaultně zapnutý (Nastavení → Jazyk → Autosave). Při změně se po krátké pauze projekt uloží lokálně.

Manuálně **Uložit** (klávesa **S**) uloží okamžitě.

### 15.2 GitHub

DKM umí ukládat projekt do GitHub repozitáře jako soubor `.dkmdata`. Konfigurace:

1. V GitHubu vygeneruj **Personal Access Token** s právem `repo` (Fine-grained nebo Classic). Token uchovej v bezpečí.
2. V DKM v hlavičce uvidíš ikonku zámku — klikni a vlož token. Token se ukládá per-zařízení v localStorage (`dkm-gh-token`). **Není** součástí projektových dat.
3. V Nastavení → Projekt vyplň **GitHub cesta** ve formátu `username/repository/path/file.dkmdata`. Příklad: `egdilna/data/dkm/muj-projekt.dkmdata`.
4. Klikni **Uložit** (S). DKM přečte aktuální obsah souboru v GitHubu (kvůli SHA), zapíše nový a commitne.

**Načítání z GitHubu** se děje automaticky: pokud má projekt GitHub cestu, při otevření DKM stáhne nejnovější verzi a porovná s lokální.

### 15.3 Konflikty

Pokud uložíš lokálně něco, co se v mezičase změnilo na GitHubu, DKM ti to oznámí a nabídne řešení (zachovat lokální, vzít z GitHubu, nebo otevřít diff). Konflikty jsou v praxi vzácné, ale stávají se při práci z více zařízení.

### 15.4 Žádný server, žádná telemetrie

DKM **neposílá data nikam**, kromě GitHubu (kam to ty sám pošleš tokenem). Žádná telemetrie, žádný cloud, žádné účty.

---

## 16. Import a export dat

### 16.1 Načíst `.dkmdata`

Tlačítko **Načíst** v hlavičce (klávesa **L**) otevře file dialog. Soubor `.dkmdata` je JSON projektu — DKM ho otevře jako nový projekt vedle stávajících.

### 16.2 Uložit `.dkmdata` ručně

Vedle automatického ukládání lze projekt **exportovat** jako `.dkmdata` soubor pro zálohu nebo přesun. V Nastavení → Projekt → **Stáhnout zálohu projektu**. Soubor obsahuje vše: data, typy, aspekty, vazby, seznamy, nastavení.

### 16.3 Export XLSX

Tlačítko **Export** v hlavičce. Vygeneruje XLSX (Excel) tabulku aktuálních filtrovaných entit. Sloupce:

- ID, Název, Typ, Inbox, Archiv, Aspekty
- Atributy typu (`TypeName / AttrName`)
- Atributy aspektů (`AspectName / AttrName`)
- Vlastní atributy (`* name`)
- Vazby (jako řetězec `typ → cíl; typ → cíl`)
- Vytvořeno, Upraveno

Markdown/textarea hodnoty mají v Excelu zapnutý wrap text. Datumy jsou skutečné datumy (ne text). Čísla jsou čísla. První řádek je tučný se zamrznutým autofiltrem.

DKM si SheetJS knihovnu lazy-stáhne z CDN při prvním kliku.

### 16.4 Import TSV

Tlačítko **Import TSV** v hlavičce. Dialog se dvěma kartami:

- **Soubor** — vyber `.tsv`, `.txt`, `.csv`
- **Vložit ze schránky** — paste tabulku z Excelu / Google Sheets

DKM detekuje oddělovač (TAB, středník, čárka). První řádek je hlavička. Mapování sloupců:

- **Název** (taky „Name", „Title", „Jméno") — povinný sloupec
- **Typ** — namapuje typ entity podle názvu
- **Aspekty** — středníkem oddělené názvy aspektů
- **Inbox**, **Archiv** — 1/0/ano/ne/x
- Ostatní sloupce se zkouší namapovat na atributy podle názvu. Formát `Typ / Atribut` upřesní mapování pro situace, kdy stejný název atributu existuje ve více typech.

Neznámé sloupce se ignorují. Entity se stejným jménem a typem se aktualizují (ne duplikují). Po importu vidíš toast „Import: přidáno X, aktualizováno Y, přeskočeno Z".

---

## 17. Statický prohlížeč

V **Nastavení → Projekt → Statický prohlížeč** je tlačítko **⬇ Stáhnout HTML prohlížeč**. Vygeneruje samostatný HTML soubor s daty zabalenými uvnitř. Soubor:

- Funguje offline a bez serveru
- Otevřeš ho v libovolném prohlížeči
- **Read-only** — žádné editování, pouze procházení
- Má vše: záložky, hledání, filtry, detail, atributy, aspekty, vazby, backlinks, Markdown
- Dá se sdílet (e-mailem, nahrát na server, dát na flashku)
- Velikost = velikost JSON projektu + ~35 KB UI kódu

Použití: dodáš někomu výsledek své práce, aby si ho mohl prohlédnout bez instalace DKM, bez GitHub přístupu, bez čehokoli — jen otevře HTML.

---

## 18. Přenos částí mezi projekty (balíčky)

Když máš víc projektů a chceš mezi nimi přenášet části (typy, entity, vazby), použij **balíčky `.dkmpkg`**.

### 18.1 Export do balíčku

V hromadných operacích akce **📦 Exportovat výběr do balíčku**:

- Volba **co zahrnout**: pouze vybrané / + sousedi 1. úrovně / + celá propojená komponenta
- Volitelný **popis balíčku**
- Stažený `.dkmpkg` obsahuje použitý kus modelu (typy, aspekty, vazební typy, seznamy) + entity samotné

### 18.2 Import balíčku

V **Nastavení → Projekt → Importovat balíček (.dkmpkg)**. Wizard má 8 kroků:

1. **Shrnutí** — co balíček obsahuje, volba režimu **Easy** (automatické mapování) nebo **Detailní** (krok za krokem)
2. **Mapování typů** (Detailní) — pro každý typ z balíčku: Vytvořit nový / Použít existující / Přeskočit. Při existujícím se rozbalí mapování atributů.
3. **Mapování aspektů** (Detailní) — stejně.
4. **Mapování vazeb** (Detailní) — stejně.
5. **Mapování seznamů** (Detailní) — Vytvořit nový / Sloučit s existujícím / Přeskočit.
6. **Konflikty ID entit** (Detailní) — pro entity se stejným ID: Importovat jako novou / Přepsat / Přeskočit.
7. **Náhled** — co se přidá / přepíše / zahodí, případná upozornění.
8. **Hotovo** — výsledný log.

Před importem se nabízí stažení **zálohy cílového projektu** (`.dkmdata` s datem v názvu). Doporučuje se zapnuté.

### 18.3 Bezpečnost

- Vlastní atributy entit se přenášejí 1:1 (jsou per-entity)
- Pole atributu, které se v cílovém typu nedohledá, se naimportuje jako nový atribut
- Vazby uvnitř balíčku se zachovávají, vazby ven se zahazují s počítadlem
- Hodnoty atributů typu „relation" se přemapují na nová ID entit
- Datatype kompatibilita: text ⇔ textarea ⇔ url, ostatní typy jen samy se sebou

---

## 19. Nastavení

### 19.1 Projekt

- **Název** a **popis** projektu
- **GitHub cesta** (per-projekt)
- **Všechny projekty** — seznam, přepínání, nový projekt, smazání
- **Statický prohlížeč** — generování offline HTML
- **Přenos mezi projekty** — import balíčku
- **Stáhnout zálohu projektu** — XLSX, .dkmdata

### 19.2 Typy

- Seznam typů
- Editor typu: ikona, název, atributy
- U každého typu: zobrazit jako záložku

### 19.3 Aspekty

Stejně jako typy, ale bez ikony.

### 19.4 Vazby

Relační typy: název, opačné jméno, scope, omezení typů.

### 19.5 Seznamy

Select listy: název + výčet hodnot. Použijí se v atributu typu select.

### 19.6 Jazyk a obecné

- **Jazyk** — čeština / angličtina, přepíná UI okamžitě
- **Autosave** — zapnout / vypnout
- **Debug výpis** — zapne diagnostický panel na stránce (žádný browser console — všechno se vypisuje přímo do DKM)

---

## 20. Klávesové zkratky

Mimo input pole a dialogy:

| Klávesa | Akce |
|---|---|
| **S** | Uložit (smart routing — lokální nebo GitHub) |
| **L** | Načíst soubor |
| **I** | Záložka Inbox |
| **Q** | Quick add v Inboxu |
| **N** | Nová entita |
| **A** | Záložka Vše |
| **E** | Upravit (v detailu) |
| **R** | Přidat vazbu (v detailu) |
| **U** | Uložit změny (v editoru) |
| **V** | Zapnout / vypnout výběr |
| **F** nebo **/** | Zaměřit hledání |
| **Esc** | Zpět / zrušit dialog / vypnout výběr |
| **Alt+L** | (alias pro L na MacOS / různých klávesnicích) |
| **Alt+S** | (alias pro S) |
| **Alt+U** | (alias pro U) |
| **Alt+R** | (alias pro R) |

V dialogu:

- **Enter** — primární akce
- **Esc** — zavřít

---

## 21. Přístupnost

DKM je navržen pro práci se screen readery (VoiceOver, NVDA, JAWS):

- Všechna tlačítka mají `aria-label`
- Karty entit používají `role="listitem"` v `role="list"`
- Detail entity má strukturované sekce s nadpisy
- Žádné `position: sticky` ani `fixed`, které zlobí screen readery
- `aria-live` jen pro krátká potvrzení akcí, nikdy pro dlouhá re-rendrovaná pole
- Tabové sekvence respektují DOM pořadí
- Stavy `aria-current`, `aria-selected`, `aria-pressed` jsou nastavené
- Vizuální stavy (focus, hover, selected) mají vždy doprovod v textu nebo aria atributu

Klávesové zkratky umožňují celé ovládání bez myši.

---

## 22. Tipy a triky

### 22.1 Začni jednoduše

Když si nejsi jistý strukturou, začni s jedním typem a jednou aspekty. Nový typ / aspekt / vazbu přidáš kdykoli později. Lepší minimální struktura, kterou používáš, než dokonalá nepoužívaná.

### 22.2 Aspekt místo dalšího typu

Když řešíš „je to typ Osoba, ale má se chovat trochu jinak" — přidej Osobě aspekt místo aby vznikal nový typ. Aspekty se kombinují, typy ne.

### 22.3 „Zobrazit v seznamu" pro klíčové atributy

U typu se ujistí pár klíčových atributů s `showInList`. Při scrollování seznamu vidíš podstatu bez otevírání detailu.

### 22.4 GitHub jako záloha + sync

I když pracuješ z jednoho zařízení, GitHub funguje jako automatická záloha. Při ztrátě localStorage stačí načíst soubor z GitHubu zpět.

### 22.5 Strukturální pohled na komplexní vztahy

🌳 v detailu rozkrývá hierarchii. Hodí se na audit „kdo všechno závisí na téhle entitě" nebo „co všechno tato entita ovládá".

### 22.6 Statický prohlížeč pro sdílení

Když potřebuješ ukázat výsledek někomu, kdo nemá DKM nainstalovaný, vygeneruj statický HTML. Funguje na flashce, na webu, v e-mailu.

### 22.7 TSV import pro hromadný nábor dat

Existující excelová tabulka lidí, smluv, čehokoli s typy v jednom sloupci a atributy v dalších — Import TSV ji dostane do DKM za pár sekund.

### 22.8 Hromadné akce po importu

Po TSV importu typicky chceš všem naimportovaným entitám přidat aspekt „Naimportováno 2026-06" nebo nastavit nějaký atribut. ☑ Výběr → Vybrat vše viditelné → Akce.

### 22.9 Hledání podle vzoru

Hledání hledá podřetězce. Pokud chceš najít všechny entity s atributem začínajícím na „DOKUM_", napiš „DOKUM_" do search boxu — najde vše v názvech a v textových atributech.

### 22.10 Custom atribut jako poznámka

Když je atribut potřeba jen u jedné entity (specifická poznámka, výjimečný status), přidej vlastní atribut místo úpravy typu.

---

## 23. Časté problémy

### 23.1 „Soubor není platný DKM JSON"

Soubor musí být JSON s polem `entities` jako pole. Pokud načítáš `.dkmpkg` přes Načíst, použij místo toho Nastavení → Projekt → Importovat balíček. Pokud je soubor opravdu DKM data a hlásí to tuhle chybu, podívej se do debug panelu (Nastavení → Debug výpis), tam je důvod.

### 23.2 Změny se neukládají

Zkontroluj, zda je zapnutý autosave (Nastavení). Pokud používáš GitHub, ujisti se, že máš zadaný token (ikonka zámku v hlavičce) a platnou cestu. Manuálně uložíš klávesou S.

### 23.3 GitHub říká 401 / 403

- 401: token chybí nebo není platný — zkontroluj token v ikoně zámku
- 403: token nemá oprávnění k repozitáři — vygeneruj nový token s `repo` scope

### 23.4 Po importu balíčku entity nemají atributy

Při Easy režimu se atributy mapují automaticky podle názvu a datového typu. Pokud názvy nesedí, použij Detailní mode a namapuj atributy ručně.

### 23.5 Aspekt zaškrtnu, ale atributy nevidím

Atributy aspektu se objevují **v editoru** (po zaškrtnutí checkboxu v sekci Aspekty). V detailu vidíš pouze ty atributy aspektu, které mají vyplněnou hodnotu. Pokud chceš vidět prázdné, otevři Upravit.

### 23.6 Pomalé scrollování v seznamu s tisíci entitami

DKM rendruje všechny entity najednou (žádný virtuální scroll). Pro projekty s víc než 5 000 entitami:

- Skryj záložky typů, které nepoužíváš denně (Nastavení → Typy → Zobrazit jako záložku)
- Použij filtr nebo hledání, abys zúžil seznam
- U typu, který má hodně entit, zvaž rozdělení na víc projektů

### 23.7 LocalStorage je plný

Prohlížeč má limit (typicky 5–10 MB per origin). Když DKM hlásí, že nemůže uložit:

- Smaž nepoužívané projekty
- Velký projekt přesuň na GitHub (cesta v Nastavení → Projekt) — lokálně zůstane jen pracovní kopie

### 23.8 Po smazání typu zmizely vazby

Smazání typu vazby ano — odebere všechny vazby tohoto typu z entit. Smazání typu entity nikoli (entity zůstanou bez typu).

---

## 24. Technické pozadí

DKM je **jeden HTML soubor** s vanilkovým JavaScriptem. Žádné build tooly, žádné dependencies (kromě SheetJS, který se lazy načítá z CDN pro XLSX export).

- **Velikost**: ~300 KB HTML + JS + CSS + i18n
- **Prohlížeče**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+
- **Mobil**: funguje na mobilech, ale UI je primárně desktopové
- **Šablona dat**: JSON s entitami, typy, aspekty, vazbami, seznamy

Zdrojový kód: <https://github.com/egdilna/nastroje> ve složce `dkm`.

Aplikace vznikla v rámci EGdílny, projektu pro nástroje veřejné správy. Žádná telemetrie, žádný server, žádné účty.

---

*Otázky, návrhy, chyby? GitHub issues v repozitáři výše.*
