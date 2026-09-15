# CLAUDE.md — Espanso Editor

## Co to je
Jednosouborová aplikace (`index.html`) pro pohodlnou správu souborů se zkratkami pro
[Espanso](https://espanso.org) (`match/*.yml`). Cílem je, aby uživatel nemusel psát YAML
ručně — všechno včetně dynamických proměnných se dá naklikat.

Vedle `index.html` leží jediná externí závislost: **`js-yaml.min.js` (4.1.0, MIT)** uložená
lokálně, aby editor fungoval i bez sítě. Když soubor chybí, HTML si ji zkusí dotáhnout z cdnjs.
Knihovna se používá **jen pro čtení** YAML; zápis má aplikace vlastní.

## Proč vlastní generátor YAML
`jsyaml.dump()` dává pro Espanso nepříjemný výstup (dlouhé jednořádkové texty, uvozovky všude).
Vlastní generátor (`serializujSoubor`, `yamlDvojice`, `yamlSeznam`, `yamlMapa`) dělá tohle:

- víceřádkové texty zapisuje **blokovým skalárem** (`|-`, `|`, `|+` podle počtu koncových
  odřádkování; `|2-`, když první řádek začíná mezerou),
- spouštěče, regex, popisky a cesty k obrázkům dává **vždy do uvozovek** (`KLICE_V_UVOZOVKACH`),
- ostatní řetězce uvozuje jen, když je to potřeba (`YAML_RIZIKOVE`, `YAML_KLICOVA`, `jeCislo`),
- klíče vypisuje v ustáleném pořadí (spouštěč → popisek → náhrada → pole → proměnné → chování).

**Pozor:** výstup se nesmí „uklízet“ regulárními výrazy přes celý soubor (dřívější
`replace(/\n{3,}/g, "\n\n")` mazal prázdné řádky uvnitř blokových skalárů, tedy měnil uživatelův
text). Prázdné řádky se řídí jen tím, co se kam pushne.

## Datový model
`stav` = `{ nazevSouboru, importy[], globalniPromenne[], zkratky[], ostatniKlice{}, vybrana, filtr }`.

Zkratka (`novaZkratka()`) drží typ spouštěče (`jeden` / `vice` / `regex`) a typ náhrady
(`text` / `markdown` / `html` / `obrazek` / `formular`) jako **samostatné přepínače**; do YAML
se z nich teprve odvodí klíč (`trigger` vs. `triggers` vs. `regex`, `replace` vs. `markdown` …).
Díky tomu se dá typ přepnout bez ztráty rozepsaného textu.

**Popisek se nikdy nedoplňuje ze spouštěče.** `label` má smysl jen tehdy, když říká něco navíc:
při načtení se popisek shodný se spouštěčem (`odvozenyPopisek`) zahodí a při zápisu se takový
popisek nevypisuje. Hledání beztak jde přes spouštěč, popisek i text náhrady — v editoru
(`odpovidaFiltru`) i v rozbalovači, obojí musí zůstat souhlasné.

**Mezera na konci spouštěče** (`mezeraNaKonci`, u nových zkratek zapnutá) je fígl z cookbooku
Espansa: spouštěč se do souboru zapíše s mezerou, zkratku tak spustí až mezerník a ta mezera se
spotřebuje místo toho, aby zůstala za vloženým textem. V modelu spouštěče mezeru **nenesou** —
přidává ji až `spousteceProZapis()`, kterou používá zápis YAML, export do HTML verze i kontrola
duplicit. Při načtení se zaškrtne jen tehdy, když mezerou končí *všechny* spouštěče zkratky;
u smíšeného zápisu zůstanou mezery součástí spouštěčů, ať se soubor nepřepíše jinak, než jak byl.
U regulárního výrazu se mezera neřeší.

Neznámé klíče se při načtení uloží do `ostatni` (u zkratky a proměnné) a `ostatniKlice`
(u souboru) a při ukládání se vypíšou zpátky — **round-trip nesmí nic zahodit.**

## Pořadí zkratek
Zkratky se **nikde nedrží v ručním pořadí** — seznam vlevo i zapsaný YAML je řadí abecedně
podle spouštěče (`klicRazeni` + `serazeneZkratky`, `localeCompare` s češtinou; rozepsané zkratky
bez spouštěče jdou na konec). `stav.zkratky` si drží pořadí načtení a nemění se; obě zobrazení
si o pořadí říkají té jedné funkci, takže seznam a soubor nemůžou jít od sebe. Proto tu není
žádné „nahoru/dolů“ — na přednost mezi zkratkami je `priority`.

## Dynamické prvky
Katalog typů proměnných je v `TYPY_PROMENNYCH` — jeden objekt na typ (`date`, `clipboard`,
`echo`, `random`, `shell`, `script`, `match`, `form`), každý s popisem parametrů (`pole`).
Formulář parametrů staví obecná funkce `formularProTyp()`; typy s `extra` (`datum`,
`poleFormulare`) si přidají vlastní UI navíc.

**Nový typ proměnné se přidává jen doplněním položky do `TYPY_PROMENNYCH`** — tlačítko na liště
vkládání, dialog i výpis se z toho odvodí samy (`shrnutiPromenne` je jediné místo, kde je potřeba
dopsat jednořádkové shrnutí).

Vkládání do textu: `sledujKurzor()` si u pole náhrady pamatuje poslední pozici kurzoru,
`vlozDoTextu()` tam vloží značku (`{{jmeno}}`, `[[pole]]`, `$|$`). Po překreslení editoru je
nutné zavolat `zamerNahradu()`, jinak by odkaz na textareu ukazoval do prázdna.

Náhled data (`nahledData`) je vlastní podmnožina strftime — počítá se v prohlížeči jen kvůli
ukázce, Espanso používá chrono. Když se doplní nová značka, patří i do `ZNACKY_DATA`.

## Sdílený kód (`#kod-sdileny`)
Vyhodnocování zkratek **a psací plocha jsou jeden kód pro obě aplikace.** Leží v `index.html`
jako `<script type="text/plain" id="kod-sdileny">`; editor si ho při startu vloží do stránky jako
skript (`nactiSdilenyKod()`), generátor ho vepíše do vygenerovaného souboru místo `%%SDILENE%%`.
Modul se vystaví jako `window.Zkratky` a data si nedrží — bere je přes `ctx`:
`ctx.zkratky()`, `ctx.globalni()`, `ctx.ohlas(t)`, `ctx.stav(t, chyba)`. Vnitřní tvar zkratky je
v editoru i v exportu **schválně stejný**, jinak by adaptér nestačil.

Obsahuje: `naDatum` (strftime), `textNahrady`, `spousteceKPouziti`, `popisSpoustece`,
`potrebnaPole`, `potrebujePrikaz`, `sestav`, `najdiShodu`, `upravVelikost`, `vytvorPlochu`.
**Změna chování proměnných patří sem, ne do jedné z aplikací** — editor i rozbalovač na tohle
jediné místo jen volají (editor má pro jistotu vlastní zálohu `vlastniNahledData`
a `vlastniPotrebujePrikaz`, kdyby se blok nepodařilo spustit).

## Psací plocha
Velká textarea, ve které se zkratky rozbalují při psaní, plus panel zkratek jako odkazy vpravo.
Je v editoru (záložka Psací plocha) i v rozbalovači (záložka Psací plocha) a je to týž kód.

- `najdiShodu()` po každé změně textu porovná text před kurzorem se spouštěči; vyhrává vyšší
  `priority`, pak delší shoda. Regex se převádí na JS (`(?P<` → `(?<`) a kotví se na konec,
  pojmenované skupiny rovnou plní proměnné, takže se na ně plocha neptá.
- Vkládá se přes `document.execCommand("insertText")`, aby fungovalo Ctrl+Z. Vlastní vkládání
  hlídá `probihaVkladani`, jinak by se výsledek mohl rozbalit sám do sebe.
- `$|$` **tady dává smysl** — text se rozdělí a kurzor se postaví na značku.
- Respektuje `word`/`left_word` (hranice vlevo), `propagate_case` a `uppercase_style`.
  `right_word` se nevynucuje: při psaní ještě není jasné, co bude následovat.
- Nefungují `shell`, `script` (prohlížeč je nespustí) ani obrázky — takové zkratky se nerozbalí
  a nejsou ani v panelu.

**Fokus:** dokud uživatel píše, fokus z textarey nesaháme. Přesune se jen tehdy, když si o to
řekne (klik na odkaz) nebo když se zkratka musí doptat — formulář se ukáže pod textareou, fokus
jde na první pole a po vložení (i po zrušení) se vrací do textu na správnou pozici. Každé vložení
se ohlásí přes `ctx.ohlas`.

## Samostatná HTML verze (rozbalovač)
Tlačítko „Vytvořit HTML verzi“ (accesskey `w`) stáhne **jeden soubor** se všemi zkratkami,
hledáním a kopírováním do schránky. Slouží k používání zkratek tam, kde není Espanso — ne
k jejich úpravám.

Šablona je uložená přímo v `index.html` jako `<script type="text/plain" id="sablona-rozbalovac">`,
takže se dá normálně číst a editovat na místě. **Jediné pravidlo: zavírací značka skriptu se
uvnitř šablony píše `<\/script>`** (jinak by blok skončil dřív); generátor ji při skládání
souboru vrátí zpátky. Do šablony se dosazují dvě značky: `%%NAZEV%%` (název sady, HTML-escapovaný)
a `%%DATA%%` (JSON dat; `<` se escapuje na `\u003c`, aby nemohl rozbít blok).

Vyhodnocování si rozbalovač nedělá sám — volá sdílený kód, který mu generátor vepsal do souboru.
Co umí: `date`, `echo`, `random`, `clipboard`, `match` (rekurzivně), `form`, pole formuláře
(`[[pole]]`), pojmenované skupiny regexu, značku kurzoru `$|$` (zahodí se). Na co se ptá
uživatele: pole formulářů, skupiny regexu a obsah schránky (ten se pokusí předvyplnit z
`navigator.clipboard`). Vnořené zkratky mají v klíčích prefix `jmeno>`, pole vnořeného formuláře
`jmeno.pole` — proto se hodnoty drží v ploché mapě `hodnoty`.

**Zkratky, které potřebují `shell` nebo `script`, se do souboru nedávají** (`potrebujePrikaz`,
tranzitivně přes `echo` a `match`) — prohlížeč je spustit neumí a poloprázdný výsledek by byl
horší než chybějící zkratka. Počet vynechaných se hlásí v editoru i v rozbalovači.

## Přístupnost
Je to hlavní důvod existence nástroje, takže platí bez výjimky:
- každý ovládací prvek má `<label for>` (id se předává čtvrtým parametrem `vytvorPole`,
  nikdy se nepřepisuje `vstup.id` až po vytvoření — rozbilo by to vazbu),
- `#stav` (role=status) pro stavy, `#hlaseni` (aria-live) pro krátká hlášení (`ohlas()`),
- dialog má `aria-modal`, past na Tab, Esc a vrací fokus (`otevriDialog` / `zavriDialog`),
- záložky jsou plnohodnotný tablist (šipky, Home/End),
- **seznam zkratek jsou odkazy `<a href="#nadpis-editor">`, ne tlačítka** — položka seznamu, která
  někam vede, je odkaz; kliknutí vybere zkratku a přesune fokus na nadpis editoru, šipky nahoru
  a dolů procházejí seznam,
- po přidání/přesunu/smazání se fokus vrací na smysluplný prvek a akce se ohlásí,
- hlavní akce mají **přístupovou klávesu i klávesovou zkratku**: `accesskey` je na tlačítku
  (`n` přidat, `o` otevřít, `s` uložit, `c` do schránky) spolu s `aria-keyshortcuts` a `title`,
  Ctrl-varianty (Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+Shift+S) obsluhuje jeden `keydown` na dokumentu.
  Obojí je schválně dvojí — Ctrl+N a Ctrl+O si některé prohlížeče berou pro sebe a stránce je
  nepředají. Přístupové klávesy musí zůstat jedinečné a při změně patří i do tabulky v nápovědě.

## HTTPS a stahování
Editor nabízí soubory ke stažení (YAML, HTML verze) a **prohlížeče stahování z nezabezpečeného
spojení blokují**. Proto je v `<head>` krátký skript, který stránku běžící po `http:` přesune na
`https:` — ale až poté, co ověří (`fetch` s `HEAD` a `no-cors`), že HTTPS opravdu odpovídá;
slepé přesměrování by editor znepřístupnilo tam, kde HTTPS není. Místní adresy (`localhost`,
`127.0.0.1`, `file:`) se nepřesměrovávají.

Veškeré stahování jde přes `stahniSoubor()`. Ta v nezabezpečeném kontextu (`window.isSecureContext`)
vrátí text varování, který se připojí ke stavové hlášce — jinak by uživatel jen viděl, že se nic
nestalo. Nové stahování přidávej jen přes ni.

## Pasti
- **Nepřekreslovat editor při každém stisku klávesy** — vstupy mění model přímo, překresluje se
  jen seznam vlevo, náhled zdroje a kontrola (`zmena()`). Celý editor se staví znovu jen tam, kde
  se mění struktura (`prekresliEditor()`, který si pamatuje `id` aktivního prvku).
- `zdrojRucneUpraven` hlídá, že ruční zásah do záložky Zdroj YAML nepřepíše generátor dřív, než
  si ho uživatel vyžádá tlačítkem.
- Ukládání do `localStorage` (`espanso_editor_rozpracovane`) běží při každé změně; načítá se při
  startu, jinak se nabídne ukázková zkratka.
- Pole formuláře s prázdnou definicí se do YAML nevypisují (Espanso si je odvodí z `[[jmeno]]`).
- `multiline: false` se zahazuje jako výchozí hodnota — to je záměr, ne ztráta dat.

## Ověření změny
Vlož do záložky Zdroj YAML soubor se vším (více spouštěčů, regex se skupinou, shell, random,
formulář s `choice`, markdown, obrázek, vnořená zkratka, `global_vars`, `imports`) →
„Použít změny ze zdroje“ → „Obnovit z editoru“ → výsledek musí být sémanticky totožný.
Pak projít všechny zkratky, vložit každý typ proměnné a projít nástroj klávesnicí.
