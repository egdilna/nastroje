# Editor TIN — uživatelská příručka

Webový editor souborů **TIN** (Target Instruction Notation) — JSON formátu, který popisuje, co má AI model pro danou roli nebo úlohu dělat, co dělat nemá, s jakými materiály má pracovat a jak má vypadat výstup. Z rozepsaného TIN umí editor vygenerovat hotový systémový prompt v Markdownu.

- **Online verze**: <https://nastroje.egdilna.cz/tineditor>
- **Zdrojový kód (open source)**: <https://github.com/egdilna/nastroje/blob/main/tineditor>
- **Specifikace formátu TIN**: [česky](tin-spec-cs.md) · [anglicky](tin-spec.md) · [JSON Schema](tin-schema.json)
- **English guide**: [docs-en.md](docs-en.md)

Editor je jediný soubor `index.html`, nic se neinstaluje a data nikam neodcházejí — vše běží v prohlížeči. Ke spuštění je potřeba připojení k internetu (knihovny Tailwind, Alpine.js a ikony Lucide se načítají z CDN).

> **Důležité:** editor si rozpracovaný TIN **nikam automaticky neukládá**. Po zavření nebo obnovení stránky začínáte s prázdným dokumentem. Průběžně proto ukládejte tlačítkem **Exportovat JSON** (nebo **Kopírovat**).

## Jazyk rozhraní

V hlavičce je přepínač **CS / EN**. Přepíná všechny texty rozhraní — popisky, tlačítka, nápovědy po najetí myší, hlášky i potvrzovací dotazy. Volba se pamatuje v prohlížeči; při první návštěvě se jazyk zvolí podle nastavení prohlížeče (čeština a slovenština → CS, jinak EN).

Jazyk rozhraní **nemění data**. Klíče a hodnoty v JSON (například typy instrukcí `do`, `dont`, `note`) zůstávají podle specifikace anglicky.

## Hlavička — přehled tlačítek

| Tlačítko | Co dělá |
|---|---|
| **CS / EN** | Přepnutí jazyka rozhraní. |
| **Minifikovat** | Když je zaškrtnuto, *Kopírovat* a *Exportovat JSON* vydají JSON bez odsazení (menší soubor). Jinak formátovaný JSON s odsazením 2 mezery. |
| **Importovat** | Načte TIN ze souboru `.json` na disku. |
| **Vložit** | Načte TIN JSON ze schránky. Prohlížeč se může zeptat na povolení přístupu ke schránce. |
| **Kopírovat** | Zkopíruje aktuální TIN JSON do schránky. |
| **Exportovat JSON** | Stáhne TIN jako soubor `<id>.tin.json` (bez vyplněného ID `instruction.tin.json`). |
| **Prompt (MD)** | Vygeneruje systémový prompt v Markdownu a otevře ho v okně. |
| **Nápověda** (ikona otazníku) | Otevře tuto příručku v jazyce rozhraní. |

## Postup práce

1. Vyplňte **Metadata** (aspoň ID, název, jazyk a verzi).
2. Popište **Kontext** — na co se TIN vztahuje a na co ne.
3. Rozepište **Sekce instrukcí**: co dělat, co nedělat, poznámky.
4. Podle potřeby přidejte **Odkazované soubory** a popište **Očekávaný výstup**.
5. Uložte JSON (**Exportovat JSON**) a případně vygenerujte **Prompt (MD)**.

## Metadata

| Pole | Význam | Pole v JSON |
|---|---|---|
| **ID (reverzní DNS nebo UUID)** * | Stálý identifikátor TIN, např. `cz.firma.auditor-smluv`. Použije se i jako název stahovaných souborů. | `metadata.id` |
| **Čitelný název** * | Krátký název role nebo úlohy. V promptu tvoří hlavní nadpis. | `metadata.name` |
| **Jazyk (ISO 639-1)** * | Jazyk **obsahu** TIN, např. `cs`, `en`, `en-US`. Řídí i jazyk nadpisů v generovaném promptu. Nový dokument ho dostane předvyplněný podle jazyka rozhraní. | `metadata.lang` |
| **Verze (SemVer)** * | Verze obsahu ve tvaru `1.0.0`. | `metadata.version` |
| **Účel** | Delší vysvětlení, k čemu TIN slouží. V promptu je hned pod nadpisem. | `metadata.purpose` |

