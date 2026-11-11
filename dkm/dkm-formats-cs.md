# DKM — formáty souborů `.dkmdata` a `.dkmpkg`

Závazný popis obou souborových formátů **pro programátory**: pro toho, kdo chce s daty
DKM pracovat zvenčí vlastním skriptem, jiným nástrojem nebo přes AI. Popisuje, co
v souborech je, co v nich být musí a co z nich smí čekat čtečka.

Uživatelská příručka (`docs-cs.md`) formáty nepopisuje — je pro uživatele a pro ty,
kdo si v DKM navrhují datový model, ne pro implementátory.

Anglická verze tohoto dokumentu je `dkm-formats-en.md`; obsah je týž.

**Co je autorita, když si zdroje odporují** (platí ten výš):

1. **`dkm/index.html`**, konkrétně funkce `mergeEmpty` — co projde jí, to je platný `.dkmdata`.
2. **`dkm/dkmdata-scheme.json`** a **`dkm/dkmpkg-scheme.json`** — JSON Schema 2020-12.
3. **tento dokument** — slovní popis včetně toho, co schéma zachytit neumí.

Popis **synchronizace více uživatelů nad jedním souborem** (trojcestné sloučení,
optimistický zápis, pseudokód a zadání pro AI) je v `dkm-sync-cs.md` / `dkm-sync-en.md`.

---

## 1. Dva formáty a rozdíl mezi nimi

| | `.dkmdata` | `.dkmpkg` |
|---|---|---|
| Co obsahuje | **celý projekt** — model, všechny entity, uložené pohledy a nastavení | **výsek** — vybrané entity a jen ta část modelu, kterou potřebují |
| K čemu je | uložení a zálohování projektu, přenos mezi zařízeními, GitHub | přenos dat mezi dvěma projekty |
| Jak vznikne | Uložit (Ctrl+S), schránka, GitHub | Nastavení → Balíčky, nebo hromadná akce nad výběrem (příručka, kap. 28) |
| Poznávací značka | žádná — pozná se podle přípony a obsahu | povinný klíč `"format": "dkmpkg"` |
| Jak se načte | nahradí celý projekt | projde průvodcem importu, který mapuje model na cílový projekt |

Oba jsou prostý JSON v UTF‑8, bez komprese a bez obalení. `.dkmdata` je doslova
`JSON.stringify` vnitřního stavu aplikace — nic se do něj nepřidává ani neubírá.

---

## 2. Strojová schémata

Vedle aplikace leží dvě schémata v JSON Schema, draft 2020-12:

- **<https://nastroje.egdilna.cz/dkm/dkmdata-scheme.json>** — celý projekt
- **<https://nastroje.egdilna.cz/dkm/dkmpkg-scheme.json>** — přenosný balíček

Ve zdrojovém kódu je najdeš jako `dkm/dkmdata-scheme.json` a `dkm/dkmpkg-scheme.json`.

Obě schémata jsou **samonosná**: neodkazují se na sebe navzájem ani na nic na síti,
takže jedno stačí zkopírovat celé a validovat offline — nebo vložit AI do rozhovoru.
Sdílené definice (entita, definice atributu, typ entity, aspekt, typ vazby, číselník,
vazba, komentář, objekt, vlastní atribut, hodnota atributu) jsou v obou souborech
záměrně totožné. Každá vlastnost má popis, který říká nejen tvar, ale i význam.

Příklad kontroly v Pythonu:

```python
import json
from jsonschema import Draft202012Validator

schema = json.load(open('dkmdata-scheme.json'))
data   = json.load(open('projekt.dkmdata'))

v = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
for e in sorted(v.iter_errors(data), key=lambda e: list(e.path)):
    print('/' + '/'.join(map(str, e.path)), '→', e.message)
```

`format_checker` je potřeba dodat výslovně — bez něj většina validátorů klíč `format`
jen zaznamená a časová razítka nezkontroluje. V JavaScriptu si totéž vyžádá
`ajv-formats` vedle `ajv`.

---

## 3. Projekt `.dkmdata` — nejvyšší úroveň

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

Povinné je **jen `entities`**; všechno ostatní si `mergeEmpty` doplní prázdné, takže
`{"entities":[]}` je platný projekt. `version` chybějící znamená 1.

