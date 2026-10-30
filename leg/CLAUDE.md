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
legprohlizec.json                       oblasti, předpisy (metadata), skupiny, vyznačení,
                                        skupinyKomentaru, komentare
predpisy/{rok}-{číslo}/{datum}-{n}.json jedno znění rozdělené na části ≤ ~600 kB
predpisy/{rok}-{číslo}/poznamka.md      poznámka k předpisu (Markdown), ve workspace jen P.poznamka
```
Oblasti a obě druhy skupin mají `popis` — poznámku v Markdownu.
Předpis má `popis` (krátký text); vyznačení má `nazev` (popisný název ustanovení).
Komentář: `{id, predpis, klic, citace, zneni, textUst, text (Markdown), skupiny[], vytvoreno, upraveno}`
— k jednomu ustanovení jich může být libovolně mnoho. Vyznačení je naopak jedno na ustanovení.
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
`pohled` (`prehled|oblast|predpis|ust|vyznacena|skupina|komentare|poznamka|prenos|stitky|stitek|hledat|pridat|nastaveni`),
`oblast`, `predpis` (`rok/číslo`), `ust` (klíč), `zneni` (datum, jen mimo aktuální),
`skupina`, `skupinakom` (skupina komentářů), `filtr`, `stitekf`, `zobrazeni`, `stitek`, `cast`, `jenkom`, `jenvyz`, `q`, `rozsah` (`predpis:…`, `oblast:…`), `diakritika`, `poznamky`.
Pohled se dá odvodit (`predpis`+`ust` → detail ustanovení). Odkazy jsou běžné `<a href>`,
klik se zachytí a vykreslí bez načtení stránky (`pushState`/`popstate`); kotvy `#u-…`
v rámci stránky nechává prohlížeči.

## Režim úprav
Přepínač `#prepinac-uprav` v záhlaví (`aria-pressed`, stav `upravy` v
`localStorage["legprohlizec-upravy"]`, výchozí vypnuto = jen čtení). **Každý nový prvek, který
mění data, musí být jen v režimu úprav** — `jenUpravy(x)` vrací `x` nebo `null`, případně
`if (!upravy) return out;` před sekcí správy. Ke čtení zůstává: text, vyznačení (skupiny,
poznámka), komentáře, štítky, poznámky, hledání, filtry, volba komentářů v čtecím pohledu,
exporty a export balíčku. Hromadné úpravy (`hromadnaUprava`, `zaskrtavatkoPolozky`) jsou
navíc až uvnitř režimu úprav. Menu skrývá „Přidat předpis“, Přenos dat skrývá import.

## Štítky a hromadné úpravy
- Oblasti, skupiny vyznačení, skupiny komentářů i štítky se drží seřazené (`seraditSlovniky()`
  při načtení a na začátku `vykreslit()`, české řazení bez ohledu na velikost písmen).
- Názvy štítků jsou **vždy malými písmeny** a všude se řadí `ceskeRazeni` (Intl.Collator „cs“).
  `normalizovatWs()` starší štítky převede a shodné sloučí; import i `zajistitStitek()` převádějí.
- Slovník `W.stitky` (`{id, nazev, popis}`) je společný pro předpisy (`P.stitky`) a ustanovení
  (`W.stitkyUstanoveni`: `{predpis, klic, citace, zneni, textUst, stitky[], upraveno}`; záznam
  bez štítků se maže). Zápis jen přes `nastavStitkyUst()`, výběr přes `vyberStitku()`
  (nové štítky se zakládají až při `hodnota()`, párují se podle názvu bez ohledu na velikost).
- Filtr předpisu umí `stitekf` (jen ustanovení se štítkem a jejich podstromy), samostatně
  i spolu s textem. Rozsah hledání `stitek:<id>` = předpisy se štítkem.
- `hromadnaUprava(druh, zaskrtavatka, uroven)` + `provestHromadne()`; druhy `predpis`, `vyz`,
  `kom`, `ust` (klíč `předpis|klíč`). Zaškrtávátko položky staví `zaskrtavatkoPolozky()` —
  viditelně „Vybrat“, přístupný název s citací. Po akci se stránka překreslí a výsledek se ohlásí.
