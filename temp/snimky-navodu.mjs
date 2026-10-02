/**
 * Generátor snímků pro návod `spravce-ukolu.md`.
 *
 * Postaví v DKM celého správce úkolů — **klikáním v aplikaci, ne vstřikováním dat** —
 * přesně podle kroků, které návod popisuje, a cestou pořídí všech 40 snímků.
 * Každý snímek se nejdřív ověří proti internímu identifikátoru obrazovky (`data-scr`,
 * viz `dkm/screens.md`); když identifikátor nesedí, skript skončí chybou a snímek
 * nevznikne. Do návodu se tak nemůže dostat obrázek s popiskem, který neodpovídá
 * skutečnosti — a když se aplikace změní, skript spadne místo toho, aby tiše lhal.
 *
 * Čas i `Math.random` jsou zmrazené, takže opakovaný běh vydá tytéž snímky a tytéž
 * identifikátory entit. Bez toho by regenerace dělala binární změny, které nic neříkají.
 *
 * Spuštění:  node temp/snimky-navodu.mjs
 * Výsledek:  PNG do `temp/obrazky/` a hotový projekt do `temp/spravce-ukolu.dkmdata`
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { join } from 'node:path';
import fs from 'node:fs';

const CIL = '/home/user/nastroje/temp/obrazky';
const APLIKACE = 'file:///home/user/nastroje/dkm/index.html';
let n = 0;
const pauza = (ms) => new Promise((r) => setTimeout(r, ms));

async function idObrazovky(p, dialog) {
  return p.evaluate((d) => {
    if (d) {
      const cmd = document.getElementById('cmdp');
      const dlg = document.getElementById('dlg');
      if (cmd) return cmd.dataset.scr || null;
      if (dlg && dlg.open) return dlg.dataset.scr || null;
      return null;
    }
    return document.body.dataset.scr || null;
  }, dialog);
}

/** Ověří, na jaké obrazovce aplikace je, a teprve pak fotí. */
async function snimek(p, jmeno, ocekavany, volby = {}) {
  const dialog = ocekavany.startsWith('dlg');
  const skutecny = await idObrazovky(p, dialog);
  if (!skutecny) throw new Error(`${jmeno}: obrazovka nehlásí identifikátor (čekal ${ocekavany}).`);
  if (skutecny.split('.')[0] !== ocekavany.split('.')[0])
    throw new Error(`${jmeno}: aplikace je na ${skutecny}, ne na ${ocekavany}.`);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await pauza(220);
  const soubor = `${String(++n).padStart(2, '0')}-${jmeno}.png`;
  const cil = volby.vyrez ? p.locator(volby.vyrez).first() : p;
  await cil.screenshot({ path: join(CIL, soubor), animations: 'disabled', fullPage: !volby.vyrez && !!volby.cely });
  console.log(`  ${soubor.padEnd(34)} (${skutecny})`);
  return soubor;
}

async function nastaveni(p, sekce) {
  const na = await p.evaluate(() => document.body.dataset.scr || '');
  if (!na.startsWith('scrset')) { await p.locator('#b-set').click(); await pauza(300); }
  if (sekce) { await p.getByRole('button', { name: sekce, exact: true }).click(); await pauza(400); }
}

/** Vybere entitu do atributu typu vazba (výběr entity je skupina prvků, ne jedno rozbalovátko). */
async function vyberVazbu(p, popisek, cil) {
  const box = p.locator('.esel[aria-label="' + popisek + '"]').first();
  const nab = box.locator('select').last();
  const h = await nab.evaluate((el, c) => {
    const o = [...el.options].find((x) => x.textContent.includes(c));
    return o ? o.value : null;
  }, cil);
  if (h === null) throw new Error(`Ve výběru „${popisek}" chybí „${cil}".`);
  await nab.selectOption(h);
  await pauza(300);
  const tl = box.locator('button[id$="-add"]');
  if (await tl.isDisabled()) throw new Error(`Tlačítko u „${popisek}" zůstalo zakázané — výběr se nepropsal.`);
  await tl.click();
  await pauza(500);
  const zapsano = await box.locator('.esel-cur').innerText();
  if (!zapsano.includes(cil.slice(0, 8))) throw new Error(`Vazba „${popisek}" se nezapsala, v poli je: ${JSON.stringify(zapsano)}`);
}

