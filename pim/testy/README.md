# Testy PIM

Automatické testy jezdí proti **skutečnému `pim/index.html`** v bezhlavém Chromiu
(Playwright). Nic se nemockuje: aplikace se načte tak, jak ji dostane uživatel,
nasypou se do ní data a klikne se. Kontroluje se výsledek v DOM a v `db`,
ne vnitřní implementace.

## Spuštění

```bash
node pim/testy/spustit.mjs              # všechny sady
node pim/testy/spustit.mjs integrita    # jen sady s „integrita" v názvu
node pim/testy/integrita-obsahu.mjs     # jedna sada s podrobným výpisem
```

Sada je úspěšná, jen když skončí nulovým kódem **a** nevypíše `✗`, `SELHALO`
ani chybu stránky. Nezachycená výjimka v aplikaci je selhání testu — tiché chyby
jsou přesně to, čemu se tady předchází.

Playwright se hledá na `/opt/node22/lib/node_modules/playwright`. Jinde ho
doinstalujte (`npm i -D playwright && npx playwright install chromium`) a cestu
upravte v `lib.mjs`.

## Co která sada hlídá

| Sada | Čemu předchází |
|---|---|
| `integrita-obsahu.mjs` | **Nejdůležitější.** Nástroj otevřený nad výřezem textu (editor sekce) uloží výřez do celého těla a zbytek beze slova zmizí. |
| `odolnost.mjs` | Rozdělování sekcí ujede na ošklivém obsahu (kód, co vypadá jako nadpis; dva stejné nadpisy; CRLF) a uloží se přes cizí text. |
| `datova-integrita.mjs` | Hromadné akce, koš, export/import a editory tabulky a seznamu přepíšou víc, než měly. |
| `editor-sekce.mjs` | Návrat z celoobrazovkových nástrojů do editoru sekce. |
| `paleta.mjs` | Paleta příkazů: otevírání, hledání, kontextové příkazy, limit vykreslení. |
| `kanban.mjs` | Prázdné sloupce kanbanu a jejich výška. |
| `limit-vse.mjs`, `limit-pohledu.mjs` | Strop na počet vykreslených řádků seznamu. |
| `filtr-v-pohledu.mjs` | Rychlé hledání uvnitř uloženého pohledu. |
| `hromadny-export.mjs` | Hromadný výběr drží entity i po překreslení seznamu. |
| `vyber-entity.mjs` | Dialog Vybrat entitu hledá i podle typu a bez diakritiky. |
| `anotace.mjs` | Inline anotace `(>text)` se nevykreslují doslova a nejdou do exportu. |
| `skryte-ukoly.mjs` | Skrytí hotových úkolů přežije zaškrtnutí dalšího. |
| `klavesy.mjs` | Klávesové zkratky a accesskey se nepřekrývají. |
| `staticky-prohlizec.mjs` | Vygenerovaný offline prohlížeč se načte a ukazuje totéž. |

## Psaní nové sady

`lib.mjs` má společnou výbavu — `otevriAplikaci`, `nasypej`, `otevriDetail`,
`otevriSekci`, `odklikniPotvrzeni`, `ok`, `uzavri`. Kostra:

```js
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo, uzavri } from './lib.mjs';
const s = novySoucet('Název sady');
const { prohlizec, stranka } = await otevriAplikaci(s);
await nasypej(stranka, [{ id: 'e1', title: 'T', aspects: ['Note'], body: 'text' }]);
ok(s, (await telo(stranka, 'e1')) === 'text', 'tělo sedí');
await prohlizec.close();
process.exit(uzavri(s));
```

**Pravidlo kanárků:** když test sahá na obsah, dej do každé sekce unikátní značku
(`Kanarek-A`, `Kanarek-B`…) a po operaci ověř, že žijí všechny, kterých se
operace neměla dotknout. Tohle chytá tichá přepsání, na která by se jinak
nepřišlo.

**Potvrzování je dvojí:** nativní `window.confirm` (přes `odpovidejNaPotvrzeni`)
a vlastní dialog `#dialog-confirm` (přes `odklikniPotvrzeni`). Když si spletete
který, test „projde" a nic přitom neověří.
