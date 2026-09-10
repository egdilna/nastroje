/**
 * Generátor snímků pro uživatelskou příručku DKM.
 *
 * Postaví od nuly ukázkový projekt „Evidence agend úřadu" — klikáním v aplikaci,
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

/**
 * Založí entitu daného typu a vyplní její pole.
 * Vrací se do seznamu „Vše", takže se dá volat opakovaně.
 */
async function entita(p, typ, nazev, pole = {}, volby = {}) {
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
  if (volby.aspekt) {
    await p.getByLabel(new RegExp(volby.aspekt)).check();
    await pauza(400);
  }
  await pauza(200);
  if (volby.predUlozenim) await volby.predUlozenim();
  await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
  await pauza(1000);
}

/** Přidá prázdný řádek atributu. */
async function novyAtribut(p) {
  await p.getByRole('button', { name: /Přidat atribut/ }).click();
  await pauza(300);
}


/* ---------- stavba ukázkového projektu a snímky ---------- */

const prohlizec = await chromium.launch();
const p = await (await prohlizec.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.5, locale: 'cs-CZ' })).newPage();
p.setDefaultTimeout(8000);
await p.goto(APLIKACE);
await pauza(1500);

console.log('\nDKM — generátor snímků příručky\n');

/* --- 1. Prázdný projekt --- */
await snimek(p, 'scrinbox');

/* --- 2. Nastavení projektu --- */
await nastaveni(p, 'Projekt');
await p.fill('#pj-name', 'Evidence agend úřadu');
await p.fill('#pj-desc', 'Přehled agend, informačních systémů a jejich garantů.');
await p.locator('#pj-desc').blur();
await pauza(400);
await snimek(p, 'scrsetproj');

/* --- 3. Seznam hodnot pro stav agendy --- */
await nastaveni(p, 'Seznamy');
await p.getByRole('button', { name: /Přidat seznam/ }).click();
await pauza(400);
await p.locator('#main input[placeholder="Název"]').first().fill('Stav agendy');
await p.locator('#main textarea').first().fill('Návrh\nV řešení\nSchváleno\nHotovo');
await p.locator('#main textarea').first().blur();
await pauza(400);
await snimek(p, 'scrsetlists');

/* --- 4. Typy entit --- */
await nastaveni(p, 'Typy entit');
await snimek(p, 'scrsettypes');

// Agenda
await p.getByRole('button', { name: /Přidat typ entity/ }).click();
await pauza(400);
await p.fill('#te-ic', '📁');
await p.fill('#te-nm', 'Agenda');
await p.locator('#te-nm').blur();
await pauza(300);
await snimek(p, 'scrsettype');
await novyAtribut(p);
await atribut(p, 0, { nazev: 'Kód agendy', typ: 'text', vSeznamu: true });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Popis', typ: 'textarea' });
await novyAtribut(p);
await atribut(p, 2, { nazev: 'Stav', typ: 'select', vSeznamu: true, seznam: 'Stav agendy' });
await novyAtribut(p);
await atribut(p, 3, { nazev: 'Termín', typ: 'date' });
await pauza(300);
await snimek(p, 'scrsettype');

// Systém
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await p.getByRole('button', { name: /Přidat typ entity/ }).click();
await pauza(400);
await p.fill('#te-ic', '💻');
await p.fill('#te-nm', 'Informační systém');
await p.locator('#te-nm').blur();
await pauza(200);
await novyAtribut(p);
await atribut(p, 0, { nazev: 'Zkratka', typ: 'text', vSeznamu: true });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Adresa', typ: 'url' });
await novyAtribut(p);
await atribut(p, 2, { nazev: 'V provozu', typ: 'yesno' });

// Osoba
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(400);
await p.getByRole('button', { name: /Přidat typ entity/ }).click();
await pauza(400);
await p.fill('#te-ic', '👤');
await p.fill('#te-nm', 'Osoba');
await p.locator('#te-nm').blur();
await pauza(200);
await novyAtribut(p);
await atribut(p, 0, { nazev: 'E-mail', typ: 'text', vSeznamu: true });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Útvar', typ: 'text' });
await p.getByRole('button', { name: /Zpět na seznam/ }).click();
await pauza(500);
await snimek(p, 'scrsettypes');

