// POHLED PŘIPOMENUTÍ — tabulka termínů a jejich přeplánování.
//
// Dřív bylo datum v tabulce jako <input type="date">: změna okamžitě uložila,
// překreslila celý pohled, řádek se kvůli řazení podle data přesunul jinam
// a fokus spadl na <body>. Vyprázdnění pole navíc připomenutí tiše smazalo.
// Teď je v tabulce jen datum a přeplánování má vlastní dialog s výběrem data.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Připomenutí');
const { prohlizec, stranka } = await otevriAplikaci(s);

async function priprav() {
  // Případný otevřený dialog z předchozí části zavřít, ať nepřekáží klikání.
  await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
  await nasypej(stranka, [
    { id: 'r1', title: 'Alfa', aspects: ['Note'], attributes: { reminder_at: '2026-01-10' } },
    { id: 'r2', title: 'Beta', aspects: ['Note'], attributes: { reminder_at: '2026-02-20' } },
    { id: 'r3', title: 'Gama', aspects: ['Note'], attributes: { reminder_at: '2026-03-30' } }
  ]);
  await stranka.evaluate(() => setView('reminders'));
  await stranka.waitForTimeout(500);
}

const radky = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#main tbody tr')].map(tr => ({
    entita: tr.children[0].textContent.trim(),
    datum: tr.children[1].textContent.trim(),
    akce: [...tr.children[3].querySelectorAll('button')].map(b => b.textContent.trim())
  })));
const pripomenuti = (id) => stranka.evaluate((id) => ((findEntity(id) || {}).attributes || {}).reminder_at, id);
const fokus = () => stranka.evaluate(() => {
  const a = document.activeElement;
  return a ? (a.tagName + (a.className ? '.' + a.className : '') + (a.dataset && a.dataset.remId ? '#' + a.dataset.remId : '')) : null;
});

nadpis('Tabulka ukazuje datum, ne výběr');
await priprav();
ok(s, await stranka.evaluate(() => document.querySelectorAll('#main input[type="date"]').length === 0),
  'v tabulce už není žádné pole pro datum');
const r = await radky();
ok(s, r.length === 3, 'všechna tři připomenutí jsou v tabulce', r.length);
ok(s, /^\d/.test(r[0].datum) && r[0].datum.length > 5, 'datum je vypsané jako text', r[0].datum);
ok(s, await stranka.evaluate(() => {
  const t = document.querySelector('#main tbody td time');
  return !!t && t.getAttribute('datetime') === '2026-01-10';
}), 'a je ve značce <time> se strojově čitelným datem');
ok(s, r[0].akce.length === 2 && /Přeplánovat/.test(r[0].akce[0]) && /Odstranit/.test(r[0].akce[1]),
  'akce jsou Přeplánovat a Odstranit', r[0].akce);
ok(s, await stranka.evaluate(() => {
  const b = document.querySelector('button.rem-resched');
  return !!b && /Alfa/.test(b.getAttribute('aria-label') || '');
}), 'tlačítko říká odečítači, u které entity je');

nadpis('Přeplánování otevře výběr data');
await stranka.click('button.rem-resched[data-rem-id="r1"]');
await stranka.waitForTimeout(500);
const dlg = await stranka.evaluate(() => {
  const d = document.getElementById('dialog-datum');
  return {
    otevreno: !!(d && d.open),
    hodnota: (document.getElementById('dialog-datum-input') || {}).value,
    titulek: (document.getElementById('dialog-datum-title') || {}).textContent,
    popis: (document.getElementById('dialog-datum-popis') || {}).textContent,
    fokusVPoli: document.activeElement && document.activeElement.id === 'dialog-datum-input'
  };
});
ok(s, dlg.otevreno, 'dialog se otevřel', dlg);
ok(s, dlg.hodnota === '2026-01-10', 'předvyplnil stávající datum', dlg);
ok(s, /Alfa/.test(dlg.popis), 'a říká, které entity se týká', dlg);
ok(s, dlg.fokusVPoli, 'fokus je rovnou v poli data', dlg);

