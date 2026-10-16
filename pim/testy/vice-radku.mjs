// Víc řádků v názvu = víc položek. Každý řádek projde týmž trychtýřem jako
// jediné zadání — termín z názvu, pravidlo úkol/událost, markdown odkaz —
// a společné nastavení (projekt, tagy, aspekt) platí pro všechny.
//
// Políčka názvu proto musí být <textarea>: <input type="text"> konce řádků
// zahazuje už při zápisu hodnoty, takže by se víceřádkový text slil do jednoho.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const soucet = novySoucet('Víc řádků = víc položek');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const poDnech = (n) => stranka.evaluate((n) => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}, n);
const kDni = (dow) => stranka.evaluate((dow) => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  let diff = dow - d.getDay(); if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}, dow);
const zitra = await poDnech(1);
const utery = await kDni(2);

// Vrátí nově vzniklé entity (všechno kromě zadaných id).
const nove = (krome) => stranka.evaluate((krome) => db.entities
  .filter(e => krome.indexOf(e.id) < 0)
  .map(e => ({ title: e.title, aspekty: (e.aspects || []).join(','),
    deadline: (e.attributes || {}).deadline || '', start: (e.attributes || {}).start || '',
    url: (e.attributes || {}).url || '',
    tagy: (e.tags || []).join('|'),
    vazby: (e.links || []).map(l => l.type + '→' + l.to).sort().join(',') })), krome);
const toastText = () => stranka.evaluate(() => {
  const t = document.querySelector('.toast'); return t ? t.textContent : '';
});

nadpis('Políčka názvu jsou textarea, ne input');
await stranka.evaluate(() => {
  db.entities = [
    newEntity({ id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['projektovy'] }),
    newEntity({ id: 'sch', title: 'Porada', aspects: ['Event'],
      attributes: { start: '2027-01-05T09:00' }, links: [{ to: 'pa', type: 'partOf' }] }),
    newEntity({ id: 'kan', title: 'KANÁREK', aspects: ['Note'], tags: ['kanarek'] })
  ];
  setView('dashboard'); render();
});
await stranka.waitForTimeout(400);
await stranka.click('#btn-quick-task');
await stranka.waitForTimeout(400);
ok(soucet, (await stranka.evaluate(() => document.getElementById('qt-title').tagName)) === 'TEXTAREA',
  'pole v dialogu Rychlý úkol je textarea');
ok(soucet, await stranka.evaluate(() => {
  const t = document.getElementById('qt-title');
  t.value = 'a\nb';
  return t.value === 'a\nb';
}), 'a opravdu udrží konce řádků (input by je zahodil)');

nadpis('Rychlý úkol: tři řádky, každý vyhodnocený zvlášť, všechny do projektu');
await stranka.evaluate(() => { document.getElementById('qt-title').value =
  'odeslat fakturu zítra\nPorada úterý 10:00\n   \nzavolat Petrovi'; });
await stranka.selectOption('#qt-project', 'pa');
await stranka.evaluate(() => doQuickTaskSave());
await stranka.waitForTimeout(600);
let n = await nove(['pa', 'sch', 'kan']);
ok(soucet, n.length === 3, 'ze čtyř řádků (jeden prázdný) vznikly tři položky', n.map(x => x.title));
ok(soucet, n[0].title === 'odeslat fakturu' && n[0].deadline === zitra,
  'první řádek: termín rozpoznán a z názvu vyříznut', n[0]);
ok(soucet, n[1].aspekty === 'Event' && n[1].start === utery + 'T10:00',
  'druhý řádek s časem dal událost — pravidlo platí i po řádcích', n[1]);
ok(soucet, n[2].title === 'zavolat Petrovi' && !n[2].deadline,
  'třetí řádek bez data zůstal obyčejným úkolem', n[2]);
ok(soucet, n.every(x => x.vazby === 'partOf→pa'),
  'zvolený projekt dostaly všechny tři', n.map(x => x.vazby));
ok(soucet, /3 řádk/.test(await toastText()), 'hláška je jedna souhrnná', await toastText());

nadpis('Jeden řádek se chová přesně jako dřív');
await stranka.evaluate(() => {
  db.entities = db.entities.filter(e => ['pa', 'sch', 'kan'].indexOf(e.id) >= 0);
  render();
});
await stranka.click('#btn-quick-task');
await stranka.waitForTimeout(400);
await stranka.evaluate(() => { document.getElementById('qt-title').value = 'jediný úkol zítra'; });
await stranka.evaluate(() => doQuickTaskSave());
await stranka.waitForTimeout(500);
n = await nove(['pa', 'sch', 'kan']);
ok(soucet, n.length === 1 && n[0].deadline === zitra, 'vznikla jedna položka', n);
ok(soucet, /Úkol „jediný úkol" vytvořen/.test(await toastText()),
  'a hláška je původní, ne souhrnná', await toastText());

nadpis('+ Nový úkol u projektu: řádky + společné tagy');
const uProjektu = await stranka.evaluate(async () => {
  db.entities = db.entities.filter(e => ['pa', 'sch', 'kan'].indexOf(e.id) >= 0);
  setView('detail', { detailId: 'pa', detailMode: 'read' });
  await new Promise(z => setTimeout(z, 700));
  const t = document.getElementById('proj-quick-task-title');
  if (!t) return { chyba: 'formulář není' };
  const jeTextarea = t.tagName === 'TEXTAREA';
  t.value = 'první úkol do pátku\ndruhý úkol';
  const cb = document.querySelector('.proj-task-tag input[type=checkbox]');
  if (cb) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); }
  document.getElementById('proj-quick-task-add').click();
  await new Promise(z => setTimeout(z, 600));
  return { jeTextarea, prazdne: document.getElementById('proj-quick-task-title').value === '' };
});
ok(soucet, uProjektu.jeTextarea === true, 'pole u projektu je textarea', uProjektu);
n = await nove(['pa', 'sch', 'kan']);
ok(soucet, n.length === 2, 'vznikly dva úkoly', n.map(x => x.title));
ok(soucet, n[0].deadline && n[0].title === 'první úkol',
  'termín „do pátku" se rozpoznal jen u svého řádku', n[0]);