Hvězdička označuje pole, která specifikace vyžaduje. Editor jejich vyplnění nevynucuje — viz [Platnost podle schématu](#platnost-podle-schématu).

Pole `metadata.type` má v novém dokumentu hodnotu `role`; v editoru se nezobrazuje, ale při importu se zachová hodnota ze souboru.

## Kontext

- **Rozsah** (`context.scope`) — na co se TIN vztahuje.
- **Mimo rozsah** (`context.out_of_scope`) — co výslovně nepokrývá.

## Sekce instrukcí

Jádro TIN. Nový dokument začíná jednou prázdnou sekcí; další přidáte tlačítkem **+ Přidat sekci nejvyšší úrovně**.

Každá sekce má:

- **Název sekce** (tučné pole vlevo nahoře),
- **ID sekce** (šedé pole vedle názvu) — generuje se automaticky (`sec-xxxxx`), můžete ho přepsat na čitelnější (`tón`, `zdroje`…). Musí být v rámci TIN jedinečné.
- ikonu **koše** — smaže sekci včetně všech instrukcí a podoblastí (editor se nejdřív zeptá).

### Instrukce

Tlačítko **+ Instrukce** přidá řádek s výběrem typu a textem:

| Typ v rozhraní | Hodnota v JSON | Význam | Barva okraje |
|---|---|---|---|
| **DĚLEJ** / DO | `do` | Co model dělat má. | zelená |
| **NEDĚLEJ** / DON'T | `dont` | Co model dělat nesmí. | červená |
| **POZNÁMKA** / NOTE | `note` | Kontext, vysvětlení, upozornění. | modrá |

Text instrukce může obsahovat Markdown. Křížek vpravo instrukci odstraní (bez potvrzení).

### Podoblasti

Tlačítko **+ Podoblast** přidá do sekce vnořenou podsekci (`areas`). Podoblast má název a **kroky**, které přidáte tlačítkem **+ Přidat krok**.

Omezení podoblastí v editoru:

- nový krok má vždy typ **DĚLEJ** (`do`); typ ukazuje barevný proužek vlevo, ale v editoru ho nelze změnit — jiný typ lze nastavit jen úpravou JSON a následným importem,
- jednotlivý krok nelze smazat (jen vymazat jeho text); celou podoblast smaže ikona koše — **bez potvrzení**,
- podoblasti se v editoru zobrazují jen do druhé úrovně. Hlubší vnoření (které formát dovoluje) se při importu zachová a projeví se v promptu, jen ho v editoru neuvidíte.

## Odkazované soubory

Materiály, se kterými má model pracovat. Tlačítko **+ Přidat soubor** přidá kartu s poli:

| Pole | Význam | Pole v JSON |
|---|---|---|
| **ID souboru** | Identifikátor, předvyplní se `file-1`, `file-2`… | `id` |
| **URI / cesta** | Relativní cesta nebo URL, např. `./docs/smernice.md`. | `uri` |
| **Co to je (autorita)** | Jak soubor chápat — co je zač a jakou má váhu. | `understand` |
| **Pokyny k použití** | Co si z něj vzít a jak ho použít. | `use` |

Ikona koše kartu odstraní (bez potvrzení). Volitelná pole `scope` (která část souboru je důležitá) a `ignore` (co přeskočit) editor needituje, ale pokud jsou v importovaném souboru, zachová je a vypíše do promptu.

## Očekávaný výstup

- **Popis** (`output.description`) — formát, tón, délka odpovědi.
- **Jazyk výstupu (MIME)** (`output.language`) — MIME-like označení, např. `text/markdown`, `text/czech`, `application/json`.

## Generovaný systémový prompt

Tlačítko **Prompt (MD)** otevře okno s promptem složeným z TIN. Okno zavřete tlačítkem **Zavřít**, křížkem nebo klávesou **Esc**. Prompt můžete **Kopírovat do schránky** nebo **Stáhnout .md** (soubor `<id>.prompt.md`).

Struktura promptu:

1. `# Role: <název>`, pod ním účel a řádek s ID, verzí a jazykem.
2. **Rozsah a hranice** — rozsah, mimo rozsah a výčet všech instrukcí typu **NEDĚLEJ** jako *výslovné zákazy*.
3. **Aktivní pravidla** — všechny instrukce typu **DĚLEJ**.
4. **Kontext a poznámky** — případné předpoklady (`context.assumptions`, jen z importu) a všechny instrukce typu **POZNÁMKA**.
5. **Odkazované materiály** — pro každý soubor ID, cesta, „co to je“, „jak použít“, případně „kde hledat“ a „co ignorovat“.
6. **Formát výstupu** — popis a jazyk výstupu.
7. Patička s verzí formátu TIN, ID a verzí.

Instrukce se do promptu sbírají **ze všech sekcí i podoblastí v pořadí, jak jdou za sebou**, a třídí se jen podle typu — **názvy sekcí se do promptu nepřenášejí**. Prázdné instrukce se vynechají, stejně jako oddíly, pro které nejsou data (kromě formátu výstupu).

**Jazyk nadpisů promptu** se řídí polem *Jazyk* v metadatech, ne jazykem rozhraní: `cs…` → česky, `en…` → anglicky, jiný jazyk → podle rozhraní. Obsah (vaše texty) se nepřekládá.

## Import, vložení a jejich chování

**Importovat** i **Vložit** načtou JSON a sloučí ho s aktuálním dokumentem **na nejvyšší úrovni**: každý klíč, který v načteném JSON je (`metadata`, `context`, `sections`, `files`, `output`…), **celý nahradí** ten aktuální; klíče, které v souboru chybí, zůstanou z aktuálního dokumentu. Pokud tedy chcete začít načtením cizího TIN „načisto“, obnovte předtím stránku.

Když soubor nebo schránka neobsahuje platný JSON, editor to oznámí a dokument nezmění. Obsah se proti schématu nekontroluje.

## Platnost podle schématu

Editor dovolí uložit i neúplný TIN. Aby soubor prošel validací proti [`tin-schema.json`](tin-schema.json), musí platit zejména:

- vyplněné `metadata.id`, `name`, `lang`, `version`,
- `lang` ve tvaru `cs` nebo `en-US` (malá písmena, případně pomlčka a region velkými písmeny),
- `version` ve tvaru SemVer (`1.0.0`, `2.1.0-beta.1`),
- aspoň jedna sekce; každá sekce i podoblast má neprázdný název (`title`),
- žádná instrukce nemá prázdný text,
- každý odkazovaný soubor má vyplněné všechna čtyři pole (`id`, `uri`, `understand`, `use`).

Jak validovat (příklad v Pythonu) popisuje [specifikace](tin-spec-cs.md#validace).

## Klávesové zkratky

| Klávesa | Akce |
|---|---|
| `Esc` | Zavře okno s promptem. |

## Časté otázky

**Kde jsou moje data?** Jen v otevřené stránce. Editor nic neukládá do prohlížeče ani na server — trvale je máte jen v exportovaném souboru `.tin.json`.

**Proč se neukázal obsah schránky po kliknutí na Vložit?** Prohlížeč přístup ke schránce zamítl. Povolte ho v nastavení stránky, nebo použijte **Importovat** se souborem.

**Jak udělat jazykovou mutaci TIN?** Podle specifikace je jeden TIN v jednom jazyce. Uložte kopii se stejným vzorem ID, změňte *Jazyk* a přeložte texty.

**Proč jsou v promptu anglické nadpisy, i když mám české rozhraní?** Nadpisy se řídí polem *Jazyk* v metadatech. Nastavte ho na `cs`.
