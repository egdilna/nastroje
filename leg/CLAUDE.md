# CLAUDE.md — Legislativní prohlížeč (leg, „legprohlizec“)

## Co to je
Jednosouborová aplikace (`index.html`) pro **osobní práci s vybranými právními předpisy**
nad otevřenými daty e-Sbírky. Nikdy nepracuje s celou Sbírkou: uživatel si postupně buduje
vlastní knihovnu předpisů, řadí je do oblastí, vyznačuje ustanovení do skupin a píše
k nim poznámky. Workspace je po založení prázdný.

Uživatel je nevidomý a pracuje se čtečkou obrazovky — přístupnost je hlavní požadavek,
ne doplněk (viz níže).

Historie změn: `changelog.md` (Keep a Changelog, sémantické verzování, `APP_VERZE` v kódu).

## Zdroj dat — SPARQL e-Sbírky
- Endpoint `https://opendata.eselpoint.gov.cz/sparql`, bez klíče, licence CC BY 4.0.
- **Jen metodou GET.** Hlavičky CORS (`Access-Control-Allow-Origin: *`) server posílá jen
  pro GET/HEAD/OPTIONS; POST z prohlížeče neprojde.
- **Bezpečnostní filtr (WAF) před serverem** vrací 403 na některé texty dotazu, i když
  jsou data jinak dostupná. Ověřeně blokuje dotaz, který v sobě má IRI položky číselníku
  typů fragmentů (`…/cis-esb-typ-fragmentu/položka/Prefix_Title`). Proto se typ fragmentu
  **nefiltruje v dotazu, ale až v aplikaci**. Když přidáváš dotaz, otestuj ho naživo.
  Občas server vrátí i 502 — `sparql()` to zkouší třikrát, 403 neopakuje.
- Slovník: `PREFIX e: <https://slovník.gov.cz/datový/sbírka/pojem/>`.
- Model dat (ověřeno 10/2026):
  - `eli/cz/sb/{rok}/{číslo}` — právní akt: `e:citace-právního-aktu`, `e:má-znění` (všechna),
    `e:má-poslední-znění`, `e:má-vyhlášené-znění` (datum `0000-00-00`).
  - `…/{datum}` — znění (datum = účinnost): `e:má-fragment-znění` → fragmenty.
  - fragment znění `…/{datum}/dokument/norma/cast_1/hlava_3/par_39a/odst_1`:
    `e:citace-označení-fragmentu-znění-právního-aktu` („§ 39a odst. 1“),
    `e:pořadí-fragmentu-znění-právního-aktu` (hex řetězec, lexikograficky = pořadí v dokumentu),
    `e:má-předka`, `e:obsahuje-fragment` → obsah s `e:má-typ-fragmentu` a `e:text-fragmentu` (HTML).
  - odkazy v textu: `<a data-odkaz-id="…">` → `právní-akt-odkaz/{id}` s `e:má-cíl`
    (IRI fragmentu jiného nebo téhož předpisu, případně `eli/eu/…`) a `e:citace-cíle-odkazu`.
    Zdroj odkazu v datech není — jen cíl.
  - Definice pojmů, digitální repliky a související dokumenty jsou v SPARQL jen jako typy
    bez vlastností (zatím nepoužitelné).
- Hlavička předpisu (číslo, druh, datum, název) jsou fragmenty pod `…/dokument/prefix`
  typů `Prefix_Number`, `Prefix_Type`, `Prefix_Date`, `Prefix_Title`.

## Klíč ustanovení
Klíčem fragmentu je **cesta za `/dokument/`** (`norma/cast_1/hlava_3/par_39a/odst_1`).
U strukturovaných ustanovení je stabilní napříč zněními, proto na ní stojí vyznačení,
adresy i kotvy. Nečíslované fragmenty mají klíč typu `…/frag_1241153279`, ten stabilní není.

## Úložiště v GitHubu
Složka workspace (z nastavení nebo z URL) obsahuje:
```
legprohlizec.json                       oblasti, předpisy (metadata), skupiny, vyznačení
predpisy/{rok}-{číslo}/{datum}-{n}.json jedno znění rozdělené na části ≤ ~600 kB
```
Požadavek uživatele: **nic nesmí být velké** — každé znění je v samostatných souborech
a dělí se na části (`MEZ_CASTI`). Část nese `fragmenty` jako pole
`[klíč, klíč rodiče, typ, citace, html]` a `odkazy` jen pro odkazy, které v ní jsou.

Zásady z kořenového `CLAUDE.md` (mez 1 MB, pojistka proti přepsání, historie):
- Čtení `ghCist()` přes Contents API s `Accept: application/vnd.github.raw` (do 100 MB,
  bez base64); záloha přes JSON a `git/blobs/{sha}`.