ok(soucet, !n[1].deadline, 'druhý řádek termín nedostal', n[1]);
ok(soucet, n.every(x => x.tagy === 'projektovy'),
  'zaškrtnuté tagy dostaly oba', n.map(x => x.tagy));
ok(soucet, n.every(x => x.vazby === 'partOf→pa'), 'a oba patří do projektu', n.map(x => x.vazby));
ok(soucet, uProjektu.prazdne === true, 'políčko se po přidání vyprázdnilo');

nadpis('+ Nová entita u projektu: jeden aspekt, každý řádek zvlášť');
await stranka.evaluate(async () => {
  db.entities = db.entities.filter(e => ['pa', 'sch', 'kan'].indexOf(e.id) >= 0);
  setView('detail', { detailId: 'pa', detailMode: 'read' });
  await new Promise(z => setTimeout(z, 700));
  document.getElementById('proj-quick-ent-title').value =
    'Smlouva\n[EGdílna](https://egdilna.cz)\nZápis 5.6.2027';
  document.getElementById('proj-quick-ent-aspect').value = 'Document';
  document.getElementById('proj-quick-ent-add').click();
  await new Promise(z => setTimeout(z, 600));
});
n = await nove(['pa', 'sch', 'kan']);
ok(soucet, n.length === 3, 'vznikly tři entity', n.map(x => x.title));
ok(soucet, n.every(x => /Document/.test(x.aspekty)),
  'všechny mají zvolený aspekt', n.map(x => x.aspekty));
ok(soucet, n[1].title === 'EGdílna' && /Bookmark/.test(n[1].aspekty) && n[1].url === 'https://egdilna.cz',
  'řádek s markdown odkazem se stal záložkou — ostatní ne', n[1]);
ok(soucet, !/Bookmark/.test(n[0].aspekty) && !/Bookmark/.test(n[2].aspekty),
  'sousední řádky zůstaly beze změny', [n[0].aspekty, n[2].aspekty]);
ok(soucet, n[2].title === 'Zápis 5.6.2027',
  'u aspektu bez pole na datum zůstává datum v názvu (nemělo by se kam uložit)', n[2]);
ok(soucet, n.every(x => x.vazby === 'partOf→pa'), 'všechny jdou do projektu', n.map(x => x.vazby));

nadpis('+ Přidat úkol u schůzky');
await stranka.evaluate(async () => {
  db.entities = db.entities.filter(e => ['pa', 'sch', 'kan'].indexOf(e.id) >= 0);
  setView('detail', { detailId: 'sch', detailMode: 'read' });
  await new Promise(z => setTimeout(z, 800));
  document.getElementById('ev-new-task-title').value = 'úkol A zítra\núkol B';
  document.getElementById('ev-add-new-task').click();
  await new Promise(z => setTimeout(z, 700));
});
n = await nove(['pa', 'sch', 'kan']);
ok(soucet, n.length === 2, 'vznikly dva úkoly schůzky', n.map(x => x.title));
ok(soucet, n[0].deadline === zitra && !n[1].deadline, 'termín jen u svého řádku', n);
ok(soucet, n.every(x => x.vazby === 'partOf→pa'),
  'oba zdědily projekt schůzky', n.map(x => x.vazby));
ok(soucet, await stranka.evaluate(() => {
  const s = findEntity('sch');
  return (s.links || []).filter(l => l.type === 'mentions').length === 2;
}), 'a schůzka oba zmiňuje');

nadpis('+ Nová entita u schůzky');
await stranka.evaluate(async () => {
  const t = document.getElementById('ev-new-ent-title');
  t.value = 'Prezentace\nZápis';
  document.getElementById('ev-new-ent-aspect').value = 'Note';
  document.getElementById('ev-add-new-ent').click();
  await new Promise(z => setTimeout(z, 700));
});
const poEntitach = await nove(['pa', 'sch', 'kan']);
const jenEntity = poEntitach.filter(x => x.title === 'Prezentace' || x.title === 'Zápis');
ok(soucet, jenEntity.length === 2, 'vznikly dvě entity', jenEntity.map(x => x.title));
ok(soucet, jenEntity.every(x => /mentions→sch/.test(x.vazby) && /partOf→pa/.test(x.vazby)),
  'obě jsou zmíněné schůzkou i v jejím projektu', jenEntity.map(x => x.vazby));

nadpis('Kanárek: entita mimo hru zůstala nedotčená');
ok(soucet, await stranka.evaluate(() => {
  const k = findEntity('kan');
  return k && k.title === 'KANÁREK' && (k.tags || []).join('|') === 'kanarek' && (k.links || []).length === 0;
}), 'KANÁREK má pořád svůj název, tagy a žádné vazby');

nadpis('Samé prázdné řádky nevyrobí nic');
const prazdne = await stranka.evaluate(async () => {
  const pred = db.entities.length;
  const r = zalozZKazdehoRadku('   \n\n  ', () => { throw new Error('nemělo se volat'); });
  return { pocet: r.pocet, zmena: db.entities.length - pred };
});
ok(soucet, prazdne.pocet === 0 && prazdne.zmena === 0,
  'z prázdných řádků nevznikne žádná entita', prazdne);

await prohlizec.close();
process.exit(uzavri(soucet));
