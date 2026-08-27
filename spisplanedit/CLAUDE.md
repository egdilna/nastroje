# CLAUDE.md — Editor spisového plánu (spisplanedit)

## Co to je
Jednosouborový editor **spisového a skartačního plánu** (`index.html`, ~2284 řádků, ~105 kB)
pro české veřejnoprávní původce. Spravuje hierarchii věcných skupin a součástí, skartační
režimy, metadata plánu, soupis změn, poznámky, verzování a tiskovou sestavu.
Import a export je **XML podle NSESSS** (export ve verzi 4.0, některá pole odkazují na 3.1.2).

Doména je normativní — než změníš chování skartačních polí nebo XML výstupu, ověř si pravidla
NSESSS; formát je to, co ho dělá použitelným.

**Uživatelská dokumentace: `dokumentace.md` ve stejné složce (~26 kB).** Popisuje chování z pohledu uživatele — čti ji jako doplněk k tomuhle souboru a při změně chování ji aktualizuj spolu s kódem.

## Struktura souboru
Jeden `<script>`, členěný bannery `PROJECT STRUCTURE / NEW PROJECT / TREE RENDER /
ITEM SELECTION & DETAIL / FIELD UPDATE + CHANGELOG / ADD & DELETE ITEMS / MOVE ITEMS /
PLAN META FORM / CHANGELOG / VERSIONS / PRINT PREVIEW / FILE I-O: JSON / XML IMPORT /
XML EXPORT / DOWNLOAD HELPER / SIDEBAR RESIZE / KEYBOARD SHORTCUTS`.
CSS inline, **žádné externí zdroje** — nepřidávej je.

## Datový model
```js
project = { …metadata (název, identifikátor, vydavatel, IČO, autor, platnostOd/Do, komentář),
            nsesssVersion: '4.0', items: [ … ], zmeny: [ … ], poznamky: [ … ], verze: [ … ] }
item    = { id, typ: 'VecnaSkupina' | 'Soucast', znak, nazev, parentId, children: [],
            skartacniZnak, skartacniLhuta, skartacniRezim, datumOd, datumDo, puvod,
            bezpecnost, zpusob, xmlId, changeStatus, … }
```
Pravidla stromu, která musí platit:
- **Potomky může mít jen `VecnaSkupina`**; `Soucast` může mít jako potomky opět jen `Soucast`.
  Kontroly jsou v `updateItemButtons()` a v modalu přidání — nepodkopávej je.
- **Skartační hodnoty se zadávají jen u listových položek** (`isSkartacniList()`); u nadřazených
  skupin se sbírají z potomků (`collectSkartaceFromDescendants()`) a v tiskové sestavě se
  zobrazují sloučeně („A10, S5“), když si odpovídají 1:1.
- Spisové znaky se **dopočítávají hierarchicky** (`computeZnaky(items, prefix)`);
  `nextSignHint(parentId)` navrhuje znak nové položky, `updateZnakPreview()` ukazuje náhled.
  Ruční zásah do znaku nesmí rozbít odvození potomků.
- Výchozí datum nové položky (`defaultDatum`): datum otevření rodiče → `platnostOd` projektu → dnešek.

## Soupis změn a verze
- Každá úprava pole jde přes `updateField(id, field, value)`, který zapisuje do changelogu
  (`addChangelogEntry(type, desc, itemId)`). Pole se ukládají **automaticky při změně** —
  tlačítko „Uložit změny“ je jen zpětná vazba uživateli. Když přidáš nové pole, musí projít
  stejnou cestou, jinak se změna neobjeví v soupisu.
- `changeStatus` položky (nové / změněno / navrženo ke zrušení) se propisuje do odznaků ve stromu
  a do tiskové sestavy; pokud není nastaven explicitně, označí se automaticky.
- Verze (`createVersion`, `restoreVersion`, `exportVersionXML`) jsou snapshoty celého plánu.
  Obnovení verze je destruktivní — musí zůstat za potvrzením.

## XML (NSESSS)
- Import: `importXML()` → `parseVecnaSkupina(el, parentId)` rekurzivně; `getText(el, tag)` čte
  hodnoty. Import musí být tolerantní k chybějícím nepovinným elementům.
- Export: `exportXML()` → `generateXML(project)` → `serializeItem(item, indent)`;
  escapování přes `xmlEsc()`. **Vyřazování (skartační hodnoty) se serializuje jen u listových
  položek** — to je věcné pravidlo, ne optimalizace.
- Import i export musí zůstat vzájemně kompatibilní: export → import → export dá stejný výsledek.

## UI a přístupnost
- Strom je **přístupný `ul`/`li`/`a` seznam**, ne `role="tree"`: řádek je flex kontejner
  s toggle tlačítkem a odkazem, ikona je skrytá před odečítačem, odkaz míří na
  `#detail-content`, aby prohlížeč skočil na obsah. Tuto konstrukci zachovej.
- Panely jsou taby: Detail položky / Metadata plánu / Soupis změn / Poznámky / Verze /
  Tisková sestava (`switchTab(name)`, `#panel-*`, `#tab-*`).
- Modaly: `showModal(id)` / `hideModal(id)` + `handleModalKey(e)` (Escape).
- Klávesové zkratky: `n`, `o`, `s`, `e`, `ArrowLeft`/`ArrowRight` (odsazení/vyčlenění) —
  nesmí se spouštět při psaní do pole.
- Stavový řádek `#status-*` a hlášky `setMsg(msg, type)`; skip-link; postranní panel
  s tažením za `#sidebar-resize`.
- Vše česky, texty natvrdo. Uživatelský text vždy přes `escHtml()`.

## Tisková sestava
`buildPrintPreview()` staví samostatný panel s volbami „jen změněné“, „zobrazit změny“,
„zobrazit poznámky“ a tiskne přes `window.print()`. Při změně struktury položek zkontroluj
i tuhle sestavu — snadno se rozejde s detailem.

## Ověření změny
Nový projekt → věcné skupiny a součásti do několika úrovní → ověř dopočet znaků a zákaz
potomků u `Soucast` → skartační pole u listu a jejich souhrn u nadřazené skupiny →
přesuny (nahoru/dolů/odsadit/vyčlenit) → soupis změn → poznámky → uložení a načtení JSON →
export XML, jeho import zpět a opětovný export (porovnej) → verze a její obnovení →
tisková sestava → klávesové zkratky.
