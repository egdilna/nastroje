// Rychlá úprava aspektů jedné entity: klávesa K v detailu, tlačítko 🧩 Aspekty,
// klávesa A nad řádkem v tabulce entit. Sdílí dialog s rychlou úpravou tagů
// (otevriRychlyVyber), takže se tu hlídá hlavně to, co je u aspektů jiné:
// nejdou zakládat nové, popisky mají ikony a vybírá se z pevné nabídky.
import { novySoucet, ok, nadpis, otevriAplikaci, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Rychlá úprava aspektů');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

async function pripravDb() {
  await stranka.evaluate(() => {
    db.entities = [
      newEntity({ id: 'x', title: 'Hlavní entita', aspects: ['Note', 'Task'] }),
      newEntity({ id: 'k1', title: 'KANÁREK-1', aspects: ['Person'], tags: ['t1'] }),
      newEntity({ id: 'k2', title: 'KANÁREK-2', aspects: ['Project'] })
    ];
    for (let i = 0; i < 6; i++) db.entities.push(newEntity({ id: 'n' + i, title: 'N' + i, aspects: ['Note'] }));
    for (let i = 0; i < 2; i++) db.entities.push(newEntity({ id: 'p' + i, title: 'P' + i, aspects: ['Project'] }));
    setView('detail', { detailId: 'x', detailMode: 'read' });
  });
  await stranka.waitForTimeout(500);
}
const kanarci = () => stranka.evaluate(() => ['k1', 'k2']
  .map(id => id + ':' + (findEntity(id).aspects || []).join('|') + ':' + (findEntity(id).tags || []).join('|')).join(' '));
const KANARCI = 'k1:Person:t1 k2:Project:';

const stavDialogu = () => stranka.evaluate(() => {
  const d = document.getElementById('quick-aspect-dialog');
  if (!d || !d.open) return null;
  const grp = (id) => Array.from(document.querySelectorAll('#' + id + ' .rv-polozka'))
    .map(l => ({ klic: l.dataset.rvKlic, popis: l.querySelector('.rv-nazev').textContent,
                 zaskrtnuto: l.querySelector('input').checked,
                 skryto: l.classList.contains('rv-skryto'),
                 pocet: l.querySelector('.rv-pocet') ? l.querySelector('.rv-pocet').textContent : '' }));
  return { titulek: document.getElementById('rv-title').textContent,
    prirazene: grp('rv-prirazene'), ostatni: grp('rv-ostatni'),
    stav: document.getElementById('rv-stav').textContent,
    maPridat: !!document.getElementById('rv-pridat'),
    poznamka: (document.querySelector('.rv-poznamka') || {}).textContent || '',
    fokus: document.activeElement ? document.activeElement.id : '' };
});
const prepni = (klic, hodnota) => stranka.evaluate(({ klic, hodnota }) => {
  const l = Array.from(document.querySelectorAll('.rv-polozka')).find(x => x.dataset.rvKlic === klic);
  if (!l) return false;
  const cb = l.querySelector('input');
  cb.checked = hodnota;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, { klic, hodnota });

nadpis('Tlačítko v liště detailu');
await pripravDb();
const tl = await stranka.evaluate(() => {
  const b = document.getElementById('btn-aspects');
  return b ? { text: b.textContent.trim(), title: b.title } : null;
});
ok(soucet, !!tl, 'v liště detailu je tlačítko 🧩 Aspekty', tl);
ok(soucet, tl && tl.text.includes('(2)'), 'ukazuje počet aspektů', tl && tl.text);
ok(soucet, tl && /klávesa K/i.test(tl.title), 'title říká, že to jde klávesou K', tl && tl.title);

nadpis('Klávesa K v detailu (read) otevře dialog');
await stranka.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
await stranka.keyboard.press('k');
await stranka.waitForTimeout(400);
let s = await stavDialogu();
ok(soucet, !!s, 'dialog se otevřel', s);
ok(soucet, s && s.fokus === 'rv-filtr', 'fokus je rovnou ve filtru', s && s.fokus);
ok(soucet, s && s.titulek.includes('Hlavní entita'), 'v titulku je název entity', s && s.titulek);

nadpis('Přiřazené nahoře, ostatní podle četnosti, popisky s ikonou');
ok(soucet, s && s.prirazene.map(p => p.klic).join(',') === 'Note,Task',
  'přiřazené aspekty jsou v horní skupině', s && s.prirazene.map(p => p.klic));
ok(soucet, s && s.prirazene.every(p => p.zaskrtnuto), 'a jsou zaškrtnuté');
ok(soucet, s && /📝/.test(s.prirazene[0].popis), 'popisek nese ikonu aspektu', s && s.prirazene[0].popis);
ok(soucet, s && s.prirazene[0].pocet === '(7)',
  'u aspektu je vidět, kolik entit ho má (Poznámka 7×)', s && s.prirazene[0].pocet);
ok(soucet, s && s.ostatni.length > 0 && s.ostatni[0].klic === 'Project',
  'nepřiřazené vede nejčastější aspekt (Projekt 3×)', s && s.ostatni.slice(0, 3).map(p => p.klic + p.pocet));
ok(soucet, s && s.ostatni.every(p => !p.zaskrtnuto), 'a nejsou zaškrtnuté');
ok(soucet, s && s.stav === '2 přiřazeno · beze změn', 'stavový řádek', s && s.stav);

nadpis('Nové aspekty tudy vznikat nemůžou');
ok(soucet, s && s.maPridat === false,
  'u aspektů není tlačítko „+ Přidat" — vlastní aspekt se zakládá v Nastavení', s && s.maPridat);
ok(soucet, s && /nesmažou/.test(s.poznamka),
  'dialog říká, že odebráním aspektu se hodnoty polí nesmažou', s && s.poznamka);

nadpis('Filtr hledá i v popisku (český název s ikonou)');
await stranka.fill('#rv-filtr', 'projek');
await stranka.waitForTimeout(250);
s = await stavDialogu();
ok(soucet, s && s.ostatni.filter(p => !p.skryto).map(p => p.klic).join(',') === 'Project',
  '„projek" najde aspekt Projekt podle českého popisku', s && s.ostatni.filter(p => !p.skryto).map(p => p.klic));
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(300);
s = await stavDialogu();
ok(soucet, s && s.ostatni.find(p => p.klic === 'Project').zaskrtnuto,
  'Enter nad jedinou shodou aspekt zaškrtne');
ok(soucet, s && s.stav === '3 přiřazeno · +1', 'počítadlo ukazuje +1', s && s.stav);

nadpis('Do dat se nesáhlo, dokud se neuložilo');
ok(soucet, (await stranka.evaluate(() => findEntity('x').aspects.join(','))) === 'Note,Task',
  'entita má pořád původní aspekty');
ok(soucet, (await kanarci()) === KANARCI, 'kanárci: ostatní entity nedotčené');

nadpis('Uložit zapíše a vrátí fokus na tlačítko');
await prepni('Task', false);
await stranka.waitForTimeout(150);
await stranka.click('#rv-save');
await stranka.waitForTimeout(600);
const po = await stranka.evaluate(() => ({
  aspekty: findEntity('x').aspects,
  dialog: !!document.getElementById('quick-aspect-dialog'),
  fokus: document.activeElement ? document.activeElement.id : '',
  tlacitko: (document.getElementById('btn-aspects') || {}).textContent || '' }));
ok(soucet, po.aspekty.join(',') === 'Note,Project',
  'uloží se zaškrtnuté aspekty, původní pořadí zůstává a nové jdou na konec', po.aspekty);
ok(soucet, po.dialog === false, 'dialog se zavřel a odstranil z DOM');
ok(soucet, po.fokus === 'btn-aspects', 'fokus se vrátil na tlačítko', po.fokus);
ok(soucet, po.tlacitko.includes('(2)'), 'tlačítko ukazuje nový počet', po.tlacitko);
ok(soucet, (await kanarci()) === KANARCI, 'kanárci: uložení se dotklo jen téhle entity');

nadpis('Odebraný aspekt nemaže hodnoty svých polí');
const zustaly = await stranka.evaluate(async () => {
  const e = findEntity('x');
  e.aspects = ['Task'];
  e.attributes = { deadline: '2026-12-01', status: 'todo' };
  render();
  await new Promise(z => setTimeout(z, 300));
  openQuickAspectEditor('x');
  await new Promise(z => setTimeout(z, 300));
  const l = Array.from(document.querySelectorAll('.rv-polozka')).find(x => x.dataset.rvKlic === 'Task');
  const cb = l.querySelector('input');
  cb.checked = false; cb.dispatchEvent(new Event('change', { bubbles: true }));
  document.getElementById('rv-save').click();
  await new Promise(z => setTimeout(z, 400));
  const n = findEntity('x');
  return { aspekty: n.aspects, deadline: (n.attributes || {}).deadline };
});
ok(soucet, zustaly.aspekty.length === 0 && zustaly.deadline === '2026-12-01',
  'aspekt zmizel, ale hodnota jeho pole v datech zůstala', zustaly);

nadpis('Zrušit nechá data přesně tak, jak byla');
await stranka.evaluate(() => { findEntity('x').aspects = ['Note']; render(); });
await stranka.waitForTimeout(300);
await stranka.evaluate(() => openQuickAspectEditor('x'));
await stranka.waitForTimeout(400);
await prepni('Project', true);
await prepni('Note', false);
await stranka.waitForTimeout(150);
await stranka.click('#rv-cancel');
await stranka.waitForTimeout(400);
ok(soucet, (await stranka.evaluate(() => findEntity('x').aspects.join(','))) === 'Note',
  'po Zrušit zůstaly aspekty nezměněné');
ok(soucet, (await kanarci()) === KANARCI, 'kanárci po zrušení');

nadpis('Escape se ptá, když je rozdělaná práce');
await stranka.evaluate(() => openQuickAspectEditor('x'));
await stranka.waitForTimeout(400);
await prepni('Project', true);
await stranka.waitForTimeout(150);
stranka.removeAllListeners('dialog');
stranka.on('dialog', d => d.dismiss());
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(400);
ok(soucet, !!(await stavDialogu()), 'po odmítnutí otázky dialog zůstal otevřený');
stranka.removeAllListeners('dialog');
stranka.on('dialog', d => d.accept());
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(400);
ok(soucet, (await stavDialogu()) === null, 'po potvrzení se dialog zavřel');
ok(soucet, (await stranka.evaluate(() => findEntity('x').aspects.join(','))) === 'Note',
  'a změny se zahodily');

nadpis('Klávesa K v edit módu nic neotevírá');
await otevriDetail(stranka, 'x', 'edit');
await stranka.evaluate(() => { const t = document.getElementById('d-body'); if (t) t.focus(); });
await stranka.keyboard.press('k');
await stranka.waitForTimeout(300);
ok(soucet, (await stavDialogu()) === null, 'v editačním poli se píše písmeno, dialog nenaskočí');

nadpis('Klávesa A nad řádkem tabulky entit otevře aspekty');
const zTabulky = await stranka.evaluate(async () => {
  setView('all');
  await new Promise(z => setTimeout(z, 700));
  const tr = document.querySelector('tr[data-row-entity]');
  if (!tr) return '(tabulka bez řádků)';
  tr.focus();
  tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  const d = document.getElementById('quick-aspect-dialog');
  return d && d.open ? document.getElementById('rv-title').textContent : '(neotevřelo se)';
});
ok(soucet, /Aspekty:/.test(zTabulky), 'z tabulky entit otevře A týž dialog', zTabulky);

await prohlizec.close();
process.exit(uzavri(soucet));
