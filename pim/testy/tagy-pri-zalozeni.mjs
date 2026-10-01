// Nabídka tagů při zakládání entity u schůzky a u projektu.
//
// Pravidla: tagy té entity (schůzky/projektu) jsou PŘEDZAŠKRTNUTÉ, tagy z věcí,
// které na ni mají vazbu, se jen nabízejí. Nic, co není zaškrtnuté, se nesmí
// na novou entitu dostat — a kolik je zaškrtnuté, musí být vidět i u sbaleného
// bloku, jinak by se tagy přidávaly bez vědomí uživatele.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Tagy při zakládání entity');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

async function priprav() {
  await nasypej(stranka, [
    { id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['projektovy', 'rok2026'] },
    { id: 'sch', title: 'Porada', aspects: ['Event'], tags: ['porada', 'projektovy'],
      attributes: { start: '2026-03-12T09:00' },
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'u1', title: 'Ukol jedna', aspects: ['Task'], tags: ['dodavatele'],
      attributes: { status: 'todo' }, links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'd1', title: 'Dokument', aspects: ['Document'], tags: ['smlouvy'],
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'kanarek', title: 'Kanarek mimo', aspects: ['Note'], tags: ['kanarek-tag'] }
  ]);
  await stranka.evaluate(() => {
    findEntity('sch').links.push({ to: 'u1', type: 'mentions', note: '' });
  });
}

const otevriPridatUkol = () => stranka.evaluate(() => {
  const d = Array.from(document.querySelectorAll('details'))
    .find(x => x.querySelector('summary') && /Přidat úkol/.test(x.querySelector('summary').textContent));
  if (d) d.open = true;
}).then(() => stranka.waitForTimeout(300));

const nabidka = (trida) => stranka.evaluate((trida) =>
  Array.from(document.querySelectorAll('input.' + trida))
    .map(c => ({ tag: c.dataset.tag, zaskrtnuto: c.checked })), trida);

const zaskrtni = (trida, tag, hodnota) => stranka.evaluate(({ trida, tag, hodnota }) => {
  const cb = Array.from(document.querySelectorAll('input.' + trida)).find(c => c.dataset.tag === tag);
  if (!cb) throw new Error('tag nenalezen: ' + tag);
  cb.checked = hodnota;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
}, { trida, tag, hodnota }).then(() => stranka.waitForTimeout(150));

const tagyEntity = (nazev) => stranka.evaluate((nazev) => {
  const e = db.entities.find(x => x.title === nazev);
  return e ? (e.tags || []).join(',') : null;
}, nazev);

nadpis('Schůzka: co se nabízí');
await priprav();
await otevriDetail(stranka, 'sch');
await otevriPridatUkol();
const uSchuzky = await nabidka('ev-new-task-tag');
ok(soucet, uSchuzky.length > 0, 'u nového úkolu je nabídka tagů', uSchuzky);
ok(soucet, uSchuzky.filter(x => x.zaskrtnuto).map(x => x.tag).sort().join(',') === 'porada,projektovy',
  'předzaškrtnuté jsou tagy schůzky', uSchuzky);
ok(soucet, uSchuzky.some(x => x.tag === 'rok2026' && !x.zaskrtnuto),
  'tag z projektu (má vazbu na schůzku) se nabízí, ale zaškrtnutý není', uSchuzky);
ok(soucet, uSchuzky.some(x => x.tag === 'dodavatele' && !x.zaskrtnuto),
  'tag z úkolu zmíněného na schůzce se nabízí taky', uSchuzky);
ok(soucet, !uSchuzky.some(x => x.tag === 'smlouvy'),
  'tag entity, která na schůzku vazbu NEMÁ, se nenabízí', uSchuzky);
ok(soucet, !uSchuzky.some(x => x.tag === 'kanarek-tag'),
  'tag úplně nesouvisející entity už vůbec ne', uSchuzky);
ok(soucet, uSchuzky[0].tag === 'projektovy' || uSchuzky[0].tag === 'porada',
  'vlastní tagy schůzky jsou v seznamu první', uSchuzky.map(x => x.tag));
