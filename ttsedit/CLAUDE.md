# CLAUDE.md — TTS Editor (ElevenLabs Proof Reader)

## Co to je
Jednosouborový nástroj (`index.html`, ~3000 řádků) pro přípravu mluveného slova:
text se rozdělí na **chunky**, ke každému se přes **ElevenLabs API** vygeneruje audio,
uživatel je poslechne, opraví text, znovu vygeneruje a nakonec vše spojí a stáhne
(ZIP jednotlivých MP3, nebo spojený WAV/MP3).

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~18 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Externí závislosti
`jszip` (ZIP se všemi MP3) a `lamejs` (spojený MP3) z cdnjs. Jinak vanilla JS, CSS inline.

## Struktura souboru
Jeden `<script>` členěný bannery — nový kód patří do odpovídající sekce:
`─── STATE / ELEMENTS / SETTINGS PANEL TOGGLE / HELPERS / STATUS / ANNOUNCE / LOCAL STORAGE /
API KEY / ELEVENLABS API / LOAD VOICES / TTS GENERATION / CHUNK MANAGEMENT / RENDER / IMPORT TEXT / PLAY ALL /
GENERATE ALL / CLEAR AUDIO / OUTPUT / EXPORT / IMPORT PROJECT / DOWNLOAD ALL AUDIO (ZIP) /
MERGE ALL AUDIO TO WAV / MERGE ALL AUDIO TO MP3 / SPRÁVA HLASŮ / INIT ───`

## API klíč a perzistence
| Klíč | Obsah |
|---|---|
| `tts_editor_api_key` | **API klíč ElevenLabs** |
| `tts_editor_voice_id` | naposledy vybraný hlas |
| `tts_editor_project` | rozpracovaný projekt (text chunků, ne audio) |

**Klíč zůstává výhradně v prohlížeči uživatele.** Nikdy ho nelogguj, neposílej nikam jinam než
na ElevenLabs API, nedávej do exportovaného JSON projektu ani do URL. Panel s nastavením je
schovaný pod „⚙ Nastavení“ a po otevření přesouvá fokus na první prvek.

## Volání API
Sekce `ELEVENLABS API`: `elevenApi(cesta, {method, params, body})` pro JSON endpointy (klíč ze
`state.apiKey`, české hlášky přes `chybaApiCesky`, detail do konzole) a `elevenApiSOpakovanim`
pro hromadné operace (při 429 čeká a opakuje). Nová JSON volání stav na nich; `generateTTS` vrací
blob a má vlastní `fetch`.

## Správa hlasů (sekce `SPRÁVA HLASŮ`)
Modální `#hlasy-dialog` se záložkami Moje hlasy / Knihovna, stav v objektu `hlasy`.
- Moje hlasy: `/v2/voices` přes všechny stránky; hlasy z knihovny se rozlišují druhým průchodem
  s `voice_type=community` (`hlasy.knihovnaIds`). Když ten selže, **všechny nevýchozí hlasy se
  berou jako vlastní** (přísnější potvrzení) — tuhle bezpečnou výchozí volbu neobracej.
- `druhHlasu()`: `premade` (nenabízet odebrání), `knihovna` (souhrnné potvrzení), `vlastni`
  (jmenovitý výpis + zaškrtnutí souhlasu; smazání je nevratné).
- Po přidání/odebrání se mění lokální `hlasy.moje` a `synchronizovatHlavniHlasy()` přepíše
  `state.voices` i všechny selecty — nic se znovu nenačítá.
- Jeden sdílený přehrávač ukázek (`ukazka`); Escape v dialogu nejdřív zastaví ukázku.
- Hromadné operace sekvenčně s odstupem 350 ms, na konci souhrn s fokusem.

## Datový model
Chunk: `{ id, text, voiceId (volitelný — jinak globální hlas), audio (Blob/URL), done, duration }`.
Stav aplikace je v `state`; projekt se průběžně ukládá do localStorage (`saveProjectToStorage()`).
Export/import projektu je JSON (bez klíče a bez audia).

Pravidla, která musí platit:
- **Změna textu chunku zneplatňuje jeho audio** („Mark audio as stale if text changed“) —
  nikdy nenech u chunku viset audio z jiného textu.
- Sloučení chunků (`mergeWithPrevious`) rovněž smaže audio výsledného chunku.
- Po přidání/sloučení/přesunu se **vrací fokus** na dotčený chunk — zachovej.

## Chunky a hlasy
- `splitTextToChunks(text, wordsPerChunk)` dělí importovaný text po zadaném počtu slov
  (`#chunk-size`); je i varianta „Přidat jako jeden chunk“ a vložení ze schránky.
- Rozdělení chunku v editaci: text před kurzorem zůstane, text za kurzorem jde do nového chunku.
- `sortedVoices()` řadí hlasy tak, že **nejdřív jsou hlasy použité v projektu**, pak abecedně.
  Při změně globálního hlasu se musí přerovnat i všechny chunk-level selecty
  (`populateChunkVoiceSelect`).

## Spojování audia
- **WAV**: dekóduje všechny bloby na `AudioBuffer`, odvodí parametry výsledku, zkopíruje data
  a zakóduje vlastním enkodérem (`encodeWAV`, interleave 16-bit PCM přes `toInt16`).
- **MP3**: dekóduje, spojí do jednoho `Float32Array` na kanál, převede na Int16 a předá lamejs.
- **ZIP**: jednotlivé MP3 tak, jak přišly z API.
Enkodéry jsou ruční — při zásahu ověř výsledek posluchem, ne jen tím, že soubor vznikne.

## Přístupnost
`#sr-live` je live region (`announce()`), `#status-bar`/`setStatus(msg, type)` pro stavy,
skip-link, ovládání klávesnicí, správa fokusu po každé změně seznamu chunků.
Nástroj je česky; texty jsou v kódu natvrdo (nemá i18n vrstvu). Nové UI musí být
dosažitelné klávesnicí a musí ohlásit výsledek akce.

## Pasti
- Generování „vše“ běží sekvenčně a čeká na dokončení přehrání/požadavku — nepřepisuj na
  paralelní volání, ElevenLabs má limity a pořadí je podstatné.
- Přehrávání jednoho chunku musí nejdřív zastavit předchozí (`stopCurrentAudio()`)
  a odstranit stav „playing“ ze všech chunků.
- Délka chunku se zjišťuje až z metadat načteného audia a teprve pak se ukazuje v hlavičce.
- Selhání API (limit, špatný klíč, síť) musí skončit hláškou u konkrétního chunku
  (`setChunkStatus`), ne tichým prázdným audiem.

## Ověření změny
Vlož delší text → rozděl na chunky → nastav klíč a načti hlasy → generuj jeden chunk,
pak vše → uprav text chunku (audio musí zezelenat jako neaktuální) → přehrát vše →
export projektu do JSON a import zpět → stáhnout ZIP, spojený WAV i MP3 → průchod klávesnicí.
