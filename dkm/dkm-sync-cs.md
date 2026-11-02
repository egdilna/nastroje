# DKM — formát `dkmdata` a synchronizace více uživatelů

Dokument má čtyři části:

1. **Formát** — co je v souboru `.dkmdata` (a v přenosném `.dkmpkg`) a kde je jeho závazný popis.
2. **Synchronizace** — jak v DKM funguje práce několika lidí nad jedním souborem v repozitáři.
3. **Programátorský popis** — mapa funkcí, pseudokód a invarianty, které se nesmí porušit.
4. **Zadání pro AI** — co udělat, aby táž synchronizace fungovala v jiné aplikaci postavené nad formátem `dkmdata`.

Anglické dvojče je `dkm-sync-en.md`; obsah je týž, texty jsou přeložené.

---

## 0. Co je tady autorita

Když si zdroje odporují, platí ten výš:

1. **`dkm/index.html`** — skutečné chování aplikace. Pro formát je kanonická funkce `mergeEmpty`: co projde jí, je platný `.dkmdata`.
2. **`dkm/dkmdata-scheme.json`** a **`dkm/dkmpkg-scheme.json`** — JSON Schema 2020-12. Strojově ověřitelný popis obou formátů, **samonosný**: neodkazuje na síť ani jedno na druhé, takže se dá zkopírovat celé, validovat offline nebo vložit AI do rozhovoru. Sdílené definice jsou proto v obou souborech duplicitně a **musí zůstat totožné**.
3. **`dkm/docs-cs.md`, kapitola 37** — slovní popis toho, co schéma zachytit neumí: referenční integrita, identita při importu, tvar hodnoty podle typu atributu.
4. **Tento dokument** — mapa, souvislosti a návod. Při rozporu platí body výš.

Tenhle dokument je napsaný tak, aby se dal poslat samostatně: popis formátu je zkrácený, ale úplný natolik, aby podle něj šel soubor napsat i přečíst.

---

# ČÁST 1 — FORMÁT

## 1.1 Dva soubory, dvě schémata

| Soubor | Co nese | Schéma |
|---|---|---|
| `*.dkmdata` | **celý projekt** — model, entity, nastavení, uložené pohledy | `dkmdata-scheme.json` |
| `*.dkmpkg` | **přenosný balíček** — výřez entit a modelu k importu do jiného projektu | `dkmpkg-scheme.json` |

Oba jsou obyčejný JSON v UTF-8. DKM `.dkmdata` zapisuje jako `JSON.stringify(data, null, 2)`, tedy odsazené dvěma mezerami; čtečka na formátování nehledí.

Synchronizace popsaná v části 2 se týká **výhradně `.dkmdata`**. Balíček je jednorázový přenos, ne společný soubor.

## 1.2 Projekt — nejvyšší úroveň

```json
{
  "version": 1,
  "projectName": "Správa dat",
  "projectDescription": "",
  "ghPath": "vlastnik/repozitar/cesta/soubor.dkmdata",
  "settings": { "tabs": [], "modules": [] },
  "entityTypes": [],
  "aspects": [],
  "relationTypes": [],
  "selectLists": [],
  "tagSets": [],
  "savedViews": [],
  "jsonExports": [],
  "entities": []
}
```

- Povinné je **jen `entities`**. Všechno ostatní si `mergeEmpty` doplní prázdné, takže `{"entities":[]}` je platný projekt.
- `additionalProperties` je na téhle úrovni **`false`** — a je to záměr: `mergeEmpty` neznámé klíče doopravdy zahodí, takže schéma popisuje skutečné chování čtečky, ne přání. **Uvnitř entit je naopak `true`**, protože ty projdou načtením i uložením beze změny.
- `ghPath` je trojice `vlastník/repozitář/cesta` a je **jediná věc ze synchronizace, která patří do dat**. Token, jméno autora komentářů, motiv, jazyk ani zapnuté automatické ukládání v souboru **nejsou** a nikdy tam nesmí být.

## 1.3 Model

| Kolekce | Co to je | Klíčová pole |
|---|---|---|
| `entityTypes` | typ entity — pojmenovaná sada atributů | `id`, `name`, `icon`, `attributes[]`, `sablonaDetailu`, `nazevZe`, `jsonKey` |
| `aspects` | **průřezová** sada atributů, přidatelná entitě nezávisle na typu | totéž + `pinned` |
| `relationTypes` | typ vazby | `id`, `name`, `reverseName`, `scope`, `fromTypes[]`, `toTypes[]` |
| `selectLists` | číselník | `id`, `name`, `values[]` |
| `tagSets` | soustava tagů | `id`, `name`, `tags[]`, `uzavrena` |
| `savedViews` | uložený pohled (filtr + zobrazení) | `id`, `name`, `filters`, `pravidla[]` |
| `jsonExports` | profil exportu do JSON/XML | `id`, `name`, `keyOverrides`, `vynechane` |

Definice atributu (`attributes[]` u typu i u aspektu) nese `id`, `name`, `type` a podle typu další pole: `listId` (číselník), `tagSetId` (soustava tagů), `targetType` a `multi` (vazba), `template` (složený), `min`/`max`/`krok`/`jednotka` (posuvník), `autoInc`/`posledni` (samočíslování), `filtrCile[]` (omezení cíle vazby podmínkami) a čtyři přepínače zobrazení (`hidden`, `copyable`, `highlight`, `hideEmpty`).

Typy atributů: `text`, `textarea`, `date`, `url`, `select`, `yesno`, `relation`, `number`, `range`, `checklist`, `tags`, `composed`.

**Rozsah vazby** (`relationTypes[].scope`) je `universal`, `from`, `to` nebo `specific`. Prázdné `fromTypes`/`toTypes` znamená **„cokoli"**, ne „nic".

## 1.4 Entita

