# VideoEdit — Jednostopý webový video editor

**Online verze nástroje:** [https://egdilna.github.io/nastroje/mp4edit](https://egdilna.github.io/nastroje/mp4edit)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#mp4edit](https://egdilna.github.io/nastroje/#mp4edit)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu (ke stažení ffmpeg enginu je při prvním exportu připojení potřeba).

---

## Přehled funkcí a vychytávek

**VideoEdit** je přístupná webová aplikace pro nedestruktivní střih videa v prohlížeči. Funguje jako jednostopý editor — projekt je řada regionů (segmentů) z jednoho nebo více video souborů, které lze přerovnávat, dělit a oddělené hranice posunovat. Export sestaví výsledné MP4 bez překódování (lossless cut), díky čemuž je rychlý a kvalita videa zůstává zachována.

### Klíčové funkce

- **Načítání videa** — podporuje MP4, MOV, AVI, MKV (a další formáty, které umí prohlížeč) a kombinaci více zdrojových souborů v jednom projektu
- **Regiony** — projekt je řada regionů; každý region je úsek (nebo celý) zdrojového souboru s vlastním názvem a poznámkou
- **Střih na keyframech** — všechny střihy se zarovnávají na nejbližší keyframe, což umožňuje export bez překódování
- **Jemný posun hranice střihu** — po střihu lze hranici mezi dvěma regiony posouvat po jednotlivých keyframech v obou směrech
- **Změna pořadí, slučování, vkládání** — regiony lze přesouvat, slučovat se sousedním a vkládat za libovolný region další zdrojové video
- **Náhled a transport** — vestavěný přehrávač s ovládáním přehrávání celého projektu nebo jednotlivého regionu a s rychlým přetáčením
- **Undo/Redo** — neomezený zásobník zpět/znovu s popisem jednotlivých kroků
- **Projekt .ved** — celý projekt včetně zdrojových videí se ukládá do jediného souboru (ZIP s metadaty a videosoubory)
- **Export MP4** — sestavení výsledného MP4 přes ffmpeg.wasm bez překódování
- **Klávesové zkratky** — kompletní ovládání klávesnicí včetně hlasového ohlašování pozice
- **Dvojjazyčné rozhraní** — přepínání mezi češtinou a angličtinou

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML prvky, ARIA atributy, plná ovladatelnost klávesnicí, hlasové ohlašování stavu (`aria-live`) i pozice přehrávání pro uživatele čteček obrazovky. Modální dialogy mají správně nastavený `role="dialog"` a focus management.

### Co se NEDĚJE v cloudu

Veškerá data (zdrojová videa, projekt, export) zůstávají v prohlížeči. Na server se nic neodesílá. Jediná síťová operace je jednorázové stažení ffmpeg enginu (~9 MB z npm registry) při prvním startu — ten zůstane v paměti záložky do jejího zavření.

---

## Navigace a rozložení

Aplikace má tři hlavní oblasti — záhlaví, levý panel a pravý panel s videem.

### Záhlaví

V záhlaví je logo, hlavní menu, přepínač jazyka a tlačítko nápovědy.

| Tlačítko | Funkce |
|----------|--------|
| ⊕ Nový projekt | Vytvoří prázdný projekt (s potvrzením) |
| 📂 Otevřít projekt | Načte projekt ze souboru `.ved` |
| 💾 Uložit projekt | Uloží projekt jako `.ved` (ZIP s videi a metadaty) |
| ⬇ Exportovat video | Otevře dialog exportu výsledného MP4 |
| CS / EN | Přepíná jazyk rozhraní |
| ? Klávesy | Zobrazí dialog s klávesovými zkratkami |

### Levý panel

Levý panel obsahuje informace o projektu, seznam regionů a tlačítka Zpět/Znovu.

**Informace o projektu**:
- Pole **Název projektu** — použije se i jako navržený název souboru při ukládání a exportu
- **Délka** — celková délka výsledného videa (součet trvání všech regionů)
- **Regiony** — počet regionů
- **Velikost** — celková velikost zdrojových dat (deduplikováno, sdílené soubory se počítají jen jednou)

**Regiony**:
- Tlačítko **+ Načíst video** otevře dialog výběru souboru a přidá ho jako další region
- Pod ním je seznam karet regionů s vizuálními hranicemi střihu mezi nimi

**Zpět / Znovu**:
- Tlačítka **↩ Zpět** a **↪ Znovu** s popisem poslední akce vedle nich
- Zásobník se vyprázdní po uložení projektu

### Pravý panel

V pravém panelu je hlavní přehrávač videa a pod ním transportní lišta.

**Přehrávač** — společný `<video>` element, který přepíná zdroje podle aktuálního regionu. V překryvu (overlay) je vidět číslo a název aktuálně přehrávaného regionu a přesný čas (v rámci projektu).

**Transportní lišta** je rozdělena do dvou řad:

Řada 1 — hlavní ovládání:

| Tlačítko | Funkce |
|----------|--------|
| Pozice (0:00.0) | Aktuální pozice v projektu (přesnost 0,1 s) |
| ▶ Přehrát | Spustí přehrávání celého projektu od začátku |
| ⏸ Pauza / ⏵ Pokračovat | Pozastaví nebo obnoví přehrávání |
| ■ Stop | Zastaví a vrátí pozici na začátek |
| ✂ Střih | Střihne aktuální region na nejbližším keyframu na aktuální pozici |
| Nejbližší keyframe: x | Informace o nejbližším keyframu k aktuální pozici |

Řada 2 — rychlé přetáčení (dozadu i dopředu):

| Tlačítko | Akce |
|----------|------|
| «5s | Zpět 5 sekund |
| «10s | Zpět 10 sekund |
| «30s | Zpět 30 sekund |
| «1m | Zpět 1 minuta |
| «5m | Zpět 5 minut |
| 5s» | Vpřed 5 sekund |
| 10s» | Vpřed 10 sekund |
| 30s» | Vpřed 30 sekund |
| 1m» | Vpřed 1 minuta |
| 5m» | Vpřed 5 minut |

---

## Práce s projektem

### Nový projekt

Tlačítko **⊕ Nový projekt** v záhlaví vytvoří prázdný projekt. Pokud aktuální projekt obsahuje regiony, objeví se potvrzovací dialog — neuložené změny budou ztraceny.

### Uložení projektu (.ved)

Tlačítko **💾 Uložit projekt** uloží projekt jako soubor s příponou `.ved`. Jde o ZIP s touto strukturou:
- `project.json` — metadata (regiony, ořezy, keyframy, poznámky)
- `video/<id>_<jméno>.mp4` — kopie zdrojových video souborů

Sdílené zdrojové soubory (více regionů ze stejného souboru) se ukládají jen jednou. Komprese ZIP je nastavena na úroveň 1, aby uložení i pro velká videa proběhlo rychle.

Po uložení se vyprázdní zásobník Zpět/Znovu.

### Otevření projektu

Tlačítko **📂 Otevřít projekt** otevře soubor `.ved`. Zdrojová videa se rozbalí přímo do paměti záložky — žádné dočasné soubory na disku.

Podporuje se i starší formát ukládání (cesta `video/<id>_<jméno>` v ZIPu bez explicitního `zipFile` v metadatech).

### Pole „Název projektu"

Pole v levém panelu — text se použije jako navržený název souboru při uložení (přípona `.ved`) i při exportu (přípona `.mp4`).

---

## Regiony

Region je úsek (nebo celý obsah) jednoho zdrojového souboru. Region má:
- **id** — interní identifikátor
- **název** — uživatelský název (musí být v rámci projektu unikátní; duplicita se automaticky doplní `_2`, `_3`…)
- **zdrojový soubor** — reference na ArrayBuffer videa
- **startTrim** a **endTrim** — kolik sekund ze začátku/konce souboru se má vynechat
- **keyframes** — seznam časů keyframů parsovaných z MP4 (přes knihovnu mp4box.js)
- **notes** — volná poznámka

### Načtení dalšího videa

- Tlačítko **+ Načíst video** v hlavičce seznamu regionů — přidá nový region na konec
- Tlačítko **+▼** u konkrétního regionu — vloží nový region za tento

Po načtení se z videa parsují keyframy. Pokud knihovna keyframy v souboru nenajde (např. exotický kodek nebo poškozený index), zobrazí se varování ve stavovém řádku — střih pak nemusí být přesný a export se ohlásí jako neúspěšný.

### Karta regionu

Každý region je samostatná karta v levém panelu obsahující:
- Číslo regionu (pořadí v projektu) a název
- Časovou informaci: **Začátek**, **Konec**, **Délka** v projektovém čase a počet keyframů (KF)
- Náhled videa
- Pole **Název regionu** — přejmenování (s kontrolou unikátnosti)
- Pole **Poznámky** — volný text

#### Akce nad regionem

| Ikona | Akce | Popis |
|-------|------|-------|
| ▶ | Přehrát region | Spustí přehrávání tohoto regionu od jeho začátku do konce |
| ▶… | Přehrát od regionu | Spustí přehrávání od začátku tohoto regionu až do konce projektu |
| ⊞ | Sloučit s předchozím | Sloučí region s předchozím (jen pro regiony ze stejného zdroje) |
| +▼ | Vložit video za region | Otevře dialog výběru souboru a vloží nový region za tento |
| ↑ / ↓ | Posunout výše / níže | Změní pořadí regionu v projektu |
| ✕ | Odstranit region | Odstraní region (s potvrzením) |

### Hranice střihu mezi regiony

Mezi dvěma sousedními regiony se zobrazuje vizuální hranice s informací **✂ Střih v hh:mm:ss.s** a dvěma tlačítky pro jemný posun:

| Tlačítko | Akce |
|----------|------|
| ◀ KF | Posune střih na předchozí keyframe (zkrátí předchozí region, rozšíří následující) |
| KF ▶ | Posune střih na další keyframe (rozšíří předchozí region, zkrátí následující) |

Tato jemná korekce funguje i přes hranici souborů — když se vyčerpají keyframy v jednom regionu, použijí se keyframy v navazujícím.

### Sloučení regionů

Akce **⊞** sloučí region s předchozím:
- **Stejný zdrojový soubor** — odstraní ořezy na hranici a regiony spojí do jednoho (poznámky se konkatenují)
- **Různé soubory** — sloučit nelze; zobrazí se hláška „Regiony z různých souborů stačí mít za sebou – export je automaticky spojí do jednoho MP4." Stačí tedy mít regiony za sebou, export je spojí sám.

---

## Střih (split)

Tlačítko **✂ Střih** v transportní liště (nebo zkratka `S`) rozdělí aktuální region na aktuální pozici přehrávání:
1. Najde region, ve kterém se právě nachází pozice přehrávání
2. Najde **nejbližší keyframe** k této pozici (uvnitř souboru zdroje)
3. Vytvoří dva regiony: první zdědí původní název, druhý dostane název s příponou `_2`
4. Přehrávání se zastaví a pozice se nastaví přesně na střih

Pokud je pozice příliš blízko okraji regionu (méně než 0,1 s), střih se neprovede a zobrazí se chyba „Příliš blízko okraji regionu pro střih."

Pokud zdrojový soubor nemá parsované keyframy, střih se provede na přesné pozici (ale nemusí být v exportu úplně přesný).

---

## Přehrávání

### Režimy přehrávání

- **Přehrát projekt** (▶) — přehrávání od začátku projektu do konce, plynule přes hranice regionů
- **Přehrát region** (▶ na kartě) — přehrávání od začátku konkrétního regionu do jeho konce
- **Přehrát od regionu** (▶… na kartě) — od začátku tohoto regionu do konce projektu
- **Pokračovat** (⏵) — pokračování od pozice, kde bylo přerušeno

### Plynulé přehrávání přes hranice

Aplikace používá jeden `<video>` element, který automaticky přepíná zdroj při přechodu z jednoho regionu na další. Aktuální region je v levém panelu vizuálně zvýrazněn (třída `is-playing`).

### Pozice a překryv

Pozice se aktualizuje 12× za sekundu. V překryvu nad videem se zobrazuje číslo a název aktuálního regionu a přesný čas s desetinou sekundy. V transportní liště je u tlačítka **Střih** informace o nejbližším keyframu.

---

## Export videa

Tlačítko **⬇ Exportovat video** v záhlaví otevře dialog s tlačítkem **Exportovat**.

### Postup exportu

1. Pro každý region se spustí samostatná instance ffmpeg.wasm, která ořeže zdrojový soubor podle hodnot `startTrim` a `endTrim` (pomocí `-c copy`, tedy bez překódování)
2. Vzniklé segmenty se zapíšou jako `seg0.mp4`, `seg1.mp4`, …
3. Pomocí ffmpeg `concat` demuxeru se segmenty spojí do jednoho výstupního MP4 (rovněž `-c copy`)
4. Výsledek se stáhne jako `<název projektu>.mp4`

Pokud projekt obsahuje jediný region, krok 3 se přeskočí — vrátí se přímo segment.

V průběhu exportu se zobrazuje stavový pruh (0–100 %) a textový popis aktuální fáze. Ohlášení pro čtečky obrazovky probíhá přes `aria-live`.

### Omezení exportu

- Export funguje **bez překódování** — všechny zdrojové soubory musí mít stejné parametry (kodek, rozlišení, frame rate, audio) a kompatibilní strukturu. Pro různorodé zdroje může dojít k chybám nebo k poskakování.
- Střihy se musejí nacházet na keyframech — proto aplikace automaticky zarovnává.
- ffmpeg.wasm běží v jednom vlákně (single-threaded build kvůli kompatibilitě bez SharedArrayBuffer), takže export větších projektů může trvat déle.

---

## Undo / Redo

Pro každou akci, která mění regiony (přidání, odstranění, přesun, střih, sloučení, posun střihu, přejmenování), se vytvoří snapshot. Vedle tlačítek **↩ Zpět** a **↪ Znovu** se zobrazuje popis poslední akce.

Pole `fileData` (binární data zdrojového videa) jsou v zásobníku pouze referencována — neklonují se. Snapshot je tak paměťově nenáročný.

Po uložení projektu se zásobníky **vyprázdní**.

Po vrácení/opakování se invalidují object URL pro náhledy videí, aby se vždy zobrazoval aktuální obsah.

---

## Klávesové zkratky

Zkratky nefungují při psaní do textového pole. Otevírání nápovědy je dostupné také tlačítkem **? Klávesy** v záhlaví.

| Klávesa | Funkce |
|---------|--------|
| P | Pauza / pokračovat v přehrávání |
| Shift+P | Přehrát celý projekt od začátku |
| S | Střih na aktuální pozici |
| J | Přejít na předchozí region |
| K | Přejít na další region |
| X | Zpět o 5 sekund |
| V | Vpřed o 5 sekund |
| I | Zpět o minutu |
| O | Vpřed o minutu |
| C | Ohlásit pozici a aktuální region (pro čtečky obrazovky) |
| Z | Zpět (undo) |
| Shift+Z | Znovu (redo) |
| ? | Otevřít nápovědu klávesových zkratek |
| Esc | Zavřít otevřený dialog |

Při použití zkratek `J` / `K` se okno automaticky scrolluje na cílový region a fokus se přesune na nadpis karty.

---

## Stavový řádek

Spodní pruh aplikace zobrazuje aktuální stav (např. „Připraveno", „Přehrávám", „Region X přidán", chybové hlášky) a v průběhu exportu i progresivní pruh s procenty. Stavový řádek má `role="status"` s `aria-live="polite"`, takže důležité události slyší i uživatelé čteček.

Typické stavy:

| Stav | Význam |
|------|--------|
| Připraveno | Aplikace čeká |
| Načítám… | Zpracovává se vstupní soubor |
| Region „X" přidán | Po načtení nového videa |
| Region rozdělen na keyframe HH:MM:SS.s | Po střihu |
| Střih přesunut na keyframe HH:MM:SS.s | Po posunu hranice |
| Přehrávám / Pozastaveno / Zastaveno | Aktuální stav přehrávání |
| Ukládám projekt… / Projekt uložen | Při ukládání `.ved` |
| Export dokončen: jméno.mp4 | Po dokončení exportu |
| ffmpeg připraven | Po stažení a inicializaci ffmpeg enginu |
| Chyba: zpráva | Obecná chyba |

---

## Formát souboru .ved

Projektový soubor `.ved` je ZIP archiv s následující strukturou:

```
project.json           ← metadata projektu (JSON)
video/<id>_<jméno>     ← kopie zdrojových video souborů
```

`project.json` obsahuje:

| Pole | Popis |
|------|-------|
| `appVersion` | Verze formátu (aktuálně 2) |
| `name` | Název projektu |
| `regions` | Pole regionů |
| `regions[].id` | Identifikátor regionu |
| `regions[].name` | Název regionu |
| `regions[].fileName` | Původní název zdrojového souboru |
| `regions[].duration` | Délka zdrojového souboru v sekundách |
| `regions[].startTrim` | Ořez na začátku (sekund) |
| `regions[].endTrim` | Ořez na konci (sekund) |
| `regions[].keyframes` | Pole časů keyframů |
| `regions[].notes` | Poznámka k regionu |
| `regions[].zipFile` | Cesta ke zdrojovému souboru uvnitř ZIPu |

---

## Technické informace

### Použité knihovny

| Knihovna | Verze | Účel |
|----------|-------|------|
| ffmpeg.wasm | 0.11.6 | WebAssembly port FFmpeg pro ořez a sloučení MP4 |
| @ffmpeg/core-st | 0.11.1 | Single-threaded build ffmpeg jádra (nepotřebuje SharedArrayBuffer) |
| JSZip | 3.10.1 | Práce s formátem `.ved` (ZIP) |
| mp4box.js | runtime | Parsování keyframů z MP4 |

ffmpeg WASM binárka se při prvním spuštění stahuje z `https://registry.npmjs.org/@ffmpeg/core-st/-/core-st-0.11.1.tgz` (~9 MB), rozbaluje pomocí nativního `DecompressionStream('gzip')` a extrahuje z tarballu. Drží se v paměti záložky do jejího zavření.

### Zpracování dat

- Zdrojová videa se drží v paměti jako `ArrayBuffer` a sdílejí se mezi regiony stejného zdroje (referenční rovnost)
- Pro náhledy v UI se pro každý region vytváří `blob: URL` (a po odstranění/změně regionu se uvolňuje)
- Žádná data se neukládají do `localStorage` ani neopouštějí prohlížeč — projekt přežije pouze přes uložení do `.ved`

### Kompatibilita prohlížečů

Aplikace funguje v moderních prohlížečích podporujících WebAssembly, `DecompressionStream` a HTML5 `<video>` (Chrome 80+, Firefox 113+, Edge 80+, Safari 16.4+).

### Stažitelnost a offline použití

HTML soubor obsahuje veškerý kód aplikace včetně vložených knihoven JSZip a ffmpeg.js loaderu. Pro stažitelnou verzi je při prvním exportu potřeba internet (kvůli stažení ffmpeg WASM binárky), poté lze pracovat i offline ve stejné záložce.

---

*Dokumentace odpovídá verzi VideoEdit 1.2.0. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