- Vše je za přepínačem `prepinacHromadnych()` (tlačítko s `aria-pressed`, stav v
  `localStorage["legprohlizec-hromadne"]`). Vypnuto: `zaskrtavatkoPolozky()` vrací `null`
  a `hromadnaUprava()` jen přepínač.

## Export a přenos dat
- `exportniPanel(titul, md, tsv)` — Markdown a TSV do schránky (`kopirovat`) i do souboru
  (`stahnoutSoubor`, Blob s atributem `download`; globální obsluha kliknutí odkazy
  s `download` nechává být). TSV: tabulátory a konce řádků v buňce se nahrazují, soubor má BOM.
- Markdown komentářů (`komentareJakoMarkdown(titul, poznamka, seznam, odkaz)`) má šablonu
  danou uživatelem: H1, *Export z knihovny …*, *Exportováno … — N komentářů.*, poznámka skupiny,
  odkaz na skupinu; pod H2 předpisu odkaz na předpis; ustanovení tučně „citace: text“ (každý
  řádek zvlášť), odkaz na ustanovení a jen texty komentářů — bez data a skupin.
- Balíček `{format: "legprohlizec-balik", verze: 1, zdroj, predpisy, oblasti, skupiny,
  skupinyKomentaru, vyznaceni, komentare, poznamky}` — bez textů předpisů. Import umí
  i samotný `legprohlizec.json`, proto jde číst přímo z jiného úložiště (`ghCist` a `gh`
  berou `repo`/`vetev` z voleb; čte se tokenem uživatele).
- `vyberObsahu()` je společný výběr pro export i import; výběr oblasti nebo skupiny
  doplní i její předpisy. `filtrovatBalik()` ořízne balíček a odkazy na nevybrané skupiny.
  Vyznačení a komentáře mají režim `skupiny` (výchozí — jen z vybraných skupin, volitelně
  i bez skupiny), `vse` (vše u vybraných předpisů) nebo `zadne`; vždy jen u vybraných předpisů.
- `importovatBalik(b, politika)` páruje oblasti a skupiny podle id, pak podle názvu,
  vyznačení podle (předpis, klíč), komentáře podle id. Politika `slouc|ponechat|prepsat`
  platí pro vyznačení, komentáře a všechny poznámky (sloučení spojí texty pod sebe
  s oddělovačem `---`). Chybějící předpisy stahuje `stahnoutPredpis()`.

## Export do DKM (.dkmpkg)
- `panelDkm()` v `exportniPanel(…, uroven, dkm)`; `polozkyProDkm()` sjednotí vyznačení,
  komentáře i záznamy štítků na seznam ustanovení (doplní popisný název a poznámku z vyznačení).
- `dkmBalik()` skládá balíček `{format: "dkmpkg", version: 1, model, entities}`.
  **Typ `DKM_PREDPIS` je kopie typu „Právní předpis“ (`t_muodcx9at9bwye`) ze šablony
  `michalradacz/mojedata/vsechnosablona.dkmdata`** včetně id atributů (`DKM_AT`) a číselníků —
  neměnit id, jinak se v cílových projektech nespáruje. Navíc jen `a_leg_pp_odkaz`.
  Ustanovení předpisu má pevná id `t_leg_ustanoveni` / `a_leg_ust_*`, vazba `rt_leg_odkazuje`.
- Stálá id entit: `leg<rok><číslo>`, ustanovení `…_<par|cl|odst|pism|bod|priloha>_…`,
  EU `legeu<rok><číslo>`. Název ustanovení: „Popisný název (Označení druh-ve-2.-pádě číslo/rok)“,
  genitiv z `druhPredpisu(P, true)`; **ústavní zákon je v DKM typu „Zákon“** (`DKM_DRUH`); u předpisů mimo knihovnu se druh a název dohledají v e-Sbírce.
- Text do Markdown atributu bez odsazení (`dkmText`). Odkazy se berou z HTML fragmentů
  složeného ustanovení (`data-odkaz-id`, u EU `data-celexid`/`data-id_celex`), do hloubky 1.
  Komentáře jako nativní `comments[]`. Štítky, skupiny a účinnost se nepřenášejí.

