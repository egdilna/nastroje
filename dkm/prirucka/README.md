# Příručka DKM — jak vzniká

Ve složce jsou tři druhy souborů:

| Soubor | Co to je |
|---|---|
| `prirucka.md` | vlastní uživatelská příručka krok za krokem |
| `*.png` | snímky obrazovek, pojmenované podle identifikátoru obrazovky |
| `snimky.mjs` | generátor snímků |

## Jak se snímky jmenují

Podle **identifikátoru obrazovky** ze [`screens.md`](../screens.md) plus pořadové číslo:
`scrdetent1.png` je první snímek detailu entity, `dlgaddrel1.png` dialog přidání vazby.
Tečka v identifikátoru se v názvu souboru mění na pomlčku — `#scrallview.kanban` je
tedy `scrallview-kanban1.png`.

## Jak snímky přegenerovat

```
node snimky.mjs
```

Skript otevře `../index.html` v Chromiu (přes Playwright), **od nuly proklikáním postaví
ukázkový projekt „Projekty a úkoly"** a cestou pořídí všechny snímky. Trvá to
zhruba čtyři minuty a přepíše všechny `*.png` v této složce.

**Snímky jsou mezi běhy shodné.** Skript před spuštěním aplikace zmrazí čas
(10. 12. 2026 9:30) a nahradí `Math.random` předvídatelným generátorem — bez toho
by se v každém běhu měnila časová razítka a identifikátory entit (`uid()` je skládá
z obou) a regenerace by dělala binární změny, které nic neříkají. Dvojí spuštění za
sebou proto dá bajtově stejné soubory a v gitu se objeví jen to, co se opravdu změnilo.

Datum je vybrané schválně: prosinec 2026 je měsíc, ve kterém má ukázkový projekt termín,
takže snímek kalendáře není prázdný.

Data se nikde nepředvyplňují — projekt vzniká stejnými kroky, jaké příručka popisuje.
Když se tedy postup v aplikaci změní, skript spadne a je vidět, že příručka přestala
platit.

## Proč to nemůže vyrobit zavádějící obrázek

Před každým snímkem si skript přečte `data-scr` z otevřené obrazovky nebo dialogu
a porovná ho s tím, co se chystá vyfotit:

```js
await snimek(p, 'scrdetent');            // musí být na detailu entity
await snimek(p, 'scrallview.kanban', { presne: true });  // včetně režimu zobrazení
```

Když identifikátor nesedí, skript skončí chybou a snímek nevznikne. Do příručky se tak
nemůže dostat obrázek s popiskem, který neodpovídá skutečnosti.

## Když skript spadne

Chybová hláška říká, na které obrazovce aplikace skutečně je:

```
Error: Snímek dlgexppkg: aplikace je na dlgexphub, ne na dlgexppkg.
```

Obvykle to znamená jedno ze tří:

- v aplikaci se změnil popisek tlačítka, na které skript klikal,
- přibyl nebo ubyl krok (dialog navíc, potvrzení),
- obrazovka dostala jiný identifikátor.

Opravte příslušný krok ve `snimky.mjs`, spusťte znovu a **projděte text příručky** —
nejspíš se změnil i postup, který popisuje.

## Nároky

Node.js a Playwright s Chromiem. Cesta k Playwrightu je ve `snimky.mjs` uvedena
absolutně; na jiném stroji ji upravte na `import { chromium } from 'playwright'`.