async function vyberPodleZacatku(prvek, zacatek) {
  const h = await prvek.evaluate((el, z) => {
    const o = [...el.options].find((x) => x.textContent.trim().startsWith(z));
    return o ? o.value : null;
  }, zacatek);
  if (h === null) throw new Error(`V nabídce chybí volba začínající „${zacatek}".`);
  await prvek.selectOption(h);
}

/** Vyplní jeden řádek atributu v editoru typu nebo aspektu. */
async function atribut(p, i, { nazev, typ = 'text', vSeznamu = false, seznam = null, soustava = null, cilovy = null, sablona = null }) {
  const r = p.locator('.acr').nth(i);
  await r.locator('input[placeholder="Název atributu"]').fill(nazev);
  await r.locator('select[aria-label="Typ atributu"]').selectOption(typ);
  await pauza(250);
  if (vSeznamu) await r.locator('.acr-x input[type=checkbox]').nth(1).check();
  if (seznam) { await r.locator('.acr-x select').last().selectOption({ label: seznam }); await pauza(200); }
  if (soustava) { await r.locator('.acr-x select').last().selectOption({ label: soustava }); await pauza(200); }
  if (cilovy) { await vyberPodleZacatku(r.locator('.acr-x select').last(), cilovy); await pauza(200); }
  if (sablona) { await r.getByLabel(/^Šablona/).fill(sablona); await pauza(250); }
  await pauza(120);
}

async function novyAtribut(p) {
  await p.getByRole('button', { name: /Přidat atribut/ }).click();
  await pauza(320);
}

async function typEntity(p, ikona, nazev, atributy) {
  await p.getByRole('button', { name: /Přidat typ entity/ }).click();
  await pauza(400);
  await p.fill('#te-ic', ikona);
  await p.fill('#te-nm', nazev);
  await p.locator('#te-nm').blur();
  await pauza(300);
  for (let i = 0; i < atributy.length; i++) { await novyAtribut(p); await atribut(p, i, atributy[i]); }
}

/** Založí entitu daného typu, vyplní pole, aspekty a tagy. */
async function entita(p, typ, nazev, { pole = {}, aspekty = [], tagy = {} } = {}) {
  await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
  await pauza(450);
  await p.getByRole('button', { name: /Nová entita/ }).first().click();
  await pauza(450);
  await p.locator('#dlg button').filter({ hasText: typ }).first().click();
  await pauza(600);
  await p.fill('#ent-name', nazev);
  for (const a of aspekty) {
    await p.locator('#main label').filter({ hasText: new RegExp('^' + a + ' \\(') }).first().locator('input[type=checkbox]').check();
    await pauza(400);
  }
  for (const [popisek, hodnota] of Object.entries(pole)) {
    if (popisek === 'Projekt') { await vyberVazbu(p, popisek, hodnota); continue; }
    const prvek = p.getByLabel(popisek, { exact: true });
    const tag = await prvek.evaluate((e) => e.tagName + ':' + (e.type || ''));
    if (tag.startsWith('SELECT')) await prvek.selectOption({ label: hodnota });
    else await prvek.fill(String(hodnota));
    await pauza(120);
  }
  for (const [atr, seznam] of Object.entries(tagy)) await zaskrtniTagy(p, atr, seznam);
  await pauza(200);
  await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
  await pauza(900);
}

/** Rozbalí tagové pole a zaškrtne v něm tagy. */
async function zaskrtniTagy(p, atribut, seznam) {
  const box = p.locator('details.tag-ed').filter({ has: p.locator('summary', { hasText: new RegExp('^' + atribut + ':') }) }).first();
  await box.locator('summary').click();
  await pauza(300);
  for (const tg of seznam) {
    await box.locator('.tag-ed-list label').filter({ hasText: new RegExp('^' + tg + '$') }).first().locator('input').check();
    await pauza(180);
  }
  await box.locator('summary').click();
  await pauza(200);
}

/* Zmrazený čas a náhoda — bez toho vyjdou při každém běhu jiné snímky. */
const ZMRAZENI = `(() => {
  const OKAMZIK = Date.parse('2026-10-05T08:30:00Z');
  const P = Date;
  function Z(...a){ if(!(this instanceof Z)) return new P(OKAMZIK).toString(); return a.length ? new P(...a) : new P(OKAMZIK); }
  Z.prototype = P.prototype; Z.now = () => OKAMZIK; Z.parse = P.parse; Z.UTC = P.UTC;
  Object.setPrototypeOf(Z, P); window.Date = Z;
  let s = 0x51a7c3; Math.random = () => { s|=0; s=(s+0x6D2B79F5)|0; let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; };
})()`;

