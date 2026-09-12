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

**Popisek se doplňuje sám:** zkratka bez vlastního `label` ho při zápisu dostane ze spouštěče
(`odvozenyPopisek`) — u více spouštěčů z prvního, u regexu z výrazu. Model si přitom drží popisek
prázdný, takže se dopočítává vždy z aktuálního spouštěče; v editoru to ukazuje placeholder pole
a živě ho spolu s náhledem YAML obnovuje `aktualizujOdvozenePopisky()`.

Neznámé klíče se při načtení uloží do `ostatni` (u zkratky a proměnné) a `ostatniKlice`
(u souboru) a při ukládání se vypíšou zpátky — **round-trip nesmí nic zahodit.**

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

## Přístupnost
Je to hlavní důvod existence nástroje, takže platí bez výjimky:
- každý ovládací prvek má `<label for>` (id se předává čtvrtým parametrem `vytvorPole`,
  nikdy se nepřepisuje `vstup.id` až po vytvoření — rozbilo by to vazbu),
- `#stav` (role=status) pro stavy, `#hlaseni` (aria-live) pro krátká hlášení (`ohlas()`),
- dialog má `aria-modal`, past na Tab, Esc a vrací fokus (`otevriDialog` / `zavriDialog`),
- záložky jsou plnohodnotný tablist (šipky, Home/End), seznam zkratek se prochází šipkami,
- po přidání/přesunu/smazání se fokus vrací na smysluplný prvek a akce se ohlásí.

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
