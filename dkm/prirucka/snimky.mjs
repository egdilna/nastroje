/**
 * Generátor snímků pro uživatelskou příručku DKM.
 *
 * Postaví od nuly ukázkový projekt „Projekty a úkoly" — klikáním v aplikaci,
 * ne vstřikováním dat — a cestou pořizuje snímky obrazovek.
 *
 * Každý snímek je nejdřív ověřen proti internímu identifikátoru obrazovky
 * (`data-scr`, viz screens.md). Když identifikátor nesedí, skript skončí chybou
 * a snímek nevznikne — do příručky se tak nemůže dostat obrázek s popiskem,
 * který neodpovídá skutečnosti.
 *
 * Spuštění:   node snimky.mjs
 * Výsledek:   PNG soubory v této složce, pojmenované podle identifikátoru
 *             obrazovky s pořadovým číslem (scrinbox1.png, scrdetent3.png…).
 */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SLOZKA = dirname(fileURLToPath(import.meta.url));
const APLIKACE = 'file://' + join(SLOZKA, '..', 'index.html');

const pocitadlo = {};
let poradi = 0;

/* ---------- pomocníci ---------- */

const pauza = (ms) => new Promise((r) => setTimeout(r, ms));

/** Přečte identifikátor právě zobrazené obrazovky nebo otevřeného dialogu. */
async function idObrazovky(p, dialog) {
  return p.evaluate((d) => {
    if (d) {
      const dlg = document.getElementById('dlg');
      const cmd = document.getElementById('cmdp');
      if (cmd) return cmd.dataset.scr || null;
      if (dlg && dlg.open) return dlg.dataset.scr || null;
      return null;
    }
    return document.body.dataset.scr || null;
  }, dialog);
}

/**
 * Ověří identifikátor a pořídí snímek.
 * @param ocekavany  identifikátor bez mřížky, např. 'scrdetent' nebo 'dlgaddrel'
 * @param volby.presne  vyžadovat přesnou shodu i s příponou režimu
 * @param volby.vyrez   selektor prvku, ze kterého se má snímek udělat
 */
async function snimek(p, ocekavany, volby = {}) {
  const dialog = ocekavany.startsWith('dlg');
  const skutecny = await idObrazovky(p, dialog);
  if (!skutecny) throw new Error(`Snímek ${ocekavany}: obrazovka nehlásí žádný identifikátor.`);
  const sedi = volby.presne ? skutecny === ocekavany : skutecny.split('.')[0] === ocekavany.split('.')[0];
  if (!sedi) throw new Error(`Snímek ${ocekavany}: aplikace je na ${skutecny}, ne na ${ocekavany}.`);

  // odroluj nahoru — hlavička je přilepená a jinak by překryla začátek obsahu
  await p.evaluate(() => window.scrollTo(0, 0));
  // počkej, až se stránka ustálí — jinak snímek zachytí rozdělaný render
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await pauza(250);

  const zaklad = ocekavany.replace(/\./g, '-');
  pocitadlo[zaklad] = (pocitadlo[zaklad] || 0) + 1;
  const jmeno = `${zaklad}${pocitadlo[zaklad]}.png`;
  const cil = volby.vyrez ? p.locator(volby.vyrez).first() : p;
  await cil.screenshot({ path: join(SLOZKA, jmeno), animations: 'disabled' });
  console.log(`  ${String(++poradi).padStart(2, ' ')}. ${jmeno.padEnd(26)} (${skutecny})`);
  return jmeno;
}

/** Otevře sekci Nastavení. */
async function nastaveni(p, sekce) {
  await p.getByRole('button', { name: /Nastaven/ }).click();
  await pauza(250);
  if (sekce) {
    await p.getByRole('button', { name: sekce, exact: true }).click();
    await pauza(350);
  }
}

/**
 * Vybere v rozbalovátku první volbu, jejíž text začíná daným řetězcem.
 * Popisky voleb aplikace doplňuje (ikonou typu, rozsahem vazby), takže
 * hledat přesnou shodu je křehké.
 */
async function vyberPodleZacatku(prvek, zacatek) {
  const hodnota = await prvek.evaluate((el, z) => {
    const o = [...el.options].find((x) => x.textContent.trim().startsWith(z));
    return o ? o.value : null;
  }, zacatek);
  if (hodnota === null) throw new Error(`V nabídce chybí volba začínající „${zacatek}".`);
  await prvek.selectOption(hodnota);
}