`additionalProperties` je na téhle úrovni **`false`** a je to záměr: čtečka neznámé klíče
doopravdy zahodí, takže schéma popisuje skutečné chování, ne přání. Uvnitř entit je
naopak `true` — viz § 10.

`ghPath` je trojice `vlastník/repozitář/cesta` a je **jediná věc kolem synchronizace,
která patří do dat**. Token, jméno autora komentářů, motiv, jazyk ani zapnuté automatické
ukládání v souboru nejsou (§ 11).

---

## 4. Model

| Kolekce | Co to je | Klíčová pole |
|---|---|---|
| `entityTypes` | typ entity — pojmenovaná sada atributů | `id`, `name`, `icon`, `attributes[]`, `sablonaDetailu`, `nazevZe`, `jsonKey` |
| `aspects` | **průřezová** sada atributů, přidatelná entitě nezávisle na typu | totéž + `pinned` |
| `relationTypes` | typ vazby | `id`, `name`, `reverseName`, `scope`, `fromTypes[]`, `toTypes[]` |
| `selectLists` | číselník | `id`, `name`, `values[]` |
| `tagSets` | soustava tagů | `id`, `name`, `tags[]`, `uzavrena` |
| `savedViews` | uložený pohled (filtr + zobrazení) | `id`, `name`, `filter`, `attrFilters[]` |
| `jsonExports` | profil exportu do JSON/XML | `id`, `name`, `keyOverrides`, `vynechane` |
| `settings` | `tabs[]` (lišta záložek), `modules[]` (složky záložek), volitelně `legUrl` | `legUrl` = adresa knihovny v Legislativním prohlížeči (Nastavení → EG); u ustanovení se z ní skládá odkaz `…&pohled=ust&predpis=rok/číslo&ust=klic` |

Definice atributu (`attributes[]` u typu i u aspektu) nese `id`, `name`, `type` a podle
typu další pole: `listId` (číselník), `tagSetId` (soustava tagů), `targetType` a `multi`
(vazba), `template` (složený atribut), `min` / `max` / `krok` / `jednotka` (posuvník),
`autoInc` / `posledni` (samočíslování), `filtrCile[]` (omezení cíle vazby podmínkami)
a čtyři přepínače zobrazení (`hidden`, `copyable`, `highlight`, `hideEmpty`).

Typy atributů: `text`, `textarea`, `date`, `url`, `select`, `yesno`, `relation`, `number`,
`range`, `checklist`, `tags`, `composed`, `ustanoveni`, `rpp`.

**Rozsah vazby** (`relationTypes[].scope`) je `universal`, `from`, `to` nebo `specific`.
Prázdné `fromTypes` / `toTypes` znamená **„cokoli"**, ne „nic" — viz § 7.

---

## 5. Entita

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

Povinné je jen `id`. Co se v JSONu nevidí:

- **Identifikátor se nikdy nepřečísluje.** Stojí na něm veškeré odkazování i rozpoznání
  entit při opakovaném importu balíčku (§ 9).
- **`id` vazby neznamená nic** — slouží k jejímu odebrání v rozhraní. Identita vazby je
  dvojice `(relationTypeId, targetId)`; to je podstatné pro slučování (viz `dkm-sync-cs.md`).
- **Vazba může vzniknout i atributem** typu `relation`. Pro model je to plnohodnotná vazba,
  jen zapsaná jinde než v `relations`.
- **`nazevZe`** je identifikátor složeného atributu, ze kterého se skládá název; DKM
  vyhodnocenou šablonu při uložení zkopíruje do `name`. Prázdný řetězec znamená „název
  si píšu sám", chybějící klíč „dědí se z typu nebo aspektu".
- **`updatedAt` je čas úpravy obsahu.** Zamčení, připnutí ani oprava wiki odkazů jím nehýbe.
- Časové údaje jsou ISO 8601 v UTC s koncovým `Z` (`new Date().toISOString()`).

---

## 6. Hodnoty atributů podle typu

Hodnoty entity leží v `attributes` pod **identifikátorem** definice atributu, ne pod
jejím názvem. Tvar hodnoty se řídí typem té definice:

| Typ atributu | Tvar hodnoty | Poznámka |
|---|---|---|
| `text`, `url` | řetězec | |
| `textarea` | řetězec | vykresluje se jako Markdown s CriticMarkup |
| `date` | řetězec `RRRR-MM-DD` | ne plné ISO razítko — je to hodnota HTML pole typu date |
| `number` | číslo | opravdu číslo, ne řetězec s číslicemi; u `autoInc: true` ho přiděluje DKM z `posledni` (příručka, kap. 7.1b), ale v datech je to pořád obyčejné číslo |
| `range` | číslo | posuvník (příručka, kap. 7.1c); rozsah a krok drží definice (`min`, `max`, `krok`), jednotka je jen popisek pro zobrazení. Hodnota mimo rozsah je platná — DKM ji nepřepisuje |
| `checklist` | pole objektů `{text, hotovo}` | řádky patří **entitě**, ne definici atributu (příručka, kap. 7.1d); pořadí v poli je pořadí na obrazovce; `hotovo` smí chybět a znamená nehotový řádek |
| `ustanoveni` | objekt `{predpis, par, odst, pism, bod, …}` | zadání (`predpis` = „číslo/rok“) a výsledek načtení z e-Sbírky: `citace`, `druh` (2. pád), `nazev`, `zneni` (datum účinnosti), `klic` (cesta fragmentu za `/dokument/`), `eli`, `text`, `cely` (celý paragraf), `nacteno`; text je v datech, aplikace se při zobrazení na API neptá |
| `rpp` | objekt `{druh, id, nazev}` | `druh` je `agenda`, `ovm`, `kategorie`, `isvs`, `udaj` nebo `cinnost`; `id` krátký kód nebo plný identifikátor RPP; `nazev` píše uživatel; aplikace z toho skládá odkaz na detail v prohlížeči RPP |
| `yesno` | `true` / `false` | |
| `select` | řetězec | musí být jednou z hodnot navázaného číselníku |
| `tags` | pole řetězců | každý je jeden tag z navázané soustavy (`tagSetId`); DKM je ukládá abecedně |
| `relation` | identifikátor entity | při `multi: true` pole identifikátorů |

**Prázdná hodnota se neukládá.** DKM klíč z `attributes` rovnou smaže, takže `null`
ani `""` v čerstvě zapsaných datech nevzniká a chybějící klíč je normální stav.
Schéma obojí toleruje, aby prošla i data z cizí ruky. Výjimkou jsou vlastní atributy
entity (`customAttributes`), kde klíč `value` smazat nelze — nevyplněno je tam prázdný
řetězec.