## Markdown
Vlastní renderer `markdownDom(text, urovenNadpisu)` (nadpisy, odstavce s `br`, vnořené
seznamy, citace, blok kódu, tučně, kurzíva, přeškrtnutí, kód, odkazy). Staví DOM přes `el()`,
HTML z obsahu nikdy nevkládá. `#` se mapuje na zadanou úroveň, aby navazovala osnova nadpisů.
Odkazy na adresu aplikace zůstávají v aplikaci, ostatní se otevírají do nové karty.

Rozepsané texty hlídá `hlidatRozepsane(fn)` — při odchodu odkazem a zavření stránky se
aplikace zeptá; seznam se maže při každém vykreslení.

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

## Složené ustanovení
`slozeniUstanoveni(model, f)` vrátí kořen (nejbližší strukturní předek, typicky §), cestu
nestrukturních předků s textem (návětí) a množinu klíčů k vykreslení (cesta + podstrom
ustanovení + `Pokracovani_Text` předků). `slozenyText()` z toho skládá text pro kopírování
a snímky (`text` u vyznačení, `textUst` u komentářů a štítků) — **vždy přes `slozenaVeta()` /
`vetaZTextu()`**: souvislá věta bez označení „(2)“, „d)“, „1.“ a bez nadpisů struktury (požadavek
uživatele). `vetaZTextu()` se volá i při zobrazení a exportu uložených textů (staré snímky). Detail ustanovení vykresluje
složené ustanovení přes filtr s podbarvením. Kopírování ani exporty neuvádějí „ve znění…“.

## Části stránky předpisu
Parametr `cast` (`vyznacena|komentare|stitky`, bez něj text) — přepínač `navigaceCastiPredpisu()`,
seznamy staví `castPredpisu()` s nadpisem `#cast-predpisu`. Textová část (skok na ustanovení,
filtr, pohled, obsah, text) běží ve vnitřní funkci v `POHLED_FUNKCE.predpis`; správa předpisu
je pod každou částí. `seznamVyznaceni/seznamKomentaru(seznam, poPredpisech, zaklad)`
a `exportniPanel(…, uroven)` berou úroveň nadpisů podle místa na stránce.

## Komentáře v čtecím pohledu
`P.cteniKomentare` = id skupin komentářů zobrazených v textu (`""` = bez skupiny), nastavuje se
formulářem `#komentare-v-textu` jen v čtecím pohledu. `ctx.komentareCteni` (klíč → komentáře)
vykresluje `pripojitKomentareCteni()` pod celým ustanovením (konec `vykreslitObsahUzlu`
a strukturní sekce). Filtry `jenkom`/`jenvyz` jsou množiny klíčů průnikem se štítkem.

## Pohled na text předpisu
Parametr `zobrazeni`: `odkazy` (výchozí — označení ustanovení jsou odkazy na detail, značky
★ a 💬) nebo `cteni` (`ctx.bezOdkazu`, čistý text). Volba z adresy se uloží do
`localStorage["legprohlizec-pohled-predpisu"]` (jen pohodlí prohlížeče, ne data).
Odkazy na jiné předpisy zůstávají v obou pohledech.

## Filtr předpisu
Parametr `filtr` (a `diakritika=ano` pro rozlišování) na stránce předpisu. `filtrPredpisu()`
vrátí množinu klíčů k zobrazení: nalezené ustanovení s celým podstromem a všechny jeho
předky; shoda v nadpisu paragrafu či článku ukáže celý paragraf. `vykreslitDeti()`
a `obsahPredpisu()` množinu respektují, `zvyraznitSlova()` obalí výskyty do `<mark>`.
Odkazy uvnitř předpisu na skryté ustanovení vedou na stránku ustanovení.
Volba `kontext=ne` (pamatuje se v `localStorage["legprohlizec-filtr-kontext"]`) vykreslí místo
stromu `vykreslitJenNalezene()` — jen `filtr.jednotky` v pořadí předpisu, každou pod H2 s citací.

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
