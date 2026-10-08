// Nabídka wiki odkazů na rozpoznaná jména se musí spustit při KAŽDÉM ukončení
// editace, ne jen při tlačítku „Hotovo".
//
// Dřív volalo detekci jen „Hotovo (uložit a zpět)". Escape a klávesa U uložily,
// vrátily do read módu — a detekci tiše přeskočily. Kdo z editace odchází
// Escapem, nabídku nedostal nikdy a vypadalo to, že detekce nefunguje vůbec.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const soucet = novySoucet('Detekce jmen při ukončení editace');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

// Spustí danou akci nad editací a vrátí, co detekce nabídla.
const odchod = (akce) => stranka.evaluate(async (akce) => {
  const log = [];
  const origDetect = window.detectAndOfferNamedEntities;
  const origDialog = window.showDetectDialog;
  window.detectAndOfferNamedEntities = function () { log.push('detekce'); return origDetect.apply(this, arguments); };
  window.showDetectDialog = function (e, m, dal) { log.push(m.matchText); dal(); };
  try { localStorage.removeItem('pim_detect_ignored_v1'); } catch (e) {}
  db.entities.length = 0;
  db.entities.push(newEntity({ id: 'org', title: 'Psychiatrická nemocnice Brno', aspects: ['Organization'] }));
  db.entities.push(newEntity({ id: 'os', title: 'Jan Škaroupka', aspects: ['Person'] }));
  db.entities.push(newEntity({ id: 'z', title: 'Zápis', aspects: ['Note'], body: '' }));
  db.entities.push(newEntity({ id: 'kanarek', title: 'Kanárek', aspects: ['Note'], body: 'Psychiatrická nemocnice Brno' }));
  state._sessionSkippedNames = null;
  setView('detail', { detailId: 'z', detailMode: 'edit' });
  await new Promise(z => setTimeout(z, 700));
  const ta = document.getElementById('d-body');
  ta.value = 'Schůzka: Psychiatrická nemocnice Brno a Jan Škaroupka.';
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(z => setTimeout(z, 250));
  try { await eval('(async()=>{' + akce + '})()'); } catch (e) { log.push('CHYBA ' + e.message); }
  await new Promise(z => setTimeout(z, 900));
  window.detectAndOfferNamedEntities = origDetect;
  window.showDetectDialog = origDialog;
  return {
    nabidky: log.filter(x => x !== 'detekce'),
    spustena: log.indexOf('detekce') >= 0,
    rezim: state.detailMode,
    telo: findEntity('z').body,
    kanarek: findEntity('kanarek').body
  };
}, akce);

const KLAVESA = (k) => `document.dispatchEvent(new KeyboardEvent('keydown',{key:'${k}',bubbles:true}));`;

nadpis('Každá cesta ven z editace nabídne rozpoznaná jména');
for (const [popis, akce] of [
  ['Hotovo (uložit a zpět)', `document.getElementById('btn-done').click();`],
  ['Escape', KLAVESA('Escape')],
  // Klávesa U platí jen mimo editační pole (v poli je Ctrl+U markdownová zkratka).
  ['klávesa U', `document.getElementById('d-body').blur(); ` + KLAVESA('u')]
]) {
  const r = await odchod(akce);
  ok(soucet, r.spustena === true, popis + ' — detekce se spustí', r);
  ok(soucet, r.nabidky.join(' | ') === 'Psychiatrická nemocnice Brno | Jan Škaroupka',
    popis + ' — nabídne obě jména', r.nabidky);
  ok(soucet, r.rezim === 'read', popis + ' — a skončí v read módu', r.rezim);
  ok(soucet, r.telo === 'Schůzka: Psychiatrická nemocnice Brno a Jan Škaroupka.',
    popis + ' — text zůstal uložený (kanárek)', r.telo);
  ok(soucet, r.kanarek === 'Psychiatrická nemocnice Brno',
    popis + ' — jiná entita se nezměnila (kanárek)', r.kanarek);
}

nadpis('Escape si zachoval i migraci anotací');
const migrace = await stranka.evaluate(async () => {
  db.entities.length = 0;
  const e = newEntity({ id: 'm1', title: 'Se starou anotací', aspects: ['Note'], body: 'První odstavec.' });
  e.annotations = [{ id: 'a1', content: 'stará poznámka', originalText: 'První odstavec.', paragraphIndex: 0 }];
  db.entities.push(e);
  setView('detail', { detailId: 'm1', detailMode: 'edit' });
  await new Promise(z => setTimeout(z, 700));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise(z => setTimeout(z, 900));
  const x = findEntity('m1');
  return { body: x.body, anotaci: (x.annotations || []).length, rezim: state.detailMode };
});
ok(soucet, /\(>stará poznámka\)/.test(migrace.body) && migrace.anotaci === 0,
  'stará JSON anotace se při Escapu pořád převede do textu', migrace);
ok(soucet, migrace.rezim === 'read', 'a skončí se v read módu', migrace.rezim);

nadpis('Co editaci neukončuje, detekci nespouští');
const vEditaci = await odchod(`setView('dashboard');`);
ok(soucet, vEditaci.spustena === false,
  'odchod na jiný pohled editaci neukončuje, takže se nic nenabízí', vEditaci);
ok(soucet, vEditaci.telo === 'Schůzka: Psychiatrická nemocnice Brno a Jan Škaroupka.',
  'a text je stejně uložený (kanárek)', vEditaci.telo);

nadpis('Ignorované jméno se nenabízí ani nově');
const ignorovane = await stranka.evaluate(async () => {
  const origDialog = window.showDetectDialog;
  const log = [];
  window.showDetectDialog = function (e, m, dal) { log.push(m.matchText); dal(); };
  try { localStorage.setItem('pim_detect_ignored_v1', JSON.stringify(['jan škaroupka'])); } catch (e) {}
  db.entities.length = 0;
  db.entities.push(newEntity({ id: 'org', title: 'Psychiatrická nemocnice Brno', aspects: ['Organization'] }));
  db.entities.push(newEntity({ id: 'os', title: 'Jan Škaroupka', aspects: ['Person'] }));
  db.entities.push(newEntity({ id: 'z', title: 'Zápis', aspects: ['Note'], body: '' }));
  state._sessionSkippedNames = null;
  setView('detail', { detailId: 'z', detailMode: 'edit' });
  await new Promise(z => setTimeout(z, 700));
  const ta = document.getElementById('d-body');
  ta.value = 'Psychiatrická nemocnice Brno a Jan Škaroupka.';
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise(z => setTimeout(z, 900));
  window.showDetectDialog = origDialog;
  try { localStorage.removeItem('pim_detect_ignored_v1'); } catch (e) {}
  return log;
});
ok(soucet, ignorovane.join(',') === 'Psychiatrická nemocnice Brno',
  'jednou ignorované jméno zůstává ignorované i na nové cestě', ignorovane);

await prohlizec.close();
process.exit(uzavri(soucet));