/** Vyplní jeden řádek atributu v editoru typu nebo aspektu. */
async function atribut(p, index, { nazev, typ = 'text', vSeznamu = false, povinne = false, seznam = null }) {
  const radek = p.locator('.acr').nth(index);
  await radek.locator('input[placeholder="Název atributu"]').fill(nazev);
  await radek.locator('select[aria-label="Typ atributu"]').selectOption(typ);
  await pauza(200);
  if (povinne) await radek.locator('.acr-x input[type=checkbox]').nth(0).check();
  if (vSeznamu) await radek.locator('.acr-x input[type=checkbox]').nth(1).check();
  if (seznam) {
    await radek.locator('.acr-x select').last().selectOption({ label: seznam });
    await pauza(200);
  }
  await pauza(150);
}

/** Přidá prázdný řádek atributu. */
async function novyAtribut(p) {
  await p.getByRole('button', { name: /Přidat atribut/ }).click();
  await pauza(300);
}

/** Založí typ entity i s jeho atributy. */
async function typEntity(p, ikona, nazev, atributy) {
  await p.getByRole('button', { name: /Přidat typ entity/ }).click();
  await pauza(400);
  await p.fill('#te-ic', ikona);
  await p.fill('#te-nm', nazev);
  await p.locator('#te-nm').blur();
  await pauza(250);
  for (let i = 0; i < atributy.length; i++) {
    await novyAtribut(p);
    await atribut(p, i, atributy[i]);
  }
}

/**
 * Založí entitu daného typu a vyplní její pole.
 * Vrací se do seznamu „Vše", takže se dá volat opakovaně.
 */
async function entita(p, typ, nazev, pole = {}) {
  await p.locator('.tab').filter({ hasText: 'Vše' }).click();
  await pauza(500);
  await p.getByRole('button', { name: /Nová entita/ }).first().click();
  await pauza(500);
  await p.locator('#dlg button').filter({ hasText: typ }).first().click();
  await pauza(600);
  await p.fill('#ent-name', nazev);
  for (const [popisek, hodnota] of Object.entries(pole)) {
    const prvek = p.getByLabel(popisek, { exact: true });
    const tag = await prvek.evaluate((e) => e.tagName + ':' + e.type);
    if (tag.startsWith('SELECT')) await prvek.selectOption({ label: hodnota });
    else if (tag.endsWith('checkbox')) { if (hodnota) await prvek.check(); }
    else await prvek.fill(String(hodnota));
    await pauza(120);
  }
  await pauza(200);
  await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
  await pauza(1000);
}

/** Přidá vazbu daného typu na entitu, jejíž název začíná zadaným textem. */
async function vazba(p, typVazby, cil) {
  await p.getByRole('button', { name: /Přidat vazbu/ }).first().click();
  await pauza(700);
  await vyberPodleZacatku(p.locator('#dlg select').first(), typVazby);
  await pauza(600);
  const vyber = p.locator('#dlg select').nth(2);
  const hodnota = await vyber.evaluate((el, c) => {
    const o = [...el.options].find((x) => x.textContent.includes(c));
    return o ? o.value : null;
  }, cil);
  if (hodnota === null) throw new Error(`Ve výběru entit chybí „${cil}".`);
  await vyber.selectOption(hodnota);
  await pauza(400);
  return async () => {
    await p.locator('#dlg button').filter({ hasText: 'Přidat vazbu' }).click();
    await pauza(1000);
  };
}

/* ---------- zmrazený čas a náhoda ----------
 * Bez tohohle vyjde po každém běhu jiných osmnáct snímků, protože se v nich
 * mění časová razítka („Vytvořeno 10. 9. 2026 13:50“) a identifikátory entit —
 * `uid()` je skládá z `Date.now()` a `Math.random()`. Regenerace by pak dělala
 * binární změny, které nic neříkají, a skutečnou změnu by v nich nešlo najít.
 *
 * Vkládá se přes `addInitScript`, tedy dřív, než se spustí kód aplikace.
 * `new Date(neco)` funguje dál normálně, zmrazený je jen dotaz na „teď“.
 *
 * Datum je vybrané schválně: prosinec 2026 je měsíc, ve kterém má ukázkový
 * projekt termín, takže snímek kalendáře není prázdný. S dnešním datem
 * vycházel prázdný vždycky. */