/* --- 5. Aspekt --- */
await nastaveni(p, 'Aspekty');
await p.getByRole('button', { name: /Přidat aspekt/ }).click();
await pauza(400);
await p.fill('#ae-nm', 'Osobní údaje');
await p.locator('#ae-nm').blur();
await pauza(200);
await novyAtribut(p);
await atribut(p, 0, { nazev: 'Zpracovává osobní údaje', typ: 'yesno' });
await novyAtribut(p);
await atribut(p, 1, { nazev: 'Právní titul', typ: 'text' });
await pauza(400);
await snimek(p, 'scrsetasp');

/* --- 6. Typ vazby --- */
await nastaveni(p, 'Typy vazeb');
await p.getByRole('button', { name: /Přidat typ vazby/ }).click();
await pauza(400);
await p.fill('#re-nm', 'Podporuje');
await p.fill('#re-inv', 'Je podporována');
await p.locator('#re-inv').blur();
await pauza(400);
await snimek(p, 'scrsetrel');

/* --- 7. První entita --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(600);
await p.getByRole('button', { name: /Nová entita/ }).first().click();
await pauza(600);
await snimek(p, 'dlgnewent');
await p.locator('#dlg button').filter({ hasText: 'Agenda' }).click();
await pauza(700);
await snimek(p, 'scrnewent');

await p.fill('#ent-name', 'Evidence obyvatel');
await p.getByLabel('Kód agendy').fill('A115');
await p.getByLabel('Popis').fill('Vedení údajů o obyvatelích obce podle zákona o evidenci obyvatel.\n\nZahrnuje **přihlášení k pobytu**, změny údajů a výdej potvrzení.');
await p.getByLabel('Stav').selectOption({ label: 'V řešení' });
await p.getByLabel('Termín').fill('2026-12-31');
await pauza(400);
await snimek(p, 'scrnewent');

await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1200);
await snimek(p, 'scrdetent');

/* --- 8. Další entity, aby bylo co ukazovat --- */
await entita(p, 'Informační systém', 'Registr obyvatel ROB', {
  'Zkratka': 'ROB',
  'Adresa': 'https://www.szrcr.cz/',
});
await entita(p, 'Informační systém', 'Spisová služba', { 'Zkratka': 'eSSL' });
await entita(p, 'Osoba', 'Jana Dvořáková', {
  'E-mail': 'dvorakova@obec.cz',
  'Útvar': 'Odbor správní',
});
await entita(p, 'Osoba', 'Petr Málek', {
  'E-mail': 'malek@obec.cz',
  'Útvar': 'Odbor informatiky',
});
await entita(p, 'Agenda', 'Matrika', {
  'Kód agendy': 'A123',
  'Popis': 'Vedení matričních knih, vydávání matričních dokladů.',
  'Stav': 'Hotovo',
  'Termín': '2026-06-30',
});
await entita(p, 'Agenda', 'Ověřování listin', {
  'Kód agendy': 'A401',
  'Popis': 'Vidimace a legalizace na kontaktním místě.',
  'Stav': 'Návrh',
  'Termín': '2027-03-31',
});
await entita(p, 'Agenda', 'Místní poplatky', {
  'Kód agendy': 'A210',
  'Popis': 'Správa a vymáhání místních poplatků.',
  'Stav': 'Schváleno',
  'Termín': '2026-09-30',
});

/* --- 9. Seznam entit --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await snimek(p, 'scrallview');

/* --- 10. Vazba mezi entitami --- */
await p.locator('.ecard').filter({ hasText: 'Evidence obyvatel' }).first().click();
await pauza(800);
await p.getByRole('button', { name: /Přidat vazbu/ }).first().click();
await pauza(700);
await p.locator('#dlg select').first().selectOption({ index: 1 });
await pauza(600);
await p.locator('#dlg select').nth(2).selectOption({ label: '💻 Registr obyvatel ROB [Informační systém]' });
await pauza(400);
await snimek(p, 'dlgaddrel');
await p.locator('#dlg button').filter({ hasText: 'Přidat vazbu' }).click();
await pauza(1000);

// druhá vazba — garant agendy
await p.getByRole('button', { name: /Přidat vazbu/ }).first().click();
await pauza(700);
await p.locator('#dlg select').first().selectOption({ index: 1 });
await pauza(600);
await p.locator('#dlg select').nth(2).selectOption({ label: '👤 Jana Dvořáková [Osoba]' });
await pauza(300);
await p.locator('#dlg button').filter({ hasText: 'Přidat vazbu' }).click();
await pauza(1000);
await snimek(p, 'scrdetent');