const prohlizec = await chromium.launch();
const kontext = await prohlizec.newContext({ viewport: { width: 1500, height: 940 }, deviceScaleFactor: 1.5, locale: 'cs-CZ' });
await kontext.addInitScript(ZMRAZENI);
const p = await kontext.newPage();
p.setDefaultTimeout(10000);
const chyby = [];
p.on('pageerror', (e) => chyby.push('PAGEERROR: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') chyby.push('CONSOLE: ' + m.text()); });
await p.goto(APLIKACE);
await pauza(1400);

console.log('\nSprávce úkolů — stavba a snímky\n');

/* === 1. prázdná aplikace === */
await snimek(p, 'prazdna-aplikace', 'scrinbox');

/* === 2. název projektu === */
await nastaveni(p, 'Projekt');
await p.fill('#pj-name', 'Správce úkolů');
await p.fill('#pj-desc', 'Projekty, úkoly a lidé, kteří za ně zodpovídají.');
await p.locator('#pj-desc').blur();
await pauza(400);
await snimek(p, 'nastaveni-projekt', 'scrsetproj', { cely: true });

/* === 3. číselníky === */
await nastaveni(p, 'Seznamy');
const seznamy = [
  ['Stav úkolu', 'Nový\nDělá se\nČeká\nHotovo'],
  ['Stav projektu', 'Záměr\nBěží\nPozastaveno\nDokončeno'],
  ['Priorita', 'Vysoká\nStřední\nNízká'],
];
for (let i = 0; i < seznamy.length; i++) {
  await p.getByRole('button', { name: /Přidat seznam/ }).click();
  await pauza(400);
  await p.locator('#main .citem').nth(i).locator('input[placeholder="Název"]').fill(seznamy[i][0]);
  await p.locator('#main .citem').nth(i).locator('textarea').fill(seznamy[i][1]);
  await p.locator('#main .citem').nth(i).locator('textarea').blur();
  await pauza(350);
}
await snimek(p, 'nastaveni-seznamy', 'scrsetlists', { cely: true });

/* === 4. soustavy tagů === */
await nastaveni(p, 'Tagy');
await snimek(p, 'nastaveni-tagy-prazdne', 'scrsettags', { cely: true });
const soustavy = [
  ['Lidé', 'Alice Horáková\nBohdan Mrázek\nCyril Nedvěd'],
  ['Oblast', 'IT\nPrávo\nKomunikace'],
];
for (let i = 0; i < soustavy.length; i++) {
  await p.getByRole('button', { name: /Přidat soustavu/ }).click();
  await pauza(400);
  await p.locator('#main .citem').nth(i).locator('input[aria-label="Název"]').fill(soustavy[i][0]);
  await p.locator('#main .citem').nth(i).locator('textarea').fill(soustavy[i][1]);
  await p.locator('#main .citem').nth(i).locator('textarea').blur();
  await pauza(350);
}
await snimek(p, 'nastaveni-tagy', 'scrsettags', { cely: true });

/* === 5. typy entit === */
await nastaveni(p, 'Typy entit');
await p.getByRole('button', { name: /Přidat typ entity/ }).click();
await pauza(400);
await p.fill('#te-ic', '📁');
await p.fill('#te-nm', 'Projekt');
await p.locator('#te-nm').blur();
await pauza(300);
await snimek(p, 'typ-projekt-prazdny', 'scrsettype', { cely: true });
await novyAtribut(p); await atribut(p, 0, { nazev: 'Kód', typ: 'text', vSeznamu: true });
await novyAtribut(p); await atribut(p, 1, { nazev: 'Zadání', typ: 'textarea' });
await novyAtribut(p); await atribut(p, 2, { nazev: 'Stav', typ: 'select', vSeznamu: true, seznam: 'Stav projektu' });
await pauza(300);
await snimek(p, 'typ-projekt-hotovy', 'scrsettype', { cely: true });

