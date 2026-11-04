# DKM — formát `dkmdata` a synchronizace více uživatelů

Dokument má čtyři části:

1. **Co z formátu je pro slučování podstatné** — zkratka; celý popis formátu je v `dkm-formats-cs.md`.
2. **Synchronizace** — jak v DKM funguje práce několika lidí nad jedním souborem v repozitáři.
3. **Programátorský popis** — mapa funkcí, pseudokód a invarianty, které se nesmí porušit.
4. **Zadání pro AI** — co udělat, aby táž synchronizace fungovala v jiné aplikaci postavené nad formátem `dkmdata`.

Anglické dvojče je `dkm-sync-en.md`; obsah je týž, texty jsou přeložené.

---

## 0. Co je tady autorita

Když si zdroje odporují, platí ten výš:

1. **`dkm/index.html`** — skutečné chování aplikace. Pro formát je kanonická funkce `mergeEmpty`: co projde jí, je platný `.dkmdata`.
2. **`dkm/dkmdata-scheme.json`** a **`dkm/dkmpkg-scheme.json`** — JSON Schema 2020-12. Strojově ověřitelný popis obou formátů, **samonosný**: neodkazuje na síť ani jedno na druhé, takže se dá zkopírovat celé, validovat offline nebo vložit AI do rozhovoru. Sdílené definice jsou proto v obou souborech duplicitně a **musí zůstat totožné**.
3. **`dkm/dkm-formats-cs.md`** (anglicky `dkm-formats-en.md`) — slovní popis formátu včetně toho, co schéma zachytit neumí: referenční integrita, identita při importu, tvar hodnoty podle typu atributu.
4. **Tento dokument** — synchronizace: mapa, souvislosti a návod. Při rozporu platí body výš.

Tenhle dokument se zabývá **jen synchronizací**. Kdo chce psát čtečku nebo zapisovatele souboru, potřebuje k němu `dkm-formats-cs.md`; obojí se posílá spolu.

---

# ČÁST 1 — CO Z FORMÁTU JE PRO SLUČOVÁNÍ PODSTATNÉ

**Celý popis formátu je v `dkm-formats-cs.md`** (anglicky `dkm-formats-en.md`) a strojově
v `dkmdata-scheme.json` / `dkmpkg-scheme.json`. Tady je jen to, na čem stojí pravidla
sloučení — kdo potřebuje soubor přečíst nebo zapsat, ať jde tam.

Synchronizace popsaná v části 2 se týká **výhradně `.dkmdata`**, tedy celého projektu.
Balíček `.dkmpkg` je jednorázový přenos, ne společný soubor.

## 1.1 Tvar projektu v kostce

```json
{ "version": 1, "projectName": "…", "ghPath": "vlastnik/repozitar/cesta/soubor.dkmdata",
  "settings": { "tabs": [], "modules": [] },
  "entityTypes": [], "aspects": [], "relationTypes": [], "selectLists": [], "tagSets": [],
  "savedViews": [], "jsonExports": [],
  "entities": [] }
```

Povinné je **jen `entities`**. Sedm kolekcí modelu (`entityTypes`, `aspects`,
`relationTypes`, `selectLists`, `tagSets`, `savedViews`, `jsonExports`) se slučuje jedním
pravidlem, `entities` druhým a `settings` se nesou jako skalár — viz § 2.5.

`ghPath` je **jediná věc kolem synchronizace, která patří do dat**. Token, jméno autora
komentářů, motiv, jazyk ani zapnuté automatické ukládání v souboru nejsou.

## 1.2 Vlastnosti formátu, bez kterých se sloučení nedá napsat

1. **Identifikátory jsou stabilní a nikdy se nepřečíslovávají.** Celé sloučení je sjednocení
   podle `id`; přečíslování by z každé entity udělalo novou.
2. **Identita vazby je dvojice `(relationTypeId, targetId)`, ne `id`.** `id` vazby si vyrábí
   každý klient sám, takže podle něj by se dvě nové vazby téže entity hlásily jako spor.
3. **Vazba se zapisuje jen u zdrojové entity.** Opačný směr se dopočítává; v datech není,
   takže se ani neslučuje.
4. **Vazba může vzniknout i atributem** typu `relation` — hodnota je `id` cílové entity,
   při `multi: true` pole `id`. Úklid odkazů (§ 2.5) musí sahat i tam, ne jen do `relations`.
5. **Prázdná hodnota se neukládá** — klíč se z `attributes` smaže. Chybějící klíč je normální
   stav, ne chyba. U `customAttributes` je nevyplněno prázdný řetězec, protože klíč smazat nelze.
6. **Složený atribut (`composed`) hodnotu nemá** — v datech je jeho šablona. Není co slučovat.
7. **`updatedAt` je čas úpravy obsahu.** Zamčení, připnutí ani oprava wiki odkazů jím nehýbe;
   při sloučení se bere pozdější z obou a o vítězi nerozhoduje (§ 2.15).
8. **Čítač samočíslování (`autoInc`, `posledni`) je v definici atributu**, tedy v modelu —
   a slučuje se jinak než zbytek modelu (§ 2.5).

## 1.3 Co schéma nevynucuje