const ZMRAZENI = `(() => {
  const OKAMZIK = Date.parse('2026-12-10T09:30:00Z');
  const PuvodniDate = Date;
  function ZmrazenyDate(...a){
    if(!(this instanceof ZmrazenyDate))return new PuvodniDate(OKAMZIK).toString();
    return a.length ? new PuvodniDate(...a) : new PuvodniDate(OKAMZIK);
  }
  ZmrazenyDate.prototype = PuvodniDate.prototype;
  ZmrazenyDate.now = () => OKAMZIK;
  ZmrazenyDate.parse = PuvodniDate.parse;
  ZmrazenyDate.UTC = PuvodniDate.UTC;
  Object.setPrototypeOf(ZmrazenyDate, PuvodniDate);
  window.Date = ZmrazenyDate;

  /* Předvídatelný generátor (mulberry32) — pořád vrací různá čísla za sebou,
     takže identifikátory zůstávají jedinečné, ale mezi běhy se opakují. */
  let seed = 0x2f6e2b1;
  Math.random = () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})()`;

/* ---------- stavba ukázkového projektu a snímky ---------- */

const prohlizec = await chromium.launch();
const kontext = await prohlizec.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.5, locale: 'cs-CZ' });
await kontext.addInitScript(ZMRAZENI);
const p = await kontext.newPage();
p.setDefaultTimeout(8000);
await p.goto(APLIKACE);
await pauza(1500);

console.log('\nDKM — generátor snímků příručky\n');

/* --- 1. Prázdný projekt --- */
await snimek(p, 'scrinbox');

/* --- 2. Nastavení projektu --- */
await nastaveni(p, 'Projekt');
await p.fill('#pj-name', 'Projekty a úkoly');
await p.fill('#pj-desc', 'Ukázkový projekt: co se dělá, kdo to dělá a v jakém je to stavu.');
await p.locator('#pj-desc').blur();
await pauza(400);
await snimek(p, 'scrsetproj');

/* --- 3. Seznam hodnot --- */
await nastaveni(p, 'Seznamy');
await p.getByRole('button', { name: /Přidat seznam/ }).click();
await pauza(400);
await p.locator('#main input[placeholder="Název"]').first().fill('Stav');
await p.locator('#main textarea').first().fill('Nový\nProbíhá\nKe kontrole\nHotovo');
await p.locator('#main textarea').first().blur();
await pauza(400);
await snimek(p, 'scrsetlists');

/* --- 4. Typy entit --- */
await nastaveni(p, 'Typy entit');
await snimek(p, 'scrsettypes');

// Projekt — první typ fotíme po krocích, aby šel postup ukázat
await p.getByRole('button', { name: /Přidat typ entity/ }).click();
await pauza(400);
await p.fill('#te-ic', '📁');
await p.fill('#te-nm', 'Projekt');
await p.locator('#te-nm').blur();
await pauza(300);
await snimek(p, 'scrsettype');
await novyAtribut(p);
await atribut(p, 0, { nazev: 'Kód', typ: 'text', vSeznamu: true });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Popis', typ: 'textarea' });
await novyAtribut(p);
await atribut(p, 2, { nazev: 'Stav', typ: 'select', vSeznamu: true, seznam: 'Stav' });
await novyAtribut(p);
await atribut(p, 3, { nazev: 'Termín', typ: 'date' });
await pauza(300);
await snimek(p, 'scrsettype');

// Úkol a Osoba
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await typEntity(p, '✅', 'Úkol', [
  { nazev: 'Popis', typ: 'textarea' },
  { nazev: 'Stav', typ: 'select', vSeznamu: true, seznam: 'Stav' },
  { nazev: 'Termín', typ: 'date' },
  { nazev: 'Odhad (hodin)', typ: 'number' },
]);
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await typEntity(p, '👤', 'Osoba', [
  { nazev: 'E-mail', typ: 'text', vSeznamu: true },
  { nazev: 'Role', typ: 'text' },
]);
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(500);
await snimek(p, 'scrsettypes');

