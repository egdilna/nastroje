# DKM — identifikátory obrazovek

Každá obrazovka a každý dialog v DKM nese krátký interní identifikátor. Vypisuje se
malým písmem v patičce (u dialogu vedle tlačítek) a zároveň leží v atributu `data-scr`:

```
document.body.dataset.scr                        // obrazovka, např. "scrallview.table"
document.getElementById('dlg').dataset.scr       // otevřený dialog, např. "dlgimppkg.step3"
document.getElementById('cmdp').dataset.scr      // paleta rychlých akcí
```

**K čemu to je:** aby šlo jednoznačně říct, o kterou obrazovku jde — v hlášení chyby,
ve screenshotu, v testu, a hlavně při zpracování AI, která nad aplikací pracuje. Čti
identifikátor z `data-scr`, ne z textu v patičce.

Identifikátor je stejný v češtině i angličtině a nepřekládá se.

## Konvence

| Předpona | Význam |
|---|---|
| `scr…` | obrazovka v aplikaci |
| `scrset…` | sekce Nastavení |
| `scrstat…` | obrazovka vygenerovaného statického prohlížeče |
| `dlg…` | modální dialog |

Malými písmeny, bez diakritiky a bez oddělovačů. Za tečkou se připojuje upřesnění —
režim zobrazení nebo krok průvodce.

## Seznamy entit

Rozlišují se podle záložky, ne podle konkrétního typu či aspektu. Seznam entit typu
„Osoba" i typu „Systém" hlásí shodně `#scrtypeview` — důležitý je typ obrazovky, ne
její obsah.

| Identifikátor | Obrazovka |
|---|---|
| `#scrinbox` | Schránka |
| `#scrallview` | Vše |
| `#scrtypeview` | seznam jednoho typu entit |
| `#scrtypesview` | seznam záložky s víc typy entit |
| `#scraspview` | seznam jednoho aspektu |
| `#scrtagview` | seznam filtrovaný jedním tagem |
| `#scrarchive` | Archiv |
| `#scrsavedview` | uložený pohled |

### Přípony

Skládají se v tomto pořadí za sebe: `#scrallview.table.select`.

| Přípona | Kdy |
|---|---|
| `.table` | tabulka |
| `.kanban` | kanban |
| `.cal` | kalendář |
| `.timeline` | časová osa |
| `.preview` | zapnutý náhled detailu vedle seznamu |
| `.select` | zapnutý režim hromadného výběru |

Prostý seznam příponu režimu nemá. **Seskupení po sekcích příponu nedostává** — pořád
je to seznam, jen s mezinadpisy.

## Entita

| Identifikátor | Obrazovka |
|---|---|
| `#scrdetent` | detail entity |
| `#scrdetent.rels` | detail, karta Vazby (s Odkazuje sem) |
| `#scrdetent.tree` | detail, karta Strukturální pohled |
| `#scrdetent.tags` | detail, karta Tagy |
| `#scrdetent.comments` | detail, karta Komentáře |

Detail entity má v pravém sloupci karty a vybraná karta se do identifikátoru promítá —
je na ní vidět jiný obsah. Samotné `#scrdetent` bez přípony nenastane; karta je vždycky
nějaká vybraná. Kartu stromu má jen entita, která má vazby.
| `#scredent` | editace entity |
| `#scrnewent` | zakládání nové entity |
| `#scrcomments` | přehled všech komentářů |

## Nastavení

| Identifikátor | Sekce |
|---|---|
| `#scrsetproj` | Projekt |
| `#scrsettypes` | Typy entit — seznam |
| `#scrsettype` | Typy entit — editace jednoho typu |
| `#scrsetasps` | Aspekty — seznam |
| `#scrsetasp` | Aspekty — editace jednoho aspektu |
| `#scrsetrels` | Typy vazeb — seznam |
| `#scrsetrel` | Typy vazeb — editace jednoho typu |
| `#scrsetlists` | Seznamy hodnot |
| `#scrsettags` | Soustavy tagů |
| `#scrsetviews` | Uložené pohledy |
| `#scrsettabs` | Záložky |
| `#scrsetgh` | GitHub |
| `#scrsetai` | AI |
| `#scrsetmodel` | Datový model a jeho export |
| `#scrsetdupes` | Duplicity |
| `#scrsetgen` | Obecné |
| `#scrsetstats` | Statistiky |
| `#scrsethelp` | Nápověda |

Kdyby se objevila sekce Nastavení, která v tabulce chybí, obrazovka se ohlásí jako
`#scrset` — záchytná hodnota, která znamená „tuhle sekci seznam nezná". Když ji uvidíš,
chybí řádek v `SCR_NASTAVENI` a tady v tabulce.