Vazby v `relations` se zapisují **jen u zdrojové entity**. Opačný směr (sekce
„Odkazuje sem") si DKM dopočítává; v datech se neduplikuje. Kdo by ho zapsal na obě
strany, dostane každou vazbu dvakrát.

---

## 7. Co schéma neuhlídá: odkazy uvnitř souboru

JSON Schema umí zkontrolovat tvar, ne ale to, že odkaz někam vede. Tohle si musí
ohlídat čtečka i ten, kdo soubor vyrábí:

| Odkaz | Musí ukazovat na |
|---|---|
| `entities[].typeId` | `entityTypes[].id`, nebo `null` |
| `entities[].aspects[]` | `aspects[].id` |
| klíč v `entities[].attributes` | `id` definice atributu na typu entity nebo na některém jejím aspektu |
| `entities[].relations[].relationTypeId` | `relationTypes[].id` |
| `entities[].relations[].targetId` | `entities[].id` |
| hodnota atributu typu vazba | `entities[].id` (při `multi` pole identifikátorů) |
| `…attributes[].listId` | `selectLists[].id` |
| `…attributes[].tagSetId` | `tagSets[].id` |
| `…attributes[].targetType` | `entityTypes[].id`, nebo `any` |
| `…attributes[].filtrCile[].scopeId` | `entityTypes[].id` nebo `aspects[].id` (podle `scope`); u `scope: "system"` je `null` |
| `…attributes[].filtrCile[].attrId` | `id` definice atributu **na tom** typu či aspektu; u `scope: "system"` klíč `name` |
| `…attributes[].filtrCile[].value` u `op: "targetIs"` | `entities[].id` |
| `relationTypes[].fromTypes[]`, `toTypes[]` | `entityTypes[].id` |
| `settings.tabs[].typeIds[]`, `aspectId`, `tagSetId`, `viewId`, `entityId`, `typeId` | `entityTypes[].id`, `aspects[].id`, `tagSets[].id`, `savedViews[].id`, `entities[].id` — podle druhu záložky |
| `settings.tabs[].modulId` | `settings.modules[].id`. Neplatný odkaz čtečka **zahodí** a záložka se tím stane společnou — zmizet nesmí |

Identifikátory jsou v rámci souboru jedinečné. DKM tvoří tvar `předpona_<čas><náhoda>`
(`e_lz3k9a1b2c`), ale formát to nevynucuje — stačí, aby byl řetězec jedinečný a stabilní.

Visící odkaz aplikaci nesloží: vazbu na neexistující cíl prostě nezobrazí. Data jsou
tím ale poškozená a při dalším exportu se ztráta rozšíří.

**Prázdný seznam znamená „cokoli", ne „nic".** Platí to u `fromTypes` a `toTypes`
u typu vazby: neprázdný seznam omezuje, prázdný seznam i chybějící klíč nechává vazbu
volnou. Kdo to přečte obráceně, zakáže všechno. Omezení se navíc čte jen podle `scope` —
u `from` se dívá na `fromTypes`, u `to` na `toTypes`, u `specific` na obojí, u `universal`
na nic.

**Omezení cíle (`filtrCile`) je schválně přísnější ve schématu než ve čtečce.** Pole smí
nést jen operátory, které jsou u **nevyplněné** hodnoty nepravdivé, a schéma je proto
vypisuje výčtem. Záporné operátory (`notEquals`, `notContains`, `empty`, `isFalse`, `notIn`,
`hasNotTag`, `hasNoTags`, `hasNoTarget`) tam chybí záměrně: entita, která ten atribut vůbec
nemá, by jimi prošla, takže by omezení místo zúžení pustilo i všechno ostatní. V uloženém
pohledu (`savedViews[].filter.attrFilters`) jsou tytéž operátory dál **povolené** — tam se
filtruje už hotový seznam, ne nabídka. `mergeEmpty` jiný operátor nezahodí; soubor s ním
projde načtením, jen se bude chovat špatně, proto to hlídá schéma.

Pole `filtrCile` je nepovinné a dává smysl jen u atributu typu `relation`. Prázdné pole
i chybějící klíč znamenají „bez omezení" — stejně jako prázdné `fromTypes` u typu vazby.
Hodnota, která omezení přestane splňovat, se u entity **nemaže**; zůstane uložená
a aplikace ji jen označí.

---

## 8. Balíček `.dkmpkg` — nejvyšší úroveň

```json
{ "format": "dkmpkg", "version": 1, "kind": "model",
  "exportedFrom": "…", "exportedAt": "2026-09-08T…", "description": "",
  "model": { "entityTypes": [], "aspects": [], "relationTypes": [], "selectLists": [], "tagSets": [] },
  "entities": [] }
```

Povinné je `format` a `entities`. `kind: "model"` s prázdnými `entities` je **přenos
modelu**; jinak jde o výřez entit a tu část modelu, kterou si vyžádaly. Balíček nenese
nastavení, záložky, moduly ani uložené pohledy.

Entity a definice v balíčku mají **týž tvar** jako v `.dkmdata` — sdílené definice jsou
v obou schématech záměrně totožné (§ 2).

---

## 9. Identita při importu balíčku

Entita se poznává podle `id`, ne podle názvu. Balíček identifikátory zachovává, takže
opakovaný import týchž dat se pozná jako konflikt existujících entit a nabídne přepsání
či sloučení — nezaloží druhou sadu záznamů. Kdo balíček vyrábí mimo DKM, musí proto
identifikátory držet **stabilní mezi vydáními**; jinak se data při každém importu
zduplikují. Párování podle názvu jde zapnout jen v podrobném režimu průvodce (příručka, kap. 28.3)
a je to nouzové řešení pro data, která společnou historii identifikátorů nemají.

Model v balíčku je zúžený na to, co vybrané entity potřebují. Má to dva důsledky:

- **Vazby mimo balíček se při exportu zahodí**, aby v souboru nezůstal odkaz na entitu,
  která v něm není. Rozšíření výběru o sousedy nebo o celou souvislou komponentu tomu
  předejde (příručka, kap. 28.1).
- **`fromTypes` a `toTypes` u přenášených typů vazeb mohou odkazovat na typy, které
  v balíčku nejsou.** Omezení pak v cílovém projektu nesedí a průvodce zakládá typ
  vazby bez něj.

---

## 10. Kanonický tvar a starší zápisy

Číselníky prošly sjednocením a čtečka dodnes toleruje starší tvar. Kdo soubor vyrábí,
má psát jen kanonický sloupec:

| Kanonicky | Zastarale | Co s tím DKM udělá |
|---|---|---|
| `selectLists[].values` | `selectLists[].options` | při načtení překlopí do `values` a starý klíč zahodí |
| `…attributes[].listId` | `…attributes[].selectListId` | při načtení překlopí do `listId` a starý klíč zahodí |
| číselník v `selectLists` | hodnoty přímo v `…attributes[].options` | čte se už jen jako záchytná síť |
| jméno autora v prohlížeči | `settings.userName` | převezme si ho k sobě a z dat smaže |
| `settings.tabs` | `settings.visibleTypeTabs`, `visibleAspectTabs`, `savedViews[].pinned` | z nich poskládá lištu a zastaralé klíče z dat zahodí |

`settings.userName` odešel proto, aby nad jedním projektem mohlo pracovat víc lidí —
jméno autora komentářů patří konkrétnímu prohlížeči, ne sdíleným datům.

---

## 11. Co načtení přežije a co ne

- **Neznámý klíč na nejvyšší úrovni `.dkmdata` se při načtení zahodí.** Čtečka
  přebírá jen klíče, které zná, takže vlastní metadata vedle `entities` nepřežijí
  první uložení. Schéma na to upozorní chybou (`additionalProperties: false`).
- **Neznámý klíč uvnitř entity se zachová.** Entity procházejí načtením i uložením
  beze změny, takže vlastní příznak u záznamu přežije. Schéma ho proto povoluje.
- **Chybějící kolekce se doplní jako prázdné pole.** Minimální platný soubor je
  `{"entities": []}`; `version` chybějící znamená 1.

---

## 12. Co v souborech nikdy není

Do dat projektu se **neukládají žádná tajemství**. GitHub token, klíč k AI ani jméno
autora komentářů v souboru nejsou a nikdy nebudou — drží je jen prohlížeč (příručka, kap. 34.2).
`ghPath` nese pouze cestu ve tvaru `vlastník/repozitář/cesta/soubor.dkmdata`, nikoli
přístup k ní. Soubor `.dkmdata` je proto možné poslat dál nebo commitnout, aniž by
s sebou vzal přihlašovací údaje — obsahuje ale všechna data projektu, takže o jejich
citlivosti platí to, co u dat samotných.


---

---

## 13. Jak soubor ověřit

Schémata se v repozitáři ověřují **dvěma validátory** — `python -m jsonschema`
a `ajv` ve strict režimu —, proti **skutečným souborům z aplikace** (`state.data`
a výstup `buildPackageObj`) a **vždycky i negativně**: že vadná data opravdu propadnou.
Samotné „nula chyb" nedokazuje nic.

Co ověřit negativně aspoň:

- chybějící povinný klíč (`entities`, u balíčku `format`),
- neznámý klíč na nejvyšší úrovni `.dkmdata` (musí propadnout, § 10),
- hodnota mimo číselník u `select`,
- `date` v plném ISO tvaru (musí propadnout, § 6),
- číslo zapsané řetězcem u `number` a `range`,
- záporný operátor ve `filtrCile` (musí propadnout, § 7).

**Když měníš tvar dat, uprav obě schémata i tenhle dokument.** Kanonickým zdrojem pravdy
zůstává `mergeEmpty`.

---

## Související dokumenty

- `dkm/dkmdata-scheme.json`, `dkm/dkmpkg-scheme.json` — strojová schémata
- `dkm/dkm-sync-cs.md` — synchronizace více uživatelů nad jedním souborem
- `dkm/docs-cs.md` — uživatelská příručka (práce s daty, ne jejich formát)
- `dkm/dkm-formats-en.md` — anglická verze tohoto dokumentu