const nabidkaEnt = await nabidka('ev-new-ent-tag');
ok(soucet, nabidkaEnt.length === uSchuzky.length,
  'stejnou nabídku má i formulář Nová entita', nabidkaEnt);

nadpis('Schůzka: počítadlo jde s tím, co je zaškrtnuté');
const pocet = () => stranka.evaluate(() =>
  document.querySelector('[data-tag-pocet-pro="ev-new-task-tag"]').textContent);
ok(soucet, (await pocet()) === '2 z 4', 'počítadlo ukazuje 2 ze 4', await pocet());
await zaskrtni('ev-new-task-tag', 'dodavatele', true);
ok(soucet, (await pocet()) === '3 z 4', 'po zaškrtnutí se zvedlo na 3 ze 4', await pocet());
await zaskrtni('ev-new-task-tag', 'dodavatele', false);
await zaskrtni('ev-new-task-tag', 'porada', false);
ok(soucet, (await pocet()) === '1 z 4', 'a po odškrtnutí kleslo', await pocet());

nadpis('Schůzka: nový úkol dostane právě zaškrtnuté tagy');
await priprav();
await otevriDetail(stranka, 'sch');
await otevriPridatUkol();
await zaskrtni('ev-new-task-tag', 'porada', false);     // vlastní tag odškrtnout
await zaskrtni('ev-new-task-tag', 'dodavatele', true);  // nabízený zaškrtnout
await stranka.evaluate(() => {
  document.getElementById('ev-new-task-title').value = 'Novy ukol ze schuzky';
  document.getElementById('ev-add-new-task').click();
});
await stranka.waitForTimeout(700);
const tagyUkolu = await tagyEntity('Novy ukol ze schuzky');
ok(soucet, tagyUkolu === 'projektovy,dodavatele',
  'úkol má jen zaškrtnuté tagy — odškrtnutý „porada" tam není', tagyUkolu);
ok(soucet, (await tagyEntity('Porada')) === 'porada,projektovy',
  'schůzce samotné se tagy nezměnily (kanárek)');
ok(soucet, (await tagyEntity('Kanarek mimo')) === 'kanarek-tag',
  'nesouvisející entita beze změny (kanárek)');

nadpis('Schůzka: nová entita dostane zaškrtnuté tagy');
await priprav();
await otevriDetail(stranka, 'sch');
await otevriPridatUkol();
await zaskrtni('ev-new-ent-tag', 'rok2026', true);
await stranka.evaluate(() => {
  document.getElementById('ev-new-ent-title').value = 'Nova entita ze schuzky';
  document.getElementById('ev-add-new-ent').click();
});
await stranka.waitForTimeout(700);
ok(soucet, (await tagyEntity('Nova entita ze schuzky')) === 'projektovy,porada,rok2026',
  'nová entita má tagy schůzky i doplněný z nabídky', await tagyEntity('Nova entita ze schuzky'));

nadpis('Projekt: rozbalovací blok, sbalený, s počtem v hlavičce');
await priprav();
await otevriDetail(stranka, 'pa');
const uProjektu = await stranka.evaluate(() => {
  const d = document.querySelector('.project-quick-task details.tag-nabidka');
  return {
    je: !!d,
    sbaleno: d ? !d.open : null,
    souhrn: d ? d.querySelector('summary').textContent.replace(/\s+/g, ' ').trim() : null,
    tagy: Array.from(document.querySelectorAll('input.proj-task-tag'))
      .map(c => c.dataset.tag + (c.checked ? '✓' : ''))
  };
});
ok(soucet, uProjektu.je, 'u projektu je nabídka tagů jako rozbalovací blok');
ok(soucet, uProjektu.sbaleno === true, 'a je sbalený');
ok(soucet, /2 z 5 zaškrtnuto/.test(uProjektu.souhrn || ''),
  've sbalené hlavičce je vidět, kolik tagů se použije', uProjektu.souhrn);
ok(soucet, uProjektu.tagy.slice(0, 2).join(',') === 'projektovy✓,rok2026✓',
  'předzaškrtnuté jsou tagy projektu a jsou první', uProjektu.tagy);