/* --- 5. Aspekt --- */
await nastaveni(p, 'Aspekty');
await p.getByRole('button', { name: /Přidat aspekt/ }).click();
await pauza(400);
await p.fill('#ae-nm', 'Rozpočet');
await p.locator('#ae-nm').blur();
await pauza(200);
await novyAtribut(p);
await atribut(p, 0, { nazev: 'Náklady', typ: 'number' });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Schváleno', typ: 'yesno' });
await pauza(400);
await snimek(p, 'scrsetasp');

/* --- 6. Typy vazeb --- */
await nastaveni(p, 'Typy vazeb');
await p.getByRole('button', { name: /Přidat typ vazby/ }).click();
await pauza(400);
await p.fill('#re-nm', 'Obsahuje');
await p.fill('#re-inv', 'Je součástí');
await p.locator('#re-inv').blur();
await pauza(400);
await snimek(p, 'scrsetrel');

await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await p.getByRole('button', { name: /Přidat typ vazby/ }).click();
await pauza(400);
await p.fill('#re-nm', 'Odpovídá');
await p.fill('#re-inv', 'Odpovídá za');
await p.locator('#re-inv').blur();
await pauza(400);

/* --- 7. První entita --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(600);
await p.getByRole('button', { name: /Nová entita/ }).first().click();
await pauza(600);
await snimek(p, 'dlgnewent');
await p.locator('#dlg button').filter({ hasText: 'Projekt' }).first().click();
await pauza(700);
await snimek(p, 'scrnewent');

await p.fill('#ent-name', 'Nové webové stránky');
await p.getByLabel('Kód').fill('P-01');
await p.getByLabel('Popis').fill('Redesign firemních stránek včetně přesunu obsahu.\n\nCílem je **spustit do konce roku** a snížit počet stránek na polovinu.');
await p.getByLabel('Stav').selectOption({ label: 'Probíhá' });
await p.getByLabel('Termín').fill('2026-12-31');
await pauza(400);
await snimek(p, 'scrnewent');

await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1200);
await snimek(p, 'scrdetent');

/* --- 8. Další entity --- */
await entita(p, 'Projekt', 'Stěhování kanceláře', {
  'Kód': 'P-02',
  'Popis': 'Přesun do nových prostor včetně techniky a archivu.',
  'Stav': 'Nový',
  'Termín': '2027-03-31',
});
await entita(p, 'Úkol', 'Návrh grafiky', {
  'Popis': 'Vizuální podoba stránek — návrh, připomínky, finální verze.',
  'Stav': 'Probíhá',
  'Termín': '2026-10-15',
  'Odhad (hodin)': '24',
});
await entita(p, 'Úkol', 'Migrace obsahu', {
  'Popis': 'Přenos textů a dokumentů ze starých stránek.',
  'Stav': 'Nový',
  'Termín': '2026-11-30',
  'Odhad (hodin)': '40',
});
await entita(p, 'Úkol', 'Výběr dodavatele', {
  'Popis': 'Poptávka, porovnání nabídek, doporučení.',
  'Stav': 'Ke kontrole',
  'Termín': '2026-09-30',
  'Odhad (hodin)': '8',
});
await entita(p, 'Úkol', 'Revize smluv', {
  'Popis': 'Kontrola stávajících smluv s dodavateli.',
  'Stav': 'Hotovo',
  'Termín': '2026-08-31',
  'Odhad (hodin)': '12',
});
await entita(p, 'Osoba', 'Jana Dvořáková', {
  'E-mail': 'jana.dvorakova@example.cz',
  'Role': 'Vedoucí projektu',
});
await entita(p, 'Osoba', 'Petr Málek', {
  'E-mail': 'petr.malek@example.cz',
  'Role': 'Grafik',
});

/* --- 9. Seznam entit --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await snimek(p, 'scrallview');

/* --- 10. Vazby --- */
await p.locator('.ecard').filter({ hasText: 'Nové webové stránky' }).first().click();
await pauza(900);
let potvrd = await vazba(p, 'Obsahuje', 'Návrh grafiky');
await snimek(p, 'dlgaddrel');
await potvrd();

