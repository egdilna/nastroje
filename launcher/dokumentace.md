# Launcher — Rámeček pro rychlé nástroje

**Online verze nástroje:** [https://egdilna.github.io/nastroje/launcher](https://egdilna.github.io/nastroje/launcher)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#launcher](https://egdilna.github.io/nastroje/#launcher)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Launcher** je jednoduchý přepínač webových nástrojů v jednom okně prohlížeče. Vloží libovolné externí stránky do vlastních záložek, mezi kterými přepíná bez toho, aby přepnutí přerušilo činnost skryté záložky. Ve výchozí konfiguraci se v záhlaví hlásí jako **Rychlé nástroje** (interní název aplikace v `<title>` je **Rámeček**). Celá aplikace je jediný soubor `index.html`, seznam nástrojů je zapsaný přímo v jeho zdrojovém kódu, žádný server ani instalace nejsou potřeba.

### Klíčové funkce

- **Záložky s vloženými nástroji** — každá otevřená záložka žije v samostatném `<iframe>`, jehož obsah zůstává živý i po přepnutí na jinou záložku (nedochází ke znovunačtení)
- **Nabídka záložek** — tlačítko 📑 vpravo v horním řádku otevře seznam všech dostupných nástrojů s vyznačením, které jsou otevřené a která je právě zobrazená
- **Lišta otevřených záložek** — vodorovný pruh v druhém řádku záhlaví s taby otevřených nástrojů; aktivní tab je modrý
- **Znovunačtení aktivní záložky** — tlačítko 🔄 nebo klávesová zkratka (Ctrl/Cmd+R, F5) načte znovu jen zobrazený rám, ne celou aplikaci
- **Zavření záložky** — v nabídce záložek je tlačítko **Zavřít záložku {název}**; po zavření se přepne na sousední otevřenou záložku
- **Zapamatování stavu** — index poslední zobrazené záložky se ukládá do `localStorage`; po dalším otevření stránky se automaticky obnoví
- **Ukazatel doby načtení** — pod záhlavím se zobrazuje, jak dávno byla zobrazená stránka načtena (např. „Načteno právě teď", „Načteno před 12 minutami", „Načteno před 3 hodinami")
- **Detekce nefunkčního vložení** — pokud se cílová stránka do 12 sekund nenačte (typicky kvůli hlavičkám `X-Frame-Options` nebo `CSP frame-ancestors`), objeví se srozumitelné hlášení v červeném pruhu
- **Editor záložek** — po přidání parametru `?edit` k adrese se zpřístupní editor, ve kterém lze upravit název aplikace i seznam záložek a stáhnout přepsaný `index.html` k nahrání zpět na server

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

Nástroj používá sémantické role ARIA (`tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-current`, `aria-live`, `aria-haspopup`, `aria-expanded`, `aria-controls`), plnohodnotné ovládání klávesnicí (šipky, Home/End pro pohyb mezi taby, Escape pro zavření nabídky), skrytou živou oblast pro hlášení stavu asistivním technologiím, viditelný fokusový rámeček (`outline: 3px solid #7dd3fc`) a respektuje `prefers-reduced-motion`. Podporuje bezpečné oblasti (`safe-area-inset`) na mobilech s výřezem a je optimalizovaný jak pro dotykové obrazovky, tak pro myš a klávesnici.

---

## Rozložení obrazovky

Obrazovka má tři vodorovné vrstvy s pevnou barevností (tmavé záhlaví, bílá plocha).

### Záhlaví

Tmavý panel v horní části obrazovky se skládá ze dvou řádků a jednoho ukazatele:

**První řádek**

- **Název aplikace** vlevo — přebírá se z proměnné `NAZEV` ve zdrojovém kódu (výchozí „Rychlé nástroje")
- **Tlačítko 📑 Záložky** vpravo — otevře nabídku všech záložek a operací nad nimi

**Druhý řádek**

- **Tlačítko 🔄 Znovu načíst** — načte znovu právě zobrazenou záložku
- **Lišta otevřených záložek** — vodorovný scrollovatelný pruh s taby otevřených nástrojů; aktivní tab je modrý

**Ukazatel doby načtení**

Malá šedá řádka pod oběma řádky; při najetí myší nabídne přesné datum a čas načtení.

### Hlavní plocha

Bílá pracovní plocha, ve které se vždy zobrazuje jeden `<iframe>` s aktivním nástrojem. Ostatní otevřené záložky jsou skryté (`hidden`), ale nadále živé — jejich obsah, přihlášení, rozpracované formuláře i JavaScript stav se zachovávají.

### Případné hlášení a prázdný stav

- Pokud se stránka nenačte, objeví se pod záhlavím červený pruh se srozumitelnou zprávou.
- Pokud není otevřená žádná záložka, hlavní plocha zobrazí šedou výzvu s pokynem, co dělat dál.

---

## Práce se záložkami

### Otevření záložky

1. Klikněte na tlačítko **📑** vpravo v prvním řádku záhlaví
2. V nabídce se zobrazí seznam všech dostupných záložek
3. Kliknutím na název se záložka otevře a rovnou zobrazí

U již otevřené záložky je za názvem popisek **„otevřená"** nebo **„otevřená, zobrazená"**. Kliknutím na již otevřenou záložku se do ní jen přepne, obsah se znovu nenačítá.

### Přepínání mezi otevřenými záložkami

- Kliknutím na tab v liště pod záhlavím
- Kliknutím na název záložky v nabídce 📑
- Klávesnicí, pokud je fokus na liště tabů: **←** / **→** (předchozí/další), **Home** (první), **End** (poslední)

### Zavření otevřené záložky

1. Otevřete nabídku 📑
2. V dolní části nabídky klikněte na **Zavřít záložku {název}**
3. Zobrazí se sousední otevřená záložka; pokud žádná další není, objeví se výzva k otevření záložky

Tlačítko je deaktivované, pokud žádná záložka není otevřená (má tehdy neutrální text „Zavřít otevřenou záložku").

### Znovunačtení záložky

Aktivní záložku lze načíst znovu třemi způsoby:

- Tlačítkem **🔄** ve druhém řádku záhlaví
- Klávesovou zkratkou **Ctrl+R** / **Cmd+R**
- Klávesou **F5**

Znovunačtení nastaví `src` rámu na `about:blank` a pak zpět na původní adresu — vynutí tak čerstvé načtení nezávisle na cache. Zkratky fungují jen tehdy, když fokus není uvnitř vloženého rámu (jinak zkratku dostane cílová stránka). Safari si Cmd+R nechává pro sebe a přenačte celou aplikaci `Launcher`.

### Ukazatel doby načtení

Řádek pod záložkami ukazuje, kdy byla aktivní stránka naposledy načtena:

| Doba od načtení | Zobrazený text |
|-----------------|----------------|
| Do 1 minuty | Načteno právě teď |
| Do 80 minut | Načteno před {N} minutami |
| Do 30 hodin | Načteno před {N} hodinami |
| Déle | Načteno před {N} dny |

Ukazatel se aktualizuje každou minutu a také při návratu do okna prohlížeče (událost `visibilitychange`). Při najetí myší se zobrazí přesné datum a čas načtení (např. „Načteno 16. 8. 2026 v 9:43").

---

## Hlášení o problémech

### Časový limit načtení

Pokud se cílová stránka do 12 sekund nenačte (událost `load` rámu se nespustí), zobrazí se v červeném pruhu jedna ze dvou hlášek:

- **„Záložka „{název}" vede na nešifrované http…"** — stránka `Launcher` je otevřená přes `https`, ale záložka směřuje na `http://…`; prohlížeč takové vložení blokuje jako mixed content. Změňte URL v editoru na `https://…`.
- **„Stránka „{název}" se v rámu nenačetla…"** — server cílové stránky nejspíš zakazuje vkládat obsah do rámu (hlavička `X-Frame-Options: DENY/SAMEORIGIN` nebo `Content-Security-Policy: frame-ancestors`), případně přesměrovává na `http`. Řešení není v `Launcheru` — cílová stránka musí vložení do rámu povolit.

Po úspěšném načtení hlášení automaticky zmizí. Přepnutím na jinou záložku se hlášení také skryje.

### Prázdný stav

Pokud není otevřená žádná záložka, hlavní plocha zobrazí jednu z výzev:

- **„Není otevřená žádná záložka. Otevřete ji tlačítkem se záložkami vpravo nahoře."** — když jsou nějaké záložky nastavené, ale žádná není otevřená.
- **„Nejsou nastavené žádné záložky. Nastavte je v nabídce vpravo nahoře."** — když jsou záložky ve zdroji prázdné a editor je zpřístupněn parametrem `?edit`.
- **„Nejsou nastavené žádné záložky. Doplňte k adrese parametr ?edit a nastavte je."** — když jsou záložky prázdné a editor není zpřístupněn.

---

## Editor záložek

Editor slouží ke změně názvu aplikace a seznamu vložených nástrojů. Vytváří přepsaný soubor `index.html`, který si stáhnete a nahrajete zpět na server.

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
| Název v záhlaví | Text zobrazený vlevo v záhlaví a jako titulek okna prohlížeče (`<title>`) |
| Záložky | Textové pole, každý řádek = jedna záložka ve tvaru **`Název \| URL`** |

Pravidla textového pole:

- Prázdné řádky jsou ignorovány
- Řádky začínající znakem **`#`** jsou brány jako poznámka a přeskočí se
- Chybí-li svislítko `|`, celý řádek se považuje za URL a název se doplní z hostname
- Chybí-li název (řetězec před `|`), doplní se z hostname URL
- Chybí-li URL (řetězec za `|`), řádek se přeskočí

### Akce dialogu

| Tlačítko | Účinek |
|----------|--------|
| Zavřít | Zavře editor bez uložení, žádné změny se neprojeví |
| Vyzkoušet bez uložení | Aplikuje nastavení jen v aktuálním okně (změny se ztratí po přenačtení) |
| Uložit soubor | Sestaví nový `index.html` s vloženým názvem a záložkami a stáhne ho do počítače |

### Uložení nového index.html

Po kliknutí na **Uložit soubor** aplikace stáhne aktuální zdrojový kód stránky přes `fetch`, nahradí v něm blok mezi značkami `/* ZALOZKY-ZACATEK */` a `/* ZALOZKY-KONEC */` novými hodnotami `NAZEV` a `ZABUDOVANE` a nabídne stažení výsledku jako `index.html`. Tento soubor pak nahrajte na server místo původního.

Pokud je stránka otevřená přímo z disku (protokol `file://`) nebo `fetch` selže, zobrazí se hlášení, že soubor nelze sestavit ze zdroje, a doporučí se ruční úprava zdrojového kódu — obsah zobrazený v editoru lze zkopírovat a přepsat pole `NAZEV` a `ZABUDOVANE` v souboru `index.html` ručně.

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

Znovunačtení funguje jen tehdy, když je fokus mimo vložený rám — jinak zkratku dostane cílová stránka. Safari si Cmd+R nechává pro sebe a přenačte celou aplikaci `Launcher`.

---

## Technické informace

### Uložení dat

Nástroj ukládá jedinou hodnotu do `localStorage` prohlížeče:

| Klíč | Význam |
|------|--------|
| `ramecek.aktivni` | Index naposledy zobrazené záložky, aby se po dalším otevření obnovila |

Žádná další data se lokálně neukládají, na server se nic neodesílá. Seznam záložek je pevnou součástí zdrojového kódu stránky.

### Vlastnosti vložených rámů

Každá záložka je vložena jako `<iframe>` s povolenými schopnostmi:

```
allow="clipboard-read; clipboard-write; fullscreen; geolocation; camera; microphone; autoplay"
allowfullscreen
```

Vložené nástroje tak mohou pracovat se schránkou, kamerou, mikrofonem, geolokací i zobrazením přes celou obrazovku, pokud jim to prohlížeč a uživatel dovolí.

### Omezení vkládání

Cílová stránka se v rámu neotevře, pokud:

- Server pošle hlavičku `X-Frame-Options: DENY` nebo `SAMEORIGIN` (a `Launcher` je jiný origin)
- Server pošle hlavičku `Content-Security-Policy: frame-ancestors …` bez povolení pro doménu, ze které `Launcher` běží
- Stránka je `http://` a `Launcher` běží přes `https://` (mixed content blokovaný prohlížečem)
- Server přesměrovává na `http` nebo jiný nekompatibilní zdroj

Řešením je vždy úprava cílového serveru nebo použití jiné adresy — `Launcher` sám s hlavičkami cílové stránky nic dělat nemůže.

### Konfigurace ve zdroji

V souboru `index.html` jsou dvě konfigurační proměnné uvnitř bloku ohraničeného značkami `/* ZALOZKY-ZACATEK */` … `/* ZALOZKY-KONEC */`:

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
| `CEKANI_MS` | `12000` | Doba čekání (ms) na načtení rámu, po které se zobrazí chybové hlášení |
| `TIK_MS` | `60000` | Interval (ms) aktualizace ukazatele doby načtení |

### Kompatibilita

Aplikace funguje ve všech moderních prohlížečích (Chrome, Firefox, Edge, Safari) na počítači i mobilu. Vyžaduje podporu HTML `<dialog>`, `localStorage`, `fetch` a `URL.createObjectURL`. Pro provozování z lokálního disku (`file://`) je funkčnost stažení přepsaného `index.html` omezená — vhodnější je aplikaci nasadit na HTTP(S) server.

---

*Dokumentace odpovídá stavu aplikace Launcher ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdílna.*