```json
{
  "id": "e_lz3k9a1b2c",
  "name": "Alice Nováková",
  "typeId": "ty_osoba",
  "aspects": ["asp_kontakt"],
  "attributes": { "at_email": "a@b.cz", "at_stav": "Aktivní" },
  "relations": [{ "id": "r_1", "relationTypeId": "rt_patri", "targetId": "e_2" }],
  "customAttributes": [{ "id": "ca_1", "name": "Interní číslo", "type": "text", "value": "7" }],
  "comments": [{ "id": "c_1", "content": "ověřeno", "author": "mr", "createdAt": "2026-09-08T14:03:22.184Z" }],
  "objects": [{ "id": "o_1", "name": "Zápis", "content": "…" }],
  "inInbox": false,
  "archived": false,
  "locked": false,
  "pinned": false,
  "createdAt": "2026-09-01T07:00:00.000Z",
  "updatedAt": "2026-09-08T14:03:22.184Z"
}
```

Povinné je jen `id`. Pravidla, která se v JSONu nevidí:

- **Identifikátor se nikdy nepřečísluje.** Na něm stojí veškeré odkazování i rozpoznání entit při opakovaném importu balíčku.
- **Vazba se zapisuje jen u zdrojové entity.** Opačný směr („Odkazuje sem") se dopočítává, v datech se neduplikuje.
- **Vazba `id` neznamená nic.** Identita vazby je dvojice `(relationTypeId, targetId)` — a je to pro synchronizaci klíčové, viz § 2.5.
- **Vazba může vzniknout i atributem** typu `relation`: hodnota je `id` cílové entity (při `multi: true` pole `id`). Pro model je to plnohodnotná vazba, jen zapsaná jinde než v `relations`.
- **Prázdná hodnota se neukládá** — klíč se z `attributes` smaže. `null` v čerstvě zapsaných datech nevzniká, i když ho schéma toleruje. U `customAttributes` se naopak ukládá prázdný řetězec, protože klíč smazat nelze.
- **`updatedAt` je čas úpravy obsahu.** Zamčení, připnutí ani přejmenování wiki odkazů jím nehýbe.

## 1.5 Tvar hodnoty podle typu atributu

| Typ | Hodnota |
|---|---|
| `text`, `textarea`, `url`, `select` | řetězec (`textarea` se vykresluje jako Markdown + CriticMarkup; `select` musí být hodnota z navázaného číselníku) |
| `date` | `RRRR-MM-DD`, **ne** plné ISO razítko |
| `number`, `range` | **číslo**, ne řetězec |
| `yesno` | `true` / `false` |
| `checklist` | pole objektů `{text, hotovo}` — řádky patří **entitě**, ne definici |
| `tags` | pole řetězců z navázané soustavy (DKM je drží abecedně) |
| `relation` | `id` cílové entity, při `multi: true` pole `id` |
| `composed` | **žádná** — hodnota se počítá ze šablony `template` při každém vykreslení; do dat se zapisuje jen šablona |

Časové údaje jsou ISO 8601 v UTC s koncovým `Z` (`new Date().toISOString()`).

## 1.6 Co schéma nevynucuje

JSON Schema umí tvar, ne vztahy. Čtečka ani zapisovatel se proto nesmí spoléhat jen na validaci:

- **Referenční integrita.** `typeId`, `aspects[]`, `attributes` klíče, `relationTypeId`, `targetId`, `listId`, `tagSetId`, `targetType`, `scopeId`/`attrId` v pravidlech filtrů — všechno jsou odkazy do jiných kolekcí a schéma je nehlídá. DKM se s rozbitým odkazem nehroutí: neznámý atribut se nezobrazí, vazba na neexistující entitu se při sloučení uklidí (`uklidOdkazy`).
- **Shoda hodnoty s typem atributu.** `oneOf` v `hodnotaAtributu` pustí řetězec tam, kde má být číslo, protože typ je až v definici atributu. Hodnotu je tedy nutné ověřovat proti `type` té definice.
- **Jedinečnost `id`.** Schéma ji nevyžaduje; čtečka musí počítat s tím, že cizí soubor může mít dvě entity se stejným `id`, a zapisovatel ji musí držet sám.
- **Čísla samočíslujícího atributu nejsou unikátní.** `posledni` je čítač, ne rezervace — viz § 2.15.

## 1.7 Balíček `.dkmpkg`

```json
{ "format": "dkmpkg", "version": 1, "kind": "model",
  "exportedFrom": "…", "exportedAt": "2026-09-08T…",
  "model": { "entityTypes": [], "aspects": [], "relationTypes": [], "selectLists": [], "tagSets": [] },
  "entities": [] }
```

Povinné je `format` a `entities`. `kind: "model"` s prázdnými `entities` je **přenos modelu**; jinak jde o výřez entit s modelem, který si vyžádaly. Balíček nenese nastavení, záložky, moduly ani uložené pohledy — a `entities[]` používá tytéž definice jako `.dkmdata`, protože entity si v balíčku **nesou svoje `id`**, aby se opakovaný import poznal.

## 1.8 Jak soubor ověřit

Schémata se ověřují **dvěma validátory** (`python -m jsonschema` a `ajv` ve strict režimu), proti **skutečným souborům z aplikace** a **vždycky i negativně** — tedy že vadná data opravdu propadnou. Samotné „nula chyb" nedokazuje nic.

---

# ČÁST 2 — SYNCHRONIZACE

## 2.1 Co to je a co to není

DKM je jeden HTML soubor bez serveru. „Synchronizace" tu tedy znamená: **několik prohlížečů ukládá a čte týž soubor v repozitáři na GitHubu** a aplikace se stará o to, aby si navzájem nepřepsaly práci.

Co to **není**:

- Není to zámek. Nikdo nic nerezervuje, dva lidé mohou měnit tutéž entitu naráz.
- Není to operační transformace ani CRDT. Neposílají se změny, posílá se **celý soubor**.
- Není to realtime. Cizí změna přistane do 20 sekund při práci, do 2 minut v klidu — a jen když je okno vidět.
- Není to služba. Veškerá logika je v prohlížeči; GitHub je **hloupé úložiště s podmíněným zápisem**.

Co to je: **optimistická souběžnost nad trojcestným sloučením**. Přesně to, co dělá `git merge`, jen nad JSONem a podle struktury dat, ne podle řádků textu.

Vlastnost, kvůli které to stojí za popsání: **sloučení se nikdy nikoho na nic neptá a nikdy nesebere rozdělanou práci.** Jen přidává. Dialog tam být nesmí, protože tudy chodí i automatické ukládání.

## 2.2 Čtyři kopie dat

V každém okamžiku existují v prohlížeči tři kopie projektu a jedna na síti:

| Kopie | Kde | Co to je |
|---|---|---|
| **základ** (`state.baseline`) | paměť stránky | projekt tak, jak jsme ho **načetli** nebo naposledy uložili |
| **moje** (`state.data`) | paměť + `sessionStorage` | projekt, jak ho má uživatel před sebou, včetně neuložených změn |
| **jejich** | GitHub | obsah souboru, jak ho tam někdo uložil naposledy |
| **rozepsaná entita** (`state.view.editZaklad` + formulář) | paměť stránky | otevřený editor je další odložená kopie — viz § 2.11 |

K tomu dva drobné stavy: `state.ghSha` (verze souboru, ze které jsme vyšli) a `ghPosledniCommit` (poslední commit, o kterém víme).

`state.ghSha` je uložená v `sessionStorage` vedle dat, takže **přežije obnovení stránky**. Bez toho by první uložení po F5 narazilo naslepo na cizí zápis.

## 2.3 Optimistická kontrola: `sha`, kterou neobnovujeme

Zápis jde přes GitHub Contents API:

```
PUT /repos/{owner}/{repo}/contents/{path}
{ "message": "…", "content": "<base64>", "sha": "<state.ghSha>" }
```

Posílá se **`sha` verze, ze které jsme vyšli** — ne ta nejčerstvější. Právě tím GitHub pozná, že mezitím uložil někdo jiný, a zápis odmítne: **409** (nesedící `sha`), **422** (chybějící `sha` u souboru, který už existuje).

> **Nikdy si `sha` nenačítej znovu jen proto, aby zápis prošel.** Tím se celá ochrana vypne. Dřív se v DKM `sha` tahala těsně před zápisem a poslední uložení tiše přepsalo cizí práci. Je to jediná chyba v celém tomhle mechanismu, která mlčky ničí data.

Konflikt se neukazuje uživateli. Řeší se smyčkou:

```
pokus(n):
  odpověď = PUT(state.ghSha)
  pokud není konflikt → hotovo
  pokud n >= 3 → vzdát se a ohlásit chybu
  slučSVzdáleným()      // stáhne, sloučí, posune ghSha
  pokus(n+1)
```

Tři pokusy jsou kompromis: při dvou lidech stačí jeden, při deseti by se smyčka točila zbytečně a lepší je říct „zkus to znovu".

## 2.4 Trojcestné sloučení

Vstup jsou tři projekty (**základ**, **moje**, **jejich**), výstup jsou sloučená data a **zpráva o tom, co se stalo**. Zpráva není kosmetika: je to jediný způsob, jak se uživatel dozví, že něčí změna ustoupila.

```
{ prevzatoEntit, pridanoEntit, smazanoEntit,
  kolize: [{id, nazev, pole:[…]}],
  oziveno: [{nazev, strana}],
  zahozenychOdkazu, zmenenoModelu }
```

Počty jsou **z pohledu toho, co přišlo od druhého**: `prevzatoEntit` jsou entity, které se změnily na jejich straně, `pridanoEntit` ty, které u mě nebyly, `smazanoEntit` ty, které **druhý smazal** a já se jich nedotkl. Moje vlastní smazání se nepočítá — o tom vím.

Když základ není (projekt vznikl lokálně a teprve se ukládá do cizího souboru), slučuje se **proti prázdnému projektu**. Ze sloučení se tím stane sjednocení, ve kterém při střetu vyhraje ukládající a **nic cizího se nesmaže**. Proto tu není dialog „přepsat / načíst": sem chodí i automatické ukládání a to nesmí nic blokovat.

## 2.5 Pravidla po úrovních

### Model (`entityTypes`, `aspects`, `relationTypes`, `selectLists`, `tagSets`, `savedViews`, `jsonExports`)

Sjednocení podle `id`; **při střetu vyhrává moje kopie celého objektu**. Model si uživatel hlídá sám, tohle má jen zabránit tomu, aby uložení smazalo cizí nový typ.

Jedna výjimka: **čítač samočíslujícího atributu** (`autoInc`, `posledni`). Tam se bere **maximum obou stran**, ne vítěz střetu — kdo zakládal entity na druhé straně, posunul `posledni` u sebe, a moje nižší hodnota by rozdala čísla podruhé. Základ se do maxima **nepočítá**: když ho obě strany snížily, je to záměrný reset.

### Pole objektů s `id` (entity, komentáře, objekty, vlastní atributy)

Nejdřív se rozhodne, **co v poli zůstane**:

| Základ | Moje | Jejich | Výsledek |
|---|---|---|---|
| není | je kdekoli | — | **zůstane** (někdo ji přidal) |
| je | je | je | **zůstane** |
| je | není | není | **zmizí** (smazali oba) |
| je | je | není | zůstane **jen když jsem ji změnil** → hlásí se jako „oživená" |
| je | není | je | zůstane **jen když ji změnili oni** → hlásí se jako „oživená" |

Tedy: **smazat smí jen ten, koho se druhý nedotkl. Úprava přebíjí smazání.** Opačné pořadí by zahodilo cizí práci — a to je přesně to, čemu se tu snažíme zabránit. Oživená položka se **vždycky hlásí**, i při tichém sloučení: uživatel smazal a ono to je zpátky, to musí vědět.

Pak se každá zůstávající položka vyřeší:

- změnil jsem ji jen já → **moje**,
- změnili ji jen oni → **jejich**,
- změnili ji **oba** → položkové sloučení (u entit `slucEntitu`, u modelu „moje"),
- nezměnil ji nikdo → moje (jsou shodné).

Pořadí výstupu je **moje pořadí**, na konec se připojí to, co přibylo od druhého. Data se nikdy nepřerovnávají.

### Jedna entita

| Část entity | Pravidlo |
|---|---|
| skaláry (`name`, `inInbox`, `archived`, `typeId`, `createdAt`, `locked`, `pinned`) | nezměnili → moje; změnili jen oni → **jejich**; změnili oba jinak → **moje** a zapíše se **spor** |
| `attributes` | **po klíčích**, stejným pravidlem — dva lidé na různých atributech téže entity se nesrazí. Prázdná hodnota klíč smaže |
| `aspects` | členství v množině: co druhý přidal, přibude; co druhý odebral, zmizí; co jsem přidal já, zůstane |
| `relations` | členství v množině klíčovaného **dvojicí `(relationTypeId, targetId)`** |
| `customAttributes`, `comments`, `objects` | podle `id` (tabulka výš); komentáře a objekty jsou v praxi jen přírůstkové, takže se skoro nikdy nesrazí |
| `updatedAt` | **pozdější z obou** — datum je tu údaj, ne předmět sporu |

**Tato tabulka platí jen tehdy, když entitu změnily obě strany.** Když ji změnil jen jeden, bere se **jeho verze vcelku** (viz rozhodování v § 2.5 výš) — po atributech se nic neporovnává, protože není s čím. Je to důležité při psaní testů: prázdná hodnota u atributu klíč smaže jen na té per-klíčové cestě; v cizí verzi převzaté vcelku zůstane, jak ji druhý zapsal.

**Proč je vazba poznaná dvojicí, a ne svým `id`:** `id` vazby si vyrábí každý klient sám. Dva lidé, kteří přidají téže entitě různou vazbu, by se s `id` hlásili jako spor a jedna vazba by zmizela. S dvojicí `(typ, cíl)` se nesrazí vůbec — a dvě vazby téhož typu na tentýž cíl jsou stejně jedna vazba.

**Spor (`kolize`) znamená, že cizí hodnota pole ustoupila.** Vyhrává ten, kdo ukládá, protože má data před očima — ale musí se to ohlásit, viz § 2.8.

### Po sloučení: úklid odkazů

`uklidOdkazy` projde sloučená data a zahodí odkazy na entity, které už neexistují — `relations[].targetId` i hodnoty atributů typu `relation` (včetně `customAttributes`). Bez toho by po smazání entity na druhé straně zůstaly v datech vazby do prázdna. Počet se hlásí ve zprávě.

Pořadí je důležité: **nejdřív sloučit, pak uklidit.** Opačně by se uklízelo proti zastaralému seznamu entit.

## 2.6 Po sloučení je novým základem **jejich** verze

Ne sloučená data. Důvod je mechanický: `state.ghSha` po sloučení ukazuje na **jejich** soubor, takže základ musí být tím, co v tom souboru je. Kdyby se do základu dosadila sloučená data, další ukládání by počítalo rozdíl proti něčemu, co na GitHubu nikdy nebylo, a „změnil jsem to já" by se posuzovalo špatně.

Sloučená data jsou `state.data`, tedy **moje** kopie — a ta je proti novému základu rozdílná, takže zůstává `dirty` a odešle se při dalším uložení.

## 2.7 Zkratka: nemám nic rozdělaného

Když `!state.dirty && !state.view.edit`, **jejich verze se převezme vcelku** a nic se neslučuje. Spor ani oživení tam nemůže vzniknout, takže obrazovka zůstane úplně zticha. Je to ten nejčastější případ: jeden člověk čte, druhý píše.

Základ, `state.data` a `ghSha` se nastaví na jejich verzi, `ghPath` se zachová (ten patří tomuhle prohlížeči) a do popisku tlačítka ↻ se zapíše stopa s počtem entit, které přišly.

## 2.8 Co se o sloučení dozví uživatel

Rozdělení je záměrné a drží se dvou pravidel: **otázka, na kterou se vždycky odpovídá stejně, není otázka**, a **informaci, že něčí změna ustoupila, musí být možné přečíst.**

| Co se stalo | Ruční sloučení | Automatické (tiché) |
|---|---|---|
| nic nového | toast „nic nového" | mlčí |
| převzaté / přidané / smazané entity | toast s počty | **mlčí** — stopa v popisku tlačítka ↻, tlačítko blikne |
| **spor** (obě strany na témže poli) | **banner**, který sám nezmizí | **banner** |
| **oživená entita** (úprava přebila smazání) | **banner** | **banner** |
| na cestě je **jiný projekt** | slučuje se (uživatel si to řekl sám) | **banner s otázkou** |
| chyba sítě / tokenu | toast | hlásí se vždycky, autosave se vypne |

**Proč banner a ne toast:** hned po sloučení přijde hláška o úspěšném uložení a ta by toast překryla — přitom je to jediná zpráva o tom, že něčí změna ustoupila. **Proč ne dialog:** sem chodí i automatické ukládání a to nesmí nic blokovat.

Stopa po tichém sloučení se do popisku tlačítka **skládá**, ne přičítá (základ popisku + poslední sloučení) — jinak by s každým sloučením narostl o další větu.

## 2.9 Hlídání cizích změn

```
GET /repos/{owner}/{repo}/commits?per_page=1&path={path}
```

Ptá se **jen na poslední commit, ne na obsah** — a jen když je okno vidět. Když se `sha` commitu změnila proti té, kterou si pamatujeme, spustí se automatické sloučení.

Tempo je adaptivní: **20 s** při práci u počítače, **120 s** v klidu (přepíná se podle poslední klávesy nebo kliknutí). Ani to rychlé tempo není drahé — 180 dotazů za hodinu proti limitu 5000. Na pozadí se neptáme vůbec; při návratu do záložky se zkontroluje hned.

**Vlastní commit se nesmí tvářit jako cizí.** `sha` vlastního commitu se bere rovnou z odpovědi na `PUT` (`result.commit.sha`); doptávání je jen záloha. Bez toho stihne kontrola proběhnout dřív a aplikace se sloučí sama se sebou.

Odkládá se jen to, co by překáželo:

- **otevřený dialog** → sloučí se, až se zavře,
- **běžící ukládání** → počká se na další tik,
- **okno na pozadí** → kontrola se vůbec nepustí.

**Otevřený editor překážka není**: slučuje se, ale nepřekresluje — překreslení by sebralo ohnisko uprostřed psaní, a rozepsaná entita se stejně slučuje až při potvrzení (§ 2.11).

## 2.10 Automatické ukládání

Volitelný přepínač. Po každé změně se čeká **2,5 s ticha** (psaní v editoru hlásí změnu na každé písmeno a commit za každé z nich by byl nesmysl). Zapnutí žije **jen v paměti stránky**: „posílám svoji práci ven" je věc toho, kdo u počítače sedí, ne vlastnost projektu, který si lidé posílají mezi sebou. Jestli se má po načtení zapnout samo, drží **předvolba v prohlížeči**, ne v datech.

- Souběh hlídá dvojice příznaků „běží" / „ještě jednou" — dvě ukládání naráz by si přepsala `sha`.
- **Po chybě se autosave vypne.** Opakovat po každé změně by u špatného tokenu znamenalo nekonečnou řadu chybových hlášek.
- Odchod ze záložky na ticho nepočká a odešle hned.
- U tichého ukládání se potlačuje hláška, **ne zvuk** — tón je jediná zpětná vazba, kterou tiché ukládání má. Chyba se hlásí vždycky.

## 2.11 Otevřený editor je taky odložená kopie

Mezi otevřením editoru a stiskem Uložit se na pozadí mohlo sloučit něco od druhého člověka. Uložit rozepsanou kopii tak, jak je, by jeho změny v té entitě přepsalo.

Proto se **i tady slučuje trojcestně**, jen nad jednou entitou: základ je stav při otevření editoru, „moje" je rozepsaná kopie (ta při střetu vyhrává, protože ji člověk právě píše) a „jejich" to, co je v datech teď. Sloučení může přinést cizí hodnoty atributů, takže se po něm znovu přepočítá skládaný název.

## 2.12 Jediná otázka, která zbyla

Automat se neodváží v jediné situaci: na té cestě leží **jiný projekt**. Pozná se tak, že s naším nemá společnou **ani jednu entitu** (prázdná strana se za jiný projekt nepovažuje — do prázdna se dá slévat bez obav). Sloučení by dva nesouvisející projekty slilo do jednoho a rozmotávalo by se to těžko.

Ukáže se tedy banner s nabídkou **Sloučit** — ne Načíst, to by zahodilo rozdělanou práci. Ručně spuštěné sloučení se neptá: to si uživatel řekl sám.

## 2.13 Past 1 MB v Contents API

**Contents API vydá obsah souboru jen do 1 MB.** U většího vrátí `content: ""` a `encoding: "none"`, takže naivní `atob(odpoved.content)` dá prázdný řetězec a `JSON.parse` spadne. Data přitom v repozitáři jsou celá a nepoškozená — jen vypadají jako poškozená. Stačí k tomu jeden vložený soubor; base64 obsah navíc nafoukne o třetinu.

DKM to řeší záložním čtením: když obsah v odpovědi nedorazí, dotáhne se podle `sha` z `/repos/{owner}/{repo}/git/blobs/{sha}` (zvládne až 100 MB). Je to **jedna funkce**, kterou používá načtení projektu i sloučení při konfliktu — druhá kopie té logiky nikam nepatří.

K tomu patří **pojistka proti přepsání**: dokud soubor doopravdy nenačteme, nesmí se nic ukládat. Bez toho jedno neúspěšné načtení nechá běžet prázdný stav a automatické ukládání jím přepíše celá uživatelova data. V DKM tu roli plní `ghSha` a základ: bez načtení není `ghSha`, a bez `ghSha` se zapisuje jen do souboru, který **neexistuje** (`PUT` bez `sha` nad existujícím souborem vrátí 422, tedy konflikt, a konflikt se řeší sloučením, ne přepsáním).

**Na zápis platí týž limit, jen z druhé strany.** Pravidlo repozitáře je nechat Contents `PUT` běžným malým uložením a větší obsah poskládat z Git Data API (blob → `git/trees` s `base_tree` → `git/commits` → `PATCH git/refs/heads/{větev}`). DKM dnes ukládá **jen přes Contents `PUT`**; u projektu s velkými vloženými texty je to místo, které je potřeba doplnit, a kdo tenhle mechanismus staví znovu, ať s tou cestou počítá od začátku.

A base64 u velkých souborů skládej **po blocích** (`TextEncoder` + `String.fromCharCode.apply`): `btoa(unescape(encodeURIComponent(text)))` nad několikamegabajtovým řetězcem vyrábí obří mezikopie.

## 2.14 `BroadcastChannel` je něco jiného

Vedle GitHubu běží druhý, nesouvisející mechanismus: synchronizace **mezi záložkami téhož prohlížeče**. Je okamžitá, posílá celá data a nic neslučuje — jen nabídne banner, když je ve druhém okně rozdělaná práce.

Kanál je per **pracovní prostor** (`dkm-sync-<id>`), protože `BroadcastChannel` slyší celý origin a dva projekty otevřené ve dvou oknech by si jinak přepsaly data.

Nezaměňovat. GitHub řeší **různé lidi**, `BroadcastChannel` **různá okna jednoho člověka**.

## 2.15 Co to nezaručuje

Říkat to na rovinu je součást návrhu:

- **Žádné zamykání.** Dva lidé mohou měnit tutéž entitu; při střetu na témže poli jedna hodnota ustoupí a jen se to ohlásí.
- **Spor se řeší ve prospěch toho, kdo ukládá.** Ne „posledního", ne „nejnovějšího podle času" — ve prospěch toho, kdo má data před očima.
- **Čísla samočíslujícího atributu nejsou jedinečná.** Dvě okna, která založí entitu naráz, dostanou totéž číslo. Bez serveru to nejde.
- **Zámek entity sloučení nebrání.** Slučování není uživatelská akce, a kdyby ho zámek blokoval, obě kopie souboru by se trvale rozešly. Totéž platí pro omezení cíle vazby a pro každou jinou kontrolu vstupu: zápis jinudy než rukou nic nezahazuje.
- **Latence je v sekundách až minutách**, ne v milisekundách.
- **Čas z klienta se nepoužívá k rozhodování.** `updatedAt` se bere jako pozdější z obou, ale o tom, co vyhraje, rozhoduje **struktura rozdílu**, ne hodiny. Hodiny na dvou počítačích nejdou stejně.

---

# ČÁST 3 — PROGRAMÁTORSKÝ POPIS

## 3.1 Mapa funkcí

Všechno je v `dkm/index.html`. Názvy jsou české, protože celý repozitář je český.

| Funkce | Co dělá |
|---|---|
| `slucProjekty(zaklad, moje, jejich)` | **hlavní vstup.** Vrací `{data, zprava}` |
| `slucPodleId(zaklad, moje, jejich, slucPrvek, onOziveno)` | sloučení pole objektů s `id` (§ 2.5) |
| `slucEntitu(zaklad, moje, jejich)` | jedna entita; vrací `{entita, kolize:[názvy polí]}` |
| `clenstvi(zaklad, moje, jejich)` | trojcestné sloučení členství v množině (aspekty, klíče vazeb) |
| `klicVazby(r)` | `JSON.stringify([relationTypeId, targetId])` — identita vazby |
| `uklidOdkazy(data)` | zahodí odkazy na neexistující entity; vrací počet |
| `slucSVzdalenym(parsed, {tiche})` | stáhne soubor, sloučí ho do `state.data`, posune základ a `ghSha` |
| `slucitZGithubu()` | ruční Sloučit (tlačítko ↻) — stáhne a sloučí, **ale neukládá** |
| `saveToGitHub(tiche)` | zápis s `state.ghSha`, při konfliktu sloučení a nejvýš 3 pokusy |
| `zkontrolujVzdalene()` | dotaz na poslední commit, adaptivní tempo |
| `automatickeSlouceni(parsed)` | tiché sloučení, odklad při otevřeném dialogu |
| `ohlasSlouceni(z, tiche)` | rozhoduje toast / banner / stopa (§ 2.8) |
| `ghNactiSoubor(parsed)` | stažení s záložním čtením blobu nad 1 MB |
| `ghZapamatujCommit()` | aby vlastní commit nevypadal jako cizí |
| `snapshotBaseline()` / `hasBaseline()` | základ trojcestného sloučení |
| `mergeEmpty(p)` | normalizace cizího souboru — kanonická definice formátu |
| `jinyProjekt(a, b)` | dva projekty bez jediné společné entity |

Pomocníci: `slKopie` (hluboká kopie), `slStejne` (porovnání přes `JSON.stringify` s `undefined → null`), `slPodleId` (pole → `Map`).

**Pozor na jmennou kolizi:** `klicVazby` patří slučování a nese dvojici typ+cíl. `klicSkupinyVazby` je něco jiného — seskupení vazeb po typu a směru v kartě Vazby a v tabulkovém exportu.

## 3.2 Pseudokód

```
slučProjekty(základ, moje, jejich):
  výsledek = hluboká kopie moje

  # 1. model
  pro každou modelovou kolekci k:
     výsledek[k] = slučPodleId(základ[k], moje[k], jejich[k], slučPrvek = (b,m) => m)

  # 2. čítače samočíslování: maximum obou stran, základ se nepočítá
  pro každý autoInc atribut a ve výsledku:
     a.posledni = max(a.posledni, moje…a.posledni, jejich…a.posledni)

  # 3. entity
  výsledek.entities = slučPodleId(základ.entities, moje.entities, jejich.entities,
      slučPrvek  = (b,m,j) => { r = slučEntitu(b,m,j); zaznamenej spory; return r.entita },
      onOživeno  = (e,strana) => zaznamenej oživení)

  # 4. úklid až po sloučení
  výsledek.zahozenychOdkazu = uklidOdkazy(výsledek)
  return { data: výsledek, zpráva }


slučPodleId(základ, moje, jejich, slučPrvek, onOživeno):
  zůstane = {}
  pro každé id ze sjednocení všech tří stran:
     jeB, jeM, jeJ = id je v základu / v mých / v jejich
     pokud !jeB:                    zůstane += id pokud jeM || jeJ ; další
     pokud jeM && jeJ:              zůstane += id ; další
     pokud !jeM && !jeJ:            další                      # smazali oba
     pokud jeM && !jeJ:             pokud změnil(základ, moje): zůstane += id; onOživeno(moje, 'moje')
                                    další
     pokud změnil(základ, jejich):  zůstane += id; onOživeno(jejich, 'jejich')

  vyřeš(id):
     b,m,j = položky
     pokud m && j:
        pokud změnil(b,m) && změnil(b,j): return slučPrvek(b,m,j)
        return změnil(b,j) ? j : m
     return m || j

  # pořadí: nejdřív moje, pak co přibylo od druhého
  return [ vyřeš(id) pro id v mém pořadí ] ++ [ vyřeš(id) pro id v jejich pořadí, co ještě není ]


slučEntitu(základ, moje, jejich):
  e = hluboká kopie moje ; spory = []

  vezmi(pole, hodB, hodM, hodJ, nastav):
     pokud !změnil(hodB, hodJ):  return              # oni nic → moje
     pokud !změnil(hodB, hodM):  nastav(hodJ); return # jen oni → jejich
     pokud hodM != hodJ:         spory += pole        # oba jinak → moje, ale ohlásit

  pro každý skalár: vezmi(...)
  pro každý klíč atributů: vezmi(...)     # prázdná hodnota klíč maže
  e.aspects   = členství(základ.aspects, moje.aspects, jejich.aspects)
  e.relations = členství podle klíče (relationTypeId, targetId)
  e.customAttributes / comments / objects = slučPodleId(...)
  e.updatedAt = pozdější z (moje.updatedAt, jejich.updatedAt)
  return { entita: e, kolize: spory }


členství(základ, moje, jejich):
  out = moje
  out += { k z jejich : k není v základu }     # co druhý přidal
  out -= { k ze základu : k není v jejich && k je v mých }   # co druhý odebral
  out += { k z mých : k není v základu }       # co jsem přidal já
  return out


ulož(tiché):
  pokus(n):
     odpověď = PUT(obsah = moje data, sha = ghSha)
     pokud 409 nebo 422:
        pokud n >= 3: chyba „vzdáno"
        slučSVzdáleným()        # posune základ i ghSha
        return pokus(n+1)
     return odpověď
  výsledek = pokus(0)
  ghSha = výsledek.content.sha
  dirty = false ; základ = snímek(moje data)
  poslední známý commit = výsledek.commit.sha      # ať vlastní commit nevypadá jako cizí


slučSVzdáleným(cesta, tiché):
  (text, sha) = stáhni(cesta)                  # se záložním čtením blobu nad 1 MB
  pokud sha == ghSha && základ existuje:       „nic nového" ; konec
  jejich = mergeEmpty(JSON.parse(text))
  základ = máme základ ? základ : prázdný projekt
  pokud tiché && jinýProjekt(základ, jejich):  banner s otázkou ; konec
  pokud tiché && !dirty && !editor:            moje = jejich ; základ = jejich ; ghSha = sha ; konec
  výsledek = slučProjekty(základ, moje, jejich)
  moje = výsledek.data
  základ = kopie jejich            # NE sloučená data — ghSha ukazuje na jejich soubor
  ghSha = sha
  ohlasSloučení(výsledek.zpráva, tiché)
  pokud !editor: překresli
```

## 3.3 Invarianty

Osm vět, které se nesmí porušit. Každá z nich stojí na chybě, která se už jednou stala:

1. **`sha` se neobnovuje jen proto, aby zápis prošel.** Posílá se verze, ze které jsme vyšli.
2. **Po sloučení je základem *jejich* verze**, ne sloučená data — `ghSha` ukazuje na jejich soubor.
3. **Identita vazby je `(relationTypeId, targetId)`**, nikdy `id`.
4. **Smazat smí jen ten, koho se druhý nedotkl.** Úprava přebíjí smazání, oživení se hlásí.
5. **Sloučení nikdy neblokuje a nikdy se neptá** (jedinou výjimkou je jiný projekt). Žádný zámek, žádná kontrola vstupu, žádný dialog.
6. **Spor a oživení se hlásí vždycky**, i při tichém sloučení, a v prvku, který sám nezmizí.
7. **Úklid odkazů běží po sloučení**, ne před ním.
8. **Čítače samočíslování se slučují maximem**, ne vítězem střetu.

K tomu dvě bezpečnostní: **token, API klíč ani jméno autora nepatří do dat projektu, do ladicího výpisu ani do adresy** — jen do úložiště prohlížeče. A **dokud soubor doopravdy nenačteme, neukládá se nic.**

## 3.4 Testovací scénáře

Minimum, kterým musí každá implementace projít. Všechny se dají napsat jako čistý test nad třemi JSONy, bez sítě a bez prohlížeče:

| # | Scénář | Očekávání |
|---|---|---|
| 1 | každý přidá jinou entitu | obě zůstanou |
| 2 | každý změní **jiný atribut** téže entity | obě změny zůstanou, žádný spor |
| 3 | každý změní **týž** atribut jinak | moje vyhraje, **spor ohlášen** |
| 4 | smažu entitu, druhý se jí nedotkl | **zmizí**; `smazanoEntit` se nezvyšuje (to je moje vlastní smazání) |
| 4b | druhý smaže entitu, já se jí nedotkl | **zmizí** a ohlásí se v `smazanoEntit` |
| 5 | smažu entitu, druhý ji změnil | **zůstane**, ohlášena jako oživená |
| 6 | každý přidá téže entitě **jinou** vazbu | obě zůstanou (test na `id` vs. dvojice) |
| 7 | oba přidají **tutéž** vazbu | je jednou, žádný spor |
| 8 | druhý smaže entitu, na kterou mám vazbu | vazba se uklidí, počet se ohlásí |
| 9 | každý přidá entitu se samočíslujícím číslem | čítač je **maximum**, nikoli moje hodnota |
| 10 | žádný základ (nový projekt do cizího souboru) | sjednocení, nic cizího nezmizí |
| 11 | dvě ukládání naráz | druhé narazí na konflikt, sloučí a projde |
| 12 | soubor přes 1 MB | načte se přes blob, ne jako prázdný řetězec |
| 13 | soubor bez jediné společné entity | **otázka**, ne sloučení |
| 14 | nemám nic rozdělaného | jejich verze vcelku, obrazovka **zticha** |
| 15 | spor s otevřeným editorem | sloučí se, **nepřekreslí**; při uložení se entita sloučí znovu |
| 16 | změnil jen druhý | jeho verze entity se bere vcelku, po atributech se nic neporovnává |

Negativní testy patří ke každému bodu: že se neohlásí spor tam, kde žádný není (bod 2 a 7), je stejně důležité jako že se ohlásí tam, kde je.

---

# ČÁST 4 — ZADÁNÍ PRO AI

Následující text je napsaný tak, aby se dal předat jako zadání modelu, který má totéž postavit nad formátem `dkmdata` v jiné aplikaci.

---

## Zadání

Postav víceuživatelskou práci nad jedním souborem ve formátu `dkmdata` uloženým v repozitáři (GitHub nebo jiné úložiště s podmíněným zápisem). Aplikace běží **bez serveru**: veškerá logika je u klienta, úložiště je hloupé.

**Autorita formátu** je `dkmdata-scheme.json` (JSON Schema 2020-12, samonosné). Části 1–3 tohoto dokumentu popisují formát slovně a referenční implementaci v `dkm/index.html`.

### Co postavit

1. **Trojcestné sloučení** `slučProjekty(základ, moje, jejich) → {data, zpráva}` podle § 2.5 a pseudokódu v § 3.2. Je to čistá funkce nad třemi JSONy: žádná síť, žádný DOM, žádný globální stav. Napiš ji jako takovou a testuj ji jako takovou.
2. **Optimistický zápis**: posílej verzi, ze které jsi vyšel (`sha`, ETag, generace — podle úložiště). Při odmítnutí stáhni, sluč a zkus znovu, nejvýš třikrát.
3. **Hlídání cizích změn**: nejlevnější dotaz, jaký úložiště nabízí (poslední commit, ETag, `If-None-Match`), jen když je okno vidět, adaptivní tempo řádu desítek sekund při práci a jednotek minut v klidu.
4. **Hlášení**: tři úrovně — mlčení (běžný průběh tichého sloučení), přechodná hláška (ruční sloučení), trvalý prvek (spor, oživení). Žádný dialog.
5. **Úklid odkazů** po každém sloučení.
6. **Záložní čtení** pro soubory nad limit úložiště a **pojistku, že se nic neukládá, dokud se soubor doopravdy nenačetl**.

### Co dodržet

- **Osm invariantů z § 3.3.** Každý z nich je oprava skutečné chyby; porušený invariant znamená tichou ztrátu cizí práce.
- **Nikdy neptej uživatele, co se má sloučit.** Sloučení nikdy nesebere rozdělanou práci; jen přidává. Jediná legitimní otázka je „na té cestě je úplně jiný projekt".
- **Nikdy neblokuj sloučení kontrolou vstupu.** Zámek záznamu, omezení cíle vazby, povinné pole, uzavřený číselník — nic z toho se při slučování neuplatňuje. Sloučení není uživatelská akce; kdyby ho kontrola zastavila, obě kopie souboru by se trvale rozešly. Hodnota, která kontrole nevyhovuje, se **označí**, ne smaže.
- **Nikdy nepřerovnávej data.** Pořadí v souboru je uživatelovo. Řadí se až to, co je vidět.
- **Tajemství jen do úložiště prohlížeče.** Token ani API klíč nesmí být v datech projektu, v ladicím výpisu ani v adrese.
- **Identita před časem.** O vítězi rozhoduje struktura rozdílu, ne hodiny klienta.
- **Čas úpravy se nepočítá jako změna.** Při porovnávání dvou verzí `updatedAt` přeskakuj — jinak bude „změněno" všechno.

### Jak to ověřit

Patnáct scénářů z § 3.4, každý jako čistý test nad třemi JSONy. K tomu:

- validace vstupu i výstupu proti `dkmdata-scheme.json` **dvěma validátory** a **vždy i negativně**,
- test souběhu: dva klienti ukládající do téhož souboru v cyklu, na konci musí mít oba všechno,
- test velkého souboru (nad limit úložiště),
- test „prázdný základ": první uložení do cizího souboru nesmí nic smazat.

Samotné „nula chyb" nedokazuje nic. Dokazuje to až negativní test, který doopravdy propadne.

### Čeho se vyvarovat

Chyby, které tenhle návrh vypadají jako zjednodušení, a přitom tiše ničí data:

| Zkratka | Co se stane |
|---|---|
| načíst `sha` těsně před zápisem | ochrana je vypnutá, poslední uložení přepíše cizí práci |
| „kdo uložil později, má pravdu" | ztratí se všechno, co druhý udělal mezitím |
| sloučit podle `updatedAt` celé entity | změna jediného atributu zahodí ostatní |
| identita vazby podle `id` | dvě nové vazby téže entity se hlásí jako spor, jedna zmizí |
| smazání vždy vyhrává | cizí úprava zmizí beze slova |
| dialog „přepsat / načíst / sloučit" | automatické ukládání se zastaví na otázce, kterou nikdo nevidí |
| po sloučení dát do základu sloučená data | další rozdíl se počítá proti něčemu, co v souboru nikdy nebylo |
| uklidit odkazy před sloučením | uklízí se proti zastaralému seznamu záznamů |
| naivní `atob(odpověď.content)` | soubor nad 1 MB vypadá jako poškozený, přitom je v pořádku |
| ukládat bez potvrzeného načtení | jedno neúspěšné načtení + automatické ukládání = přepsaná data |

---

## Související dokumenty

- `dkm/dkmdata-scheme.json`, `dkm/dkmpkg-scheme.json` — závazný popis formátů
- `dkm/docs-cs.md` kap. 34 (technické pozadí: úložiště v prohlížeči, GitHub API), kap. 37 (formáty a schémata)
- `dkm/CLAUDE.md` — sekce „Dva lidé na jednom souboru: sloučení místo přepsání" a „Sloučení běží samo; ptát se je výjimka"
- `dkm/dkm-sync-en.md` — anglická verze tohoto dokumentu