await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await typEntity(p, '✅', 'Úkol', [
  { nazev: 'Zadání', typ: 'textarea' },
  { nazev: 'Stav', typ: 'select', vSeznamu: true, seznam: 'Stav úkolu' },
  { nazev: 'Projekt', typ: 'relation', vSeznamu: true, cilovy: 'Projekt' },
  { nazev: 'Oblast', typ: 'tags', soustava: 'Oblast' },
]);
await pauza(300);
await snimek(p, 'typ-ukol', 'scrsettype', { cely: true });
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(500);
await snimek(p, 'nastaveni-typy', 'scrsettypes', { cely: true });

/* === 6. aspekty === */
await nastaveni(p, 'Aspekty');
await p.getByRole('button', { name: /Přidat aspekt/ }).click();
await pauza(400);
await p.fill('#ae-nm', 'Zodpovědnost');
await p.locator('#ae-nm').blur();
await pauza(250);
await novyAtribut(p); await atribut(p, 0, { nazev: 'Zodpovídá', typ: 'tags', soustava: 'Lidé' });
await novyAtribut(p); await atribut(p, 1, { nazev: 'Spolupracuje', typ: 'tags', soustava: 'Lidé' });
await pauza(400);
await snimek(p, 'aspekt-zodpovednost', 'scrsetasp', { cely: true });

await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await p.getByRole('button', { name: /Přidat aspekt/ }).click();
await pauza(400);
await p.fill('#ae-nm', 'Plánování');
await p.locator('#ae-nm').blur();
await pauza(250);
await novyAtribut(p); await atribut(p, 0, { nazev: 'Termín', typ: 'date' });
await novyAtribut(p); await atribut(p, 1, { nazev: 'Priorita', typ: 'select', seznam: 'Priorita' });
await pauza(400);
await snimek(p, 'aspekt-planovani', 'scrsetasp', { cely: true });
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(500);
await snimek(p, 'nastaveni-aspekty', 'scrsetasps', { cely: true });

/* === 7. typ vazby === */
await nastaveni(p, 'Typy vazeb');
await p.getByRole('button', { name: /Přidat typ vazby/ }).click();
await pauza(400);
await p.fill('#re-nm', 'Navazuje na');
await p.fill('#re-inv', 'Předchází');
await p.locator('#re-inv').blur();
await pauza(300);
await p.locator('#re-sc').selectOption('specific');
await pauza(500);
for (const smer of [0, 1]) {
  const box = p.locator('#main .zal-vyber, #main .rsc-box').nth(smer);
  await box.locator('label').filter({ hasText: /Úkol/ }).first().locator('input').check().catch(() => {});
  await pauza(200);
}
await pauza(400);
await snimek(p, 'typ-vazby', 'scrsetrel', { cely: true });
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(500);

/* === 8. složený atribut Souhrn na Úkolu === */
await nastaveni(p, 'Typy entit');
await p.locator('#main table button').filter({ hasText: /^Upravit$/ }).nth(1).click();
await pauza(600);
await novyAtribut(p);
await atribut(p, 4, { nazev: 'Souhrn', typ: 'composed', vSeznamu: true, sablona: '((Priorita)) · ((Zodpovídá)) · termín ((Termín))' });
await pauza(500);
await snimek(p, 'slozeny-atribut', 'scrsettype', { cely: true });

/* === 9. první entita krok za krokem === */
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(600);
await p.getByRole('button', { name: /Nová entita/ }).first().click();
await pauza(600);
await snimek(p, 'dialog-nova-entita', 'dlgnewent');
await p.locator('#dlg button').filter({ hasText: 'Projekt' }).first().click();
await pauza(700);
await snimek(p, 'editor-prazdny', 'scrnewent', { cely: true });
await p.fill('#ent-name', 'Nový intranet');
await p.getByLabel('Kód', { exact: true }).fill('P-01');
await p.getByLabel('Zadání', { exact: true }).fill('Nahradit starý intranet. Cílem je, aby **lidé našli dokument do minuty**.');
await p.getByLabel('Stav', { exact: true }).selectOption({ label: 'Běží' });
await pauza(400);
await snimek(p, 'editor-vyplneny', 'scrnewent', { cely: true });
await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1100);
await snimek(p, 'detail-projektu', 'scrdetent');

await entita(p, 'Projekt', 'Stěhování archivu', {
  pole: { 'Kód': 'P-02', 'Zadání': 'Přesun papírového archivu do nového depozitáře.', 'Stav': 'Záměr' },
});