nadpis('Potvrzení uloží a vrátí fokus');
await stranka.evaluate(() => {
  const i = document.getElementById('dialog-datum-input');
  i.value = '2026-12-31'; i.dispatchEvent(new Event('input', { bubbles: true }));
});
await stranka.click('#datum-ok');
await stranka.waitForTimeout(700);
ok(s, (await pripomenuti('r1')) === '2026-12-31', 'datum se uložilo', await pripomenuti('r1'));
ok(s, !(await stranka.evaluate(() => document.getElementById('dialog-datum').open)), 'dialog se zavřel');
const r2 = await radky();
ok(s, r2.length === 3 && r2[2].entita.includes('Alfa'), 'řádek se přeřadil podle nového data', r2.map(x => x.entita));
ok(s, (await fokus()) === 'BUTTON.rem-resched#r1', 'fokus se vrátil na Přeplánovat u té entity', await fokus());

nadpis('Zrušení dialogu nic nezmění');
const pred = await pripomenuti('r2');
await stranka.click('button.rem-resched[data-rem-id="r2"]');
await stranka.waitForTimeout(400);
await stranka.evaluate(() => { document.getElementById('dialog-datum-input').value = '2030-01-01'; });
await stranka.click('#datum-cancel');
await stranka.waitForTimeout(500);
ok(s, (await pripomenuti('r2')) === pred, 'datum zůstalo původní', await pripomenuti('r2'));
ok(s, (await fokus()) === 'BUTTON.rem-resched#r2', 'a fokus je zpátky na tlačítku', await fokus());

nadpis('Esc se chová jako Zrušit');
await stranka.click('button.rem-resched[data-rem-id="r3"]');
await stranka.waitForTimeout(400);
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(500);
ok(s, (await pripomenuti('r3')) === '2026-03-30', 'Esc datum nezmění', await pripomenuti('r3'));
ok(s, !(await stranka.evaluate(() => document.getElementById('dialog-datum').open)), 'a dialog je zavřený');

nadpis('Enter v poli potvrdí');
await priprav();
await stranka.click('button.rem-resched[data-rem-id="r2"]');
await stranka.waitForTimeout(400);
await stranka.evaluate(() => { document.getElementById('dialog-datum-input').value = '2026-06-15'; });
await stranka.press('#dialog-datum-input', 'Enter');
await stranka.waitForTimeout(700);
ok(s, (await pripomenuti('r2')) === '2026-06-15', 'Enter uloží stejně jako tlačítko', await pripomenuti('r2'));

nadpis('Prázdné datum se neuloží');
await priprav();
await stranka.click('button.rem-resched[data-rem-id="r1"]');
await stranka.waitForTimeout(400);
await stranka.evaluate(() => { document.getElementById('dialog-datum-input').value = ''; });
await stranka.click('#datum-ok');
await stranka.waitForTimeout(500);
ok(s, (await pripomenuti('r1')) === '2026-01-10', 'prázdné datum připomenutí nesmaže', await pripomenuti('r1'));
ok(s, await stranka.evaluate(() => document.getElementById('dialog-datum').open),
  'a dialog zůstane otevřený, aby šlo datum doplnit');
ok(s, /Vyberte datum/.test(await stranka.evaluate(() => document.getElementById('alert-region').textContent)),
  'odečítač se dozví proč');

nadpis('Odstranit');
await priprav();
await stranka.click('button.rem-remove[data-rem-id="r2"]');
await stranka.waitForTimeout(700);
ok(s, !(await pripomenuti('r2')), 'připomenutí je pryč', await pripomenuti('r2'));
ok(s, (await radky()).length === 2, 'a řádek zmizel z tabulky');
ok(s, (await pripomenuti('r1')) === '2026-01-10' && (await pripomenuti('r3')) === '2026-03-30',
  'ostatní zůstala nedotčená');
ok(s, (await fokus()) !== 'BODY', 'fokus nespadl na stránku', await fokus());

nadpis('Poslední připomenutí a prázdný pohled');
await nasypej(stranka, [{ id: 'j1', title: 'Jedina', aspects: ['Note'], attributes: { reminder_at: '2026-05-05' } }]);
await stranka.evaluate(() => setView('reminders'));
await stranka.waitForTimeout(500);
const chybPred = s.chyby.length;
await stranka.click('button.rem-remove[data-rem-id="j1"]');
await stranka.waitForTimeout(700);
ok(s, s.chyby.length === chybPred, 'odstranění posledního připomenutí nic nerozbije');
ok(s, await stranka.evaluate(() => document.querySelectorAll('#main tbody tr').length === 0),
  'tabulka je prázdná');

await prohlizec.close();
process.exit(uzavri(s));