- Zápis `ghCommit()` vždy přes Git Data API: jeden strom s více soubory (obsah přímo v položce
  stromu, mazání `sha: null`) → commit → `PATCH refs`. Velké stahování se dělí do dávek
  (`GH_DAVKA`). Při kolizi větve (422/409) se jednou opakuje nad novým stavem.
- **Pojistka `wsNacteno`** — dokud se `legprohlizec.json` nepodařilo načíst, nic se neukládá
  a důvod je ve stavovém řádku `#stav-ulozeni`. Chybějící soubor = nic ke ztrátě, smí se založit.
- Historie a obnova verze workspace v Nastavení (`historie()`).
- Token je jen v `localStorage["legprohlizec-nastaveni-v1"]` spolu s repozitářem, větví
  a složkou. Nikdy ho nelogguj, nedávej do URL ani do repozitáře.

## Adresy
Každý pohled i entita má vlastní adresu (`adresa()`, `parametry()`), úložiště je v ní vždy:
`?repo=vlastník/repo&slozka=…&vetev=…` (větev jen mimo `main`) a dále
`pohled` (`prehled|oblast|predpis|ust|vyznacena|skupina|hledat|pridat|nastaveni`),
`oblast`, `predpis` (`rok/číslo`), `ust` (klíč), `zneni` (datum, jen mimo aktuální),
`skupina`, `q`, `rozsah` (`predpis:…`, `oblast:…`), `diakritika`, `poznamky`.
Pohled se dá odvodit (`predpis`+`ust` → detail ustanovení). Odkazy jsou běžné `<a href>`,
klik se zachytí a vykreslí bez načtení stránky (`pushState`/`popstate`); kotvy `#u-…`
v rámci stránky nechává prohlížeči.

## Vykreslení předpisu
`vykreslitStrom()` → `vykreslitUzel()` podle typu fragmentu:
- struktura (`STRUKTURA`: část, hlava, díl, oddíl, §, článek…) → `section` s nadpisem
  H2–H6 podle hloubky; první `Nadpis_pod` se připojí do nadpisu („§ 1 Předmět úpravy“),
- `Odstavec_Dc` → blok, `Pismeno_Lb` a `Bod_Dd` → vnořené `ol` (souvislé běhy do jednoho
  seznamu), `Tabulka`, `Block_Citace` (blockquote), `Virtual_PPC` (poznámky pod čarou),
  `Prefix`/`Postfix`, ostatní obecně.
- HTML textu jde vždy přes whitelist `prevestHtml()`; první `<var>` je označení ustanovení
  a stává se odkazem na detail ustanovení (`oznaceni()`). Přístupný název začíná viditelným
  textem a přidá citaci a stav vyznačení. Vyznačení je i viditelná značka ★ (✎ s poznámkou).
- Odkazy `prevestOdkaz()`: týž předpis → kotva, jiný předpis v knihovně → detail ustanovení,
  mimo knihovnu → stránka předpisu s nabídkou zařazení (nic se nestahuje automaticky),
  EU a ostatní → externě do nové karty se skrytým upozorněním.

## Znění
Stahuje se aktuální znění (nejnovější účinné k dnešku) a s volbou „budoucí znění“ i všechna
s pozdějším datem (`rozdelZneni`). Aktuální znění se počítá z data při každém zobrazení
(`aktualniDatum`), takže stažené budoucí znění se samo stane aktuálním.

## Přístupnost — pravidla nástroje
- Česky, H1 je vždy název obsahu (název předpisu, citace ustanovení, oblast…), ne aplikace.
- Žádné `position: sticky/fixed`, žádný treeview — obsah předpisu je vnořený `ul` v `details`.
- Formuláře místo modálních dialogů, popisky přes `label`, nápovědy přes `aria-describedby`.
- `#oznameni` (`aria-live`) jen pro krátká potvrzení akcí (`oznam()`); průběh stahování je
  běžný text na stránce.
- Po přechodu se fokus přesune na H1 (nebo na cíl kotvy).
- Ladění jen do `#ladeni-seznam` na stránce (`log()`), nikdy do konzole.
- Nic se nepředvyplňuje.

## Ověření změny
`node --check` nad obsahem `<script>`. Funkční test běží v jsdom s napodobeným GitHubem
v paměti a SPARQL odpověďmi z uložených dat malého předpisu (50/2026 Sb.): založení
workspace → oblast → přidání předpisu → text (nadpisy, seznamy, tabulky, odkazy) → přechod
na ustanovení → vyznačení s novou skupinou a poznámkou → opětovné načtení ze souborů
→ skupina, hledání, přehled, předpis mimo knihovnu. Naživo pak ověř velký předpis
(např. 89/2012 Sb., ~10 500 fragmentů — dělí se na části) a předpis s poznámkami pod čarou
(110/2019 Sb.).
