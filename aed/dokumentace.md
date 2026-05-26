# AudioEdit — Jednostopý webový audio editor

**Online verze nástroje:** [https://egdilna.github.io/nastroje/aed](https://egdilna.github.io/nastroje/aed)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#aed](https://egdilna.github.io/nastroje/#aed)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**AudioEdit** je jednostopý webový editor zvuku pro mluvené slovo, podcasty, přednášky a obdobné nahrávky. Pracuje s jednou časovou osou, na které jsou za sebou seřazené **regiony** — jednotlivé zvukové úryvky, které se přehrávají i exportují v naznačeném pořadí. Vše běží v jednom HTML souboru přímo v prohlížeči, žádný server, žádná instalace, žádná registrace, žádná data se nikam neodesílají.

### Klíčové funkce

- **Načítání zvuků** — import zvukových souborů ve formátech WAV, MP3, OGG a M4A jako samostatných regionů
- **Řazení regionů** — přesouvání regionů nahoru/dolů, vkládání nového regionu za vybraný
- **Střih** — rozdělení regionu na aktuální pozici přehrávání (S) a sloučení sousedních regionů
- **Přehrávání** — přehrávání celého projektu, samostatného regionu nebo úseku od daného regionu do konce
- **Navigace v čase** — přetáčení o 5 s / 10 s / 30 s / 1 min / 5 min vpřed i vzad, skoky mezi regiony klávesami J/K
- **Poznámky** — textové poznámky ke každému regionu pro vlastní orientaci
- **Uložení projektu** — zabalení celého projektu včetně zvukových dat do souboru `.aed` (komprimovaný ZIP)
- **Export hotového záznamu** — spojení všech regionů do jednoho souboru ve formátu WAV, MP3, OGG nebo M4A
- **Dvojjazyčné UI** — přepínání mezi češtinou a angličtinou (CS / EN)
- **Klávesové zkratky** — kompletní ovládání z klávesnice včetně ohlášení pozice pro nevidomé
- **Přístupnost** — semantické HTML, ARIA atributy, oblast `aria-live` pro odečítače obrazovky

### Pro koho je nástroj určen

Pro tvůrce mluveného slova — podcasterů, lektorů, autorů audioknih, novinářů — kteří potřebují rychle seskládat hotovou nahrávku z dílčích záznamů, oříznout přebytečné pasáže, zaměnit pořadí a vyexportovat výsledek. Nejedná se o vícestopový editor (DAW) — projekt má vždy jednu časovou osu a regiony za sebou.

---

## Navigace a rozložení

Aplikace má tři hlavní oblasti: záhlaví, postranní panel a hlavní pracovní plochu se seznamem regionů.

### Záhlaví

Záhlaví obsahuje logo aplikace, hlavní nabídku a přepínač jazyka:

| Tlačítko | Funkce |
|----------|--------|
| ⊕ Nový projekt | Vytvoří prázdný projekt (s potvrzením, pokud jsou neuložené změny) |
| 📂 Otevřít projekt | Načte projekt ze souboru `.aed` |
| 💾 Uložit projekt | Uloží projekt do souboru `.aed` |
| ⬇ Exportovat výsledek | Otevře dialog exportu hotového zvukového souboru |
| ? Klávesy | Zobrazí nápovědu klávesových zkratek |
| CS / EN | Přepne jazyk uživatelského rozhraní |

### Postranní panel

Postranní panel obsahuje dvě sekce — **Informace o projektu** a **Přehrávání**.

**Informace o projektu** zobrazuje pole pro název projektu a statistiky:

| Údaj | Význam |
|------|--------|
| Celková délka | Součet délek všech regionů (mm:ss) |
| Počet regionů | Kolik regionů projekt obsahuje |
| Celk. velikost zvuků | Součet velikostí zdrojových zvukových souborů |
| Velikost ZIP | Velikost posledního uloženého `.aed` souboru |

**Přehrávání** obsahuje displej aktuální pozice, hlavní transportní tlačítka a skupiny tlačítek pro přetáčení (viz kapitola Přehrávání).

### Hlavní pracovní plocha

Hlavní plocha zobrazuje seznam regionů (kartiček) v pořadí, ve kterém se přehrávají a exportují. V horní části je nadpis sekce a tlačítko **+ Načíst zvukový soubor**. Pokud je projekt prázdný, zobrazí se výchozí výzva k načtení prvního zvuku.

---

## Regiony

**Region** je jeden zvukový úryvek na časové ose projektu. Každý region má unikátní název, zdrojový zvukový soubor, vlastní délku a volitelnou poznámku. Regiony jsou seřazeny za sebou a při přehrávání projektu jdou kontinuálně jeden po druhém.

### Načtení nového regionu

Tlačítkem **+ Načíst zvukový soubor** v záhlaví seznamu regionů vyberte zvukový soubor z disku. Podporované formáty:

- **WAV** — bezztrátový (typicky největší soubory)
- **MP3** — ztrátový (nejrozšířenější)
- **OGG Vorbis** — ztrátový
- **M4A / AAC** — ztrátový

Nový region se přidá na konec projektu. Načte se z něj automaticky délka (metadata) a název souboru se použije jako výchozí název regionu.

### Karta regionu

Každý region je v seznamu zobrazen jako karta s pořadovým číslem, názvem, časovými údaji a sadou akčních tlačítek:

| Údaj v záhlaví | Význam |
|----------------|--------|
| Pořadové číslo | Pozice regionu v projektu (1, 2, 3 …) |
| Začátek | Absolutní začátek regionu na časové ose (mm:ss) |
| Konec | Absolutní konec regionu na časové ose (mm:ss) |
| Délka | Délka samotného regionu (mm:ss) |

**Akční tlačítka karty regionu:**

| Ikona | Akce |
|-------|------|
| ▶ | Přehrát samotný region (od jeho začátku do jeho konce) |
| ▶… | Přehrát od tohoto regionu do konce projektu |
| ⊞ | Sloučit s předchozím regionem (mimo první region) |
| +▼ | Vložit zvukový soubor za tento region |
| ↑ | Posunout region výše v pořadí |
| ↓ | Posunout region níže v pořadí |
| ✕ | Odstranit region (s potvrzením) |

### Editovatelná pole regionu

| Pole | Popis |
|------|-------|
| Název regionu | Krátký název pro orientaci, musí být v rámci projektu unikátní |
| Poznámky | Volný text pro vlastní poznámky k regionu (např. obsah, je-li potřeba doupravit, …) |

### Střih regionu — rozdělení na pozici

Tlačítkem ✂ **Rozdělit na pozici** v transportní liště (nebo klávesou **S**) se region, ve kterém se nachází aktuální pozice přehrávání, rozdělí na dvě části. Originál nahradí dvojice nových regionů s názvy `{název}` a `{název}_2`. Poznámka původního regionu zůstává u první části.

Podmínky pro úspěšný střih:

- Aktuální pozice přehrávání musí být uvnitř regionu (ne na jeho začátku ani konci)
- Nelze rozdělit přesně na okraji regionu (krajní polohy do 0,01 s nejsou povoleny)

Pokud podmínky nejsou splněny, zobrazí se v dolní stavové liště odpovídající chybové hlášení.

### Sloučení s předchozím regionem

Tlačítkem ⊞ na kartě regionu se region spojí s tím, který mu předchází. Vytvoří se nový region se stejným názvem jako předchozí. Poznámky obou regionů se spojí (oddělené řádkováním). Zvukový obsah obou regionů se přeenkoduje do formátu WAV.

První region v projektu nelze s ničím sloučit.

### Vložení regionu doprostřed

Tlačítko **+▼** na kartě regionu otevře dialog pro výběr zvukového souboru a po načtení vloží nový region hned za vybraný. Tak lze do projektu doplňovat zvuky i mimo jeho konec.

### Přesun regionu v pořadí

Šipky **↑** a **↓** přesouvají region o jednu pozici nahoru nebo dolů. Krajní regiony mají odpovídající směr deaktivovaný.

### Odstranění regionu

Tlačítko **✕** odstraní region po potvrzení dotazem „Opravdu odstranit region '{název}'?". Odstranění je v rámci projektu nevratné (změnu lze vrátit pouze opětovným otevřením dříve uloženého `.aed` souboru).

---

## Přehrávání

Přehrávání pracuje s **absolutní pozicí** v rámci celého projektu. Displej v postranním panelu zobrazuje aktuální pozici ve formátu `mm:ss.d` (s desetinou sekundy).

### Hlavní transportní tlačítka

| Tlačítko | Funkce |
|----------|--------|
| ▶ Přehrát celý projekt | Spustí přehrávání od začátku projektu |
| ⏸ Pauza | Pozastaví přehrávání, zachová pozici |
| ⏵ Pokračovat | Spustí přehrávání od pozice, kde byla pauza |
| ■ Stop | Zastaví přehrávání a vrátí pozici na začátek |
| ✂ Rozdělit na pozici | Rozdělí region na aktuální pozici přehrávání |

Tlačítko **Pauza** / **Pokračovat** je společné a střídá svůj stav podle toho, zda právě hraje, nebo ne.

### Přetáčení

Pod hlavními tlačítky jsou dvě skupiny tlačítek pro skoky v čase:

| Skupina | Hodnoty |
|---------|---------|
| Zpět | «5s, «10s, «30s, «1min, «5min |
| Vpřed | 5s», 10s», 30s», 1min», 5min» |

Přetáčení funguje i při zastaveném přehrávání — jen posune aktuální pozici. Pokud přehrávání běží, pozastaví se a opět rozjede z nové pozice.

### Přehrání jen jednoho regionu

Tlačítko **▶** přímo na kartě regionu spustí přehrávání jen tohoto regionu (od jeho začátku do jeho konce). Tlačítko **▶…** spustí přehrávání od začátku regionu a pokračuje dál po projektu.

---

## Export hotového záznamu

Tlačítko **⬇ Exportovat výsledek** v záhlaví otevře dialog exportu. Aplikace dekóduje všechny regiony, sestaví je do jednoho průběžného zvukového bufferu (stereo) a vyexportuje jako jeden soubor.

### Pole dialogu exportu

| Pole | Popis |
|------|-------|
| Formát výstupu | WAV (bezztrátový), MP3, OGG Vorbis nebo M4A / AAC |
| Kvalita / bitrate | 128 / 192 (výchozí) / 256 / 320 kbps |

Tlačítko **Exportovat** zahájí proces, dialog ukáže průběh ve čtyřech fázích:

1. **Mixuji region X z Y** — dekódování všech zdrojových zvuků (0–40 %)
2. **Kóduji výstup** — sestavení společného bufferu a enkódování (40–80 %)
3. **Kóduji výstup** — finální komprese (80–100 %)
4. **Ukládám soubor** — předání souboru prohlížeči ke stažení

Výsledný soubor se pojmenuje podle názvu projektu s odpovídající příponou (např. `Můj podcast.mp3`).

### Poznámky k formátům

- **WAV** je vždy plně podporován; produkuje největší soubory, ale bez ztráty kvality.
- **MP3** používá vestavěný kodek `lamejs`, pracuje ve všech moderních prohlížečích.
- **OGG Vorbis** a **M4A / AAC** používají vestavěný `MediaRecorder` prohlížeče. Podpora M4A závisí na prohlížeči — Chrome a Edge ho obvykle umí, Firefox nemusí. Při nedostupné podpoře aplikace zobrazí upozornění a doporučí jiný formát.
- Export vyžaduje alespoň jeden region v projektu. Prázdný projekt nelze exportovat.

---

## Uložení a otevření projektu

Projekt včetně zvukových dat se ukládá do jediného souboru `.aed` (komprimovaný ZIP s definovanou strukturou).

### Formát souboru `.aed`

| Položka | Obsah |
|---------|-------|
| `project.json` | Metadata projektu — název, verze formátu, seznam regionů (id, název, název souboru, délka, poznámky) |
| `audio/{id}_{název_souboru}` | Originální zvukový soubor každého regionu |

Zvukové soubory se ukládají v jejich původním formátu (WAV, MP3 …) — komprese ZIP používá nejrychlejší úroveň `level: 1`, protože už komprimovaný zvuk je zbytečné komprimovat znovu.

### Uložení projektu

Tlačítkem **💾 Uložit projekt** se vytvoří `.aed` soubor a nabídne se ke stažení. Stavová lišta průběžně ukazuje, kolik regionů už bylo zpracováno. Po dokončení se aktualizuje údaj **Velikost ZIP** v postranním panelu.

### Otevření projektu

Tlačítkem **📂 Otevřít projekt** vyberte `.aed` soubor. Aplikace rozbalí ZIP, načte `project.json`, sestaví regiony a načte k nim zvuková data. Délka projektu se přebírá z metadat, takže není potřeba čekat na dekódování.

### Nový projekt

Tlačítko **⊕ Nový projekt** vytvoří prázdný projekt. Pokud aktuální projekt obsahuje regiony, vyžádá si potvrzení („Opravdu vytvořit nový projekt? Neuložené změny budou ztraceny.").

---

## Klávesové zkratky

Klávesové zkratky **nefungují při psaní do textového pole** (input, textarea, select). Žádný modifikátor (Alt, Ctrl, Cmd) se nepoužívá — kromě Shift+P.

| Klávesa | Funkce |
|---------|--------|
| P | Pauza / pokračovat v přehrávání |
| Shift+P | Přehrát celý projekt od začátku |
| S | Střih — rozdělit region na aktuální pozici |
| J | Přejít na předchozí region |
| K | Přejít na další region |
| X | Přetočit zpět o 5 sekund |
| V | Přetočit vpřed o 5 sekund |
| I | Přetočit zpět o 1 minutu |
| O | Přetočit vpřed o 1 minutu |
| C | Ohlásit pozici a aktuální region (pro odečítače obrazovky) |
| ? | Zobrazit nápovědu klávesových zkratek |
| Esc | Zavřít otevřený dialog |

### Ohlášení pozice (klávesa C)

Klávesa **C** odešle do oblasti `aria-live` hlášení ve tvaru:

> Pozice {pozice}, region {číslo}: {název}, {pozice uvnitř regionu} z {délka regionu}

Pokud aktuální pozice neleží v žádném regionu, hlášení je `Pozice {pozice}, mimo region`. Slouží především pro nevidomé uživatele používající čtečku obrazovky.

### Pohyb mezi regiony (J / K)

Klávesy **J** a **K** přepnou pozici přehrávání přímo na začátek předchozího/následujícího regionu. Pokud je přehrávání aktivní, restartuje se z nové pozice; pokud je zastaveno, jen se aktualizuje displej. Karta cílového regionu se ve stránce automaticky zobrazí (scroll).

---

## Přístupnost

Nástroj je navržen s důrazem na přístupnost:

- **Sémantické HTML** — `<header>`, `<main>`, `<aside>`, `<footer>`, `<article>`, `<dialog>`
- **Skip-link** „Přejít na obsah" pro klávesnicovou navigaci
- **Oblast `aria-live`** s identifikátorem `sr-announce` pro hlášení čtečkám obrazovky
- **Atributy `aria-label`, `aria-pressed`, `aria-modal`** u tlačítek a dialogů
- **Plná ovladatelnost z klávesnice** — všechny funkce jsou dostupné bez myši
- **Ohlášení pozice (klávesa C)** speciálně navržené pro nevidomé editory
- **Stavová lišta** s `aria-live="polite"` informuje o průběhu operací

---

## Technické informace

### Implementace

- **Web Audio API** — dekódování a přehrávání zvuku, sestavování společného bufferu pro export
- **MediaRecorder API** — kódování do OGG a M4A přímo prohlížečem
- **lamejs** (CDN) — vestavěný kodek pro MP3
- **JSZip** (CDN) — čtení a zápis souborů `.aed`
- **Embedded i18n** — české a anglické texty jsou součástí HTML, nepotřebují externí soubory (CORS-safe pro lokální spuštění)

### Architektura projektu v paměti

Projekt je v paměti uložen jako objekt:

```
project = {
  name: "Název projektu",
  regions: [
    { id, name, fileName, file/audioData, duration, notes, startTime, endTime },
    …
  ]
}
```

Časy `startTime` a `endTime` se pokaždé spočítají z délek regionů (`computeOffsets`).

### Uložení dat

Data **nejsou** ukládána v `localStorage` — projekt existuje pouze v paměti záložky a v ručně staženém `.aed` souboru. Při zavření záložky bez uložení se data ztratí.

### Kompatibilita prohlížečů

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Po prvním načtení (a stažení knihoven z CDN) může fungovat i offline. Při uloženém HTML souboru offline plně funguje, pouze export do M4A/AAC závisí na podpoře `MediaRecorder` daného prohlížeče.

### Bezpečnost dat

Žádná zvuková data ani metadata projektu se nikam neodesílají — vše se zpracovává lokálně v prohlížeči. Externě se stahují pouze knihovny `jszip` a `lamejs` z veřejného CDN při prvním načtení stránky.

---

*Dokumentace odpovídá stavu aplikace AudioEdit ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
