# CLAUDE.md — Správce datového katalogu úřadu (dkedit)

## Co to je
Jednosouborová aplikace (`index.html`, ~3343 řádků, ~247 kB) pro správu **OFN datových
slovníků a číselníků** podle Otevřených formálních norem. Spravuje slovníky, pojmy, číselníky,
položky, verze, autorské poznámky a legislativní zdroje; exportuje a importuje **JSON-LD podle
OFN schémat**, umí import CSV/TSV a tiskové sestavy změn.

**Uživatelská dokumentace je v `dokumentace.md` (21 kB) — čti ji jako první a při změně
chování ji aktualizuj.**

## Doména je normativní
Výstup musí být **validní JSON-LD podle OFN**. Než změníš export, import, typy pojmů nebo
strukturu IRI, ověř si příslušnou OFN specifikaci. Podporované typy pojmů (Obecný pojem,
Typ objektu/subjektu práva, Vlastnost, Vztah, Třída, Veřejný/Neveřejný údaj) a jejich pravidla
jsou v konstantách `TYPY`, `STAVY`, `ZISK`, `OBS`, `SDIL`, `UROVNE`, `XSD`.

## Struktura souboru
Jeden `<script>` členěný bannery: `── KONSTANTY / STAV / UTILS / PERSISTENCE / NOTIFIKACE /
DIALOG / ROUTING / MODELY / VIEW: PROJEKT / VIEW: SLOVNÍKY / … / EXPORT JSON-LD /
IMPORT JSON-LD / TISK SESTAVY / AUTORSKÉ POZNÁMKY / ELI BUILDER / IRI AUTO-GENEROVÁNÍ /
ČÍSELNÍKY — DATOVÝ MODEL / ČÍSELNÍKY — VIEWS / POSTRANNÍ PANEL / ELI PARSER ──`.
Bez frameworku, bez CDN, CSS inline.

## Architektura UI
Vlastní mini-router: `V(view, params)` nastaví pohled, `render()` → `rSide()` (postranní panel)
+ `rMain()` (hlavní obsah). Pohledy jsou funkce `v*()` (`vProj`, `vSl`, `vPojmy`, `vCiselniky`,
`vHled`, `vPrehled`, `vVerze`, `vPorA`, `vPoznamky`, …), formuláře `*Form()`, akce `cr*` (create),
`sav*` (save), `del*`/`cf*` (delete + confirm).
**Držte se téhle jmenné konvence** — kód je pojmenovaný extrémně zkratkovitě (`pj` = pojem,
`sl` = slovník, `cs` = číselník, `pl` = položka) a jediné, co ho drží pohromadě, je důslednost.

## Perzistence a migrace
- Data projektu: `localStorage["ofnv3"]`, verze schématu `localStorage["ofnv3_ver"]`,
  `APP_VER = 'v4'`. Při načtení nekompatibilní verze se úložiště **automaticky vyčistí** —
  když měníš tvar dat, zvedni `APP_VER` a doplň migraci (viz „migrate poznamky na
  slovniky/pojmy“).
- Při startu se **odregistrovává Service Worker a čistí cache** (pozůstatek starší verze) —
  nech to být, řeší to zaseknuté staré buildy u uživatelů.
- GitHub token: `localStorage["app_github_token"]`, cesta `owner/repo/cesta` (`parseGhPath`),
  funkce `ghSave()` / `ghLoad()`. **Token nikdy nelogguj, nedávej do dat ani do exportu.**

## IRI — automatické generování
`slugify()` je **česky uvědomělý** (odstranění diakritiky, malá písmena, pomlčky).
Návrhy: `suggestPojemIri`, `suggestSlovnikIri`, `suggestCiselnikIri`, `suggestPolozkaIri`,
automatické doplňování při psaní názvu (`autoIriPojem`, `autoIriSlovnik`, `autoIriCiselnik`,
`autoIriPolozka`). Uživatel musí mít vždy možnost IRI přepsat ručně — automatika nesmí
přepsat hodnotu, kterou zadal.