ok(soucet, uProjektu.tagy.some(t => t === 'smlouvy') && uProjektu.tagy.some(t => t === 'dodavatele'),
  'tagy entit z projektu se nabízejí', uProjektu.tagy);
ok(soucet, !uProjektu.tagy.some(t => t.startsWith('kanarek-tag')),
  'tag nesouvisející entity se nenabízí', uProjektu.tagy);

nadpis('Projekt: nový úkol i nová entita dostanou zaškrtnuté tagy');
await zaskrtni('proj-task-tag', 'rok2026', false);
await zaskrtni('proj-task-tag', 'smlouvy', true);
await stranka.evaluate(() => {
  document.getElementById('proj-quick-task-title').value = 'Novy ukol v projektu';
  document.getElementById('proj-quick-task-add').click();
});
await stranka.waitForTimeout(700);
ok(soucet, (await tagyEntity('Novy ukol v projektu')) === 'projektovy,smlouvy',
  'úkol v projektu má právě zaškrtnuté tagy', await tagyEntity('Novy ukol v projektu'));

await priprav();
await otevriDetail(stranka, 'pa');
await zaskrtni('proj-ent-tag', 'dodavatele', true);
await stranka.evaluate(() => {
  document.getElementById('proj-quick-ent-title').value = 'Nova entita v projektu';
  document.getElementById('proj-quick-ent-add').click();
});
await stranka.waitForTimeout(700);
ok(soucet, (await tagyEntity('Nova entita v projektu')) === 'projektovy,rok2026,dodavatele',
  'entita v projektu má tagy projektu i doplněný z nabídky', await tagyEntity('Nova entita v projektu'));
ok(soucet, (await tagyEntity('Projekt A')) === 'projektovy,rok2026',
  'projektu samotnému se tagy nezměnily (kanárek)');
ok(soucet, (await tagyEntity('Dokument')) === 'smlouvy',
  'ostatní entity projektu beze změny (kanárek)');

nadpis('Bez tagů v okolí se nic nenabízí');
await nasypej(stranka, [
  { id: 'p2', title: 'Projekt bez tagu', aspects: ['Project'], tags: [] },
  { id: 'x1', title: 'Cast bez tagu', aspects: ['Task'], tags: [], attributes: { status: 'todo' },
    links: [{ to: 'p2', type: 'partOf', note: '' }] }
]);
await otevriDetail(stranka, 'p2');
const prazdno = await stranka.evaluate(() => ({
  blok: !!document.querySelector('.project-quick-task details.tag-nabidka'),
  tlacitko: !!document.getElementById('proj-quick-task-add')
}));
ok(soucet, prazdno.blok === false, 'když nikde v okolí není tag, blok se nezobrazí', prazdno);
ok(soucet, prazdno.tlacitko === true, 'ale přidávání funguje dál', prazdno);
await stranka.evaluate(() => {
  document.getElementById('proj-quick-task-title').value = 'Ukol bez tagu';
  document.getElementById('proj-quick-task-add').click();
});
await stranka.waitForTimeout(700);
ok(soucet, (await tagyEntity('Ukol bez tagu')) === '', 'a úkol vznikne bez tagů');

nadpis('Zaškrtávátka v kartě u schůzky se neroztahují na celou šířku');
await priprav();
await otevriDetail(stranka, 'sch');
await otevriPridatUkol();
const sirky = await stranka.evaluate(() => {
  const karta = document.querySelector('.event-tasks-add-card');
  const cb = karta.querySelector('input[type="checkbox"]');
  const txt = karta.querySelector('input[type="text"]');
  return { cb: Math.round(cb.getBoundingClientRect().width), txt: Math.round(txt.getBoundingClientRect().width) };
});
ok(soucet, sirky.cb < 40 && sirky.txt > 100,
  'zaškrtávátko má svou šířku, textové pole celou (dřív byla obě přes celou kartu)', sirky);

await prohlizec.close();
process.exit(uzavri(soucet));
