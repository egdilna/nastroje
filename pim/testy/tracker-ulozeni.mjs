// Tracker v režimu čtení: tlačítka ±1 a ±10 mění hodnotu jen na obrazovce,
// do dat se zapíše až tlačítkem „Uložit hodnotu" (jeden záznam v historii).
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const soucet = novySoucet('Tracker: ukládání tlačítkem');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

await stranka.evaluate(() => {
  db.entities = [
    newEntity({ id: 't1', title: 'Kliky', aspects: ['Tracker'],
      attributes: { tracker_value: 5, tracker_unit: 'ks', tracker_target: 100,
        tracker_history: [{ ts: nowIso(), oldValue: null, newValue: 5, delta: 0, note: 'start' }] } }),
    newEntity({ id: 'k', title: 'KANÁREK', aspects: ['Tracker'], attributes: { tracker_value: 7 } })
  ];
  window.__ulozeni = 0;
  const puv = save;
  save = function () { window.__ulozeni++; return puv.apply(this, arguments); };
  setView('detail', { detailId: 't1', detailMode: 'read' });
});
await stranka.waitForTimeout(400);

const stav = () => stranka.evaluate(() => ({
  data: findEntity('t1').attributes.tracker_value,
  hist: findEntity('t1').attributes.tracker_history.length,
  zobrazeno: (document.querySelector('.tracker-value') || {}).textContent,
  tlacitka: Array.from(document.querySelectorAll('section.tracker-section button[data-tracker-delta]')).map(b => b.dataset.trackerDelta),
  ulozit: !!document.getElementById('tracker-ulozit-btn'),
  ulozeni: window.__ulozeni,
  fokus: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.trackerDelta : null,
  kanarek: findEntity('k').attributes.tracker_value
}));

nadpis('Tlačítka v režimu čtení');
let s = await stav();
ok(soucet, s.tlacitka.join(',') === '-10,-1,1,10', 'jsou −10, −1, +1, +10', s.tlacitka);
ok(soucet, !s.ulozit, 'bez změny není tlačítko Uložit', s);

nadpis('Kliknutí nemění data');
await stranka.click('button[data-tracker-delta="10"]');
await stranka.click('button[data-tracker-delta="10"]');
await stranka.click('button[data-tracker-delta="-1"]');
s = await stav();
ok(soucet, s.zobrazeno === '24', 'zobrazená hodnota 5 + 10 + 10 − 1 = 24', s.zobrazeno);
ok(soucet, s.data === 5 && s.hist === 1 && s.ulozeni === 0, 'data, historie ani save() se nezměnily', s);
ok(soucet, s.ulozit, 'objevilo se tlačítko Uložit hodnotu');
ok(soucet, s.fokus === '-1', 'fokus zůstal na stisknutém tlačítku', s.fokus);

nadpis('Uložení');
await stranka.fill('#tracker-poznamka', 'ranní série');
await stranka.click('#tracker-ulozit-btn');
await stranka.waitForTimeout(200);
s = await stav();
const posl = await stranka.evaluate(() => findEntity('t1').attributes.tracker_history.slice(-1)[0]);
ok(soucet, s.data === 24 && s.hist === 2 && s.ulozeni >= 1, 'hodnota uložena jedním záznamem historie', s);
ok(soucet, posl.delta === 19 && posl.note === 'ranní série', 'záznam nese změnu +19 a poznámku', posl);
ok(soucet, !s.ulozit, 'po uložení tlačítko Uložit zmizí');

nadpis('Zahodit');
await stranka.click('button[data-tracker-delta="-10"]');
await stranka.click('#tracker-zahodit-btn');
s = await stav();
ok(soucet, s.zobrazeno === '24' && s.data === 24 && s.hist === 2, 'zahozená změna se nikam nepropsala', s);

nadpis('Edit mód má taky ±10');
await stranka.evaluate(() => setView('detail', { detailId: 't1', detailMode: 'edit' }));
await stranka.waitForTimeout(300);
s = await stav();
ok(soucet, s.tlacitka.join(',') === '-10,-1,1,10', 'v editaci jsou −10, −1, +1, +10', s.tlacitka);
ok(soucet, s.kanarek === 7, 'kanárek se nezměnil', s.kanarek);

await prohlizec.close();
process.exit(uzavri(soucet));