JSON Schema umí tvar, ne vztahy. Zapisovatel se proto nesmí spoléhat jen na validaci:
**referenční integrita** (`typeId`, `aspects[]`, klíče `attributes`, `relationTypeId`,
`targetId`, `listId`, `tagSetId`, `targetType`, `scopeId`/`attrId` v pravidlech filtrů),
**shoda hodnoty s typem atributu** (typ je až v definici, ne u hodnoty), **jedinečnost `id`**
a **jedinečnost přidělených čísel** (`posledni` je čítač, ne rezervace). Úplný seznam odkazů
je v `dkm-formats-cs.md`, § 7.

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

**Na zápis platí týž limit, jen z druhé strany.** Contents `PUT` zůstává běžným malým
uložením; nad `GH_MEZ_VELKEHO` (1 MB bajtů obsahu) se commit skládá z Git Data API:
blob → `git/trees` s `base_tree` → `git/commits` → `PATCH git/refs/heads/{větev}`. Cesta
k projektu větev nenese (Contents API píše do výchozí větve), takže si ji Git Data API
musí zjistit z repozitáře — `ghVychoziVetev` ji pamatuje per repozitář.

**Pojistka proti přepsání se tím nesmí obejít**, a je to to jediné, na čem u téhle cesty
záleží. Contents API ji dělá za nás tím, že v těle `PUT`u pošleme `sha`. Git Data API
takový parametr nemá, takže se dělá ze dvou kusů:

1. **sha souboru se porovná s tou, ze které jsme vyšli** (`ghShaSouboru`). Nesedí-li,
   je to cizí zápis → konflikt. **Nikdy se nedotahuje čerstvá sha, aby zápis prošel.**
2. **Posun větve jde bez `force`.** Když mezitím někdo commitoval, náš rodič je zastaralý,
   posun není fast-forward a GitHub ho odmítne (422) → konflikt.

Oboje vrací **týž tvar odpovědi `{__konflikt:true}`**, jaký vrací 409/422 z Contents API,
takže smyčka „stáhni, sluč, zkus znovu" je na obě cesty jedna a o velkou cestu se nemusí
starat.

Dvě hraniční situace, na kterých se ta cesta jinak zasekne: **soubor ještě neexistuje**
(sha je `null` na obou stranách, takže se neporovnává nic a strom se jen přidá nad
`base_tree`) a **repozitář bez jediného commitu** — ten větev nemá, takže se commit
skládá bez rodiče, strom bez `base_tree` a větev se `POST git/refs` **zakládá**, ne
posouvá. Bez druhého případu skončí první uložení velkého projektu do čerstvého
repozitáře na 404.

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

**Autorita formátu** je `dkmdata-scheme.json` (JSON Schema 2020-12, samonosné) a slovně `dkm-formats-cs.md`; pošli si obojí s tímhle dokumentem. Části 2 a 3 popisují referenční implementaci v `dkm/index.html`.

### Co postavit

1. **Trojcestné sloučení** `slučProjekty(základ, moje, jejich) → {data, zpráva}` podle § 2.5 a pseudokódu v § 3.2. Je to čistá funkce nad třemi JSONy: žádná síť, žádný DOM, žádný globální stav. Napiš ji jako takovou a testuj ji jako takovou.
2. **Optimistický zápis**: posílej verzi, ze které jsi vyšel (`sha`, ETag, generace — podle úložiště). Při odmítnutí stáhni, sluč a zkus znovu, nejvýš třikrát.
3. **Hlídání cizích změn**: nejlevnější dotaz, jaký úložiště nabízí (poslední commit, ETag, `If-None-Match`), jen když je okno vidět, adaptivní tempo řádu desítek sekund při práci a jednotek minut v klidu.
4. **Hlášení**: tři úrovně — mlčení (běžný průběh tichého sloučení), přechodná hláška (ruční sloučení), trvalý prvek (spor, oživení). Žádný dialog.
5. **Úklid odkazů** po každém sloučení.
6. **Záložní čtení i zápis** pro soubory nad limit úložiště — a u obou **tutéž pojistku proti přepsání**: když obchozí cesta nemá parametr pro „píšu proti téhle verzi", nahraď ho porovnáním verze a podmíněným posunem (u GitHubu sha souboru + posun větve bez `force`). K tomu **pojistku, že se nic neukládá, dokud se soubor doopravdy nenačetl**.
7. **Base64 po blocích** nad `TextEncoder`em / `TextDecoder`em, ne `btoa(unescape(encodeURIComponent(…)))`.

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
| obchozí zápis bez porovnání verze | obejde se tím ochrana, kterou běžná cesta dělá sama — a je to vidět až na ztrátě dat |
| ukládat bez potvrzeného načtení | jedno neúspěšné načtení + automatické ukládání = přepsaná data |

---

## Související dokumenty

- `dkm/dkm-formats-cs.md` (anglicky `dkm-formats-en.md`) — závazný popis obou formátů
- `dkm/dkmdata-scheme.json`, `dkm/dkmpkg-scheme.json` — strojová schémata
- `dkm/docs-cs.md` kap. 34 (technické pozadí: úložiště v prohlížeči, GitHub API) — uživatelská příručka, formáty nepopisuje
- `dkm/CLAUDE.md` — sekce „Dva lidé na jednom souboru: sloučení místo přepsání" a „Sloučení běží samo; ptát se je výjimka"
- `dkm/dkm-sync-en.md` — anglická verze tohoto dokumentu