/* --- 11. Aspekt a komentář na entitě --- */
await p.getByRole('button', { name: 'Upravit', exact: true }).first().click();
await pauza(800);
await p.getByLabel(/Osobní údaje/).check();
await pauza(600);
await snimek(p, 'scredent');
await p.getByLabel('Zpracovává osobní údaje').check().catch(() => {});
await p.getByLabel('Právní titul').fill('Zákon č. 133/2000 Sb., o evidenci obyvatel').catch(() => {});
await pauza(300);
await p.getByRole('button', { name: 'Uložit', exact: true }).last().click();
await pauza(1200);

await p.locator('#cmt-t, textarea[placeholder*="komentář"]').first().fill('Termín posunut po dohodě s odborem informatiky.');
await pauza(300);
await p.getByRole('button', { name: /Přidat komentář/ }).click();
await pauza(900);
await snimek(p, 'scrdetent');

/* --- 12. Zobrazení dat --- */
await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await p.getByRole('button', { name: 'Tabulka', exact: true }).click();
await pauza(800);
await snimek(p, 'scrallview.table', { presne: true });
await p.getByRole('button', { name: 'Kanban', exact: true }).click();
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
await p.fill('#sin', 'matrik');
await pauza(900);
await snimek(p, 'scrallview');
await p.fill('#sin', '');
await pauza(600);

await p.getByRole('button', { name: /Pokročilé filtry/ }).click();
await pauza(700);
await p.getByRole('button', { name: /Přidat pravidlo/ }).click();
await pauza(600);
await p.getByLabel('Atribut').selectOption({ label: 'Agenda / Stav' });
await pauza(500);
await p.getByLabel('Operátor').selectOption({ index: 0 });
await pauza(400);
const poleHodnoty = p.locator('.advf-row input, .advf-row select').last();
await poleHodnoty.selectOption({ label: 'V řešení' }).catch(async () => {
  await poleHodnoty.fill('V řešení');
});
await pauza(900);
await snimek(p, 'scrallview');

/* --- 14. Uložený pohled --- */
await p.getByRole('button', { name: /Uložit jako pohled/ }).click();
await pauza(700);
await snimek(p, 'dlgsaveview');
await p.locator('#dlg input[type=text]').first().fill('Rozpracované agendy');
await pauza(300);
await p.locator('#dlg button').filter({ hasText: /Uložit/ }).last().click();
await pauza(1000);
await p.getByRole('button', { name: /Vyčistit filtry/ }).click().catch(() => {});
await pauza(700);

/* --- 15. Hromadné operace --- */
await p.getByRole('button', { name: /Pokročilé filtry/ }).click();
await pauza(500);
await p.getByRole('button', { name: /Výběr/ }).click();
await pauza(700);
await p.locator('.ecard').filter({ hasText: 'Matrika' }).first().click();
await pauza(300);
await p.locator('.ecard').filter({ hasText: 'Ověřování listin' }).first().click();
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
await p.getByRole('button', { name: /Zrušit výběr/ }).click();
await pauza(600);

/* --- 16. Rychlá paleta --- */
await p.locator('body').click({ position: { x: 5, y: 400 } });
await p.keyboard.press('Control+p');
await pauza(900);
await p.keyboard.type('matr');
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

/* --- 18. PlantUML a balíček přes rozcestník exportu --- */
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
await p.locator('.ecard').filter({ hasText: 'Evidence obyvatel' }).first().click();
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

/* --- 23. Inbox, archiv, náhled vedle seznamu --- */
await p.locator('.tab').filter({ hasText: 'Inbox' }).click();
await pauza(700);
await p.fill('#qa-n', 'Zjistit, kdo spravuje registr smluv');
await p.fill('#qa-t', 'Padlo na poradě — ověřit u odboru informatiky.');
await pauza(400);
await snimek(p, 'scrinbox');
await p.getByRole('button', { name: /Přidat do Inboxu/ }).click();
await pauza(900);
await snimek(p, 'scrinbox');

await p.locator('.tab').filter({ hasText: 'Vše' }).click();
await pauza(700);
await p.getByRole('button', { name: /Náhled vedle seznamu/ }).click();
await pauza(700);
await p.locator('.ecard').filter({ hasText: 'Matrika' }).first().click();
await pauza(900);
await snimek(p, 'scrallview.preview', { presne: true });
await p.getByRole('button', { name: /Náhled vedle seznamu/ }).click();
await pauza(700);

/* ===KONEC=== */
await prohlizec.close();
console.log(`\nHotovo: ${poradi} snímků ve složce ${SLOZKA}\n`);
process.exit(0);