/* === 10. úkol s aspekty a tagy — krok za krokem === */
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(500);
await p.getByRole('button', { name: /Nová entita/ }).first().click();
await pauza(500);
await p.locator('#dlg button').filter({ hasText: 'Úkol' }).first().click();
await pauza(700);
await p.fill('#ent-name', 'Sepsat požadavky na vyhledávání');
await snimek(p, 'ukol-pred-aspekty', 'scrnewent', { cely: true });
for (const a of ['Zodpovědnost', 'Plánování']) {
  await p.locator('#main label').filter({ hasText: new RegExp('^' + a + ' \\(') }).first().locator('input[type=checkbox]').check();
  await pauza(500);
}
await snimek(p, 'ukol-po-aspektech', 'scrnewent', { cely: true });
await p.getByLabel('Zadání', { exact: true }).fill('Co má vyhledávání umět, sepsat po rozhovoru s referenty.');
await p.getByLabel('Stav', { exact: true }).selectOption({ label: 'Dělá se' });
await vyberVazbu(p, 'Projekt', 'Nový intranet');
await p.getByLabel('Termín', { exact: true }).fill('2026-10-20');
await p.getByLabel('Priorita', { exact: true }).selectOption({ label: 'Vysoká' });
await pauza(300);

/* tag zaškrtnutý ze soustavy */
const boxZod = p.locator('details.tag-ed').filter({ has: p.locator('summary', { hasText: /^Zodpovídá:/ }) }).first();
await boxZod.locator('summary').click();
await pauza(400);
await snimek(p, 'tagy-rozbalene', 'scrnewent', { cely: true });
await boxZod.locator('.tag-ed-list label').filter({ hasText: /^Alice Horáková$/ }).first().locator('input').check();
await pauza(400);

/* a tag přidaný rovnou tady, aniž by se chodilo do nastavení */
await boxZod.locator('.tag-ed-add input').fill('Dana Kolářová');
await pauza(300);
await snimek(p, 'tag-rychle-pridani', 'scrnewent', { cely: true });
await boxZod.locator('.tag-ed-add button').click();
await pauza(700);
await snimek(p, 'tag-pridan', 'scrnewent', { cely: true });
await boxZod.locator('summary').click();
await pauza(300);
await zaskrtniTagy(p, 'Oblast', ['IT']);
await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1100);
await snimek(p, 'detail-ukolu', 'scrdetent');

/* === 11. zbývající úkoly === */
const UKOLY = [
  ['Vybrat dodavatele', { 'Zadání': 'Poptávka, porovnání nabídek, doporučení vedení.', 'Stav': 'Nový', 'Projekt': 'Nový intranet', 'Termín': '2026-11-10', 'Priorita': 'Střední' }, { 'Zodpovídá': ['Bohdan Mrázek'], 'Oblast': ['Právo'] }],
  ['Migrace dokumentů', { 'Zadání': 'Přenos složek ze starého intranetu, vyřadit duplicity.', 'Stav': 'Čeká', 'Projekt': 'Nový intranet', 'Termín': '2026-12-01', 'Priorita': 'Střední' }, { 'Zodpovídá': ['Cyril Nedvěd'], 'Spolupracuje': ['Alice Horáková'], 'Oblast': ['IT'] }],
  ['Školení referentů', { 'Zadání': 'Dvě hodiny prakticky, pro každé oddělení zvlášť.', 'Stav': 'Nový', 'Projekt': 'Nový intranet', 'Termín': '2026-12-15', 'Priorita': 'Nízká' }, { 'Zodpovídá': ['Dana Kolářová'], 'Oblast': ['Komunikace'] }],
  ['Pasportizace regálů', { 'Zadání': 'Spočítat běžné metry a označit regály.', 'Stav': 'Dělá se', 'Projekt': 'Stěhování archivu', 'Termín': '2026-10-30', 'Priorita': 'Vysoká' }, { 'Zodpovídá': ['Bohdan Mrázek'] }],
  ['Smlouva s depozitářem', { 'Zadání': 'Podepsáno 30. 9., uloženo ve spisovně.', 'Stav': 'Hotovo', 'Projekt': 'Stěhování archivu', 'Termín': '2026-09-30', 'Priorita': 'Střední' }, { 'Zodpovídá': ['Dana Kolářová'], 'Oblast': ['Právo'] }],
];
for (const [nazev, pole, tagy] of UKOLY) {
  await entita(p, 'Úkol', nazev, { pole, tagy, aspekty: ['Zodpovědnost', 'Plánování'] });
}

