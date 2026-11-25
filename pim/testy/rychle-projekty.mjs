// Rychlá úprava projektů jedné entity: klávesa P v detailu i v tabulce entit,
// tlačítko 📁 Projekty, příkaz v paletě. Zaškrtnutí = vazba partOf na projekt.
// Hlídá se hlavně, že se sahá jen na vazby partOf na nabízené projekty.
import { novySoucet, ok, nadpis, otevriAplikaci, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Rychlá úprava projektů');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

await stranka.evaluate(() => {
  db.entities = [
    newEntity({ id: 'pa', title: 'Projekt Alfa', aspects: ['Project'] }),
    newEntity({ id: 'pb', title: 'Projekt Beta', aspects: ['Project'] }),
    newEntity({ id: 'pc', title: 'Projekt Čáp', aspects: ['Project'] }),
    newEntity({ id: 'parch', title: 'Starý projekt', aspects: ['Project'], archived: true }),
    newEntity({ id: 'ev', title: 'Schůzka', aspects: ['Event'] }),
    newEntity({ id: 'x', title: 'Hlavní entita', aspects: ['Note'], links: [
      { to: 'pa', type: 'partOf', note: 'POZNÁMKA-A' },
      { to: 'ev', type: 'partOf' },
      { to: 'parch', type: 'partOf' },
      { to: 'pb', type: 'related' }
    ] }),
    newEntity({ id: 'k1', title: 'KANÁREK', aspects: ['Note'], links: [{ to: 'pb', type: 'partOf' }, { to: 'pc', type: 'partOf' }] }),
    newEntity({ id: 'k2', title: 'KANÁREK-2', aspects: ['Note'], links: [{ to: 'pc', type: 'partOf' }] }),
    newEntity({ id: 'sub', title: 'Podprojekt', aspects: ['Project'], links: [{ to: 'pc', type: 'partOf' }] })
  ];
  setView('detail', { detailId: 'x', detailMode: 'read' });
});
await stranka.waitForTimeout(500);
const kanarci = () => stranka.evaluate(() => JSON.stringify(['k1', 'k2', 'sub'].map(id => findEntity(id).links)));
const KANARCI = await kanarci();

const stav = () => stranka.evaluate(() => {
  const d = document.getElementById('quick-project-dialog');
  if (!d || !d.open) return null;
  const grp = (id) => Array.from(document.querySelectorAll('#' + id + ' .rv-polozka'))
    .map(l => ({ klic: l.dataset.rvKlic, zaskrtnuto: l.querySelector('input').checked }));
  return { titulek: document.getElementById('rv-title').textContent,
    prirazene: grp('rv-prirazene'), ostatni: grp('rv-ostatni'),
    fokus: document.activeElement ? document.activeElement.id : '' };
});
const prepni = (klic, hodnota) => stranka.evaluate(({ klic, hodnota }) => {
  const l = Array.from(document.querySelectorAll('.rv-polozka')).find(x => x.dataset.rvKlic === klic);
  const cb = l.querySelector('input'); cb.checked = hodnota;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
}, { klic, hodnota });

nadpis('Tlačítko v liště detailu');
const tl = await stranka.evaluate(() => { const b = document.getElementById('btn-projects'); return b ? b.textContent.trim() : null; });
ok(soucet, tl && tl.includes('(1)'), 'tlačítko 📁 Projekty ukazuje počet aktivních projektů', tl);

nadpis('Klávesa P v detailu otevře dialog');
await stranka.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
await stranka.keyboard.press('p');
await stranka.waitForTimeout(400);
let s = await stav();
ok(soucet, !!s, 'dialog se otevřel', s);
ok(soucet, s && s.fokus === 'rv-filtr', 'fokus je ve filtru', s && s.fokus);
ok(soucet, s && s.prirazene.map(p => p.klic).join(',') === 'pa', 'přiřazený je jen aktivní projekt', s && s.prirazene);
ok(soucet, s && s.ostatni.map(p => p.klic).join(',') === 'pc,pb,sub',
  'ostatní podle počtu položek, bez archivovaného a bez schůzky', s && s.ostatni);

nadpis('Zaškrtnutí a odškrtnutí mění jen partOf na projekty');
await prepni('pa', false);
await prepni('pb', true);
await stranka.click('#rv-save');
await stranka.waitForTimeout(500);
const linky = await stranka.evaluate(() => findEntity('x').links.map(l => l.type + ':' + l.to).join(' '));
ok(soucet, linky === 'partOf:ev partOf:parch related:pb partOf:pb',
  'pa odebrán, pb přidán, schůzka, archivovaný projekt i jiná vazba zůstaly', linky);
ok(soucet, (await kanarci()) === KANARCI, 'kanárci beze změny');
ok(soucet, (await stranka.evaluate(() => document.activeElement && document.activeElement.id)) === 'btn-projects',
  'fokus se vrátil na tlačítko');

nadpis('Beze změny se nic neuloží');
const pred = await stranka.evaluate(() => findEntity('x').updated_at);
await stranka.evaluate(() => openQuickProjectEditor('x'));
await stranka.waitForTimeout(300);
await stranka.click('#rv-save');
await stranka.waitForTimeout(300);
ok(soucet, (await stranka.evaluate(() => findEntity('x').updated_at)) === pred, 'updated_at se nezvedl');

nadpis('Projekt nenabízí sebe ani svého potomka');
await stranka.evaluate(() => openQuickProjectEditor('pc'));
await stranka.waitForTimeout(300);
s = await stav();
const vse = s ? s.prirazene.concat(s.ostatni).map(p => p.klic) : [];
ok(soucet, !vse.includes('pc') && !vse.includes('sub') && vse.includes('pa'), 'bez cyklu', vse);
await stranka.click('#rv-cancel');

nadpis('Klávesa P v edit módu nic neotevírá');
await otevriDetail(stranka, 'x', 'edit');
await stranka.evaluate(() => { const t = document.getElementById('d-body'); if (t) t.focus(); });
await stranka.keyboard.press('p');
await stranka.waitForTimeout(300);
ok(soucet, (await stav()) === null, 'v editačním poli se píše písmeno');

nadpis('Klávesa P nad řádkem tabulky entit');
const zTab = await stranka.evaluate(async () => {
  state.detailMode = 'read';
  setView('all');
  await new Promise(z => setTimeout(z, 700));
  const tr = document.querySelector('tr[data-row-entity]');
  if (!tr) return '(bez řádků)';
  tr.focus();
  tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  const d = document.getElementById('quick-project-dialog');
  return d && d.open ? document.getElementById('rv-title').textContent : '(neotevřelo se)';
});
ok(soucet, /Projekty:/.test(zTab), 'z tabulky otevře P týž dialog', zTab);

await prohlizec.close();
process.exit(uzavri(soucet));
