# TTS Editor — ElevenLabs Proof Reader

**Online verze nástroje:** [https://egdilna.github.io/nastroje/ttsedit](https://egdilna.github.io/nastroje/ttsedit)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#ttsedit](https://egdilna.github.io/nastroje/#ttsedit)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez instalace serveru. Pro syntézu hlasu vyžaduje připojení k internetu a vlastní API klíč služby ElevenLabs.

---

## Přehled funkcí

**TTS Editor** je webový nástroj pro převod textu na řeč (Text-to-Speech) s využitím cloudové služby [ElevenLabs](https://elevenlabs.io/). Slouží k pohodlnému korekturnímu předčítání delších textů — text se rozdělí na menší úseky (chunky), pro každý se vygeneruje audio a výsledek lze poslechnout, stáhnout po částech nebo spojit do jednoho souboru WAV/MP3.

### Klíčové funkce

- **Rozdělení textu na chunky** — automatické dělení vloženého textu podle počtu slov nebo přidání celého textu jako jeden chunk
- **Editace chunků** — úprava textu, přesouvání, slučování s předchozím, mazání a přidávání nových chunků
- **Generování TTS** — syntéza hlasu jednoho chunku nebo dávkové generování všech chunků
- **Přehrávání** — přehrání jednoho chunku, přehrání všech chunků za sebou, ukázka vybraného hlasu
- **Stažení audia** — jednotlivé MP3 soubory, ZIP archiv všech MP3, spojené WAV nebo spojené MP3
- **Označení jako hotové** — zaškrtnutí chunků, které jsou zkontrolované a nemají se dále editovat
- **Export/import projektu** — uložení a načtení projektu ve formátu JSON (text chunků)
- **Automatické ukládání** — projekt a API klíč se ukládají v prohlížeči (localStorage)
- **Statistiky** — počet chunků, celkový počet znaků a souhrnná délka audia

### Přístupnost

Nástroj je navržen s důrazem na přístupnost — semantické HTML, ARIA atributy, plná ovladatelnost klávesnicí, oznamování stavu pro čtečky obrazovky (živá oblast `aria-live`). V hlavičce je odkaz pro přeskočení na seznam chunků.

### Uložení dat

Texty chunků, vybraný hlas a API klíč se ukládají v `localStorage` prohlížeče. Vygenerovaná zvuková data se v `localStorage` neukládají — po obnovení stránky je třeba audio vygenerovat znovu. Texty se neodesílají nikam kromě API ElevenLabs při generování.

---

## Navigace a rozložení

Aplikace má jednostránkové rozložení rozdělené do těchto oblastí:

### Záhlaví

V záhlaví je:

- **Logo / název** — TTS Editor
- **Tlačítko ⚙ Nastavení** — rozbalí/sbalí panel pro zadání API klíče
- **Hlas** — rozbalovací seznam dostupných hlasů, vedle něj tlačítko **▶** pro přehrání ukázky vybraného hlasu

### Panel nastavení

Skrytý panel pod záhlavím, který se otevírá tlačítkem **⚙ Nastavení**. Obsahuje:

- Pole pro zadání **API klíče ElevenLabs**
- Tlačítko **Uložit klíč**
- Tlačítko **Načíst hlasy** — stáhne seznam hlasů dostupných na účtu

### Stavový řádek

Pod panelem nastavení se zobrazuje aktuální stav aplikace (informační hlášky, chyby, potvrzení). Barevně odlišuje typy zpráv: informace (oranžová), úspěch (zelená), chyba (červená).

### Hlavní obsah

Hlavní obsah se skládá z:

1. **Lišty nástrojů** — globální akce nad celým projektem (přidat chunk, generovat vše, přehrát vše, export, stažení audia atd.)
2. **Vstupního pole** — sem se vkládá text k rozdělení a přidání do projektu
3. **Seznamu chunků** — jednotlivé textové úseky s ovládacími prvky a přehrávačem
4. **Výstupní oblasti** — spojený text všech chunků pro zkopírování

---

## Nastavení API klíče a hlasu

### API klíč

Pro generování hlasu je třeba vlastní API klíč ze služby [ElevenLabs](https://elevenlabs.io/). Postup:

1. Klikněte na tlačítko **⚙ Nastavení** v záhlaví.
2. Do pole **API klíč ElevenLabs** vložte klíč ze svého účtu (začíná typicky `sk-…`).
3. Klikněte na **Uložit klíč**. Klíč se uloží v `localStorage` prohlížeče.
4. Klikněte na **Načíst hlasy** — z účtu se stáhne seznam hlasů a naplní se rozbalovací nabídka.

API klíč je vidět pouze ve vašem prohlížeči. Neodesílá se nikam kromě API ElevenLabs.

### Výběr hlasu

Po načtení hlasů zvolte v rozbalovacím seznamu **Hlas** požadovaný hlas. Tlačítkem **▶** vedle seznamu lze přehrát krátkou ukázku, aniž by se vygenerovaný zvuk uložil ke kterémukoli chunku.

Vybraný hlas se ukládá a po obnovení stránky se přednastaví. Při generování se používá model **eleven_multilingual_v2** s nastavením `stability: 0.5` a `similarity_boost: 0.75`.

---

## Vkládání a rozdělení textu

### Vstupní pole

V sekci **Vložit text ke zpracování** je velké textové pole. Sem vložte text ze schránky nebo napište přímo.

| Tlačítko / pole | Funkce |
|------------------|--------|
| **Rozdělit a přidat** | Rozdělí text podle nastaveného počtu slov a přidá jednotlivé úseky jako nové chunky. Vstupní pole se vyprázdní. |
| **📋 Vložit ze schránky** | Vloží obsah systémové schránky do vstupního pole. |
| **Velikost chunku (slova)** | Číselné pole pro přibližný počet slov na jeden chunk (rozsah 5–500, výchozí 50). |
| **Přidat jako jeden chunk** | Přidá celý text jako jediný chunk bez rozdělení. |

Rozdělení používá jednoduché dělení podle bílých znaků. Hodí se pro dlouhé texty, kde chcete kratší jednotky pro pohodlnější přehrávání i levnější opětovné generování po opravě.

---

## Seznam chunků

Seznam chunků je hlavní pracovní plocha. V záhlaví seznamu jsou statistiky:

- Počet chunků (jednotky/málo/mnoho — `chunk`/`chunky`/`chunků`)
- Celkový počet znaků
- Souhrnná délka vygenerovaného audia (pokud existuje)

### Záhlaví chunku

Každý chunk má kompaktní záhlaví s následujícími prvky:

| Prvek | Význam |
|-------|--------|
| `#1` | Pořadové číslo chunku |
| `N zn.` | Počet znaků textu chunku |
| `M:SS min` | Délka vygenerovaného audia (jen pokud existuje) |
| **▷ Přehrát** | Přehraje uložené audio (neaktivní, pokud chunk audio nemá) |
| **✕ Smazat** | Smaže chunk (s potvrzením) |
| Stavový text | `✓ audio OK`, `▶ přehrávám`, `Generuji…`, `✗ chyba` nebo `✓ audio (text změněn)` |

### Tělo chunku

V těle je:

- Zaškrtávátko **Hotovo** — označí chunk jako dokončený (viz níže)
- Textové pole pro úpravu textu chunku (skryje se v režimu Hotovo)
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
- Tlačítko **↓ Stáhnout audio** — stáhne MP3 soubor s názvem `chunk-NNN.mp3`

### Vizuální stavy chunku

- **Bez audia** — výchozí vzhled
- **S audiem** — levý okraj zlatě
- **Přehrávaný** — zelený rámeček, světle zelené pozadí
- **Hotovo** — levý okraj zeleně, ztmavlé zelené záhlaví, text je statický (needitovatelný)

### Klávesa Enter v textu chunku

V editovaném textu chunku má klávesa **Enter** (bez Shift) speciální chování: rozdělí chunk v místě kurzoru — text před kurzorem zůstane v původním chunku, text za kurzorem se přesune do nového chunku za ním. Pro běžný nový řádek v textu použijte **Shift+Enter**.

### Označení jako Hotovo

Zaškrtnutí **Hotovo** převede chunk do režimu pouze pro čtení — text se zobrazuje jako statický odstavec a skryjí se ovládací prvky generování i akcí. Odznačením lze chunk znovu otevřít k editaci. Hotové chunky se ukládají s touto vlastností v projektu.

### Stav „audio (text změněn)"

Pokud chunk už audio měl a poté byl jeho text upraven, stav se změní na `✓ audio (text změněn)` — audio zůstane uložené, ale neodpovídá aktuálnímu textu. Pro aktualizaci klikněte znovu na **Generovat a přehrát**.

---

## Lišta nástrojů

Tlačítka nad seznamem chunků se vztahují na celý projekt.

| Tlačítko | Funkce |
|----------|--------|
| **+ Přidat chunk** | Přidá prázdný chunk na konec seznamu |
| **▶▶ Generovat vše** | Postupně vygeneruje audio pro všechny chunky (přeskočí prázdné) |
| **▶ Přehrát vše** | Přehraje za sebou všechny chunky s audiem |
| **■ Zastavit** | Zastaví probíhající generování nebo přehrávání |
| **✕ Smazat všechno audio** | Odstraní vygenerované audio ze všech chunků (texty zůstanou, s potvrzením) |
| **↓ Exportovat projekt (JSON)** | Stáhne projekt jako JSON soubor `tts-projekt-YYYY-MM-DD.json` |
| **↑ Importovat projekt (JSON)** | Načte projekt z JSON souboru (stávající chunky budou nahrazeny, s potvrzením) |
| **↓ Stáhnout všechna MP3 (ZIP)** | Zabalí všechna vygenerovaná MP3 do ZIP archivu |
| **↓ Spojit a stáhnout (WAV)** | Spojí všechna audia do jednoho souboru WAV (16-bit PCM) |
| **↓ Spojit a stáhnout (MP3)** | Spojí všechna audia do jednoho souboru MP3 (128 kbps, lamejs) |

### Generování všech chunků

Postupně volá API pro každý chunk s neprázdným textem. Generování lze přerušit tlačítkem **■ Zastavit**. Stav generování se zobrazuje ve stavovém řádku (`Generuji chunk N / M…`).

### Přehrávání všech chunků

Přehraje sekvenčně všechny chunky, které už mají vygenerované audio. Mezi chunky čeká na dokončení přehrávání. Přerušení tlačítkem **Zastavit**.

---

## Spojený výstupní text

Pod seznamem chunků je sekce **Výsledný text (spojené chunky)** — výstupní pole pouze pro čtení.

| Tlačítko | Funkce |
|----------|--------|
| **Spojit chunky** | Vyplní výstupní pole texty všech chunků oddělenými prázdným řádkem |
| **📋 Kopírovat** | Zkopíruje obsah výstupního pole do systémové schránky |
| **✕ Smazat vše** | Smaže všechny chunky i výstupní text (s potvrzením) |

Hodí se pro export upraveného textu zpět do nadřazené aplikace (textový editor, web).

---

## Export a import projektu

### Export projektu (JSON)

Tlačítko **↓ Exportovat projekt (JSON)** uloží projekt ve struktuře:

```
{
  "version": 1,
  "exportedAt": "ISO datum",
  "chunks": [{ "id": …, "text": "…", "done": true/false }, …]
}
```

Audio se do JSON neukládá — pouze texty a stav Hotovo.

### Import projektu (JSON)

Tlačítko **↑ Importovat projekt (JSON)** otevře dialog pro výběr souboru. Stávající chunky budou po potvrzení nahrazeny obsahem importovaného souboru. Vygenerované audio se importem neobnoví (musí se vygenerovat znovu).

---

## Stahování audia

### Jednotlivé MP3 chunky

V přehrávači u každého chunku je tlačítko **↓ Stáhnout audio**. Soubor se uloží jako `chunk-NNN.mp3` (s číslem doplněným nulami).

### ZIP se všemi MP3

Tlačítko **↓ Stáhnout všechna MP3 (ZIP)** v hlavní liště vytvoří ZIP archiv obsahující všechna vygenerovaná MP3. Soubor se pojmenuje `tts-audio-YYYY-MM-DD.zip`.

### Spojené WAV

Tlačítko **↓ Spojit a stáhnout (WAV)** dekóduje všechna MP3 audia přes Web Audio API, spojí je do jednoho audio bufferu a zakóduje jako 16bitový PCM WAV soubor `tts-spojeno-YYYY-MM-DD.wav`. Sampling rate odpovídá prvnímu chunku, počet kanálů je maximum z chunků (mono se mixuje do stereo opakováním kanálu).

### Spojené MP3

Tlačítko **↓ Spojit a stáhnout (MP3)** udělá totéž jako WAV, ale výsledek zakóduje pomocí knihovny **lamejs** do MP3 souboru `tts-spojeno-YYYY-MM-DD.mp3` při 128 kbps. Maximální počet kanálů je 2 (stereo).

---

## Klávesové zkratky

| Zkratka | Akce |
|---------|------|
| **Enter** v textu chunku | Rozdělí chunk v místě kurzoru na dva chunky |
| **Shift+Enter** v textu chunku | Běžný nový řádek v rámci chunku |
| **Tab** | Standardní pohyb fokusu mezi ovládacími prvky |
| Skip-link (na začátku stránky) | Přeskočit na seznam chunků (zviditelní se při fokusu) |

---

## Stavy a hlášení

Stavový řádek pod panelem nastavení zobrazuje průběh akcí. Pro čtečky obrazovky je zde živá oblast (`aria-live="polite"`), která hlásí stav. Mimo to existuje skrytá oblast (`aria-live="assertive"`) pro důležitější oznámení (přidání chunku, dokončení generování apod.).

| Typ hlášky | Barva | Příklad |
|------------|-------|---------|
| Informace | oranžová | „Generuji TTS…" |
| Úspěch | zelená | „API klíč uložen.", „Načteno N hlasů." |
| Chyba | červená | „Chyba TTS: …", „Nejprve uložte API klíč." |

---

## Technické informace

### Uložení dat

Texty, vybraný hlas a API klíč se ukládají v `localStorage` pod těmito klíči:

| Klíč | Obsah |
|------|-------|
| `tts_editor_api_key` | API klíč ElevenLabs |
| `tts_editor_voice_id` | ID naposledy vybraného hlasu |
| `tts_editor_project` | JSON projekt — id, text a stav Hotovo všech chunků |

Vygenerované audio se v `localStorage` neukládá. Při obnovení stránky je třeba audio znovu vygenerovat (nebo importovat dříve stažené soubory).

### Závislosti

Aplikace načítá z CDN dvě knihovny:

- **JSZip 3.10.1** — pro stahování ZIP archivu s MP3
- **lamejs 1.2.1** — pro kódování spojeného audia do MP3

Bez připojení k internetu nebudou tyto funkce dostupné. Generování TTS samozřejmě vždy vyžaduje internet.

### API ElevenLabs

Aplikace volá tyto endpointy:

| Endpoint | Účel |
|----------|------|
| `GET https://api.elevenlabs.io/v1/voices` | Seznam dostupných hlasů |
| `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` | Generování audia z textu |

Použitý model: `eleven_multilingual_v2`. Voice settings: `stability: 0.5`, `similarity_boost: 0.75`.

### Formát audia

Z API ElevenLabs přicházejí MP3 soubory. Pro spojení do WAV a opětovné kódování do MP3 se používá Web Audio API (`AudioContext.decodeAudioData`).

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou:

- `fetch`, `async/await`
- `localStorage`
- Web Audio API (`AudioContext`)
- `URL.createObjectURL`
- `navigator.clipboard` (pro vkládání ze schránky a kopírování)

### Reset projektu

Tlačítko **✕ Smazat vše** v sekci výstupu odstraní všechny chunky a vyprázdní výstupní pole. Aktuální projekt v `localStorage` se přepíše prázdným.

Pro úplný reset (včetně API klíče a vybraného hlasu) je třeba ručně smazat odpovídající záznamy z `localStorage` v nástrojích vývojáře prohlížeče.

---

## Typický pracovní postup

1. Otevřete **⚙ Nastavení**, vložte API klíč, klikněte **Uložit klíč** a **Načíst hlasy**.
2. V rozbalovacím seznamu **Hlas** vyberte požadovaný hlas a tlačítkem **▶** si poslechněte ukázku.
3. Do vstupního pole vložte text ke zpracování, nastavte velikost chunku a klikněte **Rozdělit a přidat**.
4. Projděte jednotlivé chunky, opravte případné chyby v textu.
5. Klikněte **▶▶ Generovat vše** — postupně se vygeneruje audio pro všechny chunky.
6. Poslechněte si chunky jednotlivě tlačítkem **▷ Přehrát** nebo vše za sebou tlačítkem **▶ Přehrát vše**.
7. Chunky, které jsou v pořádku, zaškrtněte **Hotovo**. Ostatní opravte a vygenerujte znovu pomocí **▶ Generovat a přehrát**.
8. Po dokončení použijte **↓ Spojit a stáhnout (MP3)** nebo **(WAV)** pro výsledný zvukový soubor.
9. Pro pozdější návrat k projektu použijte **↓ Exportovat projekt (JSON)**.

---

*Dokumentace odpovídá stavu aplikace TTS Editor ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