/* === 12. seznam === */
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(800);
await snimek(p, 'seznam-vse', 'scrallview');

/* === 13. vazba mezi úkoly === */
await p.locator('.ecard').filter({ hasText: 'Vybrat dodavatele' }).first().click();
await pauza(900);
await p.getByRole('button', { name: /Přidat vazbu/ }).first().click();
await pauza(800);
await vyberPodleZacatku(p.locator('#dlg select').first(), 'Navazuje na');
await pauza(600);
const nab = p.locator('#dlg select').nth(2);
const hv = await nab.evaluate((el) => {
  const o = [...el.options].find((x) => x.textContent.includes('Sepsat požadavky'));
  return o ? o.value : null;
});
if (hv === null) throw new Error('Ve výběru entit chybí „Sepsat požadavky".');
await nab.selectOption(hv);
await pauza(500);
await snimek(p, 'dialog-pridat-vazbu', 'dlgaddrel');
await p.locator('#dlg button').filter({ hasText: 'Přidat vazbu' }).click();
await pauza(1000);
await snimek(p, 'detail-s-vazbou', 'scrdetent');

/* === 14. sekce podle lidí === */
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(700);
await vyberPodleZacatku(p.locator('#grp-sel'), 'Sekce podle: 🏷 Lidé');
await pauza(900);
await snimek(p, 'sekce-podle-lidi', 'scrallview');
await p.locator('#grp-sel').selectOption('');
await pauza(600);

/* === 15. kanban === */
await p.getByRole('button', { name: 'Kanban', exact: true }).click();
await pauza(900);
await vyberPodleZacatku(p.locator('#kb-sel'), 'Úkol / Stav');
await pauza(900);
await snimek(p, 'kanban', 'scrallview.kanban');
await p.getByRole('button', { name: 'Seznam', exact: true }).click();
await pauza(700);

/* === 16. filtr a uložený pohled === */
await p.getByRole('button', { name: /Pokročilé filtry/ }).click();
await pauza(700);
await p.getByRole('button', { name: /Přidat pravidlo/ }).click();
await pauza(700);
await p.getByLabel('Atribut').selectOption({ label: 'Úkol / Stav' });
await pauza(600);
const hodn = p.locator('.advf-row select, .advf-row input').last();
await hodn.selectOption({ label: 'Dělá se' }).catch(async () => { await hodn.fill('Dělá se'); });
await pauza(900);
await snimek(p, 'filtr-pravidlo', 'scrallview');
await p.getByRole('button', { name: /Uložit jako pohled/ }).click();
await pauza(800);
await p.locator('#dlg input[type=text]').first().fill('Rozdělané');
await pauza(300);
await snimek(p, 'dialog-ulozit-pohled', 'dlgsaveview');
await p.locator('#dlg button').filter({ hasText: /Uložit/ }).last().click();
await pauza(1000);
await p.getByRole('button', { name: /Vyčistit filtry|Zrušit filtry/ }).first().click().catch(() => {});
await pauza(700);

/* === 17. záložky === */
await nastaveni(p, 'Záložky');
await snimek(p, 'zalozky-vychozi', 'scrsettabs', { cely: true });

/* 17a. úprava záložky, kterou založil dialog Uložit pohled */
const polozkaPohled = p.locator('#main .citem').filter({ hasText: 'Rozdělané' }).first();
await polozkaPohled.locator('button').first().click();
await pauza(600);
let idP = await polozkaPohled.locator('select[id^="zal-kind-"]').getAttribute('id');
idP = idP.replace('zal-kind-', '');
await p.fill('#zal-ic-' + idP, '🔥');
await p.fill('#zal-nm-' + idP, 'Dělá se');
await pauza(400);
await polozkaPohled.locator('label').filter({ hasText: 'Otevírat na této' }).locator('input').check();
await pauza(700);
await snimek(p, 'zalozka-upravena', 'scrsettabs', { cely: true });

