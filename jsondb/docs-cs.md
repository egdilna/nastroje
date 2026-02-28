# JSONDB Editor – Editor databáze

**JSONDB Editor** je výkonný editor databází běžící přímo v prohlížeči. Nevyžaduje žádný server, instalaci ani připojení k internetu. Vaše data zůstávají pouze ve vašem počítači.

🌐 **Online verze:** [mrt.site44.com/database-editor](https://mrt.site44.com/database-editor)  
📦 **GitHub:** [github.com/michalradacz/database-editor](https://github.com/michalradacz/database-editor)

## Způsoby použití

### Online verze
Jednoduše otevřete [online verzi](https://mrt.site44.com/database-editor) v prohlížeči a začněte pracovat. Data se ukládají v rámci relace prohlížeče – můžete mít otevřeno více databází v různých kartách současně.

### Offline verze
1. Stáhněte si soubor `database-editor.html` z [GitHubu](https://github.com/michalradacz/database-editor)
2. Otevřete soubor v libovolném moderním prohlížeči
3. Pracujte offline bez připojení k internetu

### DokuWiki integrace
Editor lze integrovat jako plugin do systému DokuWiki. Plugin najdete ve složce `jsondbeditor` na GitHubu.

---

## Základní koncepty

### Databáze
Databáze je soubor ve formátu `.jsondb`, který obsahuje všechny vaše tabulky, záznamy, kolekce, tagy a nastavení. Databázi můžete:
- Uložit jako soubor na disk
- Načíst ze souboru
- Kopírovat/vložit jako JSON text

### Tabulky
Tabulky jsou základním stavebním prvkem databáze. Každá tabulka má:
- Unikátní název
- Definovaná pole (sloupce)
- Záznamy (řádky)

### Záznamy
Záznamy jsou jednotlivé řádky v tabulce. Každý záznam obsahuje hodnoty pro definovaná pole tabulky.

### Pole
Pole definují strukturu tabulky. Každé pole má název, typ a volitelná nastavení.

---

## Typy polí

### Text
Jednořádkový textový vstup. Ideální pro krátké texty jako jména, názvy, kódy.

### Víceřádkový text / Markdown
Víceřádkové textové pole s podporou formátování Markdown. Při zobrazení záznamu se Markdown automaticky převede na formátovaný text.

**Podporované formátování:**
- `**tučný text**` → **tučný text**
- `*kurzíva*` → *kurzíva*
- `# Nadpis` → nadpis
- `- položka` → odrážkový seznam
- `1. položka` → číslovaný seznam
- `` `kód` `` → inline kód
- `[odkaz](url)` → hypertextový odkaz

### Číslo
Numerická hodnota. Umožňuje řazení podle číselné hodnoty.

### Datum
Pole pro datum. V editaci se zobrazí kalendářový výběr. Při vytváření nového záznamu se automaticky vyplní dnešní datum.

**Vlastní formát zobrazení:** V nastavení pole můžete definovat vlastní formát data pomocí PHP-style placeholderů:

| Placeholder | Popis | Příklad |
|-------------|-------|---------|
| `d` | Den s nulou | 01-31 |
| `j` | Den bez nuly | 1-31 |
| `D` | Zkrácený den v týdnu | Po, Út |
| `l` | Plný den v týdnu | Pondělí |
| `N` | ISO den v týdnu | 1-7 |
| `m` | Měsíc s nulou | 01-12 |
| `n` | Měsíc bez nuly | 1-12 |
| `M` | Zkrácený měsíc | Led, Úno |
| `F` | Plný měsíc | Ledna, Února |
| `Y` | Čtyřmístný rok | 2024 |
| `y` | Dvoumístný rok | 24 |

**Příklady formátů:**
- `j. n. Y` → 5. 1. 2024
- `d.m.Y` → 05.01.2024
- `D j. F Y` → Pá 5. Ledna 2024
- `l, j. n. Y` → Pátek, 5. 1. 2024

### URL odkaz
Webová adresa. V zobrazení záznamu se automaticky zobrazí jako klikatelný odkaz.

### Ano/Ne
Zaškrtávací pole pro logické hodnoty (pravda/nepravda).

### Výběr ze seznamu
Rozbalovací nabídka s předdefinovanými hodnotami. Hodnoty zadejte oddělené čárkou při vytváření pole.

### Složený
Automaticky generované pole kombinující hodnoty z jiných polí podle šablony. Používejte `{Název pole}` pro vložení hodnot.

**Příklad šablony:** `{Jméno} {Příjmení} ({Rok narození})`

### Nadřazený záznam
Vytváří hierarchický vztah k záznamu v jiné (nebo stejné) tabulce. Umožňuje budovat stromové struktury dat.

### Podřízené záznamy
Zobrazuje seznam záznamů z jiné tabulky, které mají aktuální záznam jako nadřazený. Toto pole je automaticky aktualizováno.

---

## Nastavení polí

### Primární pole
Jedno pole v každé tabulce může být označeno jako primární. Toto pole se používá jako hlavní identifikátor záznamu v odkazech, hierarchických strukturách a vyhledávání.

### Filtr
Pole s povoleným filtrem se zobrazí jako rozbalovací nabídka nad tabulkou (v pokročilém režimu), umožňující rychlé filtrování záznamů podle hodnoty.

### Seskupení
Záznamy lze seskupit podle hodnoty tohoto pole. Seskupené záznamy se zobrazí pod společnými hlavičkami, které lze rozbalovat a sbalovat.

---

## Práce se záznamy

### Vytvoření záznamu
1. Klikněte na tlačítko **➕ Přidat záznam** v záhlaví nebo patičce tabulky
2. Vyplňte hodnoty polí
3. Klikněte na **Uložit**

**Tip:** Zaškrtnutím **Otevřít zobrazení** se po uložení automaticky otevře detail záznamu.

### Rychlé vytvoření
Použijte rozbalovací nabídku **➕ Nový záznam...** v hlavičce aplikace pro rychlé vytvoření záznamu v libovolné tabulce.

### Zobrazení záznamu
Klikněte na tlačítko **👁️** u záznamu pro otevření detailního zobrazení. V detailu uvidíte:
- Všechny hodnoty polí s formátováním
- Související záznamy (nadřazené a podřízené)
- Kolekce a tagy přiřazené k záznamu
- Poznámky
- Historii změn

### Úprava záznamu
Klikněte na tlačítko **✏️** u záznamu nebo v detailu záznamu.

### Duplikování záznamu
V detailu záznamu klikněte na **Duplikovat** pro vytvoření kopie záznamu.

### Zamknutí záznamu
V detailu záznamu můžete záznam zamknout pomocí tlačítka **🔒 Zamknout**. Zamčený záznam nelze upravit ani smazat, dokud není odemčen.

### Smazání záznamu
Klikněte na tlačítko **🗑️** u záznamu. Před smazáním budete požádáni o potvrzení.

---

## Historie změn

JSONDB Editor automaticky zaznamenává historii všech změn provedených na záznamech. Historie je dostupná jak v základním, tak v pokročilém režimu.

### Sledované operace

Historie zaznamenává:
- **Vytvoření** – všechny hodnoty polí při vytvoření záznamu
- **Úprava** – pouze změněná pole (rozdíl oproti předchozímu stavu)
- **Hromadná úprava** – změny provedené hromadnou operací

### Zobrazení historie
1. Otevřete detail záznamu kliknutím na **👁️**
2. Klikněte na tlačítko **📜 Historie**
3. Zobrazí se modální okno s chronologickým seznamem změn (nejnovější nahoře)

### Informace v historii
Každý záznam v historii obsahuje:
- **Datum a čas** změny
- **Typ operace** (Vytvoření / Úprava / Hromadná úprava)
- **Seznam změněných polí** s jejich hodnotami

### Správa historie (pokročilý režim)
V pokročilém režimu můžete historii upravovat:
- **🗑️ Smazat záznam** – Smaže celý záznam z historie (tlačítko v záhlaví záznamu)
- **✕ Smazat pole** – Smaže jednotlivé pole ze záznamu historie (tlačítko u pole)

Pokud smažete všechna pole ze záznamu historie, celý záznam se automaticky odstraní.

**Poznámka:** Mazání historie je nevratná operace. Používejte s rozmyslem.

---

## Hierarchická struktura

JSONDB Editor podporuje hierarchické vztahy mezi záznamy pomocí polí typu **Nadřazený záznam** a **Podřízené záznamy**.

### Zobrazení struktury
V detailu záznamu klikněte na **🌳 Zobrazit strukturu** pro otevření stromového zobrazení všech potomků záznamu.

**Textový pohled** zobrazuje:
- Cestu předků (breadcrumb navigace)
- Stromovou strukturu potomků s možností rozbalení/sbalení
- Počet potomků u každé větve
- Tlačítka pro zobrazení poznámek u záznamů

**Grafický pohled** zobrazuje:
- Vizuální diagram vztahů
- Kliknutím na uzel otevřete detail záznamu

---

## Kolekce

Kolekce umožňují organizovat záznamy z různých tabulek do logických skupin.

### Vytvoření kolekce
1. Přejděte do **Zatřídění → Kolekce**
2. Klikněte na **➕ Přidat kolekci**
3. Zadejte název, volitelně popis a barvu
4. Klikněte na **Uložit**

### Přidání záznamu do kolekce
- V detailu záznamu klikněte na **Přidat do kolekce**
- Při hromadném výběru záznamů použijte **📁 Do kolekce**

### Zobrazení obsahu kolekce
V sekci Kolekce klikněte na kolekci pro zobrazení všech záznamů v ní obsažených.

---

## Tagy

Tagy umožňují přiřazovat štítky k záznamům pro snadnější kategorizaci a filtrování.

### Vytvoření tagu
1. Přejděte do **Zatřídění → Tagy**
2. Klikněte na **➕ Přidat tag**
3. Zadejte název a barvu
4. Klikněte na **Uložit**

### Přiřazení tagu k záznamu
- V detailu záznamu klikněte na **Přiřadit tag**
- Při hromadném výběru záznamů použijte **🏷️ Přidat tag**

---

## Poznámky

Ke každému záznamu můžete přidávat poznámky – krátké textové zápisky s možností označení jako vyřízené/nevyřízené.

### Přidání poznámky
1. Otevřete detail záznamu
2. V sekci **📝 Poznámky** napište text poznámky
3. Klikněte na **Přidat**

### Správa poznámek
- **✓/○** – Přepnutí stavu vyřízeno/nevyřízeno
- **✏️** – Úprava textu poznámky
- **🗑️** – Smazání poznámky

### Globální přehled poznámek
V sekci **Zatřídění → Poznámky** najdete seznam všech poznámek v databázi s možností filtrování podle stavu (všechny/nevyřízené/vyřízené).

Na záložce Zatřídění se zobrazuje červený odznak s počtem nevyřízených poznámek.

---

## Pohledy (Uložené filtry)

Pohledy umožňují uložit aktuální nastavení filtrů a rychle se k němu vracet.

### Uložení pohledu
1. Nastavte požadované filtry v tabulce
2. Klikněte na **➕ Uložit pohled** (v pokročilém režimu)
3. Zadejte název pohledu

### Použití pohledu
Klikněte na záložku s názvem pohledu nad tabulkou. Záložka **Všechny záznamy** zobrazí nefiltrovaná data.

### Správa pohledů (pokročilý režim)
- **💾 Aktualizovat** – Uloží aktuální filtry do vybraného pohledu
- **✏️ Přejmenovat** – Změní název pohledu
- **🗑️ Smazat** – Odstraní pohled

---

## Vyhledávání a filtrování

### Globální vyhledávání
Použijte vyhledávací pole **🔍 Hledat...** v hlavičce aplikace pro prohledání všech tabulek. Výsledky se zobrazí v modálním okně s možností otevření záznamu.

### Vyhledávání v tabulce
Každá tabulka má vlastní vyhledávací pole, které prohledává všechna textová pole záznamů.

### Filtry (pokročilý režim)
- **Filtry polí** – Rozbalovací nabídky pro pole s povoleným filtrem
- **Filtr kolekce** – Zobrazí pouze záznamy v určité kolekci
- **Filtr tagu** – Zobrazí pouze záznamy s určitým tagem

---

## Hromadné operace

### Výběr záznamů
- Zaškrtněte checkbox u jednotlivých záznamů
- Použijte **Vybrat vše** pro výběr všech (filtrovaných) záznamů
- Použijte **Zrušit výběr** pro zrušení výběru

### Dostupné hromadné operace
- **✏️ Upravit pole** – Změna hodnoty jednoho nebo více polí u všech vybraných záznamů
- **📁 Do kolekce** – Přidání všech vybraných záznamů do kolekce
- **🏷️ Přidat tag** – Přiřazení tagu všem vybraným záznamům
- **🗑️ Smazat** – Smazání všech vybraných záznamů (s potvrzením)

---

## Import a export

### Export tabulky (pokročilý režim)
1. Klikněte na **📤 Export** u tabulky
2. Vyberte formát (CSV nebo JSON)
3. U CSV můžete zvolit oddělovač a kódování
4. Klikněte na **Exportovat**

### Import dat (pokročilý režim)
1. Klikněte na **📥 Import** u tabulky
2. Vyberte formát (CSV nebo JSON)
3. Vložte data do textového pole
4. Klikněte na **Zobrazit náhled mapování**
5. Zkontrolujte mapování sloupců na pole
6. Klikněte na **Importovat**

### Export/Import celé databáze
- **💾 Uložit** – Stáhne celou databázi jako `.jsondb` soubor
- **📂 Načíst** – Načte databázi ze souboru
- **📋 Kopírovat JSON** – Zkopíruje databázi jako JSON do schránky
- **📥 Vložit JSON** – Načte databázi z JSON textu

---

## Generátor textu

Generátor textu umožňuje vytvářet textové výstupy ze záznamů podle šablony.

### Použití
1. Přejděte do **Správa → Nástroje**
2. Vyberte tabulku
3. Vložte do šablony zástupné symboly `{Název pole}`
4. Vyberte zda generovat ze všech nebo filtrovaných záznamů
5. Klikněte na **⚡ Generovat**

**Příklad šablony:**
```
Jméno: {Jméno}
Email: {Email}
---
```

---

## Zjednodušený a pokročilý režim

JSONDB Editor nabízí dva režimy zobrazení:

### Zjednodušený režim (výchozí)
Určený pro základní uživatele. Skrývá pokročilé funkce:
- Tlačítka pro správu databáze (Nová, Načíst, Kopírovat JSON, Vložit JSON)
- Výběr jazyka
- Filtry podle polí (zůstává pouze vyhledávání)
- Tlačítka pro správu pohledů
- Kartu Správa
- Mazání záznamů z historie

### Pokročilý režim
Aktivujte zaškrtnutím **Všechny funkce** v hlavičce. Zpřístupní všechny funkce aplikace.

### Viditelnost tabulek
V pokročilém režimu můžete v **Správa → Tabulky** nastavit, které tabulky budou viditelné v zjednodušeném režimu.

---

## Klávesové zkratky

Klávesové zkratky používají modifikátor prohlížeče:
- **Windows/Linux:** Alt nebo Alt+Shift
- **macOS:** Ctrl+Option

### Zkratky s modifikátorem
| Zkratka | Akce |
|---------|------|
| Mod+S | Uložit databázi |
| Mod+X | Přepnout zjednodušený/pokročilý režim |
| Mod+N | Nový záznam v aktuální tabulce |
| Mod+Q | Rychlé vytvoření záznamu |
| Mod+U | Uložit záznam (v modálu) |
| Mod+Z | Přejít do Zatřídění |
| Mod+C | Přejít do Kolekcí |
| Mod+T | Přejít do Tagů |
| Mod+M | Přejít do Poznámek |

### Přímé zkratky (bez modifikátoru)
| Zkratka | Akce |
|---------|------|
| ↑ ↓ | Navigace v tabulce záznamů |
| E | Upravit vybraný záznam |
| V | Zobrazit vybraný záznam |

---

## DokuWiki integrace

JSONDB Editor lze integrovat do systému DokuWiki jako plugin.

### Instalace
1. Stáhněte složku `jsondbeditor` z GitHubu
2. Nahrajte ji do `lib/plugins/` ve vaší DokuWiki instalaci
3. Aktivujte plugin v administraci DokuWiki

### Použití
V DokuWiki stránce použijte syntaxi:
```
<jsondb>
... base64 encoded database ...
</jsondb>
```

Editor se otevře v novém okně a změny se po uložení automaticky promítnou zpět do wiki stránky.

---

## Přístupnost

JSONDB Editor je navržen s ohledem na přístupnost:
- Plná podpora klávesové navigace
- ARIA atributy pro odečítače obrazovky
- Sémantické HTML5 elementy
- Dostatečný barevný kontrast
- Responzivní design pro různé velikosti obrazovky

---

## Ochrana neuložených změn

JSONDB Editor chrání vaši práci před ztrátou:

### Upozornění na neuložené změny
Pokud provedete jakékoliv změny v databázi (přidání/úprava/smazání záznamů, úprava struktury apod.), v horní části okna se zobrazí žlutý banner s upozorněním: **"⚠️ Změnili jste obsah databáze. Nezapomeňte ji uložit."**

### Varování při zavření okna
Pokud se pokusíte zavřít okno nebo kartu prohlížeče s neuloženými změnami, prohlížeč zobrazí potvrzovací dialog, zda opravdu chcete stránku opustit.

### Kdy zmizí upozornění
Upozornění automaticky zmizí po:
- Uložení databáze do souboru (tlačítko **💾 Uložit**)
- Uložení na wiki (tlačítko **📤 Uložit na wiki** v DokuWiki verzi)

---

## Technické informace

### Formát souboru
Databáze se ukládá ve formátu JSON s příponou `.jsondb`. Soubor obsahuje:
- Metadata databáze (název, nastavení)
- Definice tabulek a polí
- Všechny záznamy
- Kolekce, tagy a poznámky
- Uložené pohledy
- Historie změn záznamů

### Ukládání dat
- **Standalone verze:** Data se automaticky ukládají do sessionStorage prohlížeče (izolovaně pro každou kartu)
- **DokuWiki verze:** Data se ukládají na wiki stránku

### Kompatibilita
Aplikace funguje ve všech moderních prohlížečích:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

---

## Licence

JSONDB Editor je open source software. Zdrojový kód je dostupný na [GitHubu](https://github.com/michalradacz/database-editor).

---

## Podpora

Máte-li otázky, návrhy nebo jste našli chybu, vytvořte prosím issue na [GitHubu](https://github.com/michalradacz/database-editor/issues).