potvrd = await vazba(p, 'Obsahuje', 'Migrace obsahu');
await potvrd();
potvrd = await vazba(p, 'Odpovídá', 'Jana Dvořáková');
await potvrd();
await snimek(p, 'scrdetent');

/* --- 11. Aspekt a komentář na entitě --- */
await p.getByRole('button', { name: 'Upravit', exact: true }).first().click();
await pauza(900);
await p.getByLabel(/Rozpočet/).check();
await pauza(600);
await snimek(p, 'scredent');
await p.getByLabel('Náklady').fill('450000').catch(() => {});
await p.getByLabel('Schváleno').check().catch(() => {});
await pauza(300);
await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1300);

await p.locator('#cmt-t, textarea[placeholder*="komentář"]').first().fill('Termín potvrzen na poradě, grafika má přednost před migrací.');
await pauza(300);
await p.getByRole('button', { name: /Přidat komentář/ }).click();
await pauza(900);
await snimek(p, 'scrdetent');

/* --- 12. Zobrazení dat --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await p.getByRole('button', { name: 'Tabulka', exact: true }).click();
await pauza(900);
await snimek(p, 'scrallview.table', { presne: true });

await p.getByRole('button', { name: 'Kanban', exact: true }).click();
await pauza(1000);
// rozbalovátko „Sloupce podle" najdi podle jeho nabídky, ne podle pořadí
const sloupceSel = p.locator('#main select').filter({ has: p.locator('option', { hasText: 'Úkol / Stav' }) }).first();
await vyberPodleZacatku(sloupceSel, 'Úkol / Stav');
await pauza(900);
await snimek(p, 'scrallview.kanban', { presne: true });

await p.getByRole('button', { name: 'Časová osa', exact: true }).click();
await pauza(900);
await snimek(p, 'scrallview.timeline', { presne: true });
await p.getByRole('button', { name: 'Kalendář', exact: true }).click();
await pauza(900);
await snimek(p, 'scrallview.cal', { presne: true });
await p.getByRole('button', { name: 'Seznam', exact: true }).click();
await pauza(700);

/* --- 13. Hledání a pokročilé filtry --- */
await p.fill('#sin', 'migr');
await pauza(900);
await snimek(p, 'scrallview');
await p.fill('#sin', '');
await pauza(600);

await p.getByRole('button', { name: /Pokročilé filtry/ }).click();
await pauza(700);
await p.getByRole('button', { name: /Přidat pravidlo/ }).click();
await pauza(600);
await p.getByLabel('Atribut').selectOption({ label: 'Úkol / Stav' });
await pauza(500);
await p.getByLabel('Operátor').selectOption({ index: 0 });
await pauza(400);
const poleHodnoty = p.locator('.advf-row input, .advf-row select').last();
await poleHodnoty.selectOption({ label: 'Probíhá' }).catch(async () => {
  await poleHodnoty.fill('Probíhá');
});
await pauza(900);
await snimek(p, 'scrallview');

/* --- 14. Uložený pohled --- */
await p.getByRole('button', { name: /Uložit jako pohled/ }).click();
await pauza(700);
await snimek(p, 'dlgsaveview');
await p.locator('#dlg input[type=text]').first().fill('Rozpracované úkoly');
await pauza(300);
await p.locator('#dlg button').filter({ hasText: /Uložit/ }).last().click();
await pauza(1000);
await p.getByRole('button', { name: /Vyčistit filtry/ }).click().catch(() => {});
await pauza(700);

/* --- 15. Hromadné operace --- */
await p.getByRole('button', { name: /Pokročilé filtry/ }).click();
await pauza(500);
await p.locator('#b-sel').click();
await pauza(700);
await p.locator('.ecard').filter({ hasText: 'Návrh grafiky' }).first().click();
await pauza(300);
await p.locator('.ecard').filter({ hasText: 'Migrace obsahu' }).first().click();
await pauza(700);
await snimek(p, 'scrallview.select', { presne: true });

// výběr akce jen odkryje tlačítko, které ji spustí
await p.locator('.bulk-bar select').first().selectOption('addAspect');
await pauza(600);
await p.locator('.bulk-bar button.btn-pri').click();
await pauza(900);
await snimek(p, 'dlgbulkaspadd');
await p.locator('#dlg button').filter({ hasText: /Zrušit/ }).click();
await pauza(600);
await p.locator('#b-sel').click();
await pauza(600);

