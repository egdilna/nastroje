# Launcher — Rámeček pro rychlé nástroje

**Online verze nástroje:** [https://egdilna.github.io/nastroje/launcher](https://egdilna.github.io/nastroje/launcher)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#launcher](https://egdilna.github.io/nastroje/#launcher)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Launcher** (v záhlaví se hlásí jako **Rychlé nástroje**, interně **Rámeček**) je jednoduchý přepínač webových nástrojů. V jednom okně prohlížeče otevře více externích stránek do vlastních záložek a mezi nimi přepíná. Vše běží v jednom HTML souboru — žádný server, žádná instalace, seznam nástrojů je zapsaný přímo ve zdrojovém kódu stránky.

### Klíčové funkce

- **Záložky s vloženými nástroji** — každá záložka otevírá cílovou stránku v samostatném rámu (`<iframe>`) a její obsah zůstává živý i po přepnutí na jinou záložku
- **Nabídka záložek** — tlačítko 📑 vpravo nahoře zobrazuje seznam všech dostupných nástrojů s vyznačením, které jsou otevřené a která je zobrazená
- **Znovunačtení aktivní záložky** — tlačítko 🔄 nebo klávesová zkratka (Ctrl/Cmd+R, F5) načte znovu jen aktuální rám, ne celou aplikaci
- **Zavření záložky** — jednotlivé záložky lze zavřít z nabídky, po zavření se přepne na sousední otevřenou záložku
- **Zapamatování stavu** — poslední zobrazená záložka se uloží v `localStorage` a po dalším otevření aplikace se znovu otevře stejná
- **Ukazatel doby načtení** — pod záhlavím se zobrazuje, jak dávno byla aktivní stránka načtena („Načteno právě teď", „Načteno před 12 minutami" apod.)
- **Detekce nefunkčního vložení** — pokud se cílová stránka do rámu do 12 sekund nenačte (typicky kvůli `X-Frame-Options` nebo `CSP frame-ancestors`), zobrazí se srozumitelné hlášení
- **Editor záložek** — po přidání `?edit` k adrese se zpřístupní editor, ve kterém lze upravit název aplikace i seznam záložek a stáhnout nový `index.html` k nahrání na server

### Zabudované záložky ve výchozí distribuci

Výchozí konfigurace obsahuje tyto rychlé nástroje:

| Název | Popis |
|-------|-------|
| PIM | Osobní informační manažer s předvyplněným souborem `michalrada.pim` |
| MRonenote | Poznámkový nástroj MRonenote |
| Outliner | Strukturovaný osnovník |
| PlantUML | Editor UML diagramů |
| MRonfluence | Wiki nástroj MRonfluence |

### Přístupnost

Nástroj používá sémantické role ARIA (`tablist`, `tab`, `tabpanel`), ovládání klávesnicí (šipky, Home/End pro pohyb mezi taby, Escape pro zavření nabídky) a živou oblast (`aria-live`) pro hlášení stavu. Podporuje `prefers-reduced-motion` a bezpečné oblasti (`safe-area-inset`) na mobilech s výřezem.

---

## Rozložení obrazovky

Obrazovka má tři vodorovné vrstvy:

### Záhlaví

Tmavý panel v horní části obrazovky obsahuje:

- **Název aplikace** vlevo — přebírá se z proměnné `NAZEV` ve zdrojovém kódu (výchozí „Rychlé nástroje")
- **Tlačítko 📑 Záložky** vpravo — otevře nabídku všech záložek a operace nad nimi
- **Tlačítko 🔄 Znovu načíst** — načte znovu právě zobrazenou záložku
- **Lišta otevřených záložek** — vodorovný pruh s taby otevřených nástrojů; aktivní tab je modrý
- **Ukazatel doby načtení** — malá šedá řádka pod záložkami

### Hlavní plocha

Bílá pracovní plocha, ve které se zobrazuje jeden `<iframe>` s aktivním nástrojem. Ostatní otevřené záložky zůstávají skryté, ale nadále živé (nezavřené).

### Případné hlášení

Pod záhlavím se v případě problému objeví červený pruh se srozumitelnou zprávou (typicky „Stránka se v rámu nenačetla" nebo „Adresa vede na nešifrované http").

---

## Práce se záložkami

### Otevření záložky

1. Klikněte na tlačítko **📑** vpravo nahoře
2. V nabídce se zobrazí seznam všech dostupných záložek
3. Kliknutím na název záložka otevře a přepne se do ní

Pokud je záložka již otevřená, u jejího názvu je popisek „otevřená" nebo „otevřená, zobrazená". Kliknutím na již otevřenou záložku se do ní jen přepne, nenačte se znovu.

### Přepínání mezi otevřenými záložkami

- Kliknutím na tab v liště pod záhlavím
- Kliknutím na název záložky v nabídce 📑
- Klávesnicí, pokud je fokus na taboch: **←** / **→** (předchozí/další), **Home** (první), **End** (poslední)

### Zavření otevřené záložky

1. Otevřete nabídku 📑
2. V dolní části nabídky klikněte na **Zavřít záložku {název}**
3. Zobrazí se sousední otevřená záložka; pokud žádná není, objeví se výzva k otevření záložky

Tlačítko je deaktivované, pokud žádná záložka není otevřená.

### Znovunačtení záložky

Aktivní záložku lze načíst znovu třemi způsoby:

- Tlačítkem **🔄** v záhlaví
- Klávesovou zkratkou **Ctrl+R** / **Cmd+R** (pokud je fokus mimo rám — některé prohlížeče, typicky Safari, si Cmd+R nechávají pro sebe a znovunačtou celou aplikaci)
- Klávesou **F5**

Znovunačtení nastaví `src` rámu na `about:blank` a pak zpět na původní adresu, čímž vyvolá čerstvé načtení nezávisle na cache.

### Ukazatel doby načtení

Řádek pod záložkami ukazuje, kdy byla aktivní stránka naposledy načtena:

| Doba od načtení | Zobrazení |
|-----------------|-----------|
| Do 1 minuty | Načteno právě teď |
| Do 80 minut | Načteno před {N} minutami |
| Do 30 hodin | Načteno před {N} hodinami |
| Déle | Načteno před {N} dny |

Ukazatel se aktualizuje každou minutu a po návratu do okna prohlížeče. Přejetím myší se zobrazí přesné datum a čas načtení.

---

## Hlášení o problémech

### Časový limit načtení

Pokud se cílová stránka do 12 sekund nenačte (událost `load` rámu se nespustí), zobrazí se v červeném pruhu jedna ze dvou hlášek:

- **„Adresa vede na nešifrované http"** — stránka `launcher` je otevřená přes `https`, ale záložka směřuje na `http://…`; prohlížeč takové vložení blokuje. Změňte URL v editoru na `https://…`.
- **„Stránka se v rámu nenačetla"** — server cílové stránky nejspíš zakazuje vkládat obsah do rámu (hlavička `X-Frame-Options: DENY/SAMEORIGIN` nebo `Content-Security-Policy: frame-ancestors`), případně přesměrovává na `http`. Řešení není v `Launcheru` — cílová stránka musí vložení do rámu povolit.

Po úspěšném načtení hlášení zmizí.

### Prázdný stav

Pokud není otevřená žádná záložka, objeví se výzva:

- **„Není otevřená žádná záložka. Otevřete ji tlačítkem se záložkami vpravo nahoře."** — když jsou nějaké záložky nastavené, ale žádná není otevřená.
- **„Nejsou nastavené žádné záložky. Doplňte k adrese parametr ?edit a nastavte je."** — když jsou záložky ve zdroji prázdné a editor není zpřístupněn.

---

## Editor záložek

Editor záložek slouží ke změně názvu aplikace a seznamu vložených nástrojů. Vytvoří nový `index.html`, který si stáhnete a nahrajete zpět na server.

### Zpřístupnění editoru

Editor se skrývá, dokud k adrese nedoplníte parametr **`?edit`**:

```
https://vase-adresa/launcher/?edit
```

Po načtení stránky se v nabídce 📑 objeví další tlačítko **Upravit záložky**.

### Dialog editoru

Dialog **Nastavení rámečku** obsahuje:

| Pole | Popis |
|------|-------|
| Název v záhlaví | Text, který se zobrazí vlevo v záhlaví a jako titulek stránky |
| Záložky | Textové pole, každý řádek = jedna záložka ve tvaru **`Název \| URL`** |

Pravidla textového pole:

- Prázdné řádky jsou ignorovány
- Řádky začínající znakem **`#`** jsou brány jako poznámka a přeskočí se
- Chybí-li svislítko `|`, celý řádek se považuje za URL a název se doplní z hostname
- Chybí-li název (řetězec před `|`), doplní se z hostname URL

### Akce dialogu

| Tlačítko | Účinek |
|----------|--------|
| Zavřít | Zavře editor bez uložení |
| Vyzkoušet bez uložení | Aplikuje nastavení jen v aktuálním okně (ztratí se po přenačtení) |
| Uložit soubor | Sestaví nový `index.html` s vloženým názvem a záložkami a stáhne ho |

### Uložení nového index.html

Po kliknutí na **Uložit soubor** aplikace stáhne aktuální zdrojový kód stránky přes `fetch`, nahradí v něm blok mezi značkami `/* ZALOZKY-ZACATEK */` a `/* ZALOZKY-KONEC */` novými hodnotami `NAZEV` a `ZABUDOVANE` a nabídne stažení jako `index.html`. Tento soubor pak nahrajte na server místo původního.

Pokud je stránka otevřená přímo z disku (protokol `file://`) nebo `fetch` selže, zobrazí se hlášení, že soubor nelze sestavit, a doporučí se ruční úprava zdrojového kódu — v editoru zobrazený obsah lze zkopírovat a přepsat pole `NAZEV` a `ZABUDOVANE` ručně.

---

## Klávesové zkratky

| Klávesa | Účinek |
|---------|--------|
| Ctrl+R / Cmd+R | Znovu načíst aktivní záložku |
| F5 | Znovu načíst aktivní záložku |
| ← / → | Předchozí / další otevřená záložka (fokus na liště tabů) |
| Home | První otevřená záložka (fokus na liště tabů) |
| End | Poslední otevřená záložka (fokus na liště tabů) |
| Escape | Zavřít otevřenou nabídku záložek |

Znovunačtení funguje jen tehdy, když je fokus mimo vložený rám — jinak zkratku dostane cílová stránka. Safari si navíc Cmd+R nechává pro sebe a přenačte celou aplikaci `Launcher`.

---

## Technické informace

### Uložení dat

Nástroj ukládá jedinou hodnotu do `localStorage` prohlížeče:

- Klíč **`ramecek.aktivni`** — index naposledy zobrazené záložky, aby se po dalším otevření obnovila.

Žádná jiná data se lokálně neukládají, na server se nic neodesílá. Seznam záložek je pevnou součástí zdrojového kódu stránky.

### Vlastnosti rámů

Každá záložka je vložena jako `<iframe>` s povolenými schopnostmi: `clipboard-read`, `clipboard-write`, `fullscreen`, `geolocation`, `camera`, `microphone`, `autoplay`, plus atribut `allowfullscreen`. Vložené nástroje tak mohou pracovat se schránkou, kamerou, mikrofonem i zobrazením přes celou obrazovku.

### Omezení vkládání

Cílová stránka se v rámu neotevře, pokud:

- Server pošle hlavičku `X-Frame-Options: DENY` nebo `SAMEORIGIN` (a rámeček je jiný origin)
- Server pošle hlavičku `Content-Security-Policy: frame-ancestors …` bez povolení
- Stránka je `http://` a rámeček je `https://` (mixed content)

Řešením je vždy úprava cílového serveru — `Launcher` sám s tím nic udělat nemůže.

### Konfigurace ve zdroji

Ve zdrojovém kódu `index.html` jsou tyto konfigurační proměnné (uvnitř bloku `/* ZALOZKY-ZACATEK */` … `/* ZALOZKY-KONEC */`):

| Proměnná | Význam |
|----------|--------|
| `NAZEV` | Řetězec zobrazený v záhlaví a jako titulek stránky |
| `ZABUDOVANE` | Pole objektů `{ nazev, url }` — výchozí seznam záložek |

Editor v prohlížeči přepisuje právě tento blok.

### Konstanty chování

Ve skriptu jsou tři pojmenované konstanty:

| Konstanta | Hodnota | Význam |
|-----------|---------|--------|
| `KLIC_AKTIVNI` | `"ramecek.aktivni"` | Klíč `localStorage` pro poslední aktivní záložku |
| `CEKANI_MS` | `12000` | Doba čekání na načtení rámu, po které se zobrazí chybové hlášení |
| `TIK_MS` | `60000` | Interval aktualizace ukazatele doby načtení |

### Kompatibilita

Aplikace funguje ve všech moderních prohlížečích (Chrome, Firefox, Edge, Safari) na počítači i mobilu. Vyžaduje podporu `<dialog>`, `localStorage` a `fetch`. Pro provozování z lokálního disku (`file://`) je funkčnost stažení nového `index.html` omezená — vhodnější je provozovat aplikaci z HTTP serveru.

---

*Dokumentace odpovídá stavu aplikace Launcher ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
