// Panel úkolu v detailu: stav a termín nad atributy, ne mezi akčními tlačítky.
// Smysl je, že se se stavem a termínem dá pracovat bez otevírání editace.
import { novySoucet, ok, nadpis, otevriAplikaci, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Panel úkolu v detailu');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const poDnech = (n) => stranka.evaluate((n) => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}, n);

async function pripravDb() {
  const vcera = await poDnech(-2);
  await stranka.evaluate((vcera) => {
    db.entities = [
      newEntity({ id: 'u1', title: 'Úkol bez termínu', aspects: ['Task'],
        attributes: { status: 'todo', priority: 'high' } }),
      newEntity({ id: 'u2', title: 'Úkol s termínem', aspects: ['Task'],
        attributes: { status: 'in_progress', deadline: vcera } }),
      newEntity({ id: 'pozn', title: 'KANÁREK-POZNÁMKA', aspects: ['Note'], tags: ['t'] }),
      newEntity({ id: 'u3', title: 'KANÁREK-ÚKOL', aspects: ['Task'],
        attributes: { status: 'waiting', deadline: '2027-01-15' } })
    ];
    setView('detail', { detailId: 'u1', detailMode: 'read' });
  }, vcera);
  await stranka.waitForTimeout(500);
}
const kanarci = () => stranka.evaluate(() => {
  const p = findEntity('pozn'), u = findEntity('u3');
  return p.title + '|' + (p.tags || []).join(',') + '||' + u.attributes.status + '|' + u.attributes.deadline;
});
const KANARCI = 'KANÁREK-POZNÁMKA|t||waiting|2027-01-15';

const panel = () => stranka.evaluate(() => {
  const el = document.querySelector('.task-panel');
  if (!el) return null;
  const sel = document.getElementById('task-panel-stav');
  const btn = document.getElementById('task-panel-termin-btn');
  const dl = document.querySelector('dl.read-attrs');
  return {
    stav: sel ? sel.value : null,
    moznosti: sel ? Array.from(sel.options).map(o => o.value) : [],
    popisky: sel ? Array.from(sel.options).map(o => o.textContent) : [],
    termin: (el.querySelector('.task-panel-termin') || {}).textContent || '',
    terminTrida: (el.querySelector('.task-panel-termin') || {}).className || '',
    tlacitko: btn ? btn.textContent.trim() : null,
    vHlavicce: !!document.querySelector('.detail-header .task-panel'),
    predAtributy: !!(dl && (el.compareDocumentPosition(dl) & Node.DOCUMENT_POSITION_FOLLOWING)),
    atributy: Array.from(document.querySelectorAll('dl.read-attrs dt')).map(x => x.textContent),
    trida: el.className
  };
});

nadpis('Panel je nad atributy, ne v hlavičce mezi tlačítky');
await pripravDb();
let s = await panel();
ok(soucet, !!s, 'u úkolu je panel', s);
ok(soucet, s && s.vHlavicce === false,
  'stav úkolu už není v hlavičce mezi akčními tlačítky', s && s.vHlavicce);
ok(soucet, s && s.predAtributy === true,
  'panel stojí nad seznamem atributů', s && s.predAtributy);
ok(soucet, (await stranka.evaluate(() => !!document.querySelector('.task-quick-toggle'))) === false,
  'starý blok .task-quick-toggle z hlavičky zmizel');

nadpis('Stav: hodnoty z definice aspektu, ne z kopie seznamu');
const zAspektu = await stranka.evaluate(() => {
  const f = getAspect('Task').fields.find(x => x.key === 'status');
  return { hodnoty: f.options, popisky: f.options.map(o => f.optionLabels[o]) };
});
ok(soucet, s && s.moznosti.join(',') === zAspektu.hodnoty.join(','),
  'select nabízí přesně stavy z ASPECTS.Task', { v_panelu: s && s.moznosti, v_aspektu: zAspektu.hodnoty });
ok(soucet, s && s.popisky.join(',') === zAspektu.popisky.join(','),
  'a jejich popisky taky', { v_panelu: s && s.popisky, v_aspektu: zAspektu.popisky });
ok(soucet, s && s.stav === 'todo', 'předvybraný je aktuální stav úkolu', s && s.stav);

nadpis('Termín je vidět, i když žádný není');
ok(soucet, s && /bez termínu/.test(s.termin),
  'u úkolu bez termínu je napsáno „bez termínu"', s && s.termin);
ok(soucet, s && /Nastavit termín/.test(s.tlacitko),
  'a tlačítko nabízí termín nastavit', s && s.tlacitko);

nadpis('Stav ani termín se v atributech neopakují');
ok(soucet, s && s.atributy.indexOf('Stav') < 0 && s.atributy.indexOf('Termín') < 0,
  'seznam atributů stav a termín už nevypisuje', s && s.atributy);
ok(soucet, s && s.atributy.indexOf('Priorita') >= 0,
  'ostatní atributy tam zůstaly', s && s.atributy);
ok(soucet, (await stranka.evaluate(() =>
  /Termín/.test(renderAttributesReadOnly(findEntity('u2'))))) === true,
  'bez vynechání (prohlížeč, kde panel není) se termín pořád vypisuje');

nadpis('Úkol po termínu je v panelu poznat');
await otevriDetail(stranka, 'u2', 'read');
s = await panel();
ok(soucet, s && /Po termínu/.test(s.termin), 'u prošlého termínu je to napsané', s && s.termin);
ok(soucet, s && /dl-overdue/.test(s.terminTrida), 'a je obarvený', s && s.terminTrida);
ok(soucet, s && /Přeplánovat/.test(s.tlacitko), 'tlačítko nabízí přeplánování', s && s.tlacitko);

nadpis('Změna stavu přímo v panelu');
const pred = await stranka.evaluate(() => findEntity('u2').updated_at);
await stranka.selectOption('#task-panel-stav', 'done');
await stranka.waitForTimeout(600);
const poStavu = await stranka.evaluate(() => ({
  status: findEntity('u2').attributes.status,
  done_at: !!findEntity('u2').attributes.done_at,
  updated: findEntity('u2').updated_at,
  fokus: document.activeElement ? document.activeElement.id : '',
  trida: (document.querySelector('.task-panel') || {}).className || '' }));
ok(soucet, poStavu.status === 'done', 'stav se zapsal do dat', poStavu);
ok(soucet, poStavu.done_at === true, 'a doplnil se čas dokončení', poStavu);
ok(soucet, poStavu.updated !== pred, 'entitě se zvedlo updated_at');
ok(soucet, poStavu.fokus === 'task-panel-stav',
  'fokus zůstal na selectu, nespadl po překreslení na <body>', poStavu.fokus);
ok(soucet, /task-panel-hotovo/.test(poStavu.trida), 'hotový úkol je v panelu poznat', poStavu.trida);
ok(soucet, (await kanarci()) === KANARCI, 'kanárci: ostatní entity nedotčené');

nadpis('Návrat ze stavu hotovo smaže čas dokončení');
await stranka.selectOption('#task-panel-stav', 'todo');
await stranka.waitForTimeout(600);
ok(soucet, (await stranka.evaluate(() => ({
  s: findEntity('u2').attributes.status, d: findEntity('u2').attributes.done_at }))).d === undefined,
  'done_at se při návratu zruší');

nadpis('Přeplánování termínu přirozeným textem');
await stranka.click('#task-panel-termin-btn');
await stranka.waitForTimeout(400);
ok(soucet, await stranka.evaluate(() => {
  const d = document.getElementById('dialog-datum');
  return !!(d && d.open);
}), 'tlačítko otevře dialog na datum');
ok(soucet, /Úkol s termínem/.test(await stranka.evaluate(() =>
  document.getElementById('dialog-datum-popis').textContent)),
  'dialog říká, o který úkol jde');
await stranka.fill('#dialog-datum-text', 'za 3 dny');
await stranka.waitForTimeout(300);
const nahled = await stranka.evaluate(() => document.getElementById('dialog-datum-nahled').textContent);
ok(soucet, /→/.test(nahled), 'napsaný text se rovnou překládá na datum', nahled);
await stranka.evaluate(() => {
  const b = document.getElementById('datum-ok') || document.querySelector('#dialog-datum button.primary');
  b.click();
});
await stranka.waitForTimeout(600);
const za3 = await poDnech(3);
ok(soucet, (await stranka.evaluate(() => findEntity('u2').attributes.deadline)) === za3,
  'termín se nastavil podle textu (za 3 dny → ' + za3 + ')',
  await stranka.evaluate(() => findEntity('u2').attributes.deadline));
s = await panel();
ok(soucet, s && !/bez termínu/.test(s.termin), 'panel ukazuje nový termín', s && s.termin);
ok(soucet, (await kanarci()) === KANARCI, 'kanárci po přeplánování');

nadpis('Termín jde z panelu i vymazat');
await stranka.click('#task-panel-termin-btn');
await stranka.waitForTimeout(400);
const mazatVidet = await stranka.evaluate(() => {
  const b = document.getElementById('datum-vymazat');
  return !!(b && !b.hidden);
});
ok(soucet, mazatVidet, 'u úkolu s termínem je v dialogu i tlačítko Vymazat');
await stranka.evaluate(() => document.getElementById('datum-vymazat').click());
await stranka.waitForTimeout(600);
ok(soucet, (await stranka.evaluate(() => findEntity('u2').attributes.deadline)) === undefined,
  'termín se vymazal');
s = await panel();
ok(soucet, s && /bez termínu/.test(s.termin), 'a panel je zase bez termínu', s && s.termin);
ok(soucet, s && /Nastavit termín/.test(s.tlacitko), 'tlačítko se vrátilo na „Nastavit termín"');

nadpis('Zrušený dialog data nemění');
await stranka.click('#task-panel-termin-btn');
await stranka.waitForTimeout(400);
await stranka.evaluate(() => {
  const b = document.getElementById('datum-zrusit') || document.querySelector('#dialog-datum button:not(.primary)');
  if (b) b.click(); else document.getElementById('dialog-datum').close();
});
await stranka.waitForTimeout(400);
ok(soucet, (await stranka.evaluate(() => findEntity('u2').attributes.deadline)) === undefined,
  'po zrušení zůstal úkol bez termínu');
ok(soucet, (await kanarci()) === KANARCI, 'kanárci po zrušení');

nadpis('Entita bez aspektu Úkol panel nemá');
await otevriDetail(stranka, 'pozn', 'read');
ok(soucet, (await panel()) === null, 'u poznámky žádný panel úkolu není');

await prohlizec.close();
process.exit(uzavri(soucet));