/* --- 16. Rychlá paleta --- */
await p.locator('body').click({ position: { x: 5, y: 400 } });
await p.keyboard.press('Control+p');
await pauza(900);
await p.keyboard.type('graf');
await pauza(700);
await snimek(p, 'dlgcmdpal');
await p.keyboard.press('Escape');
await pauza(600);

/* --- 17. Export dat --- */
await p.locator('#b-exp').click();
await pauza(900);
await snimek(p, 'dlgexphub');
await p.locator('#dlg button').filter({ hasText: /Zrušit|Zavřít/ }).last().click();
await pauza(700);

/* --- 18. PlantUML a balíček --- */
await p.locator('#b-exp').click();
await pauza(800);
await p.locator('#dlg input[type=radio]').nth(3).check();
await pauza(400);
await p.locator('#dlg button').filter({ hasText: /Dál/ }).click();
await pauza(1200);
await snimek(p, 'dlgplantuml');
await p.locator('#dlg button').filter({ hasText: /Zavřít|Zrušit/ }).last().click();
await pauza(700);

await p.locator('#b-exp').click();
await pauza(800);
await p.locator('#dlg input[type=radio]').nth(4).check();
await pauza(400);
await p.locator('#dlg button').filter({ hasText: /Dál/ }).click();
await pauza(1200);
await snimek(p, 'dlgexppkg');
await p.locator('#dlg button').filter({ hasText: /Zavřít|Zrušit/ }).last().click();
await pauza(700);

/* --- 19. Export a tisk jedné entity --- */
await p.locator('.ecard').filter({ hasText: 'Nové webové stránky' }).first().click();
await pauza(900);
await p.getByRole('button', { name: /Export \/ tisk/ }).click();
await pauza(900);
await snimek(p, 'dlgexpent');
await p.locator('#dlg button').filter({ hasText: /Zavřít|Zrušit/ }).last().click();
await pauza(700);

/* --- 20. Změny proti uloženému --- */
await p.locator('#ind').click();
await pauza(1000);
await snimek(p, 'dlgdiff');
await p.locator('#dlg button').filter({ hasText: /Zavřít|Zrušit/ }).last().click();
await pauza(700);

/* --- 21. Import z tabulky --- */
await p.locator('#b-imp').click();
await pauza(900);
await snimek(p, 'dlgimptsv');
await p.locator('#dlg button').filter({ hasText: /Zavřít|Zrušit/ }).last().click();
await pauza(700);

/* --- 22. Nastavení, které se hodí znát --- */
await nastaveni(p, 'Záložky');
await snimek(p, 'scrsettabs');
await nastaveni(p, 'GitHub');
await snimek(p, 'scrsetgh');
await nastaveni(p, 'Obecné');
await snimek(p, 'scrsetgen');
await nastaveni(p, 'Statistiky');
await snimek(p, 'scrsetstats');
await nastaveni(p, 'Model');
await snimek(p, 'scrsetmodel');
await nastaveni(p, 'Projekt');
await snimek(p, 'scrsetproj');

/* --- 23. Inbox a náhled vedle seznamu --- */
await p.locator('.tab').filter({ hasText: 'Inbox' }).click();
await pauza(700);
await p.fill('#qa-n', 'Zjistit, kdo schvaluje nákup licencí');
await p.fill('#qa-t', 'Padlo na poradě — ověřit u vedení, ať se to nezapomene.');
await pauza(400);
await snimek(p, 'scrinbox');
await p.getByRole('button', { name: /Přidat do Inboxu/ }).click();
await pauza(900);
await snimek(p, 'scrinbox');

await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await p.getByRole('button', { name: /Náhled vedle seznamu/ }).click();
await pauza(700);
await p.locator('.ecard').filter({ hasText: 'Výběr dodavatele' }).first().click();
await pauza(900);
await snimek(p, 'scrallview.preview', { presne: true });
await p.getByRole('button', { name: /Náhled vedle seznamu/ }).click();
await pauza(700);

await prohlizec.close();
console.log(`\nHotovo: ${poradi} snímků ve složce ${SLOZKA}\n`);
process.exit(0);