## Dialogy

### Projekt a data

| Identifikátor | Dialog |
|---|---|
| `#dlgdiff` | Změny proti uloženému |
| `#dlgclipout` | Vložení projektu do schránky |
| `#dlgclipin` | Načtení projektu ze schránky |
| `#dlgimptsv` | Import z tabulky |
| `#dlgtext` | Textový náhled ke zkopírování |

### Export

| Identifikátor | Dialog |
|---|---|
| `#dlgexphub` | Export dat — rozcestník |
| `#dlgexpjson` | Průvodce exportem do JSON, kroky `.step1`–`.step4` |
| `#dlgexpent` | Export a tisk jedné entity |
| `#dlgexpbulk` | Export výběru entit |
| `#dlgexppkg` | Export balíčku `.dkmpkg` |
| `#dlgplantuml` | PlantUML |

### Import balíčku

| Identifikátor | Obrazovka |
|---|---|
| `#dlgimppkg` | výběr souboru |
| `#dlgimppkg.step1` … `.step8` | jednotlivé kroky průvodce |

### Entita

| Identifikátor | Dialog |
|---|---|
| `#dlgnewent` | Nová entita — výběr typu |
| `#dlgchtype` | Změna typu entity |
| `#dlgconvtype` | Převod ze Schránky do typu |
| `#dlgaddrel` | Přidání vazby |
| `#dlgwiki` | Nabídka wiki odkazů |
| `#dlgai` | AI asistent |
| `#dlgduprename` | Přejmenování duplicity |

### Seznam a filtry

| Identifikátor | Dialog |
|---|---|
| `#dlgpickent` | Výběr entity do filtru |
| `#dlgsaveview` | Uložení pohledu |
| `#dlgtblcols` | Sloupce tabulky |
| `#dlgcmdpal` | Rychlé akce (Ctrl+P) |

### Hromadné akce

| Identifikátor | Dialog |
|---|---|
| `#dlgbulktype` | Změna typu |
| `#dlgbulkaspadd` | Přidání aspektu |
| `#dlgbulkasprem` | Odebrání aspektu |
| `#dlgbulkattr` | Nastavení nebo vymazání atributu |
| `#dlgbulkrel` | Přidání vazby |
| `#dlgbulkarch` | Archivace |
| `#dlgbulkdel` | Smazání |
| `#dlgbulkmerge` | Sloučení |

## Statický prohlížeč

Vygenerovaný samostatný soubor má vlastní, mnohem užší sadu obrazovek. Identifikátory
kopírují aplikaci, jen s předponou `scrstat`.

| Identifikátor | Obrazovka |
|---|---|
| `#scrstatinbox` | Schránka |
| `#scrstatallview` | Vše |
| `#scrstattypeview` | seznam jednoho typu entit |
| `#scrstattypesview` | seznam záložky s víc typy entit |
| `#scrstataspview` | seznam jednoho aspektu |
| `#scrstattagview` | seznam filtrovaný jedním tagem |
| `#scrstatarchive` | Archiv |
| `#scrstatdetent.rels` | detail entity, karta Vazby (s Odkazuje sem) |
| `#scrstatdetent.tree` | detail entity, karta Strukturální pohled |
| `#scrstatdetent.tags` | detail entity, karta Tagy |

## Jak přidat identifikátor nové obrazovce

Identifikátory vznikají na jednom místě, ne rozsypané po kódu.

**Nová obrazovka** — doplň větev do `idObrazovky()`. Funkce ho odvodí ze `state.view`
a `render()` ho na konci vypíše přes `zobrazIdObrazovky()`. Nic dalšího netřeba.

**Nová sekce Nastavení** — přidej klíč do `SCR_NASTAVENI`; pokud má i obrazovku editace
jedné položky, tak i do `SCR_NASTAVENI_POLOZKA`.

**Nový režim zobrazení** — přidej příponu do `SCR_REZIM`.

**Nový dialog** — na řádek **těsně před** `showDialog(…)` napiš `idDialogu('dlgneco');`.
`showDialog` si hodnotu vyzvedne a zase vynuluje. Když ji zapomeneš, ohlásí to
v ladicím režimu jako chybu — dialog bez identifikátoru tak neprojde.

**Nový krok průvodce, který překresluje tělo otevřeného dialogu** — zavolej
`nastavIdDialogu('dlgneco.stepN')`. Průvodce importem balíčku to má v
`renderPkgWizProgress()`, takže všech osm kroků pokryje jedno místo.

**Vždy doplň i tabulku výše.** Seznam je závazný — je to smlouva s AI a s testy,
které se o identifikátory opírají.