## ELI (odkazy na právní předpisy)
Dvě části, obě neber na lehkou váhu:
- **Průvodce** (`eliDialog`, `eliPreview`, `eliInsert`) skládá ELI IRI z roku, čísla, částí,
  paragrafů, odstavců, písmen a bodů, s živým náhledem.
- **Parser** (`parseEli`) rozebírá ELI zpět na lidsky čitelný popis; podporuje formáty
  **e-sbirka.cz i opendata.eselpoint.cz**, vzor
  `.../eli/cz/sb/{rok}/{cislo}[/{datum}][/cast_N][/par_N]…`. `eliToEsbirkaUrl` vytváří odkaz
  do e-Sbírky. Obě funkce udržuj v souladu.

## Verze, sestavy a porovnání
Verze slovníku i číselníku jsou snapshoty (`ulVer`, `obnovit`, `ulVerCis`, `obnovitCs`).
Sestavy (`buildSestavaSl`, `buildSestavaCis`, `diffPojmy`, `zmenyPojmu`) ukazují **přidané,
odstraněné a upravené pojmy pole po poli** s popisky z `POLE_LABELS` a tisknou se přes
`tiskSestavu(elId)`. Nevyřízené autorské poznámky se do sestavy propisují — je to podklad
pro projednání, takže úplnost je důležitější než stručnost.

## Import / export
- **JSON-LD**: `buildJLD`/`pjJLD` a `buildCsJLD` (export), `impJLD`/`impCsJLD` (import).
  Import určuje primární typ podle **pořadí priorit** (specifičtější před obecnějším) a musí
  zvládnout `alternativní-název` jako objekt i jako pole, hierarchii přes `nadřazený-pojem`
  i `nadřazená-třída`. Export volí `nadřazená-třída` vs. `nadřazený-pojem` podle typu a
  u vyplněných ustanovení neveřejnosti doplňuje `Neveřejný údaj` do pole `typ`.
  Import reálných produkčních OFN slovníků je deklarovaná vlastnost — netestuj jen na vlastním exportu.
- **CSV/TSV**: `csvParse` + průvodce mapováním sloupců (`csvBuildMapping`, `getMapping`,
  `mapRow`) s náhledem a volbou pro duplicity.

## Hromadné operace a poznámky
Výběr přes zaškrtávátka (`selAllPj`, `getSelPjIds`), akce `bulkPj*` / `doBulkPj*` (stav, typ,
ELI, nelegislativní zdroj, poznámka, smazání) a totéž pro položky (`bulkPl*`).
Autorské poznámky mají kontext `'sl:ID'` nebo `'pj:SL_ID:PJ_ID'` (`noteWidget`, `getNoteTarget`),
stav vyřízeno/nevyřízeno a globální přehled (`vPoznamky`).

## Konvence
- Vše česky, texty natvrdo (nemá i18n vrstvu). Escapování přes `e()` / `fmtVal` v šablonách.
- Dialogy `oDlg(tit, body, ftr)` / `cDlg()`, hlášky `toast(msg, t)`, ne `alert`.
- Zvuková zpětná vazba `playSound(id)` (`snd-save`, `snd-load`).
- Data-atributy `data-nk/ni/nf/slid/csid/ik/ii/pjid/plid` jsou interní vazby renderu.

## Ověření změny
Nový projekt → slovník → pojmy všech typů (ověř IRI generátor i ruční přepis) → ELI průvodce
a zobrazení popisu → hromadné operace → export JSON-LD a jeho **import zpět** →
import reálného produkčního OFN slovníku → číselník a položky → verze, porovnání a tisková
sestava změn → autorské poznámky a jejich přehled → import CSV s mapováním sloupců →
uložení/načtení projektu i GitHub cesta → reload stránky (ověř migraci a `APP_VER`).
