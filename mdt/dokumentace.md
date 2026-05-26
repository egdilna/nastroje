# Šablonář MDT — Interaktivní vyplňování markdown šablon

**Online verze nástroje:** [https://egdilna.github.io/nastroje/mdt](https://egdilna.github.io/nastroje/mdt)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#mdt](https://egdilna.github.io/nastroje/#mdt)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Šablonář MDT** je přístupná webová aplikace pro tvorbu a vyplňování interaktivních formulářů a šablon dokumentů. Šablona je obyčejný markdown text obohacený o speciální značky (placeholdery), který nástroj rozpozná a v uživatelském režimu nabídne odpovídající formulářová pole. Po vyplnění lze výsledek uložit jako čistý markdown, jako Word dokument (.docx), nebo zkopírovat do schránky.

Vše běží v jednom HTML souboru — žádný server, žádná instalace, data se zpracovávají výhradně v prohlížeči.

### Klíčové funkce

- **Tři režimy zobrazení** — Náhled vzoru (struktura šablony s barevně rozlišenými placeholdery), Vyplnění (interaktivní formulář), Náhled výsledku (finální dokument)
- **Sedm typů placeholderů** — krátký text, blok textu, odrážky, číslovaný seznam, výběr z možností, tabulka a SPOT (místo pro ruční doplnění)
- **Pokyny pro vyplňujícího** — komentáře, které se zobrazí jen v editoru a do výsledku se nepřenášejí
- **Synchronizovaná pole** — pokud se stejný placeholder vyskytuje vícekrát, zadává se hodnota jen jednou a automaticky se promítne do všech výskytů
- **Opakované sekce** — bloky šablony, které lze v režimu vyplnění opakovat libovolně mnohokrát (např. položky, přílohy, podkapitoly)
- **Volitelné tabulky** — tabulka se ve výsledku objeví jen pokud ji uživatel skutečně vytvoří
- **Editace inline tabulek** — i klasická markdown tabulka přímo v šabloně se dá pohodlně upravovat v editoru
- **Export do .md, .docx, schránky** — vyplněný dokument lze uložit nebo zkopírovat v různých formátech
- **Rozpracovaná verze (.mdd)** — uložení šablony i s rozpracovanými hodnotami pro pozdější dokončení
- **Editor zdroje** — přímé úpravy zdrojového textu šablony bez nutnosti otevírat externí editor
- **Načtení z URL** — šablonu lze otevřít přes parametr `?template=...`, hodí se pro sdílení odkazem

### Přístupnost

Nástroj klade důraz na přístupnost — semantické HTML, ARIA atributy, plnou ovladatelnost klávesnicí, popisné štítky pro čtečky obrazovky a klávesové zkratky pro nejčastější akce.

---

## Formát MDT

Soubor `.mdt` je obyčejný markdown text doplněný o speciální značky. Vše ostatní (nadpisy, odstavce, odrážky, tabulky, odkazy, formátování) funguje jako v běžném markdownu.

### Placeholdery: `[[[Typ: obsah]]]`

Placeholder je trojnásobné hranaté závorky obklopující název typu a obsah oddělené dvojtečkou. Název typu je nerozlišuje malá a velká písmena ani diakritiku (`Text`, `text`, `TEXT`, `Odrážky`, `odrazky` jsou ekvivalentní).

| Typ | Význam | Příklad |
|-----|--------|---------|
| `Text` | Jednořádkový textový vstup, lze vložit doprostřed věty | `Jméno: [[[Text: vaše jméno]]]` |
| `Textarea` | Víceřádkový blok textu, podporuje vlastní markdown | `[[[Textarea: popis situace]]]` |
| `Odrážky` | Seznam s odrážkami (•) — uživatel přidává jednotlivé položky | `[[[Odrážky: výhody]]]` |
| `Číslované` | Číslovaný seznam (1., 2., 3., …) | `[[[Číslované: kroky postupu]]]` |
| `Volba` | Výběr z předem definovaných možností oddělených čárkou | `[[[Volba: ano, ne, nevím]]]` |
| `Tabulka` | Volitelná tabulka se zadanými sloupci (oddělenými čárkou) | `[[[Tabulka: Jméno, Kontakt, Poznámka]]]` |
| `Spot` | Místo pro ruční doplnění mimo nástroj (obrázek, graf…) — vždy se zobrazí jako zvýrazněný blok | `[[[Spot: sem vložte obrázek]]]` |

Text uvnitř obsahu placeholderu slouží jako popisek pole a v náhledu jako placeholder vstupu.

### Pokyny: `{{{text pokynu}}}`

Pokyn je text uzavřený do tří složených závorek. Slouží jako poznámka pro vyplňujícího — vysvětluje, co se očekává, doporučuje styl, varuje před chybami atd.

```
{{{Sem napište podrobné pokyny pro vyplňujícího. Ve výsledku se nezobrazí.}}}
```

Pokyny se v režimu náhledu a vyplnění zobrazí jako zvýrazněný informační blok (s ikonou 💡), ve výsledném dokumentu (.md, .docx) se vůbec neobjeví. Pokud je pokyn na samostatném řádku, odstraní se i celý řádek včetně koncového odřádkování.

### Synchronizovaná pole

Pokud se v šabloně vyskytne víc placeholderů typu `Text`, `Textarea`, `Odrážky` nebo `Číslované` se stejným obsahem, považuje je nástroj za jedno pole — uživatel vyplní hodnotu jen u prvního výskytu a všechny ostatní se aktualizují automaticky. Porovnání ignoruje velikost písmen, diakritiku a zdvojené mezery.

Příklad — text se zadá jednou a objeví se na obou místech:

```
Jméno: [[[Text: jméno klienta]]]
…
S pozdravem zaslal: [[[Text: jméno klienta]]]
```

### Opakované sekce: `[[[Opakování: Název]]] … [[[/Opakování]]]`

Párové značky definují blok, který může uživatel v režimu vyplnění libovolněkrát zopakovat (přidat instanci) nebo úplně vynechat. Uvnitř může být cokoli — markdown text, placeholdery, pokyny, tabulky.

```
[[[Opakování: Příloha]]]
### [[[Text: Název přílohy]]]
[[[Textarea: Popis přílohy]]]
[[[/Opakování]]]
```

Každá instance má vlastní jmenný prostor hodnot, takže synchronizovaná pole se promítají pouze v rámci té samé instance. Sekce neumí vnořovat — značky se párují plochou metodou FIFO.

Pokud uživatel nepřidá žádnou instanci (sekci nechá prázdnou), ve výsledku se celá sekce přeskočí.

### Inline tabulky (markdown tabulky v šabloně)

Klasická markdown tabulka napsaná přímo v šabloně se v režimu vyplnění promění v interaktivní editor (stejný jako u placeholderu `[[[Tabulka]]]`). Sloupce a hlavička jsou pevné, řádky lze přidávat, mazat, posouvat a upravovat.

```
| Jméno | Kontakt | Poznámky |
|-------|---------|----------|
| | | |
```

Rozdíl oproti placeholderu `[[[Tabulka]]]` je v tom, že inline tabulka je vždy povinná (vždy se vykreslí), kdežto `[[[Tabulka]]]` je volitelná a uživatel musí kliknout na „➕ Vytvořit tabulku" pro její aktivaci.

### Spot — místo k ručnímu doplnění

`[[[Spot: popis]]]` označuje místo, kam je nutné něco doplnit ručně mimo nástroj (typicky obrázek, schéma, sken, graf). Spot se zobrazí ve všech režimech jako výrazný žlutý blok s ikonou 📍, do `.docx` se exportuje jako orámovaný odstavec s podbarvením.

---

## Navigace a rozložení

### Horní nástrojový pruh

Horní pruh obsahuje dvě sekce:

**Načíst nebo změnit šablonu** (sbalitelná část):

| Tlačítko | Popis |
|----------|-------|
| 📂 Soubor | Otevření lokálního souboru (`.mdt`, `.mdd`, `.md`, `.txt`, `.json`) |
| 🌐 URL | Načtení šablony z internetové adresy |
| Načíst z URL | Spustí stažení šablony ze zadané adresy |
| 📄 Nová | Vytvoří novou prázdnou šablonu a otevře editor zdroje |
| ✏ Zdroj | Zobrazí/upraví zdrojový text aktuální šablony |
| 💾 Uložit .mdt | Uloží aktuální šablonu jako `.mdt` (bez vyplněných hodnot) |

**Pracovní lišta** (zobrazí se po načtení šablony):

| Tlačítko | Popis |
|----------|-------|
| 💾 Rozpracované (.mdd) | Uloží šablonu i s aktuálními rozpracovanými hodnotami |
| 💾 Vyplněný .md | Stáhne vyplněný výsledek jako markdown soubor |
| 📋 Kopírovat MD | Zkopíruje vyplněný markdown do schránky |
| 💾 Vyplněný .docx | Stáhne vyplněný výsledek jako Word dokument |
| 🗑 Vyčistit hodnoty | Smaže všechny vyplněné hodnoty (s potvrzením) |

### Postranní panel — Režim zobrazení

Po načtení šablony se vlevo objeví přepínač režimu:

- **Náhled vzoru** — ukazuje šablonu se všemi placeholdery barevně rozlišenými podle typu. Slouží pro kontrolu struktury šablony před vyplněním.
- **Vyplnění** — interaktivní formulář, kde se zadávají hodnoty. Každý typ placeholderu má svůj specializovaný editor.
- **Náhled výsledku** — finální dokument tak, jak se uloží/exportuje. Nevyplněná povinná pole jsou označena `[NEVYPLNĚNO: …]`.

### Stavový řádek

Pod horním pruhem je informační/stavový řádek (žlutý — informace, zelený — úspěch, červený — chyba). V průběhu vyplňování zobrazuje počet vyplněných polí ve formátu „Vyplněno: X / Y polí".

---

## Režim Náhled vzoru

V tomto režimu se šablona vykreslí jako klasický markdown, ale placeholdery jsou nahrazeny barevně rozlišenými značkami typu `[[[Text: jméno]]]`, `[[[Volba: ano, ne]]]` atd. Jednotlivé typy mají vlastní barevné pozadí pro snadnou orientaci.

Pokyny `{{{…}}}` se zobrazují jako žluté boxy s ikonou 💡. Opakované sekce jsou orámované jako pojmenované fieldsety. Spot bloky jsou výrazné žluté boxy s ikonou 📍.

Tento režim slouží především autorovi šablony pro vizuální kontrolu — vyplňování zde není možné.

---

## Režim Vyplnění

Hlavní pracovní režim. Šablona se vykreslí podobně jako v náhledu, ale namísto značek placeholderů jsou skutečná formulářová pole.

### Editory podle typu

**Text** — jednořádkové vstupní pole vložené přímo do toku textu (může být uprostřed věty).

**Textarea** — víceřádkové pole se štítkem nad ním. Obsah se vkládá do výsledku doslovně, lze tedy psát i vlastní markdown.

**Volba** — rozevírací seznam (`<select>`) s předem definovanými možnostmi. První položka „— vyberte —" znamená prázdnou hodnotu.

**Odrážky / Číslované** — editor položek se seznamem. Tlačítka u každé položky:

| Tlačítko | Akce |
|----------|------|
| ✏ | Začít úpravu položky |
| ▲ | Posunout položku nahoru |
| ▼ | Posunout položku dolů |
| ➕ pod | Vložit novou položku pod aktuální |
| 🗑 | Smazat položku |
| ✓ | Uložit úpravu (Enter) |
| ✗ | Zrušit úpravu (Escape) |

**Tabulka** — nejprve se zobrazí aktivační tlačítko „➕ Vytvořit tabulku" (tabulka je volitelná). Po aktivaci se objeví editor s pevnými sloupci a možností přidávat/mazat/posouvat řádky. Tlačítko „🗑 Odebrat tabulku celou" tabulku zase deaktivuje a ve výsledku se vůbec neobjeví. Editace jednotlivých buněk funguje stejně jako u položek seznamu (✏ pro úpravu, Enter pro potvrzení, Escape pro zrušení).

**Spot** — nevyplňuje se, zobrazí se jako žlutý box s popisem.

**Synchronizovaná hodnota (zrcadlo)** — druhý a každý další výskyt stejného pole se ukáže jako šedý textový náhled aktuálně zadané hodnoty (případně „(nevyplněno: …)").

### Opakované sekce

Každá opakovaná sekce je orámovaný blok s legendou „Opakovaná sekce: Název". Uvnitř jsou jednotlivé instance, každá v dalším orámování s legendou „Název #1", „Název #2" atd.

Akce nad instancí:

| Tlačítko | Akce |
|----------|------|
| ▲ | Posunout instanci nahoru |
| ▼ | Posunout instanci dolů |
| 🗑 | Smazat instanci |

Pod sekcí je tlačítko „➕ Přidat instanci „Název"" pro přidání další. Pokud uživatel smaže všechny instance, sekce se ve výsledku úplně přeskočí.

### Inline tabulky

Klasická markdown tabulka v šabloně se zobrazí v rámečku „Editovatelná tabulka: sloupec1, sloupec2, …" se stejným editorem jako placeholder `Tabulka`. Sloupce zde nelze odebrat — odpovídají pevné hlavičce ze zdroje šablony.

---

## Režim Náhled výsledku

Vykresluje finální dokument přesně tak, jak bude vypadat po uložení. Placeholdery jsou nahrazeny zadanými hodnotami, pokyny jsou skryté, prázdné tabulky se přeskakují, opakované sekce jsou expandované.

Nevyplněná pole se zobrazují jako červené značky `[NEVYPLNĚNO: Typ — popis]`, aby bylo zjevné, co chybí. Spot bloky zůstávají jako žluté označení k ručnímu doplnění.

---

## Editor zdroje

Tlačítko **✏ Zdroj** v horní liště otevře přímý textový editor zdrojového kódu šablony. Lze v něm libovolně upravovat markdown text i značky a po stisknutí **💾 Uložit změny do šablony** se šablona znovu rozparsuje a vykreslí se v aktuálním režimu. Stávající vyplněné hodnoty se zachovají (kde to dává smysl).

Editor zdroje se automaticky otevírá také při vytvoření nové prázdné šablony tlačítkem **📄 Nová**.

V případě chyby při načítání šablony nástroj nabídne tlačítko „✏ Otevřít zdroj šablony k opravě", aby šlo problém ručně vyřešit přímo v aplikaci.

---

## Načítání a ukládání

### Načítání

| Zdroj | Postup |
|-------|--------|
| Lokální soubor | Tlačítko 📂 Soubor → vyber `.mdt`, `.mdd`, `.md`, `.txt` nebo `.json` |
| URL | Pole 🌐 URL → vlož adresu → Načíst z URL (nebo Enter) |
| URL parametr | Otevři nástroj s `?template=https://…/soubor.mdt` |
| Nová prázdná | 📄 Nová — otevře editor zdroje |

Nástroj sám detekuje, zda je soubor čistá šablona (`.mdt`) nebo rozpracovaná verze (`.mdd`). Šablona je obyčejný markdown text, rozpracovaná verze je JSON s polem `format: "sablonar-draft"`.

Pozor — načítání z URL může selhat kvůli CORS, pokud server šablony nepovoluje sdílení napříč doménami.

### Ukládání

| Formát | Tlačítko | Co obsahuje |
|--------|----------|-------------|
| `.mdt` | 💾 Uložit .mdt | Pouze čistou šablonu (bez vyplněných hodnot) |
| `.mdd` | 💾 Rozpracované (.mdd) | JSON se šablonou + všemi vyplněnými hodnotami + režimem, časem uložení |
| `.md` | 💾 Vyplněný .md | Finální vyplněný markdown (pokyny odstraněné) |
| `.docx` | 💾 Vyplněný .docx | Word dokument s formátováním (nadpisy, seznamy, tabulky, Spot bloky) |
| Schránka | 📋 Kopírovat MD | Vyplněný markdown rovnou do schránky systému |

### Vyčištění hodnot

Tlačítko **🗑 Vyčistit hodnoty** smaže všechny vyplněné hodnoty (s potvrzením). Šablona zůstává načtená, inline tabulky se vrátí k původnímu obsahu ze zdroje, opakované sekce dostanou jednu prázdnou instanci.

---

## Klávesové zkratky

Klávesové zkratky využívají atribut `accesskey` — v prohlížeči se aktivují společně s prefixem (typicky **Alt** ve Windows/Linuxu, **Control + Alt** v macOS Safari, **Control + Option** v jiných macOS prohlížečích).

| Zkratka | Akce |
|---------|------|
| Alt + M | Přeskočit na obsah dokumentu |
| Alt + O | Otevřít soubor (výběr lokálního souboru) |
| Alt + U | Skok do pole pro URL šablony |
| Alt + Z | Otevřít editor zdroje šablony |
| Alt + S | Uložit rozpracovanou verzi (.mdd) |
| Alt + C | Kopírovat vyplněný markdown do schránky |
| Alt + X | Uložit vyplněný Word dokument (.docx) |
| Alt + N | Přepnout na režim Náhled vzoru |
| Alt + V | Přepnout na režim Vyplnění |
| Alt + D | Přepnout na režim Náhled výsledku |
| Enter | Potvrdit úpravu položky / odeslat URL |
| Escape | Zrušit úpravu položky |

---

## Export do Word (.docx)

Vyplněný dokument lze uložit jako `.docx` soubor, který otevře Microsoft Word, LibreOffice Writer i další textové editory. Export zachovává:

- Nadpisy úrovní 1–6 (jako styly Heading 1 až Heading 6)
- Odstavce, tučný text (`**`), kurzivu (`*`), inline kód (`` ` ``)
- Odrážkové i číslované seznamy
- Tabulky s podbarvenou hlavičkou
- Vodorovnou čáru (`---`)
- Kódové bloky (`` ``` ``) v písmu Consolas
- Citace (`>`) odsazené se svislou čarou
- Spot bloky jako orámované odstavce s podbarvením a tučným popiskem

Knihovna `docx` (verze 8.5.0) se načítá z CDN unpkg.com — pokud není internet, export do `.docx` nebude fungovat. Ostatní funkce (`.md`, `.mdt`, `.mdd`, kopírování do schránky) jsou plně offline.

---

## Tipy pro autory šablon

- **Přehlednost** — pojmenovávejte placeholdery srozumitelně podle toho, co se má zadat (např. `[[[Text: jméno klienta]]]` místo `[[[Text: x]]]`). Tento text se zobrazí jako popisek pole.
- **Pokyny šetří dotazy** — komentáře `{{{…}}}` jsou ideální místo na zápis instrukcí, kontextu, požadavků na styl. Vyplňující je vidí, ale do výsledku se nepřenášejí.
- **Synchronizace stejnojmenných polí** — využijte fakt, že stejný text v `[[[Text: …]]]` se vyplňuje jen jednou (např. jméno žadatele na začátku i na konci dokumentu).
- **Volitelné části** — pro nepovinné bloky používejte `[[[Tabulka: …]]]` (volitelná, musí ji uživatel aktivovat) nebo `[[[Opakování: …]]]` (lze přidat 0 a více instancí).
- **Spot pro obrázky** — místa, kam patří grafika nebo data z jiných zdrojů, označte `[[[Spot: …]]]`, aby vyplňující věděl, co tam doplnit ručně po vygenerování dokumentu.
- **Vzor** — nástroj má vzorovou šablonu `vzor.mdt` ukazující všechny prvky formátu MDT.

---

## Technické informace

### Formát souboru `.mdd` (rozpracovaná verze)

`.mdd` je JSON s následující strukturou:

```json
{
  "format": "sablonar-draft",
  "version": 1,
  "templateName": "název_souboru",
  "savedAt": "ISO datum",
  "mode": "fill",
  "templateText": "… zdrojový text šablony …",
  "values": { … vyplněné hodnoty … }
}
```

Hodnoty se ukládají pod klíči:

- `Typ::normalizovaný_obsah` — pro deduplikovaná pole (Text, Textarea, Odrážky, Číslované)
- `__idx_N` — pro pole bez deduplikace (Volba, Tabulka)
- `__inline_table_N` — pro inline markdown tabulky
- `__repeat_N` — pro opakované sekce (pole instancí, každá instance má vlastní jmenný prostor)

### Detekce typu souboru

Nástroj rozliší `.mdt` a `.mdd` automaticky — pokud text začíná `{` a obsahuje `format: "sablonar-draft"`, zachází s ním jako s rozpracovanou verzí. Jinak ho považuje za šablonu (čistý markdown).

### Migrace starších `.mdd` souborů

Při načtení starší rozpracované verze se automaticky převede klíčování hodnot na aktuální normalizovaný tvar (porovnání bez rozlišení velikosti písmen a diakritiky).

### Závislosti

Nástroj nepotřebuje žádný backend. Pro export do `.docx` se z CDN `unpkg.com` načítá knihovna `docx@8.5.0`. Všechny ostatní funkce jsou implementovány v jednom HTML souboru pomocí čistého JavaScriptu bez externích závislostí.

### Ukládání dat

Nástroj nepoužívá `localStorage` — všechna data jsou pouze v paměti aktuální stránky. Pro zachování stavu mezi sezeními použijte uložení do `.mdd` souboru.

### Kompatibilita

Nástroj funguje v aktuálních verzích Chrome, Firefox, Safari, Edge a dalších prohlížečích založených na moderních webových standardech. Kopírování do schránky používá Clipboard API; pokud není dostupné, použije se starší metoda přes `document.execCommand('copy')`.
