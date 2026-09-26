# TTS Editor — korektorský předčítač textů přes ElevenLabs

**Online verze nástroje:** [https://egdilna.github.io/nastroje/ttsedit](https://egdilna.github.io/nastroje/ttsedit)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#ttsedit](https://egdilna.github.io/nastroje/#ttsedit)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez instalace serveru. Pro syntézu hlasu vyžaduje připojení k internetu a vlastní API klíč služby ElevenLabs.

---

## Přehled funkcí

**TTS Editor** je webový nástroj pro převod textu na řeč (Text-to-Speech) s využitím cloudové služby [ElevenLabs](https://elevenlabs.io/) nebo hlasů **Google Chirp 3 HD** z Google Cloud Text-to-Speech. Slouží k pohodlnému korektorskému předčítání delších textů — text se rozdělí na menší úseky (chunky), pro každý se vygeneruje audio a výsledek lze poslechnout, stáhnout po částech nebo spojit do jednoho souboru WAV/MP3.

### Klíčové funkce

- **Rozdělení textu na chunky** — automatické dělení vloženého textu podle počtu slov, nebo přidání celého textu jako jeden chunk
- **Editace chunků** — úprava textu, přesouvání, slučování s předchozím, mazání a přidávání nových chunků
- **Rozdělení klávesou Enter** — Enter v textu chunku rozdělí chunk v místě kurzoru na dva samostatné chunky
- **Per-chunk výběr hlasu** — pro každý chunk lze zvolit vlastní hlas, nebo použít globálně nastavený hlas
- **Generování TTS** — syntéza hlasu jednoho chunku nebo dávkové generování všech chunků
- **Přehrávání** — přehrání jednoho chunku, přehrání všech chunků za sebou, ukázka vybraného hlasu
- **Stažení audia** — jednotlivé MP3 soubory, ZIP archiv všech MP3, spojené WAV nebo spojené MP3
- **Označení jako Hotovo** — zaškrtnutí chunků, které jsou zkontrolované a nemají se dále editovat
- **Export/import projektu** — uložení a načtení projektu ve formátu JSON (texty a hlasy chunků)
- **Automatické ukládání** — projekt, vybraný hlas i API klíč se ukládají v prohlížeči (localStorage)
- **Statistiky** — počet chunků, celkový počet znaků a souhrnná délka audia
- **Dvě služby** — v každém projektu lze zvolit ElevenLabs, nebo Google Chirp 3 HD; volba se ukládá do projektu
- **Správa mých hlasů** — přehled, filtrování, přidávání z knihovny sdílených hlasů a odebírání hlasů účtu ElevenLabs (i hromadně)
- **Přístupnost** — semantické HTML, ARIA atributy, ovladatelnost klávesnicí, oznamování stavů pro čtečky obrazovky, skip-link na začátku stránky

### Rozložení aplikace

Aplikace má jednostránkové rozložení:

| Oblast | Obsah |
|--------|-------|
| **Záhlaví** | Název, tlačítka `⚙ Nastavení` a `🎙 Správa mých hlasů`, výběr globálního hlasu, tlačítko `▶` pro ukázku hlasu |
| **Panel nastavení** | Skryté pole pro API klíč, tlačítka `Uložit klíč` a `Načíst hlasy` |
| **Stavový řádek** | Průběh akcí, chyby a potvrzení (informace oranžově, úspěch zeleně, chyba červeně) |
| **Lišta nástrojů** | Globální akce nad celým projektem (přidat, generovat vše, přehrát vše, export, stažení atd.) |
| **Vstupní pole** | Textové pole pro vložení a rozdělení textu |
| **Seznam chunků** | Vlastní pracovní plocha — jednotlivé úseky s ovládáním a přehrávačem |
| **Výstupní oblast** | Spojený text všech chunků, tlačítka `Spojit chunky`, `Kopírovat`, `Smazat vše` |

---

## Nastavení API klíče

Pro generování hlasu je nutný vlastní API klíč ze služby [ElevenLabs](https://elevenlabs.io/). Postup:

1. Klikněte na tlačítko **⚙ Nastavení** v záhlaví — rozbalí se panel s polem pro klíč.
2. Do pole **API klíč ElevenLabs** vložte klíč ze svého účtu (začíná typicky `sk-…`).
3. Klikněte na **Uložit klíč**. Klíč se uloží v `localStorage` prohlížeče.
4. Klikněte na **Načíst hlasy** — z účtu se stáhne seznam dostupných hlasů a naplní se rozbalovací nabídka.

API klíč zůstává jen ve vašem prohlížeči. Neodesílá se nikam kromě samotného API ElevenLabs při volání.

### Služba projektu: ElevenLabs, nebo Google Chirp 3 HD

V záhlaví je výběr **Služba**. Určuje, přes kterou službu se v tomto projektu generuje řeč; volba se ukládá do projektu (v prohlížeči i do exportovaného JSON, pole `provider`). Starší projekty bez tohoto pole se otevřou jako ElevenLabs.

Pro Google:

1. V Google Cloud konzoli zapněte v projektu **Cloud Text-to-Speech API** a vytvořte **API klíč** (doporučeno omezit ho jen na toto API a na adresu stránky).
2. V **⚙ Nastavení** vložte klíč do pole **API klíč Google Cloud (Text-to-Speech)** a stiskněte **Uložit klíče** — oba klíče se ukládají stejně, jen v prohlížeči.
3. Ve výběru **Služba** zvolte **Google Chirp 3 HD**. Hlasy se načtou samy (jinak tlačítkem **Načíst hlasy vybrané služby**).
4. Vedle služby se objeví výběr **Jazyk** (výchozí čeština) a výběr hlasu nabízí jen hlasy **Chirp 3 HD** daného jazyka.

Všechno ostatní — generování chunku i všech chunků, per-chunk hlas, ukázka ▶, přehrávání, ZIP, spojené WAV i MP3 — funguje stejně jako u ElevenLabs. Každá služba si pamatuje svůj globální hlas. Hlas chunku zvolený v druhé službě zůstane uložený, ale dokud je projekt přepnutý jinam, chunk mluví globálním hlasem. Už vygenerované audio se přepnutím služby nemaže.

Omezení Googlu: jeden požadavek smí mít nejvýš 5000 bajtů textu (zhruba 2500–5000 znaků češtiny); delší chunk aplikace odmítne s výzvou k rozdělení. Chirp 3 HD neumí SSML, posílá se prostý text. **Správa mých hlasů** se týká jen ElevenLabs.

### Výběr globálního hlasu

Po načtení hlasů zvolte v rozbalovacím seznamu **Hlas** v záhlaví požadovaný hlas. Tento hlas se použije všude, kde chunk nemá nastavený vlastní hlas. Tlačítkem **▶** vedle seznamu lze přehrát krátkou ukázku (`„Toto je ukázka vybraného hlasu pro váš TTS editor."`) — zvuk se nikam neuloží.

Vybraný hlas se ukládá do `localStorage` a po obnovení stránky se přednastaví. Při generování se používá model **`eleven_multilingual_v2`** s nastavením `stability: 0.5` a `similarity_boost: 0.75`.

### Per-chunk výběr hlasu

V každém chunku je vlastní pole **Hlas**. Nabídka je rozdělená do skupin:

- **— globální (název) —** — použije se aktuálně zvolený globální hlas ze záhlaví (výchozí, `voiceId = null`)
- **Použité v projektu** — hlasy, které jsou už použité v některém chunku (usnadňuje míchání dvou–tří hlasů v jednom projektu)
- **Ostatní hlasy** — zbývající hlasy dostupné na účtu

Změna hlasu v jednom chunku automaticky přeuspořádá skupiny „Použité v projektu" ve všech ostatních chunk-selektech. Volba hlasu se ukládá do projektu a přenáší se i při exportu/importu JSON.

---

## Zpracování textu (chunky)

### Vložení a rozdělení textu

V sekci **Vložit text ke zpracování** je vstupní textové pole. Sem vložte text ze schránky nebo napište přímo.

| Tlačítko / pole | Funkce |
|------------------|--------|
| **Rozdělit a přidat** | Rozdělí text podle nastaveného počtu slov a přidá jednotlivé úseky jako nové chunky. Vstupní pole se vyprázdní. |
| **📋 Vložit ze schránky** | Vloží obsah systémové schránky do vstupního pole. |
| **Velikost chunku (slova)** | Číselné pole pro přibližný počet slov na jeden chunk (rozsah 5–500, výchozí 50, krok 5). |
| **Přidat jako jeden chunk** | Přidá celý text jako jediný chunk bez rozdělení. |

Rozdělení používá jednoduché dělení podle bílých znaků. Hodí se pro dlouhé texty, kde chcete kratší jednotky pro pohodlnější přehrávání i levnější opětovné generování po opravě.

### Statistiky nad seznamem

V záhlaví seznamu chunků se zobrazují souhrnné údaje:

- Počet chunků (jednotky/málo/mnoho — `chunk` / `chunky` / `chunků`)
- Celkový počet znaků (`N znaků celkem`)
- Souhrnná délka vygenerovaného audia (`/ M:SS min audio`) — pouze pokud existuje

### Záhlaví chunku

Každý chunk má kompaktní záhlaví s těmito prvky:

| Prvek | Význam |
|-------|--------|
| `#1` | Pořadové číslo chunku |
| `N zn.` | Počet znaků textu chunku (aktualizuje se během psaní) |
| `M:SS min` | Délka vygenerovaného audia (jen pokud existuje) |
| **▷ Přehrát** | Přehraje uložené audio (neaktivní, dokud chunk audio nemá) |
| **✕ Smazat** | Smaže chunk (s potvrzením) |
| Stavový text | `✓ audio OK`, `▶ přehrávám`, `Generuji…`, `✗ chyba` nebo `✓ audio (text změněn)` |

### Tělo chunku

V těle chunku je:

- Zaškrtávátko **Hotovo** — přepne chunk do režimu pouze pro čtení
- Řádek **Hlas** — per-chunk výběr hlasu (viz sekce Nastavení API klíče)
- Textové pole pro úpravu textu (skryje se v režimu Hotovo)
- Tlačítko **▶ Generovat a přehrát** — vygeneruje audio pomocí TTS a hned ho přehraje; výsledek se uloží ke chunku
- Akce nad chunkem:

| Tlačítko | Funkce |
|----------|--------|
| **+ Za** | Přidá nový prázdný chunk hned za tento |
| **↑ Sloučit s předchozím** | Spojí text s předchozím chunkem (audio obou se zahodí) |
| **▲ Nahoru** | Posune chunk o pozici výše |
| **▼ Dolů** | Posune chunk o pozici níže |

### Přehrávač

Pokud chunk obsahuje vygenerované audio, zobrazí se pod tělem:

- Vestavěný HTML5 přehrávač s ovládáním
- Tlačítko **↓ Stáhnout audio** — stáhne MP3 soubor s názvem `chunk-NNN.mp3` (číslo doplněné nulami)

### Vizuální stavy chunku

| Stav | Vzhled |
|------|--------|
| Bez audia | Výchozí (šedý rámeček) |
| S audiem | Levý okraj tmavě zlatě |
| Přehrávaný | Zelený rámeček, tmavě zelené pozadí |
| Hotovo | Levý okraj zeleně, ztmavlé zelené záhlaví, text je statický (needitovatelný) |

### Enter v textu chunku

V editovaném textu chunku má klávesa **Enter** (bez Shift) speciální chování: rozdělí chunk v místě kurzoru — text před kurzorem zůstane v původním chunku, text za kurzorem se přesune do nového chunku vzniklého hned za ním. Fokus se přenese na nový chunk. Pro běžný nový řádek v rámci jednoho chunku použijte **Shift+Enter**.

### Označení jako Hotovo

Zaškrtnutí **Hotovo** převede chunk do režimu pouze pro čtení — text se zobrazuje jako statický odstavec a skryjí se řádek výběru hlasu, tlačítko generování i akce. Přehrávač uloženého audia zůstává funkční. Odškrtnutím lze chunk znovu otevřít k editaci. Stav Hotovo se ukládá s projektem.

### Stav „audio (text změněn)"

Pokud chunk už audio měl a poté byl jeho text upraven, stav se změní na `✓ audio (text změněn)` — audio zůstane uložené, ale neodpovídá aktuálnímu textu. Pro aktualizaci klikněte znovu na **▶ Generovat a přehrát**.

---

## Generování audia

### Generování jednoho chunku

V každém chunku je tlačítko **▶ Generovat a přehrát**. Použije se hlas nastavený u chunku, jinak globální hlas ze záhlaví. Po vygenerování se audio automaticky přehraje a uloží ke chunku (i s délkou audia zobrazenou v záhlaví).

### Generování všech chunků

Tlačítko **▶▶ Generovat vše** v liště nástrojů postupně vygeneruje audio pro všechny chunky s neprázdným textem. Průběh se zobrazuje ve stavovém řádku (`Generuji chunk N / M…`). Generování lze kdykoliv přerušit tlačítkem **■ Zastavit**.

### Přehrávání všech chunků

Tlačítko **▶ Přehrát vše** postupně přehraje všechny chunky, které už mají vygenerované audio. Mezi chunky čeká na dokončení předchozího přehrávání. Přerušení tlačítkem **■ Zastavit**.

### Souhrn tlačítek v liště

| Tlačítko | Funkce |
|----------|--------|
| **+ Přidat chunk** | Přidá prázdný chunk na konec seznamu |
| **▶▶ Generovat vše** | Postupně vygeneruje audio pro všechny neprázdné chunky |
| **▶ Přehrát vše** | Přehraje za sebou všechny chunky s audiem |
| **■ Zastavit** | Zastaví probíhající generování nebo přehrávání |
| **✕ Smazat všechno audio** | Odstraní vygenerované audio ze všech chunků (texty zůstanou, s potvrzením) |
| **↓ Exportovat projekt (JSON)** | Stáhne projekt jako soubor `tts-projekt-YYYY-MM-DD.json` |
| **↑ Importovat projekt (JSON)** | Načte projekt z JSON souboru (stávající chunky budou po potvrzení nahrazeny) |
| **↓ Stáhnout všechna MP3 (ZIP)** | Zabalí všechna vygenerovaná MP3 do ZIP archivu |
| **↓ Spojit a stáhnout (WAV)** | Spojí všechna audia do jednoho souboru WAV (16-bit PCM) |
| **↓ Spojit a stáhnout (MP3)** | Spojí všechna audia do jednoho souboru MP3 (128 kbps, lamejs) |

---

## Stažení

### Jednotlivé MP3 chunky

V přehrávači u každého chunku je tlačítko **↓ Stáhnout audio**. Soubor se uloží jako `chunk-NNN.mp3`, kde `NNN` je pořadí chunku doplněné nulami (např. `chunk-001.mp3`).

### ZIP se všemi MP3

Tlačítko **↓ Stáhnout všechna MP3 (ZIP)** vytvoří ZIP archiv `tts-audio-YYYY-MM-DD.zip` obsahující všechna vygenerovaná MP3. Bez připojení k internetu (JSZip z CDN) tato funkce nefunguje.

### Spojené WAV

Tlačítko **↓ Spojit a stáhnout (WAV)** dekóduje všechna MP3 audia přes Web Audio API, spojí je do jednoho audio bufferu a zakóduje jako 16bitový PCM WAV soubor `tts-spojeno-YYYY-MM-DD.wav`.

- Sampling rate odpovídá prvnímu chunku
- Počet kanálů je maximum z chunků (mono se mixuje do stereo opakováním kanálu)

### Spojené MP3

Tlačítko **↓ Spojit a stáhnout (MP3)** provede totéž jako WAV, ale výsledek zakóduje pomocí knihovny **lamejs** do MP3 souboru `tts-spojeno-YYYY-MM-DD.mp3`.

- Bitrate: **128 kbps**
- Maximální počet kanálů: **2** (stereo)
- Blok pro kódování: **1152 vzorků** (standardní pro lamejs)

### Export projektu (JSON)

Tlačítko **↓ Exportovat projekt (JSON)** uloží projekt s touto strukturou:

```json
{
  "version": 1,
  "exportedAt": "2026-08-16T12:34:56.789Z",
  "chunks": [
    { "id": 1, "text": "Text chunku…", "done": false, "voiceId": null },
    { "id": 2, "text": "Další chunk…", "done": true,  "voiceId": "abc123" }
  ]
}
```

Audio se do JSON neukládá — pouze texty, stav Hotovo a per-chunk `voiceId` (nebo `null` pro globální hlas).

### Import projektu (JSON)

Tlačítko **↑ Importovat projekt (JSON)** otevře dialog pro výběr souboru. Stávající chunky budou po potvrzení nahrazeny obsahem importovaného souboru. Vygenerované audio se importem neobnoví (musí se vygenerovat znovu).

### Spojený výstupní text

Sekce **Výsledný text (spojené chunky)** obsahuje výstupní pole pouze pro čtení a tři tlačítka:

| Tlačítko | Funkce |
|----------|--------|
| **Spojit chunky** | Vyplní výstupní pole texty všech chunků oddělenými prázdným řádkem |
| **📋 Kopírovat** | Zkopíruje obsah výstupního pole do systémové schránky |
| **✕ Smazat vše** | Smaže všechny chunky i výstupní text (s potvrzením) |

Slouží pro převzetí zkontrolovaného textu zpět do nadřazené aplikace (textový editor, redakční systém).

---

## Správa mých hlasů

Tlačítko **🎙 Správa mých hlasů** v záhlaví otevře okno se dvěma záložkami (mezi nimi se přepíná šipkami vlevo/vpravo). Používá stejný API klíč jako zbytek aplikace. Nahoře je stavový řádek, který čtečka obrazovky průběžně ohlašuje, a — pokud to klíč dovolí — obsazenost slotů pro vlastní hlasy podle tarifu („obsazeno 12 z 30, volných 18“).

> ⚠ **Smazání vlastních hlasů je nevratné.** Klonované, navržené a profesionální hlasy, které jste vytvořili, jsou po odebrání trvale pryč a nejde je nijak obnovit. Hlasy přidané z knihovny lze kdykoli přidat znovu. Výchozí hlasy ElevenLabs odebrat nejde.

### Moje hlasy

- Po otevření se načtou **všechny hlasy účtu** (po stránkách po 100, s ukazatelem průběhu).
- Tabulka ukazuje název, kategorii (výchozí, klonovaný, navržený, profesionální, z knihovny), jazyk a popisky, ID hlasu a tlačítka **▶ Ukázka** a **✕ Odebrat**. Vlastní hlasy jsou označeny **⚠ nevratné**.
- Nad tabulkou je okamžité **hledání** (název, popisky, ID; nezáleží na diakritice), **filtr kategorie** a **řazení** podle názvu nebo kategorie.
- **Hromadné odebrání:** zaškrtněte hlasy (nebo „Vybrat všechny zobrazené“) a stiskněte **Odebrat vybrané…**. Potvrzovací okno vypíše hlasy z knihovny zvlášť a vlastní hlasy zvlášť jmenovitě; vlastní hlasy vyžadují navíc zaškrtnutí „Rozumím, že… budou trvale smazány“. Lze také odebrat jen hlasy z knihovny.
- Před odebráním nabízí okno **export seznamu hlasů do JSON** (`voice_id`, `name`, `category`, `z_knihovny`, `public_owner_id`, `original_voice_id`) — podle něj lze omylem odebrané hlasy z knihovny dohledat a přidat zpět. Stejný export je i v liště nad tabulkou.
- Hlasy se odebírají postupně s krátkým odstupem; při překročení limitu rychlosti (HTTP 429) aplikace počká a zkusí to znovu. Na konci se zobrazí **souhrn** s počtem úspěchů, chyb a jejich důvody a přesune se na něj fokus.

### Knihovna sdílených hlasů

- Vyhledávání podle textu, **jazyka (výchozí čeština)**, pohlaví, věku, přízvuku, kategorie a účelu použití; výsledky lze řadit (trendy, nejvíc přidávané, nejvíc používané, nejnovější). Výsledky jsou po 30 na stránku.
- U výsledku je název a popis, jazyk a přízvuk, pohlaví a věk, oblíbenost a ukázka. Hlasy, které už máte, jsou označeny **✓ v mých hlasech** a přidat je nejde.
- **Přidání:** tlačítko **+ Přidat…** (nebo zaškrtnutí více hlasů a **Přidat vybrané…**) otevře okno s editovatelným názvem pro každý hlas, předvyplněným původním jménem. Okno upozorní, pokud vybraných hlasů je víc než volných slotů; při dosažení limitu tarifu se přidávání zastaví se srozumitelnou hláškou.
- Po přidání i odebrání se seznam mých hlasů i výběr hlasu v editoru aktualizuje bez nového načítání.

### Ukázky a klávesnice

Pole **Text ukázky** nad záložkami určuje, co mají hlasy při ▶ Ukázka vyslovit: vlastní text se vygeneruje přes API daným hlasem (čerpá kredit, stejná kombinace hlasu a textu se podruhé negeneruje) a platí i pro tlačítko ▶ v záhlaví; text se pamatuje v prohlížeči (`tts_editor_preview_text`). Prázdné pole = původní ukázka od ElevenLabs. Když hlas z knihovny s vlastním textem vygenerovat nejde, přehraje se jeho původní ukázka.

Všechny ukázky hrají jedním společným přehrávačem — spuštění nové ukázky zastaví předchozí, opětovné stisknutí tlačítka ji zastaví. **Escape** nejdřív ukončí přehrávání ukázky, teprve další Escape zavře okno.

### Chybové hlášky

| Situace | Hláška |
|---|---|
| HTTP 401 | Neplatný API klíč |
| HTTP 403 | Klíč nemá oprávnění — v ElevenLabs povolte klíči přístup k „Voices“ (čtení i zápis) |
| HTTP 429 | Omezení rychlosti — hromadné operace čekají a opakují automaticky |
| Síť | Nepodařilo se spojit s ElevenLabs (výpadek, nebo blokace prohlížečem) |

Technický detail chyby se vypisuje do konzole prohlížeče (API klíč nikdy).

---

## Klávesové zkratky

| Zkratka | Kontext | Akce |
|---------|---------|------|
| **Enter** | v textu chunku | Rozdělí chunk v místě kurzoru na dva chunky |
| **Shift+Enter** | v textu chunku | Běžný nový řádek v rámci jednoho chunku |
| **Escape** | ve Správě mých hlasů | Ukončí přehrávání ukázky; bez přehrávání zavře okno |
| **← / →** | na záložkách Správy hlasů | Přepnutí mezi Moje hlasy a Knihovnou |
| **Tab** | kdekoli | Standardní pohyb fokusu mezi ovládacími prvky |
| **Skip-link** | na začátku stránky | Přeskočit na seznam chunků (zviditelní se při fokusu) |

---

## Technické informace

### Uložení dat v prohlížeči

Data se ukládají v `localStorage` pod těmito klíči:

| Klíč | Obsah |
|------|-------|
| `tts_editor_api_key` | API klíč ElevenLabs |
| `tts_editor_voice_id` | ID naposledy vybraného globálního hlasu ElevenLabs |
| `tts_editor_google_api_key` | API klíč Google Cloud |
| `tts_editor_google_voice_id` | Naposledy vybraný globální hlas Google |
| `tts_editor_google_lang` | Vybraný jazyk hlasů Google |
| `tts_editor_project` | JSON projekt — služba (`provider`) a `id`, `text`, `done`, `voiceId` všech chunků |

Vygenerované audio se v `localStorage` **neukládá** — po obnovení stránky je třeba audio znovu vygenerovat (nebo se pracuje s dříve staženým souborem).

### API ElevenLabs

Aplikace volá tyto endpointy:

| Endpoint | Účel |
|----------|------|
| `GET https://api.elevenlabs.io/v1/voices` | Načtení seznamu dostupných hlasů |
| `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` | Generování audia z textu |
| `GET https://api.elevenlabs.io/v2/voices` | Správa hlasů: všechny hlasy účtu po stránkách (`voice_type=community` k rozlišení hlasů z knihovny) |
| `DELETE https://api.elevenlabs.io/v1/voices/{voice_id}` | Odebrání hlasu |
| `GET https://api.elevenlabs.io/v1/shared-voices` | Vyhledávání v knihovně sdílených hlasů |
| `POST https://api.elevenlabs.io/v1/voices/add/{public_user_id}/{voice_id}` | Přidání hlasu z knihovny (`new_name`) |
| `GET https://api.elevenlabs.io/v1/user/subscription` | Obsazenost slotů (`voice_slots_used`, `voice_limit`) |
| `GET https://texttospeech.googleapis.com/v1/voices` | Google: seznam hlasů (používají se jen `Chirp3-HD`) |
| `POST https://texttospeech.googleapis.com/v1/text:synthesize` | Google: generování MP3 (klíč v hlavičce `X-Goog-Api-Key`) |

Použitý model: **`eleven_multilingual_v2`**. Voice settings: `stability: 0.5`, `similarity_boost: 0.75`.

### Externí závislosti (CDN)

Aplikace načítá z CDN dvě knihovny:

| Knihovna | Verze | K čemu |
|----------|-------|--------|
| **JSZip** | 3.10.1 | Balení MP3 souborů do ZIP archivu |
| **lamejs** | 1.2.1 | Kódování spojeného audia do MP3 |

Bez připojení k internetu tyto dvě funkce nefungují. Generování TTS samozřejmě internet vyžaduje vždy.

### Formát audia

Z API ElevenLabs přicházejí MP3 soubory. Pro spojení do WAV a opětovné kódování do MP3 se používá **Web Audio API** (`AudioContext.decodeAudioData`) — dekódování, mixování kanálů a následné zakódování probíhají zcela v prohlížeči.

### Přístupnost

- Semantické HTML (`<header>`, `<main>`, `<section>`, `<nav>` role)
- ARIA atributy pro dynamické stavy (`aria-expanded`, `aria-live`, `aria-label`, `aria-controls`)
- Živá oblast `aria-live="polite"` ve stavovém řádku pro průběžná hlášení
- Skrytá oblast `aria-live="assertive"` (`#sr-live`) pro důležitá oznámení (přidání chunku, dokončení generování)
- Fokusovatelný **skip-link** na začátku stránky pro přeskočení na seznam chunků
- Plná ovladatelnost klávesnicí

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou:

- `fetch`, `async`/`await`
- `localStorage`
- **Web Audio API** (`AudioContext`)
- `URL.createObjectURL`
- `navigator.clipboard` (pro vkládání ze schránky a kopírování)
- `HTMLDialogElement` (pro případné dialogy)

### Reset projektu

Tlačítko **✕ Smazat vše** v sekci výstupu odstraní všechny chunky a vyprázdní výstupní pole. Aktuální projekt v `localStorage` se přepíše prázdným. Pro úplný reset (včetně API klíče a vybraného hlasu) je třeba ručně smazat odpovídající záznamy z `localStorage` v nástrojích vývojáře prohlížeče.

---

## Typický pracovní postup

1. Otevřete **⚙ Nastavení**, vložte API klíč, klikněte **Uložit klíč** a poté **Načíst hlasy**.
2. V rozbalovacím seznamu **Hlas** vyberte globální hlas a tlačítkem **▶** si poslechněte ukázku.
3. Do vstupního pole vložte text ke zpracování, nastavte velikost chunku a klikněte **Rozdělit a přidat**.
4. Projděte jednotlivé chunky, opravte případné chyby v textu. Pokud chcete pro některý chunk jiný hlas, přenastavte ho v řádku **Hlas** u daného chunku.
5. Klikněte **▶▶ Generovat vše** — postupně se vygeneruje audio pro všechny chunky.
6. Poslechněte si chunky jednotlivě tlačítkem **▷ Přehrát**, nebo vše za sebou tlačítkem **▶ Přehrát vše**.
7. Chunky, které jsou v pořádku, zaškrtněte **Hotovo**. Ostatní opravte a vygenerujte znovu pomocí **▶ Generovat a přehrát**.
8. Po dokončení použijte **↓ Spojit a stáhnout (MP3)** nebo **(WAV)** pro výsledný zvukový soubor.
9. Pro pozdější návrat k projektu použijte **↓ Exportovat projekt (JSON)**.

---

*Dokumentace odpovídá aktuálnímu stavu aplikace TTS Editor. Nástroj je vyvíjen v rámci iniciativy eGdílna.*