/* 17b. nová záložka na tag */
await p.getByRole('button', { name: /^＋ Přidat záložku/ }).click();
await pauza(700);
const nova = p.locator('#main .citem').last();
let idN = await nova.locator('select[id^="zal-kind-"]').getAttribute('id');
idN = idN.replace('zal-kind-', '');
await p.locator('#zal-kind-' + idN).selectOption('tag');
await pauza(700);
const novaZ = p.locator('#main .citem').last();
await vyberPodleZacatku(novaZ.locator('select').nth(1), 'Lidé / Alice');
await pauza(600);
await p.fill('#zal-ic-' + idN, '👤');
await p.fill('#zal-nm-' + idN, 'Alice');
await pauza(600);
await snimek(p, 'zalozka-nova-tag', 'scrsettabs', { cely: true });

/* 17c. záložky pro typy jedním tlačítkem */
await p.getByRole('button', { name: /Záložky pro všechny typy/ }).click();
await pauza(900);
await snimek(p, 'zalozky-hotove', 'scrsettabs', { cely: true });

/* kontrola: žádná záložka navíc a výchozí sedí */
const kontrolaZ = await p.evaluate(() => (state.data.settings.tabs || []).map((z) => ({ k: z.kind, n: z.name, i: z.icon, d: !!z.isDefault })));
console.log('\nZáložky: ' + JSON.stringify(kontrolaZ, null, 0));
if (kontrolaZ.filter((z) => z.k === 'view').length !== 1) throw new Error('Záložek na uložený pohled má být přesně jedna: ' + JSON.stringify(kontrolaZ));
if (kontrolaZ.filter((z) => z.d).length !== 1) throw new Error('Výchozí záložka má být právě jedna.');

/* === 18. připnutí a zámek === */
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(800);
await p.locator('.ecard').filter({ hasText: 'Pasportizace regálů' }).first().click();
await pauza(900);
await p.getByRole('button', { name: /📌 Připnout/ }).click();
await pauza(700);
await snimek(p, 'detail-pripnuty', 'scrdetent');
await p.locator('.tab').filter({ hasText: 'Vše' }).first().click();
await pauza(800);
await p.locator('.ecard').filter({ hasText: 'Smlouva s depozitářem' }).first().click();
await pauza(900);
await p.getByRole('button', { name: /🔒 Zamknout/ }).click();
await pauza(700);
await snimek(p, 'detail-zamceny', 'scrdetent');

/* === 19. Inbox === */
await p.locator('.tab').filter({ hasText: 'Inbox' }).first().click();
await pauza(800);
await p.fill('#qa-n', 'Zjistit, kdo schvaluje nákup licencí');
await p.fill('#qa-t', 'Padlo na poradě — ověřit u vedení, ať to nezapadne.');
await pauza(400);
await snimek(p, 'inbox-rychle-pridani', 'scrinbox');
await p.getByRole('button', { name: /Přidat do Inboxu/ }).click();
await pauza(900);
await snimek(p, 'inbox-polozka', 'scrinbox');

/* === 20. hotový seznam úkolů === */
await p.locator('.tab').filter({ hasText: 'Úkol' }).first().click();
await pauza(900);
await snimek(p, 'hotovy-seznam-ukolu', 'scrtypeview');

/* === 21. uložení dat do souboru === */
const data = await p.evaluate(() => JSON.stringify(state.data, null, 1));
fs.writeFileSync('/home/user/nastroje/temp/spravce-ukolu.dkmdata', data, 'utf-8');
const souhrn = await p.evaluate(() => ({
  typy: state.data.entityTypes.map((x) => x.name),
  aspekty: state.data.aspects.map((x) => x.name),
  vazby: state.data.relationTypes.map((x) => x.name),
  seznamy: state.data.selectLists.map((x) => x.name),
  soustavy: (state.data.tagSets || []).map((x) => x.name + ': ' + x.tags.join(', ')),
  zalozky: (state.data.settings.tabs || []).map((z) => (z.icon || '') + (z.name || z.kind)),
  pohledy: (state.data.savedViews || []).map((x) => x.name),
  entit: state.data.entities.length,
}));
console.log('\nModel:\n' + JSON.stringify(souhrn, null, 1));


await prohlizec.close();
if (chyby.length) { console.log('\nCHYBY STRÁNKY:\n' + chyby.join('\n')); process.exit(1); }
console.log(`\nHotovo: ${n} snímků\n`);
process.exit(0);
